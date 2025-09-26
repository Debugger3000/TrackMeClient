<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  message: string;
}>();

let cur = ref<boolean>(false);

watch(
  () => props.message,
  () => {
    console.log("weatch trggiar, DONUT");
    if (props.message) {
      // set cur to true
      cur.value = true;
      displayMessage();
    }
  }
);

function displayMessage() {
  setTimeout(() => {
    cur.value = false;
  }, 3000);
}

// const currentShape = computed(() => SHOTPATHSVG[props.shotShape as keyof typeof SHOTPATHSVG]);

// lifecycle hooks
onMounted(() => {
  console.log("Stats shot shape component page just mounted");
});
</script>

<!-- <style src="./shotshape.css"></style> -->

<template>
  <!-- contains specs of form (shotpath, contact, clubtype) -->
  <!-- shot path div -->
  <div v-if="cur" class="">
    <h4 class="text-red-700 font-semibold text-2xl">{{ props.message }}</h4>
  </div>
</template>
