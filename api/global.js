export default async function handler(req, res) {
  try {
    const url = "https://api.coingecko.com/api/v3/global";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("CoinGecko failed");
    }

    const data = await response.json();

    res.status(200).json({
      ok: true,
      data: data.data
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}