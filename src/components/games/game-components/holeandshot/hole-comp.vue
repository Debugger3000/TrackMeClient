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
  IGameEighteen,
  IGameNine,
  IGameStrict,
  Nine_Hole_Data,
} from "../../../../types/game";
import { useRouter } from "vue-router";

import shotComponent from "./shot-component.vue";
import type { PropertySignature } from "typescript";

// const router = useRouter();

const props = defineProps<{
  game_status: GameStatus;
  current_hole: Hole_Data;
  current_shots: Game_Shot_Data[];
  updateGameShots: (game_data: Game_Shot_Data) => void;
  // gameData: IGameView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

// putt values
const putts: number[] = [1, 2, 3, 4, 5, 6];

// current score in hole
const current_hole_score = ref<number>(0);

// let hole = ref<Hole_Data>();
// current hole key
// let curHoleKeyEight = ref<EightHoleKey>();
// let curHoleKeyNine = ref<NineHoleKey>();

// let eight_data = ref<Eighteen_Hole_Data>();
// let nine_data = ref<Nine_Hole_Data>();

watch(
  () => props.current_shots,

  () => {
    // grab whatever shots are in hole shot array and tally strokes to display current hole score
    updateHoleScore();
  }
);

function updateHoleScore() {
  if (props.current_shots) {
    let score_count = 0;
    props.current_shots.forEach((data) => {
      console.log("shottter: ", data);
      score_count = score_count + data.stroke;
    });
    current_hole_score.value = score_count;
  }
  //   if (props.current_hole && props.current_hole.hole_shot_data) {
  //     let score_count = 0;
  //     props.current_hole.hole_shot_data.forEach((data) => {
  //       console.log("shottter: ", data);
  //       score_count = score_count + data.stroke;
  //     });
  //     current_hole_score.value = score_count;
  //   }
}

// watch(
//   () => props.currentHole,
//   () => {
//     updateData(props.holes);

//     console.log("game view update triggers hopefully watcher triggered");
//   }
// );

function updateData(holes: number) {
  //   if (holes === 18 && props.eightHoleData && props.currentHole) {
  //     // const curHoleKeyy = EIGHTEEN_HOLES_MAP[props.currentHole - 1];
  //     const hole_data = eight_data.value![curHoleKeyy];
  //     // set values
  //     console.log("before hole set");
  //     hole.value = hole_data;
  //     curHoleKeyEight.value = curHoleKeyy;
  //     holeForm.value.id = hole_data.id;
  //     console.log("after hole set ", hole.value);
  //   }
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
function updateNewShot(shot_data: Game_Shot_Data) {
  // update hole and props.eight or nine
  props.updateGameShots(shot_data);
  //   if (props.holes === 18) {
  //     // pass data to game-view to update everything hopefully

  //   } else {
  //   }
}

// form for hole data
const holeForm = ref<Hole_Submit>({
  id: 0,
  putt_count: 0,
  score: 0,
  notes: "",
});

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // grab whatever shots are in hole shot array and tally strokes to display current hole score
  updateHoleScore();
});
</script>

<template>
  <section class="">
    <div class="flex justify-between items-center mb-3 border-b pb-1">
      <h4 v-if="props.current_hole" class="text-2xl">
        Hole {{ props.current_hole.hole_number }}
      </h4>
      <h4 class="text-2xl">Score: {{ current_hole_score }}</h4>
      <h4 v-if="props.current_hole" class="text-2xl">
        Par:
        {{ props.current_hole.par }}
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
        <shot-component
          :shots="props.current_hole"
          :current_shots="props.current_shots!"
          :update-new-shot="updateNewShot" />
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
