import { Book, Order } from '@/types/api';

const API_BASE_URL = '/api/proxy'; // Changed to use our local proxy

export const api = {
  async getBooks(type?: 'fiction' | 'non-fiction'): Promise<Book[]> {
    try {
      const url = type ? `${API_BASE_URL}/books?type=${type}` : `${API_BASE_URL}/books`;
      console.log('Fetching books from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received books data:', data);
      
      // Transform the API response to match our interface
      return data.map((book: any) => ({
        id: book.id,
        name: book.name,
        author: 'Unknown', // API doesn't provide author
        isbn: 'N/A', // API doesn't provide ISBN
        price: 0, // API doesn't provide price
        'current-stock': book.available ? 1 : 0,
        type: book.type
      }));
    } catch (error) {
      console.error('Error in getBooks:', error);
      throw error;
    }
  },

  async getBook(id: number): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) throw new Error('Failed to fetch book');
    return response.json();
  },

  async createOrder(bookId: number, customerName: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookId, customerName }),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  async deleteOrder(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to delete order');
  },
}; 