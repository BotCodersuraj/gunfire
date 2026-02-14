export default async function handler(req, res) {

  const startTime = Date.now();
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      errorType: "MISSING_URL",
      message: "URL parameter missing",
      example: "/api/inspect?url=https://example.com",
      timestamp: new Date().toISOString()
    });
  }

  if (!/^https?:\/\/.+/i.test(url)) {
    return res.status(400).json({
      success: false,
      errorType: "INVALID_URL",
      message: "URL must start with http:// or https://",
      timestamp: new Date().toISOString()
    });
  }

  try {

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (ZovaxoInspector/3.0)"
      },
      redirect: "follow"
    });

    const html = await response.text();
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Extraction
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || null;
    const metaDesc = html.match(/<meta name="description" content="(.*?)"/i)?.[1] || null;
    const links = (html.match(/<a /g) || []).length;
    const images = (html.match(/<img /g) || []).length;
    const scripts = (html.match(/<script /g) || []).length;
    const styles = (html.match(/stylesheet/g) || []).length;

    const hasLogin = /type="password"/i.test(html);
    const hasForm = /<form/i.test(html);
    const hasIframe = /<iframe/i.test(html);

    // SEO Score (basic logic)
    let seoScore = 0;
    if (title) seoScore += 20;
    if (metaDesc) seoScore += 20;
    if (links > 5) seoScore += 20;
    if (images > 0) seoScore += 20;
    if (styles > 0) seoScore += 20;

    // Risk Level
    let riskLevel = "LOW";
    if (hasLogin && !url.startsWith("https")) riskLevel = "HIGH";
    if (hasIframe) riskLevel = "MEDIUM";

    return res.status(200).json({

      success: true,
      version: "3.0",

      requestedUrl: url,
      finalUrl: response.url,
      redirected: response.url !== url,

      status: response.status,
      statusText: response.statusText,
      responseTime: `${loadTime}ms`,

      timestamp: new Date().toISOString(),

      contentType: response.headers.get("content-type"),
      server: response.headers.get("server"),
      poweredBy: response.headers.get("x-powered-by"),
      cacheControl: response.headers.get("cache-control"),

      htmlLength: html.length,

      title,
      metaDescription: metaDesc,

      totalLinks: links,
      totalImages: images,
      totalScripts: scripts,
      totalStylesheets: styles,

      hasForm,
      hasLoginForm: hasLogin,
      hasIframe,

      isSecureHTTPS: url.startsWith("https"),

      seoScore: seoScore,
      performanceHint: loadTime < 500 ? "FAST" : loadTime < 1500 ? "AVERAGE" : "SLOW",
      riskLevel,

      analysisSummary: `
        Title Present: ${!!title}
        Meta Description: ${!!metaDesc}
        Login Form: ${hasLogin}
        SEO Score: ${seoScore}/100
      `,

      rawCode: html

    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      errorType: "FETCH_FAILED",
      message: err.message,
      possibleCauses: [
        "Bot blocked",
        "Cloudflare protection",
        "Invalid domain",
        "Server timeout",
        "DNS error"
      ],
      timestamp: new Date().toISOString()
    });
  }
}