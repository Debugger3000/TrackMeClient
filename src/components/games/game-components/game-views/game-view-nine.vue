<script setup lang="ts">
import { onMounted, provide, ref, watch } from "vue";
import { routeTo } from "../../../../router/index";
import { useRoute, useRouter } from "vue-router";
import type {
  Game_Shot_Data_Submit,
  GameStatus,
  Hole_Data,
  IGameReturnNine,
  Nine_Hole_Data,
} from "../../../../types/game";
import { useFetch } from "../../../../api/authFetch";
import {
  EIGHTEEN_HOLES_MAP,
  NINE_HOLES_MAP,
  type EightHoleKey,
  type nine_hole_card,
} from "../../../../types/course";

// import eightScoreBoard from "../scoreBoards/eight-score-board.vue";

import holeComp from "../holeandshot/hole-comp.vue";
import { formatDate, getNineKeyFromIndex } from "../helpers/helpers";
import type { IGameObjectReturn } from "../../../../types/game";
import NineScoreBoard from "../scoreBoards/nine-score-board.vue";
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
const score_card = ref<nine_hole_card>();
const hole_data = ref<Nine_Hole_Data>();

// current hole we are giving to hole component
const current_hole = ref<Hole_Data>();

// current shots Array =
const current_shots = ref<Game_Shot_Data_Submit[]>([]);

// track master game hole state & status
let game_hole_state = ref<number>(1);
let game_status = ref<GameStatus>("IN-PROGRESS");

// ---------------

// this can be changed by clicking on whatever hole on the scoreboard
let current_hole_state = ref<number>(0);
// let holeKey = ref<NineHoleKey>("hole_one");

let keyyer = ref<EightHoleKey>("hole_one");

provide("update_shots", { updateGameShots });
provide("goNextHole", goNextHole);
provide("current_hole_state", current_hole_state);
provide("game_hole_state", game_hole_state);
provide("game_status", game_status);
provide("delete_shot", deleteGameShot);
provide("complete_game", completeGame);

watch(
  () => current_hole_state.value,
  (newHole) => {
    keyyer.value = EIGHTEEN_HOLES_MAP[newHole - 1];

    console.log("game view update triggers hopefully watcher triggered");
  }
);

// course selected to create game on
function score_board_change_hole(index: number) {
  const curHoleKeyy = NINE_HOLES_MAP[index];
  // update hole data
  current_hole.value = hole_data.value![curHoleKeyy];

  console.log("new hole data from scoreboard change: ", current_hole.value);

  // update hole shots separately too
  current_shots.value = current_hole.value.hole_shot_data!;

  // track hole with index too, so we can update hole accordingly
  current_hole_state.value = index + 1;
}

function completeGame() {
  console.log("Game completed in nine!");
  router.push("/games");
}

function deleteGameShot(index: number) {
  console.log("delete game shots in GAMEVIEW ", current_shots.value);
  const new_shots = current_shots.value.filter((_, i) => i !== index);
  current_shots.value = new_shots;

  console.log("delete game shots POST deleter", current_shots.value);
}

// runs when a shot is POST from game-shot...
function updateGameShots(shot_data: Game_Shot_Data_Submit) {
  console.log(
    "UPDATE HOLE SHOTS IN GAME-VIEW EIGHT callewd from provide... ",
    shot_data
  );
  current_shots.value = [...current_shots.value, shot_data];

  // tally score
  //   tallyScoreInMem();
}

// hole submit was good, now we need to grab fresh game data, and next hole will be ready to be posted within
async function goNextHole() {
  console.log("go next hole function in game-view-eight called !");
  await getGameData();
  console.log("go next hole data updated: ", game_data.value);
}

// if else to break between
async function getGameData() {
  console.log("calling useFetch for getGameData");
  try {
    const res = await useFetch<IGameReturnNine>(
      `/game/data/${game_id}?holes=9`,
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

      // set game_status
      game_status.value = res.game_object.status;

      // console.log("hole state: ", game_data.value);
      // console.log("hole state: ", game_data.value.hole_state);
      //   set current hole
      if (game_data.value.hole_state) {
        const hole_stater = game_data.value.hole_state;
        current_hole_state.value = hole_stater;
        // set global current game hole_state
        game_hole_state.value = hole_stater;
        current_hole.value =
          hole_data.value[getNineKeyFromIndex(game_data.value.hole_state)];
        current_shots.value =
          hole_data.value[
            getNineKeyFromIndex(game_data.value.hole_state)
          ].hole_shot_data!;
      }

      // console.log("new game data SET...", current_hole.value);
      // console.log("new game data SET...", hole_data.value);

      // Object.assign(game_data, res);
    }
  } catch (error) {
    console.log("Error in getGameData in game-view component: ", error);
  }
}

function routeToHere() {
  // routeTo(`/${tabClicked}`, router);
  router.go(-1);
}

// -------------
// Current Games in here, and Complete games ?
// ------
// or should i have two separate components. I can re use components for shots / scoreboard
onMounted(async () => {
  console.log("MOUNTED GAME VIEW NINER");

  await getGameData();

  console.log("current hole value: ", current_hole_state.value);
});
</script>

<style src="../holeandshot/mainstyles.css"></style>

<template>
  <section class="">
    <!-- top bar on page -->

    <section class="flex items-center justify-between p-2 bg-color-card">
      <div class="flex items-center justify-center">
        <button
          @click="
            {
              routeToHere();
            }
          "
          class="font-semibold text-xs rounded border text-white bg-gray-300 p-1">
          <i class="bi bi-arrow-left text-2xl color-01"></i>
        </button>
      </div>

      <h2 class="font-semibold color-01 text-xl">GameView</h2>
    </section>

    <!-- main section of page... -->

    <section class="mt-3 px-4">
      <section class="p-2 bg-color-card card-main-border">
        <h4 class="text-01 text-title mb-0">
          {{ game_data?.course.club_name }}
        </h4>
        <h4
          v-if="game_data?.course.course_name"
          class="color-light-grey text-normal">
          {{ game_data?.course.course_name }}
        </h4>
        <h4 class="color-01">
          {{ game_data?.course.location }}
        </h4>
        <h4 class="text-01 text-normal">{{ formatDate(game_data?.date!) }}</h4>
        <h4 class="text-01 text-normal">Par: {{ game_data?.course.par }}</h4>
        <h4 class="text-01 text-normal">Score: {{ game_data?.score }}</h4>
      </section>

      <!-- Display scorecard, probably 9 over 9 for mobile -->
      <section v-if="game_data" class="mt-3">
        <NineScoreBoard
          :card-data="score_card!"
          :hole-data="hole_data!"
          :holes="18"
          :score_board_change_hole="score_board_change_hole"
          :hole_state="game_data.hole_state!" />
      </section>

      <!-- Hole data, depending on what hole you are currently on... -->
      <section v-if="game_data && current_hole" class="mt-3">
        <holeComp
          :game_status="game_data?.status!"
          :current_hole="current_hole!"
          :current_shots="current_shots!"
          :update-game-shots="updateGameShots"
          :game_score="game_data?.score!" />
      </section>
    </section>
  </section>
</template>
