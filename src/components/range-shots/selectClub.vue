<script setup lang="ts">
import { ref, onMounted } from "vue";
import { CLUBTYPE, CLUBTYPE_ITER, type IShotType } from "../../types/shot";

const props = defineProps<{
  changeClub: (club: IShotType) => void;
}>();

// this will be used to filter chart to ONE CLUB at a time...
let selectedClub = ref<IShotType>(CLUBTYPE.Driver);
let toggleMenu = ref<boolean>(false);

// Per club data...
function changeClubLocal(club: IShotType) {
  console.log("changing club local...");
  selectedClub.value = club;
  callToggleMenu();

  // change variable in parent so it can call data for that club...
  props.changeClub(club);
}

function callToggleMenu() {
  toggleMenu.value = !toggleMenu.value;
}

// lifecycle hooks
onMounted(() => {});
</script>

<template>
  <!-- Home page -->
  <section class="">
    <!-- select club to show stats for... -->
    <section class="relative w-full">
      <div
        @click="callToggleMenu"
        class="flex items-center gap-3 border-default rounded button-light-blue w-fit p-1 hover:cursor-pointer">
        <h4 class="font-semibold text-xl">{{ selectedClub }}</h4>
        <i
          v-if="!toggleMenu"
          class="bi bi-arrow-down text-xl color-light-grey border-l"></i>
        <i
          v-if="toggleMenu"
          class="bi bi-arrow-up text-xl color-light-grey border-l"></i>
      </div>

      <section
        v-if="toggleMenu"
        class="grid grid-cols-4 absolute z-99 -left-4 border rounded bg-gray-800 w-screen">
        <div
          v-for="value in CLUBTYPE_ITER"
          class="flex justify-center border p-1 py-4 text-white"
          @click="changeClubLocal(value)">
          <h4 class="text-2xl">{{ value }}</h4>
        </div>
      </section>
    </section>
  </section>
</template>
