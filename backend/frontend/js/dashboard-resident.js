document.addEventListener('DOMContentLoaded', () => {
    const announcementsContainer = document.getElementById('announcements-container');
    const incidentsContainer = document.getElementById('incidents-container');

    // Fetch and display all announcements
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

    // Fetch and display incidents reported by the resident
    fetch('/api/incidents/user', {
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
                alert('Failed to fetch your incidents');
            }
        })
        .catch(error => console.error('Error fetching incidents:', error));

    // Function to display announcements
    function displayAnnouncements(announcements) {
        announcementsContainer.innerHTML = ''; // Clear container

        if (announcements.length === 0) {
            announcementsContainer.innerHTML = '<p>No announcements to show.</p>';
            return;
        }

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

    // Function to display incidents reported by the resident
    function displayIncidents(incidents) {
        incidentsContainer.innerHTML = ''; // Clear container

        if (incidents.length === 0) {
            incidentsContainer.innerHTML = '<p>No incidents reported yet.</p>';
            return;
        }

        incidents.forEach(incident => {
            const incidentDiv = document.createElement('div');
            incidentDiv.className = 'incident';

            incidentDiv.innerHTML = `
                <h3>${incident.title} (${incident.category})</h3>
                <p>${incident.description}</p>
                <p>Location: ${incident.location}</p>
                <p>Status: ${incident.status}</p>
                <small>Reported on: ${new Date(incident.createdAt).toLocaleDateString()}</small>
            `;

            incidentsContainer.appendChild(incidentDiv);
        });
    }
});
