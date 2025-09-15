<script setup lang="ts">
import { onMounted, watch } from "vue";
import type { ICourseView } from "../../../../types/course";
import type { IGameView } from "../../../../types/game";
import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  // gameData: IGameView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

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
  <section class="me-border"></section>
</template>
