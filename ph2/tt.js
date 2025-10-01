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

    let customData;

    // Agar original API ka msg "no_content" ho → invalid UID / region
    if (data.msg === "no_content") {
      customData = {
        data: { "invalid UID  OR invalid Region": true },
        credits: "t.me/zorvaxo",
        success: "false"
      };
    } else {
      // Agar valid data mila
      customData = {
        data: data.data,
        credits: "t.me/zorvaxo",
        success: "true"
      };
    }

    res.status(200).json(customData);
  } catch (err) {
    console.error("Error fetching ban status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
      }