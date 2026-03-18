const REFRESH_MS = 300000; // 5 minutos

const moods = [
  { key: "euphoria", name: "Euphoria", min: 85, anim: "anim-pulse", range: "85–100" },
  { key: "content", name: "Content", min: 70, anim: "anim-float", range: "70–84" },
  { key: "optimism", name: "Optimism", min: 60, anim: "anim-float", range: "60–69" },
  { key: "neutral", name: "Neutral", min: 45, anim: "anim-blink", range: "45–59" },
  { key: "doubt", name: "Doubt", min: 35, anim: "anim-tilt", range: "35–44" },
  { key: "concern", name: "Concern", min: 20, anim: "anim-shake", range: "20–34" },
  { key: "frustration", name: "Frustration", min: 0, anim: "anim-shake", range: "0–19" }
];

let activeCoinSymbol = "BTC";
let globalTimeframe = "1h";
let chartTimeframe = "1h";
let topCoinsData = [];
let currentGlobalMood = getMoodByScore(50);

function byId(id) {
  return document.getElementById(id);
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
  return Math.round(clamp(50 + change * 10, 0, 100));
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

function debugMessage(msg) {
  console.log("[WojakMeter]", msg);
  const ticker = byId("tickerBar");
  if (ticker) {
    ticker.innerHTML = `<span>${msg}</span>`;
  }
}

function updateTickerBar() {
  const ticker = byId("tickerBar");
  if (!ticker || !topCoinsData.length) return;

  ticker.innerHTML = topCoinsData
    .slice(0, 7)
    .map(coin => `<span>${coin.symbol.toUpperCase()} <strong>${formatCurrency(coin.current_price)}</strong></span>`)
    .join("");
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    if (!res.ok) {
      throw new Error(`${url} -> ${res.status} ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      throw new Error(`${url} -> invalid JSON: ${text}`);
    }
  } catch (error) {
    console.error("fetchJson error:", error);
    throw error;
  }
}

function updateHero(score, mood) {
  const style = getCurrentStyle();
  const heroMood = byId("heroMood");
  const heroScore = byId("heroScore");
  const heroFaceImg = byId("heroFaceImg");
  const emotionBarMood = byId("emotionBarMood");
  const emotionBarScore = byId("emotionBarScore");
  const emotionBarRange = byId("emotionBarRange");
  const emotionPointer = byId("emotionPointer");
  const emotionPointerImg = byId("emotionPointerImg");
  const heartbeatWrap = byId("heartbeatWrap");
  const heartbeatPath = byId("heartbeatPath");

  if (heroMood) {
    heroMood.textContent = mood.name;
    heroMood.className = `hero-mood mood-${mood.key}`;
  }

  if (heroScore) {
    heroScore.textContent = score;
  }

  if (heroFaceImg) {
    heroFaceImg.className = `hero-face-img ${mood.anim}`;
    setImage(
      heroFaceImg,
      getHeroImagePath(style, mood.key),
      getHeroImagePath("classic", mood.key)
    );
  }

  if (emotionBarMood) emotionBarMood.textContent = mood.name;
  if (emotionBarScore) emotionBarScore.textContent = score;
  if (emotionBarRange) emotionBarRange.textContent = mood.range;

  if (emotionPointer) {
    emotionPointer.style.left = `${clamp(score, 0, 100)}%`;
  }

  if (emotionPointerImg) {
    setImage(
      emotionPointerImg,
      getIconImagePath(style, mood.key),
      getIconImagePath("classic", mood.key)
    );
  }

  if (heartbeatWrap && heartbeatPath) {
    heartbeatWrap.className = `heartbeat-wrap heartbeat-${mood.key}`;
    const paths = {
      frustration: "M0 28 L28 28 L40 10 L56 46 L72 8 L86 50 L104 16 L126 28 L150 28 L170 12 L188 44 L206 8 L224 48 L244 20 L268 28 L320 28",
      concern: "M0 28 L40 28 L56 18 L72 40 L88 14 L102 38 L124 28 L160 28 L176 18 L192 38 L208 16 L224 36 L248 28 L320 28",
      doubt: "M0 28 L36 28 L52 22 L66 34 L82 20 L98 32 L120 28 L150 28 L168 22 L186 34 L202 24 L218 30 L250 28 L320 28",
      neutral: "M0 28 L44 28 L56 24 L68 32 L82 24 L96 30 L120 28 L160 28 L180 26 L196 30 L214 26 L234 28 L320 28",
      optimism: "M0 28 L36 28 L52 24 L66 20 L82 34 L98 16 L114 30 L138 28 L160 28 L178 22 L194 18 L210 30 L226 20 L246 28 L320 28",
      content: "M0 28 L32 28 L46 20 L60 34 L74 12 L88 30 L104 18 L126 28 L150 28 L168 20 L184 34 L198 14 L214 28 L232 18 L254 28 L320 28",
      euphoria: "M0 28 L28 28 L40 16 L52 40 L66 8 L78 46 L94 6 L108 42 L126 18 L148 28 L166 12 L182 44 L198 8 L214 42 L232 14 L252 28 L320 28"
    };
    heartbeatPath.setAttribute("d", paths[mood.key] || paths.neutral);
  }
}

function updateSocial(score) {
  const style = getCurrentStyle();
  const socialScore = clamp(score + 4, 0, 100);
  const socialMood = getMoodByScore(socialScore);

  if (byId("socialMood")) byId("socialMood").textContent = socialMood.name;
  if (byId("socialScore")) byId("socialScore").textContent = socialScore;
  if (byId("socialPositive")) byId("socialPositive").textContent = `${clamp(Math.round(50 + score / 2), 10, 95)}%`;
  if (byId("socialNegative")) byId("socialNegative").textContent = `${clamp(100 - clamp(Math.round(50 + score / 2), 10, 95) - 8, 2, 80)}%`;
  if (byId("socialMentions")) byId("socialMentions").textContent = `${(2 + score / 12).toFixed(1)}K`;

  const socialIconImg = byId("socialIconImg");
  if (socialIconImg) {
    socialIconImg.className = `mood-icon-img ${socialMood.anim}`;
    setImage(
      socialIconImg,
      getIconImagePath(style, socialMood.key),
      getIconImagePath("classic", socialMood.key)
    );
  }

  if (byId("driverTechnical")) byId("driverTechnical").textContent = getMoodByScore(score).name;
  if (byId("driverSocial")) byId("driverSocial").textContent = socialMood.name;
}

async function loadGlobalMarket() {
  const response = await fetchJson(`/api/global?timeframe=${encodeURIComponent(globalTimeframe)}`);
  const globalData = response?.data || response?.global || response;

  if (!globalData) {
    throw new Error("Global API returned no usable data");
  }

  if (byId("btcDominance") && globalData.market_cap_percentage?.btc != null) {
    byId("btcDominance").textContent = `${globalData.market_cap_percentage.btc.toFixed(1)}%`;
  }

  if (byId("headerMarketCap")) {
    byId("headerMarketCap").textContent = formatCurrencyCompact(globalData.total_market_cap?.usd);
  }

  if (byId("headerVolume")) {
    byId("headerVolume").textContent = formatCurrencyCompact(globalData.total_volume?.usd);
  }

  const marketCapChange = globalData.market_cap_change_percentage_24h_usd ?? 0;
  const score = scoreFromChange(marketCapChange);
  const mood = getMoodByScore(score);

  currentGlobalMood = mood;

  updateHero(score, mood);
  updateSocial(score);

  if (byId("globalMarketChange")) {
    byId("globalMarketChange").textContent = formatPercent(marketCapChange);
    byId("globalMarketChange").className = marketCapChange >= 0 ? "positive" : "negative";
  }

  if (byId("globalMarketVolume")) {
    byId("globalMarketVolume").textContent = formatCurrencyCompact(globalData.total_volume?.usd);
  }

  if (byId("globalMarketTimeframe")) {
    byId("globalMarketTimeframe").textContent = globalTimeframe;
  }
}

async function loadTopCoins() {
  let response;
try {
  response = await fetchJson("/api/top-coins");
} catch (error) {
  console.warn("Top coins failed, using fallback");
  return;
}
  const coins = response?.coins || response?.data || (Array.isArray(response) ? response : null);

  if (!coins || !coins.length) {
    throw new Error("Top coins API returned no usable data");
  }

  topCoinsData = coins;

  const ticker = byId("tickerBar");
  if (ticker) {
    ticker.innerHTML = topCoinsData.slice(0, 7).map(coin => {
      return `<span>${coin.symbol.toUpperCase()} <strong>${formatCurrency(coin.current_price)}</strong></span>`;
    }).join("");
  }

  const grid = byId("coinsGrid");
  if (!grid) return;

  const style = getCurrentStyle();
  grid.innerHTML = "";

  topCoinsData.forEach(coin => {
    const symbol = coin.symbol.toUpperCase();
    const change = coin.price_change_percentage_24h_in_currency ?? 0;
    const mood = getMoodByScore(scoreFromChange(change));

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

    card.addEventListener("click", async () => {
      activeCoinSymbol = symbol;
      await loadTopCoins();
      await loadCoinDetails();
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

function drawChart(prices) {
  const path = byId("coinChartPath");
  const area = byId("coinChartArea");

  if (!path || !area || !prices || prices.length < 2) {
    throw new Error("Chart elements or prices missing");
  }

  const w = 900;
  const h = 280;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = h - ((price - min) / range) * (h - 20);
    return [x, y];
  });

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const areaPath = `${line} L ${w} ${h} L 0 ${h} Z`;

  path.setAttribute("d", line);
  area.setAttribute("d", areaPath);

  const first = prices[0];
  const last = prices[prices.length - 1];
  const positive = last >= first;

  path.style.stroke = positive ? "var(--green)" : "var(--red)";
  area.style.fill = positive ? "rgba(77,255,136,.08)" : "rgba(255,59,77,.08)";
}

async function loadCoinDetails() {
  const coin = getCoinBySymbol(activeCoinSymbol);
  if (!coin) {
    throw new Error("No active coin found");
  }

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
    setImage(
      coinMoodIcon,
      getIconImagePath(style, mood.key),
      getIconImagePath("classic", mood.key)
    );
  }

  const socialIcon = byId("detailSocialIconImg");
  if (socialIcon) {
    socialIcon.className = `mood-icon-img ${socialMood.anim}`;
    setImage(
      socialIcon,
      getIconImagePath(style, socialMood.key),
      getIconImagePath("classic", socialMood.key)
    );
  }

  const intervalIds = {
    "1m": "perf1m",
    "5m": "perf5m",
    "15m": "perf15m",
    "1h": "perf1h",
    "4h": "perf4h",
    "24h": "perf24h",
    "7d": "perf7d"
  };

  Object.entries(intervalIds).forEach(([tf, id]) => {
    const el = byId(id);
    if (!el) return;
    const v = getCoinChangeForTimeframe(coin, tf);
    el.textContent = formatPercent(v);
    el.className = v >= 0 ? "positive" : "negative";
  });

  document.querySelectorAll("#chartTimeframes button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.timeframe === chartTimeframe);
  });

  const chartResponse = await fetchJson(
    `/api/coin-chart?coin=${encodeURIComponent(coin.id)}&timeframe=${encodeURIComponent(chartTimeframe)}`
  );

  const prices = chartResponse?.prices || chartResponse?.data?.prices;
  if (!Array.isArray(prices) || prices.length < 2) {
    throw new Error("Chart API returned no usable prices");
  }

  drawChart(prices);
}

function refreshOutputs() {
  if (byId("tweetOutput")) {
    byId("tweetOutput").value = `🚨 WojakMeter Alert

Market Mood: ${byId("heroMood")?.textContent || "Neutral"}
Score: ${byId("heroScore")?.textContent || "50"}/100
Global Market: ${byId("globalMarketChange")?.textContent || "--"}
Volume: ${byId("globalMarketVolume")?.textContent || "--"}
Selected Timeframe: ${globalTimeframe}

#WojakMeter #Crypto`;
  }

  if (byId("memePromptOutput")) {
    byId("memePromptOutput").value = `Create a crypto meme based on:
- Global mood: ${byId("heroMood")?.textContent || "Neutral"}
- Global timeframe: ${globalTimeframe}
- Global market move: ${byId("globalMarketChange")?.textContent || "--"}
- Global volume: ${byId("globalMarketVolume")?.textContent || "--"}
- Coin chart selected: ${activeCoinSymbol}
- Coin timeframe: ${chartTimeframe}
- Market heartbeat style: ${currentGlobalMood?.name || "Neutral"}`;
  }
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
      document.querySelectorAll("#heroTimeframes button").forEach(b => {
        b.classList.toggle("active", b.dataset.timeframe === globalTimeframe);
      });
      await loadGlobalMarket();
      refreshOutputs();
    });
  });

  document.querySelectorAll("#chartTimeframes button").forEach(btn => {
    btn.addEventListener("click", async () => {
      chartTimeframe = btn.dataset.timeframe;
      await loadCoinDetails();
      refreshOutputs();
    });
  });

  byId("generateTweetBtn")?.addEventListener("click", refreshOutputs);
  byId("generateMemeBtn")?.addEventListener("click", refreshOutputs);
  byId("copyTweetBtn")?.addEventListener("click", () => copyText(byId("tweetOutput")?.value || ""));
  byId("copyMemeBtn")?.addEventListener("click", () => copyText(byId("memePromptOutput")?.value || ""));

  byId("styleSelector")?.addEventListener("change", async () => {
    const value = byId("styleSelector").value;
    document.body.className = `style-${value}`;
    localStorage.setItem("wojakStyle", value);
    renderScale();
    await loadAll();
  });
}

async function loadAll() {
  debugMessage("Loading live market data...");
  await loadTopCoins();
  await loadGlobalMarket();
  await loadCoinDetails();
  refreshOutputs();

  if (topCoinsData.length && typeof updateTickerBar === "function") {
    updateTickerBar();
  }
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

function initStyle() {
  const savedStyle = localStorage.getItem("wojakStyle") || "classic";
  document.body.className = `style-${savedStyle}`;
  if (byId("styleSelector")) {
    byId("styleSelector").value = savedStyle;
  }
}

async function boot() {
  try {
    initStyle();
    renderScale();
    setupButtons();
    await loadAll();

    setInterval(async () => {
      try {
        await loadAll();
      } catch (error) {
        debugMessage(`Refresh failed: ${error.message}`);
      }
    }, REFRESH_MS);
  } catch (error) {
    debugMessage(`Boot failed: ${error.message}`);
  }
}

function updatePointer(score) {
  const pointer = document.getElementById("emotionPointer");
  const percent = Math.max(0, Math.min(100, score));
  pointer.style.left = `${percent}%`;
}

document.addEventListener("DOMContentLoaded", boot);