# AI Chat (Groq) — Hogwarts Case Study

Small single-page chat: browser UI → Node/Express backend → [Groq](https://console.groq.com/) LLM API.

## Use the live app (no install)

**After you deploy**, open your Railway URL here:

- **Live app:** `https://YOUR-PROJECT.up.railway.app` (replace with your real link)

Anyone with the link can use the site in a browser. The API key stays on the server only.

## Run on your computer (optional)

1. **Groq API key** from [console.groq.com](https://console.groq.com/) (free tier).
2. In `backend/`, copy `.env.example` to `.env` and set `GROQ_API_KEY=...`.
3. From `backend/` run:
   - `npm install`
   - `npm start`
4. Open **http://localhost:5000** (or the `PORT` in `.env`). The server serves the UI and `/chat`.

## Project layout

| Path | Role |
|------|------|
| `frontend/` | HTML/CSS/JS shown in the browser |
| `backend/` | Express app: static files + `POST /chat` → Groq |

## Deploy on Railway (summary)

1. Push this repo to GitHub (branch **`master`**).
2. [Railway](https://railway.app/) → New Project → Deploy from GitHub → pick this repo.
3. Service **Root Directory:** `backend` (important: repo has `frontend` next to it).
4. **Variables:** add `GROQ_API_KEY` (same value as local `.env`; never commit `.env`).
5. Deploy → copy the public URL → paste it at the top of this README.

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Chat fails / network error | Backend running? Correct URL? On Railway, check logs and `GROQ_API_KEY`. |
| “Secret key is missing” | Set `GROQ_API_KEY` in Railway Variables or `backend/.env` locally. |
| CORS / wrong host | Open the app via the **same origin** as the API (e.g. `http://localhost:5000` or your Railway URL), not `file://`. |

## Submission

Case study also asks for **project documentation (PDF)** covering what you built, stack, how the LLM API works, how frontend talks to backend, key handling, prompts used, problems/solutions, and what you learned — in **your own words** (see `Private AI systems.pdf`).
