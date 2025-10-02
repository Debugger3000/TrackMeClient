<script setup lang="ts">
import { inject, onMounted, ref, watch, type Ref } from "vue";

import type {
  Game_Shot_Data_Submit,
  Game_Shot_Delete,
  GameStatus,
  Hole_Data,
} from "../../../../types/game";
import { useRouter } from "vue-router";

import gameShot from "./game-shot.vue";
// import type { THoles } from "../../../../types/course";
import { routeTo } from "../../../../router";
import { useFetch } from "../../../../api/authFetch";
import type { IAuthResponse } from "../../../../types/Iauth";
import gridCard from "../helpers/grid-card.vue";

const router = useRouter();

const props = defineProps<{
  hole_data: Hole_Data | null | undefined;
  current_shots: Game_Shot_Data_Submit[];
  edit_state: boolean;
  // updateNewShot: (shot_data: Game_Shot_Data, hole: number) => void;
}>();

// const current_hole_state = inject<Ref<number, number>>("current_hole_state");
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
// let shotDrop = ref<boolean>(true);
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

function switchDeletePopUp() {
  delete_popup.value = !delete_popup.value;
}

async function deletePopUp(result: Boolean) {
  if (result) {
    await deleteShot();
    delete_popup.value = !delete_popup.value;
  } else {
    delete_popup.value = !delete_popup.value;
  }
}

let delete_popup = ref<boolean>(false);
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

<style src="./mainstyles.css"></style>

<template>
  <section class="mt-3">
    <!-- <div class="flex justify-between items-center mb-3 border-b pb-1">
      <h4 class="text-2xl">Shots</h4>
    </div> -->
    <div v-if="props.current_shots.length === 0"  class="flex justify-between bg-color-card card-main-border p-2">
      <h4 class="text-2xl mb-1">
        No Shots recorded
      </h4>
    </div>

    <!-- display list of shots (block 1, block 2, block 3) -->
    <!-- grid grid-flow-col auto-cols-min overflow-x-scroll rounded border border-0.5 border-gray-200 -->
    <!-- min-w-[100px] text-center p-1 -->
    <div v-if="props.current_shots?.length > 0" class="flex justify-between p-2">
      <div class="flex gap-1 items-center">
        <div
          v-for="(value, index) in props.current_shots"
          class=""
          id="shots-circles"
          @click="changeCurrentShot(index)"
          :class="{
            'bg-01': currentShot === index,
            'text-white': currentShot === index,
            ' bg-color-card card-main-border': currentShot !== index,
            'color-01': currentShot !== index
          }">
          {{ value.shot_count }}
        </div>
      </div>
    </div>

    <!-- <div class="grid grid-cols-3 mx-5 gap-5 mt-3">
          <div class="flex flex-col items-center p-2 rounded border shadow-lg">
            <h4 class="font-semibold text-color-blue-800">Score</h4>
            <h4 class="text-2xl">{{ current_hole_score }}</h4>
          </div> -->
    <!-- display whatever shot data selected here... -->
    <section
      v-if="props.current_shots?.length > 0 && displayShot"
      class="mt-1 hover:cursor-pointer relative bg-color-card card-main-border p-2">
      <div class="flex justify-between items-center mb-2">
        <h4 class="text-sub-header color-01">
          Shot {{ props.current_shots[currentShot].shot_count }}
        </h4>

        <!-- delete shot button -->
        <div
          class="flex items-center relative"
          v-if="
            props.hole_data?.hole_number === game_hole_state &&
            game_status === 'IN-PROGRESS'
          ">
          <button class="rounded" @click="switchDeletePopUp()">
            <i class="bi bi-trash text-red-800 rounded-xl text-2xl"></i>
          </button>
        </div>
      </div>

      <!-- delete pop up to confirm deletion -->
      <div
        v-if="delete_popup"
        class="absolute inset-0 flex justify-center items-center">
        <div
          class="flex flex-col justify-center p-1 items-center w-[70%] h-[70%] opacity-0.7 bg-white border border-gray-300 shadow-md z-90">
          <h4 class="text-center">
            Are you sure you want to delete shot
            {{ props.current_shots[currentShot].shot_count }} ?
          </h4>
          <div class="flex gap-5 items-center mt-3">
            <button
              class="bg-green-600 p-2 rounded text-white"
              @click="deletePopUp(true)">
              Yes
            </button>
            <button
              class="bg-red-600 p-2 rounded text-white"
              @click="deletePopUp(false)">
              No
            </button>
          </div>
        </div>
      </div>

      <!-- section for shot details -->
      <div class="grid grid-cols-3 gap-5">
        <gridCard class="inner-bg" title="Club" :data_point="props.current_shots[currentShot].club_type!"/>
        <gridCard class="inner-bg"  title="Lie" :data_point="props.current_shots[currentShot].land_type!"/>
        <gridCard class="inner-bg"  title="Contact" :data_point="props.current_shots[currentShot].shot_contact!"/>
        <gridCard class="inner-bg"  title="Path" :data_point="props.current_shots[currentShot].shot_path!"/>
        <gridCard class="inner-bg"  title="Yards" :data_point="props.current_shots[currentShot].yards!"/>
        <gridCard class="inner-bg"  title="Metres" :data_point="props.current_shots[currentShot].metres!"/>
      </div>
    </section>

    <!-- game shot down -->
    <section
      v-if="
        (props.edit_state ||
          props.hole_data?.hole_number === game_hole_state) &&
        game_status === 'IN-PROGRESS'
      "
      class="mt-3 p-2 bg-color-card card-main-border">
      <div class="flex justify-between">
        <h4 class="section-header">Add Shot</h4>

        <div
          v-if="
            (props.hole_data?.hole_number === game_hole_state || edit_state) &&
            game_status === 'IN-PROGRESS'
          "
          @click="dropDown('addShot')"
          class="flex justify-between items-center">
          <!-- <h4 class="text-2xl mb-1"></h4> -->
          <i v-if="!addShotDrop" class="bi bi-plus text-3xl"></i>
          <i v-if="addShotDrop" class="bi bi-dash text-3xl"></i>
        </div>
      </div>

      <div v-if="addShotDrop" class="border border-0.5 mt-5">
        <gameShot
          :closeAddShotMenu="dropAddShotMenu"
          :hole_id="props.hole_data?.id"
          :user_id="props.hole_data?.user_id"
          :game_id="props.hole_data?.game_id"
          :shot_count="shotCount" />
      </div>
    </section>
  </section>
</template>
