import TransactionHistory from '@/components/history/TransactionHistory'
import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'

const page = () => {
  return (
    <div>
      <div className="p-4 py-6 border-b md:max-w-[70%] mx-auto" style={{ borderColor: '#3a3a3a' }}>
        <div className="flex items-center space-x-3">
          <div className="w-14 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ebb70c' }}>
            <Icon icon="cryptocurrency:btc" className="w-6 h-6" style={{ color: '#1a1a1a' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Crypto Wallet History</h1>
            <p className="text-gray-400 mt-1">Track your crypto transactions and portfolio activity</p>
          </div>
        </div>
      </div>
      <TransactionHistory/>
    </div>
  )
}

export default page