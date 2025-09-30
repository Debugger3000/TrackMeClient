

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useFetch } from "../../../../api/authFetch";
import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";

import selectClub from "../../../range-shots/selectClub.vue";
import bar from "../../../range-shots/bar.vue";
import donut from "../../../range-shots/donut.vue";

import {
  CLUBTYPE,
  type IShotType,
  type Indiv_Game_Shots,
} from "../../../../types/shot";

import gridCard from "../helpers/grid-card.vue";

const router = useRouter();

const props = defineProps<{
  // username: String;
  // isLoggedIn: Boolean;
  // syncStorage?: (username: string) => void;
    time_filter?: string;
    game_id?: number;
    // club_type: IShotType;

}>();

// variables
// -------------
// this will be used to filter chart to ONE CLUB at a time...
let selectedClub = ref<IShotType>(CLUBTYPE.Driver);

// game shots stored here...
let game_shots = ref<Indiv_Game_Shots>();

// chart stats data
// let shotsData = ref<IShotIncoming>({
//   clubType: selectedClub.value,
//   dataSet: [0, 0, 0, 0, 0, 0, 0, 0, 0],
// });

// // // donut chart contact data
// let contactData = ref<IShotContactIncoming>({
//   total: 5,
//   dataSet: [1, 1, 1, 1, 1],
// });
// ---------------------------

watch(
  [() => props.time_filter, () => props.game_id],
  ([newTimeFilter, newGameId], [oldTimeFilter, oldGameId]) => {
    console.log("time_filter changed:", newTimeFilter, oldTimeFilter);
    console.log("game_id changed:", newGameId, oldGameId);

    // ✅ Only runs when time_filter changes
    if (newTimeFilter !== oldTimeFilter) {
      
      console.log("time_filter changed:", newTimeFilter);
     
    } 
    // ✅ Only runs when game_id changes
    else if (newGameId !== oldGameId) {
      
      console.log("game_id changed:", newGameId);
      // put your second block logic here
    }

 
  }
);




async function selectClubCallBack(club: IShotType) {
  selectedClub.value = club;

  await getGameShots();
}



// functions that mutate state and trigger updates
// Per club data...
async function getGameShots() {
  
  try {
    if(!props.time_filter){
        return;
    }

    const res = await useFetch<Indiv_Game_Shots>(
      `/data/stats/game-many/${props.time_filter}?club_type=${selectedClub.value}`,
      "GET"
    );

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from game shots res, is undefined");
    }
    // good response...
    else {
        game_shots.value = res;
        console.log("returned many game shots: ",res);
      
    }
  } catch (error) {
    console.log("get game shots function threw error: ", error);
  }
}



// lifecycle hooks
onMounted(async () => {
 

    await getGameShots();
 
});
</script>

<style
  src="../holeandshot/mainstyles.css"></style>

<template>
  <!-- Home page -->
  <section class="">
    <section class="flex justify-between items-center mb-1">
      <!-- select club to show stats for... -->
      <!-- callback to this component to set selected Club... -->
      <selectClub :change-club="selectClubCallBack" />
    </section>

    <section class="grid grid-cols-3 gap-3" v-if="game_shots">
        <gridCard title="Total Shots" :data_point="game_shots?.total_shots!"/>
    </section>


    <section class="mt-5">
      <div class="border-b pb-1">
        <h4 class="font-semibold text-3xl text-02">Club Stats</h4>
      </div>
      <section class="mt-5"  v-if="game_shots">
      <div class="border-b pb-1">
        <h4 class="font-semibold text-3xl text-02">Path</h4>
      </div>
      <!-- display path stats -->
      <bar :path-data="game_shots?.shot_paths!" />
    </section>

    <!-- display contact stats -->
    <section class="mt-5" v-if="game_shots">
      <div class="border-b pb-1">
        <h4 class="font-semibold text-3xl text-02">Contact</h4>
      </div>
      <donut :contact-data="game_shots?.shot_contact!" />
    </section>
      
    </section>

  </section>
</template>
