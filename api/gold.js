export default async function handler(req, res) {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "TWELVE_DATA_API_KEY no configurada"
      });
    }

    const url =
      "https://api.twelvedata.com/price" +
      "?symbol=XAU/USD" +
      "&apikey=" + encodeURIComponent(apiKey);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status === "error") {
      return res.status(response.status || 500).json({
        error: data.message || "Error obteniendo precio del oro"
      });
    }

    return res.status(200).json({
      symbol: "XAU/USD",
      price: Number(data.price),
      source: "Twelve Data",
      retrieved_at: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error obteniendo GOLD",
      message: error.message
    });
  }
}
