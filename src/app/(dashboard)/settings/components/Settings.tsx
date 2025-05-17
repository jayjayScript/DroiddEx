"use client";

import React, { useState } from "react";
import { loginLogs } from "@/components/constants";

const Settings = () => {
  const [username, setUsername] = useState("jayjay_dev");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUsernameChange = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Username changed to: ${username}`);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password successfully changed!");
  };

  return (
    <div className="">
      <div className="min-h-screen text-white px-4 py-8 md:max-w-[70%] mx-auto mb-[5rem]">
        <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>

        {/* Username Section */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Change Username</h2>
          <form onSubmit={handleUsernameChange} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#2A2A2A] text-white focus:outline-none"
              placeholder="Enter new username"
            />
            <button
              type="submit"
              className="bg-[#ebb70c] hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Update Username
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#2A2A2A] text-white focus:outline-none"
              placeholder="Current password"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#2A2A2A] text-white focus:outline-none"
              placeholder="New password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#2A2A2A] text-white focus:outline-none"
              placeholder="Confirm new password"
            />
            <button
              type="submit"
              className="bg-[#ebb70c] hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Login Logs Section */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Login History</h2>
          <ul className="text-sm text-gray-300 space-y-2">
            {loginLogs.map((log, index) => (
              <li
                key={index}
                className={`border-b border-[#ebb70c7b] pb-2 ${
                  index === loginLogs.length - 1 ? "border-b-0" : ""
                }`}
              >
                ✅ {log.date} – {log.time} – {log.location}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
