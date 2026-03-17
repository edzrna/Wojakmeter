export default async function handler(req, res) {
  try {
    const { coin = "bitcoin", timeframe = "1h" } = req.query;

    let days = 1;

    if (timeframe === "1m" || timeframe === "5m" || timeframe === "15m") {
      days = 1;
    } else if (timeframe === "1h" || timeframe === "4h") {
      days = 1;
    } else if (timeframe === "24h") {
      days = 1;
    } else if (timeframe === "7d") {
      days = 7;
    }

    const headers = {
      accept: "application/json"
    };

    if (process.env.CG_API_KEY) {
      headers["x-cg-demo-api-key"] = process.env.CG_API_KEY;
    }

    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`;

    const response = await fetch(url, { headers });
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        error: text || "CoinGecko failed"
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        ok: false,
        error: "CoinGecko returned invalid JSON",
        raw: text
      });
    }

    if (!data || !Array.isArray(data.prices)) {
      return res.status(500).json({
        ok: false,
        error: "Invalid data from CoinGecko",
        raw: data
      });
    }

    const prices = data.prices.map(item => item[1]);

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