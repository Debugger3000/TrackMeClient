<script setup lang="ts">
import { inject, onMounted, watch } from "vue";
// import type { ICourseView } from "../../../../types/course";
import type { IGameView } from "../../../../types/game";
// import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
import { formatDate } from "../helpers/helpers";

const router = useRouter();

const props = defineProps<{
  gameData: IGameView[];
  link_type: string;
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

// link_type="scorecard-link"
// link_type="game-stats"

watch(
  () => props.gameData,
  () => {
    console.log("course overview watcher triggered");
  }
);

const setSoloGame = inject<{
  setSoloGameStats: (game: IGameView) => void;
}>("setSoloGameStats");

// course selected to create game on
function gameSelected(game_id: number, holes: number, index: number) {
  // routeTo(`/game-view/${game_id}?`, router);

  // game overview from game-stats for searching and loading a solo games stats
  if(props.link_type === 'game-stats') {
    // set game id for game=stats with injected function
    setSoloGame?.setSoloGameStats(props.gameData[index]);

  }
  else{

    if (holes === 18) {
    router.push({
      name: "game-view-eight",
      params: { game_id },
    });
  } else {
    console.log("Setting game to GAME NINE ", game_id);
    router.push({
      name: "game-view-nine",
      params: { game_id },
    });
  }
  }
}


// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
  console.log("Hole in game-overview: ", props.gameData);




});
</script>

<template>
  <section class="grow border-default overflow-y-scroll">
    <h4 class="pl-2 color-01" v-if="!props.gameData.length">No Game Data...</h4>
    <div
      v-for="(value, index) in props.gameData"
      :key="index"
      class="grid grid-cols-3 gap-3 border-b border-gray-300 min-h-[75px] bg-white py-1"
      @click="
        {
          gameSelected(value.id, value.holes, index);
        }
      ">

      <!-- Delete button -->
      <!-- <div class="delete-btn" @click="deleteGame(value.id)">Delete</div> -->

      

      
      <div class="flex flex-col justify-center pl-2">
        <!-- club name -->
        <h4 class="font-semibold text-xl color-01">{{ value.club_name }}</h4>
        <!-- par and hole -->
        <div class="flex items-center">
          <h4 class="color-light-grey text-sm">{{ value.holes }}</h4>
          <i class="bi bi-dot text-xl color-light-grey"></i>
          <h4 class="color-light-grey text-sm">Par {{ value.par }}</h4>
           <!-- <i class="bi bi-dot text-xl color-light-grey"></i> -->
        </div>
      </div>

      <!-- score  -->
        <div class="flex items-center justify-center">
          <div class="flex items-center gap-1">
            <h4 class="color-light-grey text-medium">Score: </h4>
            <h4 class="color-light-grey text-medium">{{ value.score }} </h4>
            <h4 v-if="value.status === 'COMPLETE'" class="color-light-grey text-medium">
              ({{ value.par + value.score }})
            </h4>
          </div> 
        </div>
      

      <div class="flex items-center justify-end pr-2">
        <h4 class="font-semibold color-01 text-sm">{{ formatDate(value.created_at) }}</h4>
      </div>
      </div>
  </section>
</template>