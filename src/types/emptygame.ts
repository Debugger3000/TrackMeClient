// import type {
//   eighteen_hole_card,
//   ICourse,
//   ICourseView,
//   nine_hole_card,
// } from "./course";
// import type {
//   Eighteen_Hole_Data,
//   Game_Shot_Data,
//   Hole_Data,
//   IGame,
//   Nine_Hole_Data,
// } from "./game";
// import type { IShot } from "./shot";

// // Minimal empty shot
// const emptyShot: Game_Shot_Data = {
//   hole_id: 0,
//   user_id: 0,
//   shot_count: 0,
//   shot: {} as IShot, // placeholder, can expand later
//   start_coordinates: null,
//   end_coorindates: null,
//   land_type: "fairway",
//   yards: null,
//   metres: null,
// };

// // Minimal empty hole
// const emptyHole: Hole_Data = {
//   id: 0,
//   game_id: 0,
//   user_id: 0,
//   hole_number: 0,
//   putt_count: 0,
//   par: 0,
//   score: 0,
//   notes: null,
//   hole_shot_data: [],
// };

// // Build 9-hole empty structure
// const emptyNineHoleData: Nine_Hole_Data = {
//   hole_one: { ...emptyHole },
//   hole_two: { ...emptyHole },
//   hole_three: { ...emptyHole },
//   hole_four: { ...emptyHole },
//   hole_five: { ...emptyHole },
//   hole_six: { ...emptyHole },
//   hole_seven: { ...emptyHole },
//   hole_eight: { ...emptyHole },
//   hole_nine: { ...emptyHole },
// };

// // Build 18-hole empty structure
// const emptyEighteenHoleData: Eighteen_Hole_Data = {
//   ...emptyNineHoleData,
//   hole_ten: { ...emptyHole },
//   hole_eleven: { ...emptyHole },
//   hole_twelve: { ...emptyHole },
//   hole_thirteen: { ...emptyHole },
//   hole_fourteen: { ...emptyHole },
//   hole_fifteen: { ...emptyHole },
//   hole_sixteen: { ...emptyHole },
//   hole_seventeen: { ...emptyHole },
//   hole_eighteen: { ...emptyHole },
// };

// // Empty course placeholder
// const emptyCourse: ICourseView = {
//   id: 0,
//   club_name: "",
//   course_name: null,
//   location: "",
//   par: 0,
//   holes: 9,
// };

// // Empty score card placeholders
// const emptyNineHoleCard: nine_hole_card = {} as nine_hole_card;
// const emptyEighteenHoleCard: eighteen_hole_card = {} as eighteen_hole_card;

// // Now build empty game object
// export const emptyGameNine: IGame<Nine_Hole_Data, nine_hole_card> = {
//   id: 0,
//   course: emptyCourse,
//   user_id: 0,
//   course_score_card: emptyNineHoleCard,
//   status: "IN-PROGRESS",
//   date: new Date().toISOString(),
//   score: 0,
//   hole_data: emptyNineHoleData,
//   hole_state: 1,
//   notes: null,
// };

// export const emptyGameEighteen: IGame<Eighteen_Hole_Data, eighteen_hole_card> =
//   {
//     ...emptyGameNine,
//     hole_data: emptyEighteenHoleData,
//     course_score_card: emptyEighteenHoleCard,
//   };
