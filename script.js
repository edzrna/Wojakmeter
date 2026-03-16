const moods = [
  { key: "euphoria", name: "Euphoria", score: 90, anim: "anim-pulse" },
  { key: "content", name: "Content", score: 75, anim: "anim-float" },
  { key: "optimism", name: "Optimism", score: 60, anim: "anim-float" },
  { key: "neutral", name: "Neutral", score: 45, anim: "anim-blink" },
  { key: "doubt", name: "Doubt", score: 30, anim: "anim-tilt" },
  { key: "concern", name: "Concern", score: 15, anim: "anim-shake" },
  { key: "frustration", name: "Frustration", score: 0, anim: "anim-shake" }
];

const coinPerformanceData = {
  BTC: { name: "Bitcoin", performance: { "1m": 0.2, "5m": 0.5, "15m": 0.9, "1h": 2.1, "4h": -1.3, "24h": 3.4, "7d": -4.8 } },
  ETH: { name: "Ethereum", performance: { "1m": 0.1, "5m": 0.3, "15m": 0.7, "1h": 1.4, "4h": 0.8, "24h": 2.9, "7d": -2.2 } },
  SOL: { name: "Solana", performance: { "1m": 0.3, "5m": 0.8, "15m": 1.1, "1h": 4.8, "4h": 2.2, "24h": 6.1, "7d": 8.5 } },
  XRP: { name: "XRP", performance: { "1m": -0.1, "5m": -0.2, "15m": -0.3, "1h": -0.8, "4h": -1.1, "24h": -0.4, "7d": 1.8 } },
  BNB: { name: "BNB", performance: { "1m": 0.1, "5m": 0.4, "15m": 0.7, "1h": 1.9, "4h": 1.2, "24h": 2.3, "7d": 3.0 } },
  ADA: { name: "Cardano", performance: { "1m": -0.1, "5m": -0.3, "15m": -0.5, "1h": -1.1, "4h": -1.7, "24h": -0.9, "7d": -2.6 } },
  DOGE: { name: "Dogecoin", performance: { "1m": 0.2, "5m": 0.9, "15m": 1.5, "1h": 3.6, "4h": 2.8, "24h": 5.2, "7d": 7.9 } },
  TON: { name: "Toncoin", performance: { "1m": 0.0, "5m": 0.1, "15m": 0.3, "1h": 0.7, "4h": 0.4, "24h": 1.2, "7d": 2.7 } },
  AVAX: { name: "Avalanche", performance: { "1m": -0.2, "5m": -0.7, "15m": -1.0, "1h": -2.3, "4h": -3.5, "24h": -1.6, "7d": -4.1 } },
  TRX: { name: "TRON", performance: { "1m": 0.0, "5m": 0.1, "15m": 0.2, "1h": 0.4, "4h": 0.6, "24h": 0.9, "7d": 1.4 } }
};

const globalMarketData = {
  "1m": { change: 0.1, volume: "$1.2B" },
  "5m": { change: 0.3, volume: "$4.8B" },
  "15m": { change: 0.7, volume: "$12.6B" },
  "1h": { change: 1.4, volume: "$91B" },