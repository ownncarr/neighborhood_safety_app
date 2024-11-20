document.addEventListener('DOMContentLoaded', () => {
    const announcementsContainer = document.getElementById('announcements-container');
    const createAnnouncementForm = document.getElementById('announcement-form');

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

    // Create a new announcement (admin/governing body only)
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
                        location.reload();
                    } else {
                        alert('Failed to create announcement');
                    }
                })
                .catch(error => console.error('Error creating announcement:', error));
        });
    }

    // Function to display announcements
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
});
