const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
    }
  });
}

function getChangeForTimeframe(coins, timeframe) {
  const values = coins.map(coin => {
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
      default: return h1;
    }
  });

  return values.reduce((a, b) => a + b, 0) / values.length;
}

function scoreFromChange(change) {
  return Math.max(0, Math.min(100, Math.round(50 + change * 10)));
}

async function cgFetch(path) {
  const headers = { accept: "application/json" };
  const apiKey = process.env.CG_API_KEY;
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  const res = await fetch(`${COINGECKO_BASE}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`CoinGecko error ${res.status}`);
  }
  return res.json();
}

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "1h";

    const [globalRes, coins] = await Promise.all([
      cgFetch("/global"),
      cgFetch("/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&sparkline=false&price_change_percentage=1h,24h,7d")
    ]);

    const change = getChangeForTimeframe(coins, timeframe);
    const score = scoreFromChange(change);

    return json({
      timeframe,
      change,
      score,
      global: globalRes.data
    });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
