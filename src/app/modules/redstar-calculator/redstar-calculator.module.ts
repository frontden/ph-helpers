import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { RedstarCalculatorComponent } from './components/redstar-calculator/redstar-calculator.component';
import {RedstarCalculatorRouting} from "./redstar-calculator-routing.module";



@NgModule({
  declarations: [
    RedstarCalculatorComponent
  ],
  imports: [
    CommonModule,
    RedstarCalculatorRouting
  ]
})
export class RedstarCalculatorModule { }
