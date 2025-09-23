<script setup lang="ts">
import { inject, onMounted, ref, watch, type Ref } from "vue";

import type {
  Game_Shot_Data,
  Game_Shot_Data_Submit,
  Game_Shot_Delete,
  GameStatus,
  Hole_Data,
} from "../../../../types/game";
import { useRouter } from "vue-router";

import gameShot from "./game-shot.vue";
import type { THoles } from "../../../../types/course";
import { routeTo } from "../../../../router";
import { useFetch } from "../../../../api/authFetch";
import type { IAuthResponse } from "../../../../types/Iauth";

const router = useRouter();

const props = defineProps<{
  hole_data: Hole_Data | null | undefined;
  current_shots: Game_Shot_Data_Submit[];
  edit_state: boolean;
  // updateNewShot: (shot_data: Game_Shot_Data, hole: number) => void;
}>();

const current_hole_state = inject<Ref<number, number>>("current_hole_state");
const game_hole_state = inject<Ref<number, number>>("game_hole_state");
const game_status = inject<Ref<GameStatus, GameStatus>>("game_status");

// const deleter = inject<{
//   deleteGameShot: (index: number) => void;
// }>("delete_shot");

const deleter = inject<((index: number) => void) | undefined>("delete_shot");

watch(
  () => props.current_shots,
  () => {
    // if (props.shots) {
    //   holeData.value = props.shots;
    // }
    if (props.current_shots) {
      shotCount.value = props.current_shots.length + 1;
    }
    console.log("update hole data for shot component: ", props.current_shots);
  }
);

// let holeData = ref<Hole_Data>();

// drop downs
let shotDrop = ref<boolean>(true);
// drop down for stats for shot to add
let addShotDrop = ref<boolean>(false);

// value for current shot
let currentShot = ref<number>(0);

let displayShot = ref<boolean>(true);

// current shot count
let shotCount = ref<number>(1);

// course selected to create game on
function dropDown(type: string) {
  if (type === "addShot") {
    addShotDrop.value = !addShotDrop.value;
  } else if (type === "currentShot") {
    displayShot.value = !displayShot.value;
  }
  console.log("dispaly shoht: ", displayShot.value);
}

// change current shot
function changeCurrentShot(index: number) {
  if (props.current_shots !== undefined) {
    //
    // if (!displayShot.value) {
    //   dropDown("currentShot");

    // }
    // click on current shot view to close it
    if (currentShot.value === index) {
      console.log("changing current shot displayer...");
      dropDown("currentShot");
    } else {
      displayShot.value = true;
    }

    currentShot.value = index;
  }
}

// game-shot passes new shot data for this component...
function dropAddShotMenu() {
  // we call hole component from here to update
  if (props.hole_data?.hole_number) {
    dropDown("addShot");
    // props.updateNewShot(shot_data, props.shots?.hole_number - 1);
  }
}

// delete a shot
async function deleteShot() {
  try {
    const shot = props.current_shots[currentShot.value];
    const shot_body_delete: Game_Shot_Delete = {
      hole_id: shot.hole_id,
      user_id: shot.user_id,
      game_id: shot.game_id,
      shot_count: shot.shot_count,
    };

    const res = await useFetch<IAuthResponse, Game_Shot_Delete>(
      `/data/game-shot`,
      "DELETE",
      shot_body_delete
    );

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getUserDAta res, is undefined");
    }
    // good response...
    else {
      console.log("Shot was successfully deleted !");

      currentShot;
      deleter?.(currentShot.value);
      // decrement current shot count
      if (currentShot.value > 0) {
        currentShot.value = currentShot.value - 1;
      }

      // now we set current hole to next hole, and we do a full data grab to update everything...
    }
  } catch (error) {
    console.log("error in delete shot: ", error);
  }
}

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
  console.log("SHOT comp: ", props.hole_data);

  console.log("current shots: ", props.current_shots);
  if (props.current_shots) {
    shotCount.value = props.current_shots.length + 1;
  }

  // if (props.shots) {
  //   holeData.value = props.shots!;
  // }
});
</script>

<template>
  <section class="">
    <!-- <div class="flex justify-between items-center mb-3 border-b pb-1">
      <h4 class="text-2xl">Shots</h4>
    </div> -->
    <div class="flex justify-between">
      <h4 v-if="props.current_shots.length === 0" class="text-2xl mb-1">
        No Shots Added...
      </h4>

      <div
        v-if="
          (props.hole_data?.hole_number === game_hole_state || edit_state) &&
          game_status === 'IN-PROGRESS'
        "
        @click="dropDown('addShot')"
        class="flex justify-between items-center p-2 border rounded border-0.5 border-gray-200">
        <!-- <h4 class="text-2xl mb-1"></h4> -->
        <i v-if="!addShotDrop" class="bi bi-plus"></i>
        <i v-if="addShotDrop" class="bi bi-dash"></i>
      </div>
    </div>

    <!-- display list of shots (block 1, block 2, block 3) -->
    <div
      v-if="props.current_shots?.length > 0"
      class="grid grid-flow-col auto-cols-min overflow-x-scroll rounded border border-0.5 border-gray-200">
      <div
        v-for="(value, index) in props.current_shots"
        class="min-w-[100px] text-center p-1"
        @click="changeCurrentShot(index)"
        :class="{ 'bg-gray-400': currentShot === index }">
        Shot {{ value.shot_count }}
      </div>
    </div>

    <!-- display whatever shot data selected here... -->
    <section
      v-if="props.current_shots?.length > 0 && displayShot"
      class="p-1 border rounded border-0.5 border-gray-200 hover:cursor-pointer">
      <div class="flex gap-5">
        <h4>{{ props.current_shots[currentShot].shot_count }}</h4>
        <h4>{{ props.current_shots[currentShot].club_type }}</h4>
      </div>

      <div @click="dropDown('currentShot')">
        <h4>{{ props.current_shots[currentShot].land_type }}</h4>
      </div>

      <div
        v-if="
          props.hole_data?.hole_number === game_hole_state &&
          game_status === 'IN-PROGRESS'
        ">
        <button class="p-1 bg-red-800 rounded" @click="deleteShot()">
          Delete
        </button>
      </div>
    </section>

    <!-- shots drop down -->
    <section
      v-if="
        props.edit_state || props.hole_data?.hole_number === game_hole_state
      "
      class="">
      <div v-if="addShotDrop" class="border border-0.5">
        <gameShot
          :closeAddShotMenu="dropAddShotMenu"
          :hole_id="props.hole_data?.id"
          :user_id="props.hole_data?.user_id"
          :game_id="props.hole_data?.game_id"
          :shot_count="shotCount" />
      </div>
    </section>

    <!-- current holes stats ??? -->
  </section>
</template>
