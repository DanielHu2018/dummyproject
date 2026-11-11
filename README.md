# Vercel Deploy Demo

A very small AI app for practicing a Vercel deploy. The page sends your prompt to `/api/chat`, a serverless function, and that function calls Gemini using `GEMINI_API_KEY`.

```
index.html      → the frontend (served as a static file)
api/chat.js     → serverless function (Vercel runs every file in /api)
dev-server.js   → local dev server only (excluded from Vercel via .vercelignore)
.env.example    → template for your secrets
.gitignore      → keeps .env out of GitHub
```

There are no dependencies, so you don't need `npm install`.

## Run locally

1. Copy `.env.example` to `.env` and paste your key from https://aistudio.google.com/apikey
2. Run `npm run dev` (requires Node 20.6+)
3. Open http://localhost:3000. The badge should be green.

## Deploy (matches the slides)

1. **Push to GitHub.** Run `git status` and check that `.env` is **not** listed (it's in `.gitignore`).
2. **Sign into Vercel.** Go to vercel.com and choose "Continue with GitHub".
3. **Import.** Click Add New → Project → Import this repo. Leave Framework Preset as "Other".
4. **Environment Variables.** Add `GEMINI_API_KEY` with your key.
5. **Deploy.** Open the `.vercel.app` link, check that the badge is green, and send a prompt.

If you forget step 4, the badge turns red and says "GEMINI_API_KEY is missing". To fix it, add the key under Settings → Environment Variables, then go to **Deployments → Redeploy**. Env var changes only apply to new deployments.
