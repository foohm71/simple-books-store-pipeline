import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'https://simple-books-api.glitch.me';
const API_ACCESS_TOKEN = process.env.API_ACCESS_TOKEN;

if (!API_ACCESS_TOKEN) {
  throw new Error('API_ACCESS_TOKEN environment variable is not set');
}

test.describe('Books API', () => {
  test('should get list of books', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/books`);
    expect(response.ok()).toBeTruthy();
    
    const books = await response.json();
    expect(Array.isArray(books)).toBeTruthy();
    expect(books.length).toBeGreaterThan(0);
    
    // Verify the structure of the first book
    const firstBook = books[0];
    expect(firstBook).toHaveProperty('id');
    expect(firstBook).toHaveProperty('name');
    expect(firstBook).toHaveProperty('type');
    expect(firstBook).toHaveProperty('available');
  });

  test('should get a specific book', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/books/1`);
    expect(response.ok()).toBeTruthy();
    
    const book = await response.json();
    expect(book).toHaveProperty('id');
    expect(Number.isInteger(book.id)).toBeTruthy();
    expect(book.id).toBeGreaterThanOrEqual(0);
    expect(book).toHaveProperty('name');
    expect(book).toHaveProperty('type');
    expect(book).toHaveProperty('available');
    expect(book).toHaveProperty('current-stock');
    expect(book).toHaveProperty('price');
  });

  test('should return 404 for non-existent book ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/books/-1`);
    expect(response.status()).toBe(404);
  });

  test('should filter books by type', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/books?type=fiction`);
    expect(response.ok()).toBeTruthy();
    
    const books = await response.json();
    expect(Array.isArray(books)).toBeTruthy();
    
    // Verify all books are of type fiction
    books.forEach((book: { type: string }) => {
      expect(book.type).toBe('fiction');
    });
  });
});

test.describe('Orders API', () => {
  test('should get all orders', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${API_ACCESS_TOKEN}`
      }
    });
    expect(response.ok()).toBeTruthy();
    
    const orders = await response.json();
    expect(Array.isArray(orders)).toBeTruthy();
    
    if (orders.length > 0) {
      // Verify the structure of the first order
      const firstOrder = orders[0];
      expect(firstOrder).toHaveProperty('id');
      expect(firstOrder).toHaveProperty('bookId');
      expect(firstOrder).toHaveProperty('customerName');
      expect(firstOrder).toHaveProperty('createdBy');
      expect(firstOrder).toHaveProperty('quantity');
      expect(firstOrder).toHaveProperty('timestamp');
    }
  });

  test('should create a new order', async ({ request }) => {
    const newOrder = {
      bookId: 1,
      customerName: 'Test Customer'
    };

    const response = await request.post(`${BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: newOrder
    });
    expect(response.ok()).toBeTruthy();
    
    const result = await response.json();
    expect(result).toHaveProperty('created', true);
    expect(result).toHaveProperty('orderId');
  });

  test('should get a specific order', async ({ request }) => {
    // First create an order
    const newOrder = {
      bookId: 1,
      customerName: 'Test Customer'
    };

    const createResponse = await request.post(`${BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: newOrder
    });
    expect(createResponse.ok()).toBeTruthy();
    const { orderId } = await createResponse.json();

    // Then get the order
    const response = await request.get(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${API_ACCESS_TOKEN}`
      }
    });
    expect(response.ok()).toBeTruthy();
    
    const order = await response.json();
    expect(order).toHaveProperty('id', orderId);
    expect(order).toHaveProperty('bookId', 1);
    expect(order).toHaveProperty('customerName', 'Test Customer');
    expect(order).toHaveProperty('createdBy');
    expect(order).toHaveProperty('quantity');
    expect(order).toHaveProperty('timestamp');
  });
}); 