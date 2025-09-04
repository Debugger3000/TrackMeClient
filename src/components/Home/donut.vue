<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  CLUBTYPE,
  CLUBTYPE_ITER,
  CONTACT_ITER,
  type IShot,
  type IShotContactIncoming,
  type IShotMaster,
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

let chartItem = ref<HTMLCanvasElement | null>(null);

let charterDonut: Chart<
  "doughnut",
  [number, number, number, number, number],
  string
> | null = null;

watch(
  () => props.contactData,
  () => {
    console.log("weatch trggiar, DONUT");
    if (charterDonut) {
      console.log("donut update: ", props.contactData.dataSet);
      charterDonut.data.datasets[0].data = props.contactData.dataSet;
      charterDonut.update();
    }
  }
);

// lifecycle hooks
onMounted(() => {
  console.log("donut ON MOUNTED......");

  console.log("donut data received: ", props.contactData!.dataSet);

  const chartDiv = document.getElementById("donut")! as HTMLCanvasElement;
  chartItem.value = chartDiv;

  if (chartItem) {
    charterDonut = new Chart(chartItem.value, {
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
    <canvas id="donut"></canvas>
  </section>
</template>
