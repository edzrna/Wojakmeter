const demoStates = [
  {
    mood: "Content",
    btc: "+2.1%",
    macro: "Rate cut hopes",
    social: "Content",
    risk: "Balanced",
    narrativeTitle: "Rate cut hopes",
    narrativeText:
      "Liquidity optimism improves appetite for risk assets and keeps sentiment stable.",
    pillClass: "neutral",
    ticker: ["BTC +2.1%", "Liquidity optimism", "Memes turning bullish"]
  },
  {
    mood: "Alert",
    btc: "-1.4%",
    macro: "War escalation",
    social: "Concerned",
    risk: "Elevated",
    narrativeTitle: "War escalation",
    narrativeText:
      "Geopolitical tension pushes risk sentiment lower and raises uncertainty across markets.",
    pillClass: "neutral",
    ticker: ["BTC -1.4%", "Risk-off tone", "Geopolitical headlines"]
  },
  {
    mood: "Euphoric",
    btc: "+5.8%",
    macro: "ETF flows",
    social: "Bullish",
    risk: "Aggressive",
    narrativeTitle: "ETF flows",
    narrativeText:
      "Strong inflows and broad participation drive a faster upside move across majors.",
    pillClass: "neutral",
    ticker: ["BTC +5.8%", "Altcoins waking up", "Crypto Twitter full send"]
  }
];

let index = 0;

const refs = {
  moodPill: document.getElementById("moodPill"),
  btcMove: document.getElementById("btcMove"),
  macroDriver: document.getElementById("macroDriver"),
  socialMood: document.getElementById("socialMood"),
  riskMode: document.getElementById("riskMode"),
  macroNarrativeTitle: document.getElementById("macroNarrativeTitle"),
  macroNarrativeText: document.getElementById("macroNarrativeText"),
  ticker: document.querySelector(".ticker"),
};

function renderState(state) {
  refs.moodPill.textContent = state.mood;
  refs.btcMove.textContent = state.btc;
  refs.macroDriver.textContent = state.macro;
  refs.socialMood.textContent = state.social;
  refs.riskMode.textContent = state.risk;
  refs.macroNarrativeTitle.textContent = state.narrativeTitle;
  refs.macroNarrativeText.textContent = state.narrativeText;
  refs.ticker.innerHTML = state.ticker.map((item) => `<span>${item}</span>`).join("");
}

setInterval(() => {
  index = (index + 1) % demoStates.length;
  renderState(demoStates[index]);
}, 3500);
