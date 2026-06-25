import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { take } from 'rxjs/operators';
import { StockDataService } from '../core/services/stock-data.service';
import { selectAllStocks } from '../store/portfolio/portfolio.selectors';
import { Stock } from '../shared/models/stock.model';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockDetailsComponent implements OnInit {
  symbol = '';
  stock?: Stock;
  portfolioStock?: Stock;
  loading = true;
  error: string | null = null;

  // Chart configuration
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(20, 25, 45, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.4)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.4)' }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  constructor(
    private route: ActivatedRoute,
    private stockDataService: StockDataService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.symbol = params['symbol']?.toUpperCase() || '';
      if (this.symbol) {
        this.loadDetails();
      }
    });
  }

  loadDetails(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    // Check if the stock is in the portfolio for holdings info
    this.store.select(selectAllStocks).pipe(take(1)).subscribe((stocks) => {
      this.portfolioStock = stocks.find((s) => s.symbol.toUpperCase() === this.symbol);
    });

    this.stockDataService.getStockDetails(this.symbol).subscribe({
      next: (stock) => {
        if (stock) {
          this.stock = stock;
          this.setupChart(stock);
        } else {
          this.error = `Stock symbol "${this.symbol}" was not found.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.message || 'Failed to load stock details.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  setupChart(stock: Stock): void {
    const prices = stock.historicalData.map((d) => d.price);
    const labels = stock.historicalData.map((d) => d.date);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: prices,
          label: 'Price',
          fill: true,
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.05)',
          pointBackgroundColor: '#00f2fe',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#00f2fe',
          tension: 0.15
        }
      ]
    };
  }
}
