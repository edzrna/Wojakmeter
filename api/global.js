const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export default async function handler(req, res) {
  try {
    const headers = {
      accept: "application/json"
    };

    if (process.env.CG_API_KEY) {
      headers["x-cg-demo-api-key"] = process.env.CG_API_KEY;
    }

    const response = await fetch(`${COINGECKO_BASE}/global`, { headers });
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        error: text || "CoinGecko failed"
      });
    }

    const json = JSON.parse(text);

    return res.status(200).json({
      ok: true,
      data: json.data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}