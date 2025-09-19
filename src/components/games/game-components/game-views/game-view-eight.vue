<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { routeTo } from "../../../../router/index";
import { useRoute, useRouter } from "vue-router";
import type {
  Eighteen_Hole_Data,
  Game_Shot_Data,
  Hole_Data,
} from "../../../../types/game";
import { useFetch } from "../../../../api/authFetch";
import {
  EIGHTEEN_HOLES_MAP,
  type eighteen_hole_card,
  type EightHoleKey,
} from "../../../../types/course";
import eightHole from "../holeandshot/eight-hole.vue";

// import eightScoreBoard from "../scoreBoards/eight-score-board.vue";
import nineScoreBoard from "../scoreBoards/nine-score-board.vue";
import holeComponent from "../holeandshot/hole-component.vue";

import holeComp from "../holeandshot/hole-comp.vue";
import { getEightKeyFromIndex, getKeyFromIndex } from "../helpers/helpers";
import type {
  IGameObjectReturn,
  IGameReturnEight,
} from "../../../../types/game";
import EightScoreBoard from "../scoreBoards/eight-score-board.vue";
const router = useRouter();

const route = useRoute();

// This will be a string by default
const game_id = route.params.game_id;

// const holes: THoles = Number(route.query.holes as string | undefined) as 9 | 18;

// const hole = ref<Hole_Data>();

// ------------
// current GAME DATA all here. Feed to other minor components. Shouldn't have to re fetch any game data.
// const game_data = ref<IGameReturnEight>();
// const game_data_eight = ref<IGameEighteen>();

// game object data references (game data, score_board, and hole_data)
const game_data = ref<IGameObjectReturn>();
const score_card = ref<eighteen_hole_card>();
const hole_data = ref<Eighteen_Hole_Data>();

// current hole we are giving to hole component
const current_hole = ref<Hole_Data>();

// current shots Array =
const current_shots = ref<Game_Shot_Data[]>();

// ---------------

// this can be changed by clicking on whatever hole on the scoreboard
let currentHole = ref<number>(1);
// let holeKey = ref<NineHoleKey>("hole_one");

let keyyer = ref<EightHoleKey>("hole_one");

watch(
  () => currentHole.value,
  (newHole) => {
    keyyer.value = EIGHTEEN_HOLES_MAP[newHole - 1];

    console.log("game view update triggers hopefully watcher triggered");
  }
);

// course selected to create game on
function score_board_change_hole(index: number) {
  const curHoleKeyy = EIGHTEEN_HOLES_MAP[index];
  current_hole.value = hole_data.value![curHoleKeyy];

  // track hole with index too, so we can update hole accordingly
  currentHole.value = index + 1;
}

// runs when a shot is POST from game-shot...
function updateGameShots(shot_data: Game_Shot_Data) {
  console.log("UPDATE HOLE SHOTS IN GAME-VIEW ", shot_data);

  // push new shot_data into hole_data's, shot array
  //   const hole = hole_data.value![key];
  //   hole.hole_shot_data?.push(shot_data);
  current_hole.value?.hole_shot_data?.push(shot_data);
  current_shots.value?.push(shot_data);
  // tally score
  //   tallyScoreInMem();
}

// function tally score count for a hole in memory
// function tallyScoreInMem() {
//   // go through shots and increment score in memory...
//   const key = EIGHTEEN_HOLES_MAP[currentHole.value - 1];
//   const hole = hole_data.value![key];
//   if (hole.hole_shot_data) {
//     let score_count = 0;
//     hole.hole_shot_data.forEach((data) => {
//       console.log("shottter: ", data);
//       score_count = score_count + data.stroke;
//     });
//     hole.score = score_count;
//   }
// }

// if else to break between
async function getGameData() {
  console.log("calling useFetch for getGameData");
  try {
    const res = await useFetch<IGameReturnEight>(
      `/game/data/${game_id}?holes=18`,
      "GET",
      undefined
    );

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getGameData res, is undefined");
    }
    // good response...
    else {
      console.log("Game data retrieved here: ", res);
      game_data.value = res.game_object;
      score_card.value = res.score_card_data;
      hole_data.value = res.hole_data;

      console.log("hole state: ", game_data.value);
      console.log("hole state: ", game_data.value.hole_state);
      //   set current hole
      if (game_data.value.hole_state) {
        const hole_stater = game_data.value.hole_state;
        currentHole.value = hole_stater;
        console.log(
          "curr_hole data: ",
          hole_data.value[getEightKeyFromIndex(game_data.value.hole_state)]
        );
        current_hole.value =
          hole_data.value[getEightKeyFromIndex(game_data.value.hole_state)];
        current_shots.value =
          hole_data.value[
            getEightKeyFromIndex(game_data.value.hole_state)
          ].hole_shot_data!;
      }

      console.log("new game data SET...", current_hole.value);
      console.log("new game data SET...", hole_data.value);

      // Object.assign(game_data, res);
    }
  } catch (error) {
    console.log("Error in getGameData in game-view component: ", error);
  }
}

function routeToHere(tabClicked: string) {
  routeTo(`/${tabClicked}`, router);
}

// -------------
// Current Games in here, and Complete games ?
// ------
// or should i have two separate components. I can re use components for shots / scoreboard
onMounted(async () => {
  // set hole Type for fetch call

  // grab all game Data on mount ???
  // const callGameData = async () => {
  //   await getGameData();
  // };
  await getGameData();

  console.log("current hole value: ", currentHole.value);

  //   const key = getEightKeyFromIndex(currentHole.value);
  //   console.log(
  //     "key to make sure non submitted hole scores are updated from shots...",
  //     key
  //   );

  //   if (key && hole_data.value) {
  //     console.log("Tallying score for 18 01");
  //     const hole = hole_data.value[key];
  //     if (hole.hole_shot_data!.length > 0 && hole.score === 0) {
  //       tallyScoreInMem();
  //       //   console.log("Tallying score for 1803", hole_data.score);
  //     }
  //   }
});
</script>

<template>
  <section class="">
    <!-- top bar on page -->
    <section class="flex justify-between bg-green-800 p-2">
      <div>
        <button
          @click="
            {
              routeToHere('games');
            }
          "
          class="font-semibold text-xs rounded border text-white bg-green-700">
          <i class="bi bi-arrow-left text-2xl text-white"></i>
        </button>
      </div>

      <div class="text-center mb-3">
        <h4 class="font-semibold text-3xl">GameView</h4>
      </div>
    </section>

    <!-- main section of page... -->
    <section class="mt-5 p-4">
      <!-- display general course info -->
      <section class="me-border p-2">
        <h4 class="text-3xl">
          {{ game_data?.course.club_name }}
        </h4>
        <h4 v-if="game_data?.course.course_name" class="text-2xl">
          {{ game_data?.course.course_name }}
        </h4>
        <h4 class="text-xl">
          {{ game_data?.course.location }}
        </h4>
        <h4 class="text-xl">Par: {{ game_data?.course.par }}</h4>
        <h4 class="text-xl">Score: {{ game_data?.score }}</h4>
      </section>

      <!-- Display scorecard, probably 9 over 9 for mobile -->
      <section v-if="game_data" class="mt-5">
        <EightScoreBoard
          :card-data="score_card!"
          :hole-data="hole_data!"
          :holes="18"
          :score_board_change_hole="score_board_change_hole"
          :hole_state="game_data.hole_state!" />
      </section>

      <!-- Hole data, depending on what hole you are currently on... -->
      <section class="mt-5">
        <holeComp
          :game_status="game_data?.status!"
          :current_hole="current_hole!"
          :current_shots="current_shots!"
          :update-game-shots="updateGameShots" />

        <!-- <eightHole
          :game-status="game_data?.status!"
          :current-hole="currentHole"
          :holes="18"
          :eight-hole-data="hole_data!"
          :update-game-shots="updateGameShots" /> -->
      </section>

      <!-- shot data... I believe shot data will embed within hole data... -->
    </section>
  </section>
</template>
