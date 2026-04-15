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

## Deploy on Railway (beginner steps)

1. Sign in at [railway.app](https://railway.app/) and connect your GitHub account when asked.
2. **New Project** → **Deploy from GitHub repo** → choose **Hogwarts-CaseStudy-AiChatbot** (or your fork).
3. Open the new service → **Settings** → set **Root Directory** to **`backend`** (so Railway runs `npm start` next to the `frontend` folder in the repo).
4. **Variables** (or **Variables** tab): add **`GROQ_API_KEY`** with your Groq key (same as in local `.env`).
5. Wait for the deploy to finish → **Settings → Networking → Generate Domain** (or the public URL Railway shows).
6. Open that URL in a browser; you should see the chat page. Send a test message.
7. Edit this README and replace ``https://YOUR-PROJECT.up.railway.app`` with your real link, then commit and push (optional but nice for reviewers).

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Chat fails / network error | Backend running? Correct URL? On Railway, check logs and `GROQ_API_KEY`. |
| “Secret key is missing” | Set `GROQ_API_KEY` in Railway Variables or `backend/.env` locally. |
| CORS / wrong host | Open the app via the **same origin** as the API (e.g. `http://localhost:5000` or your Railway URL), not `file://`. |

## Git branch note

If GitHub still has a **`main`** branch you do not use: set the repo **default branch** to **`master`** first (**Settings → General → Default branch**), then delete `main` (e.g. `git push origin --delete main`). GitHub blocks deleting the branch that is currently default.

## Submission

Case study also asks for **project documentation (PDF)** covering what you built, stack, how the LLM API works, how frontend talks to backend, key handling, prompts used, problems/solutions, and what you learned — in **your own words** (see `Private AI systems.pdf`).
