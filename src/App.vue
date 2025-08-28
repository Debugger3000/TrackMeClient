<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import login from "./components/auth/login.vue";
// import Register from "./components/auth/register.vue";
import { ref } from "vue";
import { useFetch } from "./api/authFetch";
import type { IAuthResponse } from "./types/Iauth";
import { useRouter } from "vue-router";
import { routeTo } from "./router";
// import { useLoggedStore, useUserStore } from "./stores/globalStore";
// import { storeToRefs } from "pinia";

const router = useRouter();

const globalPopUp = ref("");
// const log = useLoggedStore();
// const userStore = useUserStore();

// const { username } = storeToRefs(userStore);

// let selectedTab: string = "home";
let selectedTab = ref("home");

// refs for username and logged in
let username = ref("");
let isLoggedIn = ref("");

// control menu click
function menuClicked(tabClicked: string) {
  selectedTab.value = tabClicked;
  routeTo(tabClicked, router);
  console.log("selected Tab value: ", selectedTab);
}

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
    isLoggedIn.value = "false";
    username.value = "";
    setTimeout(() => {}, 500);
    // log.isLoggedIn = false;
    routeTo("/login", router);
    controlPopUp(res.message, 2000);
  }

  // do a little pop up on screen for if logout was successful
}

// sync app.vue with user data after home calls it
function syncStorage(usernameRef: string) {
  // username.value = localStorage.getItem("username");
  console.log("sync storage from parent has ran !");
  // set username ref for app.vue
  // home grabs the data and calls this function
  username.value = usernameRef;

  // isLoggedIn.value = localStorage.getItem("isLoggedIn");
}

// router guard, check whether user is logged in before every re route
router.beforeEach((to, from, next) => {
  // syncStorage(); // re-sync before navigating
  isLoggedIn.value = localStorage.getItem("isLoggedIn") || "";
  next();
});
</script>

<template>
  <section class="h-screen grid grid-rows-[auto_1fr_auto]">
    <!-- header -->
    <header v-if="isLoggedIn.valueOf() === 'true'">
      <nav class="bg-gray-800 opacity-50 flex p-2 justify-between">
        <div class="flex items-center">
          <h4 class="text-2xl text-green-600">TrackMe</h4>
        </div>
        <div v-if="username.valueOf()">
          <h4 class="text-2xl text-red-800">{{ username.valueOf() }}</h4>
        </div>
        <div
          v-if="isLoggedIn.valueOf() === 'true'"
          class="bg-blue-700 p-1 rounded border">
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

      <section>
        <!-- Main router view here -->
        <RouterView
          :username="username"
          :isLoggedIn="isLoggedIn"
          :syncStorage="syncStorage" />
      </section>
    </main>
    <!-- Navigation bar at bottom of screen -->
    <section
      v-if="isLoggedIn.valueOf() === 'true'"
      class="grid grid-cols-4 bg-gray-800">
      <!-- home tab -->
      <div
        @click="
          {
            menuClicked('home');
          }
        "
        class="flex justify-center items-center p-1"
        :class="{
          'bg-gray-700': selectedTab.valueOf() === 'home',
          'bg-gray-800': selectedTab.valueOf() !== 'home',
        }">
        <i class="bi bi-house text-2xl text-white"></i>
        <!-- <i class="bi bi-house-fill"></i> -->
      </div>

      <!-- start sesssion tab -->
      <div
        @click="
          {
            menuClicked('start');
          }
        "
        class="flex justify-center items-center p-1"
        :class="{
          'bg-gray-700': selectedTab.valueOf() === 'start',
          'bg-gray-800': selectedTab.valueOf() !== 'start',
        }">
        <i class="bi bi-alarm text-2xl text-white"></i>
      </div>

      <!-- stats tab -->
      <!-- start sesssion tab -->
      <div
        @click="
          {
            menuClicked('stats');
          }
        "
        class="flex justify-center items-centerp-1"
        :class="{
          'bg-gray-700': selectedTab.valueOf() === 'stats',
          'bg-gray-800': selectedTab.valueOf() !== 'stats',
        }">
        <i class="bi bi-bar-chart text-2xl text-white"></i>
      </div>

      <!-- profile tab -->
      <!-- start sesssion tab -->
      <div
        @click="
          {
            menuClicked('profile');
          }
        "
        class="flex justify-center items-center p-1"
        :class="{
          'bg-gray-700': selectedTab.valueOf() === 'profile',
          'bg-gray-800': selectedTab.valueOf() !== 'profile',
        }">
        <i class="bi bi-person text-2xl text-white"></i>
      </div>
    </section>
  </section>

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
