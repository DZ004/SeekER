// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEcU9tuUTT8s5S5ITsqc_WJPJwZlWoirE",
    authDomain: "ccon-agent.firebaseapp.com",
    databaseURL: "https://ccon-agent-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ccon-agent",
    storageBucket: "ccon-agent.appspot.com",
    messagingSenderId: "359769265591",
    appId: "1:359769265591:web:ecff5a5934c60717a3c432"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Check if user is logged in or not
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        // User is not signed in, redirect to login page
        window.location.href = 'login.html'; // Replace with your login page URL
    } else {
        // User is signed in, display messages and scores
        fetchUsers();
        displayUserMessages(user.uid);
        fetchMessages();
        displayScores(user.uid);
    }
});

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim(); // Trim to remove leading/trailing whitespace

    if (message !== '') {
        const sender = firebase.auth().currentUser.email;
        const messagesRef = database.ref('messages');
        messagesRef.push({
            sender: sender,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        messageInput.value = '';
    } else {
        alert('Please enter a message.');
    }
}

// Function to fetch registered users
function fetchUsers() {
    const usersRef = database.ref('users');
    usersRef.on('value', (snapshot) => {
        const users = snapshot.val();
        const userSelect = document.getElementById('userSelect');
        userSelect.innerHTML = '<option value="">Select a user</option>';
        for (let key in users) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = users[key].email; // Assuming user data structure has email field
            userSelect.appendChild(option);
        }
    });
}

// Function to display messages for a specific user
function displayUserMessages(userId) {
    const messagesRef = database.ref(`users/${userId}/messages`);
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${message.sender}</strong>: ${message.text} <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>`;
        document.getElementById('messages').appendChild(messageElement);
        // Scroll to the bottom of the messages div
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    });
}

// Listen for Enter key press in message input to send message
document.getElementById('messageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Function to fetch and display messages
function fetchMessages() {
    const messagesRef = database.ref('messages');
    messagesRef.on('value', (snapshot) => {
        const messages = snapshot.val();
        document.getElementById('messagesList').innerHTML = ''; // Clear previous messages

        for (let key in messages) {
            if (messages.hasOwnProperty(key)) {
                const message = messages[key];
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = `<strong>${message.sender}</strong>: ${message.text}`;
                document.getElementById('messagesList').appendChild(messageElement);
            }
        }
    });
}

// Call fetchUsers on page load to populate userSelect options
document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();
});

// Function to display scores
function displayScores(userId) {
    const scoresRef = database.ref('scores').child(userId);
    scoresRef.on('value', (snapshot) => {
        const scores = snapshot.val();
        if (scores) {
            document.getElementById('dailyScore').textContent = scores.daily || 0;
            document.getElementById('weeklyScore').textContent = scores.weekly || 0;
            document.getElementById('monthlyScore').textContent = scores.monthly || 0;
        }
    });
}

// Function to logout
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html'; // Replace with your login page URL
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

// Emoji Picker Initialization
const emojiPicker = document.getElementById('emojiPicker');
const messageInput = document.getElementById('messageInput');

emojiPicker.addEventListener('emoji-click', (event) => {
    const emoji = event.detail.unicode;
    messageInput.value += emoji; // Append emoji to the message input
});

// Call fetchMessages on page load to populate messages
document.addEventListener('DOMContentLoaded', fetchMessages);
