// /pages/api/fetchinfo.js

let participants = [];
let lastReset = Date.now();

export default function handler(req, res) {
  const now = Date.now();

  // Reset every 24h
  if (now - lastReset > 24 * 60 * 60 * 1000) {
    participants = [];
    lastReset = now;
  }

  const { phone_number, ffuid } = req.query;

  // Agar join karne ke liye query aayi hai
  if (phone_number && ffuid) {
    const userjoinnumber = participants.length + 1;
    const entry = {
      userjoinnumber,
      phone_number,
      FF_UID: ffuid,
      joinedAt: new Date().toISOString()
    };

    participants.push(entry);

    return res.status(200).json({
      success: true,
      entry,
      total: participants.length
    });
  }

  // Agar sirf fetch karna hai
  return res.status(200).json({
    participants,
    total: participants.length
  });
}