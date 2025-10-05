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
  <section class="">
    <!-- display contact stats -->
    <section class="flex justify-between items-center bg-01 p-2 h-[55px]">
      <h4 class="font-semibold text-3xl text-white">Profile</h4>
      <div class="text-white rounded-lg">
        <button @click="logout">Logout</button>
      </div>
      <!-- <div v-if="username.valueOf()">
        <h4 class="text-2xl text-red-800">{{ username.valueOf() }}</h4>
      </div> -->
    </section>
  </section>
</template>
