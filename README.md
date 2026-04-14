# 🤖 AI Chat Assistant - Complete Setup Guide

This is a simple AI chat application with a **Frontend** (what you see) and **Backend** (the brain that talks to AI).

---

## 📋 What You Need

- **Node.js** installed (Download from: https://nodejs.org/)
- A **Groq API Key** (Free! Get it from: https://console.groq.com/)

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1️⃣: Get Your Secret API Key
1. Go to https://console.groq.com/
2. Sign up (it's free!)
3. Click "API Keys" on the left menu
4. Click "Create New API Key"
5. Copy the key and **save it somewhere safe** 📝

### STEP 2️⃣: Set Up the Backend

1. Open a **new terminal** window
2. Go to the backend folder:
   ```
   cd backend
   ```

3. Install all the helpers (packages):
   ```
   npm install
   ```
   (This might take 1-2 minutes ⏳)

4. Create a `.env` file:
   - Copy `.env.example` and rename it to `.env`
   - Open `.env` with a text editor
   - Replace `put-your-groq-key-here` with your **actual API key**
   
   It should look like:
   ```
   GROQ_API_KEY="gsk_your_actual_key_here_12345"
   PORT=5000
   ```

5. **START THE BACKEND**:
   ```
   npm start
   ```
   
   You should see: ✅ **The chat brain is running! Go to http://localhost:5000**

✋ **KEEP THIS TERMINAL OPEN!** It needs to stay running!

### STEP 3️⃣: Open the Frontend

1. Open your **frontend/main.html** file in VS Code
2. Right-click on the file and select **"Open with Live Server"**
   - If you don't see this option, install the "Live Server" extension first
   
3. Your website should open in the browser! 🎉

---

## ✅ How It Works

1. **You type a message** → It goes to `script.js` in your browser
2. **script.js sends it** → Goes to the backend at `http://localhost:5000/chat`
3. **Backend receives it** → It's in `index.js`
4. **Backend sends to AI** → Uses your Groq API key
5. **AI thinks and answers** → Groq API responds
6. **Backend sends answer back** → To your website
7. **You see the answer!** 🤖

---

## 🎯 Testing It Out

1. Make sure:
   - ✅ Backend is running (terminal shows the green ✅ message)
   - ✅ Frontend is open (website is showing)

2. Type a message like: "Hello! What is 2+2?"

3. Click the **➡️ button** (or press ENTER)

4. Wait for the AI to think... 💭

5. See the answer appear! 🎉

---

## 🚨 PROBLEMS? Here's How to Fix Them

### Problem: "Cannot POST /chat"
- **Solution**: The backend is NOT running!
- Fix: Go back to the terminal, make sure `npm start` is still running

### Problem: "API key is missing!"
- **Solution**: You didn't set up the `.env` file correctly
- Fix: Double-check that `.env` has your real API key (not the example text)

### Problem: "Something went wrong"
- **Solution**: Check the browser console (Press F12 → Console tab) to see the error
- Or check the backend terminal for error messages

### Problem: "Port 5000 is already in use"
- **Solution**: Another program is using port 5000
- Fix: Change `PORT=5000` to `PORT=5001` in your `.env` file
- Also update `API_URL` in `script.js` to use `:5001`

---

## 📁 Project Structure

```
Hogwarts Case Study/
├── frontend/
│   ├── main.html      ← The website (what you see)
│   ├── style.css      ← How it looks (colors, sizes)
│   └── script.js      ← The website's brain (handles clicks & messages)
│
└── backend/
    ├── index.js       ← The backend brain (talks to AI)
    ├── package.json   ← List of helpers we need
    ├── .env.example   ← Template for secrets
    └── .env           ← Your actual secrets (add this yourself!)
```

---

## 🔒 Security Note

- **NEVER** share your `.env` file or API key with anyone!
- **NEVER** commit `.env` to GitHub!
- The `.env` file is in `.gitignore` already, so it won't be shared

---

## 📚 What Each Part Does

### Frontend (`script.js`)
- Listens for when you click the button
- Sends your message to the backend
- Shows the AI's answer on screen

### Backend (`index.js`)
- Receives your message
- Checks if everything is okay (error handling)
- Sends your message to Groq AI
- Gets the answer from Groq
- Sends the answer back to frontend

### Groq API
- The actual AI brain (free!)
- Thinks about your question
- Gives the answer

---

## 💡 Tips

- Type natural questions: "What's the capital of France?" ✅
- The AI can answer almost anything!
- If the answer is wrong, try asking differently
- Keep the backend terminal open while using the app!

---

**Enjoy chatting with AI! 🚀**
