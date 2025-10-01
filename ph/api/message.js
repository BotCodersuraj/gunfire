
let lastMessage = null;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { msg } = req.body;
    if (!msg) return res.status(400).json({ error: "msg required" });
    lastMessage = msg;
    return res.status(200).json({ ok: true, lastMessage });
  }

  if (req.method === "GET") {
    return res.status(200).json({ lastMessage });
  }

  res.status(405).end();
}