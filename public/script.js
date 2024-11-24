const socket = io(); // Connect to the WebSocket server

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const fileInput = document.getElementById('file-input');
const setUsernameContainer = document.getElementById('set-username');
const chatArea = document.getElementById('chat-area');

// Add a message to the chat box
function addMessage(data) {
  const message = document.createElement('div');
  message.classList.add('chat-message');
  message.style.backgroundColor = data.color || '#e4e6eb'; // Assign a color to the message
  message.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;

  if (data.isImage) {
    const img = document.createElement('img');
    img.src = data.message;
    message.appendChild(img);
  }

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}

// Set username and color
document.getElementById('set-username-button').addEventListener('click', () => {
  const username = document.getElementById('username-input').value.trim();
  if (username) {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color
    localStorage.setItem('username', username);
    localStorage.setItem('color', color);
    setUsernameContainer.classList.add('hidden');
    chatArea.classList.remove('hidden');
  }
});

// Send a message to the server
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    const data = {
      username: localStorage.getItem('username') || 'Anonymous',
      message,
      color: localStorage.getItem('color') || '#000'
    };
    socket.emit('chat message', data); // Send message to the server
    messageInput.value = ''; // Clear the input
  }
});

// Handle file upload
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = {
        username: localStorage.getItem('username') || 'Anonymous',
        message: e.target.result, // File content (Base64)
        color: localStorage.getItem('color') || '#000',
        isImage: true
      };
      socket.emit('chat message', data); // Send file to server
    };
    reader.readAsDataURL(file); // Convert file to Base64
  }
});

// Receive a message from the server
socket.on('chat message', (data) => {
  addMessage(data);
});

// Prompt the user for a username and color on first load
if (!localStorage.getItem('username')) {
  const username = prompt('Enter your username:') || 'Anonymous';
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  localStorage.setItem('username', username);
  localStorage.setItem('color', color);
}
