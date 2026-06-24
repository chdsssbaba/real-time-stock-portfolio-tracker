import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllStocks } from '../../../store/portfolio/portfolio.selectors';
import { removeStock } from '../../../store/portfolio/portfolio.actions';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockListComponent {
  private store = inject(Store);
  stocks$ = this.store.select(selectAllStocks);

  onRemove(symbol: string, event: Event): void {
    event.stopPropagation(); // Avoid triggering navigation to details
    this.store.dispatch(removeStock({ symbol }));
  }
}
