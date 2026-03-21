import Head from "next/head";
import Script from "next/script";

const htmlContent = `
<div class="app-shell">
  <header class="topbar cardless" id="market">
    <div class="topbar-left">
      <img src="/assets/logo/wojakmeter_logo.png" alt="WojakMeter Logo" class="logo-img">
    </div>

    <div class="topbar-right-group">
      <div class="topbar-center">
        <div class="market-stat">BTC.D <strong id="btcDominance">--</strong></div>
        <div class="market-stat">Market Cap <strong id="headerMarketCap">--</strong></div>
        <div class="market-stat">24H Volume <strong id="headerVolume">--</strong></div>
      </div>

      <div class="topbar-right">
        <label class="style-label" for="styleSelector">Wojak Style</label>
        <select id="styleSelector">
          <option value="classic" selected>Classic</option>
          <option value="3d">3D</option>
          <option value="anime">Anime</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>
    </div>
  </header>

  <div class="ticker-bar" id="tickerBar">
    <span>Loading market...</span>
  </div>

  <main class="dashboard">
    <section class="hero card">
      <h2>CRYPTO MARKET MOOD</h2>

      <div class="hero-grid hero-grid-single">
        <div class="hero-main">
          <div class="wojak-stage">
            <div class="sweat hidden" id="sweatFx">💧</div>

            <div class="hero-social-badge" aria-label="Social sentiment">
              <div class="hero-social-badge-label">𝕏</div>
              <div class="hero-social-badge-icon">
                <img
                  id="socialIconImg"
                  class="mood-icon-img anim-float"
                  src="/assets/icons/classic/neutral.png"
                  alt="Social mood icon"
                />
              </div>
              <div class="hero-social-badge-text">
                <span id="socialMoodMini">Neutral</span>
                <strong id="socialScoreMini">50</strong>
              </div>
            </div>

            <img
              id="heroFaceImg"
              class="hero-face-img anim-float"
              src="/assets/hero/classic/neutral.png"
              alt="Global market mood"
            />
          </div>

          <div class="hero-mood mood-neutral" id="heroMood">Neutral</div>

          <div class="hero-score" id="heroScoreWrap">
            Score: <span id="heroScore">50</span> / 100
          </div>

          <div class="heartbeat-wrap" id="heartbeatWrap">
            <div class="heartbeat-heart" id="heartbeatHeart">❤</div>
            <div class="heartbeat-chart">
              <svg viewBox="0 0 320 56" preserveAspectRatio="none" aria-hidden="true">
                <path id="heartbeatPath" d=""></path>
              </svg>
            </div>
          </div>

          <section class="emotion-bar-inline" id="emotionBarSection">
            <div class="section-head section-head-tight">
              <h3>WOJAKMETER BAR</h3>
            </div>

            <div class="emotion-track-wrap">
              <div class="emotion-track" id="emotionTrack">
                <div class="emotion-segment seg-frustration">Frustration</div>
                <div class="emotion-segment seg-concern">Concern</div>
                <div class="emotion-segment seg-doubt">Doubt</div>
                <div class="emotion-segment seg-neutral">Neutral</div>
                <div class="emotion-segment seg-optimism">Optimism</div>
                <div class="emotion-segment seg-content">Content</div>
                <div class="emotion-segment seg-euphoria">Euphoria</div>

                <div class="emotion-pointer" id="emotionPointer" aria-label="WojakMeter indicator">
                  <div class="emotion-pointer-arrow"></div>
                  <div class="emotion-pointer-face">
                    <img
                      id="emotionPointerImg"
                      src="/assets/icons/classic/neutral.png"
                      alt="Current emotional state"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="emotion-meta">
              <div class="emotion-meta-box">
                <span>Current Mood</span>
                <strong id="emotionBarMood">Neutral</strong>
              </div>

              <div class="emotion-meta-box">
                <span>Score</span>
                <strong id="emotionBarScore">50</strong>
              </div>

              <div class="emotion-meta-box">
                <span>Range</span>
                <strong id="emotionBarRange">45–59</strong>
              </div>
            </div>
          </section>

          <div class="hero-market-line">
            <div class="hero-line-item">
              <span>Market Change</span>
              <strong id="globalMarketChange">--</strong>
            </div>
            <div class="hero-line-sep"></div>
            <div class="hero-line-item">
              <span>Volume</span>
              <strong id="globalMarketVolume" class="header-accent">--</strong>
            </div>
            <div class="hero-line-sep"></div>
            <div class="hero-line-item">
              <span>Timeframe</span>
              <strong id="globalMarketTimeframe">1h</strong>
            </div>
          </div>

          <div class="hero-share-row">
            <button id="shareMoodBtn" class="action-btn share-x-btn" type="button">
              Share mood on X
            </button>
          </div>

          <div class="timeframes hero-timeframes" id="heroTimeframes">
            <button data-timeframe="1m">1m</button>
            <button data-timeframe="5m">5m</button>
            <button data-timeframe="15m">15m</button>
            <button data-timeframe="1h" class="active">1h</button>
            <button data-timeframe="4h">4h</button>
            <button data-timeframe="24h">24h</button>
            <button data-timeframe="7d">7d</button>
          </div>
        </div>

        <section class="drivers-card card">
          <div class="section-head">
            <h3>MARKET DRIVERS</h3>
          </div>

          <div class="drivers-controls">
            <label for="macroDriver">Main macro driver</label>
            <select id="macroDriver">
              <option value="market_flow">Market flow / price action</option>
              <option value="etf_adoption">ETF / institutional adoption</option>
              <option value="rate_hike">Rate hike fears</option>
              <option value="rate_cut">Rate cut hopes</option>
              <option value="regulation_crackdown">Regulation crackdown</option>
              <option value="crypto_hack">Crypto hack / insolvency</option>
              <option value="war_escalation">War escalation</option>
              <option value="neutral_macro">Neutral macro environment</option>
            </select>
          </div>

          <div class="driver-list">
            <div class="driver-item">
              <span>Macro Driver</span>
              <strong id="driverMacro">Market flow / price action</strong>
            </div>

            <div class="driver-item">
              <span>Main Narrative</span>
              <strong id="driverNarrative">Waiting for live market data.</strong>
            </div>

            <div class="driver-item">
              <span>Timeframe Reaction</span>
              <strong id="driverTimeframeReaction">Balanced reaction</strong>
            </div>

            <div class="driver-item">
              <span>Risk Tone</span>
              <strong id="driverRiskTone">Neutral</strong>
            </div>
          </div>
        </section>
      </div>
    </section>

    <section class="top-coins card" id="top-coins">
      <div class="section-head">
        <h3>MARKET SECTIONS</h3>
        <span class="muted">Live market overview</span>
      </div>

      <div class="tabs-row" id="marketTabs">
        <button class="tab-btn active" data-tab="coins">Top 10 Coins</button>
        <button class="tab-btn" data-tab="trending">Trending Coins 🔥</button>
        <button class="tab-btn" data-tab="memes">Top Meme Coins</button>
      </div>

      <div class="tab-panel active" id="tab-coins">
        <div class="coins-grid" id="coinsGrid"></div>
      </div>

      <div class="tab-panel" id="tab-trending">
        <div class="coins-grid" id="trendingGrid"></div>
      </div>

      <div class="tab-panel" id="tab-memes">
        <div class="coins-grid" id="memesGrid"></div>
      </div>
    </section>

    <section class="detail-grid detail-grid-single">
      <section class="chart-card card">
        <div class="chart-topbar">
          <div class="