<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import login from "./components/auth/login.vue";
// import Register from "./components/auth/register.vue";
import { ref } from "vue";
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

// nav bar at bottom
const navBar: { page: string; icon: string, display_text: string }[] = [
  { page: "home", icon: "bi-bar-chart", display_text: "Home" },
  { page: "games", icon: "bi-controller", display_text: "Games"  },
  { page: "stats-main", icon: "bi-bar-chart", display_text: "Range"  },
  { page: "profile", icon: "bi-person", display_text: "Me"  },
];

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

// send to profile
function setIsLoggedIn() {
  isLoggedIn.value = "false";
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
router.beforeEach((_to, _from, next) => {
  // syncStorage(); // re-sync before navigating
  isLoggedIn.value = localStorage.getItem("isLoggedIn") || "";
  next();
});
</script>

<template>
  <section class="h-screen grid grid-rows-[1fr_auto]">
    <!-- header -->
    <!-- <header v-if="isLoggedIn.valueOf() === 'true'">
      <nav class="flex p-2 justify-between">
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
    </header> -->
    <main class="relative overflow-y-auto app-main-bg">
      <!-- global pop up... -->
      <section
        v-if="globalPopUp"
        class="absolute border rounded p-4 flex flex-row gap-3 top-1/2 left-1/2 z-99 bg-[#242424] opacity-[0.9]">
        <h4>Message:</h4>
        <h4>{{ globalPopUp }}</h4>
      </section>

      <section class="h-full">
        <!-- Main router view here -->
        <RouterView
          class=""
          :username="username"
          :isLoggedIn="isLoggedIn"
          :syncStorage="syncStorage"
          :setLogged="setIsLoggedIn"
          :setPopUp="controlPopUp" />
      </section>
    </main>
    <!-- Navigation bar at bottom of screen -->
    <section
      v-if="isLoggedIn.valueOf() === 'true'"
      class="grid grid-cols-4"
      id="footer-menu">
      <!-- home tab -->
      <div
        v-for="value in navBar"
        @click="
          {
            menuClicked(value.page);
          }
        "
        class="flex flex-col justify-center items-center p-1 bg-white"
        >
        <i class="bi text-2xl font-medium" :class="[value.icon, {
          'text-main-theme': selectedTab.valueOf() === `${value.page}`,
          'color-01': selectedTab.valueOf() !== `${value.page}`
        }]" ></i>
        <h4 class="font-medium" :class="{
          'text-main-theme': selectedTab.valueOf() === `${value.page}`
        }">{{ value.display_text }}</h4>
      </div>
    </section>
  </section>
</template>
