<script setup lang="ts">
import { onMounted, watch } from "vue";
import {
  EIGHTEEN_HOLES_MAP,
  type eighteen_hole_card,
  type T18_MAP,
  type THoles,
} from "../../../../types/course";
import type { Eighteen_Hole_Data } from "../../../../types/game";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  // gameData: GameData;
  eightData:
    | {
        cardData: eighteen_hole_card;
        holeData: Eighteen_Hole_Data;
      }
    | undefined;

  holes: THoles;

  score_board_change_hole: (index: number) => void;
}>();

let eight_map: T18_MAP = EIGHTEEN_HOLES_MAP;

watch(
  () => props.holes,
  () => {
    console.log("course overview watcher triggered");
  }
);

// course selected to create game on
function changeHole(hole: number) {
  // callback to parent to change current hole...

  props.score_board_change_hole(hole + 1);
}

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  console.log("game data in score board: ", props.holes);
  // call get user info...
  //   refMap.value = props.holes === 9 ? NINE_HOLES_MAP as any : EIGHTEEN_HOLES_MAP as any;
  //   curArray.value = props.holes === 9 ? NINE_ARRAY : EIGHTEEN_ARRAY
  // card_data.value = props.holes === 9 ? props.cardData as any : props.cardData as any;
});
</script>
:class="{ 'bg-green-300': curHoles === 9 }"
<template>
  <section class="overflow-x-auto">
    <h4 class="mb-1 text-2xl">Score Card</h4>
    <section
      class="inline-grid grid-flow-col auto-cols-min overflow-x-scroll"
      :class="{ 'grid-cols-9': holes === 9 }">
      <!-- eighteen hole score card -->
      <div
        v-if="props.holes === 18 && props.eightData"
        v-for="(value, index) in eight_map"
        class="min-w-[75px] active:bg-gray-400"
        @click="changeHole(index)">
        <div class="flex justify-center border">
          <h4 class="text-xl text-red-800">
            {{ index + 1 }}
          </h4>
        </div>
        <div class="w-full">
          <h4
            class="flex justify-center text-xl text-green-700 border border-black">
            {{ props.eightData.cardData[value] }}
          </h4>
        </div>
        <div class="w-full">
          <h4 class="flex justify-center text-xl border">
            {{ props.eightData.holeData[value].score }}
          </h4>
        </div>
      </div>
    </section>
  </section>
</template>
