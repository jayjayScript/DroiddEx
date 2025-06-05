"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface UserInfo {
  fullName: string;
  email: string;
  seedPhrase: string;
  country: string;
  phoneNumber: string;
  address: string;
}

type VerificationStatus = 'unverified' | 'pending_first' | 'first_approved' | 'pending_second' | 'fully_verified';

const Settings = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "",
    email: "john.doe@example.com", // Pre-filled from wallet creation
    seedPhrase: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about", // Pre-filled from wallet creation
    country: "",
    phoneNumber: "",
    address: ""
  });

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [editingField, setEditingField] = useState<keyof UserInfo | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [showFullSeed, setShowFullSeed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleEdit = (field: keyof UserInfo) => {
    setEditingField(field);
    setTempValue(userInfo[field]);
  };

  const handleSave = () => {
    if (editingField) {
      setUserInfo(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
    }
    setEditingField(null);
    setTempValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFirstVerification = () => {
    // Check if required fields are filled
    const requiredFields = ['fullName', 'country', 'phoneNumber', 'address'] as const;
    const missingFields = requiredFields.filter(field => !userInfo[field].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setVerificationStatus('pending_first');
    alert('First verification submitted! Awaiting admin approval.');
  };

  const handleSecondVerification = () => {
    if (!selectedFile) {
      alert('Please select a document (Passport or Driver\'s License)');
      return;
    }
    
    setVerificationStatus('pending_second');
    alert('Second verification submitted! Awaiting admin approval.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const fieldLabels = {
    fullName: "Full Name",
    email: "Email Address",
    seedPhrase: "Seed Phrase",
    country: "Country",
    phoneNumber: "Phone Number",
    address: "Address"
  };

  const fieldIcons = {
    fullName: "mdi:account",
    email: "mdi:email",
    seedPhrase: "mdi:key-variant",
    country: "mdi:earth",
    phoneNumber: "mdi:phone",
    address: "mdi:map-marker"
  };

  const getVerificationStatusInfo = () => {
    switch (verificationStatus) {
      case 'unverified':
        return { 
          text: 'Not Verified', 
          color: 'text-red-400', 
          bgColor: 'bg-red-400/10', 
          icon: 'mdi:close-circle' 
        };
      case 'pending_first':
        return { 
          text: 'First Verification Pending', 
          color: 'text-yellow-400', 
          bgColor: 'bg-yellow-400/10', 
          icon: 'mdi:clock' 
        };
      case 'first_approved':
        return { 
          text: 'First Verification Approved', 
          color: 'text-blue-400', 
          bgColor: 'bg-blue-400/10', 
          icon: 'mdi:check-circle' 
        };
      case 'pending_second':
        return { 
          text: 'Final Verification Pending', 
          color: 'text-yellow-400', 
          bgColor: 'bg-yellow-400/10', 
          icon: 'mdi:clock' 
        };
      case 'fully_verified':
        return { 
          text: 'Fully Verified', 
          color: 'text-green-400', 
          bgColor: 'bg-green-400/10', 
          icon: 'mdi:check-circle-outline' 
        };
    }
  };

  const renderField = (field: keyof UserInfo) => {
    const isEditing = editingField === field;
    const isSeedPhrase = field === 'seedPhrase';
    const isEmail = field === 'email';
    const isPreFilled = isEmail || isSeedPhrase;
    const displayValue = isSeedPhrase && !showFullSeed 
      ? userInfo[field].substring(0, 20) + "..." 
      : userInfo[field];

    return (
      <div 
        key={field}
        className="bg-[#1A1A1A] p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:bg-[#222222] group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon 
              icon={fieldIcons[field]} 
              width="20" 
              height="20" 
              className="text-[#ebb70c]" 
            />
            <h3 className="text-sm font-medium text-gray-400">
              {fieldLabels[field]}
              {isPreFilled && <span className="ml-1 text-xs text-[#ebb70c]">(Auto-filled)</span>}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {isSeedPhrase && (
              <>
                <Icon
                  icon="solar:copy-bold-duotone"
                  width="18"
                  height="18"
                  className="text-gray-400 hover:text-[#ebb70c] cursor-pointer transition-colors duration-200"
                  onClick={() => handleCopy(userInfo[field], field)}
                />
                <Icon
                  icon={showFullSeed ? "mdi:eye-off" : "mdi:eye"}
                  width="18"
                  height="18"
                  className="text-gray-400 hover:text-[#ebb70c] cursor-pointer transition-colors duration-200"
                  onClick={() => setShowFullSeed(!showFullSeed)}
                />
              </>
            )}
            {!isEditing && (
              <Icon
                icon="mdi:pencil"
                width="18"
                height="18"
                className="text-gray-400 hover:text-[#ebb70c] cursor-pointer transition-all duration-200"
                onClick={() => handleEdit(field)}
              />
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {isSeedPhrase ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#ebb70c] resize-none transition-all duration-200"
                rows={3}
                placeholder={`Enter your ${fieldLabels[field].toLowerCase()}`}
              />
            ) : (
              <input
                type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#ebb70c] transition-all duration-200"
                placeholder={`Enter your ${fieldLabels[field].toLowerCase()}`}
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-[#ebb70c] hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 flex items-center gap-2"
              >
                <Icon icon="mdi:check" width="16" height="16" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 flex items-center gap-2"
              >
                <Icon icon="mdi:close" width="16" height="16" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <p className={`${displayValue ? 'text-white' : 'text-gray-500'} ${isSeedPhrase ? 'font-mono text-sm' : 'text-base'} break-words`}>
              {displayValue || `Enter your ${fieldLabels[field].toLowerCase()}`}
            </p>
            {copied === field && (
              <div className="absolute -top-8 right-0 bg-[#ebb70c] text-black px-2 py-1 rounded text-xs font-medium animate-pulse">
                Copied!
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderVerificationSection = () => {
    const statusInfo = getVerificationStatusInfo();

    return (
      <div className="mt-8 space-y-4">
        {/* Verification Status */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl shadow-md">
          <div className="flex flex-1 items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:shield-check" width="24" height="24" className="text-[#ebb70c]" />
              <h3 className="text-xl font-semibold">Verification Status</h3>
            </div>
            <div className={`flex  items-center gap-2 px-2 py-1 rounded-full ${statusInfo.bgColor}`}>
              <Icon icon={statusInfo.icon} width="14" height="14" className={statusInfo.color} />
              <span className={`text-[8px] font-medium ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
          </div>

          {/* First Verification */}
          {verificationStatus === 'unverified' && (
            <div className="space-y-4">
              <div className="border-l-4 border-[#ebb70c] pl-4">
                <h4 className="font-semibold text-white mb-2">Step 1: Basic Information</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Complete your profile information to begin the verification process.
                </p>
                <div className="text-xs text-gray-500">
                  Required: Full Name, Country, Phone Number, Address
                </div>
              </div>
              <button
                onClick={handleFirstVerification}
                className="w-full sm:w-auto bg-[#ebb70c] hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:send" width="18" height="18" />
                Submit First Verification
              </button>
            </div>
          )}

          {/* Second Verification */}
          {verificationStatus === 'first_approved' && (
            <div className="space-y-4">
              <div className="border-l-4 border-[#ebb70c] pl-4">
                <h4 className="font-semibold text-white mb-2">Step 2: Document Verification</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Upload a clear photo of your Passport or Driver's License to complete verification.
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="mdi:file-document" width="18" height="18" className="text-[#ebb70c]" />
                    <span className="text-sm font-medium text-gray-300">Upload Document</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#ebb70c] transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ebb70c] file:text-black file:cursor-pointer"
                  />
                </label>
                
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Icon icon="mdi:check-circle" width="16" height="16" className="text-green-400" />
                    Selected: {selectedFile.name}
                  </div>
                )}
                
                <button
                  onClick={handleSecondVerification}
                  className="w-full sm:w-auto bg-[#ebb70c] hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:upload" width="18" height="18" />
                  Submit Document Verification
                </button>
              </div>
            </div>
          )}

          {/* Pending States */}
          {(verificationStatus === 'pending_first' || verificationStatus === 'pending_second') && (
            <div className="text-center py-6">
              <Icon icon="mdi:clock-outline" width="48" height="48" className="text-yellow-400 mx-auto mb-3" />
              <p className="text-gray-400">
                Your verification is being reviewed by our admin team. This usually takes 1-2 business days.
              </p>
            </div>
          )}

          {/* Fully Verified */}
          {verificationStatus === 'fully_verified' && (
            <div className="text-center py-6">
              <Icon icon="mdi:check-decagram" width="48" height="48" className="text-green-400 mx-auto mb-3" />
              <p className="text-green-400 font-semibold mb-2">Congratulations!</p>
              <p className="text-gray-400">
                Your account is fully verified. You now have access to all platform features.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white px-4 py-8 md:max-w-[70%] mx-auto mb-[5rem]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">User Settings</h1>
        <p className="text-gray-400">Manage your account information and verification</p>
      </div>

      <div className="space-y-4">
        {(Object.keys(userInfo) as Array<keyof UserInfo>).map(field => renderField(field))}
      </div>

      {renderVerificationSection()}

      <div className="mt-8 bg-[#1A1A1A] p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="mdi:information" width="20" height="20" className="text-[#ebb70c]" />
          <h3 className="text-lg font-semibold">Security Tips</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• Keep your seed phrase secure and never share it with anyone</p>
          <p>• Complete verification to unlock all platform features</p>
          <p>• Use a strong, unique password for your account</p>
          <p>• Regularly review your account activity</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;