<script setup lang="ts">
import { ref, onMounted, watch, inject } from "vue";
import { useFetch } from "../../../../api/authFetch";
import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
import {
  type IShotPaths,
  type IShotType,
  CLUBTYPE,
  SHOTPATH,
  SHOTCONTACT,
  type IShotContact,
} from "../../../../types/shot";

import shape from "../../../range-shots/shape.vue";
import type { IAuthResponse } from "../../../../types/Iauth";
import {
  LAND_TYPE,
  type Game_Shot_Data_Submit,
  type Land_Type,
} from "../../../../types/game";
import { getCurCoordinates, getDistanceInMeters } from "../../../../api/map";

const router = useRouter();

const props = defineProps<{
  //   shots: Game_Shot_Data[] | null | undefined;
  closeAddShotMenu: () => void;
  hole_id: number | undefined;
  user_id: number | undefined;
  shot_count: number | undefined;
  game_id: number | undefined;
}>();

watch(
  () => props.hole_id,
  () => {
    // updateData(props.holes);

    // console.log("game-shot updated  hole id....", props.hole_id);
    // console.log("game-shot updated user_id....", props.game_id);
  }
);

// club type - no default - user will have to interact before submit can be pressed...
// let curClubType = ref<IShotType>();
const clubs = Object.entries(CLUBTYPE);

// current shot path - default path to 'straight'
let curShotPath = ref<IShotPaths>("straight");
const paths = Object.entries(SHOTPATH);

// contact - default contact type to 'center'
// let curContactType = ref<IShotContact>("center");
const contacts = Object.entries(SHOTCONTACT);

const land_types = Object.entries(LAND_TYPE);

// error message
let message = ref("");
let loading = ref(false);

// interval
// let intervalId: number | null = null;

// const userStore = useUserStore();
// const userId = localStorage.getItem("id");

// inject update score function
const updater = inject<{
  updateGameShots: (shot: Game_Shot_Data_Submit) => void;
}>("update_shots");

// ----------------------

function changePath(path: IShotPaths) {
  shotDataForm.value.shot_path = path;
  curShotPath.value = path;
}
function changeClub(club: IShotType) {
  shotDataForm.value.club_type = club;
  // console.log("club type chose: ", shotDataForm.value.club_type);
}
function changeContact(contact: IShotContact) {
  shotDataForm.value.shot_contact = contact;
}
function changeLandType(land: Land_Type) {
  shotDataForm.value.land_type = land;
}

function resetshotDataForm() {
  shotDataForm.value.stroke = 1;
  shotDataForm.value.club_type = undefined;
  shotDataForm.value.shot_contact = "center";
  shotDataForm.value.shot_path = "straight";
  shotDataForm.value.start_lng = null;
  shotDataForm.value.start_lat = null;
  shotDataForm.value.end_lat = null;
  shotDataForm.value.end_lng = null;
  shotDataForm.value.land_type = null;
  shotDataForm.value.yards = null;
  shotDataForm.value.metres = null;
}

// need to add strokes, cause shots can be 1 stroke or 2 stroke

let shotDataForm = ref<Game_Shot_Data_Submit>({
  hole_id: props.hole_id!,
  user_id: props.user_id!,
  game_id: props.game_id!,
  shot_count: props.shot_count!,
  stroke: 1,
  club_type: undefined,
  shot_contact: "center",
  shot_path: "straight",
  start_lat: null,
  start_lng: null,
  end_lat: null,
  end_lng: null,
  land_type: null,
  yards: null,
  metres: null,
});

async function sendShotData() {
  try {
    // check to make sure a club was selected, land type was selected, and distance...
    if (shotDataForm.value.club_type && shotDataForm.value.land_type) {
      // check land type before final shot data object is sent out
      if (
        shotDataForm.value.land_type === "OB" ||
        shotDataForm.value.land_type === "water_hazard" ||
        shotDataForm.value.land_type === "land_hazard"
      ) {
        shotDataForm.value.stroke = 2;
      }

      if (
        shotDataForm.value.start_lat &&
        shotDataForm.value.start_lng &&
        shotDataForm.value.end_lat &&
        shotDataForm.value.end_lng
      ) {
        // calculate coordinates and distances before we send off to server to POST
        const distances = getDistanceInMeters(
          shotDataForm.value.start_lat,
          shotDataForm.value.start_lng,
          shotDataForm.value.end_lat,
          shotDataForm.value.end_lng
        );

        // console.log("SHOT distances after converting: ", distances);
        // set yards and metres in shot object
        shotDataForm.value.yards = distances.yards;
        shotDataForm.value.metres = distances.metres;
      }

      // console.log("outgoing game shot object: ", shotDataForm.value);
      const res = await useFetch<IAuthResponse, Game_Shot_Data_Submit>(
        "/data/game-shot",
        "POST",
        shotDataForm.value
      );

      if (res === 401) {
        localStorage.setItem("isLoggedIn", "false");
        routeTo("/login", router);
      } else if (res === undefined) {
        throw new Error("Error from getUserDAta res, is undefined");
      }
      // good response...
      else {
        // set queue to zero

        // update parent components with new data in memory
        const shot_for_update = { ...shotDataForm.value };

        // use function injected here to update
        updater?.updateGameShots(shot_for_update);

        // drop add shot menu from parent component.
        props.closeAddShotMenu();

        // reset shot Form and close add shot,
        resetshotDataForm();

        console.log("send GAMEShotData request successful !");
      }
    }
  } catch (error) {
    console.log("Error in stats send shot data request ", error);
  }
}

// function displayMessage() {
//   setTimeout(() => {
//     message.value = "";
//     loading.value = false;
//   }, 3000);
// }

async function fetchCoordinates(type: string) {
  const coord = await getCurCoordinates();
  if (type === "from") {
    shotDataForm.value.start_lat = coord.lat;
    shotDataForm.value.start_lng = coord.lon;
  } else {
    shotDataForm.value.end_lat = coord.lat;
    shotDataForm.value.end_lng = coord.lon;
  }
}

// lifecycle hooks
onMounted(() => {
  // console.log("Game shotpage just mounted");
});
</script>

<style src="../../../../components/range-shots/shotshape.css"></style>
<style src="./mainstyles.css"></style>

<template>
  <!-- Stats page page -->
  <section class="overflow-x-auto border-t border-gray-300">
    <!-- contains specs of form (shotpath, contact, clubtype) -->
    <section class="">
      <!-- shot path div -->
      <div class="grid grid-cols-8 h-[300px] p-2">
        <!-- club type selection -->
        <section
          class="grid grid-cols-2 col-start-1 col-span-3 overflow-y-scroll border border-gray-200 scroll-container">
          <div
            class="shot-path-buttons"
            v-for="[_, club] in clubs"
            :class="{ 'button-light-blue': shotDataForm.club_type === `${club}` }">
            <button @click="changeClub(club)" class="w-full h-full">
              {{ club }}
            </button>
          </div>
        </section>

        <shape :shotShape="curShotPath" class="col-start-5 col-span-8" />
      </div>

      <!-- control buttons for club shot path -->
      <h4 class="text-medium font-semibold mb-1 color-01 mt-6">Shot Shape</h4>
      <section class="grid grid-flow-col auto-cols-min overflow-x-scroll bg-white shadow-md rounded scroll-container border border-gray-300">
        <div
          v-for="[_, path] in paths"
          class="shot-path-buttons min-w-[75px]"
          :class="{ 'button-light-blue': shotDataForm.shot_path === `${path}` }">
          <button @click="changePath(path)" class="w-full h-full">
            {{ path }}
          </button>
        </div>
      </section>

      <!-- Contact type -->
      <h4 class="text-medium font-semibold mb-1 color-01 mt-3">Contact Type</h4>
      <section class="grid grid-cols-5 bg-white shadow-md rounded border border-gray-300">
        <div
          class="shot-path-buttons"
          v-for="[_, contact] in contacts"
          :class="{
            'button-light-blue': shotDataForm.shot_contact === `${contact}`,
          }">
          <button @click="changeContact(contact)" class="w-full h-full">
            {{ contact }}
          </button>
        </div>
      </section>

      <!-- Land Type (fairway, green, rough... OB)-->
      <h4 class="text-medium font-semibold mb-1 color-01 mt-3">Lie</h4>
      <section class="grid grid-flow-col auto-cols-min overflow-x-scroll bg-white rounded scroll-container shadow-md border border-gray-300">
        <div
          v-for="[_, path] in land_types"
          class="shot-path-buttons min-w-[75px]"
          :class="{ 'button-light-blue': shotDataForm.land_type === `${path}` }">
          <button @click="changeLandType(path)" class="w-full h-full">
            {{ path }}
          </button>
        </div>
      </section>

      <!-- feedback to let user know there coordinates have been gathered... -->
      <section class="flex justify-center gap-3 mt-3">
        <div class="">
          <!-- disable if -->
          <button
            class="p-1 rounded button-light-blue text-white flex items-center"
            @click="fetchCoordinates('from')">
            From Coordinate
            <i
              v-if="shotDataForm.start_lat && shotDataForm.start_lng"
              class="bi bi-check-lg text-3xl text-green-800"></i>
            <i
              v-if="!shotDataForm.start_lat && !shotDataForm.start_lng"
              class="bi bi-x text-3xl text-red-800"></i>
          </button>
        </div>
        <div>
          <button
            class="p-1 rounded button-light-blue text-white flex items-center"
            @click="fetchCoordinates('land')">
            Lie Coordinate
            <i
              v-if="shotDataForm.end_lat && shotDataForm.end_lng"
              class="bi bi-check-lg text-3xl text-green-800"></i>
            <i
              v-if="!shotDataForm.end_lat && !shotDataForm.end_lng"
              class="bi bi-x text-3xl text-red-800"></i>
          </button>
        </div>
      </section>

      <!-- error -->
      <section v-if="message" class="p-2">
        <h4 class="font-semibold text-red-800">{{ message }}</h4>
      </section>

      <!-- submit button -->
      <section class="flex justify-center mt-5">
        <button
          :disabled="loading"
          @click="sendShotData"
          class="rounded text-white bg-01"
          :class="{ 'bg-gray-400': loading, 'bg-red-800': !loading }">
          Submit
        </button>
      </section>
    </section>
  </section>
</template>
