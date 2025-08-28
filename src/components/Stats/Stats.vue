<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import type { IShotPaths } from "../../types/shot";
import shape from "./shape.vue";

const router = useRouter();

// club type
let clubType = ref();

// current shot path
let curShotPath = ref<IShotPaths>("straight");

// const userStore = useUserStore();
const username = localStorage.getItem("username");

async function getUserData() {
  console.log("Grabbing stats for user");
  try {
  } catch (error) {
    console.log("Error in getUserData in Home component: ", error);
  }
}

// ----------------------

function changePath(path: IShotPaths) {
  curShotPath.value = path;
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

    <!-- contains specs of form (shotpath, contact, clubtype) -->
    <section class="p-2">
      <!-- shot path div -->
      <div class="rounded-2xl">
        <shape :shotShape="curShotPath" />
      </div>

      <!-- <shape :shotShape="curShotPath" /> -->

      <!-- control buttons for club shot path -->
      <section class="grid grid-cols-4 gap-1 rounded mt-2">
        <div
          class="shot-path-buttons"
          :class="{ 'bg-gray-400': curShotPath === 'pullHook' }">
          <button @click="changePath('pullHook')" class="w-full h-full">
            Pull-Hook
          </button>
        </div>

        <div class="shot-path-buttons">
          <button
            @click="changePath('hook')"
            class="w-full h-full"
            :class="{ 'bg-gray-400': curShotPath === 'hook' }">
            Hook
          </button>
        </div>

        <div class="shot-path-buttons">
          <button
            @click="changePath('pull')"
            class="w-full h-full"
            :class="{ 'bg-gray-400': curShotPath === 'pull' }">
            Pull
          </button>
        </div>

        <div class="shot-path-buttons">
          <button
            @click="changePath('fade')"
            class="w-full h-full"
            :class="{ 'bg-gray-400': curShotPath === 'fade' }">
            Fade
          </button>
        </div>

        <div class="shot-path-buttons">
          <button
            @click="changePath('straight')"
            class="w-full h-full"
            :class="{ 'bg-gray-400': curShotPath === 'straight' }">
            Straight
          </button>
        </div>

        <div class="shot-path-buttons">
          <button
            @click="changePath('draw')"
            class="w-full h-full"
            :class="{ 'bg-gray-400': curShotPath === 'draw' }">
            Draw
          </button>
        </div>

        <div class="shot-path-buttons">
          <button
            @click="changePath('push')"
            class="w-full h-full"
            :class="{ 'bg-gray-400': curShotPath === 'push' }">
            Push
          </button>
        </div>

        <div class="shot-path-buttons">
          <button
            @click="changePath('slice')"
            class="w-full h-full"
            :class="{ 'bg-gray-400': curShotPath === 'slice' }">
            Slice
          </button>
        </div>

        <div class="shot-path-buttons">
          <button
            @click="changePath('pushSlice')"
            class="w-full h-full"
            :class="{ 'bg-gray-400': curShotPath === 'pushSlice' }">
            Push-Slice
          </button>
        </div>
      </section>
    </section>
  </section>
</template>
