<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { ICourseView } from "../../../../types/course";
// import type { IGameView } from "../../../../types/game";

const props = defineProps<{
  courseData?: ICourseView[];
  courseSelector?: (index: number) => void;
  course?: ICourseView;
}>();

watch([() => props.courseData, () => props.course], () => {
  console.log("course overview watcher triggered: ", props.courseData);
  if(props.courseData) {
  course_data.value = props.courseData;

  }
});

let course_data = ref<ICourseView[]>();

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
  <div v-if="course_data">
    <section
      v-if="course_data"
      class="bg-white shadow-lg">
      <div
        v-for="(value, index) in course_data"
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
