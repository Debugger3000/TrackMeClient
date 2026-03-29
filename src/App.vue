<script setup lang="ts">
import { computed } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { routeTo } from "./router";
import { useLoggedStore } from "./stores/globalStore";
//import { storeToRefs } from "pinia";

const router = useRouter();
const logStore = useLoggedStore();
//const isLoggedIn = computed(() => logStore.isLoggedIn);
// const userStore = useUserStore();

const showNavBar = computed(() => {
  return router.currentRoute.value.name !== "login";
});

// const { isLoggedIn } = storeToRefs(logStore);
// const { user } = storeToRefs(userStore);

const globalPopUp = ref("");
let selectedTab = ref("games");

const navBar: { page: string; icon: string; display_text: string }[] = [
  { page: "/games", icon: "bi-controller", display_text: "Games" },
  { page: "/stats-main", icon: "bi-bar-chart", display_text: "Range" },
  { page: "/profile", icon: "bi-person", display_text: "Me" },
];

function menuClicked(tabClicked: string) {
  selectedTab.value = tabClicked;
  routeTo(tabClicked, router);
}

function controlPopUp(message: string, time: number) {
  globalPopUp.value = message;
  setTimeout(() => {
    globalPopUp.value = "";
  }, time);
}

router.beforeEach((_to, _from, next) => {
  if (_to.meta.requiresAuth && !logStore.isLoggedIn) {
    return next({ name: "login" });
  }
  next();
});
</script>

<template>
  <section class="h-[100dvh] grid grid-rows-[1fr_auto]">
    <main class="relative overflow-y-auto app-main-bg">
      <section
        v-if="globalPopUp"
        class="absolute border rounded p-4 flex flex-row gap-3 top-1/2 left-1/2 z-99 bg-[#242424] opacity-[0.9]">
        <h4>Message:</h4>
        <h4>{{ globalPopUp }}</h4>
      </section>

      <section class="h-full">
        <RouterView :setPopUp="controlPopUp" />
      </section>
    </main>

    <section
      v-if="showNavBar"
      class="grid grid-cols-3"
      id="footer-menu">
      <div
        v-for="value in navBar"
        :key="value.page"
        @click="menuClicked(value.page)"
        class="flex flex-col justify-center items-center p-1 bg-white">
        <i class="bi text-2xl font-medium" :class="[value.icon, {
          'text-main-theme': selectedTab === value.page,
          'color-01': selectedTab !== value.page
        }]"></i>
        <h4 class="font-medium" :class="{
          'text-main-theme': selectedTab === value.page
        }">{{ value.display_text }}</h4>
      </div>
    </section>
  </section>
</template>
