

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import { useRouter } from "vue-router";
import { routeTo } from "../../router";
import type { IAuthResponse } from "../../types/Iauth";
import { useLoggedStore } from "../../stores/globalStore";

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

      const res = await useFetch<IAuthResponse>("/auth/register","POST",{
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
          const log = useLoggedStore();
          log.login();
          routeTo('/home', router)
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

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
  console.log("api: ",import.meta.env.VITE_SERVER_API);
});
</script>

<template>
  <!-- Register form -->
 
    <!-- form -->
    <form @submit.prevent="registerSubmit" class="flex flex-col justify-center border rounded p-4">
        <legend class="font-semibold text-4xl text-green-800">Register</legend>
        <!-- username -->
        <h4 class="font-semibold mb-1 mt-5">Username</h4>
        <input v-model="registerForm.username" type="text" class="border rounded p-1"></input>

        <!-- password -->
        <h4 class="font-semibold mb-1 mt-5">Password</h4>
        <input v-model="registerForm.password" type="text" class="border rounded p-1"></input>
        <!-- submit -->
        <section class="mt-5 flex justify-center">
            <div class="">
                <button type="submit" class="bg-green-800 text-xl p-2 rounded font-semibold">Submit</button>
            </div>
        </section>
    </form>

    <div class="flex justify-center mt-5 border-top">
  <button @click="routeTo('/login', router)">Login</button>
    </div>
  
  <!-- <button @click="increment">Count is: {{ count }}</button> -->
</template>
