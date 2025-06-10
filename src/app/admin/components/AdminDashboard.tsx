// src/app/dashboard/admin/page.tsx

'use client';

import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import TransactionHistory from '@/components/TransactionHistory';
import Cookies from 'js-cookie';


const cards = [
  {
    title: 'Total Users',
    value: 1250,
    icon: 'mdi:account-group',
    color: 'bg-[#ebb60c]',
  },
  {
    title: 'Pending Transactions',
    value: 14,
    icon: 'mdi:clock-outline',
    color: 'bg-[#ebb60c]',
  },
  {
    title: 'Approved Transactions',
    value: 892,
    icon: 'mdi:check-circle-outline',
    color: 'bg-[#ebb60c]',
  },
  {
    title: 'Total Balance',
    value: '$1,350,400',
    icon: 'mdi:cash-multiple',
    color: 'bg-[#ebb60c]',
  },
];


const AdminDashboard = () => {
  useEffect(() => {
    const token = Cookies.get('adminToken')
    console.log(token);
  })
  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-semibold mb-6">Admin Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 flex items-center justify-between ${card.color} shadow-md`}
          >
            <div>
              <h2 className="text-sm text-[#1a1a1a]">{card.title}</h2>
              <p className="text-2xl text-[#1a1a1a] font-bold">{card.value}</p>
            </div>
            <Icon icon={card.icon} className="text-3xl text-[#1a1a1a]" />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1A1A1A] rounded-lg">
        <h2 className="text-lg font-semibold mb-2 p-4">Recent Activity</h2>
        <TransactionHistory
          isAdmin={true}
          pendingTransactions={[]}
          completedTransactions={[]}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
