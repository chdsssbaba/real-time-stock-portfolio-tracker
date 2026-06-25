import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/portfolio', pathMatch: 'full' },
  { 
    path: 'portfolio', 
    loadChildren: () => import('./portfolio/portfolio.module').then(m => m.PortfolioModule) 
  },
  { 
    path: 'stocks/:symbol', 
    loadChildren: () => import('./stock-details/stock-details.module').then(m => m.StockDetailsModule) 
  },
  { path: '**', redirectTo: '/portfolio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
