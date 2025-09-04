<script setup lang="ts">
import { onMounted } from "vue";

import { SHOTPATHSVG } from "../../types/shot";

const props = defineProps<{
  shotShape: keyof typeof SHOTPATHSVG;
}>();

// const currentShape = computed(() => SHOTPATHSVG[props.shotShape as keyof typeof SHOTPATHSVG]);

// lifecycle hooks
onMounted(() => {
  console.log("Stats shot shape component page just mounted");
  // call get user info...

  console.log("current shape: ", props.shotShape);
  console.log("cur d: ", SHOTPATHSVG[props.shotShape].d);
  console.log("cur class: ", SHOTPATHSVG[props.shotShape].class);
});
</script>

<!-- <style src="./shotshape.css"></style> -->

<template>
  <!-- contains specs of form (shotpath, contact, clubtype) -->
  <!-- shot path div -->
  <div class="">
    <svg viewBox="0 0 200 400" class="svg-range">
      <!-- Front mat / tee box -->
      <polygon points="60,390 140,390 130,370 70,370" fill="#8bc34a" />

      <!-- Back mat / landing area -->
      <polygon points="80,150 120,150 115,140 85,140" fill="#4caf50" />
      <path
        :d="SHOTPATHSVG[props.shotShape].d"
        :class="SHOTPATHSVG[props.shotShape].class"
        class="shot-path" />
    </svg>
  </div>
</template>
