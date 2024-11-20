document.addEventListener('DOMContentLoaded', () => {
    const announcementsContainer = document.getElementById('announcements-container');
    const incidentsContainer = document.getElementById('incidents-container');
    const createAnnouncementForm = document.getElementById('announcement-form');

    // Fetch and display announcements
    function fetchAnnouncements() {
        fetch('/api/announcements', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayAnnouncements(data.data);
                } else {
                    alert('Failed to fetch announcements');
                }
            })
            .catch(error => console.error('Error fetching announcements:', error));
    }

    // Fetch and display all incidents
    function fetchIncidents() {
        fetch('/api/incidents/all', {
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
    }

    // Create a new announcement
    if (createAnnouncementForm) {
        createAnnouncementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(createAnnouncementForm);

            fetch('/api/announcements', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.get('title'),
                    description: formData.get('description'),
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Announcement created successfully');
                        fetchAnnouncements(); // Refresh announcements
                        createAnnouncementForm.reset();
                    } else {
                        alert('Failed to create announcement');
                    }
                })
                .catch(error => console.error('Error creating announcement:', error));
        });
    }

    // Update incident status
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
                            fetchIncidents(); // Refresh incidents
                        } else {
                            alert('Failed to update incident status');
                        }
                    })
                    .catch(error => console.error('Error updating incident status:', error));
            }
        }
    });

    // Display announcements
    function displayAnnouncements(announcements) {
        announcementsContainer.innerHTML = ''; // Clear container

        announcements.forEach(announcement => {
            const announcementDiv = document.createElement('div');
            announcementDiv.className = 'announcement';

            announcementDiv.innerHTML = `
                <h3>${announcement.title}</h3>
                <p>${announcement.description}</p>
                <small>By: ${announcement.createdBy} on ${new Date(announcement.createdAt).toLocaleDateString()}</small>
            `;

            announcementsContainer.appendChild(announcementDiv);
        });
    }

    // Display incidents
    function displayIncidents(incidents) {
        incidentsContainer.innerHTML = ''; // Clear container

        incidents.forEach(incident => {
            const incidentDiv = document.createElement('div');
            incidentDiv.className = 'incident';

            incidentDiv.innerHTML = `
                <h3>${incident.title} (${incident.category})</h3>
                <p>${incident.description}</p>
                <p>Location: ${incident.location}</p>
                <p>Status: ${incident.status}</p>
                <small>Reported by: ${incident.reportedBy.email}</small>
                <button class="update-status" data-id="${incident._id}">Update Status</button>
            `;

            incidentsContainer.appendChild(incidentDiv);
        });
    }

    // Initialize the dashboard
    fetchAnnouncements();
    fetchIncidents();
});
