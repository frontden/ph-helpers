import {TournamentInfo} from "./tournament-info";

export interface PlayerResults {
  rows: Array<TournamentInfo>;
  count: number;
  sum: number;
}
