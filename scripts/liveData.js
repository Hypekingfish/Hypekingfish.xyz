const statusElement = document.getElementById('live-status');

function formatTime(seconds = 0) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function updateStatus() {
  statusElement.textContent = 'Checking VATSIM status…';

  fetch('/.netlify/functions/GetVatsimData')
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(data => {
      console.log('Live Data:', data);

      if (!data || !data.online) {
        statusElement.textContent = '🔴 Offline on VATSIM';
        statusElement.className = 'offline';
        return;
      }

      const {
        mode,
        callsign,
        position,
        facility,
        latitude,
        longitude,
        sessionTime,
        aircraft,
        departure,
        arrival,
        frequency
      } = data;

      statusElement.className = 'online';

      // Google Maps link if coords exist
      const mapLink = (latitude && longitude)
        ? `https://maps.google.com/?q=${latitude},${longitude}`
        : null;

      if (mode === 'ATC') {
        statusElement.innerHTML = `
          🟢 <strong>${callsign}</strong><br>
          ${position || 'Unknown position'} (${facility || 'N/A'})<br>
          ${frequency ? `📻 ${frequency}` : ''}  
          ⏱ ${formatTime(sessionTime)}
        `;
      } else {
        statusElement.innerHTML = `
          ✈️ <strong>${callsign}</strong><br>
          ${aircraft || 'Unknown aircraft'}<br>
          ${departure || '----'} → ${arrival || '----'}<br>
          ⏱ ${formatTime(sessionTime)}
          ${mapLink ? `<br><a href="${mapLink}" target="_blank">📍 View on map</a>` : ''}
        `;
      }
    })
    .catch(err => {
      console.error('Error fetching live data:', err);
      statusElement.textContent = '⚠️ Failed to load VATSIM data';
      statusElement.className = 'error';
    });
}

// Initial load
updateStatus();

// Auto-refresh every 60s
setInterval(updateStatus, 60000);
