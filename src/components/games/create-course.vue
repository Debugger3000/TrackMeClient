<script setup lang="ts">
import { ref, onMounted } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import {  NINE_HOLES, type ICourse, type THoles, EIGHTEEN_HOLES, NINE_ARRAY, EIGHTEEN_ARRAY, EIGHTEEN_HOLES_MAP, NINE_HOLES_MAP, type T9_MAP, type T18_MAP, type TEIGHTEEN_HOLES } from "../../types/course";

const router = useRouter();


let curHoles = ref<THoles>(18);
let refMap = ref<T9_MAP | T18_MAP>(EIGHTEEN_HOLES_MAP);
let curArray = ref<Number[]>(EIGHTEEN_ARRAY);


function changeHoleData() {
  if (curHoles.value === 18) {
    curHoles.value = 9;
    courseForm.value.score_card = NINE_HOLES as any;
    refMap.value = NINE_HOLES_MAP;
    curArray.value = NINE_ARRAY;
  } else {
    curHoles.value = 18;
    courseForm.value.score_card = EIGHTEEN_HOLES as any;
    refMap.value = EIGHTEEN_HOLES_MAP;
    curArray.value = EIGHTEEN_ARRAY;
  }
  console.log("cur holes selected: ", curHoles.value);
}

function setScoreIndex(index: number, value: number) {
  console.log("index of score clicked: ", index );
  console.log("value given on score: ", value);


}



function routeToHere(tabClicked: string) {
  routeTo(tabClicked, router);
}

const courseForm = ref<ICourse<TEIGHTEEN_HOLES>>({
  club_name: "",
  holes: 18,
  par: 0,
  location: "",
  course: null,
  score_card: EIGHTEEN_HOLES
});




// submit course data
// 
// Potentially, add Country, and City
function submitCourseData() {

  console.log("Test output of scorecard submit: ", courseForm.value);

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
      
    </section>

    <!-- main section of page... -->
    <section class="mt-5 p-4">
      <!-- other functionality above table -->
      <section class="justify-center items-center">

        <div class="text-center mb-3">
        <h4 class="font-semibold text-3xl">Create Course</h4>
      </div>

        <form @submit.prevent="submitCourseData" class="flex flex-col justify-center border rounded p-4">
          <!-- club name -->
            <h4 class="font-semibold mb-1 mt-5">Club Name</h4>
            <input v-model="courseForm.club_name" type="text" id="club_name" class="border rounded p-1"></input>

            <!-- Location -->
            <h4 class="font-semibold mb-1 mt-5">Location</h4>
            <input v-model="courseForm.location" type="text" id="location" class="border rounded p-1"></input>

            <!-- course -->
            <h4 class="font-semibold mb-1 mt-5">Course</h4>
            <input v-model="courseForm.course" type="text" id="course" class="border rounded p-1"></input>

            <!-- Par -->
            <h4 class="font-semibold mb-1 mt-5">Par</h4>
            <input v-model="courseForm.par" type="number" id="par" class="border rounded p-1"></input>

        
          <div class="mt-5">
            <button @click="changeHoleData" type="button" class="me-border">
              <div class="flex items-center">
                <h4 :class="{ 'bg-green-300': curHoles === 9 }" class="p-1 text-2xl">9</h4>
                <h4 :class="{ 'bg-green-300': curHoles === 18 }" class="p-1 text-2xl">18</h4>
              </div>
            </button>
          </div>


          <!-- scorecard to fill in -->
           <section class="grid grid-cols-9 grid-rows-2 me-border mt-3">
            <div v-for="(_value,index) in curArray" :key="index">
              <div class="flex justify-center border">
                <h4 class="text-xl text-red-800">{{ index+1 }}</h4>
              </div>
              <div class="w-full">
                <input
                :id="`hole_${index + 1}`"
                v-model="courseForm.score_card[refMap[index]]"
                class="flex justify-center w-full text-center border focus:outline-none" type="number" @input="setScoreIndex(index, Number(($event.target as HTMLInputElement).value))"></input>
                <!-- <h4 class="flex justify-center text-xl border">{{ value }}</h4> -->
              </div>
            </div>
           </section>





          <div class="flex justify-center mt-5">
            <button type="submit" class="p-2 rounded border bg-red-800 text-white">
              Submit
            </button>
          </div>
        


        </form>


        



      </section>


    </section>
  </section>
</template>
