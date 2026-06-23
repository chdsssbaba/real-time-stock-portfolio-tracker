import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, timer, from } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { StockDataService } from '../../core/services/stock-data.service';
import * as PortfolioActions from './portfolio.actions';
import { selectAllStocks } from './portfolio.selectors';
import { PortfolioState } from './portfolio.state';

@Injectable()
export class PortfolioEffects {
  loadPortfolio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadPortfolio),
      mergeMap(() =>
        this.stockDataService.getInitialPortfolio().pipe(
          map((stocks) => PortfolioActions.loadPortfolioSuccess({ stocks })),
          catchError((error) =>
            of(PortfolioActions.loadPortfolioFailure({ error: error.message || 'Failed to load portfolio' }))
          )
        )
      )
    )
  );

  addStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.addStock),
      withLatestFrom(this.store.select(selectAllStocks)),
      mergeMap(([action, stocks]) => {
        const symbolUpper = action.symbol.toUpperCase();
        const exists = stocks.find((s) => s.symbol.toUpperCase() === symbolUpper);
        
        if (exists) {
          // If already in portfolio, just update its quantity
          const updatedStock = {
            ...exists,
            quantity: exists.quantity + action.quantity
          };
          return of(PortfolioActions.addStockSuccess({ stock: updatedStock }));
        }

        return this.stockDataService.getStockDetails(action.symbol).pipe(
          map((stock) => {
            if (stock) {
              const newStock = {
                ...stock,
                quantity: action.quantity
              };
              return PortfolioActions.addStockSuccess({ stock: newStock });
            } else {
              return PortfolioActions.addStockFailure({ error: `Stock symbol "${action.symbol}" not found.` });
            }
          }),
          catchError((error) =>
            of(PortfolioActions.addStockFailure({ error: error.message || 'Error loading stock details.' }))
          )
        );
      })
    )
  );

  removeStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.removeStock),
      map((action) => PortfolioActions.removeStockSuccess({ symbol: action.symbol })),
      catchError((error) =>
        of(PortfolioActions.removeStockFailure({ error: error.message || 'Failed to remove stock' }))
      )
    )
  );

  updatePrices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadPortfolioSuccess, PortfolioActions.addStockSuccess, PortfolioActions.removeStockSuccess),
      switchMap(() =>
        timer(5000, 5000).pipe(
          withLatestFrom(this.store.select(selectAllStocks)),
          switchMap(([, stocks]) => {
            if (stocks.length === 0) {
              return of();
            }
            const actions = stocks.map((stock) => {
              const changePercent = (Math.random() * 2 - 1) / 100; // +/- 1%
              const newPrice = Math.max(0.01, parseFloat((stock.currentPrice * (1 + changePercent)).toFixed(2)));
              const dailyChange = parseFloat((stock.dailyChange + (newPrice - stock.currentPrice)).toFixed(2));
              const yesterdayPrice = stock.currentPrice - stock.dailyChange;
              const dailyChangePercent = yesterdayPrice > 0 ? parseFloat(((dailyChange / yesterdayPrice) * 100).toFixed(2)) : 0;

              return PortfolioActions.updateStockPrice({
                symbol: stock.symbol,
                newPrice,
                dailyChange,
                dailyChangePercent
              });
            });
            return from(actions);
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private stockDataService: StockDataService,
    private store: Store<PortfolioState>
  ) {}
}
