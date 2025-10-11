<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useFetch } from "../../api/authFetch";
import type { IGameView } from "../../types/game";
import gameOverview from "./game-components/overviews/game-overview.vue";
import gameStats from "./game-components/gameStats/game-stats.vue";
import gameSearch from "./game-components/helpers/game-search.vue";

// import mapPlugin from "./game-components/map/map-plugin.vue";

const router = useRouter();

let curData = ref<"games" | "stats">("games");
let curView = ref<"history" | "current">("history");

// variable to hold current limit amount for GET Completed games query
let get_limit = ref<number>(10);

// hold in progress games
let inProgressGames = ref<IGameView[]>();
let completedGames = ref<IGameView[]>();
// older completedGames data
// let oldCompletedGames = ref<IGameView[]>();

let search_bar_toggle = ref<boolean>(false);
function searchToggle(){
    search_bar_toggle.value = !search_bar_toggle.value;
}

// for game search
// let prevDataLength = 0;

// takes game data from search
function setGamesInjector(gameData: IGameView[]) {
  completedGames.value = gameData;
  console.log("SET GAMEs BY  SEARCH INJECT: ", completedGames.value);
}

async function resetGamesSearch() {
  await getCompleteGames();
}

provide("resetGames", { resetGamesSearch });
provide("setGames", { setGamesInjector });

function changeData() {
  if (curData.value === "games") {
    curData.value = "stats";
  } else {
    curData.value = "games";
  }
}

function changeView() {
  if (curView.value === "history") {
    curView.value = "current";
  } else {
    curView.value = "history";
  }
}

function routeToHere(tabClicked: string) {
  routeTo(tabClicked, router);
}

// get inprogress games
async function getCurrentGames() {
  try {
    // should return new game object ID so i can use it in params for new route
    const res = await useFetch<IGameView[]>("/game/in-progress", "GET");

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getcoursebySearch res, is undefined");
    }
    // good response...
    else {
      // set course view data...
      // console.log("Getting in progress games response: ", res);
      inProgressGames.value = res;
    }
  } catch (error) {
    console.log("Error in get in progress games on games page", error);
  }
}

// GET COMPLETE games
// should grab 10 games at a time...
// user scrolls down below container and it will prompt to fetch more data, and append it
async function getCompleteGames() {
  try {
    // should return new game object ID so i can use it in params for new route
    const res = await useFetch<IGameView[]>(`/game/completed?limit=${get_limit.value}`, "GET");

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getcoursebySearch res, is undefined");
    }
    // good response...
    else {
      // set course view data...
      // console.log("Getting completed games response: ", res);
      completedGames.value = res;
    }
  } catch (error) {
    console.log("Error in get in progress games on games page", error);
  }
}

// lifecycle hooks
onMounted(async () => {
  // grab in-progress games
  await getCurrentGames();
  // call completed games
  await getCompleteGames();
});
</script>

<template>
  <!-- games page -->
  <section class="flex flex-col h-full">
    <!-- top bar on page -->
    <section class="flex justify-between items-center bg-01 px-2 py-1 h-[55px]">
        <h4 class="font-semibold text-3xl text-white">Games</h4>

      <!-- right side of top bar -->
      <section class="flex gap-3">
        <div class="">
          <button
            @click="
              {
                routeToHere('create-game');
              }
            "
            class="text-white">
            
            <i class="bi bi-plus text-4xl text-white"></i>
          </button>
        </div>
      </section>
    </section>

    <!-- main section of page... -->
    <section class="grow flex flex-col">
      <!-- other functionality above table -->
      <section class="flex items-center justify-between p-2 border-b border-gray-400">
        <div class="flex items-center border-default rounded-md">
          <div class="">
            <button
              @click="changeData"
              class=""
              :class="{
                'button-light-blue': curData === 'stats'
                // 'text-white': curData === 'stats',
              }">
              Stats
            </button>
          </div>
          <!-- add shots -->
          <div class="flex items-center">
            <button
              class=""
              @click="changeData"
              :class="{
                'button-light-blue': curData === 'games'
              }">
              Games
            </button>
          </div>
        </div>
        <!-- add a course -->
        <div class="">
          <button
            @click="
              {
                routeToHere('create-course');
              }
            "
            class="text-white button-light-blue rounded-md">
            Add Course
            <!-- <i class="bi bi-plus text-2xl text-white"></i> -->
          </button>
        </div>
      </section>

      <section v-if="curData === 'games'" class="mt-3 flex px-2">
        <div class="flex items-center border-default rounded">
          <div class="">
            <button
              @click="changeView"
              class="p-1"
              :class="{
                'button-light-blue': curView === 'history',
                // 'text-white': curView === 'history',
              }">
              History
            </button>
          </div>
          <!-- add shots -->
          <div class="flex items-cetner">
            <button
              class="p-1"
              @click="changeView"
              :class="{
                'button-light-blue': curView === 'current',
                // 'text-white': curView === 'current',
              }">
              Current
            </button>
          </div>
        </div>
      </section>

      <!-- in-progress games right here -->
      <section
        v-if="inProgressGames && curData === 'games' && curView === 'current'"
        class="mt-2">
        <h4 class="section-header px-2">Current Games</h4>
        <game-overview :game-data="inProgressGames" link_type="scorecard-link"/>
      </section>

      <!-- GAMES table / stats -->
      <section
        v-if="curData === 'games' && completedGames && curView === 'history'"
        class="mt-2 flex flex-col grow">
        <div class="mb-1 px-2">
          <div class="flex gap-5 items-center">
            <h4 class="section-header">Game History</h4>
          <div class="" @click="searchToggle">
             <i class="bi bi-search text-xl color-01"></i>
          </div>
        </div>
          
          <gameSearch v-if="search_bar_toggle"/>
        </div>
        <game-overview :game-data="completedGames" link_type="scorecard-link"/>
      </section>

      <!-- Games Stats -->
      <section v-if="curData === 'stats'">
        <gameStats />
      </section>

    </section>
  </section>
</template>
