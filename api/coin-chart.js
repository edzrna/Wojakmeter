export default async function handler(req, res) {
  try {
    const { coin = "bitcoin", timeframe = "1h" } = req.query;

    let days = 1;
    let interval = "hourly";

    // 🔥 MAPEO CORRECTO PARA COINGECKO
    if (timeframe === "1m" || timeframe === "5m" || timeframe === "15m") {
      days = 1;
      interval = "hourly";
    } 
    else if (timeframe === "1h" || timeframe === "4h") {
      days = 1;
      interval = "hourly";
    } 
    else if (timeframe === "24h") {
      days = 1;
      interval = "hourly";
    } 
    else if (timeframe === "7d") {
      days = 7;
      interval = "daily";
    }

    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.prices) {
      return res.status(500).json({ ok: false, error: "Invalid data from CoinGecko" });
    }

    const prices = data.prices.map(p => p[1]);

    res.status(200).json({
      ok: true,
      prices
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "CoinGecko failed"
    });
  }
}