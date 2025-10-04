<script setup lang="ts">
import { ref, onMounted } from "vue";
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
<style src="../games//game-components//holeandshot/mainstyles.css"></style>

<template>
  <!-- Stats page page -->
  <section class="">
    <!-- contains specs of form (shotpath, contact, clubtype) -->
    <section class="overflow-x-auto">
      <div class="flex p-2 bg-01">
        <h3 class="font-semibold text-3xl text-white">Range</h3>
      </div>

      <!-- stats vs add -->
      <section class="flex items-center p-2 border-b border-gray-300">
        <div class="flex items-center border-default">
          <div class="">
            <button
              @click="changeData"
              class=""
              :class="{ 'button-light-blue': curData === 'stats' }">
              Stats
            </button>
          </div>
          <!-- add shots -->
          <div class="flex items-center">
            <button
              class=""
              @click="changeData"
              :class="{ 'button-light-blue': curData === 'add-shots' }">
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
        <div v-if="curData === 'add-shots'" class="p-2 shadow-lg">
          <stats />
        </div>
      </section>
    </section>
  </section>
</template>
