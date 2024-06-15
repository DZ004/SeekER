// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEcU9tuUTT8s5S5ITsqc_WJPJwZlWoirE",
  authDomain: "ccon-agent.firebaseapp.com",
  databaseURL: "https://console.firebase.google.com/u/0/project/ccon-agent/database/ccon-agent-default-rtdb/data/~2F",
  projectId: "ccon-agent",
  storageBucket: "ccon-agent.appspot.com",
  messagingSenderId: "359769265591",
  appId: "1:359769265591:web:ecff5a5934c60717a3c432"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    if (message) {
        const messagesRef = database.ref('messages');
        messagesRef.push({
            text: message
        });
        document.getElementById('messageInput').value = '';
    }
}

function displayMessages() {
    const messagesRef = database.ref('messages');
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val().text;
        const messageElement = document.createElement('p');
        messageElement.innerText = message;
        document.getElementById('messages').appendChild(messageElement);
    });
}

// Initialize message display
displayMessages();
