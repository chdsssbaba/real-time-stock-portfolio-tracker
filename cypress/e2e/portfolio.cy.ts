describe('Stock Portfolio Tracker E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('a. should successfully load and display initial portfolio data', () => {
    // Check header and core layout elements
    cy.get('app-header').should('be.visible');
    cy.get('app-sidebar').should('be.visible');
    cy.get('app-footer').should('be.visible');

    // Check portfolio summary is visible
    cy.get('app-portfolio-summary').should('be.visible');
    cy.get('app-portfolio-summary .total-value').should('contain', '$');

    // Verify initial mock stocks (AAPL and GOOG) are loaded in the stock list
    cy.get('app-stock-list table').should('be.visible');
    cy.get('app-stock-list tbody tr.stock-item').should('have.length', 2);
    cy.get('app-stock-list tbody tr.stock-item').eq(0).should('contain', 'AAPL');
    cy.get('app-stock-list tbody tr.stock-item').eq(1).should('contain', 'GOOG');
  });

  it('b. should add a new valid stock to the portfolio and verify its presence and data', () => {
    // Fill in symbol and quantity for MSFT (a valid mock stock)
    cy.get('app-add-stock input.symbol-input').type('MSFT');
    cy.get('app-add-stock input.quantity-input').clear().type('15');
    cy.get('app-add-stock button[type="submit"]').click();

    // Check that MSFT appears in the list
    cy.get('app-stock-list tbody tr.stock-item').should('have.length', 3);
    cy.get('app-stock-list tbody tr.stock-item').contains('MSFT').should('be.visible');
    cy.get('app-stock-list tbody tr.stock-item').contains('15 shares').should('be.visible');
  });

  it('c. should show error when adding an invalid stock symbol', () => {
    // Fill in an invalid symbol
    cy.get('app-add-stock input.symbol-input').type('XYZ');
    cy.get('app-add-stock input.quantity-input').clear().type('5');
    cy.get('app-add-stock button[type="submit"]').click();

    // Check error banner appears with correct error message
    cy.get('app-portfolio .error-banner').should('be.visible');
    cy.get('app-portfolio .error-banner .error-text').should('contain', 'Stock symbol "XYZ" not found.');
  });

  it('d. should remove an existing stock from the portfolio and verify its absence', () => {
    // Initial length is 2 (AAPL, GOOG)
    cy.get('app-stock-list tbody tr.stock-item').should('have.length', 2);

    // Remove AAPL
    cy.get('app-stock-list tbody tr.stock-item').eq(0).find('.remove-btn').click();

    // Verify it is removed and length is 1
    cy.get('app-stock-list tbody tr.stock-item').should('have.length', 1);
    cy.get('app-stock-list tbody tr.stock-item').should('not.contain', 'AAPL');
  });

  it('e. should navigate to details page and verify chart renders with data', () => {
    // Click on AAPL stock row to navigate to details
    cy.get('app-stock-list tbody tr.stock-item').eq(0).click();

    // Check route is correct
    cy.url().should('include', '/stocks/AAPL');

    // Verify details section elements
    cy.get('.stock-details-view').should('be.visible');
    cy.get('.stock-symbol').should('contain', 'AAPL');
    cy.get('.holdings-summary-info').should('be.visible');

    // Verify chart is rendered
    cy.get('.chart-wrapper canvas').should('be.visible');

    // Go back using navigation link
    cy.get('.back-link').click();
    cy.url().should('include', '/portfolio');
  });

  it('f. should render properly across desktop and mobile viewports', () => {
    // Test desktop viewport (1440x900)
    cy.viewport(1440, 900);
    cy.get('app-header').should('be.visible');
    cy.get('app-sidebar').should('be.visible');
    cy.get('app-portfolio-summary').should('be.visible');

    // Test mobile viewport (375x667)
    cy.viewport(375, 667);
    cy.get('app-header').should('be.visible');
    // Sidebar should be hidden on mobile/tablet screens in our media queries
    cy.get('app-sidebar').should('not.be.visible');
    cy.get('app-portfolio-summary').should('be.visible');
  });
});
