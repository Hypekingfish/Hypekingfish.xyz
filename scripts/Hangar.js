// --- Aircraft list ---
const aircraftList = [
  { name: "Boeing 737-800", tail: "N500WR", icao24: "a63bf4", specs: "Twin-engine | 175 seats", routes: "Southwest Airlines" }
];

// --- Keep track of maps and trails ---
const aircraftMaps = {};

// --- Fetch aircraft data from Airplanes.live ---
async function fetchAircraft(icao24) {
  try {
    const url = `https://api.airplanes.live/v2/icao/${icao24}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching ADS-B data:", err);
    return null;
  }
}

// --- Render hangar ---
async function renderHangar() {
  const hangar = document.getElementById("hangar");
  hangar.innerHTML = "<p>Loading...</p>";
  hangar.innerHTML = "";

  for (const ac of aircraftList) {
    const data = await fetchAircraft(ac.icao24);

    let status = "⚪ Not Detected";
    let extra = "";
    let positionText = "N/A";
    let lat = null, lon = null;

    if (data && data.ac && data.ac.length > 0) {
      const plane = data.ac[0];
      const altitude = plane.alt_baro ? `${plane.alt_baro.toLocaleString()} ft` : "N/A";
      const speed = plane.gs ? `${Math.round(plane.gs)} kt` : "N/A";

      status = plane.ground ? "🔵 On Ground" : "🟢 In Flight";
      extra = `ALT: ${altitude} | SPD: ${speed}`;

      if (plane.origin && plane.destination) {
        positionText = `${plane.origin.icao || plane.origin.iata || "?"} ➡ ${plane.destination.icao || plane.destination.iata || "?"}`;
      } else if (plane.lat && plane.lon) {
        lat = plane.lat;
        lon = plane.lon;
        positionText = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      }
    }

    const card = document.createElement("div");
    card.className = "plane-card";
    card.innerHTML = `
      <h3>${ac.name} (${ac.tail})</h3>
      <p>${status}</p>
      <p>${extra}</p>
      <p><strong>Position:</strong> ${positionText}</p>
      <p><strong>Specs:</strong> ${ac.specs}</p>
      <p><strong>Routes:</strong> ${ac.routes}</p>
      <div id="map-${ac.icao24}" class="plane-map"></div>
    `;
    hangar.appendChild(card);

    // --- Initialize or update Leaflet map ---
    if (lat !== null && lon !== null) {
      if (!aircraftMaps[ac.icao24]) {
        // Initialize map
        const map = L.map(`map-${ac.icao24}`, { center: [lat, lon], zoom: 5 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const marker = L.marker([lat, lon]).addTo(map);
        const path = L.polyline([[lat, lon]], { color: 'red' }).addTo(map);

        // Fix Leaflet container sizing
        setTimeout(() => { map.invalidateSize(); map.setView([lat, lon]); }, 100);

        aircraftMaps[ac.icao24] = { map, marker, path, positions: [[lat, lon]] };
      } else {
        // Update marker and trail
        const obj = aircraftMaps[ac.icao24];
        obj.marker.setLatLng([lat, lon]);
        obj.positions.push([lat, lon]);
        obj.path.setLatLngs(obj.positions);
        obj.map.setView([lat, lon]);
      }
    }
  }
}

// --- Refresh setup ---
document.addEventListener("DOMContentLoaded", () => {
  renderHangar();
  setInterval(renderHangar, 5 * 60 * 1000);
});