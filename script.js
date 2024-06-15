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
            text: message
        });
        messageInput.value = '';
    } else {
        alert('Please enter a message.');
    }
}

// Firebase initialization and configuration (already defined in your script.js)

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

// Function to send a message to a selected user
function sendMessage() {
    const userId = document.getElementById('userSelect').value;
    const message = document.getElementById('messageInput').value.trim();

    if (userId && message) {
        const sender = 'Admin'; // Set sender as admin or whoever is sending the message
        const messagesRef = database.ref(`users/${userId}/messages`);
        messagesRef.push({
            sender: sender,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        alert('Message sent successfully!');
        document.getElementById('messageInput').value = ''; // Clear message input
    } else {
        alert('Please select a user and enter a message.');
    }
}

// Call fetchUsers on page load to populate userSelect options
document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();
});


// Function to display messages
function displayMessages() {
    const messagesRef = database.ref('messages');
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${message.sender}</strong>: ${message.text}`;
        document.getElementById('messages').appendChild(messageElement);
        // Scroll to the bottom of the messages div
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    });
}

// Initialize message display
displayMessages();

// Listen for Enter key press in message input to send message
document.getElementById('messageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
