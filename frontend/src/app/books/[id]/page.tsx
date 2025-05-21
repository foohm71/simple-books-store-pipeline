'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { Book } from '@/types/api';

export default function BookDetails({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await api.getBook(parseInt(params.id));
        setBook(data);
      } catch (error) {
        console.error('Failed to fetch book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  const handleOrderClick = () => {
    router.push(`/books/${params.id}/order`);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Book Details</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Bookstore
            </Link>
          </div>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Book Details</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Bookstore
            </Link>
          </div>
          <div className="text-center">Book not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Book Details</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Back to Bookstore
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Name</h2>
              <p className="text-gray-600 dark:text-gray-300">{book.name}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Author</h2>
              <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">ISBN</h2>
              <p className="text-gray-600 dark:text-gray-300">{book.isbn}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Price</h2>
              <p className="text-gray-600 dark:text-gray-300">${book.price}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Current Stock</h2>
              <p className="text-gray-600 dark:text-gray-300">{book['current-stock']}</p>
            </div>
          </div>

          <button
            onClick={handleOrderClick}
            className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Order this book
          </button>
        </div>
      </div>
    </div>
  );
} 