
let opens = 0;
let lastReset = Date.now();

export default function handler(req, res) {
  const now = Date.now();

  // Agar 24h ho gaye to reset
  if (now - lastReset >= 24 * 60 * 60 * 1000) {
    opens = 0;
    lastReset = now;
  }

  if (req.method === "POST") {
    opens++;
    return res.status(200).json({ ok: true, opens, lastReset });
  }

  if (req.method === "GET") {
    return res.status(200).json({ opens, lastReset });
  }

  res.status(405).end();
}