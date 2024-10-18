
document.addEventListener('DOMContentLoaded', function() {
    const categoryDropdown = document.getElementById('category-dropdown');

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
        console.log('Categories received:', categories);  // Log the received categories
        if (Array.isArray(categories)) {
            categories.forEach(category => {
                const li = document.createElement('li');
                const a = document.createElement('a');

                // Use the category ID in the href and the category title for display
                a.href = `category_list.html?category=${category.id}`;  // Adjust this URL if necessary
                a.textContent = category.title;  // Use 'title' to display the category name

                li.appendChild(a);
                categoryDropdown.appendChild(li);
            });
        } else {
            console.error('No categories found or incorrect format:', categories);
        }
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });
});
