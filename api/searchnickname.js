export default async function handler(req, res) {
  const { region, nickname } = req.query;

  if (!region || !nickname) {
    return res.status(400).json({ error: "region and nickname are required!" });
  }

  try {
    // Call original API
    const apiRes = await fetch(
      `https://danger-search-nickname.vercel.app/name/${encodeURIComponent(region)}?nickname=${encodeURIComponent(nickname)}`
    );

    if (!apiRes.ok) {
      return res.status(500).json({ error: "Failed to fetch from source API" });
    }

    const data = await apiRes.json();

    let customData;

    // ✅ Agar results ek array hai (success)
    if (Array.isArray(data.results)) {
      customData = {
        credit: "https://t.me/zorvaxo",
        totle_results: data.results.length,
        results: data.results
      };
    } 
    // ❌ Agar results error object hai
    else if (data.results && data.results.error) {
      customData = {
        credit: "https://t.me/zorvaxo",
        results: { error: "Request failed with 0 results" }
      };
    } 
    // Agar kuch unexpected format aaya
    else {
      customData = {
        credit: "https://t.me/zorvaxo",
        results: { error: "Unexpected response format" }
      };
    }

    res.status(200).json(customData);
  } catch (err) {
    console.error("Error fetching nickname search:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}