document.addEventListener('DOMContentLoaded', () => {
    const incidentsContainer = document.getElementById('incidents-container');
    const reportIncidentForm = document.getElementById('incident-form');
    const role = localStorage.getItem('role'); // User's role

    // Fetch incidents
    let apiUrl = '/api/incidents/all'; // Default for admin/governing body
    if (role === 'resident') apiUrl = '/api/incidents/user';

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayIncidents(data.data);
            } else {
                alert('Failed to fetch incidents');
            }
        })
        .catch(error => console.error('Error fetching incidents:', error));

    // Report a new incident (residents only)
    if (reportIncidentForm) {
        reportIncidentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(reportIncidentForm);

            fetch('/api/incidents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.get('title'),
                    description: formData.get('description'),
                    location: formData.get('location'),
                    category: formData.get('category'),
                    photo: formData.get('photo'), // Ensure this is base64 or URL
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Incident reported successfully');
                        location.reload();
                    } else {
                        alert('Failed to report incident');
                    }
                })
                .catch(error => console.error('Error reporting incident:', error));
        });
    }

    // Update incident status (governing body only)
    if (role === 'governing-body') {
        incidentsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('update-status')) {
                const incidentId = e.target.dataset.id;
                const newStatus = prompt('Enter new status (Pending, In Progress, Completed):');

                if (newStatus) {
                    fetch(`/api/incidents/${incidentId}/status`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ status: newStatus }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert('Incident status updated successfully');
                                location.reload();
                            } else {
                                alert('Failed to update incident status');
                            }
                        })
                        .catch(error => console.error('Error updating incident status:', error));
                }
            }
        });
    }

    // Function to display incidents
    function displayIncidents(incidents) {
        incidentsContainer.innerHTML = ''; // Clear container

        incidents.forEach(incident => {
            const incidentDiv = document.createElement('div');
            incidentDiv.className = 'incident';

            let actionButtons = '';
            if (role === 'governing-body') {
                actionButtons = `
                    <button class="update-status" data-id="${incident._id}">Update Status</button>
                `;
            }

            incidentDiv.innerHTML = `
                <h3>${incident.title} (${incident.category})</h3>
                <p>${incident.description}</p>
                <p>Location: ${incident.location}</p>
                <p>Status: ${incident.status}</p>
                <small>Reported by: ${incident.reportedBy.email}</small>
                ${actionButtons}
            `;

            incidentsContainer.appendChild(incidentDiv);
        });
    }
});
