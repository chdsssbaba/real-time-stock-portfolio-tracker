import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { Stock } from '../../shared/models/stock.model';
import { PortfolioState } from './portfolio.state';
import * as PortfolioActions from './portfolio.actions';

export const adapter = createEntityAdapter<Stock>({
  selectId: (stock) => stock.symbol
});

export const initialState: PortfolioState = adapter.getInitialState({
  isLoading: false,
  error: null
});

export const portfolioReducer = createReducer(
  initialState,
  on(PortfolioActions.loadPortfolio, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PortfolioActions.loadPortfolioSuccess, (state, { stocks }) => 
    adapter.setAll(stocks, { ...state, isLoading: false })
  ),
  on(PortfolioActions.loadPortfolioFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(PortfolioActions.addStock, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PortfolioActions.addStockSuccess, (state, { stock }) => 
    adapter.addOne(stock, { ...state, isLoading: false })
  ),
  on(PortfolioActions.addStockFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(PortfolioActions.removeStock, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PortfolioActions.removeStockSuccess, (state, { symbol }) => 
    adapter.removeOne(symbol, { ...state, isLoading: false })
  ),
  on(PortfolioActions.removeStockFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(PortfolioActions.updateStockPrice, (state, { symbol, newPrice, dailyChange, dailyChangePercent }) => 
    adapter.updateOne({
      id: symbol,
      changes: {
        currentPrice: newPrice,
        dailyChange: dailyChange,
        dailyChangePercent: dailyChangePercent
      }
    }, state)
  )
);

// Export selectors from entity adapter
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
