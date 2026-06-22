import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Stock, StockSearchResult } from '../../shared/models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockDataService {
  private mockStocks: Stock[] = [
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.', 
      currentPrice: 150.00, 
      dailyChange: 1.50, 
      dailyChangePercent: 1.0, 
      quantity: 10, 
      historicalData: [] 
    },
    { 
      symbol: 'GOOG', 
      name: 'Alphabet Inc.', 
      currentPrice: 2500.00, 
      dailyChange: -25.00, 
      dailyChangePercent: -1.0, 
      quantity: 5, 
      historicalData: [] 
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corp.', 
      currentPrice: 320.00, 
      dailyChange: 4.80, 
      dailyChangePercent: 1.5, 
      quantity: 0, // initially 0 or not in portfolio
      historicalData: [] 
    },
    { 
      symbol: 'TSLA', 
      name: 'Tesla Inc.', 
      currentPrice: 700.00, 
      dailyChange: -14.00, 
      dailyChangePercent: -2.0, 
      quantity: 0, 
      historicalData: [] 
    },
    { 
      symbol: 'AMZN', 
      name: 'Amazon.com Inc.', 
      currentPrice: 3300.00, 
      dailyChange: 15.00, 
      dailyChangePercent: 0.45, 
      quantity: 0, 
      historicalData: [] 
    }
  ];

  constructor() {
    // Pre-populate historical data
    this.mockStocks.forEach(stock => {
      stock.historicalData = this.generateMockHistoricalData(stock.currentPrice);
    });
  }

  private generateMockHistoricalData(currentPrice: number): { date: string; price: number }[] {
    const data: { date: string; price: number }[] = [];
    const today = new Date();
    let price = currentPrice;
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      // Random walk price generation
      const changePercent = (Math.random() * 4 - 2) / 100; // -2% to +2%
      price = price * (1 + changePercent);
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2))
      });
    }
    return data;
  }

  getInitialPortfolio(): Observable<Stock[]> {
    // Only return AAPL and GOOG for initial portfolio
    const initial = this.mockStocks.filter(s => s.symbol === 'AAPL' || s.symbol === 'GOOG');
    return of(JSON.parse(JSON.stringify(initial))).pipe(delay(500));
  }

  searchStocks(query: string): Observable<StockSearchResult[]> {
    if (!query) {
      return of([]);
    }
    const cleanQuery = query.trim().toUpperCase();
    const results = this.mockStocks
      .filter(s => s.symbol.includes(cleanQuery) || s.name.toLowerCase().includes(query.toLowerCase()))
      .map(s => ({ symbol: s.symbol, name: s.name }));
    return of(results).pipe(delay(300));
  }

  getStockDetails(symbol: string): Observable<Stock | undefined> {
    const stock = this.mockStocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (stock) {
      const cloned = JSON.parse(JSON.stringify(stock)) as Stock;
      if (!cloned.historicalData || cloned.historicalData.length === 0) {
        cloned.historicalData = this.generateMockHistoricalData(cloned.currentPrice);
      }
      return of(cloned).pipe(delay(500));
    }
    return of(undefined).pipe(delay(500));
  }

  updateStockPrice(symbol: string): Observable<Stock | undefined> {
    const stock = this.mockStocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (stock) {
      const newPrice = stock.currentPrice * (1 + (Math.random() * 0.02 - 0.01)); // +/- 1%
      const dailyChange = newPrice - stock.currentPrice;
      const dailyChangePercent = (dailyChange / stock.currentPrice) * 100;
      
      stock.currentPrice = parseFloat(newPrice.toFixed(2));
      stock.dailyChange = parseFloat(dailyChange.toFixed(2));
      stock.dailyChangePercent = parseFloat(dailyChangePercent.toFixed(2));
      
      return of(JSON.parse(JSON.stringify(stock))).pipe(delay(100));
    }
    return of(undefined);
  }
}
