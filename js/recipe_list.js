document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = `${apiBaseUrl}/api/recipes/`;
    const rowElement = document.querySelector('.recipe-list');
    const paginationElement = document.querySelector('.pagination');

    // Function to fetch recipes from the API with pagination
    function fetchRecipes(url) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Clear the current list of recipes
            rowElement.innerHTML = '';
            console.log('API response:', data);

            // Display the recipes from the current page
            if (Array.isArray(data.results)) {
                data.results.forEach(recipe => {
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
                                    <h5 class="recipe-title" data-slug="${recipe.slug}">${recipe.title}</h5>
                                </a>
                                <div class="ratings">
                                    <div class="average-rating">Average Rating: ${starRating}</div>
                                </div>
                            </div>
                        </div>
                    `;

                    // Event listener to show slug on hover
                    const titleElement = recipeDiv.querySelector('.recipe-title');
                    titleElement.addEventListener('mouseover', function() {
                        console.log(`Slug: ${titleElement.getAttribute('data-slug')}`);
                        titleElement.setAttribute('title', titleElement.getAttribute('data-slug'));
                    });

                    rowElement.appendChild(recipeDiv);
                });
            } else {
                console.error('Expected `results` to be an array, but got:', data.results);
            }

            // Update pagination links
            updatePagination(data);
        })
        .catch(error => {
            console.error('Error fetching the recipes:', error);
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

    // Function to update pagination based on the API response

    function updatePagination(data) {
        paginationElement.innerHTML = '';
    
        // Previous page button
        if (data.previous) {
            const prevItem = document.createElement('li');
            prevItem.classList.add('page-item');
            prevItem.innerHTML = `<a class="page-link" href="#">prev</a>`;
            prevItem.addEventListener('click', function(e) {
                e.preventDefault();
                fetchRecipes(data.previous);
            });
            paginationElement.appendChild(prevItem);
        }
    
        // Dynamically calculate the total number of pages based on the actual items per page from the API
        const itemsPerPage = data.results.length; // Dynamically get the number of items on this page
        const totalPages = Math.ceil(data.count / 3); // Calculate total pages
    
        // Create page number links
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener('click', function(e) {
                e.preventDefault();
                fetchRecipes(`${apiUrl}?page=${i}`);
            });
            paginationElement.appendChild(pageItem);
        }
    
        // Next page button
        if (data.next) {
            const nextItem = document.createElement('li');
            nextItem.classList.add('page-item');
            nextItem.innerHTML = `<a class="page-link" href="#">next</a>`;
            nextItem.addEventListener('click', function(e) {
                e.preventDefault();
                fetchRecipes(data.next);
            });
            paginationElement.appendChild(nextItem);
        }
    }

    // Initial fetch for the first page
    fetchRecipes(apiUrl);
});
