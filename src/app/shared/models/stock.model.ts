export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  quantity: number; // User's holding
  historicalData: { date: string; price: number }[];
}

export interface StockSearchResult {
  symbol: string;
  name: string;
}
