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
  BTC: {
    name: "Bitcoin",
    performance: { "1m": 0.2, "5m": 0.5, "15m": 0.9, "1h": 2.1, "4h": -1.3, "24h": 3.4, "7d": -4.8 }
  },
  ETH: {
    name: "Ethereum",
    performance: { "1m": 0.1, "5m": 0.3, "15m": 0.7, "1h": 1.4, "4h": 0.8, "24h": 2.9, "7d": -2.2 }
  },
  SOL: {
    name: "Solana",
    performance: { "1m": 0.3, "5m": 0.8, "15m": 1.1, "1h": 4.8, "4h": 2.2, "24h": 6.1, "7d": 8.5 }
  },
  XRP: {
    name: "XRP",
    performance: { "1m": -0.1, "5m": -0.2, "15m": -0.3, "1h": -0.8, "4h": -1.1, "24h": -0.4, "7d": 1.8 }
  },
  BNB: {
    name: "BNB",
    performance: { "1m": 0.1, "5m": 0.4, "15m": 0.7, "1h": 1.9, "4h": 1.2, "24h": 2.3, "7d": 3.0 }
  },
  ADA: {
    name: "Cardano",
    performance: { "1m": -0.1, "5m": -0.3, "15m": -0.5, "1h": -1.1, "4h": -1.7, "24h": -0.9, "7d": -2.6 }
  },
  DOGE: {
    name: "Dogecoin",
    performance: { "1m": 0.2, "5m": 0.9, "15m": 1.5, "1h": 3.6, "4h": 2.8, "24h": 5.2, "7d": 7.9 }
  },
  TON: {
    name: "Toncoin",
    performance: { "1m": 0.0, "5m": 0.1, "15m": 0.3, "1h": 0.7, "4h": 0.4, "24h": 1.2, "7d": 2.7 }
  },
  AVAX: {
    name: "Avalanche",
    performance: { "1m": -0.2, "5m": -0.7, "15m": -1.0, "1h": -2.3, "4h": -3.5, "24h": -1.6, "7d": -4.1 }
  },
  TRX: {
    name: "TRON",
    performance: { "1m": 0.0, "5m": 0.1, "15m": 0.2, "1h": 0.4, "4h": 0.6, "24h": 0.9, "7d": 1.4 }
  }
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
let activeTimeframe = "1h";

function getMoodByScore(score) {
  for (let i = 0; i < moods.length; i++) {
    if (score >= moods[i].score) return moods[i];
  }
  return moods[moods.length - 1];
}

function getMoodByKey(key) {
  return moods.find(m => m.key === key) || moods[2];
}

function getCurrentStyle() {
  const body = document.body.className || "style-classic";
  return body.replace("style-", "") || "classic";
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

function getCurrentMacro() {
  const macroKey = document.getElementById("macroDriver").value;
  return macroDrivers[macroKey];
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

function formatPercent(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function getMoodClass(moodKey) {
  return `mood-${moodKey}`;
}

function updateHeroMoodColor(moodKey) {
  const heroMood = document.getElementById("heroMood");
  heroMood.className = `hero-mood ${getMoodClass(moodKey)}`;
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

function buildSentimentPost(score) {
  const style = getCurrentStyle();
  const mood = getMoodByScore(score);
  const macro = getCurrentMacro();

  return `🚨 WojakMeter Alert

Market Mood: ${mood.name}
Score: ${score}/100
${activeCoin}: ${formatPercent(coinPerformanceData[activeCoin].performance[activeTimeframe])}
Selected Timeframe: ${activeTimeframe}
Style: ${style}
Social Mood: ${document.getElementById("socialMood").textContent}
Macro Driver: ${macro.label}

Narrative:
${macro.narrative}

#WojakMeter #Crypto #Bitcoin`;
}

function buildMemePrompt(score) {
  const style = getCurrentStyle();
  const mood = getMoodByScore(score);
  const socialMood = document.getElementById("socialMood").textContent;
  const macro = getCurrentMacro();
  const activePerformance = formatPercent(coinPerformanceData[activeCoin].performance[activeTimeframe]);

  return `Create a high-quality meme-style crypto image based on the current market context.

Selected visual style: ${style}
Technical mood: ${mood.name}
Social mood: ${socialMood}
Macro driver: ${macro.label}
Macro narrative: ${macro.narrative}
Coin focus: ${activeCoin}
Selected timeframe: ${activeTimeframe}
Performance: ${activePerformance}

Main scene:
- A large Wojak main character in ${mood.name.toLowerCase()} mode
- Use the hero-style artwork as the main visual focus
- A crypto trading dashboard in the background
- ${activeCoin} price action visible
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

function updateDriverPanel(score) {
  const technicalMood = getMoodByScore(score).name;
  const socialMood = document.getElementById("socialMood").textContent;
  const macro = getCurrentMacro();

  document.getElementById("driverTechnical").textContent = technicalMood;
  document.getElementById("driverSocial").textContent = socialMood;
  document.getElementById("driverMacro").textContent = macro.label;
  document.getElementById("driverNarrative").textContent = macro.narrative;
}

function updateHero(score, style) {
  const mood = getMoodByScore(score);

  const heroFaceImg = document.getElementById("heroFaceImg");
  const heroMood = document.getElementById("heroMood");
  const heroScore = document.getElementById("heroScore");
  const sweat = document.getElementById("sweatFx");

  heroFaceImg.className = `hero-face-img ${mood.anim}`;
  setImage(heroFaceImg, getHeroImagePath(style, mood.key), getHeroImagePath("classic", mood.key));

  heroMood.textContent = mood.name;
  heroScore.textContent = score;
  updateHeroMoodColor(mood.key);

  if (mood.key === "concern" || mood.key === "frustration") {
    sweat.classList.remove("hidden");
  } else {
    sweat.classList.add("hidden");
  }

  const coinMoodIconImg = document.getElementById("coinMoodIconImg");
  coinMoodIconImg.className = `mood-icon-img ${mood.anim}`;
  setImage(coinMoodIconImg, getIconImagePath(style, mood.key), getIconImagePath("classic", mood.key));

  document.getElementById("coinMoodLabel").textContent = mood.name;
  document.getElementById("coinMoodScore").textContent = score;

  const socialScore = Math.max(0, Math.min(100, score + 4));
  const socialMood = getMoodByScore(socialScore);

  const socialIconImg = document.getElementById("socialIconImg");
  socialIconImg.className = `mood-icon-img ${socialMood.anim}`;
  setImage(socialIconImg, getIconImagePath(style, socialMood.key), getIconImagePath("classic", socialMood.key));

  document.getElementById("socialMood").textContent = socialMood.name;
  document.getElementById("socialScore").textContent = socialScore;

  const detailSocialIconImg = document.getElementById("detailSocialIconImg");
  detailSocialIconImg.className = `mood-icon-img ${socialMood.anim}`;
  setImage(detailSocialIconImg, getIconImagePath(style, socialMood.key), getIconImagePath("classic", socialMood.key));

  document.getElementById("detailSocialLabel").textContent = socialMood.name;
  document.getElementById("detailSocialScore").textContent = socialScore;

  updateDriverPanel(score);
}

function renderCoins(style) {
  const coinsGrid = document.getElementById("coinsGrid");
  coinsGrid.innerHTML = "";

  topCoins.forEach((coin) => {
    const mood = getMoodByKey(coin.mood);
    const marketCoin = coinPerformanceData[coin.symbol];
    const currentValue = marketCoin ? marketCoin.performance[activeTimeframe] : 0;
    const negative = currentValue < 0;

    const card = document.createElement("button");
    card.className = "coin-card coin-card-button";
    card.type = "button";
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
      updateChartSection(activeCoin, activeTimeframe, style);

      const marketScore = performanceToScore(coinPerformanceData[activeCoin].performance[activeTimeframe]);
      const slider = document.getElementById("scoreSlider");
      slider.value = marketScore;
      slider.style.background = scoreToSliderGradient(marketScore);

      updateHero(marketScore, style);
      refreshOutputs(marketScore);
      renderCoins(style);

      document.querySelector(".chart-card")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    coinsGrid.appendChild(card);
  });
}

function renderScale(style) {
  const scaleGrid = document.getElementById("scaleGrid");
  scaleGrid.innerHTML = "";

  moods.forEach((mood) => {
    const item = document.createElement("div");
    item.className = "scale-item";
    item.innerHTML = `
      <div class="scale-face">
        <img src="${getIconImagePath(style, mood.key)}" alt="${mood.name}" />
      </div>
      <strong>${mood.name}</strong>
    `;
    scaleGrid.appendChild(item);
  });
}

function updateIntervalBoxes(symbol) {
  const perf = coinPerformanceData[symbol].performance;

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
    const el = document.getElementById(id);
    const value = perf[tf];
    el.textContent = formatPercent(value);
    el.className = value >= 0 ? "positive" : "negative";
  });
}

function updateChartSection(symbol, timeframe, style) {
  const coin = coinPerformanceData[symbol];
  const value = coin.performance[timeframe];

  document.getElementById("chartTitle").textContent = `${symbol} / ${coin.name}`;
  document.getElementById("chartChangePill").textContent = formatPercent(value);
  document.getElementById("chartChangePill").className = `pill ${value >= 0 ? "positive" : "negative"}`;
  document.getElementById("selectedTimeframe").textContent = timeframe;
  document.getElementById("selectedPerformance").textContent = formatPercent(value);
  document.getElementById("selectedPerformance").className = value >= 0 ? "positive" : "negative";

  updateIntervalBoxes(symbol);

  const line = document.getElementById("chartLine");
  if (value >= 0) {
    line.style.borderBottomColor = "var(--green)";
    line.style.transform = "skewX(-10deg) translateY(0)";
  } else {
    line.style.borderBottomColor = "var(--red)";
    line.style.transform = "skewX(10deg) translateY(8px)";
  }

  document.querySelectorAll("#chartTimeframes button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.timeframe === timeframe);
  });
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.log("Clipboard not available", error);
  }
}

function refreshOutputs(score) {
  document.getElementById("tweetOutput").value = buildSentimentPost(score);
  document.getElementById("memePromptOutput").value = buildMemePrompt(score);
}

function init() {
  const slider = document.getElementById("scoreSlider");
  const styleSelector = document.getElementById("styleSelector");
  const macroDriver = document.getElementById("macroDriver");
  const heroTimelineButtons = document.querySelectorAll("#heroTimeframes button");

  const tweetOutput = document.getElementById("tweetOutput");
  const memePromptOutput = document.getElementById("memePromptOutput");
  const generateTweetBtn = document.getElementById("generateTweetBtn");
  const generateMemeBtn = document.getElementById("generateMemeBtn");
  const copyTweetBtn = document.getElementById("copyTweetBtn");
  const copyMemeBtn = document.getElementById("copyMemeBtn");

  let currentScore = Number(slider.value);
  let currentStyle = localStorage.getItem("wojakStyle") || "classic";
  let marketScore = Number(slider.value);
  let sliderResetTimeout = null;

  document.body.className = `style-${currentStyle}`;
  styleSelector.value = currentStyle;

  marketScore = performanceToScore(coinPerformanceData[activeCoin].performance[activeTimeframe]);
  currentScore = marketScore;
  slider.value = currentScore;

  renderCoins(currentStyle);
  renderScale(currentStyle);
  updateChartSection(activeCoin, activeTimeframe, currentStyle);
  updateHero(currentScore, currentStyle);
  refreshOutputs(currentScore);

  slider.style.background = scoreToSliderGradient(currentScore);

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
      refreshOutputs(marketScore);
    }, 1500);
  });

  heroTimelineButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tf = btn.dataset.timeframe;
      const coin = coinPerformanceData[activeCoin];
      if (!coin) return;

      activeTimeframe = tf;
      marketScore = performanceToScore(coin.performance[tf]);
      currentScore = marketScore;

      heroTimelineButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      slider.value = marketScore;
      slider.style.background = scoreToSliderGradient(marketScore);

      updateHero(marketScore, currentStyle);
      refreshOutputs(marketScore);
      renderCoins(currentStyle);
    });
  });

  styleSelector.addEventListener("change", () => {
    currentStyle = styleSelector.value;
    localStorage.setItem("wojakStyle", currentStyle);
    document.body.className = `style-${currentStyle}`;

    renderCoins(currentStyle);
    renderScale(currentStyle);
    updateChartSection(activeCoin, activeTimeframe, currentStyle);
    updateHero(Number(document.getElementById("heroScore").textContent || slider.value), currentStyle);
    refreshOutputs(Number(document.getElementById("heroScore").textContent || slider.value));
  });

  macroDriver.addEventListener("change", () => {
    updateDriverPanel(Number(document.getElementById("heroScore").textContent || slider.value));
    refreshOutputs(Number(document.getElementById("heroScore").textContent || slider.value));
  });

  document.querySelectorAll("#chartTimeframes button").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTimeframe = btn.dataset.timeframe;
      updateChartSection(activeCoin, activeTimeframe, currentStyle);
      renderCoins(currentStyle);
    });
  });

  generateTweetBtn.addEventListener("click", () => {
    tweetOutput.value = buildSentimentPost(Number(document.getElementById("heroScore").textContent || slider.value));
  });

  generateMemeBtn.addEventListener("click", () => {
    memePromptOutput.value = buildMemePrompt(Number(document.getElementById("heroScore").textContent || slider.value));
  });

  copyTweetBtn.addEventListener("click", () => {
    copyText(tweetOutput.value);
  });

  copyMemeBtn.addEventListener("click", () => {
    copyText(memePromptOutput.value);
  });
}

document.addEventListener("DOMContentLoaded", init);