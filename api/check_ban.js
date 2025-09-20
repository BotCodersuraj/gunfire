export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "uid is required!" });
  }

  try {
    // Call original API
    const apiRes = await fetch(
      `http://danger-ban-status-five.vercel.app/check_ban?uid=${encodeURIComponent(uid)}`
    );

    if (!apiRes.ok) {
      return res.status(500).json({ error: "Failed to fetch from source API" });
    }

    const data = await apiRes.json();

    // Transform JSON response
    const customData = {
      data: data.data,
      credits: "t.me/zorvaxo",
      success: "true"
    };

    res.status(200).json(customData);
  } catch (err) {
    console.error("Error fetching ban status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}