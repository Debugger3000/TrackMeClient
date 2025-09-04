<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/globalStore";

import selectClub from "./selectClub.vue";
import bar from "./bar.vue";

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  type ChartData,
} from "chart.js";
import {
  CLUBTYPE,
  type IShotContactIncoming,
  SHOTPATH_ITER,
  type IShot,
  type IShotIncoming,
  type IShotType,
  type IShotMaster,
} from "../../types/shot";
import donut from "./donut.vue";

const router = useRouter();

const props = defineProps<{
  username: String;
  isLoggedIn: Boolean;
  syncStorage?: (username: string) => void;
}>();

// this will be used to filter chart to ONE CLUB at a time...
let selectedClub = ref<IShotType>(CLUBTYPE.ThreeWood);

function selectClubCallBack(club: IShotType) {
  selectedClub.value = club;

  const callData = async () => {
    await getStatsData();
  };

  callData();
}

// chart stats data
let shotsData = ref<IShotIncoming>({
  clubType: selectedClub.value,
  dataSet: [0, 0, 0, 0, 0, 0, 0, 0, 0],
});

// // donut chart contact data
let contactData = ref<IShotContactIncoming>({
  total: 5,
  dataSet: [1, 1, 1, 1, 1],
});

// functions that mutate state and trigger updates
// Per club data...
async function getStatsData() {
  console.log("getStatsData function ran");
  try {
    const res = await useFetch<IShotMaster>(
      `/data/shot/${selectedClub.value}`,
      "GET"
    );

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getStatsData res, is undefined");
    }
    // good response...
    else {
      // set stats data
      // shotDataMaster.value = res;
      shotsData.value = res.ishot;
      contactData.value = res.icontact;

      console.log("contact data data: ", shotsData.value.dataSet);
      console.log("shotter data data: ", contactData.value.dataSet);
    }
  } catch (error) {
    console.log("getStatsData function threw error: ", error);
  }
}

// standardized way of making REST API calls, and handling 401s / 200s
async function getUserData() {
  console.log("calling useFetch for getUserData");
  try {
    const res = await useFetch<IUser>("/user/userinfo", "GET", undefined);

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getUserDAta res, is undefined");
    }
    // good response...
    else {
      // set local Storage for username
      // userStore.setUser(res);
      props.syncStorage?.(res.username);
      localStorage.setItem("username", res.username);
      localStorage.setItem("id", res.id.toString());
    }
  } catch (error) {
    console.log("Error in getUserData in Home component: ", error);
  }
}

// lifecycle hooks
onMounted(() => {
  // call get user info...
  const callGet = async () => {
    await getUserData();
  };
  callGet();

  // get user stats data
  const callData = async () => {
    await getStatsData();
  };
  callData();
});
</script>

<template>
  <!-- Home page -->
  <section class="p-2">
    <!-- little title intro -->
    <!-- <div class="flex justify-center mt-4 pb-4">
      <h2 class="text-3xl">Welcome, {{ username }}</h2>
      <h2 class="text-2xl">islogger, {{ isLoggedIn }}</h2>
    </div> -->

    <section class="flex justify-between items-center mb-1">
      <!-- select club to show stats for... -->
      <!-- callback to this component to set selected Club... -->
      <selectClub :change-club="selectClubCallBack" />

      <div class="flex items-center gap-1 p-2">
        <h4 class="font-semibold text-gray-400">Total Shots:</h4>
        <h4 class="font-semibold">
          {{ contactData.total }}
        </h4>
      </div>
    </section>

    <section class="mt-5">
      <div class="border-b pb-1">
        <h4 class="font-semibold text-3xl text-gray-200">Path</h4>
      </div>
      <!-- display path stats -->
      <bar :path-data="shotsData" />
    </section>

    <!-- display contact stats -->
    <section class="mt-5">
      <div class="border-b pb-1">
        <h4 class="font-semibold text-3xl text-gray-200">Contact</h4>
      </div>
      <donut :contact-data="contactData" />
    </section>
  </section>
</template>
