import {TournamentInfo} from "./tournament-info";

export interface PlayerResults {
  rows: Array<TournamentInfo>;
  regCount: number;
  finishCount: number;
  sum: number;
  dayStats: Array<{sum: number, regCount: number, finishCount: number, date: Date}>;
}
