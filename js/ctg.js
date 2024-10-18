
document.addEventListener('DOMContentLoaded', function() {
    const categoryDropdown = document.getElementById('ctg');

    // Fetch categories from the API
    fetch(`${apiBaseUrl}/api/categories/`, {
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
    .then(categories => {
        console.log('category received:', categories);  // Log the received categories
        if (Array.isArray(categories)) {
            // Clear existing options if necessary
            categoryDropdown.innerHTML = '<option value="">Select a category</option>';

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;  // Use 'id' as the option value
                option.textContent = category.title;  // Use 'title' to display the category name
                categoryDropdown.appendChild(option);
            });

            // Initialize Nice Select after appending the options
            $(categoryDropdown).niceSelect('update');  // Update or initialize Nice Select
        } else {
            console.error('No categories found or incorrect format:', categories);
        }
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });
});
