export default async function handler(req, res) {
  try {
    const { coin = "bitcoin", timeframe = "1h" } = req.query;

    let days = timeframe === "7d" ? 7 : 1;

    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`;

    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "user-agent": "Mozilla/5.0 (WojakMeter)"
      }
    });

    const data = await response.json();

    // 🔥 DEBUG CLAVE
    if (!data || !data.prices) {
      return res.status(200).json({
        ok: false,
        debug: "NO_PRICES",
        received: data
      });
    }

    const prices = data.prices.map(p => p[1]);

    return res.status(200).json({
      ok: true,
      prices
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}