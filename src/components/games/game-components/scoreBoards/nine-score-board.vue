<script setup lang="ts">
import { inject, onMounted, ref, watch, type Ref } from "vue";
import {
  NINE_HOLES_MAP,
  type nine_hole_card,
  type T9_MAP,
} from "../../../../types/course";
import type { GameStatus, Nine_Hole_Data } from "../../../../types/game";


// const router = useRouter();

const props = defineProps<{
  // gameData: GameData;

  cardData: nine_hole_card;
  holeData: Nine_Hole_Data;

  hole_state: number;
  game_hole_state: number;
  // cardData?: nine_hole_card;
  // holeData?: Nine_Hole_Data;
  score_board_change_hole: (index: number) => void;
  //   course?: ICourseView;
}>();

const game_status = inject<Ref<GameStatus, GameStatus>>("game_status");

let nine_map: T9_MAP = NINE_HOLES_MAP;

// holds index of hole
let current_hole = ref<number>(props.hole_state - 1);

watch(
  () => props.hole_state,
  () => {
    console.log('current hole state changed...');
    current_hole.value = props.hole_state-1;
    // console.log("game view update triggers hopefully watcher triggered");
  }
);



// course selected to create game on
function changeHole(hole: number) {
  // callback to parent to change current hole...

  // only allow users to go backwards on holes... They shouldnt be allowed to add shots on hole 7 when they are currently on hole 3..
  if(game_status?.value === 'COMPLETE'){
    props.score_board_change_hole(hole);
    current_hole.value = hole;
  }
  else if (hole + 1 <= props.game_hole_state) {
    props.score_board_change_hole(hole);
    current_hole.value = hole;
  }
}

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {

});
</script>
<!-- :class="{ 'bg-green-300': curHoles === 9 }" -->
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
      <!-- title/ headers -->
      

      <div
        v-if="props.holeData"
        v-for="(value, index) in nine_map"
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
