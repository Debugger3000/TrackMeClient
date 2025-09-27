<script setup lang="ts">
import { onMounted, watch } from "vue";
// import type { ICourseView } from "../../../../types/course";
import type { IGameView } from "../../../../types/game";
// import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
import { formatDate } from "../helpers/helpers";

const router = useRouter();

const props = defineProps<{
  gameData: IGameView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

watch(
  () => props.gameData,
  () => {
    console.log("course overview watcher triggered");
  }
);

// course selected to create game on
function gameSelected(game_id: number, holes: number) {
  // routeTo(`/game-view/${game_id}?`, router);

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
  <section class="border-default">
    <div
      v-for="(value, index) in props.gameData"
      :key="index"
      class="grid grid-cols-3 gap-3 border-b border-gray-300 min-h-[75px]"
      @click="
        {
          gameSelected(value.id, value.holes);
        }
      ">
      <div class="flex flex-col justify-center pl-2">
        <h4 class="font-semibold text-xl">{{ value.club_name }}</h4>
        <div class="flex gap-1">
          <h4 class="m-0">Par {{ value.par }} -</h4>
          <h4 class="m-0">{{ value.holes }}</h4>
        </div>
      </div>
      <div class="flex items-center justify-center gap-1">
        <h4 class="text-xl">Score: {{ value.score }}</h4>
        <h4 v-if="value.status === 'COMPLETE'" class="text-xl">
          ({{ value.par + value.score }})
        </h4>
      </div>

      <div class="flex items-center justify-end pr-2">
        <h4 class="font-semibold">{{ formatDate(value.created_at) }}</h4>
      </div>
    </div>
  </section>
</template>
