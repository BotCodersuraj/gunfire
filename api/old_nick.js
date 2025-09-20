export default async function handler(req, res) {
  const { account_id, region } = req.query;

  if (!account_id || !region) {
    return res.status(400).json({ error: "account_id and region are required!" });
  }

  try {
    // Call original API
    const apiRes = await fetch(
      `https://freefire-old-nickname.vercel.app/old_nick?account_id=${encodeURIComponent(account_id)}&region=${encodeURIComponent(region)}`
    );

    if (!apiRes.ok) {
      return res.status(500).json({ error: "Failed to fetch from source API" });
    }

    const data = await apiRes.json();

    // Modify JSON response
    const customData = {
      credit: "t.me/zorvaxo",
      uid: data.Uid,
      Current_Nickname: data.Current_Nickname,
      Old_Nickname: data.Old_Nickname,
      Region: data.Region_Old
    };

    res.status(200).json(customData);
  } catch (err) {
    console.error("Error fetching old nickname:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}