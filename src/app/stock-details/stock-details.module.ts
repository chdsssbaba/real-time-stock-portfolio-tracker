import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { StockDetailsComponent } from './stock-details.component';

const routes: Routes = [
  { path: '', component: StockDetailsComponent }
];

@NgModule({
  declarations: [
    StockDetailsComponent
  ],
  imports: [
    CommonModule,
    BaseChartDirective,
    RouterModule.forChild(routes)
  ]
})
export class StockDetailsModule { }
