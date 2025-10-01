let messages = {};

export default function handler(req, res) {
  const { id, message } = req.query;

  if (!id) {
    return res.status(400).json({ error: "id parameter required" });
  }

  // Agar message parameter aaya hai → update kar do
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

  // Agar sirf id diya hai → check karo message aya tha ya nahi
  if (messages[id]) {
    return res.status(200).json({
      id,
      has_message: true,
      last_updated_message: messages[id].text,
      updated_at: messages[id].updated_at
    });
  } else {
    return res.status(200).json({
      id,
      has_message: false,
      last_updated_message: null,
      updated_at: null
    });
  }
}