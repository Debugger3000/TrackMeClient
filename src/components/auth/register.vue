

<script setup>
import { ref, onMounted } from "vue";

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

      const accessToken = localStorage.getItem("access_token");


    const res = await fetch(`${import.meta.env.VITE_SERVER_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        "Authorization": `Bearer ${accessToken}`,  // ✅ standard pattern
       },
      body: JSON.stringify({
        username: registerForm.value.username,
        password: registerForm.value.password
      }),
    //   credentials: 'include' // only if your server uses cookies
    });

    if (!res.ok) {
      const errBody = await res.json(); // server's JSON error response
  throw new Error(errBody || "Unknown error from server");
    }

    const data = await res.json();
    console.log('Login response object:', res);
    console.log("header access token: ", res.headers.get("x-access-token"));
    console.log('Login success:', data);

    if (res.headers.get("x-access-token")) {
  localStorage.setItem("access_token", token);  // ✅ store in localStorage
}
    // optionally store data in Pinia or localStorage
  } catch (err) {
    errorMessage.value = err.message || 'Something went wrong';
    console.log("Caught error: ",err.message);
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
  
  <!-- <button @click="increment">Count is: {{ count }}</button> -->
</template>
