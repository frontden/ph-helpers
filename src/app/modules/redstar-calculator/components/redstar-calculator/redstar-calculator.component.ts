import { Component, OnInit } from '@angular/core';
import {TournamentInfo} from "../../models/tournament-info";
import {PlayerResults} from "../../models/player-results";

@Component({
  selector: 'app-redstar-calculator',
  templateUrl: './redstar-calculator.component.html',
  styleUrls: ['./redstar-calculator.component.scss']
})
export class RedstarCalculatorComponent implements OnInit {

  calculatedResults: PlayerResults = {rows: [], count: 0, sum: 0};

  constructor() { }

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
    result.forEach((res: any) => {
     rows.push(...res.split('\n').filter((line: string) => line.includes('po_tourn')).map( (line: string) => {
       const subLines = line.split(',');
        return {
          boId: subLines[0].replace('"', ''),
          gameId: subLines[1].replace('"', ''),
          sum: +subLines[5].replace('"', '').split(' ')[0],
          date: new Date(subLines[4].replace('"', ''))
        }
      }));
    });

    this.calculatedResults = {
      rows,
      count: rows.length,
      sum: rows.reduce((sum, currentValue) => {
        return sum + currentValue.sum;
      }, 0)
    };
  }



}
