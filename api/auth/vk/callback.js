export default function handler(req, res) {
  const { code, state, device_id, error, error_description } = req.query;

  const params = new URLSearchParams();

  if (code) params.set("code", code);
  if (state) params.set("state", state);
  if (device_id) params.set("device_id", device_id);
  if (error) params.set("error", error);
  if (error_description) {
    params.set("error_description", error_description);
  }

  res.redirect(302, `/?${params.toString()}`);
}