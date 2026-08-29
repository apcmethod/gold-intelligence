export default async function handler(req, res) {
  try {
    const apiKey = process.env.FRED_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "FRED_API_KEY no configurada"
      });
    }

    const url =
      "https://api.stlouisfed.org/fred/series/observations" +
      "?series_id=DGS10" +
      "&api_key=" + encodeURIComponent(apiKey) +
      "&file_type=json" +
      "&sort_order=desc" +
      "&limit=30";

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "FRED respondió con un error"
      });
    }

    const data = await response.json();

    const observations = (data.observations || [])
      .filter(item => item.value !== ".")
      .map(item => ({
        date: item.date,
        value: Number(item.value)
      }));

    return res.status(200).json({
      series: "DGS10",
      name: "US 10-Year Treasury",
      latest: observations[0] || null,
      observations
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error obteniendo US10Y",
      message: error.message
    });
  }
}
