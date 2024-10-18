// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('register-form').addEventListener('submit', function (event) {
//         event.preventDefault();

//         const username = document.getElementById('username').value;
//         const first_name = document.getElementById('first_name').value;
//         const last_name = document.getElementById('last_name').value;
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         const confirm_password = document.getElementById('confirm_password').value;

//         // Log the data being sent for debugging
//         console.log({
//             username,
//             first_name,
//             last_name,
//             email,
//             password,
//             confirm_password
//         });

//         fetch('http://127.0.0.1:8000/account/register/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 username: username,
//                 first_name: first_name,
//                 last_name: last_name,
//                 email: email,
//                 password: password,
//                 confirm_password: confirm_password
//             })
//         })
//         .then(response => {
//             console.log('Response status:', response.status); // Log the response status for debugging
//             return response.json(); // Parse the response as JSON
//         })
//         .then(data => {
//             console.log(data); // Log the response data
//             const messageElement = document.getElementById('message');
//             if (data.message) { // Check for message field in response
//                 messageElement.innerText = data.message; // Display success message
//                 messageElement.style.color = 'green';
//                 document.getElementById('register-form').reset(); // Clear the form after successful registration
//             } else {
//                 messageElement.innerText = 'Error: ' + (data.message || 'Unknown error occurred.');
//                 messageElement.style.color = 'red';
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error); // Log any errors
//             document.getElementById('message').innerText = 'An error occurred. Please try again.';
//             document.getElementById('message').style.color = 'red';
//         });
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('register-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm_password').value;

        // Log the data being sent for debugging
        console.log({
            username,
            first_name,
            last_name,
            email,
            password,
            confirm_password
        });

        // Perform the registration fetch
        fetch(`${apiBaseUrl}/account/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                confirm_password: confirm_password
            })
        })
        .then(response => {
            console.log('Response status:', response.status); // Log the response status for debugging
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            console.log(data); // Log the response data
            if (data.message) { // If there's a success message
                Swal.fire({
                    title: 'Success!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    document.getElementById('register-form').reset(); // Clear the form after successful registration
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'Unknown error occurred.',
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error); // Log any errors
            Swal.fire({
                title: 'Error',
                text: 'An error occurred. Please try again.',
                icon: 'error'
            });
        });
    });
});