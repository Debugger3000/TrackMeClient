<script setup lang="ts">
import { ref, onMounted } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useFetch } from "../../api/authFetch";
import type { ICourseView } from "../../types/course";
import courseOverview from "./game-components/course-overview.vue";

const router = useRouter();

// message
let courseData = ref<ICourseView[]>([{
  club_name: "",
  holes: 9,
  par: 0,
  location: "hehe",
  course_name: ""
}]);

// if user is backspacing don't query
let prevDataLength = 0;

let courseSelected = ref<boolean>(true);
let selectedCourse = ref<ICourseView>();

function routeToHere(tabClicked: string) {
  routeTo(tabClicked, router);
}

function searchInput(value: EventTarget | null) {
    console.log("new search input is: ", value);
    if(value){
        const val = value as HTMLInputElement;
        const searchValue = val.value;
        console.log("Value: ", searchValue);
        // user did not backspace, so we can query on added character...
        if(prevDataLength < searchValue.length) {
            getCourseBySearch(searchValue);
            prevDataLength = searchValue.length;
            courseSelected.value = false;
        }
    }
}

async function getCourseBySearch(searchValue: string) {
    try {
        const res = await useFetch<ICourseView[]>(`/course/grab/${searchValue}`,"GET");

        if (res === 401) {
            localStorage.setItem("isLoggedIn", "false");
            routeTo("/login", router);
        } else if (res === undefined) {
            throw new Error("Error from getcoursebySearch res, is undefined");
        }
        // good response...
        else {
            // set course view data...
            courseData.value = res;
            console.log("COURSE SEARCH DATA: ", res);
        }
        
    } catch (error) {
         console.log("Error in getCourseBySearch in create Game...", error);
    }
}

// course selected...
function coursePicked(index: number) {
    // display course picked...
    courseSelected.value = true;
    selectedCourse.value = courseData.value[index];

}


// create game object, route to /games/id or /games/current/id

// lifecycle hooks
onMounted(() => {
  // call get user info...
});
</script>

<template>
  <!-- Home page -->
  <section class="">
    <!-- top bar on page -->
    <section class="flex justify-between bg-green-800 p-2">
      <div class="">
        <h4 class="font-semibold text-3xl text-white">Courses</h4>
      </div>
    </section>

    <!-- main section of page... -->
    <section class="mt-5 p-4 me-border">
      <!-- other functionality above table -->
      <section class="justify-center items-center">
        <div class="text-center mb-3">
          <h4 class="font-semibold text-3xl">Create Game</h4>
        </div>
      </section>

      

      <section class="">
        <div class="flex gap-5 me-border">
            <!-- <i class="bi bi-plus text-2xl text-black"></i> -->
            <input type="text" placeholder="Search Course..." @input="searchInput($event.target)" class="p-2 w-full"></input>
        </div>
        <!-- search results are here -->
        <section v-if="!courseSelected" class="me-border active:bg-gray-300">
            <course-overview :course-data="courseData" :course-selector="coursePicked" class="active:bg-gray-300"/>
        </section>


        <h4 class="mb-3 mt-5 text-xl text-center font-semibold">Selected Course</h4>
        <!-- display chosen course... -->
      <section v-if="selectedCourse">
        
        <course-overview :course="selectedCourse"/>
      </section>

      <!-- button - START GAME -->
      <div class="flex justify-center mt-3">
        <button class="p-2 border bg-red-600 text-white" type="button">Start Game</button>
      </div>
      </section>

      
    </section>
  </section>
</template>
