import React, { useState, useEffect } from 'react'

const Pending = () => {
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
    useEffect(() => {
    setIsAdmin(window.location.pathname === "/admin")
  }, [])

  const formatDate = (date: any) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const timestamp = Date.now()
  const date = new Date(timestamp)

  const dummyTransaction = [
    {
      type: "deposit",
      coin: "BTC",
      amount: 12,
      receipt: "Transaction image",
      status: "pending",
      email: "princewilljeremiah83@gmail.com",
      date: formatDate(date)
    },
    {
      type: "withdrawal",
      coin: "USD",
      network: "BEP20",
      amount: 400,
      status: "pending",
      email: "princewilljeremiah83@gmail.com",
      date: formatDate(date)
    }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '↓'
      case 'withdrawal':
        return '↑'
      default:
        return '?'
    }
  }

  const toggleAccordion = (index: number) => {
    setExpandedTransaction(expandedTransaction === index ? null : index)
  }

  return (
    <div>
      <div>
        {dummyTransaction.length === 0 && <p className='text-center text-gray-400 my-6'>No Pending Transactions</p>}

        <div>
          {dummyTransaction.map((transaction, index) => {
            const { type, coin, amount, receipt, network, email, status, date } = transaction
            const isExpanded = expandedTransaction === index

            return (
              <div key={index} className='bg-[#2A2A2A] mt-3 rounded-lg overflow-hidden'>
                <div
                  className={`p-3 px-3 flex items-center gap-2 ${type === 'deposit' && receipt ? 'cursor-pointer' : ''}`}
                  onClick={() => type === 'deposit' && receipt && toggleAccordion(index)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[#ebb70c] text-lg font-bold`}>
                    {getTransactionIcon(type)}
                  </div>

                  <div className='flex-1'>
                    <h3 className={`uppercase font-medium text-[11px] ${type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>{type}</h3>
                    <p className='text-[12.55px] text-gray-400 font-medium'>{email.substring(0, 19) + "..."}</p>
                    <small className='text-gray-500 text-[10px]'>{date}</small>
                  </div>

                  <div className='text-right'>
                    <p className={`${type == 'deposit' ? 'text-green-400' : 'text-red-400'}`}>{amount}{coin}</p>
                    {network && <p className='text-gray-500 text-[10px]'>{network}</p>}
                    <p className='text-[#ebb70c] text-xs bg-[#ebb70c27] text-center px-2 py-[1px] rounded'>{status}</p>
                  </div>

                  {/* Dropdown arrow for deposits with receipts only */}
                  {type === 'deposit' && receipt && (
                    <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                      }`}>
                      <svg width="16" height="16" viewBox="0 0 10 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Accordion Content - Receipt Image for Deposits */}
                {type === 'deposit' && receipt && (
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-3 pb-3 border-t border-gray-600">
                      <div className="mt-3 bg-[#1f1f1f] rounded-lg p-3">
                        <h4 className="text-white text-[11px] font-medium mb-2 uppercase">Receipt Image</h4>
                        <div className="bg-[#2A2A2A] rounded-lg p-4 border border-dashed border-gray-600">
                          <div className="text-center">
                            <div className="text-2xl mb-1 text-[#ebb70c]">🧾</div>
                            <p className="text-gray-400 text-[10px]">Receipt Preview</p>
                            <p className="text-gray-500 text-[9px] mt-1">Tap to view full image</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Receipt indicator for non-expandable transactions */}
                {receipt && type === 'deposit' && (
                  <div className="px-3 pb-3 mt-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-2">
                      <span>📎</span>
                      <span>Receipt attached</span>
                    </div>
                  </div>
                )}

                {/* Admin buttons - only show when isAdmin prop is true */}
                {isAdmin && (
                  <div className="px-3 py-2 border-t border-gray-600">
                    <button className="bg-green-600/10 px-3 py-1 rounded text-green-500 text-xs hover:bg-green-700/20 transition-colors">
                      Approve
                    </button>
                    <button className="bg-red-600/10 px-3 py-1 rounded text-red-500 text-xs ml-2 hover:bg-red-700/20 transition-colors">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Pending