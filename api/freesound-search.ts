import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const q = String(req.query.q || "").trim();
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter q" });
  }

  const url =
    "https://freesound.org/apiv2/search/text/?" +
    new URLSearchParams({
      query: q,
      page_size: "20",
      fields: "id,name,previews,duration,license,username"
    });

  const r = await fetch(url, {
    headers: {
      Authorization: `Token ${process.env.FREESOUND_TOKEN}`
    }
  });

  if (!r.ok) {
    const text = await r.text();
    return res.status(r.status).json({ error: text });
  }

  const data = await r.json();
  res.status(200).json(data);
}