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

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240"
    }
  });
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
    const coin = searchParams.get("coin") || "bitcoin";
    const timeframe = searchParams.get("timeframe") || "1h";
    const range = chartRanges[timeframe] || chartRanges["1h"];
    const interval = range.days <= 1 ? "minutely" : "hourly";

    const data = await cgFetch(
      `/coins/${coin}/market_chart?vs_currency=usd&days=${range.days}&interval=${interval}`
    );

    const prices = (data.prices || []).map(item => item[1]).slice(-range.points);

    return json({ coin, timeframe, prices });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
