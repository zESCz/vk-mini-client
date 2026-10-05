const ALLOWED = new Set([
  "friends.get",
  "newsfeed.get",
  "messages.getConversations",
  "audio.get",
  "video.get",
  "video.search",
  "video.getCatalog",
  "video.getCatalogSection",
  "users.get"
]);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : (req.body || {});

    const method = String(body.method || "");
    const token = String(body.access_token || "");

    if (!ALLOWED.has(method)) {
      return res.status(400).json({
        error: "Method is not allowed"
      });
    }

    if (!token) {
      return res.status(401).json({
        error: "Missing access token"
      });
    }

    const params = new URLSearchParams();

    const input =
      body.params && typeof body.params === "object"
        ? body.params
        : {};

    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }

    params.set("access_token", token);
    params.set("v", "5.199");

    const vk = await fetch(
      `https://api.vk.ru/method/${encodeURIComponent(method)}?${params.toString()}`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    const text = await vk.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        error: "VK returned invalid JSON",
        raw: text.slice(0, 500)
      };
    }

    return res
      .status(vk.ok ? 200 : vk.status)
      .json(data);

  } catch (e) {
    return res.status(502).json({
      error: e?.message || "VK proxy failed"
    });
  }
}