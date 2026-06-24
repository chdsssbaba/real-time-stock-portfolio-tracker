import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPortfolioTotalValue, selectPortfolioDailyChange } from '../../../store/portfolio/portfolio.selectors';

@Component({
  selector: 'app-portfolio-summary',
  templateUrl: './portfolio-summary.component.html',
  styleUrls: ['./portfolio-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioSummaryComponent {
  private store = inject(Store);
  totalValue$ = this.store.select(selectPortfolioTotalValue);
  dailyChange$ = this.store.select(selectPortfolioDailyChange);
}
