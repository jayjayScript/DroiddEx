'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const sellMethods = [
  'Bank Transfer',
  'PayPal',
  'Cash App',
  'Zelle',
  'P2P Cash',
];

const coins = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'];

const methodLabels: Record<string, string> = {
  'Bank Transfer': 'Enter your Bank Account Number',
  PayPal: 'Enter your PayPal Email',
  'Cash App': 'Enter your Cash App Tag',
  Zelle: 'Enter your Zelle Email or Phone',
  'P2P Cash': 'Enter Pickup Address',
};

const SellPage = () => {
  const [method, setMethod] = useState('');
  const [coin, setCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [accountDetail, setAccountDetail] = useState('');
  const [message, setMessage] = useState('');
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!method || !coin || !amount || !accountDetail) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const data = {
      method,
      coin,
      amount,
      accountDetail,
    };

    console.log('Sell request:', data);
    setMessage('Sell request submitted!');
  };

  const CustomDropdown = ({
    label,
    selected,
    options,
    onSelect,
    show,
    toggle,
  }: {
    label: string;
    selected: string;
    options: string[];
    onSelect: (value: string) => void;
    show: boolean;
    toggle: () => void;
  }) => (
    <div className="relative">
      <label className="block mb-1 text-sm text-gray-300">{label}</label>
      <button
        type="button"
        onClick={toggle}
        className="w-full p-3 flex justify-between items-center bg-[#2A2A2A] rounded text-white focus:outline-none"
      >
        {selected || `-- Choose ${label} --`}
        <Icon icon="ion:chevron-down-sharp" height="24" width="24"/>
      </button>
      {show && (
        <ul className="absolute z-10 mt-2 w-full bg-[#2A2A2A] border border-[#444] rounded shadow">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onSelect(option);
                toggle();
              }}
              className="p-3 hover:bg-[#3A3A3A] cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className=" text-white flex justify-center items-center px-2 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#1E1E1E] p-4 rounded-lg shadow-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sell Crypto</h2>

        {message && <p className="text-yellow-400 text-sm text-center">{message}</p>}

        {/* Sell Method Dropdown */}
        <CustomDropdown
          label="Sell Method"
          selected={method}
          options={sellMethods}
          onSelect={(value) => {
            setMethod(value);
            setAccountDetail('');
          }}
          show={showMethodDropdown}
          toggle={() => setShowMethodDropdown(!showMethodDropdown)}
        />

        {/* Amount */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-3 bg-[#2A2A2A] rounded text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Coin Dropdown */}
        <CustomDropdown
          label="Select Coin"
          selected={coin}
          options={coins}
          onSelect={setCoin}
          show={showCoinDropdown}
          toggle={() => setShowCoinDropdown(!showCoinDropdown)}
        />

        {/* Account Detail / Address Field */}
        {method && (
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              {methodLabels[method]}
            </label>
            <input
              type="text"
              placeholder={methodLabels[method]}
              className="w-full p-3 bg-[#2A2A2A] rounded text-white"
              value={accountDetail}
              onChange={(e) => setAccountDetail(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#ebb70c] text-black font-semibold py-3 rounded hover:scale-105 transition"
        >
          Submit Sell Request
        </button>
      </form>
    </div>
  );
};

export default SellPage;


        