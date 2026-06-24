import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PortfolioComponent } from './portfolio.component';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { PortfolioSummaryComponent } from './components/portfolio-summary/portfolio-summary.component';
import { AddStockComponent } from './components/add-stock/add-stock.component';

const routes: Routes = [
  { path: '', component: PortfolioComponent }
];

@NgModule({
  declarations: [
    PortfolioComponent,
    StockListComponent,
    PortfolioSummaryComponent,
    AddStockComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PortfolioModule { }
