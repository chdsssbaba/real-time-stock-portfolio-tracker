import { EntityState } from '@ngrx/entity';
import { Stock } from '../../shared/models/stock.model';

export interface PortfolioState extends EntityState<Stock> {
  isLoading: boolean;
  error: string | null;
}
