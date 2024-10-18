// Function to check if user is logged in
function isLoggedIn() {
    // Check if the token exists in localStorage (or sessionStorage)
    return localStorage.getItem('token') !== null;
}

// Function to redirect logged-in users
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        // Redirect to a different page (e.g., profile page or homepage)
        window.location.href = "/profile.html";  // Change this to the page you want to redirect to
    }
}

// Check if the current page is login or register
const restrictedPagesForLoggedIn = ["login.html", "register.html"];
const currentPage = window.location.pathname.split("/").pop();

if (restrictedPagesForLoggedIn.includes(currentPage)) {
    redirectIfLoggedIn();
}
