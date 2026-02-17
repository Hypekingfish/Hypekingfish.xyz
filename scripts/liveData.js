const el = id => document.getElementById(id);

const card = el('live-card');
const modeEl = el('live-mode');
const callsignEl = el('live-callsign');
const subinfoEl = el('live-subinfo');
const extraEl = el('live-extra');
const sessionEl = el('live-session');
const mapEl = el('vatsim-map');

let map, marker;
let currentRotation = 0;

// ===============================
// TIME FORMATTER
// ===============================
function formatSession(minutes = 0) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
}

// ===============================
// MAP INIT
// ===============================
function initMap(lat, lon) {
    if (!map) {
        map = L.map('vatsim-map', { zoomControl: false })
            .setView([lat, lon], 6);

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '&copy; OpenStreetMap' }
        ).addTo(map);
    }

    if (!marker) {
        marker = L.marker([lat, lon], {
            icon: L.divIcon({
                html: '✈️',
                iconSize: [24, 24],
                className: 'plane-icon'
            })
        }).addTo(map);
    }
}

// ===============================
// MAP UPDATE (Smooth + Fixed Rotation)
// ===============================
function updateMap(lat, lon, heading = 0) {
    if (!map || !marker) return;

    marker.setLatLng([lat, lon]);

    map.panTo([lat, lon], {
        animate: true,
        duration: 1
    });

    if (marker._icon) {
        currentRotation = heading;
        marker._icon.style.transform = `rotate(${currentRotation}deg)`;
    }
}

// ===============================
// AIRPORT MARKERS (Safe)
// ===============================
async function addAirportMarkers(departure, arrival) {
    if (!map || map._airportsAdded || !departure || !arrival) return;

    map._airportsAdded = true;

    try {
        const depRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${departure}+airport`
        );
        const depData = await depRes.json();
        if (depData[0]) {
            L.marker([depData[0].lat, depData[0].lon])
                .addTo(map)
                .bindPopup(`🛫 ${departure}`);
        }

        const arrRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${arrival}+airport`
        );
        const arrData = await arrRes.json();
        if (arrData[0]) {
            L.marker([arrData[0].lat, arrData[0].lon])
                .addTo(map)
                .bindPopup(`🛬 ${arrival}`);
        }

    } catch (err) {
        console.warn("Airport lookup failed");
    }
}

// ===============================
// MAIN UPDATE FUNCTION
// ===============================
function updateLiveStatus() {

    if (!card) return;

    card.className = 'loading';
    if (modeEl) modeEl.textContent = "Checking VATSIM…";

    fetch('/.netlify/functions/GetVatsimData')
        .then(res => {
            if (!res.ok) throw new Error('Network error');
            return res.json();
        })
        .then(data => {

            if (!data || !data.online) {
                card.className = 'offline';

                if (modeEl) modeEl.textContent = "🔴 Offline on VATSIM";
                if (callsignEl) callsignEl.textContent = "—";
                if (subinfoEl) subinfoEl.textContent = "";
                if (extraEl) extraEl.textContent = "";
                if (sessionEl) sessionEl.textContent = "";

                if (mapEl) mapEl.style.display = 'none';

                return;
            }

            card.className = 'online';

            // ===============================
            // ATC MODE
            // ===============================
            if (data.mode === "ATC") {

                if (modeEl) modeEl.textContent = "🟢 ATC";
                if (callsignEl) callsignEl.textContent = data.callsign;

                if (subinfoEl)
                    subinfoEl.textContent =
                        `${data.facility || ''} | ${data.frequency || ''}`;

                if (extraEl && data.fir)
                    extraEl.textContent = `FIR: ${data.fir}`;

                if (mapEl) mapEl.style.display = 'none';
            }

            // ===============================
            // PILOT MODE
            // ===============================
            if (data.mode === "PILOT") {

                if (modeEl) modeEl.textContent = "✈️ PILOT";
                if (callsignEl) callsignEl.textContent = data.callsign;

                if (subinfoEl)
                    subinfoEl.textContent =
                        `${data.departure || '----'} → ${data.arrival || '----'} | ${data.aircraft || ''}`;

                if (extraEl)
                    extraEl.textContent =
                        `FL${Math.round((data.altitude || 0) / 100)} | ${data.groundspeed || 0}kts ${data.flight_phase ? '| ' + data.flight_phase : ''}`;

                if (mapEl) {
                    mapEl.style.display = 'block';

                    if (data.latitude && data.longitude) {
                        initMap(data.latitude, data.longitude);
                        updateMap(data.latitude, data.longitude, data.heading);
                        addAirportMarkers(data.departure, data.arrival);
                    }
                }
            }

            // ===============================
            // SESSION TIMER
            // ===============================
            if (sessionEl && data.session_minutes !== undefined) {
                sessionEl.textContent =
                    `Online ${formatSession(data.session_minutes)}`;
            }

        })
        .catch(err => {
            console.error(err);
            card.className = 'error';

            if (modeEl)
                modeEl.textContent = "⚠️ Unable to load VATSIM status";
        });
}

// ===============================
// INIT
// ===============================
updateLiveStatus();
setInterval(updateLiveStatus, 600000);

