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
  "4h": { change: -0.8, volume: "$214B" },
  "24h": { change: 2.6, volume: "$628B" },
  "7d": { change: -3.2, volume: "$3.1T" }
};

const macroDrivers = {
  war_escalation: {
    label: "War escalation",
    narrative: "Risk-off sentiment from geopolitical tension and uncertainty."
  },
  extreme_weather: {
    label: "Extreme weather",
    narrative: "Climate disruption raises supply, infrastructure and risk concerns."
  },
  rate_hike: {
    label: "Rate hike fears",
    narrative: "Tighter liquidity expectations pressure speculative assets."
  },
  rate_cut: {
    label: "Rate cut hopes",
    narrative: "Liquidity optimism improves appetite for risk assets."
  },
  regulation_crackdown: {
    label: "Regulation crackdown",
    narrative: "Regulatory pressure weighs on confidence across crypto markets."
  },
  etf_adoption: {
    label: "ETF / institutional adoption",
    narrative: "Institutional inflows and adoption headlines support bullish sentiment."
  },
  energy_disruption: {
    label: "Energy disruption",
    narrative: "Energy stress adds uncertainty to production and macro stability."
  },
  crypto_hack: {
    label: "Crypto hack / insolvency",
    narrative: "Security and solvency fears weaken confidence in the sector."
  },
  neutral_macro: {
    label: "Neutral macro environment",
    narrative: "No dominant macro shock; market is driven mostly by internal momentum."
  }
};

let activeCoin = "BTC";
let globalTimeframe = "1h";
let chartTimeframe = "1h";

function byId(id) {
  return document.getElementById(id);
}

function getMoodByScore(score) {
  for (const mood of moods) {
    if (score >= mood.score) return mood;
  }
  return moods[moods.length - 1];
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

function formatPercent(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function performanceToScore(value) {
  if (value >= 4) return 95;
  if (value >= 2) return 78;
  if (value >= 0.5) return 64;
  if (value >= -0.5) return 48;
  if (value >= -2) return 30;
  if (value >= -4) return 18;
  return 8;
}

function scoreToSliderGradient(score) {
  if (score >= 90) return "linear-gradient(90deg,#ff3b30 0%, #ff5b5b 100%)";
  if (score >= 75) return "linear-gradient(90deg,#34c759 0%, #8cff66 100%)";
  if (score >= 60) return "linear-gradient(90deg,#7dff9b 0%, #baff66 100%)";
  if (score >= 45) return "linear-gradient(90deg,#d0d7e2 0%, #ffffff 100%)";
  if (score >= 30) return "linear-gradient(90deg,#ffb347 0%, #ffd166 100%)";
  if (score >= 15) return "linear-gradient(90deg,#ff7a59 0%, #ffb347 100%)";
  return "linear-gradient(90deg,#ff3b30 0%, #ff5b6e 100%)";
}

function updateHeroMoodColor(moodKey) {
  const heroMood = byId("heroMood");
  if (!heroMood) return;
  heroMood.className = `hero-mood mood-${moodKey}`;
}

function getMoodRangeLabel(moodKey) {
  const ranges = {
    euphoria: "90–100",
    content: "75–89",
    optimism: "60–74",
    neutral: "45–59",
    doubt: "30–44",
    concern: "15–29",
    frustration: "0–14"
  };
  return ranges[moodKey] || "—";
}

function getPointerLeftFromScore(score) {
  const clamped = Math.max(0, Math.min(100, score));
  return `${clamped}%`;
}

function updateEmotionBar(score, style) {
  const mood = getMoodByScore(score);

  const pointer = byId("emotionPointer");
  const pointerImg = byId("emotionPointerImg");
  const moodEl = byId("emotionBarMood");
  const scoreEl = byId("emotionBarScore");
  const rangeEl = byId("emotionBarRange");

  if (pointer) pointer.style.left = getPointerLeftFromScore(score);

  if (pointerImg) {
    setImage(
      pointerImg,
      getIconImagePath(style, mood.key),
      getIconImagePath("classic", mood.key)
    );
  }

  if (moodEl) moodEl.textContent = mood.name;
  if (scoreEl) scoreEl.textContent = score;
  if (rangeEl) rangeEl.textContent = getMoodRangeLabel(mood.key);
}

function getCurrentMacro() {
  const select = byId("macroDriver");
  return macroDrivers[select?.value] || macroDrivers.war_escalation;
}

function updateDriverPanel(score) {
  const mood = getMoodByScore(score);
  const socialMood = byId("socialMood")?.textContent || "Content";
  const macro = getCurrentMacro();

  if (byId("driverTechnical")) byId("driverTechnical").textContent = mood.name;
  if (byId("driverSocial")) byId("driverSocial").textContent = socialMood;
  if (byId("driverMacro")) byId("driverMacro").textContent = macro.label;
  if (byId("driverNarrative")) byId("driverNarrative").textContent = macro.narrative;
}

function updateGlobalHero() {
  const style = getCurrentStyle();
  const data = globalMarketData[globalTimeframe];
  const score = performanceToScore(data.change);
  const mood = getMoodByScore(score);

  const heroFaceImg = byId("heroFaceImg");
  const heroMood = byId("heroMood");
  const heroScore = byId("heroScore");
  const socialMood = byId("socialMood");
  const socialScore = byId("socialScore");
  const socialIconImg = byId("socialIconImg");
  const slider = byId("scoreSlider");

  setImage(heroFaceImg, getHeroImagePath(style, mood.key), getHeroImagePath("classic", mood.key));
  if (heroFaceImg) heroFaceImg.className = `hero-face-img ${mood.anim}`;

  if (heroMood) heroMood.textContent = mood.name;
  if (heroScore) heroScore.textContent = score;
  updateHeroMoodColor(mood.key);

  if (byId("globalMarketChange")) {
    byId("globalMarketChange").textContent = formatPercent(data.change);
    byId("globalMarketChange").className = data.change >= 0 ? "positive" : "negative";
  }

  if (byId("globalMarketVolume")) byId("globalMarketVolume").textContent = data.volume;
  if (byId("globalMarketTimeframe")) byId("globalMarketTimeframe").textContent = globalTimeframe;

  const socialMoodScoreValue = Math.max(0, Math.min(100, score + 4));
  const socialMoodData = getMoodByScore(socialMoodScoreValue);

  if (socialMood) socialMood.textContent = socialMoodData.name;
  if (socialScore) socialScore.textContent = socialMoodScoreValue;

  if (socialIconImg) {
    socialIconImg.className = `mood-icon-img ${socialMoodData.anim}`;
    setImage(
      socialIconImg,
      getIconImagePath(style, socialMoodData.key),
      getIconImagePath("classic", socialMoodData.key)
    );
  }

  if (slider) {
    slider.value = score;
    slider.style.background = scoreToSliderGradient(score);
  }

  updateEmotionBar(score, style);
  updateDriverPanel(score);
}

function updateCoinSideTitles(symbol) {
  if (byId("coinMoodTitle")) byId("coinMoodTitle").textContent = `${symbol} Mood`;
  if (byId("coinSocialMoodTitle")) byId("coinSocialMoodTitle").textContent = `${symbol} Social Mood`;
}

function updateIntervalBoxes(symbol) {
  const perf = coinPerformanceData[symbol]?.performance;
  if (!perf) return;

  const map = {
    "1m": "perf1m",
    "5m": "perf5m",
    "15m": "perf15m",
    "1h": "perf1h",
    "4h": "perf4h",
    "24h": "perf24h",
    "7d": "perf7d"
  };

  Object.entries(map).forEach(([tf, id]) => {
    const el = byId(id);
    if (!el) return;
    const value = perf[tf];
    el.textContent = formatPercent(value);
    el.className = value >= 0 ? "positive" : "negative";
  });
}

function updateChartSection() {
  const style = getCurrentStyle();
  const coin = coinPerformanceData[activeCoin];
  if (!coin) return;

  const value = coin.performance[chartTimeframe];
  const score = performanceToScore(value);
  const mood = getMoodByScore(score);

  if (byId("chartTitle")) byId("chartTitle").textContent = `${activeCoin} / ${coin.name}`;

  if (byId("chartChangePill")) {
    byId("chartChangePill").textContent = formatPercent(value);
    byId("chartChangePill").className = `pill ${value >= 0 ? "positive" : "negative"}`;
  }

  if (byId("selectedTimeframe")) byId("selectedTimeframe").textContent = chartTimeframe;
  if (byId("selectedPerformance")) {
    byId("selectedPerformance").textContent = formatPercent(value);
    byId("selectedPerformance").className = value >= 0 ? "positive" : "negative";
  }

  updateIntervalBoxes(activeCoin);
  updateCoinSideTitles(activeCoin);

  if (byId("coinMoodLabel")) byId("coinMoodLabel").textContent = mood.name;
  if (byId("coinMoodScore")) byId("coinMoodScore").textContent = score;

  const coinMoodIconImg = byId("coinMoodIconImg");
  if (coinMoodIconImg) {
    coinMoodIconImg.className = `mood-icon-img ${mood.anim}`;
    setImage(
      coinMoodIconImg,
      getIconImagePath(style, mood.key),
      getIconImagePath("classic", mood.key)
    );
  }

  const socialScoreValue = Math.max(0, Math.min(100, score + 3));
  const socialMoodData = getMoodByScore(socialScoreValue);

  if (byId("detailSocialLabel")) byId("detailSocialLabel").textContent = socialMoodData.name;
  if (byId("detailSocialScore")) byId("detailSocialScore").textContent = socialScoreValue;

  const detailSocialIconImg = byId("detailSocialIconImg");
  if (detailSocialIconImg) {
    detailSocialIconImg.className = `mood-icon-img ${socialMoodData.anim}`;
    setImage(
      detailSocialIconImg,
      getIconImagePath(style, socialMoodData.key),
      getIconImagePath("classic", socialMoodData.key)
    );
  }

  const line = byId("chartLine");
  if (line) {
    if (value >= 0) {
      line.style.borderBottomColor = "var(--green)";
      line.style.transform = "skewX(-10deg) translateY(0)";
    } else {
      line.style.borderBottomColor = "var(--red)";
      line.style.transform = "skewX(10deg) translateY(8px)";
    }
  }

  document.querySelectorAll("#chartTimeframes button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.timeframe === chartTimeframe);
  });
}

function renderCoins() {
  const coinsGrid = byId("coinsGrid");
  if (!coinsGrid) return;

  const style = getCurrentStyle();
  coinsGrid.innerHTML = "";

  Object.keys(coinPerformanceData).forEach((symbol) => {
    const coin = coinPerformanceData[symbol];
    const value = coin.performance[chartTimeframe];
    const negative = value < 0;
    const mood = getMoodByScore(performanceToScore(value));

    const card = document.createElement("button");
    card.type = "button";
    card.className = `coin-card coin-card-button ${activeCoin === symbol ? "active-coin-card" : ""}`;

    card.innerHTML = `
      <div>
        <div class="symbol">${symbol}</div>
        <div class="price">${coin.name}</div>
        <div class="change ${negative ? "negative" : "positive"}">${formatPercent(value)}</div>
      </div>
      <div class="coin-emoji">
        <img src="${getIconImagePath(style, mood.key)}" alt="${symbol} mood">
      </div>
    `;

    card.addEventListener("click", () => {
      activeCoin = symbol;
      updateChartSection();
      renderCoins();

      const chartCard = document.querySelector(".chart-card");
      if (chartCard) {
        chartCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    coinsGrid.appendChild(card);
  });
}

function renderScale() {
  const scaleGrid = byId("scaleGrid");
  if (!scaleGrid) return;

  const style = getCurrentStyle();
  scaleGrid.innerHTML = "";

  moods.forEach((mood) => {
    const item = document.createElement("div");
    item.className = "scale-item";
    item.innerHTML = `
      <div class="scale-face">
        <img src="${getIconImagePath(style, mood.key)}" alt="${mood.name}">
      </div>
      <strong>${mood.name}</strong>
    `;
    scaleGrid.appendChild(item);
  });
}

function buildSentimentPost() {
  const score = byId("heroScore")?.textContent || "64";
  return `🚨 WojakMeter Alert

Market Mood: ${byId("heroMood")?.textContent || "Optimism"}
Score: ${score}/100
Global Market: ${formatPercent(globalMarketData[globalTimeframe].change)}
Volume: ${globalMarketData[globalTimeframe].volume}
Selected Timeframe: ${globalTimeframe}

#WojakMeter #Crypto`;
}

function buildMemePrompt() {
  return `Create a crypto meme based on:
- Global mood: ${byId("heroMood")?.textContent || "Optimism"}
- Global timeframe: ${globalTimeframe}
- Global market move: ${formatPercent(globalMarketData[globalTimeframe].change)}
- Global volume: ${globalMarketData[globalTimeframe].volume}
- Coin chart selected: ${activeCoin}
- Coin timeframe: ${chartTimeframe}`;
}

function refreshOutputs() {
  if (byId("tweetOutput")) byId("tweetOutput").value = buildSentimentPost();
  if (byId("memePromptOutput")) byId("memePromptOutput").value = buildMemePrompt();
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (e) {
    console.log("Clipboard not available", e);
  }
}

function init() {
  const styleSelector = byId("styleSelector");
  const scoreSlider = byId("scoreSlider");

  if (!styleSelector || !scoreSlider) return;

  const savedStyle = localStorage.getItem("wojakStyle") || "classic";
  document.body.className = `style-${savedStyle}`;
  styleSelector.value = savedStyle;

  updateGlobalHero();
  updateChartSection();
  renderCoins();
  renderScale();
  refreshOutputs();

  document.querySelectorAll("#heroTimeframes button").forEach((btn) => {
    btn.addEventListener("click", () => {
      globalTimeframe = btn.dataset.timeframe;
      document.querySelectorAll("#heroTimeframes button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateGlobalHero();
      refreshOutputs();
    });
  });

  document.querySelectorAll("#chartTimeframes button").forEach((btn) => {
    btn.addEventListener("click", () => {
      chartTimeframe = btn.dataset.timeframe;
      updateChartSection();
      renderCoins();
    });
  });

  styleSelector.addEventListener("change", () => {
    document.body.className = `style-${styleSelector.value}`;
    localStorage.setItem("wojakStyle", styleSelector.value);
    updateGlobalHero();
    updateChartSection();
    renderCoins();
    renderScale();
    refreshOutputs();
  });

  scoreSlider.addEventListener("input", () => {
    const customScore = Number(scoreSlider.value);
    const mood = getMoodByScore(customScore);
    const style = getCurrentStyle();

    if (byId("heroScore")) byId("heroScore").textContent = customScore;
    if (byId("heroMood")) byId("heroMood").textContent = mood.name;
    updateHeroMoodColor(mood.key);

    const heroFaceImg = byId("heroFaceImg");
    if (heroFaceImg) {
      heroFaceImg.className = `hero-face-img ${mood.anim}`;
      setImage(
        heroFaceImg,
        getHeroImagePath(style, mood.key),
        getHeroImagePath("classic", mood.key)
      );
    }

    scoreSlider.style.background = scoreToSliderGradient(customScore);
    updateEmotionBar(customScore, style);

    clearTimeout(window.__wmReset);
    window.__wmReset = setTimeout(() => {
      updateGlobalHero();
      refreshOutputs();
    }, 1200);
  });

  const generateTweetBtn = byId("generateTweetBtn");
  const generateMemeBtn = byId("generateMemeBtn");
  const copyTweetBtn = byId("copyTweetBtn");
  const copyMemeBtn = byId("copyMemeBtn");

  if (generateTweetBtn) {
    generateTweetBtn.addEventListener("click", refreshOutputs);
  }

  if (generateMemeBtn) {
    generateMemeBtn.addEventListener("click", refreshOutputs);
  }

  if (copyTweetBtn) {
    copyTweetBtn.addEventListener("click", () => copyText(byId("tweetOutput")?.value || ""));
  }

  if (copyMemeBtn) {
    copyMemeBtn.addEventListener("click", () => copyText(byId("memePromptOutput")?.value || ""));
  }
}

document.addEventListener("DOMContentLoaded", init);