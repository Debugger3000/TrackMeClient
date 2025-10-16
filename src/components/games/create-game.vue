<script setup lang="ts">
import { ref, onMounted } from "vue";
import { routeTo } from "../../router";
import { useRouter } from "vue-router";
import { useFetch } from "../../api/authFetch";
import type { ICourseView } from "../../types/course";
import courseOverview from "./game-components/overviews/course-overview.vue";
import type { ICreate_Game_Return } from "../../types/game";

const router = useRouter();

// message
let courseData = ref<ICourseView[]>([{
  id: -99,
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

// function routeToHere(tabClicked: string) {
//   routeTo(tabClicked, router);
// }

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

async function createGame() {
  try {
    
  // should return new game object ID so i can use it in params for new route
  const res = await useFetch<ICreate_Game_Return, ICourseView>("/game/create","POST", selectedCourse.value);

  if (res === 401) {
    localStorage.setItem("isLoggedIn", "false");
    routeTo("/login", router);
  } else if (res === undefined) {
    throw new Error("Error from getcoursebySearch res, is undefined");
  }
  // good response...
  else {
    // set course view data...
    if(selectedCourse.value?.holes === 9){
      routeTo(`/game-view-nine/${res.id}`, router);
    }
    else{
      routeTo(`/game-view-eight/${res.id}`, router);
    }
    console.log("Create game response: ", res);
    
  }

  } catch (error) {
    console.log("Error in getCourseBySearch in create Game...", error);
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
    <section class="flex justify-between items-center bg-01 px-2 py-1 h-[55px]">
      <div class="">
        <button
          @click="
            {
              routeToHere('games');
            }
          "
          class="">
          <i class="bi bi-arrow-left text-2xl text-white"></i>
        </button>
      </div>
      <h4 class="font-semibold text-white text-xl">Create Game</h4>
      
    </section>

    <!-- main section of page... -->
    <section class="px-4 pt-2">

      <!-- other functionality above table -->

      <section class="justify-center items-center pb-3">
        
          <!-- <h4 class="section-header">Create Game</h4> -->
          <div class="flex gap-5 bg-white shadow-lg rounded-lg">
            <!-- <i class="bi bi-plus text-2xl text-black"></i> -->
            <input type="text" placeholder="Search Course..." @input="searchInput($event.target)" class="p-4 w-full"></input>
        </div>
      </section>

      

      <section class="">
        <!-- search results are here -->
        <section v-if="!courseSelected" class="active:bg-gray-300">
            <course-overview :course-data="courseData" :course-selector="coursePicked"/>
        </section>
      </section>

      <section v-if="selectedCourse">
        <course-overview :course="selectedCourse"/>
         <!-- button - START GAME -->
      <div v-if="selectedCourse" class="flex justify-center mt-3">
        <button class="bg-orange-800 rounded-lg text-white" type="button" @click="createGame">Create Game</button>
      </div>
      </section>

      
    </section>
  </section>
</template>
