export default async function handler(req, res) {
  const { nickname } = req.query;
  if (!nickname) return res.status(400).json({ error: "Nickname is required" });

  try {
    // Native fetch use
    const apiRes = await fetch(`https://danger-search-nickname.vercel.app/name/ind?nickname=${encodeURIComponent(nickname)}`);
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data from API" });
  }
}