'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('CoinlyEx');
  const [supportEmail, setSupportEmail] = useState('support@coinlyex.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [minDeposit, setMinDeposit] = useState(10);
  const [maxWithdrawal, setMaxWithdrawal] = useState(1000);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert('Settings saved successfully!');
        }}
        className="space-y-6"
      >
        {/* Platform Settings */}
        <div className="bg-[#2A2A2A] p-4 rounded space-y-4">
          <h2 className="text-lg font-semibold">Platform Settings</h2>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Site Name"
            className="w-full p-2 rounded bg-[#1F1F1F] text-white outline-none"
          />
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            placeholder="Support Email"
            className="w-full p-2 rounded bg-[#1F1F1F] text-white outline-none"
          />
        </div>

        {/* Transaction Settings */}
        <div className="bg-[#2A2A2A] p-4 rounded space-y-4">
          <h2 className="text-lg font-semibold">Transaction Settings</h2>
          <div>
            <label className="block mb-1 text-sm">Minimum Deposit ($)</label>
            <input
              type="number"
              value={minDeposit}
              onChange={(e) => setMinDeposit(Number(e.target.value))}
              className="w-full p-2 rounded bg-[#1F1F1F] text-white outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Maximum Withdrawal ($)</label>
            <input
              type="number"
              value={maxWithdrawal}
              onChange={(e) => setMaxWithdrawal(Number(e.target.value))}
              className="w-full p-2 rounded bg-[#1F1F1F] text-white outline-none"
            />
          </div>
        </div>

        {/* Maintenance Toggle */}
        <div className="bg-[#2A2A2A] p-4 rounded flex items-center justify-between">
          <span className="font-semibold">Maintenance Mode</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-[#ebb70c] transition-all"></div>
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-[#ebb70c] hover:bg-[#ebb70cb1] transition text-black font-semibold p-2 rounded cursor-pointer"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
