export interface Book {
  id: number;
  name: string;
  author: string;
  isbn: string;
  price: number;
  'current-stock': number;
  type: 'fiction' | 'non-fiction';
}

export interface Order {
  id: string;
  bookId: number;
  customerName: string;
  createdBy: string;
  quantity: number;
  timestamp: string;
}

export interface OrderWithBookDetails extends Order {
  bookName: string;
} 