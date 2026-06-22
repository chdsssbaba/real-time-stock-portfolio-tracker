import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PortfolioState } from './portfolio.state';
import * as fromPortfolio from './portfolio.reducer';

export const selectPortfolioState = createFeatureSelector<PortfolioState>('portfolio');

export const selectAllStocks = createSelector(
  selectPortfolioState,
  fromPortfolio.selectAll
);

export const selectLoading = createSelector(
  selectPortfolioState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectPortfolioState,
  (state) => state.error
);

export const selectPortfolioTotalValue = createSelector(
  selectAllStocks,
  (stocks) => stocks.reduce((acc, stock) => acc + (stock.currentPrice * stock.quantity), 0)
);

export const selectPortfolioDailyChange = createSelector(
  selectAllStocks,
  (stocks) => {
    // Total value of the portfolio at current prices
    const totalCurrent = stocks.reduce((acc, stock) => acc + (stock.currentPrice * stock.quantity), 0);
    // Total value of the portfolio yesterday (currentPrice - dailyChange)
    const totalYesterday = stocks.reduce((acc, stock) => {
      const yesterdayPrice = stock.currentPrice - stock.dailyChange;
      return acc + (yesterdayPrice * stock.quantity);
    }, 0);

    const absoluteChange = totalCurrent - totalYesterday;
    const changePercent = totalYesterday > 0 ? (absoluteChange / totalYesterday) * 100 : 0;
    
    return {
      absoluteChange: parseFloat(absoluteChange.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  }
);
