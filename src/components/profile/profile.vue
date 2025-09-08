<script setup lang="ts">
import { onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { type IAuthResponse } from "../../types/Iauth";

const props = defineProps<{
  username: String;
  setLogged?: () => void;
  setPopUp?: (message: string, time: number) => void;
}>();

const router = useRouter();

async function logout() {
  const res = await useFetch<IAuthResponse>("/auth/logout", "POST", undefined);
  if (res === undefined) {
  } else if (res === 401) {
    console.log("401 from logout");
  } else {
    // set on login.vue
    localStorage.setItem("isLoggedIn", "false");
    // set on home.vue
    localStorage.setItem("username", "");
    localStorage.setItem("id", "");
    if (props.setLogged) {
      props.setLogged();
    }
    if (props.setPopUp) {
      props.setPopUp(res.message, 2000);
    }
    // log.isLoggedIn = false;
    routeTo("/login", router);
    // controlPopUp(res.message, 2000);
  }

  // do a little pop up on screen for if logout was successful
}

// lifecycle hooks
onMounted(() => {
  // call get user info...
});
</script>

<template>
  <!-- Home page -->
  <section class="p-2">
    <!-- display contact stats -->
    <section class="flex justify-between items-center mt-5 border-b pb-1">
      <div class="">
        <h4 class="font-semibold text-3xl text-gray-200">Profile</h4>
      </div>

      <div v-if="username.valueOf()">
        <h4 class="text-2xl text-red-800">{{ username.valueOf() }}</h4>
      </div>
    </section>

    <!-- bottom page, logout -->
    <section class="flex justify-center items-center">
      <div class="bg-blue-400 p-1 rounded border">
        <button @click="logout">Logout</button>
      </div>
    </section>
  </section>
</template>
