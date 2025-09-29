<script setup lang="ts">
import { computed, inject, onMounted, ref, watch, type Ref } from "vue";

import type {
  Game_Shot_Data_Submit,
  GameStatus,
  Hole_Data,
  Hole_Submit,
} from "../../../../types/game";
import { useRouter } from "vue-router";

import shotComponent from "./shot-component.vue";
import { useFetch } from "../../../../api/authFetch";
import { routeTo } from "../../../../router";
import type { IAuthResponse } from "../../../../types/Iauth";

import mapPlugin from "../map/map-plugin.vue";

import gridCard from "../helpers/grid-card.vue";

const router = useRouter();

const props = defineProps<{
  game_status: GameStatus;
  current_hole: Hole_Data;
  current_shots: Game_Shot_Data_Submit[];
  updateGameShots: (game_data: Game_Shot_Data_Submit) => void;
  game_score: number;
  // gameData: IGameView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

// inject variables from main game-view
const current_hole_state = inject<Ref<number, number>>("current_hole_state");
const game_hole_state = inject<Ref<number, number>>("game_hole_state");
const game_status = inject<Ref<GameStatus, GameStatus>>("game_status");
// inject functions
const goNextHole = inject<() => void>("goNextHole");
const completeGame = inject<() => void>("complete_game");

// putt values
const putts: number[] = [0, 1, 2, 3, 4, 5, 6];

// current score in hole
const current_hole_score = ref<number>(0);

// edit state for holes. Players can edit things if they accidently submitted wrong data
let edit_state = ref<boolean>(false);

watch(
  () => props.current_shots,

  () => {
    // console.log("current holes was pushed too hehehehehehe");
    // grab whatever shots are in hole shot array and tally strokes to display current hole score
    updateHoleScore();
    // make sure edit state is always turned to false, when first entering a hole
    edit_state.value = false;

    // update hole Form with edit data if user needs to edit
    holeForm.value.notes = ""; // reset notes field when a new current_shots is loaded
    holeForm.value.putt_count = 0;
  }
);

function updateHoleScore() {
  if (props.current_shots !== undefined) {
    let score_count = 0;
    props.current_shots.forEach((data) => {
      // console.log("shottter: ", data);
      score_count = score_count + data.stroke;
    });
    // a current game_hole_state so add form putt_count
    // If a previous hole with editing, then we can also add putt_count
    if (
      props.current_hole.hole_number === game_hole_state?.value ||
      edit_state
    ) {
      // we can add putt count
      current_hole_score.value = score_count + props.current_hole.putt_count;
    }
    // previous hole we can just add putt_count saved onto hole ROW data
    else {
      current_hole_score.value = score_count + props.current_hole.putt_count;
    }

    console.log("hole score: ", current_hole_score.value);
  }
}

// drop downs
let puttDrop = ref<boolean>(true);
let shotDrop = ref<boolean>(true);
let holeDrop = ref<boolean>(true);

// course selected to create game on
function dropDown(type: string) {
  if (type === "putt") {
    puttDrop.value = !puttDrop.value;
  } else if (type === "shot") {
    shotDrop.value = !shotDrop.value;
  } else if (type === "hole") {
    holeDrop.value = !holeDrop.value;
  }
}

// change putt count
function changePuttCount(count: number) {
  holeForm.value.putt_count = count;
  // putts were added so increment current score
  updateHoleScore();
}

// form for hole data
const holeForm = ref<Hole_Submit>({
  id: 0,
  putt_count: 0,
  score: 0,
  notes: "",
  game_id: 0,
  hole_state: 0,
  game_score: 0,
});

async function submitHole() {
  // goNextHole?.();

  const shot_plus_putts = current_hole_score.value + holeForm.value.putt_count;

  const new_game_score =
    shot_plus_putts - props.current_hole.par + props.game_score;
  // set hole score (stroke)
  holeForm.value.score = shot_plus_putts;
  // set hole id
  holeForm.value.id = props.current_hole.id;

  // set game score (stroke - par)
  holeForm.value.game_score = new_game_score;
  // set game _id
  holeForm.value.game_id = props.current_hole.game_id;
  // set hole state so we can easily move it to +1
  holeForm.value.hole_state = current_hole_state?.value!;

  try {
    const res = await useFetch<IAuthResponse, Hole_Submit>(
      "/game/hole",
      "PATCH",
      holeForm.value
    );

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getUserDAta res, is undefined");
    }
    // good response...
    else {
      console.log("hole was submitted, and patch properly !");
      // now we set current hole to next hole, and we do a full data grab to update everything...

      if (game_hole_state?.value === 18 || game_hole_state?.value === 9) {
        completeGame?.();
      }
      // complete game. Game is already finished updating,
      // we send user to games page, and the newly complete game will be there to view...
      else {
        goNextHole?.();
      }

      console.log("Calling go next hole hehe");
    }
  } catch (error) {
    console.log("error in Hole form submit: ", error);
  }

  console.log("holeForm value: ", holeForm.value);
}

function flipEdit() {
  edit_state.value = !edit_state.value;

  // when editing...
  if (edit_state.value) {
    // set putt count
    holeForm.value.putt_count = props.current_hole.putt_count;
    // set notes too
    holeForm.value.notes = props.current_hole.notes;
  }
  console.log("edit state value: ", edit_state.value);
}

// edit a previous hole for some reason haha
async function submitEditPreviousHole() {
  // goNextHole?.();

  const shot_plus_putts = current_hole_score.value + holeForm.value.putt_count;

  const par_adjusted_score = shot_plus_putts - props.current_hole.par;
  // set hole score (stroke)
  holeForm.value.score = shot_plus_putts;
  // set hole id
  holeForm.value.id = props.current_hole.id;

  // set game score (stroke - par)
  holeForm.value.game_score = par_adjusted_score;
  // set game _id
  holeForm.value.game_id = props.current_hole.game_id;
  // set hole state so we can easily move it to +1
  holeForm.value.hole_state = current_hole_state?.value!;

  try {
    const res = await useFetch<IAuthResponse, Hole_Submit>(
      "/game/hole/previous-edit",
      "PATCH",
      holeForm.value
    );

    if (res === 401) {
      localStorage.setItem("isLoggedIn", "false");
      routeTo("/login", router);
    } else if (res === undefined) {
      throw new Error("Error from getUserDAta res, is undefined");
    }
    // good response...
    else {
      console.log("hole was submitted, and patch PREVIOUS worked properly !");
      // now we set current hole to next hole, and we do a full data grab to update everything...

      goNextHole?.();

      console.log("Updating game object data now !");
    }
  } catch (error) {
    console.log("error in previous Hole form submit: ", error);
  }
}

// when to show edit button
const edit_condition = computed(() => {
  return (
    props.current_hole?.hole_number < game_hole_state!.value &&
    props.game_status === "IN-PROGRESS"
  );
});

// (props.current_hole && !props.current_hole.notes) || edit_state

// only display on hole_state match and if edit_state is true
// only if game_status is IN-PROGRESS
const allow_prev_holes_edit = computed(() => {
  return (
    (edit_state.value ||
      props.current_hole.hole_number === game_hole_state?.value) &&
    game_status?.value === "IN-PROGRESS"
  );
});

// (props.current_hole.notes && props.current_hole?.hole_number < game_hole_state! && !edit_state) || game_status === 'COMPLETE'

// -----------------
// Display games as card / list view to click on complete game for stats, or in-progress game
// --------
//
onMounted(() => {
  // grab whatever shots are in hole shot array and tally strokes to display current hole score
  updateHoleScore();

  console.log("shots array in hole-comp: ", props.current_shots);
});
</script>

<style src="./mainstyles.css"></style>

<template>
  <section class="">
    <div class="">
      <div class="flex justify-between items-center" @click="dropDown('hole')">
        <h4 v-if="props.current_hole" class="section-header">
          Hole {{ props.current_hole.hole_number }}
        </h4>
        <i v-if="!holeDrop" class="bi bi-plus text-3xl"></i>
        <i v-if="holeDrop" class="bi bi-dash text-3xl"></i>
      </div>

      <!-- hole information -->
      <div v-if="holeDrop" class="">
        <!-- edit button -->
        <div
          v-if="edit_condition"
          class="flex justify-end mb-3"
          @click="flipEdit">
          <div class="rounded border border-gray-400">
            <button class="p-1" v-if="!edit_state" type="button">Edit</button>
            <button class="p-1" v-if="edit_state" type="button">Editing</button>
          </div>
        </div>
        

        <!-- strict hole data -->
        <div class="grid grid-cols-3 gap-5">
          <div class="grid-card">
            <h4 class="card-title">Score</h4>
            <div class="card-divider"></div>
            <h4 class="card-data">
              {{ current_hole_score }}
            </h4>
          </div>

          <!-- <gridCard title="Score" :data_point="current_hole_score"/> -->

          <div class="grid-card">
            <h4 class="card-title">Par</h4>
            <div class="card-divider"></div>
            <h4 v-if="props.current_hole" class="card-data">
              {{ props.current_hole.par }}
            </h4>
          </div>

          <div class="grid-card">
            <h4 class="card-title">Putts</h4>
            <div class="card-divider"></div>
            <h4 v-if="props.current_hole" class="card-data">
              {{ props.current_hole.putt_count }}
            </h4>
          </div>
        </div>

        <!-- putts count / drop down -->
        <!--  -->
        <section class="" v-if="allow_prev_holes_edit">
          <div class="" @click="dropDown('putt')">
            <h4 class="text-2xl mb-1">Putts</h4>
            <div class="grid grid-cols-7">
              <div
                v-for="value in putts"
                class="flex justify-center items-center p-2 rounded border"
                :class="{ 'bg-gray-400': holeForm.putt_count === value }"
                @click="changePuttCount(value)">
                {{ value }}
              </div>
            </div>
          </div>
        </section>

        <!-- shots drop down -->
        <section class="mt-5" @click="dropDown('shot')">
          <div class="">
            <shot-component
              :edit_state="edit_state"
              :hole_data="props.current_hole"
              :current_shots="props.current_shots!" />
          </div>
        </section>

        <!-- map shot comp -->
        <map-plugin
          v-if="props.current_shots"
          :current_shots="props.current_shots" />

        <!-- notes -->
        <section v-if="allow_prev_holes_edit" class="mt-5">
          <h4 class="section-header">Notes</h4>
          <textarea
            v-model="holeForm.notes"
            class="p-1 border-default w-full"
            placeholder="Hole notes..."></textarea>
        </section>

        <!-- display notes for previous holes or what not -->
        <section
          v-if="props.current_hole.notes && ((props.current_hole?.hole_number < game_hole_state! && !edit_state) || game_status === 'COMPLETE')"
          class="mt-5">
          <h4 class="section-header">Notes</h4>
          <p class="p-1 border-default w-full" placeholder="Hole notes...">
            {{ props.current_hole.notes }}
          </p>
        </section>
        <!-- -->

        <div
          v-if="
            (props.current_hole?.hole_number === game_hole_state ||
              edit_state) &&
            props.game_status === 'IN-PROGRESS'
          ">
          <div class="flex justify-center p-2 rounded border bg-blue-300 mt-3">
            <button v-if="!edit_state" type="button" @click="submitHole">
              Next Hole!
            </button>
            <button
              v-if="edit_state"
              type="button"
              @click="submitEditPreviousHole">
              Submit Edit!
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
