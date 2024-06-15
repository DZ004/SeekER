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
const auth = firebase.auth();
const database = firebase.database();

// Check if user is logged in or not
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        window.location.href = 'index.html'; // Redirect to main chat interface if logged in
    } else {
        // User is not signed in
        console.log('User is not logged in');
    }
});

// Handle login form submission
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Firebase login
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Logged in successfully, redirect to main page or perform other actions
            window.location.href = 'index.html'; // Redirect to main chat interface
        })
        .catch((error) => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            document.getElementById('loginError').innerText = errorMessage;
        });
});

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    if (message.trim() !== '') { // Added trim() to ensure only non-empty messages are sent
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
