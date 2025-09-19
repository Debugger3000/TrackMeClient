<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import type { Game_Shot_Data, Hole_Data } from "../../../../types/game";
import { useRouter } from "vue-router";

import gameShot from "./game-shot.vue";
import type { THoles } from "../../../../types/course";

// const router = useRouter();

const props = defineProps<{
  shots: Hole_Data | null | undefined;
  current_shots: Game_Shot_Data[];
  updateNewShot: (shot_data: Game_Shot_Data, hole: number) => void;
}>();

watch(
  () => props.shots,
  () => {
    if (props.shots) {
      holeData.value = props.shots;
    }

    console.log("update hole data for shot component: ", holeData.value);
  }
);

let holeData = ref<Hole_Data>();

// drop downs
let shotDrop = ref<boolean>(true);
// drop down for stats for shot to add
let addShotDrop = ref<boolean>(false);

// value for current shot
let currentShot = ref<Game_Shot_Data>();

// current shot count
let shotCount = ref<number>(1);

// course selected to create game on
function dropDown(type: string) {
  if (type === "addShot") {
    addShotDrop.value = !addShotDrop.value;
  }
}

// change curren shot
function changeCurrentShot(count: number) {
  if (props.shots?.hole_shot_data) {
    currentShot.value = props.shots?.hole_shot_data[count];
  }
}

// form for hole data
const holeForm = ref({
  puttCount: 0,
  score: 0,
  notes: "",
  hole_shot_data: [],
});

// game-shot passes new shot data for this component...
function shotAddCall(shot_data: Game_Shot_Data) {
  // we call hole component from here to update
  if (props.shots?.hole_number) {
    dropDown("addShot");
    props.updateNewShot(shot_data, props.shots?.hole_number - 1);
  }
}

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
  console.log("SHOT comp: ", props.shots);

  if (props.current_shots) {
    shotCount.value = props.current_shots.length + 1;
  }

  if (props.shots) {
    holeData.value = props.shots!;
  }
});
</script>

<template>
  <section class="">
    <!-- <div class="flex justify-between items-center mb-3 border-b pb-1">
      <h4 class="text-2xl">Shots</h4>
    </div> -->

    <!-- display list of shots (block 1, block 2, block 3) -->
    <div v-if="props.current_shots" class="flex flex-row">
      <div
        v-for="(value, index) in holeData?.hole_shot_data"
        class="p-2 flex justify-center items-center"
        @click="changeCurrentShot(index)">
        {{ value.shot_count }}
      </div>
    </div>

    <!-- shot general shot details of selected shot -->
    <section v-if="shotDrop" class="">
      <div class="flex flex-row gap-3">
        <!-- <h4 class="text-blue-500">{{ currentShot.shot_count }}</h4>
        <div>{{ currentShot.shot.clubType }}</div> -->
      </div>
    </section>

    <!-- shots drop down -->
    <section class="">
      <div
        @click="dropDown('addShot')"
        class="flex justify-between items-center p-2 border-b border-0.5">
        <h4 class="text-2xl mb-1">Add Shot</h4>
        <i v-if="!addShotDrop" class="bi bi-arrow-plus"></i>
        <i v-if="addShotDrop" class="bi bi-arrow-minus"></i>
      </div>

      <div v-if="addShotDrop" class="border border-0.5">
        <gameShot
          :update-new-shot="shotAddCall"
          :hole_id="holeData?.id"
          :user_id="holeData?.user_id"
          :game_id="holeData?.game_id"
          :shot_count="shotCount" />
      </div>
    </section>

    <!-- current holes stats ??? -->
  </section>
</template>
