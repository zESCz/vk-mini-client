export default async function handler(req, res) {
  try {
    const { code, device_id, code_verifier } = req.body || {};

    if (!code || !device_id || !code_verifier) {
      return res.status(400).json({
        error: "Missing code, device_id or code_verifier"
      });
    }

    const params = new URLSearchParams({
      code,
      device_id,
      code_verifier,
      redirect_uri:
        "https://vk-mini-client.vercel.app/api/auth/vk/callback",
      client_id: "54798745"
    });

    const response = await fetch(
      "https://id.vk.ru/oauth2/auth",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}