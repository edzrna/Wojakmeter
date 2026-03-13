const moods = [
  { name: "Euphoria", score: 90, emoji: "🤩", anim: "anim-pulse" },
  { name: "Content", score: 75, emoji: "😌", anim: "anim-float" },
  { name: "Optimism", score: 60, emoji: "😊", anim: "anim-float" },
  { name: "Neutral", score: 45, emoji: "😐", anim: "anim-blink" },
  { name: "Doubt", score: 30, emoji: "🤨", anim: "anim-tilt" },
  { name: "Concern", score: 15, emoji: "😟", anim: "anim-shake" },
  { name: "Frustration", score: 0, emoji: "😡", anim: "anim-shake" }
];

const topCoins = [
  { symbol: "BTC", price: "$67,240", change: "+2.1%", mood: 2 },
  { symbol: "ETH", price: "$3,420", change: "+1.4%", mood: 2 },
  { symbol: "SOL", price: "$182", change: "+4.8%", mood: 0 },
  { symbol: "XRP", price: "$0.63", change: "-0.8%", mood: 4 },
  { symbol: "BNB", price: "$590", change: "+1.9%", mood: 1 },
  { symbol: "ADA", price: "$0.48", change: "-1.1%", mood: 4 },
  { symbol: "DOGE", price: "$0.12", change: "+3.6%", mood: 1 },
  { symbol: "TON", price: "$6.10", change: "+0.7%", mood: 2 },
  { symbol: "AVAX", price: "$41", change: "-2.3%", mood: 5 },
  { symbol: "TRX", price: "$0.13", change: "+0.4%", mood: 3 }
];

const styleEmojiMap = {
  classic: ["🤩","😌","😊","😐","🤨","😟","😡"],
  "3d": ["🟢","🟩","💚","⚪","🟠","🔴","❤️"],
  anime: ["✨","🌸","🌼","◕_◕","❓","💧","💢"],
  minimal: ["●","◐","◔","○","◌","◍","⬤"]
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

function getMoodIndex(score) {
  for (let i = 0; i < moods.length; i++) {
    if (score >= moods[i].score) return i;
  }
  return moods.length - 1;
}

function getStyleFace(index, style) {
  const map = styleEmojiMap[style] || styleEmojiMap.classic;
  return map[index] || moods[index].emoji;
}

function getCurrentMacro() {
  const macroKey = document.getElementById("macroDriver").value;
  return macroDrivers[macroKey];
}

function buildSentimentPost(score, style) {
  const moodIndex = getMoodIndex(score);
  const mood = moods[moodIndex];
  const face = getStyleFace(moodIndex, style);
  const macro = getCurrentMacro();

  return `🚨 WojakMeter Alert

Market Mood: ${mood.name} ${face}
Score: ${score}/100
BTC: +2.1%
Social Mood: ${document.getElementById("socialMood").textContent}
Macro Driver: ${macro.label}

Narrative:
${macro.narrative}

#WojakMeter #Crypto #Bitcoin`;
}

function buildMemePrompt(score, style) {
  const moodIndex = getMoodIndex(score);
  const mood = moods[moodIndex];
  const socialMood = document.getElementById("socialMood").textContent;
  const macro = getCurrentMacro();

  return `Create a high-quality meme-style crypto image based on the current market context.

Selected visual style: ${style}
Technical mood: ${mood.name}
Social mood: ${socialMood}
Macro driver: ${macro.label}
Macro narrative: ${macro.narrative}
BTC move reference: +2.1%

Main scene:
- A Wojak-inspired character reacting in ${mood.name.toLowerCase()} mode
- A crypto trading dashboard in the background
- Bitcoin price action visible
- Visual hints of ${macro.label.toLowerCase()}
- Emotional expression must match ${mood.name}
- Composition must feel native to crypto Twitter / X
- Image should be dramatic, clean, readable, and shareable

Bottom-right branding:
- Add the website text: "wojakmeter.com"
- Add the X account text: "@WojakMeter"
- Add the X logo beside "@WojakMeter"
- Put all branding in the bottom-right corner
- Use the same digital elegant typography style as the website
- Font style should feel similar to Space Grotesk / Rajdhani aesthetic
- Branding should be subtle, premium, sharp, and fully readable
- Keep the website and X handle aligned visually
- Make the branding look integrated into the image UI, not like random pasted text
- Do not let the branding overpower the main image
- Keep the logo and text crisp and social-media-ready

Tone:
viral, crypto-native, meme-friendly, market-aware, contextual, social-media-ready.`;
}

function updateDriverPanel(score) {
  const technicalMood = moods[getMoodIndex(score)].name;
  const socialMood = document.getElementById("socialMood").textContent;
  const macro = getCurrentMacro();

  document.getElementById("driverTechnical").textContent = technicalMood;
  document.getElementById("driverSocial").textContent = socialMood;
  document.getElementById("driverMacro").textContent = macro.label;
  document.getElementById("driverNarrative").textContent = macro.narrative;
}

function updateHero(score, style) {
  const moodIndex = getMoodIndex(score);
  const mood = moods[moodIndex];
  const face = getStyleFace(moodIndex, style);

  const heroFace = document.getElementById("heroFace");
  const heroMood = document.getElementById("heroMood");
  const heroScore = document.getElementById("heroScore");
  const sweat = document.getElementById("sweatFx");
  const brandBadge = document.getElementById("brandBadge");

  heroFace.textContent = face;
  heroFace.className = `hero-face ${mood.anim}`;
  heroMood.textContent = mood.name;
  heroScore.textContent = score;
  brandBadge.textContent = face;

  if (mood.name === "Concern" || mood.name === "Frustration") {
    sweat.classList.remove("hidden");
  } else {
    sweat.classList.add("hidden");
  }

  document.getElementById("coinMoodIcon").textContent = face;
  document.getElementById("coinMoodIcon").className = `mood-icon ${mood.anim}`;
  document.getElementById("coinMoodLabel").textContent = mood.name;
  document.getElementById("coinMoodScore").textContent = score;

  const socialScore = Math.max(0, Math.min(100, score + 4));
  const socialMoodIndex = getMoodIndex(socialScore);
  const socialMood = moods[socialMoodIndex];
  const socialFace = getStyleFace(socialMoodIndex, style);

  document.getElementById("socialIcon").textContent = socialFace;
  document.getElementById("socialIcon").className = `social-icon ${socialMood.anim}`;
  document.getElementById("socialMood").textContent = socialMood.name;
  document.getElementById("socialScore").textContent = socialScore;

  document.getElementById("detailSocialIcon").textContent = socialFace;
  document.getElementById("detailSocialIcon").className = `mood-icon ${socialMood.anim}`;
  document.getElementById("detailSocialLabel").textContent = socialMood.name;
  document.getElementById("detailSocialScore").textContent = socialScore;

  updateDriverPanel(score);
}

function renderCoins(style) {
  const coinsGrid = document.getElementById("coinsGrid");
  coinsGrid.innerHTML = "";

  topCoins.forEach((coin) => {
    const mood = moods[coin.mood];
    const emoji = getStyleFace(coin.mood, style);
    const negative = coin.change.includes("-");

    const card = document.createElement("div");
    card.className = "coin-card";
    card.innerHTML = `
      <div>
        <div class="symbol">${coin.symbol}</div>
        <div class="price">${coin.price}</div>
        <div class="change ${negative ? "negative" : "positive"}">${coin.change}</div>
      </div>
      <div class="coin-emoji ${mood.anim}">
        ${emoji}
      </div>
    `;
    coinsGrid.appendChild(card);
  });
}

function renderScale(style) {
  const scaleGrid = document.getElementById("scaleGrid");
  scaleGrid.innerHTML = "";

  moods.forEach((mood, index) => {
    const face = getStyleFace(index, style);

    const item = document.createElement("div");
    item.className = "scale-item";
    item.innerHTML = `
      <div class="scale-face ${mood.anim}">
        ${face}
      </div>
      <strong>${mood.name}</strong>
    `;
    scaleGrid.appendChild(item);
  });
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.log("Clipboard not available", error);
  }
}

function refreshOutputs(score, style) {
  document.getElementById("tweetOutput").value = buildSentimentPost(score, style);
  document.getElementById("memePromptOutput").value = buildMemePrompt(score, style);
}

function init() {
  const slider = document.getElementById("scoreSlider");
  const styleSelector = document.getElementById("styleSelector");
  const macroDriver = document.getElementById("macroDriver");

  const tweetOutput = document.getElementById("tweetOutput");
  const memePromptOutput = document.getElementById("memePromptOutput");
  const generateTweetBtn = document.getElementById("generateTweetBtn");
  const generateMemeBtn = document.getElementById("generateMemeBtn");
  const copyTweetBtn = document.getElementById("copyTweetBtn");
  const copyMemeBtn = document.getElementById("copyMemeBtn");

  let currentScore = Number(slider.value);
  let currentStyle = localStorage.getItem("wojakStyle") || "classic";

  document.body.className = `style-${currentStyle}`;
  styleSelector.value = currentStyle;

  updateHero(currentScore, currentStyle);
  renderCoins(currentStyle);
  renderScale(currentStyle);
  refreshOutputs(currentScore, currentStyle);

  slider.addEventListener("input", () => {
    currentScore = Number(slider.value);
    updateHero(currentScore, currentStyle);
    refreshOutputs(currentScore, currentStyle);
  });

  styleSelector.addEventListener("change", () => {
    currentStyle = styleSelector.value;
    localStorage.setItem("wojakStyle", currentStyle);
    document.body.className = `style-${currentStyle}`;
    updateHero(currentScore, currentStyle);
    renderCoins(currentStyle);
    renderScale(currentStyle);
    refreshOutputs(currentScore, currentStyle);
  });

  macroDriver.addEventListener("change", () => {
    updateDriverPanel(currentScore);
    refreshOutputs(currentScore, currentStyle);
  });

  generateTweetBtn.addEventListener("click", () => {
    tweetOutput.value = buildSentimentPost(currentScore, currentStyle);
  });

  generateMemeBtn.addEventListener("click", () => {
    memePromptOutput.value = buildMemePrompt(currentScore, currentStyle);
  });

  copyTweetBtn.addEventListener("click", () => {
    copyText(tweetOutput.value);
  });

  copyMemeBtn.addEventListener("click", () => {
    copyText(memePromptOutput.value);
  });
}

document.addEventListener("DOMContentLoaded", init);