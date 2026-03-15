const moods = [
  { key: "euphoria", name: "Euphoria", score: 90, anim: "anim-pulse" },
  { key: "content", name: "Content", score: 75, anim: "anim-float" },
  { key: "optimism", name: "Optimism", score: 60, anim: "anim-float" },
  { key: "neutral", name: "Neutral", score: 45, anim: "anim-blink" },
  { key: "doubt", name: "Doubt", score: 30, anim: "anim-tilt" },
  { key: "concern", name: "Concern", score: 15, anim: "anim-shake" },
  { key: "frustration", name: "Frustration", score: 0, anim: "anim-shake" }
];

const topCoins = [
  { symbol: "BTC", mood: "optimism" },
  { symbol: "ETH", mood: "optimism" },
  { symbol: "SOL", mood: "euphoria" },
  { symbol: "XRP", mood: "doubt" },
  { symbol: "BNB", mood: "content" },
  { symbol: "ADA", mood: "doubt" },
  { symbol: "DOGE", mood: "content" },
  { symbol: "TON", mood: "optimism" },
  { symbol: "AVAX", mood: "concern" },
  { symbol: "TRX", mood: "neutral" }
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
  for (let i = 0; i < moods.length; i++) {
    if (score >= moods[i].score) return moods[i];
  }
  return moods[moods.length - 1];
}

function getCurrentStyle() {
  const bodyClass = document.body.className || "style-classic";
  return bodyClass.replace("style-", "");
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

function getGlobalMarketScore(timeframe) {
  const value = globalMarketData[timeframe]?.change ?? 0;
  return performanceToScore(value);
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

function updateGlobalMarketStats(timeframe) {
  const data = globalMarketData[timeframe] || { change: 0, volume: "$0" };

  const changeEl = byId("globalMarketChange");
  const volumeEl = byId("globalMarketVolume");
  const timeframeEl = byId("globalMarketTimeframe");

  if (changeEl) {
    changeEl.textContent = formatPercent(data.change);
    changeEl.className = data.change >= 0 ? "positive" : "negative";
  }

  if (volumeEl) volumeEl.textContent = data.volume;
  if (timeframeEl) timeframeEl.textContent = timeframe;
}

function updateHero(score, style) {
  const mood = getMoodByScore(score);

  const heroFaceImg = byId("heroFaceImg");
  const heroMood = byId("heroMood");
  const heroScore = byId("heroScore");
  const sweat = byId("sweatFx");

  setImage(heroFaceImg, getHeroImagePath(style, mood.key), getHeroImagePath("classic", mood.key));

  if (heroFaceImg) heroFaceImg.className = `hero-face-img ${mood.anim}`;
  if (heroMood) heroMood.textContent = mood.name;
  if (heroScore) heroScore.textContent = score;
  updateHeroMoodColor(mood.key);

  if (sweat) {
    if (mood.key === "concern" || mood.key === "frustration") {
      sweat.classList.remove("hidden");
    } else {
      sweat.classList.add("hidden");
    }
  }

  const socialScore = Math.max(0, Math.min(100, score + 4));
  const socialMood = getMoodByScore(socialScore);

  const socialIconImg = byId("socialIconImg");
  if (socialIconImg) {
    socialIconImg.className = `mood-icon-img ${socialMood.anim}`;
    setImage(
      socialIconImg,
      getIconImagePath(style, socialMood.key),
      getIconImagePath("classic", socialMood.key)
    );
  }

  if (byId("socialMood")) byId("socialMood").textContent = socialMood.name;
  if (byId("socialScore")) byId("socialScore").textContent = socialScore;

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

function updateChartSection(symbol, timeframe, style) {
  const coin = coinPerformanceData[symbol];
  if (!coin) return;

  const value = coin.performance[timeframe];
  const score = performanceToScore(value);
  const mood = getMoodByScore(score);

  if (byId("chartTitle")) byId("chartTitle").textContent = `${symbol} / ${coin.name}`;
  if (byId("chartChangePill")) {
    byId("chartChangePill").textContent = formatPercent(value);
    byId("chartChangePill").className = `pill ${value >= 0 ? "positive" : "negative"}`;
  }

  if (byId("selectedTimeframe")) byId("selectedTimeframe").textContent = timeframe;
  if (byId("selectedPerformance")) {
    byId("selectedPerformance").textContent = formatPercent(value);
    byId("selectedPerformance").className = value >= 0 ? "positive" : "negative";
  }

  updateIntervalBoxes(symbol);
  updateCoinSideTitles(symbol);

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

  const coinSocialScore = Math.max(0, Math.min(100, score + 3));
  const coinSocialMood = getMoodByScore(coinSocialScore);

  if (byId("detailSocialLabel")) byId("detailSocialLabel").textContent = coinSocialMood.name;
  if (byId("detailSocialScore")) byId("detailSocialScore").textContent = coinSocialScore;

  const detailSocialIconImg = byId("detailSocialIconImg");
  if (detailSocialIconImg) {
    detailSocialIconImg.className = `mood-icon-img ${coinSocialMood.anim}`;
    setImage(
      detailSocialIconImg,
      getIconImagePath(style, coinSocialMood.key),
      getIconImagePath("classic", coinSocialMood.key)
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
    btn.classList.toggle("active", btn.dataset.timeframe === timeframe);
  });
}

function renderCoins(style) {
  const coinsGrid = byId("coinsGrid");
  if (!coinsGrid) return;

  coinsGrid.innerHTML = "";

  topCoins.forEach((coin) => {
    const marketCoin = coinPerformanceData[coin.symbol];
    const currentValue = marketCoin ? marketCoin.performance[chartTimeframe] : 0;
    const negative = currentValue < 0;
    const mood = getMoodByScore(performanceToScore(currentValue));

    const card = document.createElement("button");
    card.type = "button";
    card.className = `coin-card coin-card-button ${activeCoin === coin.symbol ? "active-coin-card" : ""}`;
    card.innerHTML = `
      <div>
        <div class="symbol">${coin.symbol}</div>
        <div class="price">${marketCoin ? marketCoin.name : coin.symbol}</div>
        <div class="change ${negative ? "negative" : "positive"}">${formatPercent(currentValue)}</div>
      </div>
      <div class="coin-emoji">
        <img src="${getIconImagePath(style, mood.key)}" alt="${coin.symbol} mood" />
      </div>
    `;

    card.addEventListener("click", () => {
      activeCoin = coin.symbol;
      updateChartSection(activeCoin, chartTimeframe, style);
      renderCoins(style);

      const chartCard = document.querySelector(".chart-card");
      if (chartCard) {
        chartCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    coinsGrid.appendChild(card);
  });
}

function renderScale(style) {
  const scaleGrid = byId("scaleGrid");
  if (!scaleGrid) return;

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

function buildSentimentPost(score) {
  const style = getCurrentStyle();
  const mood = getMoodByScore(score);
  const macro = getCurrentMacro();

  return `🚨 WojakMeter Alert

Market Mood: ${mood.name}
Score: ${score}/100
Global Market: ${formatPercent(globalMarketData[globalTimeframe].change)}
Volume: ${globalMarketData[globalTimeframe].volume}
Selected Timeframe: ${globalTimeframe}
Style: ${style}
Social Mood: ${byId("socialMood")?.textContent || "Content"}
Macro Driver: ${macro.label}

Narrative:
${macro.narrative}

#WojakMeter #Crypto #Bitcoin`;
}

function buildMemePrompt(score) {
  const style = getCurrentStyle();
  const mood = getMoodByScore(score);
  const socialMood = byId("socialMood")?.textContent || "Content";
  const macro = getCurrentMacro();

  return `Create a high-quality meme-style crypto image based on the current market context.

Selected visual style: ${style}
Technical mood: ${mood.name}
Social mood: ${socialMood}
Macro driver: ${macro.label}
Macro narrative: ${macro.narrative}
Global market move: ${formatPercent(globalMarketData[globalTimeframe].change)}
Global volume: ${globalMarketData[globalTimeframe].volume}
Selected timeframe: ${globalTimeframe}

Main scene:
- A large Wojak main character in ${mood.name.toLowerCase()} mode
- Use the hero-style artwork as the main visual focus
- A crypto trading dashboard in the background
- Global crypto market context visible
- Visual hints of ${macro.label.toLowerCase()}
- Emotional expression must match ${mood.name}

UI/icon layer:
- Use smaller emoticon-style Wojak icons for compact UI elements
- Small icon-style moods should be used for side widgets, coin reactions and emotional scale
- Keep the main hero Wojak more important than the small icons

Bottom-right branding:
- Add the website text: "wojakmeter.com"
- Add the X account text: "@WojakMeter"
- Add the X logo beside "@WojakMeter"
- Put all branding in the bottom-right corner
- Use the same digital elegant typography style as the website
- Branding should be subtle, premium, sharp, and readable

Tone:
viral, crypto-native, meme-friendly, market-aware, contextual, social-media-ready.`;
}

function refreshOutputs(score) {
  const tweetOutput = byId("tweetOutput");
  const memePromptOutput = byId("memePromptOutput");

  if (tweetOutput) tweetOutput.value = buildSentimentPost(score);
  if (memePromptOutput) memePromptOutput.value = buildMemePrompt(score);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (e) {
    console.log("Clipboard not available", e);
  }
}

function init() {
  const slider = byId("scoreSlider");
  const styleSelector = byId("styleSelector");
  const macroDriver = byId("macroDriver");

  if (!slider || !styleSelector) return;

  let currentStyle = localStorage.getItem("wojakStyle") || "classic";
  let marketScore = getGlobalMarketScore(globalTimeframe);
  let currentScore = marketScore;
  let sliderResetTimeout = null;

  document.body.className = `style-${currentStyle}`;
  styleSelector.value = currentStyle;

  slider.value = currentScore;
  slider.style.background = scoreToSliderGradient(currentScore);

  renderScale(currentStyle);
  renderCoins(currentStyle);
  updateHero(currentScore, currentStyle);
  updateGlobalMarketStats(globalTimeframe);
  updateChartSection(activeCoin, chartTimeframe, currentStyle);
  refreshOutputs(currentScore);

  slider.addEventListener("input", () => {
    currentScore = Number(slider.value);
    slider.style.background = scoreToSliderGradient(currentScore);
    updateHero(currentScore, currentStyle);
    refreshOutputs(currentScore);

    if (sliderResetTimeout) clearTimeout(sliderResetTimeout);
    sliderResetTimeout = setTimeout(() => {
      currentScore = marketScore;
      slider.value = marketScore;
      slider.style.background = scoreToSliderGradient(marketScore);
      updateHero(marketScore, currentStyle);
      updateGlobalMarketStats(globalTimeframe);
      refreshOutputs(marketScore);
    }, 1200);
  });

  document.querySelectorAll("#heroTimeframes button").forEach((btn) => {
    btn.addEventListener("click", () => {
      globalTimeframe = btn.dataset.timeframe;
      marketScore = getGlobalMarketScore(globalTimeframe);
      currentScore = marketScore;

      document.querySelectorAll("#heroTimeframes button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      slider.value = marketScore;
      slider.style.background = scoreToSliderGradient(marketScore);

      updateHero(marketScore, currentStyle);
      updateGlobalMarketStats(globalTimeframe);
      refreshOutputs(marketScore);
    });
  });

  document.querySelectorAll("#chartTimeframes button").forEach((btn) => {
    btn.addEventListener("click", () => {
      chartTimeframe = btn.dataset.timeframe;
      updateChartSection(activeCoin, chartTimeframe, currentStyle);
      renderCoins(currentStyle);
    });
  });

  styleSelector.addEventListener("change", () => {
    currentStyle = styleSelector.value;
    localStorage.setItem("wojakStyle", currentStyle);
    document.body.className = `style-${currentStyle}`;

    renderScale(currentStyle);
    renderCoins(currentStyle);
    updateHero(Number(byId("heroScore")?.textContent || slider.value), currentStyle);
    updateChartSection(activeCoin, chartTimeframe, currentStyle);
    updateGlobalMarketStats(globalTimeframe);
    refreshOutputs(Number(byId("heroScore")?.textContent || slider.value));
  });

  if (macroDriver) {
    macroDriver.addEventListener("change", () => {
      refreshOutputs(Number(byId("heroScore")?.textContent || slider.value));
      updateDriverPanel(Number(byId("heroScore")?.textContent || slider.value));
    });
  }

  const generateTweetBtn = byId("generateTweetBtn");
  const generateMemeBtn = byId("generateMemeBtn");
  const copyTweetBtn = byId("copyTweetBtn");
  const copyMemeBtn = byId("copyMemeBtn");

  if (generateTweetBtn) {
    generateTweetBtn.addEventListener("click", () => {
      if (byId("tweetOutput")) {
        byId("tweetOutput").value = buildSentimentPost(Number(byId("heroScore")?.textContent || slider.value));
      }
    });
  }

  if (generateMemeBtn) {
    generateMemeBtn.addEventListener("click", () => {
      if (byId("memePromptOutput")) {
        byId("memePromptOutput").value = buildMemePrompt(Number(byId("heroScore")?.textContent || slider.value));
      }
    });
  }

  if (copyTweetBtn) {
    copyTweetBtn.addEventListener("click", () => {
      copyText(byId("tweetOutput")?.value || "");
    });
  }

  if (copyMemeBtn) {
    copyMemeBtn.addEventListener("click", () => {
      copyText(byId("memePromptOutput")?.value || "");
    });
  }
}

document.addEventListener("DOMContentLoaded", ini