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

const userStore = useUserStore();

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

async function getUserData() {
  console.log("calling useFetch for getUserData");
  try {
    const res = await useFetch<IUser>("/user/userinfo", "GET", undefined);

    if (res === 401) {
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getUserDAta res, is undefined");
    }
    // good response...
    else {
      // set local Storage for username
      // userStore.setUser(res);
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
  <section>
    <h1>Home Page haha</h1>
  </section>
  <button @click="increment">Count is: {{ count }}</button>
</template>
