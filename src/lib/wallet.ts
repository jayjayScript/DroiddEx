// lib/wallets.ts

export const walletAddresses: { [symbol: string]: { name: string; address: string }[] } = {
  BTC: [{ name: "BTC", address: "bc1q2v4cjsmeg05shfk28stvc74dy8cfa2k2j32hlp" }],
  ETH: [{ name: "ETH", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }],
  SOL: [{ name: "SOL", address: "9PwLjinV7riyVhe4PjseZBJw2y7wt8uoWa1wqTyX8pfV" }],
  BNB: [{ name: "BNB", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }],
  XRP: [{ name: "XRP", address: "rLNwyfNs8YwapeBRJhj5igj3NRMZGiNufQ" }],
  LTC: [{ name: "LTC", address: "ltc1q6qxqkk9ztf46r8z4504s4v8dzrqx3x5wk05z32" }],
  XLM: [{ name: "XLM", address: "GAXMTCYHBDZMUPWQOWSFS3OQXJDB3PBJ4S6F4FO5VPWUTH3D7LXYJFXY" }],
  TRX: [{ name: "TRX", address: "TSrUZySdmHRzRnAFPHpaFPHZtbqmDvbJeS" }],
  DOGE: [{ name: "DOGE", address: "DH76FhAmjhipaxtZhfvNgp7VoJMdwYZ6Y6" }],
  POLYGON: [{ name: "POLYGON", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }],
  LUNC: [{ name: "LUNC", address: "terra1z3fe644et7c4p67ju2spjfqc4xz03jxk2p85vk" }],
  ADA: [{ name: "ADA", address: "addr1qx6dqn7g4z5vjehan2llreaupaudhgdk22jl0ykx4trrddd577h5g2h7ak5y7eucyxfdznhaqdlq0kfl5ya50sqswf2qaahypf" }],
  USDT: [
    { name: "USDT (ERC20)", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" },
    { name: "USDT (BEP20)", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" },
    { name: "USDT (TRC20)", address: "TSrUZySdmHRzRnAFPHpaFPHZtbqmDvbJeS" },
  ],
  USDC: [{ name: "USDC", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }],
  SHIBA: [{ name: "SHIBA", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }],
  PEPE: [{ name: "PEPE", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }],
  TROLL: [{ name: "TROLL", address: "9PwLjinV7riyVhe4PjseZBJw2y7wt8uoWa1wqTyX8pfV" }],
};


// lib/walletAddresses.ts (example mapping of correct CoinGecko IDs)
export const coinIdMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  LTC: "litecoin",
  XLM: "stellar",
  TRX: "tron",
  DOGE: "dogecoin",
  POLYGON: "polygon",
  LUNC: "terra-luna",
  ADA: "cardano",
  USDT: "tether",
  USDC: "usd-coin",
  SHIBA: "shiba-inu",
  PEPE: "pepe",
  TROLL: "troll-2"
};

export const coins = [
  { symbol: "BTC", name: "Bitcoin", icon: "cryptocurrency:btc" },
  { symbol: "ETH", name: "Ethereum", icon: "cryptocurrency:eth" },
  { symbol: "SOL", name: "Solana", icon: "cryptocurrency:sol" },
  { symbol: "BNB", name: "BNB", icon: "cryptocurrency:bnb" },
  { symbol: "XRP", name: "XRP", icon: "cryptocurrency:xrp" },
  { symbol: "LTC", name: "Litecoin", icon: "cryptocurrency:ltc" },
  { symbol: "XLM", name: "Stellar", icon: "cryptocurrency:xlm" },
  { symbol: "TRX", name: "Tron", icon: "cryptocurrency:trx" },
  { symbol: "DOGE", name: "Dogecoin", icon: "cryptocurrency:doge" },
  { symbol: "ADA", name: "Cardano", icon: "cryptocurrency:ada" },
  { symbol: "USDT", name: "Tether", icon: "cryptocurrency:usdt" },
  { symbol: "USDC", name: "USD Coin", icon: "cryptocurrency:usdc" },
  { symbol: "SHIBA", name: "Shiba Inu", icon: "cryptocurrency:shib" },
  { symbol: "PEPE", name: "Pepe", icon: "cryptocurrency:pepe" }, // may not exist in Iconify
  { symbol: "TROLL", name: "Troll", icon: "cryptocurrency:question" },
];
