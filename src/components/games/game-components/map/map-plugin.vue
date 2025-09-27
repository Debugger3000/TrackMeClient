<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
// import { routeTo } from "../../../../router";
// import { useRouter } from "vue-router";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import type { IMap_Coordinates } from "../../../../types/map";
import { getCurCoordinates } from "../../../../api/map";
import type { Game_Shot_Data_Submit } from "../../../../types/game";
import { shot_polyline_Colors } from "../../../../types/map";

// const router = useRouter();

const props = defineProps<{
  current_shots: Game_Shot_Data_Submit[];
}>();

// let curDeviceCoor = ref<IMap_Coordinates>();\

let dropper = ref<boolean>(true);

const mapContainer = ref<HTMLDivElement | null>(null);
let map: L.Map;

// layer for shot lines overlay...
let shotsLayer: L.LayerGroup | null = null;

// takes shots array from hole-comp...

watch(
  () => props.current_shots,
  (shots) => {
    renderShots(shots);
  }
);

// const shotColors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD"];

function getShotColor(index: number) {
  return shot_polyline_Colors[index % shot_polyline_Colors.length];
}

function renderShots(shots: Game_Shot_Data_Submit[]) {
  if (!shotsLayer) return;

  // check for a shot one, and center mapview on that, if at least one shot exists...
  if (shots.length > 0) {
    const start_lat = shots[0].start_lat;
    const start_lan = shots[0].start_lng;
    if (start_lat && start_lan) {
      map.setView([start_lat, start_lan], 16);
    }
  }

  console.log("shots given to POLYLINE for map: ", shots);

  // Clear existing shot lines
  shotsLayer.clearLayers();

  // Loop through shots and add polylines
  shots.forEach((shot) => {
    if (
      shot.start_lat !== null &&
      shot.start_lng !== null &&
      shot.end_lat !== null &&
      shot.end_lng !== null
    ) {
      const index = shot.shot_count - 1;
      const polyline = L.polyline(
        [
          [shot.start_lat, shot.start_lng],
          [shot.end_lat, shot.end_lng],
        ],
        { color: getShotColor(index), weight: 6, opacity: 0.7 }
      );

      polyline.bindPopup(`
        <div>
          <strong>Shot ${shot.shot_count}</strong><br/>
          Club: ${shot.club_type ?? "N/A"}<br/>
          Distance: ${shot.yards} yards (${shot.metres} metres)
        </div>
      `);

      polyline.addTo(shotsLayer!);

      //   add a marker to the starting coordinates of a shot...
      //   L.marker([shot.end_lat, shot.end_lng])
      //     .addTo(shotsLayer!)
      //     .bindPopup(`Shot ${shot.shot_count}`);
    }
  });
}

// Re-center map to device location
async function recenterMap() {
  try {
    const coords = await getCurCoordinates();
    map.setView([coords.lat, coords.lon], 16);

    // Optional: add a marker at current location
    L.marker([coords.lat, coords.lon])
      .addTo(map)
      .bindPopup("You are here")
      .openPopup();
  } catch (err) {
    console.error("Could not get location:", err);
  }
}

function dropDown() {
  dropper.value = !dropper.value;
  console.log("dropper: ", dropper.value);
}

// lifecycle hooks
onMounted(async () => {
  // initialize map container in here...

  if (mapContainer.value) {
    // grab current coordinates
    const coors = await getCurCoordinates();

    // Initialize map once DOM element exists
    map = L.map(mapContainer.value).setView([coors.lat, coors.lon], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
    }).addTo(map);

    // Initialize empty layer group for shots
    shotsLayer = L.layerGroup().addTo(map);
  }

  // draw shot lines
  if (props.current_shots) {
    renderShots(props.current_shots);
  }
});
</script>

<!-- This component will run leaflet with openstreetmaps API inputing tile data -->
<template>
  <!-- Map plugin-->
  <section class="border-t rounded border-0.5 border-gray-400 mt-1">
    <div class="flex justify-between items-center py-3" @click="dropDown()">
      <h4 class="section-header">Map</h4>
      <i v-if="!dropper" class="bi bi-plus text-3xl"></i>
      <i v-if="dropper" class="bi bi-dash text-3xl"></i>
    </div>

    <section class="h-[400px] relative">
      <!-- Button overlay -->
      <button
        @click="recenterMap"
        class="absolute z-[1000] bottom-1 left-1 bg-white p-2 rounded border border-0.5 shadow">
        <i class="bi bi-fullscreen-exit text-3xl text-gray-600"></i>
      </button>

      <div ref="mapContainer" class="w-full h-[400px]"></div>
    </section>
  </section>
</template>
