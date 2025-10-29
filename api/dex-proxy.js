// /api/dex-proxy.js - Zuverlässiger Proxy für DexScreener (keine Blockierung!)
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const type = req.query.type || 'trending';
  const limit = req.query.limit || '50';
  
  // DexScreener Endpoints (offizielle, öffentliche API)
  const endpoints = {
    trending: `https://api.dexscreener.com/latest/dex/trending?limit=${limit}`,
    solana: `https://api.dexscreener.com/latest/dex/pairs/solana`,
    new: `https://api.dexscreener.com/latest/dex/pairs/solana?sort=created&order=desc&limit=${limit}`
  };

  const endpoint = endpoints[type] || endpoints.trending;

  try {
    console.log(`📊 Fetching from DexScreener: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; PumpTracker/1.0)'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`DexScreener API returned ${response.status}`);
    }

    const data = await response.json();
    
    // DexScreener liefert Daten in unterschiedlichen Formaten
    const pairs = data.pairs || data;
    
    return res.status(200).json({
      success: true,
      source: 'DexScreener',
      count: Array.isArray(pairs) ? pairs.length : 1,
      data: pairs
    });

  } catch (error) {
    console.error('DexScreener error:', error);
    return res.status(500).json({ 
      error: 'DexScreener API failed', 
      details: error.message,
      endpoint: endpoint
    });
  }
}
