// Get the token from local storage (or session storage)
const token = localStorage.getItem('token');

if (!token) {
    console.error('No token found. Please log in.');
    window.location.href = 'login.html'; // Redirect to login page if token is not found
}

const updateForm = document.querySelector('#update-form');
const recipeId = new URLSearchParams(window.location.search).get('id');
const updateApiUrl = `${apiBaseUrl}/api/my-recipes/${recipeId}/`; // Adjust based on your API endpoint

if (updateForm) {
    // Fetch recipe data and pre-fill the form
    fetch(updateApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(recipe => {
            // Pre-fill the form fields with the fetched recipe data
            document.querySelector('#title').value = recipe.title || '';
            document.querySelector('#prep_time').value = recipe.prep_time || '';
            document.querySelector('#cook_time').value = recipe.cook_time || '';
            document.querySelector('#servings').value = recipe.servings || '';
            document.querySelector('#ingredients').value = recipe.ingredients || '';
            document.querySelector('#instructions').value = recipe.instructions || '';

            // Pre-fill the category dropdown
            const categorySelect = document.querySelector('#ctg');
            fetchCategories().then(categories => {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id; // Ensure this matches your category ID
                    option.textContent = category.title; // Ensure this matches your category title
                    categorySelect.appendChild(option);
                });
                categorySelect.value = recipe.category; // Pre-select the current category based on the ID
            });

            // Pre-fill the image URL (if applicable)
            const imageElement = document.querySelector('#image'); // Assuming this is an <img> tag
            if (recipe.image) {
                imageElement.src = recipe.image; // Set the image source to the recipe image URL
            }
        })
        .catch(error => {
            console.error('Error fetching the recipe:', error);
        });

    // Handle form submission to update the recipe
    updateForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const updatedRecipe = {
            title: document.querySelector('#title').value,
            category: document.querySelector('#ctg').value,
            prep_time: document.querySelector('#prep_time').value,
            cook_time: document.querySelector('#cook_time').value,
            servings: document.querySelector('#servings').value,
            ingredients: document.querySelector('#ingredients').value, // Keep it as a string
            instructions: document.querySelector('#instructions').value, // Keep it as a string
        };

        fetch(updateApiUrl, {
            method: 'PUT', // or 'PATCH' depending on your API
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRecipe)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Recipe updated successfully:', data);
                
                // Use SweetAlert to show success message
                Swal.fire({
                    title: "Success!",
                    text: "Recipe updated successfully.",
                    icon: "success"
                }).then(() => {
                    // Redirect after SweetAlert is closed
                    window.location.href = 'my_recipe.html'; 
                });
            })
            .catch(error => {
                console.error('Error updating the recipe:', error);
                // Use SweetAlert to show error message
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred while updating the recipe. Please try again.",
                    icon: "error"
                });
            });
    });
}