import { createAction, props } from '@ngrx/store';
import { Stock } from '../../shared/models/stock.model';

export const loadPortfolio = createAction('[Portfolio] Load Portfolio');
export const loadPortfolioSuccess = createAction(
  '[Portfolio] Load Portfolio Success',
  props<{ stocks: Stock[] }>()
);
export const loadPortfolioFailure = createAction(
  '[Portfolio] Load Portfolio Failure',
  props<{ error: string }>()
);

export const addStock = createAction(
  '[Portfolio] Add Stock',
  props<{ symbol: string; quantity: number }>()
);
export const addStockSuccess = createAction(
  '[Portfolio] Add Stock Success',
  props<{ stock: Stock }>()
);
export const addStockFailure = createAction(
  '[Portfolio] Add Stock Failure',
  props<{ error: string }>()
);

export const removeStock = createAction(
  '[Portfolio] Remove Stock',
  props<{ symbol: string }>()
);
export const removeStockSuccess = createAction(
  '[Portfolio] Remove Stock Success',
  props<{ symbol: string }>()
);
export const removeStockFailure = createAction(
  '[Portfolio] Remove Stock Failure',
  props<{ error: string }>()
);

export const updateStockPrice = createAction(
  '[Portfolio] Update Stock Price',
  props<{
    symbol: string;
    newPrice: number;
    dailyChange: number;
    dailyChangePercent: number;
  }>()
);
