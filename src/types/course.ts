// CONST vars
// -----------
export const holes = {
  nine: 9,
  eighteen: 18,
} as const;

export const parTypes = {
  three: 3,
  four: 3,
  five: 5,
} as const;

// TYPES
// -----------
type THoles = 9 | 18;

// nine hole card
type nine_hole_card = {
  hole_one: number;
  hole_two: number;
  hole_three: number;
  hole_four: number;
  hole_five: number;
  hole_six: number;
  hole_seven: number;
  hole_eight: number;
  hole_nine: number;
};

// eighteen hole card
type eighteen_hole_card = {
  hole_one: number;
  hole_two: number;
  hole_three: number;
  hole_four: number;
  hole_five: number;
  hole_six: number;
  hole_seven: number;
  hole_eight: number;
  hole_nine: number;
  hole_ten: number;
  hole_eleven: number;
  hole_twelve: number;
  hole_thirteen: number;
  hole_fourteen: number;
  hole_fifteen: number;
  hole_sixteen: number;
  hole_seventeen: number;
  hole_eighteen: number;
};

export type TparTypes = 3 | 4 | 5;

// INTERFACES
// ------------
export interface ICourse {
  club_name: string;
  holes: THoles;
  par: number;
  location: string;
  course: string | null;
  score_card: nine_hole_card | eighteen_hole_card;
}
