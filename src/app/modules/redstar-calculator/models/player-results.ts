import {TournamentInfo} from "./tournament-info";

export interface PlayerResults {
  rows: Array<TournamentInfo>;
  regCount: number;
  finishCount: number;
  sum: number;
  dayStats: Array<DayResults>;
  currency: string;
}

export interface DayResults {
   regCount: number;
   finishCount: number;
   date: Date;
   sum: number;
   currency: string;
}

