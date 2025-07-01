"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/web4-removebg-preview.png'

const CryptoWalletLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [binaryString, setBinaryString] = useState('000000000000000000000000000');
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
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.1
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-950 to-stone-950 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 35%, #2a2a2a 70%, #0a0a0a 100%)' }}>
      {/* Subtle Background Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: 'blur(1px)',
              backgroundColor: '#ebb70c'
            }}
          />
        ))}

        {/* Subtle Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(235, 183, 12, 0.05) 0%, transparent 30%)`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="relative z-50 px-4 py-4 md:px-8 backdrop-blur-sm border-b border-white/5" style={{ backgroundColor: 'rgba(26, 26, 26, 0.4)' }}>
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-3">
              <Image src={logo} height={70} width={70} alt="WEB4 Wallet Logo"/>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Security', 'Portfolio'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 transition-colors duration-300 text-sm font-medium hover:text-white"
                  style={{}}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#ebb70c'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = ''}
                >
                  {item}
                </Link>
              ))}
              <Link 
                href="/create-wallet" 
                className="text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm cursor-pointer"
                style={{ 
                  backgroundColor: '#ebb70c',
                  boxShadow: '0 4px 15px rgba(235, 183, 12, 0.3)'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(235, 183, 12, 0.4)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(235, 183, 12, 0.3)'}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon icon={isMenuOpen ? "material-symbols:close" : "material-symbols:menu"} className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-lg border-b border-white/10 p-6" style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)' }}>
              <div className="flex flex-col space-y-4">
                {['Features', 'Security', 'Portfolio'].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-300 transition-colors duration-300"
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#ebb70c'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = ''}
                  >
                    {item}
                  </Link>
                ))}
                <Link 
                  href="/create-wallet" 
                  className="text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{ 
                    backgroundColor: '#ebb70c',
                    boxShadow: '0 4px 15px rgba(235, 183, 12, 0.3)'
                  }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section - Clean & Focused */}
        <div className="relative px-6 py-16 md:px-8 md:py-24">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Buy, trade, and hold{' '}
              <br className="hidden md:block" />
              <span style={{ color: '#ebb70c' }}>
                500+ cryptocurrencies
              </span>
              <br className="hidden md:block" />
              on <span style={{ color: '#ebb70c' }} className="font-black">WEB4 WALLET</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the ultimate in crypto security with our AI-powered wallet featuring
              quantum-resistant encryption and zero-fee transactions.
            </p>

            {/* Email Signup */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-3 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: '#2a2a2a',
                  borderColor: 'rgba(235, 183, 12, 0.3)' 
                }}
                onFocus={(e) => e.target.style.borderColor = '#ebb70c'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(235, 183, 12, 0.3)'}
              />
              <a 
                href="/create-wallet" 
                className="text-black px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: '#ebb70c',
                  boxShadow: '0 4px 15px rgba(235, 183, 12, 0.3)'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(235, 183, 12, 0.4)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(235, 183, 12, 0.3)'}
              >
                Get Started
              </a>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#ebb70c' }}>$76 Billion</div>
                <div className="text-gray-400 text-sm">24h trading volume on WEB4 Wallet exchange</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#ebb70c' }}>500+</div>
                <div className="text-gray-400 text-sm">Cryptocurrencies listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#ebb70c' }}>90 Million</div>
                <div className="text-gray-400 text-sm">Registered users who trust WEB4 Wallet</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#ebb70c' }}>&lt;0.10%</div>
                <div className="text-gray-400 text-sm">Lowest transaction fees</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="relative px-4 py-16 md:px-8" style={{ backgroundColor: 'rgba(42, 42, 42, 0.5)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: '#ebb70c' }}>
                Powerful Features
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Everything you need to dominate the crypto market in one revolutionary platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="backdrop-blur-sm border border-white/5 rounded-xl p-6 transition-all duration-300 group hover:border-opacity-20"
                  style={{ 
                    backgroundColor: 'rgba(26, 26, 26, 0.4)',
                    borderColor: 'rgba(235, 183, 12, 0.1)'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.borderColor = 'rgba(235, 183, 12, 0.2)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.borderColor = 'rgba(235, 183, 12, 0.1)'}
                >
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl mb-4 w-fit`}>
                    <Icon icon={feature.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:transition-colors transition-colors duration-300"
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#ebb70c'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = ''}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Crypto Prices */}
        <div id="portfolio" className="relative px-4 py-16 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: '#ebb70c' }}>
                Live Market Data
              </h2>
              <p className="text-lg text-gray-300">Real-time prices powered by AI analytics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cryptoPrices.map((crypto, index) => (
                <div
                  key={index}
                  className="backdrop-blur-sm border border-white/5 rounded-xl p-6 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(26, 26, 26, 0.4)',
                    borderColor: 'rgba(235, 183, 12, 0.1)'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.borderColor = 'rgba(235, 183, 12, 0.2)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.borderColor = 'rgba(235, 183, 12, 0.1)'}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ebb70c' }}>
                      <Icon icon={`cryptocurrency:${crypto.symbol.toLowerCase()}`} className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{crypto.symbol}</div>
                      <div className="text-gray-400 text-sm">{crypto.name}</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-2">
                    ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm font-semibold px-2 py-1 rounded ${crypto.change > 0
                    ? 'text-green-400 bg-green-400/10'
                    : 'text-red-400 bg-red-400/10'
                    }`}>
                    {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div id="security" className="relative px-4 py-16 md:px-8" style={{ backgroundColor: 'rgba(42, 42, 42, 0.5)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: '#ebb70c' }}>
                Quantum-Level Security
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Your crypto fortress protected by next-generation security protocols that even quantum computers can&apos;t break
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#ebb70c' }}>
                      <Icon icon={item.icon} className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="backdrop-blur-sm border rounded-2xl p-8" style={{ backgroundColor: 'rgba(26, 26, 26, 0.4)', borderColor: 'rgba(235, 183, 12, 0.2)' }}>
                <div className="text-center">
                  <div className="relative mb-6">
                    <Icon icon="fluent:bot-28-filled" className="w-16 h-16 mx-auto" style={{ color: '#ebb70c' }} />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white">Security AI Guardian</h3>

                  <div className="font-mono text-sm p-4 rounded-lg mb-4 border tracking-wider" 
                       style={{ 
                         color: '#ebb70c',
                         backgroundColor: 'rgba(235, 183, 12, 0.1)',
                         borderColor: 'rgba(235, 183, 12, 0.2)'
                       }}>
                    {binaryString}
                  </div>

                  <div className="space-y-2 text-gray-300 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Real-time threat monitoring</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>AI anomaly detection</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ebb70c' }}></div>
                      <span>Quantum encryption active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Partners */}
        <div className="py-12" style={{ backgroundColor: 'rgba(10, 10, 10, 0.3)' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-8" style={{ color: '#ebb70c' }}>Trusted by Top Exchanges & Platforms</h3>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 hover:opacity-100 transition-opacity">
              <Icon icon="token-branded:binance" className="h-12 w-12 grayscale hover:grayscale-0 transition-all duration-300" />
              <Icon icon="token-branded:coinbase" className="h-10 w-10 grayscale hover:grayscale-0 transition-all duration-300" />
              <Icon icon="token-branded:kraken" className="h-10 w-10 grayscale hover:grayscale-0 transition-all duration-300" />
              <Icon icon="token-branded:okx" className="h-8 w-8 grayscale hover:grayscale-0 transition-all duration-300" />
              <Icon icon="token-branded:kucoin" className="h-10 w-10 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 py-12 md:px-8 border-t border-white/5" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-3">
              <Image src={logo} height={70} width={70} alt="WEB4 Wallet Logo"/>
            </div>

              <div className="text-gray-400 text-sm text-center">
                © {new Date().getFullYear()} WEB4 Wallet. All rights reserved. • Powered by Quantum Security
              </div>

              <div className="flex gap-4">
                {['twitter', 'discord', 'telegram'].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{}}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(235, 183, 12, 0.2)'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                  >
                    <Icon 
                      icon={`simple-icons:${social}`} 
                      className="w-4 h-4 text-gray-400 transition-colors"
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#ebb70c'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = ''}
                    />
                  </Link>
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