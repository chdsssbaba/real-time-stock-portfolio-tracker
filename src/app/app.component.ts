import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadPortfolio } from './store/portfolio/portfolio.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'stock-tracker';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadPortfolio());
  }
}
