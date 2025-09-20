export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "uid is required!" });
  }

  try {
    // Call original API WITHOUT key
    const apiRes = await fetch(
      `https://danger-region-check.vercel.app/region?uid=${encodeURIComponent(uid)}&key=DANGERxREGION`
    );

    if (!apiRes.ok) {
      return res.status(500).json({ error: "Failed to fetch from source API" });
    }

    const data = await apiRes.json();
    let customData;

    // ✅ Success case (level & uid present)
    if (data.level && data.uid) {
      customData = {
        credits: "t.me/zorvaxo",
        level: data.level,
        likes: data.likes,
        nickname: data.nickname,
        region: data.region,
        uid: data.uid
      };
    } 
    // ❌ Invalid UID case
    else if (data.status === "error") {
      customData = {
        credits: "t.me/zorvaxo",
        msg: "invalid UID",
        status: "error"
      };
    } 
    // Agar kuch unexpected format ho
    else {
      customData = {
        credits: "t.me/zorvaxo",
        msg: "unexpected response",
        status: "error"
      };
    }

    res.status(200).json(customData);
  } catch (err) {
    console.error("Error fetching region check:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}