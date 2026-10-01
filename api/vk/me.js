export default async function handler(req, res) {
  try {
    const { access_token } = req.body || {};

    if (!access_token) {
      return res.status(400).json({
        error: "Missing access_token"
      });
    }

    const params = new URLSearchParams({
      access_token,
      v: "5.199"
    });

    const response = await fetch(
      "https://api.vk.com/method/users.get?" + params.toString()
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}