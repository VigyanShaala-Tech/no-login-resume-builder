# Deploying on Elestio

Step-by-step guide to deploy **no-login-resume-builder** on [Elestio](https://elest.io) using the CI/CD pipeline. This app is a **full-stack Node.js service** (Express + Vite React), not a static site. PDF export requires Playwright/Chromium at build time.

---

## Before you start

### What you need

| Requirement | Details |
|-------------|---------|
| **Elestio account** | Sign up at [elest.io](https://elest.io) |
| **Git repository** | This repo pushed to GitHub or GitLab |
| **Branch** | Usually `main` |
| **Node.js** | Version **20** (defined in `elestio.yml`) |

### How the app runs in production

```
Browser → Elestio HTTPS (443) → Reverse proxy → Express (server.cjs) on port 3000
                                              ├── Serves dist/ (React UI)
                                              ├── POST /api/generate-pdf  (Playwright)
                                              └── POST /api/generate-docx (Word export)
```

The repo includes **`elestio.yml`** at the root. When Elestio detects it, many dashboard fields auto-fill. You can still review and override them.

---

## Step 1 — Open Elestio and start a new pipeline

1. Log in to the [Elestio dashboard](https://dash.elest.io).
2. Go to **CI/CD** (or **CI/CD Pipelines**).
3. Click **Create CI/CD pipeline** (or **New pipeline**).

---

## Step 2 — Connect your Git provider

1. Choose **GitHub** or **GitLab** as the source.
2. If prompted, **authorize Elestio** to access your repositories.
3. Select the repository: **`no-login-resume-builder`** (or your fork name).
4. Select the branch: **`main`** (or your deploy branch).

---

## Step 3 — Project identity

Fill in the basic project fields:

| UI field | Value |
|----------|--------|
| **Project name** | e.g. `no-login-resume-builder` |
| **Branch** | `main` |
| **Root directory** | Leave **blank** (app is at repo root) |

Click **Next** or continue to build settings.

---

## Step 4 — Runtime and framework

If `elestio.yml` is detected, these should pre-fill. Verify manually if not:

| UI field | Value | Notes |
|----------|--------|--------|
| **Runtime** | **Node.js** | Not `static` — the app needs Express |
| **Version** | **20** | Matches Playwright 1.55 requirements |
| **Framework** | **No framework** (or custom) | Do **not** pick static React-only — that skips the Express server |

---

## Step 5 — Build and run commands

In **Build & output settings** (or **Build settings**), set:

| UI field | Command |
|----------|---------|
| **Install command** | `npm install` |
| **Build command** | `npm run build && PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium` |
| **Run command** | `npm start` |
| **Build output directory** | `dist` |

### Why these commands

- **`npm run build`** — Vite builds the React frontend into `dist/`.
- **`PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium`** — Installs Chromium inside `node_modules` so PDF export works. The server (`server.cjs`) expects browsers at this path.
- **`npm start`** — Runs `node server.cjs`, which serves the UI and API routes.

### Optional: add system libraries if PDF fails

If PDF generation fails with missing shared-library errors, extend the build command:

```bash
npm run build && PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium && npx playwright install-deps chromium
```

Leave **lifecycle scripts** (pre/post install, pre/post deploy) **empty** unless you have custom scripts.

---

## Step 6 — Environment variables

Open the **Environment variables** section.

### Required (already in `elestio.yml`)

| Key | Value | When |
|-----|--------|------|
| `NODE_ENV` | `production` | Runtime |
| `PORT` | `3000` | Runtime — must match exposed port below |

### Optional — Supabase download logging

Supabase is **not required** for the app to work. It only logs data when a user downloads a **PDF** (optional analytics).

If you **do not** use Supabase: do **not** set these, or remove placeholder values from `elestio.yml` before deploying.

If you **do** use Supabase, add in the Elestio UI (prefer the dashboard over committing secrets to Git):

| Key | Value |
|-----|--------|
| `VITE_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) key |

**Important:** Vite embeds `VITE_*` variables at **build time**. They must be present **before** the build step runs, not only at runtime.

---

## Step 7 — Exposed ports

In **Exposed ports**:

| Field | Value |
|-------|--------|
| **Container port** (target) | `3000` |
| **Host port** | `3000` (or any free port on the node) |
| **Protocol** | HTTP (internal) |

The app listens on `process.env.PORT || 3001`. With `PORT=3000`, it binds to port **3000**.

---

## Step 8 — Reverse proxy (public HTTPS)

In **Reverse proxy** settings:

| Field | Value |
|-------|--------|
| **Protocol** | HTTPS (public) → HTTP (container) |
| **Listening port** | `443` |
| **Target port** | `3000` (same as `PORT` and container port) |
| **Target IP** | `172.17.0.1` (default — do not change unless Elestio docs say otherwise) |
| **Path** | `/` |
| **Public** | Yes |
| **Basic auth** | Off (unless you want to password-protect the site) |

This matches `elestio.yml`:

```yaml
ports:
  - protocol: "HTTPS"
    targetProtocol: "HTTP"
    listeningPort: "443"
    targetPort: "3000"
    targetIP: "172.17.0.1"
    public: true
    path: "/"
```

---

## Step 9 — Health check (optional)

If the UI offers a health check path, set:

| Field | Value |
|-------|--------|
| **Health check path** | `/api/health` |

Expected response: `{"status":"ok","message":"Server is running"}`.

---

## Step 10 — Create and deploy

1. Review all settings against the tables above.
2. Click **Create CI/CD pipeline** (or **Deploy**).
3. Wait for the pipeline to:
   - Clone the repo
   - Run `npm install`
   - Run the build command (Vite + Playwright)
   - Start `npm start`
4. Open the URL shown in the dashboard (often `https://[CI_CD_DOMAIN]`).

First deploy can take several minutes because Playwright downloads Chromium.

---

## Step 11 — Verify the deployment

### UI smoke test

1. Open the site URL in a browser.
2. Fill in resume fields (name, email, experience, etc.).
3. Click **Download PDF** — confirm a PDF downloads.
4. Click **Download Word** — confirm a `.docx` downloads.

### API health check

```bash
curl https://YOUR-ELESTIO-DOMAIN/api/health
```

Expected:

```json
{"status":"ok","message":"Server is running"}
```

### Build logs

In Elestio, open the pipeline **Logs** / **Build log** and confirm:

- `vite build` completed
- Playwright Chromium installed without errors
- `Server running on port 3000` (or your `PORT`) in runtime logs

---

## Step 12 — Custom domain (optional)

1. In the pipeline, open **Domains** or **Custom domains**.
2. Add your domain (e.g. `resume.yourdomain.com`).
3. Create the DNS record Elestio shows (usually CNAME to `[CI_CD_DOMAIN]`).
4. Wait for DNS propagation and SSL provisioning.

---

## Redeploying after code changes

1. Push changes to the connected branch (`main`).
2. Elestio triggers a new build automatically (if webhooks are enabled), or click **Redeploy** / **Rebuild** in the dashboard.
3. Each redeploy runs install + build + start again.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| Site loads but PDF fails | Chromium not installed or wrong path | Ensure build includes `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium` |
| PDF error: missing `.so` libraries | OS deps missing | Add `npx playwright install-deps chromium` to build command |
| 502 / connection refused | Port mismatch | Set `PORT=3000`, container port `3000`, reverse proxy target `3000` |
| Blank page or old UI | Stale build | Trigger redeploy; confirm `buildDir` is `dist` |
| Supabase warning on PDF download | Missing or invalid `VITE_SUPABASE_*` | Add correct vars **before build**, or ignore if you do not need logging |
| Word works, PDF does not | Playwright-only issue | Word uses `/api/generate-docx` without Chromium |

### PDF-specific note

`server.cjs` contains fallback browser paths for Render.com. On Elestio, Chromium should be found via `PLAYWRIGHT_BROWSERS_PATH=0` and the install during build. If PDF still fails, check runtime logs for `Playwright browser issue detected`.

---

## Configuration reference (`elestio.yml`)

The committed file at the repo root documents the intended Elestio setup:

```yaml
config:
  runTime: "NodeJs"
  version: "20"
  framework: "NoFramework"
  installCommand: "npm install"
  buildCommand: "npm run build && PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium"
  buildDir: "dist"
  runCommand: "npm start"
```

Keep **Supabase keys out of Git**. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only in the Elestio dashboard when needed.

---

## Quick checklist

- [ ] Runtime: **Node.js 20** (not static)
- [ ] Install: `npm install`
- [ ] Build: `npm run build && PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium`
- [ ] Run: `npm start`
- [ ] Build dir: `dist`
- [ ] Env: `PORT=3000`, `NODE_ENV=production`
- [ ] Reverse proxy target port: **3000**
- [ ] Test PDF and Word download after deploy
- [ ] (Optional) Health check: `/api/health`
- [ ] (Optional) Supabase vars set in dashboard before build

---

## Related docs

- [Render deployment](./RENDER-SETUP.md) — alternative hosting on Render.com
- [Elestio CI/CD docs](https://docs.elest.io/books/cicd-pipelines/)
- [Elestio `elestio.yml` template guide](https://docs.elest.io/books/cicd-pipelines/page/create-your-own-template-elestioyml)
