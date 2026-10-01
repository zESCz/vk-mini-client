export default function handler(req, res) {
  const params = new URLSearchParams();

  const allowed = [
    "code",
    "device_id",
    "state",
    "type",
    "expires_in",
    "error",
    "error_description"
  ];

  for (const key of allowed) {
    const value = req.query?.[key];

    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }

  const target =
    "https://vk-mini-client.vercel.app/?" + params.toString();

  res.writeHead(302, {
    Location: target
  });

  res.end();
}