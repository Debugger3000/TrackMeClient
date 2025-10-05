<script setup lang="ts">
import { ref, onMounted } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import {  NINE_HOLES, type ICourse, type THoles, EIGHTEEN_HOLES, NINE_ARRAY, EIGHTEEN_ARRAY, EIGHTEEN_HOLES_MAP, NINE_HOLES_MAP, type T9_MAP, type T18_MAP, type TEIGHTEEN_HOLES } from "../../types/course";
import { useFetch } from "../../api/authFetch";
import alertMessage from "../helper/alertMessage.vue";
import type { IAuthResponse } from "../../types/Iauth";

const router = useRouter();


let curHoles = ref<THoles>(18);
let refMap = ref<T9_MAP | T18_MAP>(EIGHTEEN_HOLES_MAP);
let curArray = ref<Number[]>(EIGHTEEN_ARRAY);


// message 
let message = ref("");


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




function routeToHere(tabClicked: string) {
  routeTo(tabClicked, router);
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


// lifecycle hooks
onMounted(() => {
  // call get user info...
});
</script>

<template>
  <!-- Home page -->
  <section class="">
    <!-- top bar on page -->
    <section class="flex justify-between items-center bg-01 p-2">
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
      <h4 class="font-semibold text-3xl text-white">Create Course</h4>
      
    </section>

    <!-- main section of page... -->
    <section class="p-2 mt-3">
      <!-- other functionality above table -->
      <section class="justify-center items-center bg-white shadow-md rounded">

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
