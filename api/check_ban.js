// Memory store (server restart pe reset ho jaayega)
let messages = {};

export default function handler(req, res) {
  const { id, message } = req.query;

  if (!id) {
    return res.status(400).json({ error: "id parameter required" });
  }

  // Agar ?message=... bhi diya hai to update kar do
  if (message) {
    messages[id] = {
      text: message.replace(/_/g, " "),
      updated_at: new Date().toISOString()
    };

    return res.status(200).json({
      success: "message successfully updated",
      id,
      newmessage: messages[id].text
    });
  }

  // Nahi to sirf last message dikhao
  if (messages[id]) {
    return res.status(200).json({
      id,
      last_updated_message: messages[id].text,
      updated_at: messages[id].updated_at
    });
  } else {
    return res.status(200).json({
      id,
      last_updated_message: "No message yet",
      updated_at: null
    });
  }
}