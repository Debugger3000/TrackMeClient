<script setup lang="ts">
import { onMounted, provide, ref, watch } from "vue";
// import type { ICourseView } from "../../../../types/course";
import { type IGameView } from "../../../../types/game";
// import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
import { formatDate } from "../helpers/helpers";
import { routeTo } from "../../../../router";
import { useFetch } from "../../../../api/authFetch";
import gameSearch from "../helpers/game-search.vue";
import gameOverview from "../overviews/game-overview.vue";

const router = useRouter();

const props = defineProps<{
  title: string;
  data_point: string;
  //   gameData: IGameView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
  //   console.log("Hole in game-overview: ", props.gameData);
});
</script>

<style src="../holeandshot/mainstyles.css"></style>

<template>
  <div class="grid-card">
    <h4 class="card-title">{{ props.title }}</h4>
    <div class="card-divider"></div>
    <h4 class="card-data">
      {{ props.data_point }}
    </h4>
  </div>
</template>
