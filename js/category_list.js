document.addEventListener('DOMContentLoaded', function() {
    const rowElement = document.querySelector('.category-list');
    const noResultsImage = document.getElementById('no-results-image');
    const categoryNameElement = document.getElementById('category-name'); // Element to display the category name, but we won't use it

    // Function to get the query parameter value by name
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Fetch recipes based on category ID
    function fetchRecipesByCategory(categoryId) {
        const apiUrl = `${apiBaseUrl}/api/filter/?category=${categoryId}`; // Adjust this URL as needed

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
            rowElement.innerHTML = '';

            // Check if results exist
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(recipe => {
                    const recipeDiv = document.createElement('div');
                    recipeDiv.classList.add('col-12', 'col-sm-6', 'col-lg-4');

                    // Calculate average rating based on reviews
                    const averageRating = calculateAverageRating(recipe.reviews); // Average rating
                    const starRating = generateStarRating(averageRating); // Average rating stars

                    recipeDiv.innerHTML = `
                        <div class="single-best-receipe-area mb-30">
                            <img src="${recipe.image}" alt="${recipe.title}">
                            <div class="receipe-content">
                                <a href="recipe_detail.html?slug=${recipe.slug}">
                                    <h5>${recipe.title}</h5>
                                </a>

                                <div class="ratings">
                                    <div class="average-rating">Average Rating: ${starRating}</div>
                                </div>

                            </div>
                        </div>
                    `;
                    rowElement.appendChild(recipeDiv);
                });
                noResultsImage.style.display = 'none'; // Hide no results image if there are results
            } else {
                // No results found
                console.log('No recipes found for this category'); // Log for clarity
                noResultsImage.style.display = 'block'; // Show the image
            }
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            noResultsImage.style.display = 'block'; // Show the image on error as well
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


    // Removed the fetchCategoryName function as it's not needed anymore

    // Get the category ID from the URL and fetch recipes
    const categoryId = getQueryParam('category');
    if (categoryId) {
        fetchRecipesByCategory(categoryId); // Fetch recipes for the category only
    } else {
        console.error('No category ID provided in the URL');
    }
});
