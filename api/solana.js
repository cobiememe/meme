export default async function handler(req, res) {
  const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

  const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/all`, {
    headers: {
      'X-API-Key': MORALIS_API_KEY
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}
