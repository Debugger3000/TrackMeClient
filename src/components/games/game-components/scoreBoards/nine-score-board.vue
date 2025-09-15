<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  EIGHTEEN_ARRAY,
  EIGHTEEN_HOLES,
  EIGHTEEN_HOLES_MAP,
  NINE_ARRAY,
  NINE_HOLES_MAP,
  type eighteen_hole_card,
  type ICourseView,
  type nine_hole_card,
  type T18_MAP,
  type T9_MAP,
  type THoles,
} from "../../../../types/course";
import type {
  Eighteen_Hole_Data,
  HoleType,
  IGameView,
  Nine_Hole_Data,
} from "../../../../types/game";
import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
import type { AnyNode } from "postcss";

type NineGameData = {
  holes: 9;
  cardData: nine_hole_card;
  holeData: Nine_Hole_Data;
};
type EighteenGameData = {
  holes: 18;
  cardData: eighteen_hole_card;
  holeData: Eighteen_Hole_Data;
};
type GameData = NineGameData | EighteenGameData;

const router = useRouter();

const props = defineProps<{
  // gameData: GameData;
  eightData?:
    | {
        cardData: eighteen_hole_card;
        holeData: Eighteen_Hole_Data;
      }
    | undefined;
  nineData?:
    | {
        cardData: nine_hole_card;
        holeData: Nine_Hole_Data;
      }
    | undefined;
  holes: THoles;
  // cardData?: nine_hole_card;
  // holeData?: Nine_Hole_Data;
  score_board_change_hole: (index: number) => void;
  //   course?: ICourseView;
}>();

// const map = computed(() =>
//   props.gameData.holes === 9 ? NINE_HOLES_MAP : EIGHTEEN_HOLES_MAP
// );
// const scores = computed(() => props.gameData.cardData);

// let refMap = ref<MapType<typeof props.holes>>(EIGHTEEN_HOLES_MAP);
// let curArray = ref<Number[]>(EIGHTEEN_ARRAY);
// let card_data = ref<CardType<typeof props.holes>>();
let nine_map: T9_MAP = NINE_HOLES_MAP;
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
      <div
        v-if="props.holes === 9 && props.nineData"
        v-for="(value, index) in nine_map"
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
            {{ props.nineData.cardData[value] }}
          </h4>
        </div>
        <div class="w-full">
          <h4 class="flex justify-center text-xl border">
            {{ props.nineData.holeData[value].score }}
          </h4>
        </div>
      </div>

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
