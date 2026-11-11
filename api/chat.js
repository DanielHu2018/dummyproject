// Vercel turns every file in /api into a serverless function.
// This one lives at /api/chat and keeps the API key on the server.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  // GET /api/chat -> tells the page whether the key is set (never returns the key itself)
  if (req.method === "GET") {
    return res.status(200).json({ configured: Boolean(apiKey) });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({
      error:
        "GEMINI_API_KEY is not set. Locally: add it to .env. On Vercel: Project Settings -> Environment Variables, then redeploy.",
    });
  }

  const raw = req.body?.prompt;
  if (typeof raw !== "string" || !raw.trim()) {
    return res.status(400).json({ error: "Please type a prompt." });
  }
  if (raw.length > 2000) {
    return res.status(400).json({ error: "Prompt is too long (max 2000 characters)." });
  }
  const prompt = raw.trim();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Gemini request failed" });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "(no response)";
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
