<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
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
  <!-- Home page -->
  <!-- contains specs of form (shotpath, contact, clubtype) -->
  <!-- shot path div -->
  <div>
    <svg viewBox="0 0 200 400" class="svg-range">
      <!-- Front mat / tee box -->
      <polygon points="60,390 140,390 130,370 70,370" fill="#8bc34a" />

      <!-- Back mat / landing area -->
      <polygon points="80,150 120,150 115,140 85,140" fill="#4caf50" />
      <path
        :d="SHOTPATHSVG[props.shotShape].d"
        :class="SHOTPATHSVG[props.shotShape].class"
        class="shot-path" />

      <!-- <path d="M100,380 C100,300 100,200 100,75" class="shot-path straight" />
      <path d="M100,380 C120,50 150,10 100,145" class="shot-path fade" />
      <path d="M100,380 C65,50 70,10 100, 145" class="shot-path draw" />

      <path d="M100,380 C125,50 150,5 140, 145" class="shot-path push" />

      <path d="M100,380 C75,50 50,5 60,145" class="shot-path pull" />
      
      <path d="M100,380 C25,200 10,10 160,145" class="shot-path slice" />

      <path d="M100,380 C110,50 130,75 180,145" class="shot-path push-slice" />
      
      <path d="M100,380 C175,200 190,10 40,145" class="shot-path hook" />
      <path d="M100,380 C90,50 70,75 20,145" class="shot-path pull-hook" /> -->
    </svg>
  </div>
</template>
