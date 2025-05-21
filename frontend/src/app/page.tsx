'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/services/api';
import { Book } from '@/types/api';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookType, setBookType] = useState<'fiction' | 'non-fiction' | undefined>(undefined);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await api.getBooks(bookType);
        setBooks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [bookType]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Simple Books Store</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover our collection of fiction and non-fiction books
          </p>
        </div>

        <div className="relative w-full h-64 mb-12 rounded-lg overflow-hidden">
          <Image
            src="/bookstore.png"
            alt="Bookstore"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div className="mb-8">
          <label htmlFor="bookType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Book Type
          </label>
          <select
            id="bookType"
            value={bookType || ''}
            onChange={(e) => setBookType(e.target.value as 'fiction' | 'non-fiction' | undefined)}
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Books</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center">Loading books...</div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{book.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Type: {book.type}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Stock: {book['current-stock']}
                    </span>
                    <Link
                      href={`/books/${book.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/orders"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600"
          >
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
