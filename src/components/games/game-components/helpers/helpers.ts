import {
  EIGHTEEN_HOLES_MAP,
  NINE_HOLES_MAP,
  type EightHoleKey,
  type NineHoleKey,
  type THoles,
} from "../../../../types/course";

export function getKeyFromIndex(hole_number: number, holes: THoles) {
  console.log("values given to get key for indexer: ", hole_number, holes);
  if (holes === 18) {
    console.log("valuer: ", EIGHTEEN_HOLES_MAP[hole_number - 1]);
    return EIGHTEEN_HOLES_MAP[hole_number - 1];
  } else if (holes === 9) {
    return NINE_HOLES_MAP[hole_number - 1];
  }
}

export function isNineKey(key: NineHoleKey | EightHoleKey) {
  if (
    key === "hole_one" ||
    key === "hole_two" ||
    key === "hole_three" ||
    key === "hole_four" ||
    key === "hole_five" ||
    key === "hole_six" ||
    key === "hole_seven" ||
    key === "hole_eight" ||
    key === "hole_nine"
  ) {
    return key as NineHoleKey;
  } else {
    return false;
  }
}
