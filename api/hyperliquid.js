// api/hyperliquid.js
export default async function handler(req, res) {
  // CORS erlauben
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS Request für Preflight handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { asset, address, endpoint } = req.query;
    
    let url = '';
    
    // Unterschiedliche Endpoints handhaben
    if (endpoint === 'trades') {
      url = `https://api.hyperliquid.xyz/api/v1/trades?coin=${asset || 'ETH'}`;
    } else if (endpoint === 'userFills') {
      url = `https://api.hyperliquid.xyz/api/v1/userFills?user=${address}`;
    } else if (endpoint === 'meta') {
      url = `https://api.hyperliquid.xyz/api/v1/meta`;
    } else {
      return res.status(400).json({ error: 'Invalid endpoint' });
    }

    console.log('Fetching from Hyperliquid:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Sicherstellen dass wir immer ein Array zurückgeben
    const result = Array.isArray(data) ? data : [data];
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Hyperliquid API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from Hyperliquid',
      message: error.message 
    });
  }
}