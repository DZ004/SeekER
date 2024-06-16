// Function to update worker's online status
function updateOnlineStatus(isOnline) {
    const userId = firebase.auth().currentUser.uid;
    const onlineRef = database.ref('online-workers').child(userId);

    // Set online status to true/false based on isOnline parameter
    onlineRef.set({
        online: isOnline,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

// Function to fetch and display number of online workers
function fetchOnlineWorkers() {
    const onlineWorkersRef = database.ref('online-workers');
    onlineWorkersRef.on('value', (snapshot) => {
        const onlineWorkers = snapshot.numChildren(); // Count number of online workers
        document.getElementById('onlineWorkersCount').textContent = onlineWorkers;
    });
}

// Call fetchOnlineWorkers on page load to initialize count
document.addEventListener('DOMContentLoaded', function() {
    fetchOnlineWorkers();

    // Update current user's online status to true
    updateOnlineStatus(true);
});

// Update online status when user is authenticated
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Update current user's online status to true
        updateOnlineStatus(true);
    }
});

// Update online status when user logs out
function logout() {
    firebase.auth().signOut().then(() => {
        // Update current user's online status to false
        updateOnlineStatus(false);
        window.location.href = 'login.html'; // Redirect to login page
    }).catch((error) => {
        console.error('Logout error:', error);
    });
});

// Update online status when user closes the window/tab
window.addEventListener('beforeunload', function() {
    // Update current user's online status to false
    updateOnlineStatus(false);
});
