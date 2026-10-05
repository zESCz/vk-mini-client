export default function handler(req, res) {
  const query = new URLSearchParams();
  const source = req.query || {};

  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, String(item));
    } else if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  }

  const target = query.toString() ? `/?${query.toString()}` : "/";
  res.setHeader("Cache-Control", "no-store");
  res.writeHead(302, { Location: target });
  res.end();
}
