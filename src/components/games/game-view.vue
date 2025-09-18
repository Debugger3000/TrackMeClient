<script setup lang="ts">
import { computed, mergeProps, onMounted, ref, watch } from "vue";
import { routeTo } from "../../router";
import { useRoute, useRouter } from "vue-router";
import type {
  Eighteen_Hole_Data,
  Game_Shot_Data,
  Hole_Data,
  HoleType,
  IGame,
  IGameEighteen,
  IGameNine,
  IGameStrict,
  Nine_Hole_Data,
} from "../../types/game";
import { useFetch } from "../../api/authFetch";
import {
  EIGHTEEN_HOLES_MAP,
  NINE_ARRAY,
  NINE_HOLES_MAP,
  type eighteen_hole_card,
  type EightHoleKey,
  type nine_hole_card,
  type NineHoleKey,
  type THoles,
} from "../../types/course";

import nineScoreBoard from "./game-components/scoreBoards/nine-score-board.vue";
import eightScoreBoard from "./game-components/scoreBoards/eight-score-board.vue";
import holeComponent from "./game-components/hole+shot/hole-component.vue";
import { getKeyFromIndex, isNineKey } from "./game-components/helpers/helpers";
const router = useRouter();

const route = useRoute();

// This will be a string by default
const game_id = route.params.game_id;

const eight_hole: 18 = 18;
const nine_hole: 9 = 9;
const holes: THoles = Number(route.query.holes as string | undefined) as 9 | 18;

const hole = ref<Hole_Data>();

// ------------
// current GAME DATA all here. Feed to other minor components. Shouldn't have to re fetch any game data.
const game_data = ref<IGameStrict<typeof holes>>();
// const game_data_eight = ref<IGameEighteen>();
// ---------------

// this can be changed by clicking on whatever hole on the scoreboard
let currentHole = ref<number>(1);
let holeKey = ref<NineHoleKey>("hole_one");

let keyyer = ref<EightHoleKey>("hole_one");

watch(
  () => currentHole.value,
  (newHole) => {
    if (holes === 18) {
      keyyer.value = EIGHTEEN_HOLES_MAP[newHole - 1];
    } else {
      holeKey.value = NINE_HOLES_MAP[newHole - 1];
    }
    console.log("game view update triggers hopefully watcher triggered");
  }
);

// course selected to create game on
function score_board_change_hole(index: number) {
  currentHole.value = index;
}

// runs when a shot is POST from game-shot...
function updateGameShots(
  shot_data: Game_Shot_Data,
  key: EightHoleKey | NineHoleKey
) {
  console.log("UPDATE HOLE SHOTS IN GAME-VIEW ", shot_data);

  // push new shot_data into hole_data's, shot array
  if (holes === 18) {
    const hole_data = (
      game_data.value?.final_game_object.hole_data as Eighteen_Hole_Data
    )[key];
    hole_data.hole_shot_data?.push(shot_data);
    // tally score
    tallyScoreInMem(hole_data);
  } else {
    const keyy = isNineKey(key);
    if (keyy) {
      const hole_data = (
        game_data.value?.final_game_object.hole_data as Nine_Hole_Data
      )[keyy];
      hole_data.hole_shot_data?.push(shot_data);
      tallyScoreInMem(hole_data);
    }
  }
}

// function tally score count for a hole in memory
function tallyScoreInMem(hole: Hole_Data) {
  // go through shots and increment score in memory...
  if (hole.hole_shot_data) {
    let score_count = 0;
    hole.hole_shot_data.forEach((data) => {
      console.log("shottter: ", data);
      score_count = score_count + data.stroke;
    });
    hole.score = score_count;
  }
}

// if else to break between
async function getGameData() {
  console.log("calling useFetch for getGameData");
  try {
    const res = await useFetch<IGameStrict<typeof holes>>(
      `/game/data/${game_id}?holes=${holes}`,
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
      game_data.value = res;
      if (res.final_game_object.hole_state) {
        currentHole.value = res.final_game_object.hole_state;
      }
      console.log("new game data SET...");

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
  const key = getKeyFromIndex(currentHole.value, holes);
  console.log(
    "key to make sure non submitted hole scores are updated from shots...",
    key
  );

  if (holes === 18 && key) {
    console.log("Tallying score for 18 01");
    const hole_data = (
      game_data.value?.final_game_object.hole_data as Eighteen_Hole_Data
    )[key];
    if (hole_data.hole_shot_data!.length > 0 && hole_data.score === 0) {
      tallyScoreInMem(hole_data);
      console.log("Tallying score for 1803", hole_data.score);
    }
  } else if (holes === 9 && key) {
    const keyy = isNineKey(key);
    if (keyy) {
      const hole_data = (
        game_data.value?.final_game_object.hole_data as Nine_Hole_Data
      )[keyy];
      if (hole_data.hole_shot_data!.length > 0 && hole_data.score === 0) {
        tallyScoreInMem(hole_data);
      }
    }
  }
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
          {{ game_data?.final_game_object.course.club_name }}
        </h4>
        <h4
          v-if="game_data?.final_game_object.course.course_name"
          class="text-2xl">
          {{ game_data?.final_game_object.course.course_name }}
        </h4>
        <h4 class="text-xl">
          {{ game_data?.final_game_object.course.location }}
        </h4>
        <h4 class="text-xl">
          Par: {{ game_data?.final_game_object.course.par }}
        </h4>
        <h4 class="text-xl">Score: {{ game_data?.final_game_object.score }}</h4>
      </section>

      <!-- Display scorecard, probably 9 over 9 for mobile -->
      <section v-if="game_data" class="mt-5">
        <nineScoreBoard
          v-if="holes === 9"
          :nine-data="{
            cardData: game_data.final_game_object.course_score_card as nine_hole_card,
            holeData: game_data.final_game_object.hole_data as Nine_Hole_Data,
          }"
          :holes="holes"
          :score_board_change_hole="score_board_change_hole"
          :hole_state="game_data.final_game_object.hole_state!" />

        <nineScoreBoard
          v-if="holes === 18"
          :eight-data="{
            cardData: game_data.final_game_object.course_score_card as eighteen_hole_card,
            holeData: game_data.final_game_object.hole_data as Eighteen_Hole_Data,
          }"
          :holes="holes"
          :score_board_change_hole="score_board_change_hole"
          :hole_state="game_data.final_game_object.hole_state!" />
      </section>

      <!-- Hole data, depending on what hole you are currently on... -->
      <section class="mt-5">
        <hole-component
          v-if="holes === 18"
          :game-status="game_data?.final_game_object.status!"
          :current-hole="currentHole"
          :holes="holes"
          :eight-hole-data="game_data?.final_game_object.hole_data as Eighteen_Hole_Data"
          :update-game-shots="updateGameShots" />
        <hole-component
          v-if="holes === 9"
          :game-status="game_data?.final_game_object.status!"
          :holes="holes"
          :current-hole="currentHole"
          :nine-hole-data="game_data?.final_game_object.hole_data"
          :update-game-shots="updateGameShots" />
      </section>

      <!-- shot data... I believe shot data will embed within hole data... -->
    </section>
  </section>
</template>
