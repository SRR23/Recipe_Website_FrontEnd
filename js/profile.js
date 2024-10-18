// document.addEventListener('DOMContentLoaded', function () {
//     const profileForm = document.getElementById('profile-form');
//     const message = document.getElementById('message');

//     // Get token from localStorage
//     const token = localStorage.getItem('token');
//     let userId; // To store the logged-in user's ID

//     if (!token) {
//         message.innerText = "You must be logged in to view your profile.";
//         return; // Prevent further execution if no token
//     }

//     // Fetch user profile data
//     fetch('http://127.0.0.1:8000/api/my-profile/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Token ${token}`,
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error loading profile data');
//         }
//         return response.json(); // Expect an array of user objects
//     })
//     .then(userProfiles => {
//         if (Array.isArray(userProfiles) && userProfiles.length > 0) {
//             const userProfile = userProfiles[0]; // Access the first user object in the array
//             userId = userProfile.id; // Save user ID for later use

//             // Populate the form with the user's data
//             document.getElementById('username').value = userProfile.username || '';
//             document.getElementById('first_name').value = userProfile.first_name || '';
//             document.getElementById('last_name').value = userProfile.last_name || '';
//             document.getElementById('email').value = userProfile.email || '';
//         } else {
//             message.innerText = "No user profile found.";
//             console.error("User data missing or incorrect format:", userProfiles);
//         }
//     })
//     .catch(error => {
//         message.innerText = "Error loading profile data.";
//         console.error('Error:', error);
//     });

//     // Handle form submission for updating profile
//     profileForm.addEventListener('submit', function (e) {
//         e.preventDefault(); // Prevent default form submission

//         const username = document.getElementById('username').value;
//         const firstName = document.getElementById('first_name').value;
//         const lastName = document.getElementById('last_name').value;
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         const confirmPassword = document.getElementById('confirm_password').value;

//         if (password && password !== confirmPassword) {
//             message.innerText = "Passwords do not match!";
//             return;
//         }

//         // Prepare the updated profile data
//         const updatedProfile = {
//             username: username,
//             first_name: firstName,
//             last_name: lastName,
//             email: email
//         };

//         // Include password only if it is provided
//         if (password) {
//             updatedProfile.password = password;
//         }

//         // Ensure the userId is available before sending the update request
//         if (userId) {
//             // Update profile via API using dynamic user ID
//             fetch(`http://127.0.0.1:8000/api/my-profile/${userId}/`, {
//                 method: 'PATCH', // Use PATCH for partial updates
//                 headers: {
//                     'Authorization': `Token ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(updatedProfile)
//             })
//             .then(response => {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error('Failed to update profile');
//                 }
//             })
//             .then(data => {
//                 message.innerText = "Profile updated successfully!";
//             })
//             .catch(error => {
//                 message.innerText = "Error updating profile.";
//                 console.error('Error:', error);
//             });
//         } else {
//             message.innerText = "User ID not found.";
//         }
//     });
// });



document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.getElementById('profile-form');
    

    // Get token from localStorage
    const token = localStorage.getItem('token');
    let userId; // To store the logged-in user's ID

    if (!token) {
        Swal.fire({
            title: 'Error',
            text: "You must be logged in to view your profile.",
            icon: 'error'
        });
        return; // Prevent further execution if no token
    }

    // Fetch user profile data
    fetch(`${apiBaseUrl}/api/my-profile/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error loading profile data');
        }
        return response.json(); // Expect an array of user objects
    })
    .then(userProfiles => {
        if (Array.isArray(userProfiles) && userProfiles.length > 0) {
            const userProfile = userProfiles[0]; // Access the first user object in the array
            userId = userProfile.id; // Save user ID for later use

            // Populate the form with the user's data
            document.getElementById('username').value = userProfile.username || '';
            document.getElementById('first_name').value = userProfile.first_name || '';
            document.getElementById('last_name').value = userProfile.last_name || '';
            document.getElementById('email').value = userProfile.email || '';
        } else {
            Swal.fire({
                title: 'Error',
                text: "No user profile found.",
                icon: 'error'
            });
            console.error("User data missing or incorrect format:", userProfiles);
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error',
            text: "Error loading profile data.",
            icon: 'error'
        });
        console.error('Error:', error);
    });

    // Handle form submission for updating profile
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        const username = document.getElementById('username').value;
        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if (password && password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: "Passwords do not match!",
                icon: 'error'
            });
            return;
        }

        // Prepare the updated profile data
        const updatedProfile = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email
        };

        // Include password only if it is provided
        if (password) {
            updatedProfile.password = password;
        }

        // Ensure the userId is available before sending the update request
        if (userId) {
            // Update profile via API using dynamic user ID
            fetch(`${apiBaseUrl}/api/my-profile/${userId}/`, {
                method: 'PATCH', // Use PATCH for partial updates
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProfile)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to update profile');
                }
            })
            .then(data => {
                Swal.fire({
                    title: 'Success',
                    text: "Profile updated successfully!",
                    icon: 'success'
                });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: "Error updating profile.",
                    icon: 'error'
                });
                console.error('Error:', error);
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: "User ID not found.",
                icon: 'error'
            });
        }
    });
});

