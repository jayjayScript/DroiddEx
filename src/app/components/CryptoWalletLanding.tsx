"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const CryptoWalletLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [binaryString, setBinaryString] = useState('000000000000000000000000000');
  // const [activeBot, setActiveBot] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
  }
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cryptoPrices, setCryptoPrices] = useState([
    { symbol: 'BTC', name: 'Bitcoin', price: 67234.50, change: 2.45 },
    { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: 1.23 },
    { symbol: 'ADA', name: 'Cardano', price: 0.45, change: -0.87 },
    { symbol: 'SOL', name: 'Solana', price: 145.67, change: 3.21 }
  ]);

  // Enhanced binary animation with glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomBinary = Array.from({ length: 27 }, () => Math.floor(Math.random() * 2)).join('');
      setBinaryString(randomBinary);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Floating particles animation
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 100 ? -5 : particle.y + particle.speed
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    // interface MousePosition {
    //   x: number;
    //   y: number;
    // }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price + (Math.random() - 0.5) * crypto.price * 0.001,
        change: crypto.change + (Math.random() - 0.5) * 0.5
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: 'dashicons:arrow-up-alt',
      title: 'Send',
      description: 'Transfer crypto instantly to any wallet worldwide with zero fees',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: 'dashicons:arrow-down-alt',
      title: 'Receive',
      description: 'Get crypto payments with your secure QR code',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: 'tdesign:swap',
      title: 'Swap',
      description: 'Exchange between 500+ cryptocurrencies instantly',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: 'ion:card-sharp',
      title: 'Buy',
      description: 'Purchase crypto with credit card or bank transfer',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: 'fluent:building-bank-28-filled',
      title: 'Sell',
      description: 'Convert crypto to fiat in 180+ countries',
      color: 'from-teal-400 to-blue-500'
    },
    {
      icon: 'material-symbols:security',
      title: 'Secure',
      description: 'Military-grade encryption with quantum resistance',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 10px rgba(255, 186, 26, 0.5)'
            }}
          />
        ))}

        {/* Dynamic Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(235, 183, 12, 0.1) 0%, transparent 20%)`
          }}
        />
      </div>

      {/* Main Content (scrollable) */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="relative z-50 px-4 py-6 md:px-8 backdrop-blur-sm bg-black/20 border-b border-white/10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-400/50">
                <Icon icon="cryptocurrency:btc" className="w-7 h-7 text-black animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                WEB4 Wallet
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Security', 'Portfolio'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <a href="/create-wallet" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 hover:bg-white/10 rounded-full transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon icon={isMenuOpen ? "material-symbols:close" : "material-symbols:menu"} className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg border-b border-white/10 p-6 animate-in slide-in-from-top duration-300">
              <div className="flex flex-col space-y-6">
                {['Features', 'Security', 'Portfolio'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-lg"
                  >
                    {item}
                  </a>
                ))}
                <a href="/create-wallet" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 cursor-pointer">
                  Get Started
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="relative px-4 py-20 md:px-8 md:py-32">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-left mb-20 md:flex items-center justify-between">
              <div className='flex-[2]'>
                <div className="inline-block mb-6">
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-medium backdrop-blur-sm">
                    🚀 The Future of Finance is Here
                  </span>
                </div>

                <h1 className="text-5xl md:text-[5.33rem] font-black mb-8 bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent leading-tight">
                  Next-Gen
                  <br />
                  Crypto Wallet
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Experience the ultimate in crypto security with our AI-powered wallet featuring
                  <span className="text-yellow-400 font-semibold"> quantum-resistant encryption</span> and
                  <span className="text-yellow-400 font-semibold"> zero-fee transactions</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-start mb-8">
                  <a href="/create-wallet" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-bold text-xl hover:bg-yellow-500 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 cursor-pointer w-[80%]">
                    Start Trading Now
                  </a>
                </div>
              </div>

              {/* Binary Security Display - Enhanced */}
              <div className='flex-[2]'>
                <div className="flex justify-center mb-9">
                  <div className="bg-black/40 backdrop-blur-lg border border-yellow-400/30 rounded-2xl p-8 max-w-lg shadow-2xl shadow-yellow-400/20">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="relative">
                        <Icon icon="fluent:bot-28-filled" className="w-12 h-12 text-yellow-400" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-left">
                        <div className="text-yellow-400 font-semibold">Security AI</div>
                        <div className="text-green-400 text-sm">Online • Monitoring</div>
                      </div>
                    </div>

                    <div className="font-mono text-lg text-yellow-400 bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/20 mb-4 tracking-wider">
                      {binaryString}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <Icon icon="material-symbols:security" className="w-4 h-4" />
                      <span>Real-time quantum encryption active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="my-20">
              <h3 className="text-3xl md:text-4xl font-bold mb-10 text-yellow-400 text-center">What Our Users Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-black/40 border border-yellow-400/20 rounded-2xl p-8 shadow-lg hover:shadow-yellow-400/20 transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <Icon icon="mdi:account-circle" className="w-10 h-10 text-yellow-400" />
                    <span className="font-bold text-lg text-white">Aisha K.</span>
                  </div>
                  <p className="text-gray-300 mb-2">“The security and speed are unmatched. I feel safe trading every day!”</p>
                  <div className="text-yellow-400 text-sm">Entrepreneur</div>
                </div>
                <div className="bg-black/40 border border-yellow-400/20 rounded-2xl p-8 shadow-lg hover:shadow-yellow-400/20 transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <Icon icon="mdi:account-circle" className="w-10 h-10 text-yellow-400" />
                    <span className="font-bold text-lg text-white">James L.</span>
                  </div>
                  <p className="text-gray-300 mb-2">“The best wallet UI I’ve ever used. Swapping coins is a breeze!”</p>
                  <div className="text-yellow-400 text-sm">Crypto Trader</div>
                </div>
                <div className="bg-black/40 border border-yellow-400/20 rounded-2xl p-8 shadow-lg hover:shadow-yellow-400/20 transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <Icon icon="mdi:account-circle" className="w-10 h-10 text-yellow-400" />
                    <span className="font-bold text-lg text-white">Priya S.</span>
                  </div>
                  <p className="text-gray-300 mb-2">“I love the quantum encryption and instant support. Highly recommended!”</p>
                  <div className="text-yellow-400 text-sm">Engineer</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Features Section - Enhanced */}
        <div id="features" className="relative px-4 py-2 md:px-8">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to dominate the crypto market in one revolutionary platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-black/40 backdrop-blur-lg hover:bg-black/60 border border-white/10 hover:border-yellow-400/50 rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20"
                >
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl mb-6 w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon icon={feature.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Crypto Prices - Enhanced */}
        <div id="portfolio" className="relative px-4 py-20 md:px-8 bg-gradient-to-r from-black/50 to-gray-900/50">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Live Market Data
              </h2>
              <p className="text-xl text-gray-300">Real-time prices powered by AI analytics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cryptoPrices.map((crypto, index) => (
                <div
                  key={index}
                  className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Icon icon={`cryptocurrency:${crypto.symbol.toLowerCase()}`} className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{crypto.symbol}</div>
                      <div className="text-gray-400">{crypto.name}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mb-3">
                    ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`w-[50%] text-lg font-semibold px-3 py-1 rounded-full ${crypto.change > 0
                    ? 'text-green-400 bg-green-400/10 border border-green-400/30'
                    : 'text-red-400 bg-red-400/10 border border-red-400/30'
                    }`}>
                    {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Section - Enhanced */}
        <div id="security" className="relative px-4 py-20 md:px-8">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Quantum-Level Security
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Your crypto fortress protected by next-generation security protocols that even quantum computers can&apos;t break
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                {[
                  {
                    icon: 'material-symbols:security',
                    title: 'Quantum-Resistant Encryption',
                    description: 'Future-proof your assets with post-quantum cryptography that withstands any attack'
                  },
                  {
                    icon: 'material-symbols:shield-lock',
                    title: 'Multi-Signature Protection',
                    description: 'Advanced multi-sig technology with biometric verification and hardware key support'
                  },
                  {
                    icon: 'material-symbols:backup',
                    title: 'Decentralized Backup',
                    description: 'Your keys are split across multiple secure locations with zero-knowledge recovery'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-6 group">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg shadow-yellow-400/50 group-hover:scale-110 transition-transform duration-300">
                      <Icon icon={item.icon} className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-black/60 backdrop-blur-lg border border-yellow-400/30 rounded-3xl p-10 shadow-2xl shadow-yellow-400/20">
                <div className="text-center">
                  <div className="relative mb-8">
                    <Icon icon="fluent:bot-28-filled" className="w-24 h-24 text-yellow-400 mx-auto" />

                  </div>

                  <h3 className="text-3xl font-bold mb-6 text-white">Security AI Guardian</h3>

                  <div className="font-mono text-xl text-yellow-400 bg-yellow-400/10 p-6 rounded-xl mb-6 border border-yellow-400/20 tracking-wider">
                    {binaryString}
                  </div>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Real-time threat monitoring</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>AI anomaly detection</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span>Quantum encryption active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collaborators Section */}
        <div className="py-12 md:py-20 bg-black/60 border-t border-yellow-400/10">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-yellow-400">Trusted by Top Exchanges & Platforms</h3>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
              <Icon icon="token-branded:binance" className="h-24 w-24 md:h-32 md:w-32 grayscale hover:grayscale-0 transition-all duration-300" />
              <Icon icon="token-branded:coinbase" className="h-20 w-20 md:h-28 md:w-28 grayscale hover:grayscale-0 transition-all duration-300" />
              <Icon icon="token-branded:kraken" className="h-20 w-20 md:h-28 md:w-28 grayscale hover:grayscale-0 transition-all duration-300" />
              <Icon icon="token-branded:okx" className="h-16 w-16 bg-[#ebb70c] md:h-24 md:w-24 grayscale hover:grayscale-0 transition-all duration-300" />
              <Icon icon="token-branded:kucoin" className="h-20 w-20 md:h-28 md:w-28 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* CTA Section - Enhanced */}
        <div className="relative px-4 py-20 md:px-8 bg-gradient-to-r from-yellow-400 to-orange-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/90 to-orange-500/90"></div>
          <svg
            className="absolute inset-0 opacity-30"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            fillRule="evenodd"
          >
            <circle cx="30" cy="30" r="2" fill="#000000" fillOpacity="0.05" />
          </svg>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-black">
              Ready to Revolutionize Your Crypto Experience?
            </h2>
            <p className="text-xl md:text-2xl text-black/80 mb-12 max-w-3xl mx-auto">
              Join over 2 million users who trust WEB4 Wallet for their digital asset management
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/create-wallet" className="bg-black text-yellow-400 px-12 py-5 rounded-full font-bold text-xl hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Create Your Wallet
              </a>
              <button className="border-2 border-black text-black px-12 py-5 rounded-full font-bold text-xl hover:bg-black hover:text-yellow-400 transition-all duration-300 cursor-pointer">
                Download App
              </button>
            </div>
          </div>
        </div>

        <footer className="px-4 py-16 md:px-8 bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Icon icon="cryptocurrency:btc" className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  WEB4 Wallet
                </span>
              </div>

              <div className="text-gray-400 text-center">
                &copy; {new Date().getFullYear()} WEB4 Wallet. All rights reserved. • Powered by Quantum Security
              </div>

              <div className="flex gap-6">
                {['twitter', 'discord', 'telegram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-white/10 hover:bg-yellow-400/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Icon icon={`simple-icons:${social}`} className="w-5 h-5 text-gray-400 hover:text-yellow-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CryptoWalletLanding;