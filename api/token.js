export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.dexpaprika.com/v1/tokens');
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error('Fehler:', e);
    res.status(500).json({ error: 'Fetch failed' });
  }
}
