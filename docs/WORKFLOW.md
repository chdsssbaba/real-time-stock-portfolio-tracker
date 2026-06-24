# System and User Workflows

This document describes the workflows implemented in Aether Stocks.

## User Actions
1. **Adding an Asset**: The user inputs a symbol and quantity. The application queries suggestions from the mock database, fetches the stock details, and updates the portfolio store.
2. **Removing an Asset**: The user clicks the trash icon. The application dispatches the removal action to purge the entity from the store.
3. **Viewing Trends**: Clicking an asset redirects the router to `/stocks/:symbol`, loading 30-day historical chart data.

## System Workflows
- **Real-Time Data Feed**: Every 5 seconds, an NgRx effect updates tracked asset prices with standard random-walk price adjustments.
- **State Persistence**: Component views subscribe to memoized state slices to prevent laggy interactions.
