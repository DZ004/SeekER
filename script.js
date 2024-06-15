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
