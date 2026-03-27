<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { routeTo } from "../../router";
import { useFetch } from "../../api/authFetch";
import { useLoggedStore } from "../../stores/globalStore";
import type { IAuthResponse, IUserCredentials } from "../../types/Iauth";

const router = useRouter();
const logStore = useLoggedStore();

const errorMessage = ref("");

const loginForm = ref({
  username: "",
  password: "",
});

const login = async () => {
  try {
    const res = await useFetch<IAuthResponse, IUserCredentials>(
      "/auth/login",
      "POST",
      {
        username: loginForm.value.username,
        password: loginForm.value.password,
      }
    );

    if (res === 401) {
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error();
    } else {
      if (res.success) {
        logStore.login(); // <-- this is all you need
        routeTo("/games", router);
      } else {
        errorMessage.value = res.message || "Something went wrong";
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      errorMessage.value = err.message || "Something went wrong";
    }
    console.log("Caught error: ", err);
  }
};

async function checkRefreshTokenOnLoad() {
  try {
    const res = await useFetch<IAuthResponse>(
      "/auth/onLoadTokenCheck",
      "POST",
      undefined
    );

    if (res === 401) {
      // stay on login
    } else if (res === undefined) {
      throw new Error();
    } else {
      if (res.success) {
        logStore.login(); // <-- also here
        routeTo("/games", router);
      }
    }
  } catch (err: unknown) {
    console.log("Caught error: ", err);
  }
}

onMounted(() => {
  checkRefreshTokenOnLoad();
});
</script>

<template>
  <section class="">
    <div class="flex items-center gap-3 p-2 bg-01">
      <i class="bi bi-amd text-2xl text-white"></i>
      <h4 class="text-3xl font-semibold text-white">TrackMe</h4>
    </div>

    <section class="border-default rounded p-4 mt-16 mx-16">
      <form @submit.prevent="login" class="flex flex-col justify-center">
        <legend class="font-semibold text-2xl color-01 text-center">Login</legend>
        <h4 class="font-semibold mb-1 mt-3 color-01">Username</h4>
        <input v-model="loginForm.username" type="text" class="border-default rounded p-1" />
        <h4 class="font-semibold mb-1 mt-3 color-01">Password</h4>
        <input v-model="loginForm.password" type="password" class="border-default rounded p-1" />
        <div v-if="errorMessage"><h4 class="text-red-600">{{ errorMessage }}</h4></div>
        <section class="mt-3 flex justify-center">
          <button type="submit" class="bg-01 rounded-lg text-white">Submit</button>
        </section>
      </form>
      <div class="flex justify-center mt-3 border-t border-gray-300">
        <button @click="routeTo('/register', router)">Register</button>
      </div>
    </section>
  </section>
</template>