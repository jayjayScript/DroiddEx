import React from 'react'
import { history } from '@/lib/transaction'
import { Icon } from '@iconify/react/dist/iconify.js'

const Pending = () => {
  const dummyTransaction = [
    {
      type: "deposit",
      coin: "bitcoin",
      amount: 12,
      reciept: "Transaction image",
      status: "pending",
      email: "princewilljeremiah83@gmail.com"
    },
    {
      type: "withdrawal",
      coin: "usd",
      network: "BEP20",
      amount: 400,
      status: "pending",
      email: "princewilljeremiah83@gmail.com"
    }
  ]

  // Removed invalid getTransactionType object and switch statement
  // Helper function to get transaction type label
  const getTransactionIcon = (icon: string) => {
    switch (icon) {
      case 'deposit':
        return 'ph:hand-deposit-duotone';
      case 'withdrawal':
        return 'icon-park-twotone:folder-withdrawal';
      default:
        return 'Unknown';
    }
  };

  return (
    <div>
      <div>
        {dummyTransaction.length === 0 && <p className='text-center text-gray-400 my-6'>No Pending Transactions</p>}

        <div>
          {
            dummyTransaction.map(({ type, coin, amount, reciept, network, email, status }, index) => (
              <div key={index} className='bg-[#2A2A2A] p-3 px-3 mt-3 rounded-lg flex items-center gap-2'>
                <Icon icon={getTransactionIcon(type)} className='text-[#ebb70c]' height="34" width="34" />

                <div className=''>
                  <h3 className={`uppercase font-medium text-[11px] ${type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>{type}</h3>
                  <p className='text-[12.55px] text-gray-400 font-medium'>{email.substring(0, 19) + "..."}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Pending