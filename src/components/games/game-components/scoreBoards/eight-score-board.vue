<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  EIGHTEEN_HOLES_MAP,
  type eighteen_hole_card,
  type T18_MAP,
} from "../../../../types/course";
import type { Eighteen_Hole_Data } from "../../../../types/game";
// import { useRouter } from "vue-router";

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

  cardData: eighteen_hole_card;
  holeData: Eighteen_Hole_Data;

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
let eight_map: T18_MAP = EIGHTEEN_HOLES_MAP;

// holds index of hole
let current_hole = ref<number>(props.hole_state - 1);

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
    current_hole.value = hole;
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
:class="{ 'bg-green-300': curHoles === 9 }"
<template>
  <section class="flex overflow-x-auto bg-color-card card-main-border">
    <!-- <h4 class="section-header">Score Card</h4> -->
    <div class="">
      <div class="flex justify-center min-w-[50px] p-2">
        <h4 class="text-normal text-semibold">Hole</h4>
      </div>
      <div class="flex justify-center min-w-[50px] p-2">
        <h4 class="text-normal text-semibold">Par</h4>
      </div>
      <div class="flex justify-center min-w-[50px] p-2 bg-gray-200">
        <h4 class="text-normal text-semibold">Score</h4>
      </div>
    </div> 

    <section
      class="inline-grid grid-flow-col auto-cols-min overflow-x-scroll rounded relative">
      <!-- title/headers -->
      <div
        v-if="props.holeData"
        v-for="(value, index) in eight_map"
        class="min-w-[50px] active:bg-01"
        @click="changeHole(index)">
        
        <div
          class="flex justify-center p-2"
          :class="{ 'bg-01': current_hole === index }">
          <h4
            class="text-normal"
            :class="{ 'text-white': current_hole === index }">
            {{ index + 1 }}
          </h4>
        </div>
        
        <div class="w-full p-2">
          <h4 class="flex justify-center color-light-grey text-normal">
            {{ props.cardData[value] }}
          </h4>
        </div>
        
        <div class="w-full p-2 bg-gray-200">
          <h4 class="flex justify-center text-normal">
            {{ props.holeData[value].score }}
          </h4>
        </div>
      </div>
    </section>
  </section>
</template>

