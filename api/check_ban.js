let lastMessage = "";   // memory me store hoga
let lastUpdated = null; // kab update hua

export default function handler(req, res) {
  if (req.method === "GET") {
    // GET request => last message dikhana
    res.status(200).json({
      last_updated_message: lastMessage || "No message yet",
      updated_at: lastUpdated
    });
  } 
  
  else if (req.method === "POST") {
    // POST request => message update
    const { message } = req.query;

    if (!message) {
      return res.status(400).json({ error: "message parameter required" });
    }

    lastMessage = message.replace(/_/g, " "); // underscore ko space me badalna
    lastUpdated = new Date().toISOString();

    res.status(200).json({
      success: "message successfully updated",
      newmessage: lastMessage
    });
  } 
  
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}