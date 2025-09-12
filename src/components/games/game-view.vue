<script setup lang="ts">
import { onMounted, watch } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  //   courseData?: ICourseView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

// watch([() => props.courseData, () => props.course], () => {
//   console.log("course overview watcher triggered");
// });

// course selected to create game on

function routeToHere(tabClicked: string) {
  routeTo(`/${tabClicked}`, router);
}

// lifecycle hooks
onMounted(() => {
  // grab all game Data on mount ???
});
</script>

<template>
  <section class="">
    <!-- top bar on page -->
    <section class="flex justify-between bg-green-800 p-2">
      <div>
        <button
          @click="
            {
              routeToHere('games');
            }
          "
          class="font-semibold text-xs rounded border text-white bg-green-700">
          <i class="bi bi-arrow-left text-2xl text-white"></i>
        </button>
      </div>

      <div class="text-center mb-3">
        <h4 class="font-semibold text-3xl">GameView</h4>
      </div>
    </section>

    <!-- main section of page... -->
    <section class="mt-5 p-4"></section>
  </section>
</template>
