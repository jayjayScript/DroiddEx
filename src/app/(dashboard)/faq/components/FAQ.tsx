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
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="min-h-screen text-white px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

      <div className="space-y-4 mb-8">
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

      {/* Terms and Conditions Section */}
      <div className="border-t border-gray-600 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Terms of Use</h2>
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="text-[#ebb70c] hover:text-yellow-400 transition-colors font-medium"
          >
            {showTerms ? "See Less" : "See More"}
          </button>
        </div>

        <div className="text-gray-300 mb-4">
          <p className="mb-3">
            By using Web4 services, you agree to these terms. We charge transaction fees that may vary by region based on local laws and service requirements.
          </p>
          <p className="mb-3">
            Choose between regular withdrawal (1-24 hours) or safe withdrawal (24-72 hours with enhanced security). Users must be 18+ and comply with local regulations.
          </p>
          {!showTerms && <p className="text-[#ebb70c] text-sm">Click &quot;See More&quot; to read full terms...</p>}
        </div>

        {showTerms && (
          <div className="bg-[#1A1A1A] rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-600">
            <div className="prose prose-invert max-w-none text-sm">
              <h3 className="text-lg font-bold mb-4 text-[#ebb70c]">WEB4 TERMS OF USE</h3>
              <p className="text-gray-400 mb-4"><strong>Last Updated:</strong> [Date]</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. ACCEPTANCE OF TERMS</h4>
                  <p className="text-gray-300">By using Web4 services, you agree to these terms. If you don&apos;t agree, please don&apos;t use our platform.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">2. ELIGIBILITY</h4>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>You must be 18+ years old</li>
                    <li>You must provide accurate registration information</li>
                    <li>One account per person</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">3. FEES AND CHARGES</h4>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>Transaction fees apply as listed in our fee schedule</li>
                    <li>Fees may vary by region and additional charges may be imposed depending on the user&apos;s location to comply with local laws and service provider requirements</li>
                    <li>Fee changes will be communicated 7 days in advance</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">4. WITHDRAWAL PROCEDURES</h4>
                  <p className="text-gray-300 mb-2">Users may choose between two withdrawal procedures: regular withdrawal for conventional processing times, or safe withdrawal which provides additional security measures and verification steps.</p>
                  <div className="ml-4">
                    <p className="text-gray-300 font-medium">Regular Withdrawal:</p>
                    <ul className="text-gray-300 list-disc list-inside ml-4 mb-2">
                      <li>Processing: 1-24 hours</li>
                      <li>Basic verification required</li>
                    </ul>
                    <p className="text-gray-300 font-medium">Safe Withdrawal:</p>
                    <ul className="text-gray-300 list-disc list-inside ml-4">
                      <li>Processing: 24-72 hours</li>
                      <li>Enhanced security checks</li>
                      <li>Higher limits available</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">5. USER RESPONSIBILITIES</h4>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>Keep your account secure</li>
                    <li>Comply with local laws</li>
                    <li>Don&apos;t engage in fraudulent activities</li>
                    <li>Report security issues immediately</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">6. PROHIBITED ACTIVITIES</h4>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>Money laundering</li>
                    <li>Market manipulation</li>
                    <li>Creating multiple accounts</li>
                    <li>Unauthorized access to other accounts</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">7. RISKS</h4>
                  <p className="text-gray-300">Digital assets are volatile and you may lose money. Trade responsibly and only invest what you can afford to lose.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">8. PRIVACY</h4>
                  <p className="text-gray-300">We protect your data according to our Privacy Policy and may share information when required by law.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">9. SERVICE AVAILABILITY</h4>
                  <p className="text-gray-300">We aim for high uptime but cannot guarantee 100% availability. Maintenance may temporarily affect services.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">10. LIMITATION OF LIABILITY</h4>
                  <p className="text-gray-300">Our liability is limited to fees you&apos;ve paid in the last 12 months. We&apos;re not responsible for market losses or third-party failures.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">11. TERMINATION</h4>
                  <p className="text-gray-300">We may suspend accounts for terms violations. You can close your account anytime after settling obligations.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">12. CHANGES TO TERMS</h4>
                  <p className="text-gray-300">We&apos;ll notify you 30 days before making changes. Continued use means you accept the updates.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">13. CONTACT</h4>
                  <p className="text-gray-300">Questions? Email us at: support@web4.com</p>
                </div>

                <div className="border-t border-gray-600 pt-4 mt-6">
                  <p className="text-gray-400 italic text-center">By using Web4, you acknowledge reading and accepting these terms.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Policy Section */}
      <div className="border-t border-gray-600 pt-8 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Privacy Policy</h2>
          <button
            onClick={() => setShowPrivacy(!showPrivacy)}
            className="text-[#ebb70c] hover:text-yellow-400 transition-colors font-medium"
          >
            {showPrivacy ? "See Less" : "See More"}
          </button>
        </div>

        <div className="text-gray-300 mb-4">
          <p className="mb-3">
            Web4 is licensed as a decentralized platform and certified by the Bureau of Industry and Security (BIS) under ECCN 5D002. We collect personal information for account verification, transaction processing, and regulatory compliance.
          </p>
          <p className="mb-3">
            Your data is protected with advanced encryption and BIS-certified security standards. We may share information with regulatory authorities when required by law.
          </p>
          {!showPrivacy && <p className="text-[#ebb70c] text-sm">Click &quot;See More&quot; to read full privacy policy...</p>}
        </div>

        {showPrivacy && (
          <div className="bg-[#1A1A1A] rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-600">
            <div className="prose prose-invert max-w-none text-sm">
              <h3 className="text-lg font-bold mb-4 text-[#ebb70c]">WEB4 PRIVACY POLICY</h3>
              <p className="text-gray-400 mb-4"><strong>Last Updated:</strong> [Date]</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. PLATFORM CERTIFICATION</h4>
                  <p className="text-gray-300">Web4 is licensed as a decentralized platform and is certified by the Bureau of Industry and Security (BIS) under Export Control Classification Number (ECCN) 5D002.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">2. INFORMATION WE COLLECT</h4>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>Personal details (name, email, phone, address)</li>
                    <li>Identity verification documents</li>
                    <li>Transaction and wallet data</li>
                    <li>Device and usage information</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">3. HOW WE USE YOUR DATA</h4>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>Provide platform services and process transactions</li>
                    <li>Comply with KYC/AML and regulatory requirements</li>
                    <li>Maintain security and prevent fraud</li>
                    <li>Improve platform functionality</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">4. INFORMATION SHARING</h4>
                  <p className="text-gray-300 mb-2">We may share data with:</p>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>Regulatory authorities and law enforcement</li>
                    <li>Service providers (verification, security, hosting)</li>
                    <li>Legal proceedings when required</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">5. SECURITY</h4>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>Advanced encryption and security protocols</li>
                    <li>BIS-certified security standards under ECCN 5D002</li>
                    <li>Regular security audits</li>
                    <li>Cold storage for digital assets</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">6. BLOCKCHAIN TRANSPARENCY</h4>
                  <p className="text-gray-300">Transaction data may be visible on public blockchain networks. We separate personal data from blockchain records where possible.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">7. YOUR RIGHTS</h4>
                  <ul className="text-gray-300 list-disc list-inside">
                    <li>Access and correct your information</li>
                    <li>Request data deletion (where legally allowed)</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Control cookie preferences</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">8. DATA RETENTION</h4>
                  <p className="text-gray-300">We keep data as required by law, typically 7 years for financial records and KYC documents.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">9. INTERNATIONAL TRANSFERS</h4>
                  <p className="text-gray-300">Data may be processed globally with appropriate security measures and export control compliance.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">10. UPDATES</h4>
                  <p className="text-gray-300">We&apos;ll notify you 30 days before making changes to this policy.</p>
                </div>

                <div className="border-t border-gray-600 pt-4 mt-6">
                  <p className="text-gray-400 italic text-center">Your privacy and security are protected by our BIS certification and decentralized platform licensing.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;