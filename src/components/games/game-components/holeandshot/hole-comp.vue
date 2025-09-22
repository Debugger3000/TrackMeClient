<script setup lang="ts">
import { inject, onMounted, ref, watch, type Ref } from "vue";

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

const router = useRouter();

const props = defineProps<{
  game_status: GameStatus;
  current_hole: Hole_Data;
  current_shots: Game_Shot_Data_Submit[];
  updateGameShots: (game_data: Game_Shot_Data_Submit) => void;
  // gameData: IGameView[];
  //   courseSelector?: (index: number) => void;
  //   course?: ICourseView;
}>();

const current_hole_state = inject<Ref<number, number>>("current_hole_state");
const game_hole_state = inject<Ref<number, number>>("game_hole_state");
const game_status = inject<Ref<GameStatus, GameStatus>>("game_status");

// const injector = inject<{ goNextHole: () => void }>("goNextHole");

const goNextHole = inject<() => void>("goNextHole");

// putt values
const putts: number[] = [0, 1, 2, 3, 4, 5, 6];

// current score in hole
const current_hole_score = ref<number>(0);

// edit state for holes. Players can edit things if they accidently submitted wrong data
let edit_state = ref<boolean>(false);
let submit_text = ref<string>("Next Hole!");

watch(
  () => props.current_shots,

  () => {
    console.log("current holes was pushed too hehehehehehe");
    // grab whatever shots are in hole shot array and tally strokes to display current hole score
    updateHoleScore();
    submit_text.value = "Next Hole!";
  }
);

function updateHoleScore() {
  if (props.current_shots !== undefined) {
    let score_count = 0;
    props.current_shots.forEach((data) => {
      console.log("shottter: ", data);
      score_count = score_count + data.stroke;
    });
    current_hole_score.value = score_count;
  }
}

// drop downs
let puttDrop = ref<boolean>(true);
let shotDrop = ref<boolean>(true);

// course selected to create game on
function dropDown(type: string) {
  if (type === "putt") {
    puttDrop.value = !puttDrop.value;
  } else if (type === "shot") {
    shotDrop.value = !shotDrop.value;
  }
}

// change putt count
function changePuttCount(count: number) {
  holeForm.value.putt_count = count;
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

  const par_adjusted_score = current_hole_score.value - props.current_hole.par;
  // set hole score (stroke)
  holeForm.value.score = current_hole_score.value;
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
      goNextHole?.();
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
    submit_text.value = "Submit Edit!";
  }
}

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

<template>
  <section class="">
    <div class="flex justify-between items-center mb-3 border-b pb-1">
      <h4 v-if="props.current_hole" class="text-2xl">
        Hole {{ props.current_hole.hole_number }}
      </h4>
      <h4 class="text-2xl">Score: {{ current_hole_score }}</h4>
      <h4 v-if="props.current_hole" class="text-2xl">
        Par:
        {{ props.current_hole.par }}
      </h4>
      <!--  -->
      <div
        v-if="props.current_hole.hole_number < game_hole_state! && game_status === 'IN-PROGRESS'"
        class=""
        @click="flipEdit">
        <button
          class="p-1 bg-green-200 border"
          v-if="!edit_state"
          type="button">
          Edit
        </button>
        <button class="p-1 bg-green-200 border" v-if="edit_state" type="button">
          Editing
        </button>
      </div>
    </div>

    <!-- putts count / drop down -->
    <!--  -->
    <section
      class=""
      v-if="edit_state || props.current_hole.hole_number === game_hole_state">
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

    <!-- notes -->
    <section
      v-if="(props.current_hole && !props.current_hole.notes) || edit_state"
      class="mt-5">
      <h4 class="text-2xl mb-1">Notes</h4>
      <textarea
        v-model="holeForm.notes"
        class="p-1 rounded border border-0.5 w-full"
        placeholder="Hole notes..."></textarea>
    </section>

    <!-- display notes for previous holes or what not -->
    <section
      v-if="(props.current_hole.notes && props.current_hole?.hole_number < game_hole_state! && !edit_state) || game_status === 'COMPLETE'"
      class="mt-5">
      <h4 class="text-2xl mb-1">Notes</h4>
      <p
        class="p-1 rounded border border-0.5 w-full"
        placeholder="Hole notes...">
        {{ props.current_hole.notes }}
      </p>
    </section>
    <!-- -->

    <div
      v-if="props.current_hole?.hole_number === game_hole_state || edit_state">
      <div class="flex justify-center p-2 rounded border bg-blue-300 mt-3">
        <button type="button" @click="submitHole">{{ submit_text }}</button>
      </div>
    </div>

    <!-- current holes stats ??? -->
  </section>
</template>
