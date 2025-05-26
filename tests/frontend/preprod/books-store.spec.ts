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
    
    // Set up dialog handler for success message
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

  test('should display orders page with non-zero list of orders', async ({ page }) => {
    // Click "View Orders" button
    await page.click('[data-testid="view-orders-link"]');
    
    // Wait for navigation
    await page.waitForURL('**/orders');
    
    // Wait for loading state to complete
    await page.waitForSelector('text=Loading orders...', { state: 'hidden' });
    
    // Wait for orders to load
    await page.waitForSelector('[data-testid="order-card"]');
    
    // Verify orders are displayed
    const orders = await page.$$('[data-testid="order-card"]');
    expect(orders.length).toBeGreaterThan(0);
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

  test('Create an order and delete it', async ({ page }) => {
    // Generate unique customer name with timestamp
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(2, 14);
    const customerName = `customer-${timestamp}`;

    // Step 1: Click on "View Details" of the book "Untamed"
    await page.click('[data-testid="book-card"]:has-text("Untamed") [data-testid="view-details-link"]');
    
    // Wait for navigation to book details
    await page.waitForURL('**/books/*');
    
    // Step 2: Click on "Order this book"
    await page.click('[data-testid="order-book-button"]');
    
    // Wait for navigation to order page
    await page.waitForURL('**/books/*/order');
    
    // Step 3: Fill in customer name and submit order
    await page.fill('[data-testid="customer-name-input"]', customerName);
    
    // Set up dialog handler for order success
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Order successful');
      await dialog.accept();
    });
    
    await page.click('[data-testid="submit-order-button"]');
    
    // Wait for navigation back to home page
    await page.waitForURL('**/');
    
    // Step 4: Click "View Orders" link
    await page.click('[data-testid="view-orders-link"]');
    await page.waitForURL('**/orders');
    
    // Wait for orders to load
    await page.waitForSelector('[data-testid="order-card"]');
    
    // Find the order with customer name
    const orderCard = await page.locator('[data-testid="order-card"]', { hasText: customerName });
    expect(orderCard).toBeTruthy();
    
    // Step 5: Click "View Details" of that order
    await orderCard.locator('[data-testid="view-details-link"]').click();
    await page.waitForURL('**/orders/*');
    
    // Verify order details
    await expect(page.locator('[data-testid="customer-name"]')).toContainText(customerName);
    
    // Step 6: Click "Delete Order" and confirm
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Are you sure you want to delete this order?');
      await dialog.accept();
    });
    
    await page.click('[data-testid="delete-order-button"]');
    
    // Wait for navigation back to orders page
    await page.waitForURL('**/orders');
    
    // Step 7: Verify order is no longer present
    await page.waitForSelector('[data-testid="order-card"]');
    const orderExists = await page.locator('[data-testid="order-card"]', { hasText: customerName }).count() > 0;
    expect(orderExists).toBe(false);
  });
}); 