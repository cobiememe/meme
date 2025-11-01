// /api/zerion.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { address, type } = req.query;

  if (!address || !type) {
    return res.status(400).json({ error: "Missing 'address' or 'type' parameter" });
  }

  const ZERION_API_KEY = process.env.ZERION_API_KEY; // Geht über Vercel!

  const endpoint = `https://api.zerion.io/v1/wallets/${address}/${type}`;
  
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${ZERION_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Zerion API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Zerion API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
