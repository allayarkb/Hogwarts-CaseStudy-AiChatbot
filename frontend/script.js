/**
 * Frontend script for the AI chat page
 *
 * Runs entirely in the visitor’s browser. It:
 * - Reads the user’s text from the input field
 * - Sends it to the backend via HTTP (fetch) as JSON
 * - Renders the assistant reply in the page
 *
 * Why fetch + JSON?
 * The backend is designed as a small REST-style API: POST /chat with body { message: "..." }
 * and response { response: "..." }. fetch is the standard browser API for HTTP; JSON is a
 * common wire format both sides can parse.
 *
 * Same-origin API URL:
 * This app is meant to be opened from the same server that serves the API (e.g. http://localhost:5000/
 * in dev, or your Railway URL in production). Using window.location.origin + '/chat' means the browser
 * always talks to the host that served the HTML—no hard-coded localhost in production builds.
 * Do not open main.html as file:// ; use the Express server so origin matches.
 */
(function () {
  'use strict';

  const inputField = document.getElementById('Input');
  const submitButton = document.getElementById('submit');
  /** #prompt is reused as an anchor point to insert the scrollable chat area above the input row */
  const promptSection = document.getElementById('prompt');

  if (!inputField || !submitButton || !promptSection) {
    console.error('Required DOM elements missing. Expected #Input, #submit, #prompt.');
    return;
  }

  /** Full URL for the chat endpoint on the current host (e.g. https://myapp.up.railway.app/chat) */
  const CHAT_URL = `${window.location.origin}/chat`;

  submitButton.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', function onKeypress(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  /**
   * sendMessage — read input, POST to backend, update UI.
   * async function allows await fetch(...) without blocking the browser’s main thread; the UI stays responsive.
   */
  async function sendMessage() {
    const userMessage = inputField.value.trim();
    if (!userMessage) {
      window.alert('Please enter a message.');
      return;
    }

    displayMessage(userMessage, 'user');
    inputField.value = '';

    const loadingId = displayMessage('Thinking…', 'ai');

    try {
      /**
       * fetch options:
       * - method POST: create-side semantics for sending a body (here, the user message).
       * - headers Content-Type tells the server to interpret the body as JSON.
       * - body: JSON.stringify serializes a JS object to a string; must match Content-Type.
       */
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      /**
       * response.ok is true for HTTP 200–299. For 4xx/5xx we still get a resolved Promise from fetch;
       * we must check ok and optionally read error JSON from the body for better UX.
       */
      const rawText = await response.text();
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errMsg = data.error || `Request failed (${response.status})`;
        throw new Error(errMsg);
      }

      if (typeof data.response !== 'string') {
        throw new Error('Invalid response from server: missing response string.');
      }

      updateMessage(loadingId, data.response);
    } catch (error) {
      console.error('sendMessage:', error);
      updateMessage(
        loadingId,
        `Error: ${error.message}. If running locally, start the backend from the backend folder (npm start) and open this page via that server (not file://).`
      );
    }
  }

  /**
   * displayMessage — creates a div, applies inline styles (could be moved to CSS classes),
   * inserts into a scrollable #chat-container. Returns an id so updateMessage can replace "Thinking…".
   *
   * Security note: for AI text we use innerHTML with light markdown-like transforms. Model output can
   * contain HTML-like strings; in a production app you might sanitize (e.g. DOMPurify). Here we only
   * substitute **bold** and bullets for readability.
   */
  function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    messageDiv.id = messageId;
    messageDiv.style.cssText = [
      'margin:10px 0',
      'padding:12px 15px',
      'border-radius:8px',
      'max-width:70%',
      'word-wrap:break-word',
      'background-color:' + (sender === 'user' ? '#007bff' : '#e9ecef'),
      'color:' + (sender === 'user' ? '#fff' : '#333'),
      'align-self:' + (sender === 'user' ? 'flex-end' : 'flex-start'),
    ].join(';');

    if (sender === 'ai') {
      text = formatAiHtml(text);
    }
    messageDiv.innerHTML = sender === 'ai' ? text : escapeHtml(text);

    let chatContainer = document.getElementById('chat-container');
    if (!chatContainer) {
      chatContainer = document.createElement('div');
      chatContainer.id = 'chat-container';
      chatContainer.style.cssText = [
        'display:flex',
        'flex-direction:column',
        'gap:10px',
        'margin-bottom:20px',
        'padding:20px',
        'background-color:#f9f9f9',
        'border-radius:8px',
        'min-height:200px',
        'max-height:400px',
        'overflow-y:auto',
        'border:1px solid #ddd',
      ].join(';');
      promptSection.parentNode.insertBefore(chatContainer, promptSection);
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageId;
  }

  function updateMessage(messageId, newText) {
    const el = document.getElementById(messageId);
    if (!el) return;
    el.innerHTML = formatAiHtml(newText);
  }

  /** Minimal HTML escape for user-authored text (displayed as text nodes via textContent would be safer; we use escape + text for user path above). */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Apply the same visual tweaks we used before: **bold**, bullet lines, numbered lists. */
  function formatAiHtml(text) {
    let t = String(text);
    t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\* /g, '• ');
    t = t.replace(/(\d+)\. /g, '<br/>$1. ');
    return t;
  }
})();
