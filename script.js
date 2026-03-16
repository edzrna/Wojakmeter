const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const REFRESH_MS = 60000;

const coinIdMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  BNB: "binancecoin",
  ADA: "cardano",
  DOGE: "dogecoin",
  TON: "the-open-network",
  AVAX: "avalanche-2",
  TRX: "tron"
};

const defaultTopSymbols = Object.keys(coinIdMap);
const defaultTopIds = defaultTopSymbols.map(symbol => coinIdMap[symbol]);

const moods = [
  { key: "euphoria", name: "Euphoria", min: 85, anim: "anim-pulse", range: "85–100" },
  { key: "content", name: "Content", min: 70, anim: "anim-float", range: "70–84" },
  { key: "optimism", name: "Optimism", min: 60, anim: "anim-float", range: "60–69" },
  { key: "neutral", name: "Neutral", min: 45, anim: "anim-blink", range: "45–59" },
  { key: "doubt", name: "Doubt", min: 35, anim: "anim-tilt", range: "35–44" },
  { key: "concern", name: "Concern", min: 20, anim: "anim-shake", range: "20–34" },
  { key: "frustration", name: "Frustration", min: 0, anim: "anim-shake", range: "0–19" }
];

const chartRanges = {
  "1m": { minutes: 1, days: 0.03, points: 12 },
  "5m": { minutes: 5, days: 0.03, points: 24 },
  "15m": { minutes: 15, days: 0.2, points: 32 },
  "1h": { minutes: 60, days: 1, points: 48 },
  "4h": { minutes: 240, days: 7, points: 56 },
  "24h": { minutes: 1440, days: 7, points: 84 },
  "7d": { minutes: 10080, days: 30, points: 120 }
};

const macroDrivers = {
  market_flow: {
    label: "Market flow / price action",
    narrative: "Live momentum and volume are driving the emotional state of the market."
  },
  etf_adoption: {
    label: "ETF / institutional adoption",
    narrative: "Institutional flows and ETF headlines are supporting market confidence."
  },
  rate_hike: {
    label: "Rate hike fears",
    narrative: "Tighter liquidity expectations are weighing on speculative assets."
  },
  rate_cut: {
    label: "Rate cut hopes",
    narrative: "Liquidity optimism is improving appetite for crypto risk."
  },
  regulation_crackdown: {
    label: "Regulation crackdown",
    narrative: "Regulatory pressure is reducing confidence across the sector."
  },
  crypto_hack: {
    label: "Crypto hack / insolvency",
    narrative: "Security and solvency fears are stressing market psychology."
  },
  war_escalation: {
    label: "War escalation",
    narrative: "Geopolitical tension is increasing uncertainty and risk-off behavior."
  },
  neutral_macro: {
    label: "Neutral macro environment",
    narrative: "No dominant macro shock is in control right now."
  }
};

let activeCoinSymbol = "BTC";
let globalTimeframe = "1h";
let chartTimeframe = "1h";
let topCoinsData = [];
let currentGlobalMood = moods.find(m => m.key === "neutral");

function byId(id) {
  return document.getElementById(id);
}

function getCurrentStyle() {
  return (document.body.className || "style-classic").replace("style-", "");
}

function getHeroImagePath(style, moodKey) {
  return `assets/hero/${style}/${moodKey}.png`;
}

function getIconImagePath(style, moodKey) {
  return `assets/icons/${style}/${moodKey}.png`;
}

function setImage(el, path, fallback = "") {
  if (!el) return;
  el.src = path;
  if (fallback) {
    el.onerror = () => {
      el.onerror = null;
      el.src = fallback;
    };
  }
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function formatCurrencyCompact(value) {
  if (value == null || Number.isNaN(value)) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}

function formatCurrency(value) {
  if (value == null || Number.isNaN(value)) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2
  }).format(value);
}

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return "--";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function getMoodByScore(score) {
  for (const mood of moods) {
    if (score >= mood.min) return mood;
  }
  return moods[moods.length - 1];
}

function scoreFromChange(change) {
  const scaled = 50 + (change * 10);
  return Math.round(clamp(scaled, 0, 100));
}

function getMoodFromChange(change) {
  return getMoodByScore(scoreFromChange(change));
}

function getPointerLeftFromScore(score) {
  return `${clamp(score, 0, 100)}%`;
}

function buildHeartbeatPath(moodKey) {
  const paths = {
    frustration: "M0 28 L28 28 L40 10 L56 46 L72 8 L86 50 L104 16 L126 28 L150 28 L170 12 L188 44 L206 8 L224 48 L244 20 L268 28 L320 28",
    concern: "M0 28 L40 28 L56 18 L72 40 L88 14 L102 38 L124 28 L160 28 L176 18 L192 38 L208 16 L224 36 L248 28 L320 28",
    doubt: "M0 28 L36 28 L52 22 L66 34 L82 20 L98 32 L120 28 L150 28 L168 22 L186 34 L202 24 L218 30 L250 28 L320 28",
    neutral: "M0 28 L44 28 L56 24 L68 32 L82 24 L96 30 L120 28 L160 28 L180 26 L196 30 L214 26 L234 28 L320 28",
    optimism: "M0 28 L36 28 L52 24 L66 20 L82 34 L98 16 L114 30 L138 28 L160 28 L178 22 L194 18 L210 30 L226 20 L246 28 L320 28",
    content: "M0 28 L32 28 L46 20 L60 34 L74 12 L88 30 L104 18 L126 28 L150 28 L168 20 L184 34 L198 14 L214 28 L232 18 L254 28 L320 28",
    euphoria: "M0 28 L28 28 L40 16 L52 40 L66 8 L78 46 L94 6 L108 42 L126 18 L148 28 L166 12 L182 44 L198 8 L214 42 L232 14 L252 28 L320 28"
  };
  return paths[moodKey] || paths.neutral;
}

function updateHeartbeat(moodKey) {
  const wrap = byId("heartbeatWrap");
  const path = byId("heartbeatPath");
  if (!wrap || !path) return;

  wrap.className = `heartbeat-wrap heartbeat-${moodKey}`;
  path.setAttribute("d", buildHeartbeatPath(moodKey));
}

function updateHeroMoodVisual(score, mood) {
  const style = getCurrentStyle();
  const heroFaceImg = byId("heroFaceImg");
  const heroMood = byId("heroMood");
  const heroScore = byId("heroScore");

  if (heroMood) {
    heroMood.textContent = mood.name;
    heroMood.className = `hero-mood mood-${mood.key}`;
  }

  if (heroScore) heroScore.textContent = score;

  if (heroFaceImg) {
    heroFaceImg.className = `hero-face-img ${mood.anim}`;
    setImage(
      heroFaceImg,
      getHeroImagePath(style, mood.key),
      getHeroImagePath("classic", mood.key)
    );
  }

  updateHeartbeat(mood.key);
}

function updateEmotionBar(score, mood) {
  const style = getCurrentStyle();
  const pointer = byId("emotionPointer");
  const pointerImg = byId("emotionPointerImg");

  if (pointer) pointer.style.left = getPointerLeftFromScore(score);

  if (pointerImg) {
    setImage(
      pointerImg,
      getIconImagePath(style, mood.key),
      getIconImagePath("classic", mood.key)
    );
  }

  if (byId("emotionBarMood")) byId("emotionBarMood").textContent = mood.name;
  if (byId("emotionBarScore")) byId("emotionBarScore").textContent = score;
  if (byId("emotionBarRange")) byId("emotionBarRange").textContent = mood.range;
}

function updateSocialMoodFromScore(score) {
  const style = getCurrentStyle();
  const socialScore = clamp(score + 4, 0, 100);
  const socialMood = getMoodByScore(socialScore);

  if (byId("socialMood")) byId("socialMood").textContent = socialMood.name;
  if (byId("socialScore")) byId("socialScore").textContent = socialScore;

  const socialIconImg = byId("socialIconImg");
  if (socialIconImg) {
    socialIconImg.className = `mood-icon-img ${socialMood.anim}`;
    setImage(
      socialIconImg,
      getIconImagePath(style, socialMood.key),
      getIconImagePath("classic", socialMood.key)
    );
  }

  const positive = clamp(Math.round(50 + score / 2), 10, 95);
  const negative = clamp(100 - positive - 8, 2, 80);
  const mentions = `${(2 + score / 12).toFixed(1)}K`;

  if (byId("socialPositive")) byId("socialPositive").textContent = `${positive}%`;
  if (byId("socialNegative")) byId("socialNegative").textContent = `${negative}%`;
  if (byId("socialMentions")) byId("socialMentions").textContent = mentions;

  return socialMood;
}

function updateDriverPanel(score, mood, socialMood) {
  const selectedMacro = macroDrivers[byId("macroDriver")?.value || "market_flow"] || macroDrivers.market_flow;

  if (byId("driverTechnical")) byId("driverTechnical").textContent = mood.name;
  if (byId("driverSocial")) byId("driverSocial").textContent = socialMood.name;
  if (byId("driverMacro")) byId("driverMacro").textContent = selectedMacro.label;
  if (byId("driverNarrative")) byId("driverNarrative").textContent = selectedMacro.narrative;
}

function updateHeader(globalData) {
  if (byId("btcDominance")) byId("btcDominance").textContent = `${globalData.market_cap_percentage.btc.toFixed(1)}%`;
  if (byId("headerMarketCap")) byId("headerMarketCap").textContent = formatCurrencyCompact(globalData.total_market_cap.usd);
  if (byId("headerVolume")) byId("headerVolume").textContent = formatCurrencyCompact(globalData.total_volume.usd);
}

function updateTickerBar() {
  const ticker = byId("tickerBar");
  if (!ticker || !topCoinsData.length) return;

  ticker.innerHTML = topCoinsData.slice(0, 7).map(coin => {
    return `<span>${coin.symbol.toUpperCase()} <strong>${formatCurrency(coin.current_price)}</strong></span>`;
  }).join("");
}

function renderScale() {
  const grid = byId("scaleGrid");
  if (!grid) return;
  const style = getCurrentStyle();

  grid.innerHTML = "";
  [...moods].reverse().forEach(mood => {
    const item = document.createElement("div");
    item.className = "scale-item";
    item.innerHTML = `
      <div class="scale-face">
        <img src="${getIconImagePath(style, mood.key)}" alt="${mood.name}">
      </div>
      <strong>${mood.name}</strong>
    `;
    grid.appendChild(item);
  });
}

function setGlobalTimeframeButtons() {
  document.querySelectorAll("#heroTimeframes button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.timeframe === globalTimeframe);
  });
}

function setChartTimeframeButtons() {
  document.querySelectorAll("#chartTimeframes button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.timeframe === chartTimeframe);
  });
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

async function loadGlobalMarket() {
  const globalRes = await fetchJson(`${COINGECKO_BASE}/global`);
  const globalData = globalRes.data;
  updateHeader(globalData);

  const ids = ["bitcoin", "ethereum", "solana"];
  const coins = await fetchJson(`${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${ids.join(",")}&sparkline=false&price_change_percentage=1h,24h,7d`);

  const avgChange = getAverageChangeForTimeframe(coins, globalTimeframe);
  const score = scoreFromChange(avgChange);
  const mood = getMoodByScore(score);
  currentGlobalMood = mood;

  updateHeroMoodVisual(score, mood);
  updateEmotionBar(score, mood);

  const socialMood = updateSocialMoodFromScore(score);
  updateDriverPanel(score, mood, socialMood);

  if (byId("globalMarketChange")) {
    byId("globalMarketChange").textContent = formatPercent(avgChange);
    byId("globalMarketChange").className = avgChange >= 0 ? "positive" : "negative";
  }

  if (byId("globalMarketVolume")) byId("globalMarketVolume").textContent = formatCurrencyCompact(globalData.total_volume.usd);
  if (byId("globalMarketTimeframe")) byId("globalMarketTimeframe").textContent = globalTimeframe;

  refreshOutputs();
}

function getAverageChangeForTimeframe(coins, timeframe) {
  const values = coins.map(coin => {
    switch (timeframe) {
      case "1m": return (coin.price_change_percentage_1h_in_currency ?? 0) / 60;
      case "5m": return (coin.price_change_percentage_1h_in_currency ?? 0) / 12;
      case "15m": return (coin.price_change_percentage_1h_in_currency ?? 0) / 4;
      case "1h": return coin.price_change_percentage_1h_in_currency ?? 0;
      case "4h": return (coin.price_change_percentage_24h_in_currency ?? 0) / 6;
      case "24h": return coin.price_change_percentage_24h_in_currency ?? 0;
      case "7d": return coin.price_change_percentage_7d_in_currency ?? 0;
      default: return coin.price_change_percentage_24h_in_currency ?? 0;
    }
  });

  const sum = values.reduce((acc, val) => acc + (Number.isFinite(val) ? val : 0), 0);
  return sum / values.length;
}

async function loadTopCoins() {
  topCoinsData = await fetchJson(`${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${defaultTopIds.join(",")}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h,7d`);
  renderTopCoins();
  updateTickerBar();
}

function renderTopCoins() {
  const grid = byId("coinsGrid");
  if (!grid) return;
  const style = getCurrentStyle();
  grid.innerHTML = "";

  topCoinsData.forEach(coin => {
    const symbol = coin.symbol.toUpperCase();
    const change = coin.price_change_percentage_24h_in_currency ?? 0;
    const mood = getMoodFromChange(change);

    const card = document.createElement("button");
    card.type = "button";
    card.className = `coin-card coin-card-button ${activeCoinSymbol === symbol ? "active-coin-card" : ""}`;

    card.innerHTML = `
      <div>
        <div class="symbol">${symbol}</div>
        <div class="price">${formatCurrency(coin.current_price)}</div>
        <div class="change ${change >= 0 ? "positive" : "negative"}">${formatPercent(change)}</div>
      </div>
      <div class="coin-emoji">
        <img src="${getIconImagePath(style, mood.key)}" alt="${symbol} mood">
      </div>
    `;

    card.addEventListener("click", () => {
      activeCoinSymbol = symbol;
      renderTopCoins();
      loadCoinDetails();
      document.querySelector(".chart-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    grid.appendChild(card);
  });
}

function getCoinBySymbol(symbol) {
  return topCoinsData.find(coin => coin.symbol.toUpperCase() === symbol);
}

function getCoinChangeForTimeframe(coin, timeframe) {
  const h1 = coin.price_change_percentage_1h_in_currency ?? 0;
  const h24 = coin.price_change_percentage_24h_in_currency ?? 0;
  const d7 = coin.price_change_percentage_7d_in_currency ?? 0;

  switch (timeframe) {
    case "1m": return h1 / 60;
    case "5m": return h1 / 12;
    case "15m": return h1 / 4;
    case "1h": return h1;
    case "4h": return h24 / 6;
    case "24h": return h24;
    case "7d": return d7;
    default: return h24;
  }
}

function updateCoinIntervalBoxes(coin) {
  const mapping = {
    "1m": "perf1m",
    "5m": "perf5m",
    "15m": "perf15m",
    "1h": "perf1h",
    "4h": "perf4h",
    "24h": "perf24h",
    "7d": "perf7d"
  };

  Object.entries(mapping).forEach(([tf, id]) => {
    const value = getCoinChangeForTimeframe(coin, tf);
    const el = byId(id);
    if (!el) return;
    el.textContent = formatPercent(value);
    el.className = value >= 0 ? "positive" : "negative";
  });
}

async function loadCoinDetails() {
  const coin = getCoinBySymbol(activeCoinSymbol);
  if (!coin) return;

  const value = getCoinChangeForTimeframe(coin, chartTimeframe);
  const score = scoreFromChange(value);
  const mood = getMoodByScore(score);
  const socialScore = clamp(score + 3, 0, 100);
  const socialMood = getMoodByScore(socialScore);
  const style = getCurrentStyle();

  if (byId("chartTitle")) byId("chartTitle").textContent = `${activeCoinSymbol} / ${coin.name}`;
  if (byId("coinMoodTitle")) byId("coinMoodTitle").textContent = `${activeCoinSymbol} Mood`;
  if (byId("coinSocialMoodTitle")) byId("coinSocialMoodTitle").textContent = `${activeCoinSymbol} Social Mood`;

  if (byId("chartChangePill")) {
    byId("chartChangePill").textContent = formatPercent(value);
    byId("chartChangePill").className = `pill ${value >= 0 ? "positive" : "negative"}`;
  }

  if (byId("selectedTimeframe")) byId("selectedTimeframe").textContent = chartTimeframe;
  if (byId("selectedPerformance")) {
    byId("selectedPerformance").textContent = formatPercent(value);
    byId("selectedPerformance").className = value >= 0 ? "positive" : "negative";
  }

  if (byId("coinMoodLabel")) byId("coinMoodLabel").textContent = mood.name;
  if (byId("coinMoodScore")) byId("coinMoodScore").textContent = score;
  if (byId("detailSocialLabel")) byId("detailSocialLabel").textContent = socialMood.name;
  if (byId("detailSocialScore")) byId("detailSocialScore").textContent = socialScore;

  const coinMoodIcon = byId("coinMoodIconImg");
  if (coinMoodIcon) {
    coinMoodIcon.className = `mood-icon-img ${mood.anim}`;
    setImage(coinMoodIcon, getIconImagePath(style, mood.key), getIconImagePath("classic", mood.key));
  }

  const socialIcon = byId("detailSocialIconImg");
  if (socialIcon) {
    socialIcon.className = `mood-icon-img ${socialMood.anim}`;
    setImage(socialIcon, getIconImagePath(style, socialMood.key), getIconImagePath("classic", socialMood.key));
  }

  updateCoinIntervalBoxes(coin);
  setChartTimeframeButtons();

  await loadCoinChart(coin.id, chartTimeframe);
}

async function loadCoinChart(coinId, timeframe) {
  const range = chartRanges[timeframe];
  const url = `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${range.days}&interval=${range.days <= 1 ? "minutely" : "hourly"}`;
  const data = await fetchJson(url);

  const prices = (data.prices || []).map(item => item[1]);
  const sliced = prices.slice(-range.points);
  drawChart(sliced);
}

function drawChart(prices) {
  const path = byId("coinChartPath");
  const area = byId("coinChartArea");
  if (!path || !area || !prices.length) return;

  const w = 900;
  const h = 280;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = prices.map((price, index) => {
    const x = (index / (prices.length - 1 || 1)) * w;
    const y = h - ((price - min) / range) * (h - 24) - 12;
    return [x, y];
  });

  const lineD = points.map((point, i) => `${i === 0 ? "M" : "L"} ${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(" ");
  const areaD = `${lineD} L ${w} ${h} L 0 ${h} Z`;

  path.setAttribute("d", lineD);
  area.setAttribute("d", areaD);

  const first = prices[0];
  const last = prices[prices.length - 1];
  const positive = last >= first;
  path.style.stroke = positive ? "var(--green)" : "var(--red)";
  area.style.fill = positive ? "rgba(77,255,136,.08)" : "rgba(255,59,77,.08)";
}

function buildSentimentPost() {
  return `🚨 WojakMeter Alert

Market Mood: ${byId("heroMood")?.textContent || "Neutral"}
Score: ${byId("heroScore")?.textContent || "50"}/100
Global Market: ${byId("globalMarketChange")?.textContent || "--"}
Volume: ${byId("globalMarketVolume")?.textContent || "--"}
Selected Timeframe: ${globalTimeframe}

#WojakMeter #Crypto`;
}

function buildMemePrompt() {
  return `Create a crypto meme based on:
- Global mood: ${byId("heroMood")?.textContent || "Neutral"}
- Global timeframe: ${globalTimeframe}
- Global market move: ${byId("globalMarketChange")?.textContent || "--"}
- Global volume: ${byId("globalMarketVolume")?.textContent || "--"}
- Coin chart selected: ${activeCoinSymbol}
- Coin timeframe: ${chartTimeframe}
- Market heartbeat style: ${currentGlobalMood.name}`;
}

function refreshOutputs() {
  if (byId("tweetOutput")) byId("tweetOutput").value = buildSentimentPost();
  if (byId("memePromptOutput")) byId("memePromptOutput").value = buildMemePrompt();
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (_) {}
}

function setupButtons() {
  document.querySelectorAll("#heroTimeframes button").forEach(btn => {
    btn.addEventListener("click", async () => {
      globalTimeframe = btn.dataset.timeframe;
      setGlobalTimeframeButtons();
      await loadGlobalMarket();
    });
  });

  document.querySelectorAll("#chartTimeframes button").forEach(btn => {
    btn.addEventListener("click", async () => {
      chartTimeframe = btn.dataset.timeframe;
      setChartTimeframeButtons();
      await loadCoinDetails();
    });
  });

  byId("gen