<script setup>
import { ref, onMounted } from "vue";

// reactive state
const count = ref(0);

const loginForm = ref({
    username: "",
    password: ""
});

const login = async () => {

};

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <!-- Login form -->
  <section >
    

    <!-- form -->
    <form  class="flex flex-col justify-center border rounded p-4">
        <legend class="font-semibold text-4xl text-green-800">Login</legend>
        <!-- username -->
        <h4 class="font-semibold mb-1 mt-5">Username</h4>
        <input type="text" class="border rounded p-1"></input>

        <!-- password -->
        <h4 class="font-semibold mb-1 mt-5">Password</h4>
        <input type="text" class="border rounded p-1"></input>
        <!-- submit -->
        <section class="mt-5 flex justify-center">
            <div class="">
                <button type="submit" class="bg-green-800 text-xl p-2 rounded font-semibold">Submit</button>
            </div>
        </section>

    </form>
  </section>
  <button @click="increment">Count is: {{ count }}</button>
</template>
