let lastMessage = "No message yet";
let lastUpdated = null;

export default function handler(req, res) {
  const { message } = req.query;

  if (message) {
    // update message
    lastMessage = message.replace(/_/g, " ");
    lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: "message successfully updated",
      newmessage: lastMessage
    });
  }

  // get last message
  return res.status(200).json({
    last_updated_message: lastMessage,
    updated_at: lastUpdated
  });
}