<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

import {
  Chart,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PolarAreaController,
} from "chart.js";
import type { TGame_scores_distro } from "../../../../types/game-stats";

Chart.register(
  PolarAreaController,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const props = defineProps<{
  //   contactData: IShotContactIncoming;
  score_distro: TGame_scores_distro;
}>();

let chartItem = ref<HTMLCanvasElement | null>(null);

let charterPolar: Chart<
  "polarArea",
  [number, number, number, number, number],
  string
> | null = null;

watch(
  () => props.score_distro,
  () => {
    if (charterPolar) {
        console.log("polar chart mounter: ", props.score_distro);
      // Update the dataset with new values
      //   charterDonut.data.datasets[0].data = props.contactData.dataSet;
      charterPolar.data.datasets[0].data = [
        props.score_distro.eagle,
        props.score_distro.birdie,
        props.score_distro.par,
        props.score_distro.bogey,
        props.score_distro.double_or_more,
      ];
      charterPolar.update();
    }
  }
);

// lifecycle hooks
onMounted(() => {
  console.log("polar chart mounter: ", props.score_distro);

  // console.log("donut data received: ", props.contactData!.dataSet);

  const ctx = document.getElementById("scorePolar")! as HTMLCanvasElement;
  chartItem.value = ctx;

  //   const chartDiv = document.getElementById("donut")! as HTMLCanvasElement;
  //   chartItem.value = chartDiv;

  if (ctx) {
    charterPolar = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: ["Eagle", "Birdie", "Par", "Bogey", "Double+"],
        datasets: [
          {
            data: [
              props.score_distro.eagle,
              props.score_distro.birdie,
              props.score_distro.par,
              props.score_distro.bogey,
              props.score_distro.double_or_more,
            ], // Example data
            backgroundColor: [
             "rgba(201, 163, 74, 0.6)",   // eagle
  "rgba(34, 197, 94, 0.4)",   // birdie
  "rgba(59, 130, 246, 0.4)",  // par
  "rgba(250, 204, 21, 0.4)",  // bogey
  "rgba(239, 68, 68, 0.4)"    // double+
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // allows it to fill parent div height
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 14,
              font: { size: 18 },
            },
            title: {
                font: { size: 18 },
        display: true,
        text: 'Score Distribution'
      }
          },
        },
        scales: {
          r: {
            ticks: { display: true }, // hide numbers
            grid: { circular: true },
            min: 0,   // optional, ensures chart fills radius properly
          },
        },
        layout: {
    padding: {
      top: 10,
      bottom: 5,  // increase bottom padding
      left: 5,
      right: 5
    }
  },
      },
    });
  }
});
</script>

<template>
  <!-- Home page -->
  <section class="p-2 h-[400px] w-full">
    <canvas id="scorePolar"></canvas>
  </section>
</template>
