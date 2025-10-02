<script setup lang="ts">
import { onMounted, provide, ref, watch } from "vue";
import { routeTo } from "../../../../router/index";
import { useRoute, useRouter } from "vue-router";
import type {
  Eighteen_Hole_Data,
  Game_Shot_Data_Submit,
  GameStatus,
  Hole_Data,
} from "../../../../types/game";
import { useFetch } from "../../../../api/authFetch";
import {
  EIGHTEEN_HOLES_MAP,
  type eighteen_hole_card,
  type EightHoleKey,
} from "../../../../types/course";

import holeComp from "../holeandshot/hole-comp.vue";
import { formatDate, getEightKeyFromIndex } from "../helpers/helpers";
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
const current_shots = ref<Game_Shot_Data_Submit[]>([]);

// ---------------

// this can be changed by clicking on whatever hole on the scoreboard
let current_hole_state = ref<number>(1);
// let holeKey = ref<NineHoleKey>("hole_one");

// expose game data hole_state to all children so we can appropriately block things we need to
let game_hole_state = ref<number>(1);

let game_status = ref<GameStatus>("IN-PROGRESS");

// provide context to children components
// update immediate score after shot has been posted...
provide("update_shots", { updateGameShots });
provide("goNextHole", goNextHole);
provide("current_hole_state", current_hole_state);
provide("game_hole_state", game_hole_state);
provide("game_status", game_status);

provide("delete_shot", deleteGameShot);
provide("complete_game", completeGame);

let keyyer = ref<EightHoleKey>("hole_one");

watch(
  () => current_hole_state.value,
  (newHole) => {
    keyyer.value = EIGHTEEN_HOLES_MAP[newHole - 1];

    console.log("game view update triggers hopefully watcher triggered");
  }
);

// course selected to create game on
function score_board_change_hole(index: number) {
  const curHoleKeyy = EIGHTEEN_HOLES_MAP[index];
  // update hole data
  current_hole.value = hole_data.value![curHoleKeyy];

  console.log("new hole data from scoreboard change: ", current_hole.value);

  // update hole shots separately too
  current_shots.value = current_hole.value.hole_shot_data!;

  // track hole with index too, so we can update hole accordingly
  current_hole_state.value = index + 1;
}

// runs when a shot is POST from game-shot...
function updateGameShots(shot_data: Game_Shot_Data_Submit) {
  console.log(
    "UPDATE HOLE SHOTS IN GAME-VIEW EIGHT callewd from provide... ",
    shot_data
  );
  current_shots.value = [...current_shots.value, shot_data];
}

function deleteGameShot(index: number) {
  console.log("deletem game shots in GAMEVIEW ", current_shots.value);
  const new_shots = current_shots.value.filter((_, i) => i !== index);
  current_shots.value = new_shots;

  console.log(
    "deletem game shots in GAMEVIEW POST deleter",
    current_shots.value
  );
}

// hole submit was good, now we need to grab fresh game data, and next hole will be ready to be posted within
async function goNextHole() {
  console.log("go next hole function in game-view-eight called !");
  await getGameData();
  console.log("go next hole data updated: ", game_data.value);
}

function completeGame() {
  console.log("Game completed !");
  router.push("/games");
}

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

      // set game_status
      game_status.value = res.game_object.status;

      // console.log("hole state: ", game_data.value);
      // console.log("hole state: ", game_data.value.hole_state);
      //   set current hole
      if (game_data.value.hole_state) {
        const hole_stater = game_data.value.hole_state;
        // current hole state for switch between hole data
        current_hole_state.value = hole_stater;
        // set master hole_state to drop some display on holes
        game_hole_state.value = hole_stater;
        // console.log(
        //   "curr_hole data: ",
        //   hole_data.value[getEightKeyFromIndex(game_data.value.hole_state)]
        // );
        current_hole.value =
          hole_data.value[getEightKeyFromIndex(game_data.value.hole_state)];
        current_shots.value =
          hole_data.value[
            getEightKeyFromIndex(game_data.value.hole_state)
          ].hole_shot_data!;
      }

      // console.log("new game data SET...", current_hole.value);
      // console.log("new game data SET...", hole_data.value);

      // Object.assign(game_data, res);
    }
  } catch (error) {
    console.log("Error in getGameData in game-view eight component: ", error);
  }
}

function routeToHere(tabClicked: string) {
  // routeTo(`/${tabClicked}`, router);
  router.go(-1);
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

  console.log("current hole value: ", current_hole_state.value);

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
    <section class="flex items-center justify-between p-2 bg-color-card">
      <div>
        <button
          @click="{ routeToHere('games'); }"
          class="font-semibold text-xs rounded border text-white bg-gray-300 p-1">
          <i class="bi bi-arrow-left text-2xl color-01"></i>
        </button>
      </div>

      <div class="text-center">
        <h4 class="font-semibold color-01 text-xl">GameView</h4>
      </div>
    </section>

    <!-- main section of page -->
    <section class="mt-3 p-4">
      <!-- display general course info -->
      <section class="p-2 bg-color-card card-main-border">
        <h4 class="text-01 text-title mb-0">{{ game_data?.course.club_name }}</h4>
        <h4 v-if="game_data?.course.course_name" class="color-light-grey text-normal">
          {{ game_data?.course.course_name }}
        </h4>
        <h4 class="color-01">{{ game_data?.course.location }}</h4>
        <h4 class="text-01 text-normal">{{ formatDate(game_data?.date!) }}</h4>
        <h4 class="text-01 text-normal">Par: {{ game_data?.course.par }}</h4>
        <h4 class="text-01 text-normal">Score: {{ game_data?.score }}</h4>
      </section>

      <!-- Display scorecard -->
      <section v-if="game_data" class="mt-3">
        <EightScoreBoard
          v-if="score_card && hole_data"
          :card-data="score_card!"
          :hole-data="hole_data!"
          :holes="18"
          :score_board_change_hole="score_board_change_hole"
          :hole_state="game_data.hole_state!" />
      </section>

      <!-- Hole data -->
      <section v-if="current_hole && game_data" class="mt-3">
        <holeComp
          :game_status="game_data?.status!"
          :current_hole="current_hole!"
          :current_shots="current_shots!"
          :update-game-shots="updateGameShots"
          :game_score="game_data.score" />
      </section>
    </section>
  </section>
</template>

