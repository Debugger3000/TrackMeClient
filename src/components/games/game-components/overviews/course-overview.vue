<script setup lang="ts">
import { onMounted, watch } from "vue";
import type { ICourseView } from "../../../../types/course";
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
      class="me-border">
      <div
        v-for="(value, index) in props.courseData"
        :key="index"
        class="grid grid-cols-3 gap-3 border-b"
        @click="courseSelectedCallBack(index)">
        <div class="flex items-center">
          <h4>{{ value.club_name }}</h4>
        </div>
        <div class="flex items-center">
          <h4>{{ value.course_name }}</h4>
        </div>

        <div class="flex flex-col gap-1">
          <h4 class="m-0">Holes: {{ value.holes }}</h4>
          <h4 class="m-0">Par: {{ value.par }}</h4>
        </div>
      </div>
    </section>
  </div>

  <!-- display just the one... -->
  <div v-if="props.course">
    <section class="me-border" @click="">
      <div class="grid grid-cols-3 gap-3 border-b">
        <div class="flex items-center">
          <h4>{{ props.course.club_name }}</h4>
        </div>
        <div class="flex items-center">
          <h4>{{ props.course.course_name }}</h4>
        </div>

        <div class="flex flex-col gap-1">
          <h4 class="m-0">{{ props.course.holes }}</h4>
          <h4 class="m-0">{{ props.course.par }}</h4>
        </div>
      </div>
    </section>
  </div>
</template>
