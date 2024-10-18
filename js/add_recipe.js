// // Handle form submission
// document.getElementById('recipe-form').addEventListener('submit', function(event) {
//     event.preventDefault();  // Prevent the default form submission

//     // Collect form values
//     const title = document.getElementById('title').value;
//     const category = document.getElementById('ctg').value;  // Get the selected category
//     const image = document.getElementById('image').files[0];  // Get the image file
//     const prep_time = document.getElementById('prep_time').value;
//     const cook_time = document.getElementById('cook_time').value;
//     const servings = document.getElementById('servings').value;
//     const ingredients = document.getElementById('ingredients').value;  // Get plain text for ingredients
//     const instructions = document.getElementById('instructions').value;  // Get plain text for instructions

//     // Retrieve token from local storage
//     const token = localStorage.getItem('token');
//     if (!token) {
//         alert('You need to log in to add a recipe.');
//         return;
//     }

//     // Prepare form data for submission
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('category', category);
//     formData.append('image', image);
//     formData.append('prep_time', prep_time);
//     formData.append('cook_time', cook_time);
//     formData.append('servings', servings);
//     formData.append('ingredients', ingredients);
//     formData.append('instructions', instructions);

//     // Send POST request to the API to create the recipe
//     fetch('http://127.0.0.1:8000/api/my-recipes/', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Token ${token}`  // Include token for authentication
//         },
//         body: formData  // Send form data with the request
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok: ' + response.statusText);
//         }
//         return response.json();  // Parse the response as JSON
//     })
//     .then(data => {
//         console.log('API response:', data);  // Log the API response for debugging

//         // Check if the response contains the recipe ID
//         if (data.id) {
//             alert('Recipe added successfully!');  // Show success message

//             // Clear the form fields
//             document.getElementById('recipe-form').reset();
//         } else {
//             alert('Error adding recipe: ' + JSON.stringify(data));  // Show error message
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);  // Log any errors
//         alert('An error occurred while adding the recipe. Please try again.');
//     });
// });

// Handle form submission
document.getElementById('recipe-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission

    // Collect form values
    const title = document.getElementById('title').value;
    const category = document.getElementById('ctg').value;  // Get the selected category
    const image = document.getElementById('image').files[0];  // Get the image file
    const prep_time = document.getElementById('prep_time').value;
    const cook_time = document.getElementById('cook_time').value;
    const servings = document.getElementById('servings').value;
    const ingredients = document.getElementById('ingredients').value;  // Get plain text for ingredients
    const instructions = document.getElementById('instructions').value;  // Get plain text for instructions

    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire({
            title: "Error",
            text: "You need to log in to add a recipe.",
            icon: "error"
        });
        return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', image);
    formData.append('prep_time', prep_time);
    formData.append('cook_time', cook_time);
    formData.append('servings', servings);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);

    // Send POST request to the API to create the recipe
    fetch(`${apiBaseUrl}/api/my-recipes/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`  // Include token for authentication
        },
        body: formData  // Send form data with the request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();  // Parse the response as JSON
    })
    .then(data => {
        console.log('API response:', data);  // Log the API response for debugging

        // Check if the response contains the recipe ID
        if (data.id) {
            Swal.fire({
                title: "Thank You",
                text: "Your recipe has been added successfully!",
                icon: "success"
            });

            // Clear the form fields
            document.getElementById('recipe-form').reset();
        } else {
            Swal.fire({
                title: "Error",
                text: "Error adding recipe: " + JSON.stringify(data),
                icon: "error"
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);  // Log any errors
        Swal.fire({
            title: "Error",
            text: "An error occurred while adding the recipe. Please try again.",
            icon: "error"
        });
    });
});

