export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
    
    const response = await fetch('https://solana-gateway.moralis.io/token/mainnet/all', {
      headers: {
        'X-API-Key': MORALIS_API_KEY
      }
    });
    
    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Moralis API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
