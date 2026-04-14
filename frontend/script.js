// ===== THE WEBSITE BRAIN (FRONTEND SCRIPT) =====
// This runs on the user's computer and handles what they see and click

// ===== STEP 1: GRAB THE BUTTONS AND TEXT BOXES =====
// These are like grabbing the toys from the shelf

// Find the input box where user types their message
const inputField = document.getElementById('Input');

// Find the send button (the arrow ➡️)
const submitButton = document.getElementById('submit');

// Find the title div (we'll use this area to show the chat)
const chatArea = document.getElementById('prompt');

// ===== STEP 2: THE MAGIC ADDRESS (WHERE TO SEND MESSAGES) =====
// This is the address of our brain (backend)
// http://localhost:5000 = the computer's own address
// /chat = the mailbox on that computer
const API_URL = 'http://localhost:5000/chat';

// ===== STEP 3: WHEN THE USER CLICKS THE BUTTON, SOMETHING HAPPENS =====
// This is like: "When I press the button, do this:"
submitButton.addEventListener('click', sendMessage);

// ALSO: Let them press ENTER key to send (easier than clicking)
inputField.addEventListener('keypress', (event) => {
  // Only send if they pressed the ENTER key
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// ===== STEP 4: THE SENDING FUNCTION (THE MAIN MAGIC) =====
// This is the actual work that happens when we send a message
async function sendMessage() {
  // Get what the user typed
  const userMessage = inputField.value.trim();

  // SAFETY: Make sure they actually typed something
  if (!userMessage) {
    alert('Please write something! 😊');
    return;
  }

  // Show the user's message on the screen
  displayMessage(userMessage, 'user');

  // Clear the input box (empty it)
  inputField.value = '';

  // Show "loading" message while waiting for the AI
  const loadingId = displayMessage('🤖 Thinking...', 'ai');

  try {
    // ===== STEP 5: SEND THE MESSAGE TO THE BACKEND =====
    // This is like sending a letter to the post office
    const response = await fetch(API_URL, {
      method: 'POST',           // We're SENDING data (not asking for it)
      headers: {
        'Content-Type': 'application/json' // We're sending text in JSON format
      },
      body: JSON.stringify({
        message: userMessage    // Put the user's message in the envelope
      })
    });

    // ===== STEP 6: CHECK IF THE MESSAGE WAS RECEIVED OKAY =====
    // Was the post office happy? Or did something go wrong?
    if (!response.ok) {
      throw new Error('The server said no! Check if the backend is running.');
    }

    // ===== STEP 7: UNWRAP THE ANSWER (GET THE AI'S RESPONSE) =====
    // Open the letter from the post office and read it
    const data = await response.json();

    // Get the AI's actual answer text
    const aiMessage = data.response;

    // ===== STEP 8: SHOW THE AI'S ANSWER ON THE SCREEN =====
    // Replace the "Thinking..." with the actual answer
    updateMessage(loadingId, aiMessage);

  } catch (error) {
    // ===== STEP 9: SOMETHING WENT WRONG (ERROR HANDLING) =====
    // If the post office delivers bad mail, show the error
    console.error('Error:', error);

    updateMessage(
      loadingId,
      '❌ Oops! Something went wrong. Is the backend running? (Try running `npm start` in the backend folder)'
    );
  }
}

// ===== STEP 10: SHOW MESSAGE ON SCREEN FUNCTION =====
// This function adds a message to the chat display
function displayMessage(text, sender) {
  // Create a new message bubble
  const messageDiv = document.createElement('div');

  // Give it a unique ID so we can update it later
  const messageId = 'msg-' + Date.now();
  messageDiv.id = messageId;

  // Make it look nice with CSS
  messageDiv.style.cssText = `
    margin: 10px 0;
    padding: 12px 15px;
    border-radius: 8px;
    max-width: 70%;
    word-wrap: break-word;
    background-color: ${sender === 'user' ? '#007bff' : '#e9ecef'};
    color: ${sender === 'user' ? '#fff' : '#333'};
    align-self: ${sender === 'user' ? 'flex-end' : 'flex-start'};
  `;

  // ===== CONVERT ASTERISKS TO BULLET POINTS =====
  // This makes the message look nicer with proper formatting
  if (sender === 'ai') {
    // Replace ** with bold text formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace lines starting with * with proper bullets
    text = text.replace(/\* /g, '• ');
    // Replace numbered lists (1. 2. 3. etc) with proper formatting
    text = text.replace(/(\d+)\. /g, '<br/>$1. ');
  }

  // Add the text to the message bubble (using innerHTML to support bold formatting)
  messageDiv.innerHTML = text;

  // Create a chat container if it doesn't exist yet
  let chatContainer = document.getElementById('chat-container');
  if (!chatContainer) {
    chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      min-height: 200px;
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #ddd;
    `;

    // Add the chat container BEFORE the prompt box
    chatArea.parentNode.insertBefore(chatContainer, chatArea);
  }

  // Add the message bubble to the chat
  chatContainer.appendChild(messageDiv);

  // Scroll to the newest message
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Return the message ID so we can update it later
  return messageId;
}

// ===== STEP 11: UPDATE MESSAGE FUNCTION =====
// This changes a message (like fixing a typo)
function updateMessage(messageId, newText) {
  const messageElement = document.getElementById(messageId);
  if (messageElement) {
    // ===== CONVERT FORMATTING =====
    // Replace ** with bold text formatting
    newText = newText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace lines starting with * with proper bullets
    newText = newText.replace(/\* /g, '• ');
    // Replace numbered lists (1. 2. 3. etc) with proper formatting
    newText = newText.replace(/(\d+)\. /g, '<br/>$1. ');
    
    // Update with HTML support
    messageElement.innerHTML = newText;
  }
}
