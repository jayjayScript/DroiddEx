"use client"
import React, { useState } from 'react'
import StatusTab from './StatusTab'
import UserPendingTransactions from './tabs/UserPendingTransactions'
import UserCompletedTransactions from './tabs/UserCompletedTransactions'


const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("pending")
  return (
    <div>
      <div className='p-4 md:max-w-[70%] mx-auto'>
        <StatusTab activeTab={activeTab} setActiveTab={setActiveTab}/>

        {activeTab === "pending" && <UserPendingTransactions />}
        {activeTab === "completed" && <UserCompletedTransactions />}
      </div>
    </div>
  )
}

export default TransactionHistory