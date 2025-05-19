'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  user: string;
  type: 'Deposit' | 'Withdrawal';
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const dummyTransactions: Transaction[] = [
  { id: 'tx001', user: 'John Doe', type: 'Deposit', amount: 500, date: '2025-05-14', status: 'Approved' },
  { id: 'tx002', user: 'Jane Smith', type: 'Withdrawal', amount: 200, date: '2025-05-13', status: 'Pending' },
  { id: 'tx003', user: 'Chris Evans', type: 'Deposit', amount: 400, date: '2025-05-12', status: 'Rejected' },
  { id: 'tx004', user: 'Alice Johnson', type: 'Withdrawal', amount: 150, date: '2025-05-11', status: 'Approved' },
  { id: 'tx005', user: 'Bob Lee', type: 'Deposit', amount: 300, date: '2025-05-10', status: 'Approved' },
  { id: 'tx006', user: 'Tony Stark', type: 'Withdrawal', amount: 250, date: '2025-05-09', status: 'Pending' },
];

export default function TransactionsPage() {
  const [transactions] = useState(dummyTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (id: string, action: 'view' | 'edit') => {
    alert(`${action.toUpperCase()} transaction: ${id}`);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions available.</p>
      ) : (
        <div className="overflow-x-auto rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#2A2A2A] text-white uppercase text-xs">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-[#333]">
                  <td className="py-3 px-4">{tx.id}</td>
                  <td className="py-3 px-4">{tx.user}</td>
                  <td className="py-3 px-4">{tx.type}</td>
                  <td className="py-3 px-4">${tx.amount}</td>
                  <td className="py-3 px-4">{tx.date}</td>
                  <td className="py-3 px-4">{tx.status}</td>
                  <td className="py-3 px-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleAction(tx.id, 'view')}
                      className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleAction(tx.id, 'edit')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-xs px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-end items-center gap-2 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-[#2A2A2A] rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-[#2A2A2A] rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
