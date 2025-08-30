<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/globalStore";

const router = useRouter();

const props = defineProps<{
  username: String;
  isLoggedIn: Boolean;
  syncStorage?: (username: string) => void;
}>();

// reactive state
const count = ref(0);

// const userStore = useUserStore();
// let username = ref();
// username.value = localStorage.getItem("username");

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

// standardized way of making REST API calls, and handling 401s / 200s
async function getUserData() {
  console.log("calling useFetch for getUserData");
  try {
    const res = await useFetch<IUser>("/user/userinfo", "GET", undefined);

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getUserDAta res, is undefined");
    }
    // good response...
    else {
      // set local Storage for username
      // userStore.setUser(res);
      props.syncStorage?.(res.username);
      localStorage.setItem("username", res.username);
      localStorage.setItem("id", res.id.toString());
    }
  } catch (error) {
    console.log("Error in getUserData in Home component: ", error);
  }
}

// lifecycle hooks
onMounted(() => {
  // call get user info...
  const callGet = async () => {
    await getUserData();
  };

  callGet();

  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <!-- Home page -->
  <section class="p-2">
    <!-- little title intro -->
    <div class="flex justify-center mt-4 pb-4 border-b border-green-900">
      <h2 class="text-3xl">Welcome, {{ username }}</h2>
      <h2 class="text-2xl">islogger, {{ isLoggedIn }}</h2>
    </div>
  </section>
</template>
