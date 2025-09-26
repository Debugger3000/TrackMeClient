<script setup lang="ts">
import { ref, onMounted } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useFetch } from "../../api/authFetch";
import type { IGameView } from "../../types/game";
import gameOverview from "./game-components/overviews/game-overview.vue";

// import mapPlugin from "./game-components/map/map-plugin.vue";

const router = useRouter();

let curData = ref<"games" | "stats">("games");

// hold in progress games
let inProgressGames = ref<IGameView[]>();
let completedGames = ref<IGameView[]>();

function changeData() {
  if (curData.value === "games") {
    curData.value = "stats";
  } else {
    curData.value = "games";
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
  <!-- Home page -->
  <section class="">
    <!-- top bar on page -->
    <section class="flex justify-between bg-green-800 p-2">
      <div class="">
        <h4 class="font-semibold text-3xl text-white">Courses</h4>
      </div>

      <!-- right side of top bar -->
      <section class="flex gap-3">
        <div class="border border-white rounded">
          <button
            @click="
              {
                routeToHere('create-course');
              }
            "
            class="font-semibold text-xs rounded border text-white bg-green-700">
            <i class="bi bi-plus text-2xl text-white"></i>
          </button>
        </div>
        <div class="border border-white rounded">
          <button
            @click="
              {
                routeToHere('create-game');
              }
            "
            class="font-semibold text-xs rounded border text-white bg-green-700">
            Game
            <i class="bi bi-plus text-2xl text-white"></i>
          </button>
        </div>
      </section>
    </section>

    <!-- main section of page... -->
    <section class="mt-5 p-2">
      <!-- other functionality above table -->
      <section class="flex items-center">
        <div class="flex items-center">
          <div class="me-border">
            <button @click="changeData">
              <div class="flex items-center">
                <h4 :class="{ 'bg-green-300': curData === 'games' }">Games</h4>
                <h4 :class="{ 'bg-green-300': curData === 'stats' }">Stats</h4>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- in-progress games right here -->
      <section v-if="inProgressGames && curData === 'games'" class="mt-5">
        <h4 class="font-semibold pb-1">In-Progress Games</h4>
        <game-overview :game-data="inProgressGames" />
      </section>

      <!-- GAMES table / stats -->
      <section v-if="curData === 'games' && completedGames" class="mt-5">
        <h4 class="font-semibold pb-1">Game History</h4>
        <!-- <h4 class="font-semibold pb-1">Completed Games</h4> -->
        <game-overview :game-data="completedGames" />
      </section>

      <!-- map comp testing -->
      <!-- <map-plugin /> -->
    </section>
  </section>
</template>
