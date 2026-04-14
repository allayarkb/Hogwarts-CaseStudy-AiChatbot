// ===== THIS IS THE BRAIN OF OUR APP (LIKE A HELPER) =====
// This file handles all the magic - it talks to the AI and gives answers back

// ===== STEP 1: BRING IN OUR HELPERS (PACKAGES) =====
// Think of these like toys/tools we need to build our house

// express = helps us receive messages (like a mailbox)
const express = require('express');

// cors = lets our website frontend talk to this backend (like a telephone line)
const cors = require('cors');

// dotenv = helps us keep secrets safe (like a safe box for passwords)
require('dotenv').config();

// axios = helps us send messages to the AI (like a messenger)
const axios = require('axios');

// ===== STEP 2: CREATE THE APP (LIKE TURNING ON A MACHINE) =====
const app = express();
const PORT = process.env.PORT || 5000;

// ===== STEP 3: SET UP THE HELPERS =====
// This tells express to understand when we receive text messages
app.use(express.json());

// This lets our website talk to this machine (no blocking allowed!)
app.use(cors());

// ===== STEP 4: CREATE A "MAILBOX" TO RECEIVE MESSAGES =====
// When someone sends a message with /chat, this runs
app.post('/chat', async (req, res) => {
  try {
    // Get the message the user sent
    const { message } = req.body;

    // SAFETY CHECK: Make sure user actually sent a message!
    if (!message) {
      return res.status(400).json({ error: 'Please send a message!' });
    }

    // SAFETY CHECK: Make sure we have the API key (the secret password to talk to AI)
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'The secret key is missing! Ask the owner to set it up.' });
    }

    // ===== STEP 5: SEND MESSAGE TO THE AI (GROQ) =====
    // We're now asking the AI to think and answer
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        // This is like a conversation - we tell the AI what to think about
        model: 'llama-3.1-8b-instant', // The AI brain we're using (currently supported by Groq)
        messages: [
          {
            role: 'user',         // This is from the human
            content: message      // The question/message from user
          }
        ],
        temperature: 0.7,         // How creative should the answer be? (0=not creative, 1=very creative)
        max_tokens: 1000          // Maximum words the AI can say
      },
      {
        // This is like the secret password to talk to the AI
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // ===== STEP 6: GET THE ANSWER FROM AI =====
    // Extract the text answer from the AI's response
    const aiResponse = response.data.choices[0].message.content;

    // ===== STEP 7: SEND ANSWER BACK TO THE WEBSITE =====
    // Send the AI's answer back to the user's website
    res.json({ response: aiResponse });

  } catch (error) {
    // ===== STEP 8: HANDLE PROBLEMS (IF SOMETHING GOES WRONG) =====
    console.error('Error caught:', error);
    console.error('Error message:', error.message);
    
    // Show detailed error info from the API
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);
      
      // The AI server said "No!" to our request
      return res.status(500).json({
        error: 'The AI said no. Check the backend console for details.'
      });
    }

    // Something else went wrong
    res.status(500).json({ error: 'Oh no! Something broke. Please try again later.' });
  }
});

// ===== STEP 9: MAKE SURE THE SERVER IS RUNNING =====
// This is like turning on a light - it tells us the machine is ready
app.listen(PORT, () => {
  console.log(`✅ The chat brain is running! Go to http://localhost:${PORT}`);
  console.log(`📝 Send your message to: http://localhost:${PORT}/chat`);
});
