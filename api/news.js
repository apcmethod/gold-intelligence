export default async function handler(req, res) {
  try {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "ALPHAVANTAGE_API_KEY no configurada"
      });
    }

    const url =
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT` +
      `&tickers=FOREX:USD` +
      `&topics=financial_markets,economy_monetary,economy_fiscal,economy_macro` +
      `&sort=LATEST` +
      `&limit=10` +
      `&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.Information || data.Note) {
      return res.status(429).json({
        error: "Alpha Vantage limit",
        message: data.Information || data.Note
      });
    }

    const feed = data.feed || [];

    const items = feed.map(article => ({
      title: article.title,
      link: article.url,
      published: article.time_published,
      source: article.source,
      summary: article.summary,
      sentiment: article.overall_sentiment_label,
      sentimentScore: article.overall_sentiment_score,
      relevance: article.ticker_sentiment?.find(
        x => x.ticker === "FOREX:USD"
      )?.relevance_score || null
    }));

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );

    return res.status(200).json({
      status: "ok",
      count: items.length,
      items
    });

  } catch (error) {
    return res.status(500).json({
      error: "NEWS_API_ERROR",
      message: error.message
    });
  }
}
