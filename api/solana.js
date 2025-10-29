// /api/solana.js - Moralis Solana Token API
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
    
    if (!MORALIS_API_KEY) {
      throw new Error('MORALIS_API_KEY not configured');
    }
    
    console.log('⚡ Fetching Solana tokens from Moralis...');
    
    const response = await fetch('https://solana-gateway.moralis.io/token/mainnet/all', {
      headers: {
        'X-API-Key': MORALIS_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Moralis API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Moralis response received');
    res.status(200).json(data);
    
  } catch (error) {
    console.error('❌ Moralis API Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
