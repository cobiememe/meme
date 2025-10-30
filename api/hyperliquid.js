// /api/hyperliquid.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { endpoint, coin, user, address } = req.query; // address für Kompatibilität
    const API = "https://api.hyperliquid.xyz/info";

    let payload = {};

    // Verwende user ODER address für Kompatibilität
    const effectiveUser = user || address;

    switch (endpoint) {
      case "trades":
        // Hyperliquid hat KEINEN public trades endpoint - wir geben Meta zurück
        payload = { type: "meta" };
        break;
      case "userFills":
        if (!effectiveUser) {
          return res.status(400).json({ error: "User address required" });
        }
        payload = { type: "userFills", user: effectiveUser };
        break;
      case "meta":
        payload = { type: "meta" };
        break;
      case "allMids":
        payload = { type: "allMids" };
        break;
      case "clearinghouseState":
        if (!effectiveUser) {
          return res.status(400).json({ error: "User address required" });
        }
        payload = { type: "clearinghouseState", user: effectiveUser };
        break;
      default:
        return res.status(400).json({ error: "Invalid endpoint" });
    }

    console.log(`Hyperliquid API Call: ${endpoint}`, payload);

    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Hyperliquid API Error", err);
    res.status(500).json({ error: err.message });
  }
}
