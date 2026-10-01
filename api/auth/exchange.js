export default async function handler(req, res) {
  try {
    const { code, device_id, code_verifier } = req.body || {};

    if (!code || !device_id || !code_verifier) {
      return res.status(400).json({
        error: "Missing code, device_id or code_verifier"
      });
    }

    const state = req.body.state || "";

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri:
        "https://vk-mini-client.vercel.app/api/auth/vk/callback",
      client_id: "54798745",
      code_verifier,
      state,
      device_id
    });

    const response = await fetch(
      "https://id.vk.ru/oauth2/auth?" + params.toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          code
        })
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "VK returned non-JSON response",
        response: text.slice(0, 500)
      });
    }

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}