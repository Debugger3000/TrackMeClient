<script setup lang="ts">
import { onMounted, ref } from "vue";
// import type { ICourseView } from "../../../../types/course";
// import type { IGameView } from "../../../../types/game";
// import { routeTo } from "../../../../router";
import { useRouter } from "vue-router";
// import { formatDate } from "../helpers/helpers";
import { routeTo } from "../../../../router";
import { useFetch } from "../../../../api/authFetch";
import type { IAuthResponse } from "../../../../types/Iauth";

const router = useRouter();

const props = defineProps<{
  game_id: number;
}>();

function switchDeletePopUp(){
  console.log('Delete game called...');

  delete_popup.value = !delete_popup.value;

//   warning before it happens

//   call shit to delete game await


// re route

};

async function deleteGame() {

    try {
    

    const res = await useFetch<IAuthResponse>(
      `/game/${props.game_id}`,
      "DELETE",
      undefined
    );

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getUserDAta res, is undefined");
    }
    // good response...
    else {
      console.log("Shot was successfully deleted !");

      // now we set current hole to next hole, and we do a full data grab to update everything...
    }
  } catch (error) {
    console.log("error in delete shot: ", error);
  }

}



async function deletePopUp(result: Boolean) {
  if (result) {
    await deleteGame();
    delete_popup.value = !delete_popup.value;

    routeTo('/games', router);
  } else {
    delete_popup.value = !delete_popup.value;
  }
}

let delete_popup = ref<boolean>(false);


// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // call get user info...
  console.log("Hole in game-overview: ");


});
</script>

<template>
  <section class="p-1 relative">
    <button @click="switchDeletePopUp()">
        <i class="bi bi-trash text-red-800 text-2xl"></i>
    </button>

    <!-- warning before delete -->
    <div
        v-if="delete_popup"
        class="absolute top-full right-full flex justify-center items-center">
        <div
          class="flex flex-col justify-center p-1 items-center w-[200px] opacity-0.7 bg-white border border-gray-300 shadow-md z-90">
          <h4 class="text-center">
            Are you sure you want to delete this game?
          </h4>
          <div class="flex gap-5 items-center mt-3">
            <button
              class="bg-green-600 rounded text-white w-[50px]"
              @click="deletePopUp(true)">
              Yes
            </button>
            <button
              class="bg-red-600 rounded text-white w-[50px]"
              @click="deletePopUp(false)">
              No
            </button>
          </div>
        </div>
      </div>

    
  </section>
</template>
