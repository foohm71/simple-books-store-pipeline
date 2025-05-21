'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { OrderWithBookDetails } from '@/types/api';

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderWithBookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await api.getOrder(params.id);
        const book = await api.getBook(orderData.bookId);
        setOrder({
          ...orderData,
          bookName: book.name,
        });
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setDeleting(true);
    try {
      await api.deleteOrder(params.id);
      router.push('/orders');
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Order Details</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Bookstore
            </Link>
          </div>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Order Details</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Bookstore
            </Link>
          </div>
          <div className="text-center">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Order Details</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Back to Bookstore
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order ID</h2>
              <p className="text-gray-600 dark:text-gray-300">{order.id}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Customer Name</h2>
              <p className="text-gray-600 dark:text-gray-300">{order.customerName}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Book Name</h2>
              <p className="text-gray-600 dark:text-gray-300">{order.bookName}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quantity</h2>
              <p className="text-gray-600 dark:text-gray-300">{order.quantity}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Date</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {new Date(order.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-8 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-400"
          >
            {deleting ? 'Deleting...' : 'Delete Order'}
          </button>
        </div>
      </div>
    </div>
  );
} 