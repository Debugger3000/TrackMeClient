import type {
  eighteen_hole_card,
  ICourse,
  ICourseView,
  nine_hole_card,
  THoles,
} from "./course";
import type { IShot, IShotContact, IShotPaths, IShotType } from "./shot";

export interface ICreate_Game_Return {
  success: true;
  message: string;
  id: string;
}

export type GameStatus = "IN-PROGRESS" | "COMPLETE";

type Coordinates = {
  start_lat: number | null;
  start_lng: number | null;
  end_lat: number | null;
  end_lng: number | null;
};
export type Land_Type =
  | "fairway"
  | "rough"
  | "green"
  | "bunker"
  | "OB"
  | "land_hazard"
  | "water_hazard";

export const LAND_TYPE = [
  "fairway",
  "rough",
  "green",
  "bunker",
  "OB",
  "land_hazard",
  "water_hazard",
] as const;

//   export interface IShotGame {
//     game_id: number;
//     userId: number;
//     hole: number;
//     clubType: IShotType;
//     shotContact: IShotContact;
//     shotPath: IShotPaths;
//     start_coordinates: Coordin | null;
//     end_coorindates: Coordinates | null;
//     land_type: Land_Type;
//     yards: number | null;
//     metres: number | null;
//   }

// each individual golf shot
// ishot data will need to be expanded out for this game_shot_data table in SQL
export type Game_Shot_Data = {
  hole_id: number;
  user_id: number;
  shot_count: number;
  shot: IShot;
  stroke: number;
  coordinates: Coordinates | null;
  land_type: Land_Type;
  yards: number | null;
  metres: number | null;
};

export type Game_Shot_Data_Submit = {
  hole_id: number;
  user_id: number;
  game_id: number;
  shot_count: number;
  stroke: number;
  club_type: IShotType | undefined;
  shot_contact: IShotContact;
  shot_path: IShotPaths;
  start_lat: number | null;
  start_lng: number | null;
  end_lat: number | null;
  end_lng: number | null;
  land_type: Land_Type | null;
  yards: number | null;
  metres: number | null;
};

// each individual hole data
// grabs data from 'courses' like PAR + HOLE_NUMBER
export type Hole_Data = {
  id: number;
  game_id: number;
  user_id: number;
  hole_number: number;
  putt_count: number;
  par: number;
  score: number;
  notes: string | null;
  hole_shot_data: Game_Shot_Data[] | null;
};

export type Hole_Submit = {
  id: number;
  putt_count: number;
  score: number;
  notes: string | null;
};

export type Nine_Hole_Data = {
  hole_one: Hole_Data;
  hole_two: Hole_Data;
  hole_three: Hole_Data;
  hole_four: Hole_Data;
  hole_five: Hole_Data;
  hole_six: Hole_Data;
  hole_seven: Hole_Data;
  hole_eight: Hole_Data;
  hole_nine: Hole_Data;
};

export type Eighteen_Hole_Data = {
  hole_one: Hole_Data;
  hole_two: Hole_Data;
  hole_three: Hole_Data;
  hole_four: Hole_Data;
  hole_five: Hole_Data;
  hole_six: Hole_Data;
  hole_seven: Hole_Data;
  hole_eight: Hole_Data;
  hole_nine: Hole_Data;
  hole_ten: Hole_Data;
  hole_eleven: Hole_Data;
  hole_twelve: Hole_Data;
  hole_thirteen: Hole_Data;
  hole_fourteen: Hole_Data;
  hole_fifteen: Hole_Data;
  hole_sixteen: Hole_Data;
  hole_seventeen: Hole_Data;
  hole_eighteen: Hole_Data;
};

// type Nine_Hole_Data = {
//   front_nine: Front_Hole_Data;
// };

// type Eighteen_Hole_Data = {
//   front_nine: Front_Hole_Data;
//   back_nine: Back_Hole_Data;
// };

// This should hold game data, hole by hole data (shots,puts) + total par
export interface IGame<
  T_Hole_Type = Nine_Hole_Data | Eighteen_Hole_Data,
  TScore_card_type = nine_hole_card | eighteen_hole_card
> {
  final_game_object: {
    id: number;
    course: ICourseView;
    user_id: number;
    course_score_card: TScore_card_type;
    status: GameStatus;
    date: string;
    score: number;
    hole_data: T_Hole_Type;
    hole_state: number | null;
    notes: string | null;
  };
}

// data type that game overview will have, doesnt need all the extra, stuff
// club_name is joined into the query...
export interface IGameView {
  id: number;
  course_id: number;
  user_id: number;
  status: GameStatus;
  date: string;
  score: number;
  club_name: string;
  par: number;
  holes: number;
}

//
export type HoleType<H extends THoles> = H extends 18
  ? IGame<Eighteen_Hole_Data, eighteen_hole_card>
  : IGame<Nine_Hole_Data, nine_hole_card>;

export interface IGameNine {
  final_game_object: {
    id: number;
    course: ICourseView;
    user_id: number;
    course_score_card: nine_hole_card;
    status: GameStatus;
    date: string;
    score: number;
    hole_data: Nine_Hole_Data;
    hole_state: number | null;
    notes: string | null;
  };
}

export interface IGameEighteen {
  final_game_object: {
    id: number;
    course: ICourseView;
    user_id: number;
    course_score_card: eighteen_hole_card;
    status: GameStatus;
    date: string;
    score: number;
    hole_data: Eighteen_Hole_Data;
    hole_state: number | null;
    notes: string | null;
  };
}

// export type IGameStrict = IGameNine | IGameEighteen;

export type IGameStrict<H extends 9 | 18> = H extends 9
  ? IGameNine
  : IGameEighteen;

// do i build a whole game object when game is created ? YES

// build hole per entry into HOLE, complete a hole to move to next hole, CREATE next HOLE, once at end

// create shot when a SHOt is added on hole, PUTTs must be chosen before hole can be complete (0,1,2,3,4,5,6) ??
// shots are saved when added
// notes can be filled in, optional

// hole data is saved when COMPLETE is clicked...

// Last hole, will say COMPLETE GAME, then hole is saved, and game is completed, and status is changed to 'COMPLETE'

// // I game data object empty object
// const empty_hole: Hole_Data = {
//   id: 0,
//   game_id: 0,
//   user_id: 0,
//   hole_number: 0,
//   putt_count: 0,
//   par: 0,
//   score: 0,
//   notes: null,
//   hole_shot_data: null,
// };

// const game_data = {
//   club_name: "",
//   holes: 9,
//   par: 0,
//   location: "",
//   course_name: null,
//   id: 0,
//   user_id: 0,
//   course_id: 0,
//   status: "IN-PROGRESS" as Status,
//   date: new Date().toISOString(),
//   score: 0,
//   hole_state: 1,
//   notes: null,
//   hole_data: {
//     hole_one: { ...empty_hole },
//     hole_two: { ...empty_hole },
//     hole_three: { ...empty_hole },
//     hole_four: { ...empty_hole },
//     hole_five: { ...empty_hole },
//     hole_six: { ...empty_hole },
//     hole_seven: { ...empty_hole },
//     hole_eight: { ...empty_hole },
//     hole_nine: { ...empty_hole },
//   },
//   course_score_card: {} as eighteen_hole_card | nine_hole_card,
// } as const;
