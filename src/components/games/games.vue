<script setup lang="ts">
import { ref, onMounted } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";

const router = useRouter();

let curData = ref<"games" | "stats">("games");

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

// call users game data and fill game data table
// function getUsersGamesData() {

// }

// lifecycle hooks
onMounted(() => {
  // call get user info...
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

      <!-- GAMES table / stats -->
      <section v-if="curData === 'games'" class="mt-5">
        <h4 class="font-semibold pb-1">Game History</h4>

        <section class="me-border">
          <div class="grid grid-cols-3 gap-3 border-b">
            <div class="flex items-center">
              <h4>BearCreek</h4>
            </div>
            <div class="flex items-center">
              <h4>August 22, 2025</h4>
            </div>

            <div class="flex flex-col gap-1">
              <h4 class="m-0">Par: 72</h4>
              <h4 class="m-0">Score: 86</h4>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="flex items-center">
              <h4>BearCreek</h4>
            </div>
            <div class="flex items-center">
              <h4>August 22, 2025</h4>
            </div>

            <div class="flex flex-col gap-1">
              <h4 class="m-0">Par: 72</h4>
              <h4 class="m-0">Score: 86</h4>
            </div>
          </div>
        </section>
      </section>
    </section>
  </section>
</template>
