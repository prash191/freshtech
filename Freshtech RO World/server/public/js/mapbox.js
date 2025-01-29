export const displayMap = (locations) => {
    const startLocation = locations[0];
    var map = L.map('map', {
        zoomControl: false,
        scrollWheelZoom: false,
    }).setView([startLocation.coordinates[1], startLocation.coordinates[0]], 6);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    locations.forEach(location => {
        const coordinate = location.coordinates;
        var marker = L.marker([coordinate[1], coordinate[0]]).addTo(map);
        marker.bindPopup(`<p>Day ${location.day}: ${location.description}</p>`).openPopup();
        // marker.bindPopup(`<p>Day ${location.day}: ${location.description}</p>`).addTo(map);
    });
}

