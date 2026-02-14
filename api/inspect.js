// ===== CONFIG =====
const MASTER_KEY = "ZOVAXO_MASTER_2026";
const OWNER_KEY = "ZOVAXO_OWNER_2026";
const DEFAULT_LIMIT = 100;

// Persistent in-memory store (reset on redeploy)
global.apiKeys = global.apiKeys || {};

export default async function handler(req, res) {

  const { action, key, url, target } = req.query;

  // ==============================
  // 🔑 CREATE NEW KEY
  // ==============================
  if (action === "create") {

    if (key !== MASTER_KEY) {
      return res.status(403).json({
        success: false,
        error: "MASTER_KEY_REQUIRED"
      });
    }

    const newKey = "ZK_" + Math.random().toString(36).substring(2, 10);

    global.apiKeys[newKey] = {
      used: 0,
      limit: DEFAULT_LIMIT,
      active: true,
      createdAt: Date.now()
    };

    return res.json({
      success: true,
      apiKey: newKey,
      limit: DEFAULT_LIMIT
    });
  }

  // ==============================
  // 👑 ADMIN STATS / BAN
  // ==============================
  if (action === "admin") {

    if (key !== MASTER_KEY) {
      return res.status(403).json({
        success: false,
        error: "MASTER_KEY_REQUIRED"
      });
    }

    if (target) {
      if (global.apiKeys[target]) {
        global.apiKeys[target].active = false;
        return res.json({ success: true, message: "Key banned" });
      }
      return res.json({ success: false, error: "KEY_NOT_FOUND" });
    }

    let active = 0;
    let expired = 0;

    for (let k in global.apiKeys) {
      if (global.apiKeys[k].active) active++;
      else expired++;
    }

    return res.json({
      success: true,
      totalKeys: Object.keys(global.apiKeys).length,
      activeKeys: active,
      expiredKeys: expired
    });
  }

  // ==============================
  // 🔍 INSPECT SYSTEM
  // ==============================

  if (!key) {
    return res.status(401).json({
      success: false,
      error: "API_KEY_REQUIRED"
    });
  }

  // OWNER KEY = unlimited
  if (key !== OWNER_KEY) {

    const keyData = global.apiKeys[key];

    if (!keyData) {
      return res.status(403).json({
        success: false,
        error: "INVALID_KEY"
      });
    }

    if (!keyData.active) {
      return res.status(403).json({
        success: false,
        error: "KEY_BANNED_OR_EXPIRED"
      });
    }

    if (keyData.used >= keyData.limit) {
      keyData.active = false;

      return res.status(403).json({
        success: false,
        error: "KEY_EXPIRED",
        message: "100 request limit reached"
      });
    }

    keyData.used++;
  }

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL_REQUIRED"
    });
  }

  try {

    const start = Date.now();

    const response = await fetch(url, {
      headers: { "User-Agent": "ZovaxoOneFile/1.0" }
    });

    const html = await response.text();
    const time = Date.now() - start;

    return res.json({
      success: true,
      status: response.status,
      responseTime: time + "ms",
      length: html.length,
      title: html.match(/<title>(.*?)<\/title>/i)?.[1] || null,
      raw: html
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: "FETCH_FAILED",
      message: err.message
    });
  }
}