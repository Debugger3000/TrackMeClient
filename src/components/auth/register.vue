

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import { useRouter } from "vue-router";
import { routeTo } from "../../router";
import type { IAuthResponse, IUserCredentials } from "../../types/Iauth";

const router = useRouter();
// reactive state
const count = ref(0);

// form vars
const registerForm = ref({
    username: "",
    password: ""
});

// handle register error message
const errorMessage = ref("");

const registerSubmit = async () => {
    console.log("form data: ",registerForm.value);
    console.log(`url route fetching: ${import.meta.env.VITE_SERVER_API}/register`);
    try {

      const res = await useFetch<IAuthResponse,IUserCredentials>("/auth/register","POST",{
        username: registerForm.value.username,
        password: registerForm.value.password
      });

      console.log('res object after useFetch ', res);

      // bad 401 
      // shouldnt have to technially check for bad 401 response
      if(res === 401){
        routeTo('/login', router)
      }
      else if(res === undefined){
        throw new Error();
      }
      // good
      else{
        // check for success
        if(res.success){
          localStorage.setItem("isLoggedIn","true");
          // const log = useLoggedStore();
          // log.login();
          routeTo('/games', router)
        }
        else{
          errorMessage.value = res.message || "Something went wrong";
        }
      }

      
    
    // optionally store data in Pinia or localStorage
  } catch (err: unknown) {
    if(err instanceof Error){
      errorMessage.value = err.message || 'Something went wrong';
      console.log("Caught error: ",err.message);
    }
    
    console.log("Caught error: ",err);
  }

};


// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
  console.log("api: ",import.meta.env.VITE_SERVER_API);
});
</script>

<template>
  <!-- Register form -->
   <section class="">
    <div class="flex items-center gap-3 p-2 bg-01">
      <i class="bi bi-amd text-2xl text-white"></i>
      <h4 class="text-3xl font-semibold text-white">TrackMe</h4>
    </div>
    

    <section class="border-default rounded p-4 mt-16 mx-16">

 
    <!-- form -->
    <form @submit.prevent="registerSubmit" class="flex flex-col justify-center">
        <legend class="font-semibold text-2xl text-center color-01">Register</legend>
        <!-- username -->
        <h4 class="font-semibold mb-1 mt-5">Username</h4>
        <input v-model="registerForm.username" type="text" class="border-default rounded p-1"></input>

        <!-- password -->
        <h4 class="font-semibold mb-1 mt-3">Password</h4>
        <input v-model="registerForm.password" type="text" class="border-default rounded p-1"></input>
        <!-- submit -->
        <section class="mt-3 flex justify-center">
            <div class="">
                <button type="submit" class="bg-01 rounded-lg text-white">Submit</button>
            </div>
        </section>
    </form>

    <div class="flex justify-center mt-3 border-t border-gray-300">
      <button @click="routeTo('/login', router)">Login</button>
    </div>

    </section>
  </section>
</template>
