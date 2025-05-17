"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "🪙 How do I deposit crypto into my wallet?",
    answer:
      "Tap the Receive button on your dashboard. You'll be shown a wallet address or QR code that you can use to transfer funds from another wallet or exchange.",
  },
  {
    question: "🏦 How can I withdraw funds from my wallet?",
    answer:
      "Select the Send option, enter the recipient's wallet address, specify the amount, and confirm the transaction. Make sure the address is correct, as crypto transactions are irreversible.",
  },
  {
    question: "🔁 How do I swap one cryptocurrency for another?",
    answer:
      "Click on the Swap button. Choose the coin you want to swap from and the coin you want to receive. Enter the amount, then review and confirm the transaction.",
  },
  {
    question: "🤖 How can I buy the AI Trading Bot?",
    answer:
      "Scroll to the AI Bot section on your dashboard and click the Power Cycle icon. You'll be redirected to a secure page where you can purchase or activate the AI Trading Bot using your crypto balance.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="min-h-screen text-white px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-[#ebb70c] rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 bg-[#2A2A2A] focus:outline-none flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium">{faq.question}</span>
              <span className="text-lg">{activeIndex === index ? "−" : "+"}</span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out px-4 ${
                activeIndex === index ? "max-h-60 py-2 opacity-100" : "max-h-0 py-0 opacity-0"
              } overflow-hidden text-gray-300 text-sm`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
