import React, { useEffect, useState } from 'react';
import { listBorrowings, returnBorrowing } from '../api'; // Assuming api.js will have these functions

const BorrowingList = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const data = await listBorrowings();
      setBorrowings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch borrowings. Please try again later.');
      console.error('Error fetching borrowings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleReturn = async (borrowingId) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      try {
        await returnBorrowing(borrowingId);
        alert('Book returned successfully!');
        fetchBorrowings(); // Refresh the list
      } catch (err) {
        alert('Failed to return book. Please try again.');
        console.error('Error returning book:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading borrowings...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Borrowed Books</h2>
      {borrowings.length === 0 ? (
        <p>No books currently borrowed.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Book Title</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Member Name</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Status</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Borrow Date</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Return Date</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {borrowings.map((borrowing) => (
                <tr key={borrowing.borrow_record.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{borrowing.book.title}</td>
                  <td className="py-3 px-4">{borrowing.member.name}</td>
                  <td className="py-3 px-4">{borrowing.borrow_record.status}</td>
                  <td className="py-3 px-4">{borrowing.borrow_record.borrow_date}</td>
                  <td className="py-3 px-4">
                    {borrowing.borrow_record.return_date ? new Date(borrowing.borrow_record.return_date.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleReturn(borrowing.borrow_record.id)}
                      disabled={borrowing.borrow_record.status === 'RETURNED'}
                      className={`font-bold py-1 px-3 rounded text-white ${
                        borrowing.borrow_record.status === 'RETURNED' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                      }`}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowingList;
