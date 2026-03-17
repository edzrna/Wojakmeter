const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

const chartRanges = {
  "1m": { days: 0.03, points: 12 },
  "5m": { days: 0.03, points: 24 },
  "15m": { days: 0.2, points: 32 },
  "1h": { days: 1, points: 48 },
  "4h": { days: 7, points: 56 },
  "24h": { days: 7, points: 84 },
  "7d": { days: 30, points: 120 }
};

export default async function handler(req, res) {
  try {
    const coin = req.query.coin || "bitcoin";
    const timeframe = req.query.timeframe || "1h";
    const range = chartRanges[timeframe] || chartRanges["1h"];
    const interval = range.days <= 1 ? "minutely" : "hourly";

    const headers = {
      accept: "application/json"
    };

    if (process.env.CG_API_KEY) {
      headers["x-cg-demo-api-key"] = process.env.CG_API_KEY;
    }

    const url = `${COINGECKO_BASE}/coins/${coin}/market_chart?vs_currency=usd&days=${range.days}&interval=${interval}`;

    const response = await fetch(url, { headers });
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        error: text || "CoinGecko failed"
      });
    }

    const data = JSON.parse(text);
    const prices = (data.prices || []).map(item => item[1]).slice(-range.points);

    return res.status(200).json({
      ok: true,
      coin,
      timeframe,
      prices
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}