<script setup lang="ts">
import { onMounted, ref } from "vue";

import type { Game_Shot_Data } from "../../../../types/game";
import { useRouter } from "vue-router";

import stats from "../../../Stats/Stats.vue";

// const router = useRouter();

const props = defineProps<{
  shots: Game_Shot_Data[] | null | undefined;
}>();

// drop downs
let shotDrop = ref<boolean>(true);
// drop down for stats for shot to add
let addShotDrop = ref<boolean>(true);

// value for current shot
let currentShot = ref<Game_Shot_Data>();

// course selected to create game on
function dropDown(type: string) {
  if (type === "addShot") {
    addShotDrop.value = !addShotDrop.value;
  }
}

// change putt count
function changeCurrentShot(count: number) {
  currentShot.value = props.shots![count];
}

// form for hole data
const holeForm = ref({
  puttCount: 0,
  score: 0,
  notes: "",
  hole_shot_data: [],
});

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
  console.log("SHOT comp: ", currentShot.value);
});
</script>

<template>
  <section class="">
    <!-- <div class="flex justify-between items-center mb-3 border-b pb-1">
      <h4 class="text-2xl">Shots</h4>
    </div> -->

    <!-- display list of shots (block 1, block 2, block 3) -->
    <div class="flex flex-row">
      <div
        v-for="(value, index) in props.shots"
        class="p-2 flex justify-center items-center"
        @click="changeCurrentShot(index)">
        {{ value.shot_count }}
      </div>
    </div>

    <!-- shot general shot details of selected shot -->
    <section v-if="shotDrop" class="">
      <div class="flex flex-row gap-3">
        <!-- <h4 class="text-blue-500">{{ currentShot.shot_count }}</h4>
        <div>{{ currentShot.shot.clubType }}</div> -->
      </div>
    </section>

    <!-- shots drop down -->
    <section class="">
      <div
        @click="dropDown('addShot')"
        class="flex justify-between items-center p-2 border-b border-0.5">
        <h4 class="text-2xl mb-1">Add Shot</h4>
        <i v-if="!addShotDrop" class="bi bi-arrow-plus"></i>
        <i v-if="addShotDrop" class="bi bi-arrow-minus"></i>
      </div>

      <div v-if="addShotDrop" class="border border-0.5">
        <stats />
      </div>
    </section>

    <!-- current holes stats ??? -->
  </section>
</template>
