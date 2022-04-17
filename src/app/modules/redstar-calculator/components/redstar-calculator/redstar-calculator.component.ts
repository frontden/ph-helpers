import {Component, OnInit} from '@angular/core';
import {TournamentInfo} from "../../models/tournament-info";
import {DayResults, LimitStats, PlayerResults} from "../../models/player-results";

@Component({
  selector: 'app-redstar-calculator',
  templateUrl: './redstar-calculator.component.html',
  styleUrls: ['./redstar-calculator.component.scss']
})
export class RedstarCalculatorComponent implements OnInit {

  calculatedResults: PlayerResults = {
    rows: [],
    regCount: 0,
    finishCount: 0,
    sum: 0,
    dayStats: [],
    currency: '',
    bonus: 0
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  async filesAppear(event: any) {
    let files = Array.from(event.target.files).map((file: any) => {

      let reader = new FileReader();

      return new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
        // Read the file as a text
        reader.readAsText(file);
      });

    });

    let result = await Promise.all(files);
    this.handleResults(result);
  }

  handleResults(result: Array<any>) {
    const rows: Array<TournamentInfo> = [];
    const dayStatsResults: Array<DayResults> = [];
    result.forEach((res: any) => {

      const tourStats = res.split('\n').filter((line: string) => line.includes('po_tourn'));
      const bonusStats = res.split('\n').filter((line: string) => line.includes('pnt_bonus')).map((line: string) => {
        const subLines = line.split(',');
        return +subLines[5].replace(/"/g, '').split(' ')[0];
      });

      const dayStats = tourStats.map((line: string) => {
        const subLines = line.split(',');
        return {
          boId: subLines[0].replace(/"/g, ''),
          gameId: subLines[1].replace(/"/g, ''),
          sum: +subLines[5].replace(/"/g, '').split(' ')[0],
          type: subLines[2].replace(/"/g, ''),
          date: new Date(subLines[4].replace('"', '').substr(0, 10)),
          currency: subLines[5].replace(/"/g, '').split(' ')[1],
        }
      });

      const regByLimit: LimitStats[] = [];
      for (let dayStat of dayStats) {
        if (dayStat.type !== 'po_tourn_reg') {
          continue;
        }
        const limitElement = regByLimit.find(value => Math.abs(value.limit - Math.abs(dayStat.sum)) < 0.5);
        if (limitElement) {
          limitElement.count++;
        } else {
          regByLimit.push({limit: Math.abs(dayStat.sum), count: 1});
        }
      }

      dayStatsResults.push({
        regCount: dayStats.filter((v: any) => v.type === 'po_tourn_reg').length,
        finishCount: dayStats.filter((v: any) => v.type === 'po_tourn_win').length,
        sum: dayStats.reduce((sum: number, currentValue: TournamentInfo) => {
          return sum + currentValue.sum;
        }, 0),
        date: dayStats[0].date,
        currency: dayStats[0].currency === 'USD' ? '$' : '€',
        bonus: bonusStats.reduce((sum: number, value: string) => {
          return sum + +value;
        }, 0),
        regByLimit: regByLimit,
        regByLimitString: regByLimit.map( value => `${value.count} for ${value.limit}${dayStats[0].currency === 'USD' ? '$' : '€'}`).join(', ')
      });

      rows.push(...dayStats);
    });

    let regByLimitAll: LimitStats[] = [];
    for (let dayStatsResult of dayStatsResults) {
      dayStatsResult.regByLimit?.forEach(dayValue => {
        const limitElement = regByLimitAll.find(value => Math.abs(dayValue.limit - value.limit) < 0.5);
        if (limitElement) {
          limitElement.count += dayValue.count;
        } else {
          regByLimitAll.push({limit: dayValue.limit, count: dayValue.count});
        }
      });
    }

    const regByLimitAllString = regByLimitAll.map( value => `${value.count} for ${value.limit}${dayStatsResults[0].currency === 'USD' ? '$' : '€'}`).join(', ')

    this.calculatedResults = {
      rows,
      regCount: rows.filter((v: any) => v.type === 'po_tourn_reg').length,
      finishCount: rows.filter((v: any) => v.type === 'po_tourn_win').length,
      sum: rows.reduce((sum, currentValue) => {
        return sum + currentValue.sum;
      }, 0),
      dayStats: dayStatsResults,
      currency: dayStatsResults[0].currency === 'USD' ? '$' : '€',
      bonus: dayStatsResults.reduce((sum, currentValue) => {
        return sum + currentValue.bonus;
      }, 0),
      regByLimitString: regByLimitAllString
    };

    this.calculatedResults.dayStats.sort((a, b) => a.date.getTime() - b.date.getTime());
  }


}
