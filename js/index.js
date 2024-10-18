document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('login-link');
    const userDropdown = document.getElementById('user-dropdown');
    const userMenu = document.getElementById('user-menu');
    const recipeContainer = document.querySelector('.home-list'); // Container to append recipes

    // Check if the user is logged in by looking for a token and username in localStorage
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');  // Assuming you stored the username on login

    if (token && username) {
        // User is logged in, show their name and the dropdown
        loginLink.innerHTML = username;  // Display username instead of "Login"
        loginLink.href = "#";  // Disable login link as user is logged in
        userDropdown.style.display = "block";  // Show the dropdown menu
    } else {
        // User is not logged in, show the "Login" button and hide the dropdown
        userDropdown.style.display = "none";  // Make sure the dropdown is hidden
        loginLink.innerHTML = "Login";  // Display "Login" link
        loginLink.href = "login.html";  // Redirect to login page
    }

    // Add a logout functionality to the "Logout" link
    const logoutLink = userDropdown.querySelector('a[href="#"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function () {
            // Clear token and username from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            
            // Optionally, redirect the user to the homepage or login page
            window.location.href = 'login.html';  // Redirect to login after logout
        });
    }

    // Fetch data from /api/home/
    function fetchRecipes() {
        const apiUrl = `${apiBaseUrl}/api/home/`;  // Adjust the API URL as needed

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear the current list of recipes
            recipeContainer.innerHTML = '';

            // Check if there are any recipes returned by the API
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(recipe => {
                    const recipeDiv = document.createElement('div');
                    recipeDiv.classList.add('col-12', 'col-sm-6', 'col-lg-4');

                    // Calculate average rating based on reviews
                    const averageRating = calculateAverageRating(recipe.reviews); // Average rating
                    const starRating = generateStarRating(averageRating); // Average rating stars

                    recipeDiv.innerHTML = `
                        <div class="single-small-receipe-area d-flex">
                            <!-- Receipe Thumb -->
                            <div class="receipe-thumb">
                                <img src="${recipe.image}" alt="${recipe.title}">
                            </div>
                            <!-- Receipe Content -->
                            <div class="receipe-content">
                                <span>${new Date(recipe.created_at).toLocaleDateString()}</span>
                                <a href="recipe_detail.html?slug=${recipe.slug}">
                                    <h5>${recipe.title}</h5>
                                </a>
                                <div class="ratings">
                                    ${starRating}
                                </div>
                                <p>${recipe.reviews.length} Comments</p>
                            </div>
                        </div>
                    `;
                    recipeContainer.appendChild(recipeDiv);
                });
            } else {
                console.log('No recipes found');  // Log message if no recipes are found
            }
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
    }

    // Function to calculate the average rating from reviews
    function calculateAverageRating(reviews) {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); // Return average rounded to one decimal
    }

    // Function to generate star rating HTML based on rating value
    function generateStarRating(rating) {
        const fullStar = '<i class="fa fa-star" aria-hidden="true"></i>';
        const emptyStar = '<i class="fa fa-star-o" aria-hidden="true"></i>';
        let starsHtml = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHtml += fullStar; // Full star
            } else {
                starsHtml += emptyStar; // Empty star
            }
        }
        return starsHtml;
    }

    // Fetch recipes on page load
    fetchRecipes();
});
