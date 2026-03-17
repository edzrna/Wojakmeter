const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "ripple",
  "binancecoin",
  "cardano",
  "dogecoin",
  "the-open-network",
  "avalanche-2",
  "tron"
];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
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

export default async function handler() {
  try {
    const coins = await cgFetch(
      `/coins/markets?vs_currency=usd&ids=${IDS.join(",")}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h,7d`
    );

    return json({ coins });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
