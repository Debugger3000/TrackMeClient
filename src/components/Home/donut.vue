<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  CLUBTYPE,
  CLUBTYPE_ITER,
  CONTACT_ITER,
  type IShot,
  type IShotContactIncoming,
  type IShotType,
} from "../../types/shot";

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  DoughnutController,
  type ChartData,
} from "chart.js";

Chart.register(
  DoughnutController,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const props = defineProps<{
  contactData: IShotContactIncoming;
}>();

// this will be used to filter chart to ONE CLUB at a time...
let selectedClub = ref<IShotType>(CLUBTYPE.ThreeWood);
let toggleMenu = ref<boolean>(false);

// Per club data...
function changeClubLocal(club: IShotType) {
  console.log("changing club local...");
  selectedClub.value = club;

  // change variable in parent so it can call data for that club...
  //   props.changeClub(club);
}

function callToggleMenu() {
  toggleMenu.value = !toggleMenu.value;
}

let donutData = ref<IShotContactIncoming>({
  total: 0,
  dataSet: [1, 1, 1, 0, 0],
});

let chartItem = ref<HTMLCanvasElement | null>(null);

let charter: Chart<
  "doughnut",
  [number, number, number, number, number],
  string
> | null = null;

// lifecycle hooks
onMounted(() => {
  console.log("donut data received: ", props.contactData);

  const chartDiv = document.getElementById("donut")! as HTMLCanvasElement;
  chartItem.value = chartDiv;

  if (chartItem) {
    charter = new Chart(chartItem.value, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: props.contactData.dataSet,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(201, 42, 98)",
              "rgb(120, 87, 45)",
            ],
          },
        ],
        labels: CONTACT_ITER,
      },
      options: {
        maintainAspectRatio: false, // allows it to fill parent div height
        responsive: true,
        onClick: (e) => {},
      },
    });
  }
});
</script>

<template>
  <!-- Home page -->
  <section class="p-2 h-[500px]">
    <h4 class="font-semibold text-2xl">{{ props.contactData.total }}</h4>
    <canvas id="donut"></canvas>
  </section>
</template>
