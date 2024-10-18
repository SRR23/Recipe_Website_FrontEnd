// Function to set the active class for the current page
function setActivePage() {
    // Get the current page's URL
    const currentPage = window.location.pathname.split("/").pop();

    // Get all links in the navbar
    const navLinks = document.querySelectorAll('.classynav ul li a');

    // Loop through all links
    navLinks.forEach(link => {
        // Check if the href matches the current page
        if (link.getAttribute('href') === currentPage) {
            // Add 'active' class to the parent <li>
            link.parentElement.classList.add('active');
        } else {
            // Remove 'active' class from other <li> elements
            link.parentElement.classList.remove('active');
        }
    });
}

// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', setActivePage);
