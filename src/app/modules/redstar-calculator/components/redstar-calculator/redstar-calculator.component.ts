import {Component, OnInit} from '@angular/core';
import {TournamentInfo} from "../../models/tournament-info";
import {PlayerResults} from "../../models/player-results";

@Component({
  selector: 'app-redstar-calculator',
  templateUrl: './redstar-calculator.component.html',
  styleUrls: ['./redstar-calculator.component.scss']
})
export class RedstarCalculatorComponent implements OnInit {

  calculatedResults: PlayerResults = {rows: [], regCount: 0, finishCount: 0, sum: 0, dayStats: []};

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
    const dayStatsResults: Array<{sum: number, regCount: number, finishCount: number, date: Date}> = [];
    result.forEach((res: any) => {

      const dayStats = res.split('\n').filter((line: string) => line.includes('po_tourn')).map((line: string) => {
        const subLines = line.split(',');
        return {
          boId: subLines[0].replace(/"/g, ''),
          gameId: subLines[1].replace(/"/g, ''),
          sum: +subLines[5].replace(/"/g, '').split(' ')[0],
          type: subLines[2].replace(/"/g, ''),
          date: new Date(subLines[4].replace('"', '').substr(0, 10))
        }
      });

      dayStatsResults.push({
        regCount: dayStats.filter((v: any) => v.type === 'po_tourn_reg').length,
        finishCount: dayStats.filter((v: any) => v.type === 'po_tourn_win').length,
        sum: dayStats.reduce((sum: number, currentValue: TournamentInfo) => {
          return sum + currentValue.sum;
        }, 0),
        date: dayStats[0].date
      });

      rows.push(...dayStats);
    });

    this.calculatedResults = {
      rows,
      regCount: rows.filter((v: any) => v.type === 'po_tourn_reg').length,
      finishCount: rows.filter((v: any) => v.type === 'po_tourn_win').length,
      sum: rows.reduce((sum, currentValue) => {
        return sum + currentValue.sum;
      }, 0),
      dayStats: dayStatsResults
    };

    this.calculatedResults.dayStats.sort((a, b) => a.date.getTime() - b.date.getTime());
  }


}
