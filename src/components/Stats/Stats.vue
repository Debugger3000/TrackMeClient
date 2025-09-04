<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useFetch } from "../../api/authFetch";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import {
  type IShotPaths,
  type IShotType,
  CLUBTYPE,
  SHOTPATH,
  SHOTCONTACT,
  type IShotContact,
  type IShot,
} from "../../types/shot";
import shape from "./shape.vue";

const router = useRouter();

// club type - no default - user will have to interact before submit can be pressed...
let curClubType = ref<IShotType>();
const clubs = Object.entries(CLUBTYPE);

// current shot path - default path to 'straight'
let curShotPath = ref<IShotPaths>("straight");
const paths = Object.entries(SHOTPATH);

// contact - default contact type to 'center'
let curContactType = ref<IShotContact>("center");
const contacts = Object.entries(SHOTCONTACT);

// error message
let message = ref("");
let loading = ref(false);

// interval
let intervalId: number | null = null;

// const userStore = useUserStore();
const userId = localStorage.getItem("id");

// ----------------------

function changePath(path: IShotPaths) {
  curShotPath.value = path;
}
function changeClub(club: IShotType) {
  curClubType.value = club;
}
function changeContact(contact: IShotContact) {
  curContactType.value = contact;
}

async function sendShotData() {
  try {
    // grab shot data
    const shotData: IShot[] = JSON.parse(localStorage.getItem("shotQ") || "[]");

    if (shotData.length > 0) {
      const res = await useFetch<IShot[]>("/data/shot", "POST", shotData);

      if (res === 401) {
        localStorage.setItem("isLoggedIn", "false");
        routeTo("/login", router);
      } else if (res === undefined) {
        throw new Error("Error from getUserDAta res, is undefined");
      }
      // good response...
      else {
        // set queue to zero
        localStorage.setItem("shotQ", "[]");
        console.log("sendShotData request successful !");
      }
    } else {
      console.log("queue is empty. No data sent");
    }
  } catch (error) {
    console.log("Error in stats send shot data request ", error);
  }
}

// submit shot
function submitShot() {
  console.log("submit shot clicked ");
  loading.value = true;
  // make sure club was selected, and userId exists in memory
  if (curClubType.value && userId) {
    const data: IShot = {
      userId: Number(userId),
      clubType: curClubType.value,
      shotContact: curContactType.value,
      shotPath: curShotPath.value,
    };

    let postLen = 0;
    const curQ = localStorage.getItem("shotQ");
    console.log("curQ value: ", curQ);

    // push data to queue in localStorage
    if (curQ === null || curQ === "[]") {
      localStorage.setItem("shotQ", JSON.stringify([data]));
      console.log("just created new Q");

      message.value = "Q started, and item added !";
      displayMessage();

      // queue has been created, start interval now
      // 5 minute poll right now
    }
    // array already a thing
    else {
      if (curQ) {
        console.log("gonna add new shot to Q");
        let curQArray: IShot[] = JSON.parse(curQ);
        const prevLen = curQArray.length;
        curQArray.push(data);
        postLen = curQArray.length;

        // set new itme into array
        localStorage.setItem("shotQ", JSON.stringify(curQArray));

        console.log("new shot pushed to Q");

        // tell user shot was added
        if (postLen - prevLen === 1) {
          message.value = "Shot has been added !";
          displayMessage();
        }
      }
    }
  } else {
    message.value = "Please choose a club !";
    displayMessage();
  }
}

function displayMessage() {
  setTimeout(() => {
    message.value = "";
    loading.value = false;
  }, 3000);
}

// lifecycle hooks
onMounted(() => {
  console.log("Stats page just mounted");

  // can just start poll on launch since items may alreaady be in Q

  intervalId = setInterval(sendShotData, 1 * 60 * 1000);
  console.log("shotQ created: setInterval started. ", intervalId);
  // call get user info...
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log("Post shots, unmounted.. interval cleared..");
  }
});
</script>

<style src="./shotshape.css"></style>

<template>
  <!-- Stats page page -->
  <section class="">
    <!-- contains specs of form (shotpath, contact, clubtype) -->
    <section class="">
      <!-- shot path div -->
      <div class="">
        <shape :shotShape="curShotPath" />
      </div>

      <!-- control buttons for club shot path -->
      <section class="grid grid-cols-4 gap-1 rounded mt-2">
        <div
          v-for="[_, path] in paths"
          class="shot-path-buttons"
          :class="{ 'bg-gray-400': curShotPath === `${path}` }">
          <button @click="changePath(path)" class="w-full h-full">
            {{ path }}
          </button>
        </div>
      </section>

      <!-- club type selection -->
      <section class="grid grid-cols-5 gap-1 mt-4 py-4 border-t border-b">
        <div
          class="shot-path-buttons"
          v-for="[_, club] in clubs"
          :class="{ 'bg-gray-400': curClubType === `${club}` }">
          <button @click="changeClub(club)" class="w-full h-full">
            {{ club }}
          </button>
        </div>
      </section>

      <!-- Contact type -->
      <section class="grid grid-cols-4 gap-1 mt-4 pb-8 border-b">
        <div
          class="shot-path-buttons"
          v-for="[_, contact] in contacts"
          :class="{ 'bg-gray-400': curContactType === `${contact}` }">
          <button @click="changeContact(contact)" class="w-full h-full">
            {{ contact }}
          </button>
        </div>
      </section>

      <!-- error -->
      <section class="p-2">
        <h4 v-if="message" class="font-semibold text-red-800">{{ message }}</h4>
      </section>

      <!-- submit button -->
      <section class="flex justify-center mt-4">
        <button
          :disabled="loading"
          @click="submitShot"
          class="p-4 rounded-xl mt-4"
          :class="{ 'bg-gray-400': loading, 'bg-red-800': !loading }">
          Submit
        </button>
      </section>
    </section>
  </section>
</template>
