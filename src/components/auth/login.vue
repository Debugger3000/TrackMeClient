<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { routeTo } from "../../router";
import { useFetch } from "../../api/authFetch";
import type { IAuthResponse, IUserCredentials } from "../../types/Iauth";

const router = useRouter();

// handle login error message
const errorMessage = ref("");

const loginForm = ref({
    username: "",
    password: ""
});

const login = async () => {
  try {

      const res = await useFetch<IAuthResponse,IUserCredentials>("/auth/login","POST", {
        username: loginForm.value.username,
        password: loginForm.value.password
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

async function checkRefreshTokenOnLoad() {

  try {

      const res = await useFetch<IAuthResponse>("/auth/onLoadTokenCheck","POST", undefined);

      console.log('res object after useFetch checkRefreshTokenOnLoad', res);

      // bad 401 
      // shouldnt have to technially check for bad 401 response
      if(res === 401){
        // do nothing, we are on page we should be on
        // routeTo('/login', router)
      }
      else if(res === undefined){
        throw new Error();
      }
      // good refresh
      // log user in and go to home
      else{
        // check for success
        if(res.success){
          // const log = useLoggedStore();
          // log.login();
          routeTo('/home', router)
          console.log("refresh token detected: ", res);
        }
        else{
          // nothing happens
          console.log("refresh token NOT detected: ", res);
        }
      }
    
    // optionally store data
  } catch (err: unknown) {
    console.log("Caught error: ",err);
  }

}


// lifecycle hooks
onMounted(() => {

  // on page mount, we check "/launchTokenCheck" route to see if we can log user in without login form
  checkRefreshTokenOnLoad();
  
  
});
</script>

<template>
  <!-- Login form -->
  <section >
    

    <!-- form -->
    <form @submit.prevent="login" class="flex flex-col justify-center border rounded p-4">
        <legend class="font-semibold text-4xl text-green-800">Login</legend>
        <!-- username -->
        <h4 class="font-semibold mb-1 mt-5">Username</h4>
        <input v-model="loginForm.username" type="text" class="border rounded p-1"></input>

        <!-- password -->
        <h4 class="font-semibold mb-1 mt-5">Password</h4>
        <input v-model="loginForm.password" type="text" class="border rounded p-1"></input>
        
        <!-- error message -->
         <div v-if="errorMessage"><h4 class="text-red-600">{{ errorMessage }}</h4></div>
        
        <!-- submit -->
        <section class="mt-5 flex justify-center">
            <div class="">
                <button type="submit" class="bg-green-800 text-xl p-2 rounded font-semibold">Submit</button>
            </div>
        </section>

    </form>

    <!-- To login button -->
    <div class="flex justify-center mt-5 border-top">
  <button @click="routeTo('/register', router)">Register</button>
    </div>
    

  </section>

</template>
