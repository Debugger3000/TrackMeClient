<script setup lang="ts">
import { onMounted, watch } from "vue";
import type { ICourseView } from "../../../types/course";
import type { IGameView } from "../../../types/game";
import { routeTo } from "../../../router";
import { useRouter } from "vue-router";

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

  router.push({
    name: "game-view",
    params: { game_id },
    query: { holes: holes }, // or whatever string you need
  });
}

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
});
</script>

<template>
  <section class="me-border">
    <div
      v-for="(value, index) in props.gameData"
      :key="index"
      class="grid grid-cols-3 gap-3 border-b"
      @click="
        {
          gameSelected(value.id, value.holes);
        }
      ">
      <div class="flex items-center">
        <h4>{{ value.club_name }}</h4>
      </div>

      <div class="flex flex-col gap-1">
        <h4 class="m-0">Holes: {{ value.holes }}</h4>
        <h4 class="m-0">Par: {{ value.par }}</h4>
      </div>
    </div>
  </section>
</template>
