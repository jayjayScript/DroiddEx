"use client"
import React, { useState } from 'react'
import StatusTab from './StatusTab'
import Pending from './tabs/Pending'
import Completed from './tabs/Completed'

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("pending")
  return (
    <div>
      <div className='p-4 md:max-w-[70%] mx-auto'>
        <StatusTab activeTab={activeTab} setActiveTab={setActiveTab}/>

        {activeTab === "pending" && <Pending />}
        {activeTab === "completed" && <Completed />}
      </div>
    </div>
  )
}

export default TransactionHistory