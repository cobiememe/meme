// api/hyperliquid.js
// KORRIGIERTE VERSION - Die richtige Hyperliquid API nutzen!

export default async function handler(req, res) {
  // CORS erlauben
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS Request für Preflight handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { endpoint, user, coin } = req.body || req.query;
    
    // Die RICHTIGE Hyperliquid API URL
    const API_BASE = 'https://api.hyperliquid.xyz/info';
    
    let requestBody = {};
    
    // Unterschiedliche Endpoints handhaben
    if (endpoint === 'userFills') {
      requestBody = {
        type: 'userFills',
        user: user
      };
    } else if (endpoint === 'meta') {
      requestBody = {
        type: 'meta'
      };
    } else if (endpoint === 'allMids') {
      requestBody = {
        type: 'allMids'
      };
    } else if (endpoint === 'clearinghouseState') {
      requestBody = {
        type: 'clearinghouseState',
        user: user
      };
    } else {
      return res.status(400).json({ error: 'Invalid endpoint' });
    }

    console.log('Fetching from Hyperliquid:', endpoint, requestBody);
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Hyperliquid API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from Hyperliquid',
      message: error.message 
    });
  }
}
