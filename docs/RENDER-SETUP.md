# Deploying on Render.com

## 1. Connect GitHub

- In [Render Dashboard](https://dashboard.render.com), **New** → **Web Service**.
- Connect your GitHub account and select the repo `no-login-resume-builder`.
- Render will read the code from the connected branch (e.g. `main`).

## 2. Build & Start

Set these in the Render service **Build & Deploy** section:

| Field | Value |
|-------|--------|
| **Build Command** | `npm install && npm run build && PLAYWRIGHT_BROWSERS_PATH=/opt/render/.cache/playwright npx playwright install chromium` |
| **Start Command** | `npm start` |
| **Root Directory** | (leave blank) |

If you use the optional `render.yaml` in the repo, Render can pick these up when you use a Blueprint.

## 3. Environment variables

Add in **Environment** (only if you use Supabase / analytics):

| Key | Value | Notes |
|-----|--------|--------|
| `VITE_SUPABASE_URL` | your Supabase project URL | If the app uses Supabase (e.g. resume storage) |
| `VITE_SUPABASE_ANON_KEY` | your Supabase anon key | Same as above |

For a plain deploy with no backend storage, you can leave env vars empty.

## 4. Notes

- **PDF download** needs Chromium. The build command installs Playwright Chromium; the server uses it for `/api/generate-pdf`. If Chromium is missing, PDF may fail (Word download does not need it).
- **Port**: Render sets `PORT`; the server uses `process.env.PORT || 3001`.
- **Health check**: Optional. You can set **Health Check Path** to `/api/health` if you want Render to ping that URL.
