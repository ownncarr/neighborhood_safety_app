document.addEventListener('DOMContentLoaded', () => {
    const announcementsContainer = document.getElementById('announcements-container');
    const createAnnouncementForm = document.getElementById('announcement-form');
    const incidentsContainer = document.getElementById('incidents-container');

    // Fetch and display announcements
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

    // Create a new announcement
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
                    location.reload();
                } else {
                    alert('Failed to create announcement');
                }
            })
            .catch(error => console.error('Error creating announcement:', error));
    });

    // Fetch and display all incidents
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

    // Function to display announcements
    function displayAnnouncements(announcements) {
        announcementsContainer.innerHTML = ''; // Clear container

        announcements.forEach(announcement => {
            const announcementDiv = document.createElement('div');
            announcementDiv.className = 'announcement';

            announcementDiv.innerHTML = `
                <h3>${announcement.title}</h3>
                <p>${announcement.description}</p>
                <small>Created on: ${new Date(announcement.createdAt).toLocaleString()}</small>
            `;

            announcementsContainer.appendChild(announcementDiv);
        });
    }

    // Function to display incidents
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
            `;

            incidentsContainer.appendChild(incidentDiv);
        });
    }
});
