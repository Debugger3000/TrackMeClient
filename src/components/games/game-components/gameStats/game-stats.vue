<script setup lang="ts">
import { onMounted, provide, ref} from "vue";
// import type { ICourseView } from "../../../../types/course";
import { type IGameView } from "../../../../types/game";
// import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
// import { formatDate } from "../helpers/helpers";
import { routeTo } from "../../../../router";
import { useFetch } from "../../../../api/authFetch";
import gameSearch from "../helpers/game-search.vue";
import gameOverview from "../overviews/game-overview.vue";
import type { IGame_Stats } from "../../../../types/game-stats";
import gridCard from "../helpers/grid-card.vue";

import polarChart from "./polar-chart.vue";
import clubStats from "./club-stats.vue";
import type { THoles } from "../../../../types/course";

const router = useRouter();

// const props = defineProps<{
//   //   gameData: IGameView[];
//   //   courseSelector?: (index: number) => void;
//   //   course?: ICourseView;
// }>();

// main game view data...
let games_searched = ref<IGameView[]>();

// variable ref to control when a single game is choosen from search
let game_choosen = ref<IGameView>();

// current holes selected 9 or 18
let curHoles = ref<THoles>(18);


// Injections
// ---------------------------------------------------
// game search injectors
function setGamesInjector(gameData: IGameView[]) {
  games_searched.value = gameData;
  console.log("game stats SEARCHER SETTTT ", games_searched.value);
}

async function resetGamesSearch() {
  //   await getCompleteGames();
  games_searched.value = undefined;
}

// game overview function
async function setSoloGameStats(game: IGameView) {
  game_choosen.value = game;

  // set games_searched to undefined 
  games_searched.value = undefined;

  // call get solo game stats...
  await getSoloGameStats();
}



provide("resetGames", { resetGamesSearch });
provide("setGames", { setGamesInjector });
provide("setSoloGameStats", { setSoloGameStats });
// ---------------------------------------------------------

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

// Method to choose time filter option
async function selectOption(option: string) {
  selectedOption.value = option;
  isOpen.value = false;
  // call new data
  await getGameStats();
}

let game_stats_data = ref<IGame_Stats>();


async function removeGameSelected() {
  console.log("removing selected game...");
  game_choosen.value = undefined;
  // re fetch game stats for whatever timeframe is selected...
  await getGameStats();
}

async function getGameStats() {
  // whats the first data I grab ?
  // how should I filter data ?
  // Games data (last 1 month) - 3 months - 6 months - 1 year - then go by year...
  // Choose an individual games data - By search or scroll ? or both...

  try {
    // should return new game object ID so i can use it in params for new route
    const res = await useFetch<IGame_Stats>(
      `/game/stats/${selectedOption.value}?holes=${curHoles.value}`,
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

async function getSoloGameStats() {

   try {
    // should return new game object ID so i can use it in params for new route
    const res = await useFetch<IGame_Stats>(
      `/game/stats/solo/${game_choosen.value?.id}`,
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

async function changeHoles(){
  
  if(curHoles.value === 9){
    curHoles.value = 18;
  }
  else{
    curHoles.value = 9;
  }
  await getGameStats();
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
  <section class=" p-2">
    <div>
      <h4 class="section-header">Game Stats</h4>
    </div>
    <!-- menu bar -->
    <section class=" border-gray-400">
      <!-- dropdown for how much data to show for -->

      <!-- search bar for individual games -->
      <section class="relative">
        <gameSearch />

        <!-- games view -->
        <div v-if="games_searched">
          <gameOverview v-if="games_searched" link_type="game-stats" :game-data="games_searched" />
        </div>
      </section>

      <!-- <div class="flex gap-5 border-default">
            <input id="gameSearch" type="text" placeholder="Search Games..." @input="searchInput($event.target)" class="p-2 w-full"></input>
            <button @click="setSearchToEmpty"><i class="bi bi-x text-3xl"></i></button>
        </div> -->

      <!-- option to look at a single games data -->
    </section>

    <!-- another menu bar -->
    <section class="flex items-center justify-between py-3">
      <div v-if="!game_choosen" class="relative w-24">
        <!-- Selected option -->
        <div
          class="cursor-pointer border-default rounded p-1 bg-white shadow text-center color-01 font-semibold"
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
            class="p-1 cursor-pointer hover:bg-gray-100 text-base text-center color-01 font-semibold"
            @click="selectOption(option)">
            {{ option }}
          </div>
        </div>
      </div>

      <div v-if="!game_choosen" class="flex items-center w-fit border-default rounded">
          <div class="">
            <div
            
               @click="changeHoles"
              class="text-xl px-2 py-1 w-[40px] text-center"
              :class="{
                'button-light-blue': curHoles === 9,
                'color-light-grey': curHoles !== 9
              }">
              9
            </div>
          </div>
          <!-- add shots -->
          <div class="flex items-center">
            <div
            
              class="text-xl px-2 py-1 w-[40px] text-center"
              @click="changeHoles"
              :class="{
                'button-light-blue': curHoles === 18,
                'color-light-grey': curHoles !== 18
              }">
              18
            </div>
          </div>
        </div>

      <!-- display game name and date and such if a singl game is selected ! -->
      <section v-if="game_choosen" class="w-full pb-3 border-b border-gray-300 border-0.5">
        <gameOverview :game-data="[game_choosen]" link_type="scorecard-link"/>
        
        <button type="button"  @click="removeGameSelected" class="bg-01 mt-3 rounded-md w-full text-white">Remove Game</button>
        

      </section>

    

      <!-- filter data... games / holes / shots ??? -->
    </section>

    <!-- stats grid area -->
    <section v-if="game_stats_data" class="grid grid-cols-3 gap-3">
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



      


    </section>
    <!-- Display graph here, and can swap in club data... -->
       <!-- initial data is score percents -->
      <section v-if="game_stats_data" class="mt-3">
        <polarChart :score_distro="game_stats_data?.scores_distro!"/>

      </section>

      <!-- individual club stats -->
      <section class="mt-3">
        <clubStats v-if="game_stats_data" :game="game_choosen" :time_filter="selectedOption"/>

        

      </section>
  </section>
</template>
