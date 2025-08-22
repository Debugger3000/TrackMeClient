<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import login from "./components/auth/login.vue";
// import Register from "./components/auth/register.vue";
import { ref } from "vue";
import { useFetch } from "./api/authFetch";
import type { IAuthResponse } from "./types/Iauth";
import { useRouter } from "vue-router";
import { routeTo } from "./router";
import { useLoggedStore, useUserStore } from "./stores/globalStore";
import { storeToRefs } from "pinia";

const router = useRouter();

const globalPopUp = ref("");
// const log = useLoggedStore();
// const userStore = useUserStore();

// const { username } = storeToRefs(userStore);

const username = localStorage.getItem("username");
const isLoggedIn = localStorage.getItem("isLoggedIn");

// global variables

function controlPopUp(message: string, time: number) {
  globalPopUp.value = message;

  setTimeout(() => {
    globalPopUp.value = "";
  }, time);
}

async function logout() {
  const res = await useFetch<IAuthResponse>("/auth/logout", "POST", undefined);
  if (res === undefined) {
  } else if (res === 401) {
    console.log("401 from logout");
  } else {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("username", "");
    setTimeout(() => {}, 500);
    // log.isLoggedIn = false;
    routeTo("/login", router);
    controlPopUp(res.message, 2000);
  }

  // do a little pop up on screen for if logout was successful
}
</script>

<template>
  <!-- header -->
  <header>
    <nav class="bg-gray-800 opacity-50 flex p-2 justify-between">
      <div>
        <h4 class="text-3xl text-green-800">TrackMe</h4>
      </div>
      <div v-if="username">
        <h4 class="text-3xl text-red-800">{{ username }}</h4>
      </div>
      <div v-if="isLoggedIn === 'true'" class="bg-blue-700 p-2 rounded border">
        <button @click="logout">Logout</button>
      </div>
    </nav>
  </header>
  <main class="">
    <!-- global pop up... -->
    <section
      v-if="globalPopUp"
      class="absolute border rounded p-2 flex flex-row gap-3">
      <h4>Message:</h4>
      <h4>{{ globalPopUp }}</h4>
    </section>
    <!-- Main router view here -->
    <RouterView />
  </main>

  <!-- <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <login /> -->
  <!-- <Register /> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
