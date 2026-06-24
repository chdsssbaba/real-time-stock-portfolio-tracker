import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLoading, selectError } from '../store/portfolio/portfolio.selectors';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent {
  private store = inject(Store);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
}
