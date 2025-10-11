<script setup lang="ts">
import { onMounted, watch } from "vue";
import type { ICourseView, THoles } from "../../../../types/course";
// import type { IGameView } from "../../../../types/game";

const props = defineProps<{
  courseData?: ICourseView[];
  courseSelector?: (index: number) => void;
  course?: ICourseView;
}>();

watch([() => props.courseData, () => props.course], () => {
  console.log("course overview watcher triggered");
});

// course selected to create game on
function courseSelectedCallBack(index: number) {
  if (props.courseSelector) {
    props.courseSelector(index);
  }
}

// lifecycle hooks
onMounted(() => {
  // call get user info...
});
</script>

<template>
  <div v-if="props.courseData">
    <section
      v-if="props.courseData[0].club_name.length !== 0"
      class="bg-white shadow-lg">
      <div
        v-for="(value, index) in props.courseData"
        :key="index"
        class="border-b border-gray-300 p-2"
        @click="courseSelectedCallBack(index)">

        <div class="flex items-center gap-1">
          <h4 class="color-light-grey text-xs">{{ value.holes }} Holes</h4>
          <i class="bi bi-dot text-xl color-light-grey"></i>
          <h4 class="color-light-grey text-xs">Par {{ value.par }}</h4>
          <i class="bi bi-dot text-xl color-light-grey"></i>
          <h4 class="color-light-grey text-xs">{{ value.course_name }}</h4>
          
        </div>

        <div class="flex items-center">
          <h4 class="color-01 font-semibold">{{ value.club_name }}</h4>
        </div>
        <div class="flex items-center">
          <h4 class="color-light-grey text-xs">{{ value.location }}</h4>
        </div>

      </div>
    </section>
  </div>

  <!-- display just the one... -->
  <div v-if="props.course">
    <section class="bg-white shadow-lg" @click="">
      <div class="border-b border-gray-300 p-2">
        <div class="flex items-center gap-1">
          <h4 class="color-light-grey text-xs">{{ props.course.holes }} Holes</h4>
          <i class="bi bi-dot text-xl color-light-grey"></i>
          <h4 class="color-light-grey text-xs">Par {{ props.course.par }}</h4>
          <i class="bi bi-dot text-xl color-light-grey"></i>
          <h4 class="color-light-grey text-xs">{{ props.course.course_name }}</h4>
          
        </div>

        <div class="flex items-center">
          <h4 class="color-01 font-semibold">{{ props.course.club_name }}</h4>
        </div>
        <div class="flex items-center">
          <h4 class="color-light-grey text-xs">{{ props.course.location }}</h4>
        </div>
      </div>
    </section>
  </div>
</template>
