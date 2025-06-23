import React, { useState } from 'react'
import StatusTab from './StatusTab'
import Pending from './tabs/Pending'
import Completed from './tabs/Completed'

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("pending")
  return (
    <div>
      <div>
        <StatusTab activeTab={activeTab} setActiveTab={setActiveTab}/>

        {activeTab === "pending" && <Pending />}
        {activeTab === "completed" && <Completed />}
      </div>
    </div>
  )
}

export default TransactionHistory