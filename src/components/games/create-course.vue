<script setup lang="ts">
import { ref, onMounted } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import {  NINE_HOLES, type ICourse, type THoles, EIGHTEEN_HOLES, NINE_ARRAY, EIGHTEEN_ARRAY, EIGHTEEN_HOLES_MAP, NINE_HOLES_MAP, type T9_MAP, type T18_MAP, type TEIGHTEEN_HOLES, type ICourseView } from "../../types/course";
import { useFetch } from "../../api/authFetch";
import alertMessage from "../helper/alertMessage.vue";
import type { IAuthResponse } from "../../types/Iauth";

import courseOverview from "./game-components/overviews/course-overview.vue";


const router = useRouter();


let courseData = ref<ICourseView[]>([{
  id: -99,
  club_name: "",
  holes: 9,
  par: 0,
  location: "hehe",
  course_name: ""
}]);

// {
//   id: -99,
//   club_name: "",
//   holes: 9,
//   par: 0,
//   location: "hehe",
//   course_name: ""
// }


let curHoles = ref<THoles>(18);
let refMap = ref<T9_MAP | T18_MAP>(EIGHTEEN_HOLES_MAP);
let curArray = ref<Number[]>(EIGHTEEN_ARRAY);


// message 
let message = ref("");

let curView = ref<"Courses" | "Add">("Courses");

let courseSelected = ref<boolean>(true);
let selectedCourse = ref<ICourseView>();


function changeHoleData() {
  if (curHoles.value === 18) {
    curHoles.value = 9;
    courseForm.value.score_card = NINE_HOLES as any;
    refMap.value = NINE_HOLES_MAP;
    curArray.value = NINE_ARRAY;
    courseForm.value.holes = 9;
  } else {
    curHoles.value = 18;
    courseForm.value.score_card = EIGHTEEN_HOLES as any;
    refMap.value = EIGHTEEN_HOLES_MAP;
    curArray.value = EIGHTEEN_ARRAY;
    courseForm.value.holes = 18;
  }
  console.log("cur holes selected: ", curHoles.value);
}


let search_bar_toggle = ref<boolean>(false);
function searchToggle(){
    search_bar_toggle.value = !search_bar_toggle.value;
}


function routeToHere(tabClicked: string) {
  routeTo(tabClicked, router);
}



async function getCourses() {
    try {
        const res = await useFetch<ICourseView[]>(`/course`,"GET");

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

function coursePicked(index: number) {
  console.log("'course index picked: ", index);
    // display course picked...
    courseSelected.value = true;
    if(courseData.value) {
    selectedCourse.value = courseData.value[index];

    }
}


const courseForm = ref<ICourse<TEIGHTEEN_HOLES>>({
  club_name: "",
  holes: 18,
  par: 0,
  location: "",
  course_name: null,
  score_card: EIGHTEEN_HOLES
});



// submit course data
// 
// Potentially, add Country, and City
async function submitCourseData() {

      try {

        if(!courseForm.value.club_name || !courseForm.value.par || !courseForm.value.location){
          return;
        }

      const res = await useFetch<IAuthResponse,ICourse>("/course/add","POST",courseForm.value);

      // bad 401 
      // shouldnt have to technially check for bad 401 response
      if(res === 401){
        routeTo('/login', router)
      }
      else if(res === undefined){
        throw new Error();
      }
      // good
      else{
        // check for success
        if(res.success){
          message.value = res.message;
          // success route back to games
          routeTo('/games', router);
        }
        else{
          message.value = res.message;

        }
      }
       console.log("Test output of scorecard submit: ", courseForm.value);
      } catch (error) {
        console.log("error in submit Course Data: ", error);
      } 
}

async function changeView() {
  if (curView.value === "Add") {
    curView.value = "Courses";
    await getCourses();
  } else {
    curView.value = "Add";
  }
}


// lifecycle hooks
onMounted(async () => {
  // call get user info...
  console.log("courdata length : ", courseData.value);
  await getCourses();
  console.log("courdata length : ", courseData.value);
});
</script>

<template>
  <!-- Home page -->
  <section class="">
    <!-- top bar on page -->
    <section class="flex justify-between items-center bg-01 p-2 h-[55px]">
      <div>
        <button
          @click="
            {
              routeToHere('games');
            }
          "
          class="">
          <i class="bi bi-arrow-left text-3xl text-white"></i>
        </button>
      </div>
      <h4 class="font-semibold text-white text-xl">Courses</h4>
      
    </section>

    <!-- main section of page... -->
    <section class="">

      <section class="flex p-2 border-b border-gray-400">
        <div class="flex items-center border-default rounded">
          <div class="">
            <button
              @click="changeView"
              class="p-1"
              :class="{
                'button-light-blue': curView === 'Courses',
                // 'text-white': curView === 'history',
              }">
              Courses
            </button>
          </div>
          <!-- add shots -->
          <div class="flex items-cetner">
            <button
              class="p-1"
              @click="changeView"
              :class="{
                'button-light-blue': curView === 'Add',
                // 'text-white': curView === 'current',
              }">
              Add
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="curView === 'Courses' && courseData.length > 0"
        class="mt-3 flex flex-col grow">
        <div class="mb-1 px-2">
          <div class="flex gap-5 items-center">
            <h4 class="section-header">Courses</h4>
          <div class="" @click="searchToggle">
             <i class="bi bi-search text-xl color-01"></i>
          </div>
        </div>
          
          <!-- <gameSearch v-if="search_bar_toggle"/> -->
        </div>
        <course-overview :course-data="courseData" :course-selector="coursePicked"/>
      </section>


      <!-- other functionality above table -->
      <section v-if="curView === 'Add'" class="justify-center items-center bg-white shadow-md rounded">

        <form @submit.prevent="submitCourseData" class="flex flex-col color-light-grey justify-center rounded-md p-4">
          <!-- club name -->
          
            <h4 class="font-semibold mb-1 mt-3">Club Name</h4>
            <input v-model="courseForm.club_name" type="text" id="club_name" class="border rounded p-1"></input>

            <!-- Location -->
            <h4 class="font-semibold mb-1 mt-3">Location</h4>
            <input v-model="courseForm.location" type="text" id="location" class="border rounded p-1"></input>

            <!-- course -->
            <h4 class="font-semibold mb-1 mt-3">Course</h4>
            <input v-model="courseForm.course_name" type="text" id="course" class="border rounded p-1"></input>

            <!-- Par -->
            <h4 class="font-semibold mb-1 mt-3">Par</h4>
            <input v-model="courseForm.par" type="number" id="par" class="border rounded p-1"></input>

        
        

        <div class="flex items-center w-fit border-default rounded-md mt-3">
          <div class="">
            <button
            type="button"
               @click="changeHoleData"
              class="text-2xl"
              :class="{
                'button-light-blue': curHoles === 9 
                // 'text-white': curData === 'stats',
              }">
              9
            </button>
          </div>
          <!-- add shots -->
          <div class="flex items-center">
            <button
            type="button"
              class="text-2xl"
              @click="changeHoleData"
              :class="{
                'button-light-blue': curHoles === 18 
              }">
              18
            </button>
          </div>
        </div>


          <!-- scorecard to fill in -->
           <section class="grid grid-cols-9 grid-rows-2 border-default mt-3">
            <div v-for="(_value,index) in curArray" :key="index">
              <div class="flex justify-center border-default">
                <h4 class="text-xl text-orange-800">{{ index+1 }}</h4>
              </div>
              <div class="w-full">
                <input
                :id="`hole_${index + 1}`"
                v-model="courseForm.score_card[refMap[index]]"
                class="flex justify-center w-full text-center border focus:outline-none" type="number"></input>
                <!-- <h4 class="flex justify-center text-xl border">{{ value }}</h4> -->
              </div>
            </div>
           </section>

            <button type="submit" class="rounded-md border bg-orange-800 text-white mt-5">
              Submit
            </button>
        </form>

        <alert-message :message="message"/>
      </section>


    </section>
  </section>
</template>
