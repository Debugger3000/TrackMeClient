<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
  EIGHTEEN_HOLES_MAP,
  NINE_HOLES_MAP,
  type EightHoleKey,
  type NineHoleKey,
  type T18_MAP,
  type THoles,
} from "../../../../types/course";
import type {
  Eighteen_Hole_Data,
  Game_Shot_Data,
  GameStatus,
  Hole_Data,
  Hole_Submit,
  Nine_Hole_Data,
} from "../../../../types/game";
import { useRouter } from "vue-router";

import shotComponent from "./shot-component.vue";

// const router = useRouter();

const props = defineProps<{
  gameStatus: GameStatus;
  currentHole: number | null | undefined;
  eightHoleData: Eighteen_Hole_Data;
  holes: THoles;
  updateGameShots: (game_data: Game_Shot_Data, hole_key: EightHoleKey) => void;
}>();

// putt values
const putts: number[] = [1, 2, 3, 4, 5, 6];

let hole = ref<Hole_Data>();
// current hole key
let curHoleKeyEight = ref<EightHoleKey>();
// let curHoleKeyNine = ref<NineHoleKey>();

watch(
  () => props.currentHole,
  () => {
    updateData();

    console.log("game view update triggers hopefully watcher triggered");
  }
);

function updateData() {
  if (props.eightHoleData && props.currentHole) {
    const curHoleKeyy = EIGHTEEN_HOLES_MAP[props.currentHole - 1];
    const hole_data = props.eightHoleData[curHoleKeyy];
    // set values
    console.log("before hole set");
    hole.value = hole_data;
    curHoleKeyEight.value = curHoleKeyy;
    holeForm.value.id = hole_data.id;
    console.log("after hole set ", hole.value);
  }

  // update game-view so scoreboard can update as well...
}

// drop downs
let puttDrop = ref<boolean>(true);
let shotDrop = ref<boolean>(true);

// course selected to create game on
function dropDown(type: string) {
  if (type === "putt") {
    puttDrop.value = !puttDrop.value;
  } else if (type === "shot") {
    shotDrop.value = !shotDrop.value;
  }
}

// change putt count
function changePuttCount(count: number) {
  holeForm.value.putt_count = count;
}

// locally update shot array for whatever hole when shot is upload, so we dont have to refetch data everytime.
// if user has to refresh game-view page, then data will update on that too
function updateNewShot(shot_data: Game_Shot_Data, hole_number: number) {
  // update hole and props.eight or nine

  if (props.holes === 18) {
    // pass data to game-view to update everything hopefully
    props.updateGameShots(shot_data, curHoleKeyEight.value!);
  } else {
  }
}

// form for hole data
const holeForm = ref<Hole_Submit>({
  id: 0,
  putt_count: 0,
  score: 0,
  notes: "",
  game_id: 0,
  hole_state: 0,
  game_score: 0,
});

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
  updateData();
  console.log("hole data on hole componnt: ", hole);
});
</script>

<template>
  <section class="">
    <div class="flex justify-between items-center mb-3 border-b pb-1">
      <h4 v-if="props.currentHole" class="text-2xl">Hole {{ currentHole }}</h4>
      <h4
        v-if="props.holes === 18 && props.eightHoleData && props.currentHole"
        class="text-2xl">
        Par:
        {{ props.eightHoleData[EIGHTEEN_HOLES_MAP[props.currentHole - 1]].par }}
      </h4>
    </div>

    <!-- putts count / drop down -->
    <section class="">
      <div class="" @click="dropDown('putt')">
        <h4 class="text-2xl mb-1">Putts</h4>
        <div class="grid grid-cols-6">
          <div
            v-for="value in putts"
            class="flex justify-center items-center p-2 rounded border"
            :class="{ 'bg-gray-400': holeForm.putt_count === value }"
            @click="changePuttCount(value)">
            {{ value }}
          </div>
        </div>
      </div>
    </section>

    <!-- shots drop down -->
    <section class="mt-5" @click="dropDown('shot')">
      <h4 class="text-2xl mb-1">Shots</h4>
      <div class="">
        <!-- <shot-component :shots="hole" :update-new-shot="updateNewShot" /> -->
      </div>
    </section>

    <!-- notes -->
    <section class="mt-5">
      <h4 class="text-2xl mb-1">Notes</h4>
      <textarea
        v-model="holeForm.notes"
        class="p-1 rounded border border-0.5 w-full"
        placeholder="Hole notes..."></textarea>
    </section>

    <!-- current holes stats ??? -->
  </section>
</template>
