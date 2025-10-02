let participants = [];
let lastReset = Date.now();

export default function handler(req, res) {
  // check reset time
  const now = Date.now();
  if (now - lastReset > 24 * 60 * 60 * 1000) { // 24 hours
    participants = [];
    lastReset = now;
  }

  if (req.method === "POST") {
    const { phone_number, FF_UID } = req.body;
    if (!phone_number || !FF_UID) {
      return res.status(400).json({ error: "phone_number and FF_UID required" });
    }

    const userjoinnumber = participants.length + 1;
    const entry = { userjoinnumber, phone_number, FF_UID, joinedAt: new Date().toISOString() };

    participants.push(entry);

    return res.status(200).json({ success: true, entry });
  }

  if (req.method === "GET") {
    return res.status(200).json({ participants, total: participants.length });
  }

  return res.status(405).json({ error: "Method not allowed" });
}