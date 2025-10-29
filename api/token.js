// /api/token.js - Token Data Proxy
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🪙 Fetching token data...');
    
    const response = await fetch('https://api.dexpaprika.com/v1/tokens');
    
    if (!response.ok) {
      throw new Error(`Token API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Token data received');
    res.status(200).json(data);
    
  } catch (error) {
    console.error('❌ Token API Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
