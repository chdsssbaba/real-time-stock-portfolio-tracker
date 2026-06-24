import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { StockDataService } from '../../../core/services/stock-data.service';
import { addStock } from '../../../store/portfolio/portfolio.actions';
import { StockSearchResult } from '../../../shared/models/stock.model';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStockComponent implements OnInit, OnDestroy {
  symbol = '';
  quantity = 1;
  searchResults: StockSearchResult[] = [];
  searchSubject = new Subject<string>();
  searchSub?: Subscription;
  showDropdown = false;
  errorMessage = '';

  constructor(
    private stockDataService: StockDataService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((query) => this.stockDataService.searchStocks(query))
    ).subscribe((results) => {
      this.searchResults = results;
      this.showDropdown = results.length > 0;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onSearchChange(): void {
    this.errorMessage = '';
    this.searchSubject.next(this.symbol);
    if (!this.symbol) {
      this.showDropdown = false;
    }
  }

  selectResult(result: StockSearchResult): void {
    this.symbol = result.symbol;
    this.showDropdown = false;
    this.searchResults = [];
    this.cdr.markForCheck();
  }

  closeDropdown(): void {
    // Delay slightly to allow click event on item to trigger first
    setTimeout(() => {
      this.showDropdown = false;
      this.cdr.markForCheck();
    }, 150);
  }

  onAdd(): void {
    const symbolClean = this.symbol.trim().toUpperCase();
    if (!symbolClean) {
      this.errorMessage = 'Please enter a stock symbol.';
      return;
    }
    if (!this.quantity || this.quantity <= 0) {
      this.errorMessage = 'Quantity must be at least 1.';
      return;
    }

    this.store.dispatch(addStock({ symbol: symbolClean, quantity: this.quantity }));
    this.symbol = '';
    this.quantity = 1;
    this.errorMessage = '';
    this.showDropdown = false;
    this.searchResults = [];
  }
}
