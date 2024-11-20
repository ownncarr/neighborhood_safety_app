document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Log the response to see the role
        if (data.token) {
            // Save token in localStorage or sessionStorage
            localStorage.setItem('token', data.token);

            // Check the role received and redirect accordingly
            const role = data.role; // Backend should return the user's role
            if (role === 'resident') {
                window.location.href = '/dashboards/dashboard-resident.html';
            } else if (role === 'admin') {
                window.location.href = '/dashboards/dashboard-admin.html';
            } else if (role === 'governing-body') {
                window.location.href = '/dashboards/dashboard-governing.html';
            } else {
                alert('Unknown role, contact support!');
            }
        } else {
            alert(data.message || 'Login failed');
        }
    })
    .catch(error => console.error('Error:', error));
});
