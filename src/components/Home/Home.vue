<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "../../api/authFetch";
import type { IUser } from "../../types/user";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/globalStore";
import { Chart, type ChartData } from "chart.js";
import { CLUBTYPE, type IShot, type IShotType } from "../../types/shot";

const router = useRouter();

const props = defineProps<{
  username: String;
  isLoggedIn: Boolean;
  syncStorage?: (username: string) => void;
}>();

// reactive state
const count = ref(0);

// this will be used to filter chart to ONE CLUB at a time...
let selectedClub = ref<IShotType>(CLUBTYPE.Driver);

// chart stats data
let shotsData = ref<IShot[]>([]);
// filtered sub array of main shot data
let filteredShotData = ref<IShot[]>();

function filterShotData(clubType: IShotType) {}

const datasets: ChartData<"bar", IShot[]> = {
  datasets: [
    {
      data: shotsData.value,
      parsing: {
        // xAxisKey: "shotPath",
      },
    },
  ],
};

const chartDiv = document.getElementById("charter")! as HTMLCanvasElement;

// Bar chart for shot stats
new Chart(chartDiv, {
  type: "bar",
  data: datasets,
  options: {
    parsing: {
      // xAxisKey: "shotPath",
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    onClick: (e) => {},
  },
});

// const userStore = useUserStore();
// let username = ref();
// username.value = localStorage.getItem("username");

// functions that mutate state and trigger updates
async function getStatsData() {
  console.log("getStatsData function ran");
  try {
    const res = await useFetch<IShot[]>("/data/shot", "GET");

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
      console.log("shot data: ", Array.from(shotsData.value));
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
    <section>
      <canvas id="charter"></canvas>
    </section>
  </section>
</template>
