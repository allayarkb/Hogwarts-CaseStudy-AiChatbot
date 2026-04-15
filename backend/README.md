# Backend (`backend/`)

Node.js **Express** app defined in [`index.js`](index.js).

- **`POST /chat`** — accepts `{ "message": "..." }`, calls Groq, returns `{ "response": "..." }`.
- **Static files** — serves the [`../frontend`](../frontend) folder so one process hosts UI + API (needed for Railway and same-origin `/chat`).

## Quick start

See the [root README](../README.md). Set `GROQ_API_KEY` in `.env` (from [`.env.example`](.env.example)), then `npm install` and `npm start`.
