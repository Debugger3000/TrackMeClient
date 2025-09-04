<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  CLUBTYPE,
  SHOTPATH_ITER,
  CLUBTYPE_ITER,
  type IShot,
  type IShotContactIncoming,
  type IShotType,
  type IShotIncoming,
  type IShotMaster,
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
  type ChartData,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
  pathData: IShotIncoming;
}>();

let chartItem = ref<HTMLCanvasElement | null>(null);

let charter: Chart<
  "bar",
  [number, number, number, number, number, number, number, number, number],
  string
> | null = null;

watch(
  () => props.pathData,
  () => {
    console.log("weatch trigeereddeded.e...");
    if (charter) {
      charter.data.datasets[0].data = props.pathData.dataSet;
      charter.update();
    }
  }
);

// lifecycle hooks
onMounted(() => {
  console.log("BAR ON MOUNTED......");
  console.log("bar data received: ", props.pathData.dataSet);
  console.log("heheh");

  const chartDiv = document.getElementById("bar")! as HTMLCanvasElement;
  chartItem.value = chartDiv;

  if (chartItem) {
    charter = new Chart(chartItem.value, {
      type: "bar",
      data: {
        datasets: [
          {
            data: props.pathData.dataSet,
            borderColor: "#36A2EB",
            backgroundColor: "#9BD0F5",
          },
        ],
        labels: SHOTPATH_ITER,
      },
      options: {
        plugins: {
          legend: {
            display: false, // hides legend if you don’t want it
          },
        },
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
});
</script>

<template>
  <!-- Home page -->
  <section class="p-2 h-[500px]">
    <canvas id="bar"></canvas>
  </section>
</template>
