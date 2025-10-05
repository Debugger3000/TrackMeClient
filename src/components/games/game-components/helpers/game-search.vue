<script setup lang="ts">
import { inject, onMounted } from "vue";
// import type { ICourseView } from "../../../../types/course";
import type { IGameView } from "../../../../types/game";
// import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
import { routeTo } from "../../../../router";
import { useFetch } from "../../../../api/authFetch";

const router = useRouter();

// const props = defineProps<{
//     // type: "stats" | "games";
//   //   gameData: IGameView[];
//   //   course?: ICourseView;
// //   prev_search: number;
// //   changePrevLength: (index: number) => void;
// //   setGameViewData: (gameData: IGameView[]) => void;

// }>();

// const sendGames = inject<((gameData: IGameView[]) => void) | undefined>("getGames");

const updater = inject<{
  setGamesInjector: (gameData: IGameView[]) => void;
}>("setGames");

const reset = inject<{
    resetGamesSearch: () => void;
}>("resetGames");

// for game search
let prevDataLength = 0;



// Options
// const options = ["1 month", "3 months", "6 months", "This Year", "Last Year"];

// watch(
//   () => props.gameData,
//   () => {
//     console.log("course overview watcher triggered");
//   }
// );

// Dropdown state
// const isOpen = ref<boolean>(false);

// // Selected option (default: 1 month)
// const selectedOption = ref(options[0]);

// // Method to choose option
// function selectOption(option: string) {
//   selectedOption.value = option;
//   isOpen.value = false;
// }

async function getGameBySearch(searchValue: string) {
    try {
        const res = await useFetch<IGameView[]>(`/game/grab/${searchValue}`,"GET");

        if (res === 401) {
            localStorage.setItem("isLoggedIn", "false");
            routeTo("/login", router);
        } else if (res === undefined) {
            throw new Error("Error from getcoursebySearch res, is undefined");
        }
        // good response...
        else {
          
            // callback to set data in parent...
            // sendGames?.(res);
            updater?.setGamesInjector(res);

            // set course view data...
            // completedGames.value = res;
            console.log("Game SEARCH DATA: ", res);
        }
        
    } catch (error) {
         console.log("Error in getCourseBySearch in create Game...", error);
    }
}


async function searchInput(value: EventTarget | null) {
    console.log("new search input is: ", value);
    console.log("search input ; ", typeof value);
    if(value){
        const val = value as HTMLInputElement;
        const searchValue = val.value;
        console.log("Value: ", searchValue);
        // user did not backspace, so we can query on added character...
        if(prevDataLength < searchValue.length && searchValue !== "") {
            await getGameBySearch(searchValue);
            prevDataLength = searchValue.length;
        }
        else if(searchValue === ""){
            reset?.resetGamesSearch();
        
        }

    }
}

async function setSearchToEmpty() {
  const input = document.getElementById("gameSearch") as HTMLInputElement;
  if(input !== null) {
  input.value = ""; // clears the input

  }
  reset?.resetGamesSearch();
  
}






// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
  //   console.log("Hole in game-overview: ", props.gameData);
});
</script>

<template>
  <section class="relative">

    
    
      <!-- search bar for individual games -->
        <div class="flex gap-5 bg-white shadow-lg rounded-lg">
            <input id="gameSearch" type="text" placeholder="Search Games..." @input="searchInput($event.target)" class="p-2 w-full"></input>
            <button @click="setSearchToEmpty"><i class="bi bi-x text-3xl"></i></button>
        </div>

        

  </section>
</template>
