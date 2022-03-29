import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RedstarCalculatorComponent} from "./components/redstar-calculator/redstar-calculator.component";


const routes: Routes = [
  {
    path: '',
    component: RedstarCalculatorComponent
  },

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedstarCalculatorRouting { }
