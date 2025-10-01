let messages = {};

export default function handler(req, res) {
  const { id, message } = req.query;

  if (!id) {
    return res.status(400).json({ error: "id parameter required" });
  }

  // Agar ?message=... diya hai → message update
  if (message) {
    messages[id] = {
      text: message.replace(/_/g, " "),
      updated_at: new Date().toISOString(),
      viewed: false // reset status to "new"
    };

    return res.status(200).json({
      success: "message successfully updated",
      id,
      newmessage: messages[id].text
    });
  }

  // Agar sirf id diya hai → check karo message hai kya
  if (messages[id]) {
    let status = "old";
    if (!messages[id].viewed) {
      status = "new";
      messages[id].viewed = true; // pehli baar dekhne ke baad old banado
    }

    return res.status(200).json({
      id,
      has_message: true,
      status, // "new" ya "old"
      last_updated_message: messages[id].text,
      updated_at: messages[id].updated_at
    });
  } else {
    return res.status(200).json({
      id,
      has_message: false,
      status: "none",
      last_updated_message: null,
      updated_at: null
    });
  }
}