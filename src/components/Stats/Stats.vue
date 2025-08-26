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

<template>
  <!-- Home page -->
  <section class="p-2">
    <!-- little title intro -->
    <div class="flex justify-center mt-4 pb-4 border-b border-green-900">
      <h2 class="text-3xl">Welcome, to stats page !!!</h2>
    </div>
  </section>
</template>
