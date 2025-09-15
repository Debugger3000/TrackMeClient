<script setup lang="ts">

import { onMounted, ref, watch } from "vue";
import { EIGHTEEN_ARRAY, EIGHTEEN_HOLES, EIGHTEEN_HOLES_MAP, NINE_ARRAY, NINE_HOLES_MAP, type eighteen_hole_card, type ICourseView, type nine_hole_card, type T18_MAP, type T9_MAP, type THoles } from "../../../../types/course";
import type { Eighteen_Hole_Data, HoleType, IGameView, Nine_Hole_Data } from "../../../../types/game";
import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
import type { AnyNode } from "postcss";

const router = useRouter();

const props = defineProps<{
  cardData?: eighteen_hole_card;
  holeData?: Eighteen_Hole_Data;
  score_board_change_hole: (index: number) => void;
  //   course?: ICourseView;
}>();

// export type CardType<H extends THoles> = H extends 18
//   ? eighteen_hole_card
//   : nine_hole_card;

// type MapType<H extends THoles> = H extends 18
//   ? T18_MAP
//   : T9_MAP;

// let refMap = ref<MapType<typeof props.holes>>(EIGHTEEN_HOLES_MAP);
// let curArray = ref<Number[]>(EIGHTEEN_ARRAY);
// let card_data = ref<CardType<typeof props.holes>>();
let nine_map :T18_MAP = EIGHTEEN_HOLES_MAP;

watch(
  () => props.holeData,
  () => {
    console.log("course overview watcher triggered");
  }
);

// course selected to create game on
function changeHole(hole: number) {
// callback to parent to change current hole...

    props.score_board_change_hole(hole+1);
  

}

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
//   refMap.value = props.holes === 9 ? NINE_HOLES_MAP as any : EIGHTEEN_HOLES_MAP as any;
//   curArray.value = props.holes === 9 ? NINE_ARRAY : EIGHTEEN_ARRAY
// card_data.value = props.holes === 9 ? props.cardData as any : props.cardData as any;
});
</script>

<template>
  <section class="me-border">
   

    <section class="grid grid-cols-9 grid-rows-2 me-border mt-3">
            <div v-for="(value,index) in nine_map">
              <div class="flex justify-center border">
                <h4 @click="changeHole(index)" class="text-xl text-red-800">{{ index+1 }}</h4>
              </div>
              <div class="w-full">
                <input
                :id="`hole_${index + 1}`"
                class="flex justify-center w-full text-center border focus:outline-none" type="number"></input>
                 <h4 class="flex justify-center text-xl border">{{ props.cardData![value] }}</h4>
              </div>
            </div>
           </section>
  </section>
</template>
