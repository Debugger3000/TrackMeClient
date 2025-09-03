<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/globalStore";

import selectClub from "./selectClub.vue";

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

// reactive state
const count = ref(0);

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

// donut chart contact data
let contactData = ref<IShotContactIncoming>({
  total: 5,
  dataSet: [1, 1, 1, 1, 1],
});

let charter: Chart<
  "bar",
  [number, number, number, number, number, number, number, number, number],
  string
> | null = null;

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

let chartItem = ref<HTMLCanvasElement | null>(null);

// const userStore = useUserStore();
// let username = ref();
// username.value = localStorage.getItem("username");

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
      shotsData.value = res.ishot;
      contactData.value = res.icontact;

      if (charter) {
        charter.data.datasets[0].data = shotsData.value.dataSet;
        charter!.update();
      }

      console.log("shot data: ", shotsData.value);
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

  const chartDiv = document.getElementById("charter")! as HTMLCanvasElement;
  chartItem.value = chartDiv;
  // init chart
  // Bar chart for shot stats
  if (chartItem.value) {
    charter = new Chart(chartItem.value, {
      type: "bar",
      data: {
        datasets: [
          {
            data: shotsData.value.dataSet,
            borderColor: "#36A2EB",
            backgroundColor: "#9BD0F5",
          },
        ],
        labels: SHOTPATH_ITER,
      },
      options: {
        maintainAspectRatio: false, // allows it to fill parent div height
        responsive: true,
        layout: {
          padding: {
            left: 20, // adjust until all labels show
          },
        },
        indexAxis: "y",
        parsing: {
          // xAxisKey: "shotPath",
        },
        scales: {
          x: {
            // beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        onClick: (e) => {},
      },
    });
  }

  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <!-- Home page -->
  <section class="p-2">
    <!-- little title intro -->
    <div class="flex justify-center mt-4 pb-4 border-b border-green-900">
      <h2 class="text-3xl">Welcome, {{ username }}</h2>
      <h2 class="text-2xl">islogger, {{ isLoggedIn }}</h2>
    </div>

    <!-- select club to show stats for... -->
    <!-- callback to this component to set selected Club... -->
    <selectClub :change-club="selectClubCallBack" />

    <!-- display stats -->
    <section class="rounded mt-10 bg-gray-300 h-[500px]">
      <!-- <h4 class="ml-4 text-gray-800 text-center">{{ selectedClub }}</h4> -->
      <canvas id="charter" class=""></canvas>
    </section>

    <donut :contact-data="contactData" />
  </section>
</template>
