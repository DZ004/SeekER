// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB1u--AsxPIjmCyzJHECLoHtsHorgi7G2Y",
    authDomain: "seeker-928e7.firebaseapp.com",
    projectId: "seeker-928e7",
    storageBucket: "seeker-928e7.appspot.com",
    messagingSenderId: "652562231057",
    appId: "1:652562231057:web:a87b53314d0be9e4ae26b0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Function to update creator's online status
function updateOnlineStatus(isOnline) {
    const userId = auth.currentUser.uid;
    const onlineRef = ref(database, 'online-creators/' + userId);

    // Set online status to true/false based on isOnline parameter
    set(onlineRef, {
        online: isOnline,
        timestamp: new Date().getTime() // Use current timestamp
    });
}

// Function to fetch and display number of online creators
function fetchOnlineCreators() {
    const onlineCreatorsRef = ref(database, 'online-creators');
    onValue(onlineCreatorsRef, (snapshot) => {
        const onlineCreators = snapshot.numChildren(); // Count number of online creators
        document.getElementById('onlineCreatorsCount').textContent = onlineCreators;
    });
}

// Call fetchOnlineCreators on page load to initialize count
document.addEventListener('DOMContentLoaded', function() {
    fetchOnlineCreators();

    // Update current user's online status to true
    updateOnlineStatus(true);
});

// Update online status when user is authenticated
auth.onAuthStateChanged((user) => {
    if (user) {
        // Update current user's online status to true
        updateOnlineStatus(true);
    }
});

// Update online status when user logs out
function logout() {
    auth.signOut().then(() => {
        // Update current user's online status to false
        updateOnlineStatus(false);
        window.location.href = 'login.html'; // Redirect to login page
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

// Update online status when user closes the window/tab
window.addEventListener('beforeunload', function() {
    // Update current user's online status to false
    updateOnlineStatus(false);
});

// Function to handle creator signup
const signupForm = document.querySelector('#signupForm');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm['email'].value;
    const password = signupForm['password'].value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Additional data saving (display name, content category) can be done here
        console.log('Successfully signed up:', userCredential.user);
        // Redirect to creator dashboard or login page
        window.location.assign('login.html');
    } catch (error) {
        document.querySelector('#signupError').textContent = error.message;
    }
});

// Function to handle creator login
const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Successfully logged in:', userCredential.user);
        // Redirect to creator dashboard or desired page
        window.location.assign('dashboard.html');
    } catch (error) {
        document.querySelector('#loginError').textContent = error.message;
    }
});
