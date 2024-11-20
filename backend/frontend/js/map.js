// Sample code for initializing a map with Leaflet.js
const map = L.map('incident-map').setView([51.505, -0.09], 13); // Coordinates for center (London example)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Example of adding an incident marker
function addIncidentToMap(lat, lng) {
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Incident details')
        .openPopup();
}
