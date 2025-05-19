// src/app/dashboard/admin/page.tsx

'use client';

import React from 'react';
import { Icon } from '@iconify/react';

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

const recentActivity = [
  {
    user: 'johndoe',
    action: 'Requested a withdrawal',
    time: '2 hours ago',
  },
  {
    user: 'janesmith',
    action: 'Swapped BTC to ETH',
    time: '4 hours ago',
  },
  {
    user: 'btc_whale',
    action: 'Deposited 2 BTC',
    time: 'Today, 9:30 AM',
  },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 text-white">
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
      <div className="bg-[#2A2A2A] rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          {recentActivity.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b border-white/10 pb-2"
            >
              <div>
                <p className="font-medium">{item.user}</p>
                <p className="text-sm text-white/70">{item.action}</p>
              </div>
              <span className="text-xs text-white/50">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
