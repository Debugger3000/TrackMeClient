<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/globalStore";
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
  SHOTPATH_ITER,
  type IShot,
  type IShotIncoming,
  type IShotType,
} from "../../types/shot";

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

// chart stats data
let shotsData = ref<IShotIncoming>({
  clubType: selectedClub.value,
  dataSet: [0, 0, 0, 0, 0, 0, 0, 0, 0],
});

let charter: Chart<
  "bar",
  [number, number, number, number, number, number, number, number, number],
  string
> | null = null;

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

let chartItem = ref<HTMLCanvasElement | null>(null);

function filterShotData(clubType: IShotType) {}

const datasets = {
  datasets: [
    {
      label: "SHOTTERS",
      data: shotsData.value!.dataSet,
      backgroundColor: "#f9f9f9",
    },
  ],
};

// const userStore = useUserStore();
// let username = ref();
// username.value = localStorage.getItem("username");

// functions that mutate state and trigger updates
// Per club data...
async function getStatsData() {
  console.log("getStatsData function ran");
  try {
    const res = await useFetch<IShotIncoming>(
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
      shotsData.value = res;

      if (charter) {
        charter.data.datasets[0].data = shotsData.value.dataSet;
        charter!.update();
      }

      console.log("shot data: ", shotsData.value);
      filterShotData(CLUBTYPE.Driver);
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
        parsing: {
          // xAxisKey: "shotPath",
        },
        scales: {
          y: {
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

    <!-- display stats -->
    <section class="rounded mt-10 bg-gray-300">
      <h4 class="ml-4 text-gray-800 text-center">{{ selectedClub }}</h4>
      <canvas id="charter"></canvas>
    </section>
  </section>
</template>
