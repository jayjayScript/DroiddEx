"use client"
import React, {useState} from "react"
import AdminCompletedTransactions from "./tabs/AdminCompletedTransactions"
import AdminPendingTransactions from "./tabs/AdminPending"
import StatusTab from "./StatusTab"


const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("pending")
  return (
    <div>
      <div className='p-4 md:max-w-[70%] mx-auto'>
        <StatusTab activeTab={activeTab} setActiveTab={setActiveTab}/>

        {activeTab === "pending" && <AdminPendingTransactions />}
        {activeTab === "completed" && <AdminCompletedTransactions />}
      </div>
    </div>
  )
}

export default TransactionHistory