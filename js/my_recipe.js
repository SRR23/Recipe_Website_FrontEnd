


// document.addEventListener('DOMContentLoaded', function () {
//     const apiUrl = 'http://127.0.0.1:8000/api/my-recipes/';
//     const rowElement = document.querySelector('.my-recipe');

//     // Retrieve the token from localStorage
//     const token = localStorage.getItem('token');

//     if (!token) {
//         console.error('No token found. Make sure you are logged in.');
//         return; // Stop execution if no token is found
//     }

//     console.log('Token:', token); // Log the token for debugging

//     // Fetch the API data with the token
//     fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Token ${token}`,  // Ensure the token format matches your backend expectation
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('API response:', data);

//         if (Array.isArray(data)) {
//             data.forEach(recipe => {
//                 const recipeDiv = document.createElement('div');
//                 recipeDiv.classList.add('col-12', 'col-sm-6', 'col-lg-4');

//                 // Calculate average rating based on reviews
//                 const averageRating = calculateAverageRating(recipe.reviews); // Average rating
//                 const starRating = generateStarRating(averageRating); // Average rating stars

//                 recipeDiv.innerHTML = `
//                     <div class="single-best-receipe-area mb-30">
//                         <img src="${recipe.image}" alt="${recipe.title}">
//                         <div class="receipe-content">
//                             <a href="recipe_detail.html?slug=${recipe.slug}" title="${recipe.slug}">
//                                 <h5 class="recipe-title">${recipe.title}</h5>
//                             </a>
//                             <div class="ratings">
//                                 <div class="average-rating">Average Rating: ${starRating}</div>
//                             </div>
//                             <div class="action-icons">
//                                 <span class="edit-icon" data-id="${recipe.id}" title="Edit Recipe">
//                                     <i class="fa fa-pencil"></i>
//                                 </span>
//                                 <span class="delete-icon" data-id="${recipe.id}" title="Delete Recipe">
//                                     <i class="fa fa-trash"></i>
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 `;

//                 // Show ID on hover over the icons
//                 const editIcon = recipeDiv.querySelector('.edit-icon');
//                 const deleteIcon = recipeDiv.querySelector('.delete-icon');

//                 editIcon.addEventListener('mouseenter', function () {
//                     editIcon.setAttribute('title', `ID: ${recipe.id}`);
//                 });

//                 deleteIcon.addEventListener('mouseenter', function () {
//                     deleteIcon.setAttribute('title', `ID: ${recipe.id}`);
//                 });

//                 // Redirect to update_recipe page on click of the edit icon
//                 editIcon.addEventListener('click', function () {
//                     window.location.href = `update_recipe.html?id=${recipe.id}`; // Redirect to update page with the recipe ID as a query parameter
//                 });

//                 // Handle delete action
//                 deleteIcon.addEventListener('click', function () {
//                     Swal.fire({
//                         title: 'Are you sure?',
//                         text: "Do you really want to delete this recipe? This action cannot be undone.",
//                         icon: 'warning',
//                         showCancelButton: true, // Show Cancel button
//                         confirmButtonColor: '#d33', // Set color for Confirm button
//                         cancelButtonColor: '#3085d6', // Set color for Cancel button
//                         confirmButtonText: 'Yes, delete it!',
//                         cancelButtonText: 'No, cancel'
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             // If confirmed, send DELETE request
//                             fetch(`${apiUrl}${recipe.id}/`, { // Adjust the API endpoint if needed
//                                 method: 'DELETE',
//                                 headers: {
//                                     'Authorization': `Token ${token}`,
//                                     'Content-Type': 'application/json'
//                                 }
//                             })
//                             .then(response => {
//                                 if (!response.ok) {
//                                     throw new Error(`HTTP error! Status: ${response.status}`);
//                                 }
//                                 // Handle 204 No Content response
//                                 if (response.status === 204) {
//                                     console.log('Recipe deleted successfully');
//                                     recipeDiv.remove(); // Remove the recipe element from the DOM

//                                     // Show success message
//                                     Swal.fire({
//                                         title: 'Deleted!',
//                                         text: 'Your recipe has been deleted.',
//                                         icon: 'success'
//                                     });
//                                 } else {
//                                     return response.json(); // Attempt to parse the response as JSON for other statuses
//                                 }
//                             })
//                             .then(data => {
//                                 // You can handle other success responses here if needed
//                                 console.log('Response data:', data);
//                             })
//                             .catch(error => {
//                                 console.error('Error deleting the recipe:', error);
//                                 // Show error message if the request fails
//                                 Swal.fire({
//                                     title: 'Error!',
//                                     text: 'An error occurred while deleting the recipe. Please try again.',
//                                     icon: 'error'
//                                 });
//                             });
//                         }
//                     });
//                 });


//                 rowElement.appendChild(recipeDiv);
//             });
//         } else {
//             console.error('Expected an array, but got:', data);
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching the recipes:', error);
//     });

//     // Function to calculate the average rating from reviews
//     function calculateAverageRating(reviews) {
//         if (reviews.length === 0) return 0;
//         const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//         return (totalRating / reviews.length).toFixed(1);
//     }

//     // Function to generate star rating HTML based on rating value
//     function generateStarRating(rating) {
//         const fullStar = '<i class="fa fa-star" aria-hidden="true"></i>';
//         const emptyStar = '<i class="fa fa-star-o" aria-hidden="true"></i>';
//         let starsHtml = '';

//         for (let i = 1; i <= 5; i++) {
//             if (i <= rating) {
//                 starsHtml += fullStar;
//             } else {
//                 starsHtml += emptyStar;
//             }
//         }
//         return starsHtml;
//     }
// });


document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = `${apiBaseUrl}/api/my-recipes/`;
    const rowElement = document.querySelector('.my-recipe');

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found. Make sure you are logged in.');
        return; // Stop execution if no token is found
    }

    // Fetch the API data with the token
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            data.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('col-12', 'col-sm-6', 'col-lg-4');

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
                            <div class="action-icons">
                                <span class="edit-icon" data-id="${recipe.id}" title="Edit">
                                    <i class="fa fa-pencil"></i>
                                </span>
                                <span class="delete-icon" data-id="${recipe.id}" title="Delete">
                                    <i class="fa fa-trash"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                `;

                const editIcon = recipeDiv.querySelector('.edit-icon');
                const deleteIcon = recipeDiv.querySelector('.delete-icon');

                // Redirect to update_recipe page on click of the edit icon
                editIcon.addEventListener('click', function () {
                    window.location.href = `update_recipe.html?id=${recipe.id}`;
                });

                // Handle delete action
                deleteIcon.addEventListener('click', function () {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "Do you really want to delete this recipe? This action cannot be undone.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Yes, delete it!',
                        cancelButtonText: 'No, cancel'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // If confirmed, send DELETE request
                            fetch(`${apiUrl}${recipe.id}/`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Token ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(response => {
                                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                                // Handle 204 No Content response
                                if (response.status === 204) {
                                    recipeDiv.remove(); // Remove the recipe element from the DOM
                                    Swal.fire({
                                        title: 'Deleted!',
                                        text: 'Your recipe has been deleted.',
                                        icon: 'success'
                                    });
                                }
                            })
                            .catch(error => {
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'An error occurred while deleting the recipe. Please try again.',
                                    icon: 'error'
                                });
                            });
                        }
                    });
                });

                rowElement.appendChild(recipeDiv);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching the recipes:', error);
    });

    // Function to calculate the average rating from reviews
    function calculateAverageRating(reviews) {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    }

    // Function to generate star rating HTML based on rating value
    function generateStarRating(rating) {
        const fullStar = '<i class="fa fa-star" aria-hidden="true"></i>';
        const emptyStar = '<i class="fa fa-star-o" aria-hidden="true"></i>';
        let starsHtml = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHtml += fullStar;
            } else {
                starsHtml += emptyStar;
            }
        }
        return starsHtml;
    }
});
