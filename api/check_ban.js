let lastMessage = "";   // memory me store hoga
let lastUpdated = null; // kab update hua

export default function handler(req, res) {
  const { message } = req.query;

  // Agar query me ?message=... diya ho to update kar do
  if (message) {
    lastMessage = message.replace(/_/g, " "); 
    lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: "message successfully updated",
      newmessage: lastMessage
    });
  }

  // Nahi to sirf last message return karo
  return res.status(200).json({
    last_updated_message: lastMessage || "No message yet",
    updated_at: lastUpdated
  });
}