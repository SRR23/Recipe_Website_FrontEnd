document.addEventListener('DOMContentLoaded', function () {
    const addFavoritesButton = document.querySelector('#is_favourited'); // Adjust selector based on your HTML

    // Check if the user is logged in by checking for token or session
    const isLoggedIn = !!localStorage.getItem('token');

    // If user is logged in, fetch favorite recipes
    if (isLoggedIn) {
        fetchFavoriteRecipes();
    }

    function fetchFavoriteRecipes() {
        fetch(`${apiBaseUrl}/api/favourite-list/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch favorite recipes: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayFavoriteRecipes(data);
        })
        .catch(error => console.error('Error fetching favorite recipes:', error));
    }

    function displayFavoriteRecipes(recipes) {
        const favoriteRecipesContainer = document.querySelector('.favourite-recipe');
        favoriteRecipesContainer.innerHTML = ''; // Clear previous recipes

        if (recipes.length === 0) {
            favoriteRecipesContainer.innerHTML = '<p>No favorite recipes found.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('col-12', 'col-sm-6', 'col-lg-4');
            recipeDiv.setAttribute('id', `recipe-${recipe.slug}`); // Add unique ID for deletion

            // Calculate average rating based on reviews
            const averageRating = calculateAverageRating(recipe.reviews);
            const starRating = generateStarRating(averageRating);

            recipeDiv.innerHTML = `
                <div class="single-best-receipe-area mb-30">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="receipe-content">
                        <a href="recipe_detail.html?slug=${recipe.slug}" title="${recipe.slug}">
                            <h5 class="recipe-title">${recipe.title}</h5>
                        </a>
                        <div class="ratings">
                            <div class="average-rating">Average Rating: ${starRating}</div>
                        </div>
                        <button class="delete-favorite" data-slug="${recipe.slug}" title="Delete ${recipe.slug}">
                            <i class="fa fa-trash" aria-hidden="true"></i> <!-- Delete icon -->
                        </button>
                    </div>
                </div>
            `;

            favoriteRecipesContainer.appendChild(recipeDiv);
        });

        // Add event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-favorite');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const slug = this.getAttribute('data-slug');
                deleteFavoriteRecipe(slug);
            });
        });
    }

    function deleteFavoriteRecipe(slug) {
        fetch(`${apiBaseUrl}/api/favourite-list/${slug}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete favorite: ${response.statusText}`);
            }

            // Immediately remove the deleted recipe from the UI
            const recipeElement = document.getElementById(`recipe-${slug}`);
            if (recipeElement) {
                recipeElement.remove(); // Remove recipe element from the DOM
            }

            Swal.fire({
                title: 'Deleted!',
                text: 'Recipe has been removed from favorites.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        })
        .catch(error => {
            console.error('Error deleting favorite:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to remove from favorites. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    // Function to calculate average rating from reviews
    function calculateAverageRating(reviews) {
        if (!reviews || reviews.length === 0) return 0; // No reviews, return 0
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); // Return average rating rounded to one decimal
    }

    // Function to generate star rating HTML based on average rating
    function generateStarRating(averageRating) {
        const fullStars = Math.floor(averageRating);
        const halfStar = averageRating % 1 !== 0 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fa fa-star" aria-hidden="true"></i>'; // Full star
        }
        if (halfStar) {
            starsHTML += '<i class="fa fa-star-half-o" aria-hidden="true"></i>'; // Half star
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="fa fa-star-o" aria-hidden="true"></i>'; // Empty star
        }
        return starsHTML; // Return the generated HTML
    }
});
