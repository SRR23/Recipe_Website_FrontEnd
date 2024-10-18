document.addEventListener('DOMContentLoaded', function () {
    const heroSlidesContainer = document.querySelector('.hero-slides'); // The slider container

    // Function to fetch and update slides
    function fetchHeroSlides() {
        const apiUrl = `${apiBaseUrl}/api/home/`;  // Replace with your actual API endpoint

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
            // Clear the current slides in the hero slider
            heroSlidesContainer.innerHTML = '';

            // Limit to three items for the slider
            const recipes = data.slice(0, 3);

            // Loop through the recipes and create slides
            recipes.forEach(recipe => {
                const slideDiv = document.createElement('div');
                slideDiv.classList.add('single-hero-slide', 'bg-img');
                slideDiv.style.backgroundImage = `url(${recipe.image})`;

                slideDiv.innerHTML = `
                    <div class="container h-100">
                        <div class="row h-100 align-items-center">
                            <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                                <!-- Clickable title to redirect to recipe details page -->
                                <a href="recipe_detail.html?slug=${recipe.slug}" class="btn delicious-btn" data-animation="fadeInUp" data-delay="1000ms">
                                    ${recipe.title}
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                // Append the new slide to the hero slider container
                heroSlidesContainer.appendChild(slideDiv);
            });

            // Initialize or refresh the slider after new slides are appended
            initializeSlider();
        })
        .catch(error => {
            console.error('Error fetching hero slides:', error);
        });
    }

    // Function to initialize or reinitialize the slider
    function initializeSlider() {
        // Destroy the old slider instance (for Owl Carousel)
        $('.hero-slides').trigger('destroy.owl.carousel'); 

        // Reinitialize the slider with settings including navigation arrows
        $('.hero-slides').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 5000, // 5 seconds per slide
            smartSpeed: 1000,
            dots: true,
            nav: true,  // Enable navigation arrows
            navText: [
                '<i class="fa fa-chevron-left"></i>',  // Left arrow icon
                '<i class="fa fa-chevron-right"></i>'  // Right arrow icon
            ]
        });
    }

    // Fetch and update the hero slides on page load
    fetchHeroSlides();
});
