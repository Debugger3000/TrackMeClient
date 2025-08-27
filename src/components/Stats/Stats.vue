<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/globalStore";

const router = useRouter();
// reactive state
const count = ref(0);

// const userStore = useUserStore();
const username = localStorage.getItem("username");

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

async function getUserData() {
  console.log("Grabbing stats for user");
  try {
  } catch (error) {
    console.log("Error in getUserData in Home component: ", error);
  }
}

// lifecycle hooks
onMounted(() => {
  console.log("Stats page just mounted");
  // call get user info...
});
</script>

<style src="./shotshape.css"></style>

<template>
  <!-- Home page -->
  <section class="flex justify-center p-2">
    <!-- little title intro -->
    <!-- <div class="flex justify-center mt-4 pb-4 border-b border-green-900">
      <h2 class="text-3xl">Welcome, to stats page !!!</h2>
    </div> -->

    <svg viewBox="0 0 200 400" class="svg-range">
      <!-- Front mat / tee box -->
      <polygon points="60,390 140,390 130,370 70,370" fill="#8bc34a" />

      <!-- Back mat / landing area -->
      <polygon points="80,150 120,150 115,140 85,140" fill="#4caf50" />

      <!-- Straight -->
      <path d="M100,380 C100,300 100,200 100,75" class="shot-path straight" />
      <!-- Fade (curves gently to the right) -->
      <path d="M100,380 C120,50 150,10 100,145" class="shot-path fade" />
      <!-- Draw (curves gently to the left) -->
      <path d="M100,380 C65,50 70,10 100, 145" class="shot-path draw" />

      <path d="M100,380 C125,50 150,5 140, 145" class="shot-path push" />

      <path d="M100,380 C75,50 50,5 60,145" class="shot-path pull" />
      <!-- <path d="M100,380 C80,320 70,180 60,20" class="shot-path draw" /> -->
      <!-- Slice (sharp curve right) -->
      <path d="M100,380 C25,200 10,10 160,145" class="shot-path slice" />

      <path d="M100,380 C110,50 130,75 180,145" class="shot-path push-slice" />
      <!-- Hook (sharp curve left) -->
      <path d="M100,380 C175,200 190,10 40,145" class="shot-path hook" />
      <path d="M100,380 C90,50 70,75 20,145" class="shot-path pull-hook" />
    </svg>
  </section>
</template>
