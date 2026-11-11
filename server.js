// Local dev server only - Vercel ignores this file and uses /api + index.html directly.
// Run with: npm run dev   (loads your .env automatically)
import http from "node:http";
import { readFile } from "node:fs/promises";
import handler from "./api/chat.js";

const PORT = 3000;

http
  .createServer(async (req, res) => {
    // Small shim so the Vercel-style handler works locally
    res.status = (code) => ((res.statusCode = code), res);
    res.json = (obj) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(obj));
    };

    if (req.url === "/api/chat") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
      return handler(req, res);
    }

    if (req.url === "/" || req.url === "/index.html") {
      res.setHeader("Content-Type", "text/html");
      return res.end(await readFile("index.html"));
    }

    res.status(404).json({ error: "Not found" });
  })
  .listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
