'use client';

import { useEffect, useRef } from 'react';

export default function TradingViewTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = `
      <div class="tradingview-widget-container__widget"></div>
    `;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
        { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
        { proName: 'BINANCE:SOLUSDT' },
        { proName: 'BINANCE:XRPUSDT' },
        { proName: 'BINANCE:ADAUSDT' },
        { proName: 'COINBASE:SOLUSD' },
        { proName: 'CRYPTOCAP:USDT.D' },
        { proName: 'BITSTAMP:XRPUSD' },
        { proName: 'CRYPTOCAP:TOTAL3' },
        { proName: 'BINANCE:AVAXUSDT' },
        { proName: 'COINBASE:SUIUSD' },
        { proName: 'BINANCE:DOTUSDT' },
        { proName: 'BINANCE:NEARUSDT' },
        { proName: 'COINBASE:DOGEUSD' },
        { proName: 'BINANCE:PEPEUSDT' },
        { proName: 'PYTH:XAUUSD' },
        { proName: 'COINBASE:XLMUSD' }
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    });

    containerRef.current
      .querySelector('.tradingview-widget-container__widget')
      ?.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      {/* Widget loads dynamically */}
    </div>
  );
}

