"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { buyCoins } from "@/components/constants";
import Link from "next/link";
// Import your real wallet address data source
import { walletAddresses } from "@/lib/wallet";
import Image from "next/image"; // Adjust the path if needed

// Define proper types for your wallet data
type WalletAddress = {
  name?: string;
  address: string;
  network?: string;
};

type WalletData = WalletAddress | WalletAddress[];

type Coin = {
  symbol: string;
  name: string;
  addresses: WalletAddress[];
};

// Build coins array from walletAddresses with proper type handling
const coins: Coin[] = Object.keys(walletAddresses).map((symbol) => {
  const walletData = walletAddresses[symbol] as WalletData;
  
  let name: string;
  let addresses: WalletAddress[];

  if (Array.isArray(walletData)) {
    // If it's an array, get name from first item and use all addresses
    name = walletData[0]?.name || symbol;
    addresses = walletData;
  } else {
    // If it's a single object, use its name and wrap in array
    name = walletData?.name || symbol;
    addresses = [walletData];
  }

  return {
    symbol,
    name,
    addresses,
  };
});

const Buy = () => {
  const [selected, setSelected] = useState<Coin>(coins[0]);
  const [amount, setAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selected.addresses[0]?.address || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("File size must be less than 5MB");
        setTimeout(() => setMessage(""), 5000);
        return;
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setMessage("Only images (JPG, PNG, WebP) and PDF files are allowed");
        setTimeout(() => setMessage(""), 5000);
        return;
      }

      setProofFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProofPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setProofPreview(null);
      }
    }
  };

  const removeProofFile = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const submitBuyProof = async () => {
    if (!amount || !proofFile || !userEmail) {
      setMessage("Please fill in all required fields and upload proof");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    if (Number(amount) <= 0) {
      setMessage("Please enter a valid amount");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData to send file and other data
      const formData = new FormData();
      formData.append("coin", selected.symbol);
      formData.append("coinName", selected.name);
      formData.append("amount", amount);
      formData.append("walletAddress", selected.addresses[0]?.address || "");
      formData.append("userEmail", userEmail);
      formData.append("proofFile", proofFile);
      formData.append("timestamp", new Date().toISOString());

      // Here you would make an API call to submit the proof
      // Example:
      // const response = await fetch("/api/buy-proof", {
      //   method: "POST",
      //   body: formData,
      // });
      
      // For now, just simulate success
      console.log("Buy proof submitted:", {
        coin: selected.symbol,
        coinName: selected.name,
        amount,
        walletAddress: selected.addresses[0]?.address,
        userEmail,
        proofFileName: proofFile.name,
        timestamp: new Date().toISOString(),
      });

      setMessage("Buy proof submitted successfully! Admin will review and credit your account.");
      
      // Reset form
      setAmount("");
      setUserEmail("");
      setProofFile(null);
      setProofPreview(null);
      
      setTimeout(() => setMessage(""), 7000);
    } catch (error) {
      console.error("Error submitting buy proof:", error);
      setMessage("Failed to submit proof. Please try again.");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Buy Crypto
          </h1>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Message Display */}
          <div
            className={`transition-all duration-500 ease-in-out transform ${message
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-95 h-0'
              }`}
          >
            {message && (
              <div className={`p-4 rounded-xl text-center font-medium ${message.includes('successfully')
                ? 'bg-green-900/20 text-green-400 border border-green-500/30'
                : 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                <Icon
                  icon={message.includes('successfully') ? 'mdi:check-circle' : 'mdi:alert-circle'}
                  className="inline mr-2 text-lg"
                />
                {message}
              </div>
            )}
          </div>

          {/* Coin Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium mb-3 text-white">
              Select Coin
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full p-4 bg-[#2A2A2A] rounded-xl flex justify-between items-center 
                         hover:bg-[#333333] transition-all duration-200 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              >
                <span className="text-lg font-medium">{selected.symbol}</span>
                <Icon
                  icon="mdi:chevron-down"
                  className={`text-2xl transition-transform duration-300 ease-in-out ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 right-0 mt-2 bg-[#2A2A2A] rounded-xl 
                          overflow-hidden z-20
                          transition-all duration-300 ease-in-out transform
                          ${showDropdown 
                            ? "opacity-100 translate-y-0 scale-100" 
                            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                          }`}
              >
                {coins.map((coin, index) => (
                  <div
                    key={coin.symbol}
                    onClick={() => {
                      setSelected(coin);
                      setShowDropdown(false);
                    }}
                    className={`px-4 py-3 hover:bg-[#3A3A3A] cursor-pointer transition-colors duration-200
                              ${index !== coins.length - 1 ? "border-b border-[#3A3A3A]" : ""}
                              ${selected.symbol === coin.symbol ? "bg-[#3A3A3A] text-white" : ""}`}
                  >
                    <span className="font-medium">{coin.symbol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">
              Enter Amount (USD) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 100"
                className="w-full p-4 bg-[#2A2A2A] rounded-xl text-white text-lg
                         outline-none
                         hover:bg-[#333333] focus:bg-[#333333]
                         transition-all duration-200 ease-in-out
                         placeholder:text-gray-500"
                required
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Icon icon="mdi:currency-usd" className="text-xl" />
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">
              Your Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-4 bg-[#2A2A2A] rounded-xl text-white text-lg
                         outline-none
                         hover:bg-[#333333] focus:bg-[#333333]
                         transition-all duration-200 ease-in-out
                         placeholder:text-gray-500"
                required
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Icon icon="mdi:email" className="text-xl" />
              </div>
            </div>
          </div>

          {/* Wallet Display */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Wallet Address for {selected.symbol}
                </h3>
                <div className="bg-[#1A1A1A] rounded-lg p-3">
                  <code className="text-sm text-white break-all font-mono">
                    {selected.addresses[0]?.address || "No address available"}
                  </code>
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                          transition-all duration-300 ease-in-out transform
                          ${copied 
                            ? "bg-[#4A4A4A] hover:bg-[#5A5A5A] scale-105" 
                            : "bg-[#3A3A3A] hover:bg-[#4A4A4A] hover:scale-105"
                          }
                          active:scale-95`}
              >
                <Icon 
                  icon={copied ? "mdi:check" : "mdi:content-copy"} 
                  className="text-xl" 
                />
                <span className="whitespace-nowrap">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Buy Proof Upload */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Upload Purchase Proof *
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Upload a screenshot or document showing your purchase transaction. 
              Accepted formats: JPG, PNG, WebP, PDF (max 5MB)
            </p>

            {!proofFile ? (
              <div className="relative">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleProofUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#3A3A3A] rounded-lg cursor-pointer hover:border-[#ebb70c] transition-colors duration-200"
                >
                  <Icon icon="mdi:cloud-upload" className="text-3xl text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Click to upload proof</span>
                  <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP, PDF (max 5MB)</span>
                </label>
              </div>
            ) : (
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {proofPreview ? (
                      <Image
                        src={proofPreview} 
                        alt="Proof preview" 
                        className="w-12 h-12 object-cover rounded"
                        height = '48'
                        width = '48'
                      />
                    ) : (
                      <Icon icon="mdi:file-pdf" className="text-2xl text-red-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{proofFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeProofFile}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
                  >
                    <Icon icon="mdi:close" className="text-xl" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Proof Button */}
          <button
            onClick={submitBuyProof}
            disabled={isSubmitting || !amount || !proofFile || !userEmail}
            className="w-full bg-[#ebb70c] text-black font-bold py-4 px-6 rounded-xl text-lg
                     hover:bg-[#d4a50b] active:bg-[#c29709] 
                     transform hover:scale-105 active:scale-95
                     transition-all duration-200 ease-in-out
                     shadow-lg hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:file-check" className="text-xl" />
                <span>Submit Buy Proof</span>
              </>
            )}
          </button>

          {/* Purchase Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Buy from:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {buyCoins.map((site, index) => (
                <Link
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#2A2A2A] 
                           rounded-xl p-4
                           hover:bg-[#3A3A3A]
                           transition-all duration-300 ease-in-out transform
                           hover:scale-105 active:scale-95"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium group-hover:text-white transition-colors duration-200">
                      {site.name}
                    </span>
                    <Icon
                      icon="mdi:external-link"
                      className="text-xl text-gray-400 group-hover:text-white 
                               transition-all duration-200 transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Icon icon="mdi:information" className="text-[#ebb70c] text-xl flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="font-medium text-gray-300 mb-2">How to buy:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Select the coin you want to buy</li>
                  <li>Enter the amount in USD</li>
                  <li>Copy the wallet address and send your crypto to it</li>
                  <li>Upload proof of your transaction (screenshot/receipt)</li>
                  <li>Submit the form and wait for admin approval</li>
                  <li>Your balance will be credited once verified</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8 sm:h-12"></div>
      </div>

      {/* Overlay for dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Buy;