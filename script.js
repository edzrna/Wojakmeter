const REFRESH_INTERVAL = 180000;

const moods = [
  { key: "frustration", name: "Frustration", min: 0, max: 19, color: "#ff4d4d", range: "0–19" },
  { key: "concern", name: "Concern", min: 20, max: 34, color: "#ff7a3d", range: "20–34" },
  { key: "doubt", name: "Doubt", min: 35, max: 44, color: "#ffb347", range: "35–44" },
  { key: "neutral", name: "Neutral", min: 45, max: 59, color: "#d7d96f", range: "45–59" },
  { key: "optimism", name: "Optimism", min: 60, max: 69, color: "#9be264", range: "60–69" },
  { key: "content", name: "Content", min: 70, max: 84, color: "#44d66f", range: "70–84" },
  { key: "euphoria", name: "Euphoria", min: 85, max: 100, color: "#22e8c5", range: "85–100" }
];

const timeframeConfig = {
  "1m": { minutes: 1, label: "1m" },
  "5m": { minutes: 5, label: "5m" },
  "15m": { minutes: 15, label: "15m" },
  "1h": { minutes: 60, label: "1h" },
  "4h": { minutes: 240, label: "4h" },
  "24h": { minutes: 1440, label: "24h" },
  "7d": { minutes: 10080, label: "7d" }
};

const macroDrivers = {
  market_flow: {
    label: "Market flow / price action",
    sentimentBias: 0,
    socialBias: 0,
    narrativePositive: "Price action is driving conviction and momentum.",
    narrativeNegative: "Price weakness is dominating market psychology."
  },
  etf_adoption: {
    label: "ETF / institutional adoption",
    sentimentBias: 8,
    socialBias: 6,
    narrativePositive: "Institutional inflows are reinforcing bullish sentiment.",
    narrativeNegative: "Adoption headlines remain supportive, but price is not confirming yet."
  },
  rate_hike: {
    label: "Rate hike fears",
    sentimentBias: -10,
    socialBias: -8,
    narrativePositive: "Markets are absorbing macro stress better than expected.",
    narrativeNegative: "Higher-rate fears are creating a risk-off environment."
  },
  rate_cut: {
    label: "Rate cut hopes",
    sentimentBias: 7,
    socialBias: 5,
    narrativePositive: "Easing expectations are supporting risk appetite.",
    narrativeNegative: "Rate-cut hopes exist, but traders remain cautious."
  },
  regulation_crackdown: {
    label: "Regulation crackdown",
    sentimentBias: -12,
    socialBias: -10,
    narrativePositive: "Traders are shaking off regulatory pressure better than expected.",
    narrativeNegative: "Regulatory uncertainty is weakening confidence."
  },
  crypto_hack: {
    label: "Crypto hack / insolvency",
    sentimentBias: -15,
    socialBias: -14,
    narrativePositive: "The market is recovering despite event-driven fear.",
    narrativeNegative: "Trust damage from hacks or insolvency is driving caution."
  },
  war_escalation: {
    label: "War escalation",
    sentimentBias: -9,
    socialBias: -8,
    narrativePositive: "Crypto is showing resilience despite geopolitical stress.",
    narrativeNegative: "Geopolitical tension is pushing traders into risk-off mode."
  },
  neutral_macro: {
    label: "Neutral macro environment",
    sentimentBias: 0,
    socialBias: 0,
    narrativePositive: "With macro calm, price action is leading the story.",
    narrativeNegative: "Macro is quiet, but sentiment is still fragile."
  }
};

const state = {
  style: "classic",
  selectedTimeframe: "1h",
  selectedMacro: "market_flow",
  selectedCoin: null,
  coins: [],
  coinChartData: new Map(),
  globalData: null,
  social: {
    score: 50,
    mood: moods[3],
    positive: 50,
    negative: 50,
    mentions: "0"
  },
  globalMood: moods[3],
  globalScore: 50
};

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function getMood(score) {
  return moods.find((m) => score >= m.min && score <= m.max) || moods[3];
}

function getMoodClass(key) {
  return `mood-${key}`;
}

function formatMoney(value) {
  if (value == null || Number.isNaN(value)) return "--";
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (value >= 1) return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
}

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return "--";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function getPillClass(value) {
  if (value > 0.1) return "positive";
  if (value < -0.1) return "negative";
  return "neutral-pill";
}

function getAssetPath(type, moodKey) {
  return `assets/${type}/${state.style}/${moodKey}.png`;
}

function safeSetImage(img, src, fallback) {
  if (!img) return;
  img.onerror = () => {
    if (img.dataset.fallbackApplied === "true") return;
    img.dataset.fallbackApplied = "true";
    img.src = fallback;
  };
  img.dataset.fallbackApplied = "false";
  img.src = src;
}

async function fetchGlobalMarket() {
  const res = await fetch("https://api.coingecko.com/api/v3/global");
  if (!res.ok) throw new Error("Failed to fetch global market data");
  const json = await res.json();
  return json.data;
}

async function fetchTopCoins() {
  const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=1h,24h,7d&sparkline=false";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch top coins");
  return await res.json();
}

async function fetchCoinChart(coinId) {
  if (state.coinChartData.has(coinId)) {
    return state.coinChartData.get(coinId);
  }

  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`);
  if (!res.ok) throw new Error(`Failed to fetch chart for ${coinId}`);
  const json = await res.json();
  state.coinChartData.set(coinId, json);
  return json;
}

function getChangeForWindow(prices, minutes) {
  if (!Array.isArray(prices) || prices.length < 2) return 0;

  const last = prices[prices.length - 1];
  const nowTs = last[0];
  const targetTs = nowTs - minutes * 60 * 1000;

  let reference = prices[0];
  for (let i = prices.length - 1; i >= 0; i -= 1) {
    if (prices[i][0] <= targetTs) {
      reference = prices[i];
      break;
    }
  }

  const oldPrice = reference[1];
  const newPrice = last[1];
  if (!oldPrice) return 0;

  return ((newPrice - oldPrice) / oldPrice) * 100;
}

function calculateMarketSentiment(coins, timeframeKey, macroKey) {
  if (!coins.length) return 50;

  const macro = macroDrivers[macroKey];
  const values = coins.map((coin) => {
    switch (timeframeKey) {
      case "1h":
        return coin.price_change_percentage_1h_in_currency ?? coin.price_change_percentage_24h ?? 0;
      case "24h":
        return coin.price_change_percentage_24h ?? 0;
      case "7d":
        return coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_24h ?? 0;
      case "4h":
        return (coin.price_change_percentage_1h_in_currency ?? 0) * 1.9;
      case "15m":
        return (coin.price_change_percentage_1h_in_currency ?? 0) * 0.42;
      case "5m":
        return (coin.price_change_percentage_1h_in_currency ?? 0) * 0.18;
      case "1m":
        return (coin.price_change_percentage_1h_in_currency ?? 0) * 0.08;
      default:
        return coin.price_change_percentage_24h ?? 0;
    }
  });

  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const volatility = values.reduce((sum, value) => sum + Math.abs(value), 0) / values.length;

  const rawScore = 50 + avg * 8 + volatility * 1.4 + macro.sentimentBias;
  return clamp(rawScore, 0, 100);
}

function calculateSocialSentiment(globalScore, coins, macroKey) {
  const macro = macroDrivers[macroKey];
  const avg24h = coins.length
    ? coins.reduce((sum, coin) => sum + (coin.price_change_percentage_24h ?? 0), 0) / coins.length
    : 0;

  const score = clamp(50 + avg24h * 5 + macro.socialBias + (globalScore - 50) * 0.35, 0, 100);
  const positive = clamp(Math.round(score), 1, 99);
  const negative = clamp(100 - positive, 1, 99);

  let mentionsBase = 1200 + Math.abs(avg24h) * 2200 + Math.abs(macro.socialBias) * 180;
  if (state.globalData?.total_volume?.usd) {
    mentionsBase += state.globalData.total_volume.usd / 25_000_000_000;
  }

  return {
    score,
    mood: getMood(score),
    positive,
    negative,
    mentions: `${Math.round(mentionsBase).toLocaleString()}`
  };
}

function setActiveButtons(containerId, value) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const buttons = container.querySelectorAll("button[data-timeframe]");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.timeframe === value);
  });
}

function updateBodyStyle() {
  document.body.classList.remove("style-classic", "style-3d", "style-anime", "style-minimal");
  document.body.classList.add(`style-${state.style}`);
}

function applyMoodTheme(mood) {
  document.documentElement.style.setProperty("--accent", mood.color);
}

function setHeroAnimations(mood) {
  const heroImg = document.getElementById("heroFaceImg");
  const socialIcon = document.getElementById("socialIconImg");
  const coinIcon = document.getElementById("coinMoodIconImg");
  const detailSocialIcon = document.getElementById("detailSocialIconImg");

  [heroImg, socialIcon, coinIcon, detailSocialIcon].forEach((el) => {
    if (!el) return;
    el.classList.remove("anim-float", "anim-pulse", "anim-shake");
  });

  if (mood.key === "frustration" || mood.key === "concern") {
    heroImg.classList.add("anim-shake");
    socialIcon.classList.add("anim-shake");
    coinIcon.classList.add("anim-shake");
    detailSocialIcon.classList.add("anim-shake");
  } else if (mood.key === "content" || mood.key === "euphoria") {
    heroImg.classList.add("anim-pulse");
    socialIcon.classList.add("anim-pulse");
    coinIcon.classList.add("anim-pulse");
    detailSocialIcon.classList.add("anim-pulse");
  } else {
    heroImg.classList.add("anim-float");
    socialIcon.classList.add("anim-float");
    coinIcon.classList.add("anim-float");
    detailSocialIcon.classList.add("anim-float");
  }
}

function updateHero(score, mood) {
  state.globalScore = score;
  state.globalMood = mood;

  const heroMood = document.getElementById("heroMood");
  const heroScore = document.getElementById("heroScore");
  const emotionBarMood = document.getElementById("emotionBarMood");
  const emotionBarScore = document.getElementById("emotionBarScore");
  const emotionBarRange = document.getElementById("emotionBarRange");
  const sweatFx = document.getElementById("sweatFx");

  heroScore.textContent = Math.round(score).toString();
  heroMood.textContent = mood.name;
  heroMood.className = `hero-mood ${getMoodClass(mood.key)}`;

  emotionBarMood.textContent = mood.name;
  emotionBarScore.textContent = Math.round(score).toString();
  emotionBarRange.textContent = mood.range;

  sweatFx.classList.toggle("hidden", !(mood.key === "frustration" || mood.key === "concern"));

  safeSetImage(
    document.getElementById("heroFaceImg"),
    getAssetPath("hero", mood.key),
    "assets/hero/classic/neutral.png"
  );

  safeSetImage(
    document.getElementById("emotionPointerImg"),
    getAssetPath("icons", mood.key),
    "assets/icons/classic/neutral.png"
  );

  applyMoodTheme(mood);
  setHeroAnimations(mood);
  updatePointer(score);
  updateHeartbeat(score, mood);
}

function updatePointer(score) {
  const pointer = document.getElementById("emotionPointer");
  const clamped = clamp(score, 0, 100);
  pointer.style.left = `${clamped}%`;
}

function updateHeartbeat(score, mood) {
  const path = document.getElementById("heartbeatPath");
  const heart = document.getElementById("heartbeatHeart");

  const amplitude = 8 + Math.abs(score - 50) * 0.35;
  const base = 28;
  const points = [
    [0, base],
    [20, base],
    [32, base - 2],
    [42, base - amplitude],
    [52, base + amplitude * 0.75],
    [68, base - amplitude * 1.5],
    [82, base + amplitude],
    [100, base],
    [132, base],
    [150, base - 3],
    [165, base - amplitude * 0.8],
    [178, base + amplitude * 0.55],
    [194, base],
    [220, base],
    [260, base],
    [320, base]
  ];

  const d = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`).join(" ");
  path.setAttribute("d", d);
  path.style.stroke = mood.color;
  heart.style.color = mood.color;
}

function updateDrivers(globalMood, socialMood, macroKey) {
  const macro = macroDrivers[macroKey];
  const technicalLabel = globalMood.name;
  const socialLabel = socialMood.name;

  let narrative = macro.narrativeNegative;
  if (globalMood.key === "content" || globalMood.key === "euphoria" || globalMood.key === "optimism") {
    narrative = macro.narrativePositive;
  } else if (globalMood.key === "neutral") {
    narrative = `Price action is balanced. ${macro.label} is shaping sentiment without a decisive breakout yet.`;
  }

  document.getElementById("driverTechnical").textContent = technicalLabel;
  document.getElementById("driverSocial").textContent = socialLabel;
  document.getElementById("driverMacro").textContent = macro.label;
  document.getElementById("driverNarrative").textContent = narrative;
}

function updateSocialCard(social) {
  state.social = social;

  document.getElementById("socialMood").textContent = social.mood.name;
  document.getElementById("socialScore").textContent = Math.round(social.score).toString();
  document.getElementById("socialPositive").textContent = `${social.positive}%`;
  document.getElementById("socialNegative").textContent = `${social.negative}%`;
  document.getElementById("socialMentions").textContent = social.mentions;

  safeSetImage(
    document.getElementById("socialIconImg"),
    getAssetPath("icons", social.mood.key),
    "assets/icons/classic/neutral.png"
  );
}

function renderTickerBar(coins) {
  const tickerBar = document.getElementById("tickerBar");
  const parts = coins.slice(0, 10).map((coin) => {
    const change = coin.price_change_percentage_24h ?? 0;
    const cls = change >= 0 ? "positive" : "negative";
    return `<span class="${cls}">${coin.symbol.toUpperCase()} ${formatMoney(coin.current_price)} ${formatPercent(change)}</span>`;
  });

  tickerBar.innerHTML = parts.join("<span>•</span>");
}

function renderTopCoins(coins) {
  const grid = document.getElementById("coinsGrid");
  grid.innerHTML = "";

  coins.forEach((coin) => {
    const change = coin.price_change_percentage_24h ?? 0;
    const card = document.createElement("button");
    card.className = `coin-card ${state.selectedCoin?.id === coin.id ? "active" : ""}`;
    card.type = "button";

    card.innerHTML = `
      <div class="coin-card-top">
        <div class="coin-card-left">
          <img class="coin-logo" src="${coin.image}" alt="${coin.name} logo">
          <div class="coin-name-wrap">
            <strong>${coin.name}</strong>
            <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
          </div>
        </div>
        <span class="coin-change ${getPillClass(change)}">${formatPercent(change)}</span>
      </div>
      <div class="coin-card-bottom">
        <div class="coin-price">${formatMoney(coin.current_price)}</div>
        <div class="muted">MCap ${formatMoney(coin.market_cap)}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      state.selectedCoin = coin;
      renderTopCoins(state.coins);
      updateSelectedCoinPanel();
    });

    grid.appendChild(card);
  });
}

function drawChart(prices, mood) {
  const svgPath = document.getElementById("coinChartPath");
  const svgArea = document.getElementById("coinChartArea");

  if (!prices || prices.length < 2) {
    svgPath.setAttribute("d", "");
    svgArea.setAttribute("d", "");
    return;
  }

  const width = 900;
  const height = 280;
  const values = prices.map((point) => point[1]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  let pathD = "";
  prices.forEach((point, index) => {
    const x = (index / (prices.length - 1)) * width;
    const y = height - ((point[1] - min) / span) * (height - 18) - 9;
    pathD += `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
  });

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  svgPath.setAttribute("d", pathD.trim());
  svgArea.setAttribute("d", areaD.trim());
  svgPath.style.stroke = mood.color;
  svgArea.style.fill = `${mood.color}22`;
}

function updateIntervalBoxes(chartData) {
  const prices = chartData?.prices || [];

  const changes = {
    "1m": getChangeForWindow(prices, timeframeConfig["1m"].minutes),
    "5m": getChangeForWindow(prices, timeframeConfig["5m"].minutes),
    "15m": getChangeForWindow(prices, timeframeConfig["15m"].minutes),
    "1h": getChangeForWindow(prices, timeframeConfig["1h"].minutes),
    "4h": getChangeForWindow(prices, timeframeConfig["4h"].minutes),
    "24h": getChangeForWindow(prices, timeframeConfig["24h"].minutes),
    "7d": getChangeForWindow(prices, timeframeConfig["7d"].minutes)
  };

  document.getElementById("perf1m").textContent = formatPercent(changes["1m"]);
  document.getElementById("perf5m").textContent = formatPercent(changes["5m"]);
  document.getElementById("perf15m").textContent = formatPercent(changes["15m"]);
  document.getElementById("perf1h").textContent = formatPercent(changes["1h"]);
  document.getElementById("perf4h").textContent = formatPercent(changes["4h"]);
  document.getElementById("perf24h").textContent = formatPercent(changes["24h"]);
  document.getElementById("perf7d").textContent = formatPercent(changes["7d"]);

  return changes;
}

async function updateSelectedCoinPanel() {
  if (!state.selectedCoin) return;

  const coin = state.selectedCoin;
  const chartData = await fetchCoinChart(coin.id);
  const timeframeChanges = updateIntervalBoxes(chartData);

  const selectedChange = timeframeChanges[state.selectedTimeframe] ?? 0;
  const coinScore = clamp(50 + selectedChange * 9 + macroDrivers[state.selectedMacro].sentimentBias * 0.35, 0, 100);
  const coinMood = getMood(coinScore);

  document.getElementById("chartTitle").textContent = `${coin.symbol.toUpperCase()} / ${coin.name}`;
  document.getElementById("chartCoinLogo").src = coin.image;
  document.getElementById("chartCoinLogo").alt = `${coin.name} logo`;
  document.getElementById("chartCoinName").textContent = coin.name;
  document.getElementById("chartCoinPrice").textContent = formatMoney(chartData.prices?.[chartData.prices.length - 1]?.[1] ?? coin.current_price);

  drawChart(chartData.prices, coinMood);

  const chartPill = document.getElementById("chartChangePill");
  chartPill.className = `pill ${getPillClass(selectedChange)}`;
  chartPill.textContent = `${state.selectedTimeframe} ${formatPercent(selectedChange)}`;

  document.getElementById("selectedTimeframe").textContent = state.selectedTimeframe;
  document.getElementById("selectedPerformance").textContent = formatPercent(selectedChange);

  document.getElementById("coinMoodTitle").textContent = `${coin.symbol.toUpperCase()} Mood`;
  document.getElementById("coinMoodLabel").textContent = coinMood.name;
  document.getElementById("coinMoodScore").textContent = Math.round(coinScore).toString();

  safeSetImage(
    document.getElementById("coinMoodIconImg"),
    getAssetPath("icons", coinMood.key),
    "assets/icons/classic/neutral.png"
  );

  const socialCoinScore = clamp(coinScore * 0.72 + state.social.score * 0.28, 0, 100);
  const socialCoinMood = getMood(socialCoinScore);

  document.getElementById("coinSocialMoodTitle").textContent = `${coin.symbol.toUpperCase()} Social Mood`;
  document.getElementById("detailSocialLabel").textContent = socialCoinMood.name;
  document.getElementById("detailSocialScore").textContent = Math.round(socialCoinSco