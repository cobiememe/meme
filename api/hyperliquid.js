// /api/hyperliquid.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { endpoint, coin, user } = req.body || req.query;
    const API = "https://api.hyperliquid.xyz/info";

    let payload = {};

    switch (endpoint) {
      case "trades":
        payload = { type: "recentFills", coin: coin || "ETH" };
        break;
      case "userFills":
        payload = { type: "userFills", user };
        break;
      case "meta":
        payload = { type: "meta" };
        break;
      case "allMids":
        payload = { type: "allMids" };
        break;
      case "clearinghouseState":
        payload = { type: "clearinghouseState", user };
        break;
      default:
        return res.status(400).json({ error: "Invalid endpoint" });
    }

    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Hyperliquid API Error", err);
    res.status(500).json({ error: err.message });
  }
}
// /api/hyperliquid.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { endpoint, coin, user } = req.body || req.query;
    const API = "https://api.hyperliquid.xyz/info";

    let payload = {};

    switch (endpoint) {
      case "trades":
        payload = { type: "recentFills", coin: coin || "ETH" };
        break;
      case "userFills":
        payload = { type: "userFills", user };
        break;
      case "meta":
        payload = { type: "meta" };
        break;
      case "allMids":
        payload = { type: "allMids" };
        break;
      case "clearinghouseState":
        payload = { type: "clearinghouseState", user };
        break;
      default:
        return res.status(400).json({ error: "Invalid endpoint" });
    }

    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Hyperliquid API Error", err);
    res.status(500).json({ error: err.message });
  }
}
