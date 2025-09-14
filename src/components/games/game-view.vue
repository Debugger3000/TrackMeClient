<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { routeTo } from "../../router";
import { useRoute, useRouter } from "vue-router";
import type {
  Eighteen_Hole_Data,
  IGame,
  Nine_Hole_Data,
} from "../../types/game";
import { useFetch } from "../../api/authFetch";
import type {
  eighteen_hole_card,
  nine_hole_card,
  THoles,
} from "../../types/course";

const router = useRouter();

const route = useRoute();

// This will be a string by default
const game_id = route.params.game_id;
const holes: THoles = Number(route.query.holes as string | undefined) as 9 | 18;

type HoleType<H extends THoles> = H extends 18
  ? IGame<Eighteen_Hole_Data, eighteen_hole_card>
  : IGame<Nine_Hole_Data, nine_hole_card>;

// current GAME DATA all here. Feed to other minor components. Shouldn't have to re fetch any game data.
const game_data = ref<HoleType<typeof holes>>();

const props = defineProps<{
  //   courseData?: ICourseView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

watch(
  () => game_data,
  () => {
    console.log("game view update triggers hopefully watcher triggered");
  }
);

// course selected to create game on

function routeToHere(tabClicked: string) {
  routeTo(`/${tabClicked}`, router);
}

// if else to break between
async function getGameData() {
  console.log("calling useFetch for getGameData");
  try {
    const res = await useFetch<HoleType<typeof holes>>(
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
      // Object.assign(game_data, res);
    }
  } catch (error) {
    console.log("Error in getGameData in game-view component: ", error);
  }
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
      <h4>club name: {{ game_data?.final_game_object.course.club_name }}</h4>

      <!-- Display scorecard, probably 9 over 9 for mobile -->

      <!-- Hole data, depending on what hole you are currently on... -->

      <!-- shot data... I believe shot data will embed within hole data... -->
    </section>
  </section>
</template>
