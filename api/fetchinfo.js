export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  try {
    const response = await fetch(
      `https://danger-info-alpha.vercel.app/accinfo?uid=${uid}&key=DANGERxINFO`
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch data from API" });
  }
}