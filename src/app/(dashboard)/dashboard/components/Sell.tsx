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
      setTimeout(() => setMessage(''), 5000);
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
    setTimeout(() => setMessage(''), 5000);
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
      <label className="block mb-3 text-sm font-medium text-white">{label}</label>
      <button
        type="button"
        onClick={toggle}
        className="w-full p-4 flex justify-between items-center bg-[#2A2A2A] rounded-xl text-white 
                   hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1E1E1E]
                   transition-all duration-200 ease-in-out text-left"
      >
        <span className={`${selected ? 'text-white' : 'text-gray-400'}`}>
          {selected || `-- Choose ${label} --`}
        </span>
        <Icon 
          icon="ion:chevron-down-sharp" 
          className={`text-xl transition-transform duration-300 ease-in-out ${
            show ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {/* Dropdown Menu */}
      <div
        className={`absolute z-20 mt-2 w-full bg-[#2A2A2A] rounded-xl overflow-hidden
                    transition-all duration-300 ease-in-out transform
                    ${show 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                    }`}
      >
        {options.map((option, index) => (
          <div
            key={option}
            onClick={() => {
              onSelect(option);
              toggle();
            }}
            className={`p-4 hover:bg-[#3A3A3A] cursor-pointer transition-colors duration-200
                        ${index !== options.length - 1 ? 'border-b border-[#3A3A3A]' : ''}
                        ${selected === option ? 'bg-[#3A3A3A] text-white' : ''}`}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Sell Crypto
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-[#1E1E1E] p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 sm:space-y-8"
        >
          {/* Message Display */}
          <div
            className={`transition-all duration-500 ease-in-out transform ${
              message 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 -translate-y-4 scale-95 h-0'
            }`}
          >
            {message && (
              <div className={`p-4 rounded-xl text-center font-medium ${
                message.includes('submitted') 
                  ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                <Icon 
                  icon={message.includes('submitted') ? 'mdi:check-circle' : 'mdi:alert-circle'} 
                  className="inline mr-2 text-lg"
                />
                {message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-6">
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
                <label className="block mb-3 text-sm font-medium text-white">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-4 bg-[#2A2A2A] rounded-xl text-white text-lg
                             outline-none hover:bg-[#333333] focus:bg-[#333333]
                             transition-all duration-200 ease-in-out
                             placeholder:text-gray-400"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Icon icon="mdi:currency-usd" className="text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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
              <div
                className={`transition-all duration-500 ease-in-out ${
                  method 
                    ? 'opacity-100 translate-y-0 max-h-96' 
                    : 'opacity-0 translate-y-4 max-h-0 overflow-hidden'
                }`}
              >
                {method && (
                  <div>
                    <label className="block mb-3 text-sm font-medium text-white">
                      {methodLabels[method]}
                    </label>
                    <input
                      type="text"
                      placeholder={methodLabels[method]}
                      className="w-full p-4 bg-[#2A2A2A] rounded-xl text-white text-lg
                               outline-none hover:bg-[#333333] focus:bg-[#333333]
                               transition-all duration-200 ease-in-out
                               placeholder:text-gray-400"
                      value={accountDetail}
                      onChange={(e) => setAccountDetail(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#ebb70c] text-black font-bold py-4 px-6 rounded-xl text-lg
                         hover:bg-[#d4a50b] active:bg-[#c29709] 
                         transform hover:scale-105 active:scale-95
                         transition-all duration-200 ease-in-out
                         shadow-lg hover:shadow-xl"
            >
              <Icon icon="mdi:cash-multiple" className="inline mr-2 text-xl" />
              Submit Sell Request
            </button>
          </div>
        </form>

        {/* Bottom Spacing */}
        <div className="h-8 sm:h-12"></div>
      </div>

      {/* Overlay for dropdowns */}
      {(showMethodDropdown || showCoinDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowMethodDropdown(false);
            setShowCoinDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default SellPage;