"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { updateFullname, updateCountry, updatePhone, updateAddress } from "@/lib/profile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/user";
import toast from "react-hot-toast";
import { getAllUsers } from "@/lib/admin"; // Import the getAllUsers function

interface UserInfo {
  fullName: string;
  email: string;
  seedPhrase: string;
  country: string;
  phoneNumber: string;
  address: string;
}

type VerificationStatus = 'unverified' | 'pending' | 'verified';

const Settings = () => {
  // Use Redux state for email and phrase
  const { email, phrase } = useSelector((state: RootState) => state.user.value);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "",
    email: email || "",
    seedPhrase: phrase || "",
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

  // Fetch user status and details from backend
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const users = await getAllUsers();
        const currentUser = users.find(u => u.email === email);
        // Prefer verificationStatus, fallback to isVerified for legacy
        let status = currentUser?.verificationStatus;
        // Robust normalization for isVerified (can be boolean, string, or number)
        if (!status && currentUser?.isVerified !== undefined) {
          const isVerified = currentUser.isVerified;
          if (typeof isVerified === 'boolean') {
            status = isVerified ? 'verified' : 'unverified';
          } else if (typeof isVerified === 'string') {
            const normalized = isVerified.trim().toLowerCase();
            if (normalized === 'true' || normalized === 'verified') status = 'verified';
            else if (normalized === 'false' || normalized === 'unverified') status = 'unverified';
            else if (normalized === 'pending') status = 'pending';
          } else if (typeof isVerified === 'number') {
            status = isVerified === 1 ? 'verified' : 'unverified';
          }
        }
        const validStatuses = ['unverified', 'pending', 'verified'];
        if (status && validStatuses.includes(status)) {
          setVerificationStatus(status as VerificationStatus);
        } else {
          setVerificationStatus('unverified');
        }
        // Update user info from backend if available
        if (currentUser) {
          setUserInfo(prev => ({
            ...prev,
            fullName: currentUser.fullname || prev.fullName,
            country: currentUser.country || prev.country,
            phoneNumber: currentUser.phone || prev.phoneNumber,
            address: currentUser.address || prev.address,
            // email and seedPhrase remain from Redux
          }));
        }
      } catch (error) {
        toast.error('Failed to get users');
        setVerificationStatus('unverified');
        console.log(error);
      }
    };
    fetchUserStatus();
  }, [email]);

  // Refetch user status/details after verification actions
  const refetchUserStatus = async () => {
    try {
      const users = await getAllUsers();
      const currentUser = users.find(u => u.email === email);
      const status = currentUser?.verificationStatus || currentUser?.isVerified;
      const validStatuses = ['unverified', 'pending', 'verified'];
      if (status && validStatuses.includes(status)) {
        setVerificationStatus(status as VerificationStatus);
      } else {
        setVerificationStatus('unverified');
      }
      if (currentUser) {
        setUserInfo(prev => ({
          ...prev,
          fullName: currentUser.fullname || prev.fullName,
          country: currentUser.country || prev.country,
          phoneNumber: currentUser.phone || prev.phoneNumber,
          address: currentUser.address || prev.address,
        }));
      }
    } catch (error) {
      toast.error('Failed to refresh user');
      console.error(error)
      setVerificationStatus('unverified');
    }
  };

  const handleEdit = (field: keyof UserInfo) => {
    setEditingField(field);
    setTempValue(userInfo[field]);
  };

  const handleSave = async () => {
    if (editingField) {
      try {
        // Call the correct API based on the field
        if (editingField === "fullName") await updateFullname(tempValue);
        if (editingField === "country") await updateCountry(tempValue);
        if (editingField === "phoneNumber") await updatePhone(tempValue);
        if (editingField === "address") await updateAddress(tempValue);

        setUserInfo(prev => ({
          ...prev,
          [editingField]: tempValue
        }));
        // Optionally show a toast here for success
      } catch (error) {
        // Optionally show a toast here for error
        toast("Failed to update. Please try again.");
        console.error(error)
      }
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

  const handleFirstVerification = async () => {
    // Check if required fields are filled
    const requiredFields = ['fullName', 'country', 'phoneNumber', 'address'] as const;
    const missingFields = requiredFields.filter(field => !userInfo[field].trim());

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setVerificationStatus('pending');
    toast('Verification submitted! Awaiting admin approval.');
    await refetchUserStatus();
  };

  const handleSecondVerification = async () => {
    if (!selectedFile) {
      toast('Please select a document (Passport or Driver\'s License)');
      return;
    }
    setVerificationStatus('pending');
    toast('KYC verification submitted! Awaiting admin approval.');
    await refetchUserStatus();
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

  // const getVerificationStatusInfo = () => {
  //   switch (verificationStatus) {
  //     case 'unverified':
  //       return {
  //         text: 'Not Verified',
  //         color: 'text-red-400',
  //         bgColor: 'bg-red-400/10',
  //         icon: 'mdi:close-circle'
  //       };
  //     case 'pending':
  //       return {
  //         text: 'Verification Pending',
  //         color: 'text-yellow-400',
  //         bgColor: 'bg-yellow-400/10',
  //         icon: 'mdi:clock'
  //       };
  //     case 'verified':
  //       return {
  //         text: 'Verified',
  //         color: 'text-green-400',
  //         bgColor: 'bg-green-400/10',
  //         icon: 'mdi:check-circle-outline'
  //       };
  //   }
  // };

  const renderField = (field: keyof UserInfo) => {
    const isEditing = editingField === field;
    const isSeedPhrase = field === 'seedPhrase';
    // const isEmail = field === 'email';
    const displayValue = isSeedPhrase && !showFullSeed
      ? userInfo[field]?.substring(0, 20) + "..."
      : userInfo[field];

    return (
      <div
        key={field}
        className="bg-[#1A1A1A] p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:bg-[#222222] group md:max-w-[70%] mx-auto"
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
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {isSeedPhrase && userInfo[field] && (
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
            {/* All fields are editable */}
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
    // Show KYC step only after verified
    if (verificationStatus === 'verified') {
      return (
        <div className="mt-8 space-y-4">
          <div className="bg-[#1A1A1A] p-6 rounded-xl shadow-md">
            <div className="flex flex-1 items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:shield-account" width="24" height="24" className="text-[#ebb70c]" />
                <h3 className="text-xl font-semibold">KYC Verification</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-[#ebb70c] pl-4">
                <h4 className="font-semibold text-white mb-2">Step 2: Document Verification</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Upload a clear photo of your Passport or Driver&apos;s License to complete KYC verification.
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
                  Submit KYC Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // Status badge and first verification button
    const statusInfo = (() => {
      switch (verificationStatus as VerificationStatus) {
        case 'unverified':
        return {
          text: 'Not Verified',
          color: 'text-red-400',
          bgColor: 'bg-red-400/10',
          icon: 'mdi:close-circle'
        };
      case 'pending':
        return {
          text: 'Verification Pending',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/10',
          icon: 'mdi:clock'
        };
      case 'verified':
        return {
          text: 'Verified',
          color: 'text-green-400',
          bgColor: 'bg-green-400/10',
          icon: 'mdi:check-circle-outline'
        };
      }
    })();
    return (
      <div className="mt-8 space-y-4">
        <div className="bg-[#1A1A1A] p-6 rounded-xl shadow-md">
          <div className="flex flex-1 items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:shield-check" width="24" height="24" className="text-[#ebb70c]" />
              <h3 className="text-xl font-semibold">Verification Status</h3>
            </div>
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${statusInfo.bgColor}`}>
              <Icon icon={statusInfo.icon} width="14" height="14" className={statusInfo.color} />
              <span className={`text-[8px] font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
            </div>
          </div>
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
                Submit Verification
              </button>
            </div>
          )}
          {verificationStatus === 'pending' && (
            <div className="text-center py-6">
              <Icon icon="mdi:clock-outline" width="48" height="48" className="text-yellow-400 mx-auto mb-3" />
              <p className="text-gray-400">
                Your verification is being reviewed by our admin team. This usually takes 1-2 business days.
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