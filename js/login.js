
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${apiBaseUrl}/account/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(response => {
        if (!response.ok) {
            // If the response is not OK (like 401 or 400), handle it as text or JSON
            return response.json().then(data => {
                throw new Error(data.error || 'Login failed');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('username', data.username);
            localStorage.setItem('token', data.token);  // Store the token for future requests
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
    });
});