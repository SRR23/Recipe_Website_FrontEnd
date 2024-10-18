// Function to check if user is logged in
function isLoggedIn() {
    // Check if the token exists in localStorage (or sessionStorage)
    return localStorage.getItem('token') !== null;
}

// Function to redirect non-logged-in users
function redirectToLogin() {
    if (!isLoggedIn()) {
        // Redirect to login page
        window.location.href = "/login.html";
    }
}

// Check if the current page is restricted for non-logged-in users
const restrictedPages = ["profile.html", "my_recipe.html", "favourite_recipe.html", "add_recipe.html", "update_recipe.html"];
const currentPage = window.location.pathname.split("/").pop();

if (restrictedPages.includes(currentPage)) {
    redirectToLogin();
}
