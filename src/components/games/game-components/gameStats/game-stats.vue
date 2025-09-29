<script setup lang="ts">
import { onMounted, provide, ref, watch } from "vue";
// import type { ICourseView } from "../../../../types/course";
import { type IGameView } from "../../../../types/game";
// import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
import { formatDate } from "../helpers/helpers";
import { routeTo } from "../../../../router";
import { useFetch } from "../../../../api/authFetch";
import gameSearch from "../helpers/game-search.vue";
import gameOverview from "../overviews/game-overview.vue";
import type { IGame_Stats } from "../../../../types/game-stats";
import gridCard from "../helpers/grid-card.vue";

const router = useRouter();

const props = defineProps<{
  //   gameData: IGameView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

let games_searched = ref<IGameView[]>();

// game search injectors
function setGamesInjector(gameData: IGameView[]) {
  games_searched.value = gameData;
  console.log("game stats SEARCHER SETTTT ", games_searched.value);
}

async function resetGamesSearch() {
  //   await getCompleteGames();
  games_searched.value = undefined;
}

provide("resetGames", { resetGamesSearch });
provide("setGames", { setGamesInjector });

// Options
const options = ["1 month", "3 months", "6 months", "1 year", "1 year"];

// watch(
//   () => props.gameData,
//   () => {
//     console.log("course overview watcher triggered");
//   }
// );

// Dropdown state
const isOpen = ref<boolean>(false);

// Selected option (default: 1 month)
const selectedOption = ref(options[0]);

// Method to choose option
function selectOption(option: string) {
  selectedOption.value = option;
  isOpen.value = false;
}

let game_stats_data = ref<IGame_Stats>();

async function getGameStats() {
  // whats the first data I grab ?
  // how should I filter data ?
  // Games data (last 1 month) - 3 months - 6 months - 1 year - then go by year...
  // Choose an individual games data - By search or scroll ? or both...

  try {
    // should return new game object ID so i can use it in params for new route
    const res = await useFetch<IGame_Stats>(
      `/game/stats/${selectedOption.value}`,
      "GET"
    );

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from get games stats res, is undefined");
    }
    // good response...
    else {
      // set game stats data
      game_stats_data.value = res;
      
      console.log("game stats returned: ", res);
    }
  } catch (error) {
    console.log("Error in get game stats on games stats page", error);
  }
}

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(async () => {
  // call get user info...
  //   console.log("Hole in game-overview: ", props.gameData);
  await getGameStats();
});
</script>

<template>
  <section class="mt-3">
    <div>
      <h4 class="section-header">Game Stats</h4>
    </div>
    <!-- menu bar -->
    <section class="pb-3 border-b border-0.5 border-gray-400">
      <!-- dropdown for how much data to show for -->

      <!-- search bar for individual games -->
      <section class="relative">
        <gameSearch />

        <!-- games view -->
        <div v-if="games_searched">
          <gameOverview v-if="games_searched" :game-data="games_searched" />
        </div>
      </section>

      <!-- <div class="flex gap-5 border-default">
            <input id="gameSearch" type="text" placeholder="Search Games..." @input="searchInput($event.target)" class="p-2 w-full"></input>
            <button @click="setSearchToEmpty"><i class="bi bi-x text-3xl"></i></button>
        </div> -->

      <!-- option to look at a single games data -->
    </section>

    <!-- another menu bar -->
    <section class="flex items-center py-3">
      <div class="relative w-24">
        <!-- Selected option -->
        <div
          class="cursor-pointer border-default rounded p-1 bg-white shadow text-center"
          @click="isOpen = !isOpen">
          {{ selectedOption }}
        </div>

        <!-- Dropdown menu -->
        <div
          v-if="isOpen"
          class="absolute left-0 mt-1 w-full border-default rounded bg-white shadow-lg z-10 h-36 overflow-y-scroll">
          <div
            v-for="option in options"
            :key="option"
            class="p-1 cursor-pointer hover:bg-gray-100 text-base text-center"
            @click="selectOption(option)">
            {{ option }}
          </div>
        </div>
      </div>

      <!-- filter data... games / holes / shots ??? -->
    </section>

    <!-- stats grid area -->
    <section class="grid grid-cols-3 gap-3">
      <!-- feed this a array of objects with keys [{title: string, data: string}] -->
      <gridCard title="Game Played" :data_point="game_stats_data?.games_played!"/>
      <gridCard title="Holes Played" :data_point="game_stats_data?.holes_played!"/>
      <gridCard title="Total Shots" :data_point="game_stats_data?.total_shots!"/>

      <!-- putt average -->
       <gridCard title="Putt Avg" :data_point="game_stats_data?.putt_average!"/>
      <!-- Scoring Average -->
       <gridCard title="Score Avg" :data_point="game_stats_data?.scoring_average!"/>
       <!-- stroke average -->
      <gridCard title="Stroke Avg" :data_point="game_stats_data?.stroke_average!"/>

      <!-- penalty percent -->
      <gridCard title="Penalty %" :data_point="game_stats_data?.penalty_percent!"/>
      <!-- fairways hit off tee -->
      <gridCard title="Fairway %" :data_point="game_stats_data?.fairways_hit_off_tee!"/>
      <!-- longest drive -->
      <gridCard title="Long Drive" :data_point="game_stats_data?.longest_drive!"/>



      <!-- Display graph here, and can swap in club data... -->
       <!-- initial data is score percents -->
      <section class="mt-3">

      </section>


    </section>
  </section>
</template>
