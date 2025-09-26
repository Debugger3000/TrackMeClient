<script setup lang="ts">
import { onMounted } from "vue";
import {
  NINE_HOLES_MAP,
  type nine_hole_card,
  type T9_MAP,
} from "../../../../types/course";
import type { Nine_Hole_Data } from "../../../../types/game";

// type NineGameData = {
//   holes: 9;
//   cardData: nine_hole_card;
//   holeData: Nine_Hole_Data;
// };
// type EighteenGameData = {
//   holes: 18;
//   cardData: eighteen_hole_card;
//   holeData: Eighteen_Hole_Data;
// };
// type GameData = NineGameData | EighteenGameData;

// const router = useRouter();

const props = defineProps<{
  // gameData: GameData;

  cardData: nine_hole_card;
  holeData: Nine_Hole_Data;

  hole_state: number;
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

// watch(
//   () => props.holes,
//   () => {
//     console.log("course overview watcher triggered");
//   }
// );

// course selected to create game on
function changeHole(hole: number) {
  // callback to parent to change current hole...

  // only allow users to go backwards on holes... They shouldnt be allowed to add shots on hole 7 when they are currently on hole 3..
  if (hole + 1 <= props.hole_state) {
    props.score_board_change_hole(hole);
  }
}

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // console.log("game data in score board: ", props.holes);
  // call get user info...
  //   refMap.value = props.holes === 9 ? NINE_HOLES_MAP as any : EIGHTEEN_HOLES_MAP as any;
  //   curArray.value = props.holes === 9 ? NINE_ARRAY : EIGHTEEN_ARRAY
  // card_data.value = props.holes === 9 ? props.cardData as any : props.cardData as any;
});
</script>
<!-- :class="{ 'bg-green-300': curHoles === 9 }" -->
<template>
  <section class="overflow-x-auto">
    <h4 class="section-header">Score Card</h4>
    <section class="inline-grid grid-flow-col auto-cols-min overflow-x-scroll">
      <!-- title/ headers -->
      <div class="min-w-[75px]">
        <div class="flex justify-center border-default bg-green-400">
          <h4 class="text-xl card-title">Hole</h4>
        </div>
        <div class="flex justify-center border-default">
          <h4 class="text-xl card-title">Par</h4>
        </div>
        <div class="flex justify-center border-default">
          <h4 class="text-xl card-title">Score</h4>
        </div>
      </div>

      <div
        v-if="props.holeData"
        v-for="(value, index) in nine_map"
        class="min-w-[75px] active:bg-green-600"
        @click="changeHole(index)">
        <div class="flex justify-center border-default bg-green-400">
          <h4 class="text-xl text-gray-800">
            {{ index + 1 }}
          </h4>
        </div>
        <div class="w-full">
          <h4 class="flex justify-center text-xl border-default">
            {{ props.cardData[value] }}
          </h4>
        </div>
        <div class="w-full">
          <h4 class="flex justify-center text-xl border-default">
            {{ props.holeData[value].score }}
          </h4>
        </div>
      </div>
    </section>
  </section>
</template>
