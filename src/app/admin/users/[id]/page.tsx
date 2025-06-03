"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  amount: string;
  type: "Deposit" | "Withdrawal";
  date: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: "active" | "suspended" | "banned";
  recentTransactions: Transaction[];
}

// const dummyUserData: User = {
//   id: "u123",
//   name: "John Doe",
//   email: "john@example.com",
//   balance: 1200,
//   status: "active",
//   recentTransactions: [
//     { id: "tx01", amount: "$200", type: "Deposit", date: "2025-05-10" },
//     { id: "tx02", amount: "$100", type: "Withdrawal", date: "2025-05-12" },
//   ],
// };

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState<"Credit" | "Debit">("Credit");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`admin/users/${id}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, [id]);

  if (!user) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">User Detail: {user.name}</h1>

      <div className="bg-[#2A2A2A] p-4 rounded mb-6">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{user.status}</span>
        </p>
        <p>
          <strong>Balance:</strong> ${user.balance}
        </p>
      </div>

      {/* Balance Adjustment Form */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Adjust Balance</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const amount = parseFloat(adjustAmount);
            if (isNaN(amount)) return alert("Enter a valid amount");

            const newBalance =
              adjustType === "Credit"
                ? user.balance + amount
                : user.balance - amount;

            setUser({ ...user, balance: newBalance });
            setAdjustAmount("");
            setAdjustmentReason("");
            alert(
              `Balance ${adjustType.toLowerCase()}ed successfully.\nReason: ${adjustmentReason}`
            );
          }}
          className="space-y-4"
        >
          <input
            type="number"
            value={adjustAmount}
            onChange={(e) => setAdjustAmount(e.target.value)}
            placeholder="Enter amount"
            className="bg-[#1F1F1F] text-white p-2 rounded w-full outline-none"
            required
          />

          <select
            value={adjustType}
            onChange={(e) =>
              setAdjustType(e.target.value as "Credit" | "Debit")
            }
            className="bg-[#1F1F1F] text-white p-2 rounded w-full"
          >
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>

          <textarea
            value={adjustmentReason}
            onChange={(e) => setAdjustmentReason(e.target.value)}
            placeholder="Reason for adjustment (e.g. Bonus, Correction)"
            className="bg-[#1F1F1F] text-white p-2 rounded w-full outline-none resize-none h-20"
            required
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white w-full"
          >
            Apply Adjustment
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <ul className="space-y-2">
          {user.recentTransactions.map((tx) => (
            <li key={tx.id} className="bg-[#1F1F1F] p-3 rounded">
              <p>
                <strong>{tx.type}</strong> - {tx.amount}
              </p>
              <p className="text-sm text-white/60">Date: {tx.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
