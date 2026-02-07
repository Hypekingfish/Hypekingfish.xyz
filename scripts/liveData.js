const card = document.getElementById('live-card');
const text = document.getElementById('live-text');

function formatTime(seconds = 0) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
}

let map, marker;

function initMap(lat, lon) {
    if (!map) {
        map = L.map('vatsim-map', {
            zoomControl: false
        }).setView([lat, lon], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        marker = L.marker([lat, lon], {
            icon: L.divIcon({
                html: '✈️',
                iconSize: [24, 24],
                className: 'plane-icon'
            })
        }).addTo(map);
    }
}

function updateMap(lat, lon, heading) {
    if (!map || !marker) return;

    marker.setLatLng([lat, lon]);
    map.panTo([lat, lon], { animate: true, duration: 0.5 });

    if (heading !== undefined && marker._icon) {
        marker._icon.style.transform += ` rotate(${heading}deg)`;
    }
}


function updateLiveStatus() {
    card.className = 'loading';
    text.textContent = '🟡 Checking VATSIM…';

    fetch('/.netlify/functions/GetVatsimData')
        .then(res => {
            if (!res.ok) throw new Error('Network error');
            return res.json();
        })
        .then(data => {
            if (!data || !data.online) {
                card.className = 'offline';
                text.textContent = '🔴 Offline on VATSIM';
                document.getElementById('vatsim-map').style.display = 'none';
                return;
            }

            card.className = 'online';

            const {
                mode,
                callsign,
                position,
                facility,
                frequency,
                aircraft,
                departure,
                arrival,
                latitude,
                longitude,
                heading
            } = data;

            if (mode === 'ATC') {
                document.getElementById('vatsim-map').style.display = 'none';
                text.innerHTML = `
          🟢 <strong>${callsign}</strong><br>
          ${position || 'Unknown position'} (${facility || 'N/A'})<br>
          ${frequency ? `📻 ${frequency}` : ''}
        `;
            } else if (mode === 'PILOT') {
                text.innerHTML = `
          ✈️ <strong>${callsign}</strong><br>
          ${aircraft || 'Unknown aircraft'}<br>
          ${departure || '----'} → ${arrival || '----'}
        `;
            }
            if (data.latitude && data.longitude) {
                const mapEl = document.getElementById('vatsim-map');
                mapEl.style.display = 'block';

                initMap(data.latitude, data.longitude);
                updateMap(data.latitude, data.longitude, data.heading);
            }
            if (!map._airportsAdded && departure && arrival) {
                map._airportsAdded = true;

                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${departure} airport`)
                    .then(r => r.json())
                    .then(([dep]) => {
                        if (dep) L.marker([dep.lat, dep.lon]).addTo(map).bindPopup(`🛫 ${departure}`);
                    });

                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${arrival} airport`)
                    .then(r => r.json())
                    .then(([arr]) => {
                        if (arr) L.marker([arr.lat, arr.lon]).addTo(map).bindPopup(`🛬 ${arrival}`);
                    });
            }
        })
        .catch(err => {
            console.error(err);
            card.className = 'error';
            text.textContent = '⚠️ Unable to load VATSIM status';
        });
}

// Initial load
updateLiveStatus();

// Refresh every minute
setInterval(updateLiveStatus, 60000);
