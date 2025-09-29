import type { IGameView } from "./game";


export interface IGame_Stats {
  game_view: IGameView[];
  games_played: number;
  scoring_average: number;
  stroke_average: number;
  holes_played: number;
  total_shots: number;
  putt_average: number;
  fairways_hit_off_tee: number;
  longest_drive: number;
  penalty_percent: number;
  scores_distro: TGame_scores_distro;
}

// count up these scores, and use them in a graph... instead of grid display !
export type TGame_scores_distro = {
  eagle: number;
  birdie: number;
  par: number;
  bogey: number;
  double_or_more: number;
};