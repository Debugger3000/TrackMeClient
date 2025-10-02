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

// hold in progress games
let inProgressGames = ref<IGameView[]>();
let completedGames = ref<IGameView[]>();
// older completedGames data
// let oldCompletedGames = ref<IGameView[]>();

// for game search
// let prevDataLength = 0;

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
async function getCompleteGames() {
  try {
    // should return new game object ID so i can use it in params for new route
    const res = await useFetch<IGameView[]>("/game/completed", "GET");

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

// async function getGameBySearch(searchValue: string) {
//     try {
//         const res = await useFetch<IGameView[]>(`/game/grab/${searchValue}`,"GET");

//         if (res === 401) {
//             localStorage.setItem("isLoggedIn", "false");
//             routeTo("/login", router);
//         } else if (res === undefined) {
//             throw new Error("Error from getcoursebySearch res, is undefined");
//         }
//         // good response...
//         else {

//             // set course view data...
//             completedGames.value = res;
//             console.log("Game SEARCH DATA: ", res);
//         }

//     } catch (error) {
//          console.log("Error in getCourseBySearch in create Game...", error);
//     }
// }

// async function searchInput(value: EventTarget | null) {
//     console.log("new search input is: ", value);
//     console.log("search input ; ", typeof value);
//     if(value){
//         const val = value as HTMLInputElement;
//         const searchValue = val.value;
//         console.log("Value: ", searchValue);
//         // user did not backspace, so we can query on added character...
//         if(prevDataLength < searchValue.length && searchValue !== "") {
//             await getGameBySearch(searchValue);
//             prevDataLength = searchValue.length;
//             // courseSelected.value = false;
//         }
//         else if(searchValue === ""){
//           await getCompleteGames()
//       // completedGames.value = oldCompletedGames.value;
//        console.log("field is empty returning complete game data... ", completedGames.value);
//         }

//     }
// }

// async function setSearchToEmpty() {
//   const input = document.getElementById("gameSearch") as HTMLInputElement;
//   if(input !== null) {
//   input.value = ""; // clears the input

//   }
//   await getCompleteGames()

// }

// call users game data and fill game data table
// function getUsersGamesData() {

// }

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
    <section class="flex justify-between bg-green-800 p-2">
      <div class="">
        <h4 class="font-semibold text-3xl text-white">Courses</h4>
      </div>

      <!-- right side of top bar -->
      <section class="flex gap-3">
        <div class="border border-white rounded p-1">
          <button
            @click="
              {
                routeToHere('create-game');
              }
            "
            class="font-semibold rounded text-white">
            Start Game
            <!-- <i class="bi bi-plus text-2xl text-white"></i> -->
          </button>
        </div>
      </section>
    </section>

    <!-- main section of page... -->
    <section class="mt-3 p-2 grow flex flex-col">
      <!-- other functionality above table -->
      <section class="flex items-center justify-between pb-5 border-b">
        <div class="flex items-center border-default rounded">
          <div class="">
            <button
              @click="changeData"
              class="p-1"
              :class="{
                'bg-green-800': curData === 'stats',
                'text-white': curData === 'stats',
              }">
              Stats
            </button>
          </div>
          <!-- add shots -->
          <div class="flex items-cetner">
            <button
              class="p-1"
              @click="changeData"
              :class="{
                'bg-green-800': curData === 'games',
                'text-white': curData === 'games',
              }">
              Games
            </button>
          </div>
        </div>
        <!-- add a course -->
        <div class="border border-white rounded">
          <button
            @click="
              {
                routeToHere('create-course');
              }
            "
            class="font-semibold rounded text-white bg-green-800 p-1">
            Add Course
            <!-- <i class="bi bi-plus text-2xl text-white"></i> -->
          </button>
        </div>
      </section>

      <section v-if="curData === 'games'" class="mt-3 flex">
        <div class="flex items-center border-default rounded">
          <div class="">
            <button
              @click="changeView"
              class="p-1"
              :class="{
                'bg-green-800': curView === 'history',
                'text-white': curView === 'history',
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
                'bg-green-800': curView === 'current',
                'text-white': curView === 'current',
              }">
              Current
            </button>
          </div>
        </div>
      </section>

      <!-- in-progress games right here -->
      <section
        v-if="inProgressGames && curData === 'games' && curView === 'current'"
        class="mt-3">
        <h4 class="section-header">Current Games</h4>
        <game-overview :game-data="inProgressGames" link_type="scorecard-link"/>
      </section>

      <!-- GAMES table / stats -->
      <section
        v-if="curData === 'games' && completedGames && curView === 'history'"
        class="mt-3 flex flex-col grow">
        <div class="mb-1">
          <h4 class="section-header">Game History</h4>
          <gameSearch />
          <!-- <div class="flex gap-5 border-default">
            <input id="gameSearch" type="text" placeholder="Search Games..." @input="searchInput($event.target)" class="p-2 w-full"></input>
            <button @click="setSearchToEmpty"><i class="bi bi-x text-3xl"></i></button>
        </div> -->
        </div>
        <!-- <h4 class="font-semibold pb-1">Completed Games</h4> -->
        <game-overview :game-data="completedGames" link_type="scorecard-link"/>
      </section>

      <!-- Games Stats -->
      <section v-if="curData === 'stats'">
        <gameStats />
      </section>

      <!-- map comp testing -->
      <!-- <map-plugin /> -->
    </section>
  </section>
</template>
