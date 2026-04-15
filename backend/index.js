/**
 * Hogwarts Case Study — AI chat backend
 *
 * This file is a small HTTP server built with Express. Its responsibilities are:
 * 1) Expose a JSON API (`POST /chat`) that accepts a user message and returns model text.
 * 2) Optionally serve the static frontend from ../frontend so one process can power both UI and API
 *    (needed for simple deployment: same hostname for HTML and `/chat`, no CORS headaches).
 * 3) Keep secrets (Groq API key) in environment variables, never in source control.
 *
 * Request flow (high level):
 * Browser sends POST /chat { "message": "..." } → this server validates input → calls Groq’s HTTP API
 * with Authorization: Bearer <GROQ_API_KEY> → Groq returns JSON with choices[0].message.content →
 * we forward that string to the browser as { "response": "..." }.
 */

const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Load variables from a local .env file in development (see dotenv docs). On Railway, variables
// are injected into process.env directly; .env is usually absent there.
require('dotenv').config();

const app = express();

/**
 * PORT: Hosting platforms (Railway, Render, etc.) assign a port via process.env.PORT.
 * Locally, you can set PORT in .env or fall back to 5000 so `npm start` matches the README.
 */
const PORT = process.env.PORT || 5000;

/**
 * Absolute path to the frontend folder (sibling of backend/). __dirname is this file’s directory
 * (backend/). We serve these files so visiting http://localhost:5000/ loads main.html from disk.
 */
const frontendDir = path.join(__dirname, '..', 'frontend');

// Parse JSON bodies on incoming requests. Without this, req.body is undefined for JSON POSTs.
app.use(express.json());

/**
 * CORS allows browsers on *other* origins to call this API. We enable it for flexibility during
 * development (e.g. Live Server on another port). In production, when the UI is served from the
 * same Express app, browsers treat UI and API as same-origin and CORS is not strictly required
 * for that case—but leaving cors() on does not break same-origin usage.
 */
app.use(cors());

/**
 * POST /chat — main application endpoint.
 *
 * Contract with the frontend:
 * - Request body: { message: string } (JSON)
 * - Success response: { response: string } — plain assistant text
 * - Error responses: JSON with { error: string } and appropriate HTTP status
 *
 * We use async (req, res) because axios returns a Promise; we must await the HTTP call to Groq.
 */
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate user input early (“fail fast”). Empty body or missing field → 400 Bad Request.
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please send a non-empty message in JSON: { "message": "..." }' });
    }

    /**
     * API key must never be committed. It is read at runtime from the environment.
     * If missing, we return 500 so the operator knows to configure GROQ_API_KEY (Railway Variables
     * or local .env). We do not log the key.
     */
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Server misconfiguration: GROQ_API_KEY is not set. Add it in Railway Variables or backend/.env.',
      });
    }

    /**
     * Groq exposes an OpenAI-compatible Chat Completions endpoint.
     * Docs: https://console.groq.com/docs — model IDs must match what your key can access.
     *
     * axios.post(url, body, { headers }) sends a POST with JSON body. The third argument configures
     * headers: Bearer token auth and Content-Type for JSON.
     */
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: message.trim() }],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    /**
     * Expected shape (simplified): { choices: [ { message: { content: "..." } } ], ... }
     * If Groq changes shape or returns no choices, optional chaining avoids throwing; we then error.
     */
    const aiText = groqResponse.data?.choices?.[0]?.message?.content;
    if (!aiText) {
      console.error('Unexpected Groq response shape:', JSON.stringify(groqResponse.data).slice(0, 500));
      return res.status(502).json({ error: 'Unexpected response from the language model provider.' });
    }

    return res.json({ response: aiText });
  } catch (error) {
    /**
     * axios attaches response for HTTP error status codes (4xx/5xx from Groq).
     * Network errors have no error.response. We log server-side details but return a generic message
     * to the client to avoid leaking internals.
     */
    console.error('POST /chat error:', error.message);
    if (error.response) {
      console.error('Groq status:', error.response.status, 'data:', error.response.data);
      return res.status(502).json({
        error: 'The model provider returned an error. Check server logs for details.',
      });
    }
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

/**
 * Static file hosting: maps URLs like /style.css and /script.js to files under frontend/.
 * express.static does not execute code; it only sends files. Order matters: /chat is registered
 * above, so it is not shadowed by static files unless a file literally named "chat" existed.
 */
app.use(express.static(frontendDir));

/**
 * GET / serves the main HTML document. Browsers request "/" when opening the site root.
 * sendFile requires an absolute path; path.join(frontendDir, 'main.html') resolves correctly on Windows and Unix.
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'main.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Chat API: POST http://localhost:${PORT}/chat`);
});
