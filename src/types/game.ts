import type {
  eighteen_hole_card,
  ICourseGameReturn,
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

export type Game_Shot_Delete = {
  hole_id: number;
  user_id: number;
  game_id: number;
  shot_count: number;
};

export interface Game_Shot_Data_Incoming extends Game_Shot_Data_Submit {
  id: number;
}

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
  hole_shot_data: Game_Shot_Data_Submit[] | null;
};

export type Hole_Submit = {
  id: number;
  putt_count: number;
  score: number;
  notes: string | null;
  game_id: number;
  hole_state: number;
  game_score: number;
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

export interface IGameObjectReturn {
  id: number;
  course: ICourseGameReturn;
  user_id: number;
  status: GameStatus;
  date: string;
  score: number;
  hole_state: number | null;
  notes: string | null;
}

export interface IGameReturnNine {
  game_object: IGameObjectReturn;
  score_card_data: nine_hole_card;
  hole_data: Nine_Hole_Data;
}

export interface IGameReturnEight {
  game_object: IGameObjectReturn;
  score_card_data: eighteen_hole_card;
  hole_data: Eighteen_Hole_Data;
}
