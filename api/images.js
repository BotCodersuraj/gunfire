export default async function handler(req, res) {
  const { object } = req.query;
  if (!object) {
    return res.status(400).json({ error: "Object Id is required" });
  }

  try {
    // Fetch image from original API
    const apiRes = await fetch(
      `https://dl-freefiredth-icons.onrender.com/ff/images/${encodeURIComponent(object)}`
    );

    if (!apiRes.ok) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Convert response to buffer
    const arrayBuffer = await apiRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Content-Type header forward karo (image/png, image/jpeg, etc)
    res.setHeader("Content-Type", apiRes.headers.get("content-type") || "image/png");

    // Image bhej do
    res.send(buffer);
  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
}