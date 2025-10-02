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
    <div
      v-for="(value, index) in props.gameData"
      :key="index"
      class="grid grid-cols-3 gap-3 border-b border-gray-300 min-h-[75px]"
      @click="
        {
          gameSelected(value.id, value.holes, index);
        }
      ">
      <div class="flex flex-col justify-center pl-2">
        <h4 class="font-semibold text-xl">{{ value.club_name }}</h4>
        <div class="flex gap-1">
          <h4 class="m-0">Par {{ value.par }} -</h4>
          <h4 class="m-0">{{ value.holes }}</h4>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <h4 class="">Score</h4>
        <div class="flex items-center gap-1">
          <h4>{{ value.score }}</h4>
          <h4 v-if="value.status === 'COMPLETE'" class="">
            ({{ value.par + value.score }})
          </h4>
        </div>
      </div>

      <div class="flex items-center justify-end pr-2">
        <h4 class="font-semibold">{{ formatDate(value.created_at) }}</h4>
      </div>
    </div>
  </section>
</template>

<!-- 
<div
        v-if="game_choosen"
      class="grid grid-cols-4 gap-3 border-b border-gray-300 min-h-[75px]"
      >
      <div class="flex flex-col justify-center pl-2">
        <h4 class="font-semibold text-xl">{{ game_choosen.club_name }}</h4>
        <div class="flex gap-1">
          <h4 class="m-0">Par {{ game_choosen.par }} -</h4>
          <h4 class="m-0">{{ game_choosen.score }}</h4>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <h4 class="">Score</h4>
        <div class="flex items-center gap-1">
          <h4>{{ game_choosen.score }}</h4>
        </div>
      </div>

      <div class="flex items-center justify-end pr-2">
        <h4 class="font-semibold">{{ formatDate(game_choosen.created_at) }}</h4>
      </div>
      
    </div> -->