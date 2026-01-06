// Check authentication
(function() {
    const isLoggedIn = localStorage.getItem('ai_robot_logged_in') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    // Allow login page
    if (currentPage === 'login.html') {
        return;
    }
    
    // Redirect to login if not logged in
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
})();

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('ai_robot_logged_in');
        localStorage.removeItem('ai_robot_username');
        localStorage.removeItem('ai_robot_login_time');
        window.location.href = 'login.html';
    }
}

// Get username
function getUsername() {
    return localStorage.getItem('ai_robot_username') || 'Guest';
}
