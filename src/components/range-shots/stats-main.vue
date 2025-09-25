<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
// import { routeTo } from "../../router";
// import { useRouter } from "vue-router";

import rangeStats from "./range-stats.vue";
import Stats from "./Stats.vue";

// const router = useRouter();

let curData = ref<"add-shots" | "stats">("stats");

function changeData() {
  if (curData.value === "stats") {
    curData.value = "add-shots";
  } else {
    curData.value = "stats";
  }
  console.log("new curdata: ", curData.value);
}

// ----------------------

// lifecycle hooks
onMounted(() => {
  console.log("Stats page just mounted");

  // call get user info...
});
</script>

<style src="./shotshape.css"></style>

<template>
  <!-- Stats page page -->
  <section class="p-2">
    <!-- contains specs of form (shotpath, contact, clubtype) -->
    <section class="overflow-x-auto">
      <div class="pb-1 border-b">
        <h3 class="font-bold text-3xl">Range</h3>
      </div>

      <!-- stats vs add -->
      <section class="flex items-center mt-3">
        <div class="flex items-center border-default">
          <div class="">
            <button
              @click="changeData"
              class="p-1"
              :class="{ 'bg-green-300': curData === 'stats' }">
              Stats
            </button>
          </div>
          <!-- add shots -->
          <div class="flex items-cetner">
            <button
              class="p-1"
              @click="changeData"
              :class="{ 'bg-green-300': curData === 'add-shots' }">
              Add Shots
            </button>
          </div>
        </div>
      </section>

      <!-- flip between  -->
      <section>
        <div v-if="curData === 'stats'">
          <range-stats />
        </div>
        <div v-if="curData === 'add-shots'">
          <stats />
        </div>
      </section>
    </section>
  </section>
</template>
