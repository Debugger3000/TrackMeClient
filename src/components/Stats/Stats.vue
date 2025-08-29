<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import {
  type IShotPaths,
  type IShotType,
  CLUBTYPE,
  SHOTPATH,
  SHOTCONTACT,
  type IShotContact,
} from "../../types/shot";
import shape from "./shape.vue";

const router = useRouter();

// club type
let curClubType = ref<IShotType>();
const clubs = Object.entries(CLUBTYPE);

// current shot path
let curShotPath = ref<IShotPaths>("straight");
const paths = Object.entries(SHOTPATH);

// contact
let curContactType = ref<IShotContact>("center");
const contacts = Object.entries(SHOTCONTACT);

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
function changeClub(club: IShotType) {
  curClubType.value = club;
}
function changeContact(contact: IShotContact) {
  curContactType.value = contact;
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
  <section class="">
    <!-- little title intro -->
    <!-- <div class="flex justify-center mt-4 pb-4 border-b border-green-900">
      <h2 class="text-3xl">Welcome, to stats page !!!</h2>
    </div> -->

    <!-- contains specs of form (shotpath, contact, clubtype) -->
    <section class="">
      <!-- shot path div -->
      <div class="">
        <shape :shotShape="curShotPath" />
      </div>

      <!-- <shape :shotShape="curShotPath" /> -->

      <!-- control buttons for club shot path -->
      <section class="grid grid-cols-4 gap-1 rounded mt-2">
        <div
          v-for="[value, path] in paths"
          class="shot-path-buttons"
          :class="{ 'bg-gray-400': curShotPath === `${path}` }">
          <button @click="changePath(path)" class="w-full h-full">
            {{ path }}
          </button>
        </div>
      </section>

      <!-- club type selection -->
      <section class="grid grid-cols-5 gap-1 mt-4 py-4 border-t border-b">
        <div
          class="shot-path-buttons"
          v-for="[value, club] in clubs"
          :class="{ 'bg-gray-400': curClubType === `${club}` }">
          <button @click="changeClub(club)" class="w-full h-full">
            {{ club }}
          </button>
        </div>
      </section>

      <!-- Contact type -->
      <section class="grid grid-cols-4 gap-1 mt-4 pb-8 border-b">
        <div
          class="shot-path-buttons"
          v-for="[value, contact] in contacts"
          :class="{ 'bg-gray-400': curContactType === `${contact}` }">
          <button @click="changeContact(contact)" class="w-full h-full">
            {{ contact }}
          </button>
        </div>
      </section>

      <!-- submit button -->
      <section class="flex justify-center mt-4">
        <button class="p-4 rounded-xl bg-red-800 mt-4">Submit</button>
      </section>
    </section>
  </section>
</template>
