import { test, expect } from '@playwright/test';

test.describe('Books Store UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page before each test
    await page.goto('http://localhost:3000');
  });

  test('should display non-fiction books on main page', async ({ page }) => {
    // Select "Non-Fiction" from the filter
    await page.selectOption('[data-testid="book-type-select"]', 'non-fiction');
    
    // Wait for the books to load
    await page.waitForSelector('[data-testid="books-grid"]');
    
    // Verify that books are displayed
    const books = await page.$$('[data-testid="book-card"]');
    expect(books.length).toBeGreaterThan(0);
  });

  test('should navigate to book details page', async ({ page }) => {
    // Click the first "View Details" button
    await page.click('[data-testid="book-card"] [data-testid="view-details-link"]');
    
    // Wait for navigation
    await page.waitForURL('**/books/*');
    
    // Wait for loading to complete (wait for the book details to be visible)
    await page.waitForSelector('[data-testid="name"]');
    
    // Verify all required fields are present and have values
    const fields = ['name', 'author', 'isbn', 'price', 'current-stock'];
    for (const field of fields) {
      const element = await page.$(`[data-testid="${field}"]`);
      expect(element).toBeTruthy();
      const text = await element?.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('should navigate to book order page', async ({ page }) => {
    // Navigate to book details first
    await page.click('[data-testid="book-card"] [data-testid="view-details-link"]');
    await page.waitForURL('**/books/*');
    
    // Wait for book details to load
    await page.waitForSelector('[data-testid="name"]');
    
    // Click "Order this book" button
    await page.click('[data-testid="order-book-button"]');
    
    // Wait for navigation
    await page.waitForURL('**/books/*/order');
    
    // Wait for the form to be visible
    await page.waitForSelector('[data-testid="customer-name-input"]');
    
    // Verify customer name input and order button are present
    await expect(page.locator('[data-testid="customer-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-order-button"]')).toBeVisible();
  });

  test('should show success popup when ordering a book', async ({ page }) => {
    // Navigate to order page
    await page.click('[data-testid="book-card"] [data-testid="view-details-link"]');
    await page.waitForURL('**/books/*');
    
    // Wait for book details to load
    await page.waitForSelector('[data-testid="name"]');
    
    await page.click('[data-testid="order-book-button"]');
    await page.waitForURL('**/books/*/order');
    
    // Wait for the form to be visible
    await page.waitForSelector('[data-testid="customer-name-input"]');
    
    // Set up dialog handler before filling the form
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Order successful');
      await dialog.accept();
    });
    
    // Fill in customer name and submit
    await page.fill('[data-testid="customer-name-input"]', 'John Doe');
    await page.click('[data-testid="submit-order-button"]');
    
    // Wait for navigation back to home page
    await page.waitForURL('**/');
  });

  test('should display orders page with 3 orders', async ({ page }) => {
    // Click "View Orders" button
    await page.click('[data-testid="view-orders-link"]');
    
    // Wait for navigation
    await page.waitForURL('**/orders');
    
    // Wait for orders to load
    await page.waitForSelector('[data-testid="order-card"]');
    
    // Verify 3 orders are displayed
    const orders = await page.$$('[data-testid="order-card"]');
    expect(orders.length).toBe(3);
  });

  test('should navigate to order details page', async ({ page }) => {
    // Navigate to orders page
    await page.click('[data-testid="view-orders-link"]');
    await page.waitForURL('**/orders');
    
    // Wait for orders to load
    await page.waitForSelector('[data-testid="order-card"]');
    
    // Click "View Details" on the first order
    await page.click('[data-testid="order-card"] [data-testid="view-details-link"]');
    
    // Wait for navigation
    await page.waitForURL('**/orders/*');
    
    // Wait for order details to load
    await page.waitForSelector('[data-testid="order-id"]');
    
    // Verify all required fields are present
    const fields = ['order-id', 'customer-name', 'book-name', 'quantity', 'order-date'];
    for (const field of fields) {
      const element = await page.$(`[data-testid="${field}"]`);
      expect(element).toBeTruthy();
      const text = await element?.textContent();
      expect(text?.trim()).toBeTruthy();
    }
    
    // Verify Delete Order button is present
    await expect(page.locator('[data-testid="delete-order-button"]')).toBeVisible();
  });

  test('should show confirmation and error popups when deleting order', async ({ page }) => {
    // Navigate to order details
    await page.click('[data-testid="view-orders-link"]');
    await page.waitForURL('**/orders');
    
    // Wait for orders to load
    await page.waitForSelector('[data-testid="order-card"]');
    
    await page.click('[data-testid="order-card"] [data-testid="view-details-link"]');
    await page.waitForURL('**/orders/*');
    
    // Wait for order details to load
    await page.waitForSelector('[data-testid="order-id"]');
    
    // Set up dialog handlers before clicking delete
    let dialogCount = 0;
    page.on('dialog', async dialog => {
      if (dialogCount === 0) {
        // First dialog is confirmation
        expect(dialog.message()).toBe('Are you sure you want to delete this order?');
        await dialog.accept();
      } else {
        // Second dialog is error
        expect(dialog.message()).toBe('Failed to delete order. Please try again.');
        await dialog.accept();
      }
      dialogCount++;
    });
    
    // Click Delete Order button
    await page.click('[data-testid="delete-order-button"]');
    
    // Wait for both dialogs to be handled
    await page.waitForTimeout(1000);
  });
}); 