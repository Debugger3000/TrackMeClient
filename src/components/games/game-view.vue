<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { routeTo } from "../../router";
import { useRoute, useRouter } from "vue-router";
import type {
  Eighteen_Hole_Data,
  HoleType,
  IGame,
  IGameStrict,
  Nine_Hole_Data,
} from "../../types/game";
import { useFetch } from "../../api/authFetch";
import type {
  eighteen_hole_card,
  nine_hole_card,
  THoles,
} from "../../types/course";

import nineScoreBoard from "./game-components/scoreBoards/nine-score-board.vue";
import holeComponent from "./game-components/hole+shot/hole-component.vue";
const router = useRouter();

const route = useRoute();

// This will be a string by default
const game_id = route.params.game_id;
const holes: THoles = Number(route.query.holes as string | undefined) as 9 | 18;

// ------------
// current GAME DATA all here. Feed to other minor components. Shouldn't have to re fetch any game data.
const game_data = ref<IGameStrict>();
// ---------------

// this can be changed by clicking on whatever hole on the scoreboard
let currentHole = ref<number | null>();

watch(
  () => game_data,
  () => {
    console.log("game view update triggers hopefully watcher triggered");
  }
);

// course selected to create game on
function score_board_change_hole(index: number) {
  currentHole.value = index;
}

// if else to break between
async function getGameData() {
  console.log("calling useFetch for getGameData");
  try {
    const res = await useFetch<IGameStrict>(
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
      currentHole.value = res.final_game_object.hole_state;
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
onMounted(() => {
  // set hole Type for fetch call

  // grab all game Data on mount ???
  const callGameData = async () => {
    await getGameData();
  };
  callGameData();
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
      </section>

      <!-- Display scorecard, probably 9 over 9 for mobile -->
      <section v-if="game_data" class="mt-5">
        <nineScoreBoard
          v-if="game_data.final_game_object.course.holes === 9"
          :nine-data="{
            cardData: game_data.final_game_object.course_score_card as nine_hole_card,
            holeData: game_data.final_game_object.hole_data as Nine_Hole_Data,
          }"
          :holes="holes"
          :score_board_change_hole="score_board_change_hole" />

        <nineScoreBoard
          v-if="game_data.final_game_object.course.holes === 18"
          :eight-data="{
            cardData: game_data.final_game_object.course_score_card as eighteen_hole_card,
            holeData: game_data.final_game_object.hole_data as Eighteen_Hole_Data,
          }"
          :holes="holes"
          :score_board_change_hole="score_board_change_hole" />
      </section>

      <!-- Hole data, depending on what hole you are currently on... -->
      <section class="mt-5">
        <h4 class="text-2xl">Hole {{ currentHole }}</h4>
        <hole-component />
      </section>

      <!-- shot data... I believe shot data will embed within hole data... -->
    </section>
  </section>
</template>
