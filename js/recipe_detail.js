document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const addFavoritesButton = document.getElementById('is_favourited');

    // Check if the user is logged in by checking for token or session
    const isLoggedIn = !!localStorage.getItem('token');

    // Elements to show/hide based on login status
    const commentForm = document.getElementById('comment-form');
    const loginMessage = document.getElementById('login-message');

    // Show or hide the comment form and message based on login status
    if (isLoggedIn) {
        commentForm.style.display = 'block';
        loginMessage.style.display = 'none';
    } else {
        commentForm.style.display = 'none';
        loginMessage.style.display = 'block';
    }

    // Fetch the recipe details and reviews using the slug
    function fetchRecipeDetails(slug) {
        if (!slug) {
            console.error('No recipe slug provided in the URL.');
            return;
        }

        fetch(`${apiBaseUrl}/api/recipe-detail/${slug}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch recipe: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Update the HTML with the fetched data
                document.getElementById('recipe-title').textContent = data.title;
                document.getElementById('recipe-author').textContent = `Author: ${data.author_name}`;
                document.getElementById('created-date').textContent = new Date(data.created_at).toLocaleDateString();
                document.getElementById('prep-time').textContent = `Prep: ${data.prep_time} mins`;
                document.getElementById('cook-time').textContent = `Cook: ${data.cook_time} mins`;
                document.getElementById('servings').textContent = `Yields: ${data.servings} Servings`;

                // Update Ingredients
                const ingredientsList = document.getElementById('ingredients-list');
                const ingredients = data.ingredients ? data.ingredients.split(', ') : [];
                ingredientsList.innerHTML = '';

                ingredients.forEach((ingredient, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>0${index + 1}.</strong> ${ingredient}`;
                    ingredientsList.appendChild(li);
                });

                // Update Instructions
                const instructionsContainer = document.getElementById('instructions-container');
                const instructions = data.instructions ? data.instructions.split('. ') : [];
                instructionsContainer.innerHTML = '';

                instructions.forEach((step, index) => {
                    if (step.trim()) {
                        const stepElement = document.createElement('div');
                        stepElement.classList.add('single-preparation-step', 'd-flex');
                        stepElement.innerHTML = `<h4>0${index + 1}.</h4><p>${step}.</p>`;
                        instructionsContainer.appendChild(stepElement);
                    }
                });

                // Update Recipe Image Slider
                const slider = document.querySelector('.receipe-slider');
                slider.innerHTML = '';
                const imgElement = document.createElement('img');
                imgElement.src = data.image;
                imgElement.alt = data.title;
                slider.appendChild(imgElement);

                $('.receipe-slider').owlCarousel({
                    items: 1,
                    loop: true,
                    autoplay: true,
                    autoplayTimeout: 3000,
                    dots: true
                });

                // Display Reviews
                displayReviews(data.reviews);

                // Update star rating based on reviews
                updateStarRating(data.reviews);

            })
            .catch(error => console.error('Error fetching recipe details:', error));
    }


    // Function to update star rating display
    function updateStarRating(reviews) {
        const ratingContainer = document.getElementById('recipe-rating');
        const stars = ratingContainer.querySelectorAll('i');
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        stars.forEach((star, index) => {
            star.classList.remove('fa-star', 'fa-star-o');
            star.classList.add(averageRating > index ? 'fa-star' : 'fa-star-o');
        });

        ratingContainer.setAttribute('data-rating', averageRating);
    }

    // Display reviews
    function displayReviews(reviews) {
        const commentsSection = document.getElementById('comments-section');
        commentsSection.innerHTML = '';

        if (reviews.length === 0) {
            commentsSection.innerHTML = '<p>No comments yet.</p>';
            return;
        }

        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review');
            reviewDiv.innerHTML = `
                <h5>${review.user} <span>(${review.created_date})</span></h5>
                <p>Rating: ${review.rating} ★</p>
                <p>${review.comment}</p>
            `;
            commentsSection.appendChild(reviewDiv);
        });
    }

    // Submit comment and rating
    if (isLoggedIn) {
        commentForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const rating = document.getElementById('rating').value;
            const comment = document.getElementById('comment').value;

            const postData = {
                rating: rating,
                comment: comment
            };

            // Post rating and comment to the API
            fetch(`${apiBaseUrl}/api/recipe-detail/${slug}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(postData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to post comment: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your comment and rating have been posted.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    fetchRecipeDetails(slug);
                });
            })
            .catch(error => {
                console.error('Error posting comment:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to post comment. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
        });
    }

    function addToFavorites() {
        fetch(`${apiBaseUrl}/api/add-favourite/${slug}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to add favorite: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            
            // Show success message
            Swal.fire({
                title: 'Success!',
                text: 'Recipe has been added to favorites.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Redirect to the favourite_recipe.html page after user clicks 'OK'
                window.location.href = 'favourite_recipe.html';
            });
        })
        .catch(error => {
            console.error('Error adding favorite:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to add to favorites. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }
    
    // Handle add to favorites button click
    if (isLoggedIn) {
        addFavoritesButton.addEventListener('click', function () {
            addToFavorites();
        });
    }
    

    // Fetch the recipe details initially
    fetchRecipeDetails(slug);
});
