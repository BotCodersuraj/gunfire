export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "uid is required!" });
  }

  try {
    // Call original API
    const apiRes = await fetch(
      `https://danger-info-alpha.vercel.app/accinfo?uid=${encodeURIComponent(uid)}`
    );

    if (!apiRes.ok) {
      return res.status(500).json({ error: "Failed to fetch from source API" });
    }

    const data = await apiRes.json();
    let customData;

    // ✅ Success case (basicInfo exists)
    if (data.basicInfo) {
      customData = {
        credits: "t.me/zorvaxo",
        basicInfo: data.basicInfo,
        clanBasicInfo: data.clanBasicInfo,
        creditScoreInfo: data.creditScoreInfo,
        diamondCostRes: data.diamondCostRes,
        petInfo: data.petInfo,
        profileInfo: data.profileInfo,
        region: data.region,
        socialInfo: data.socialInfo
      };
    } 
    // ❌ Invalid UID case
    else if (data.status === "error") {
      customData = {
        credits: "t.me/zorvaxo",
        message: "invalid UID",
        status: "error"
      };
    } 
    // Unexpected response
    else {
      customData = {
        credits: "t.me/zorvaxo",
        message: "unexpected response",
        status: "error"
      };
    }

    res.status(200).json(customData);
  } catch (err) {
    console.error("Error fetching account info:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}