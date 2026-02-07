const card = document.getElementById('live-card');
const text = document.getElementById('live-text');

function formatTime(seconds = 0) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
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
        return;
      }

      card.className = 'online';

      const {
        mode,
        callsign,
        position,
        facility,
        frequency,
        sessionTime,
        aircraft,
        departure,
        arrival
      } = data;

      if (mode === 'ATC') {
        text.innerHTML = `
          🟢 <strong>${callsign}</strong><br>
          ${position || 'Unknown position'} (${facility || 'N/A'})<br>
          ${frequency ? `📻 ${frequency}` : ''}
          ${sessionTime ? `• ⏱ ${formatTime(sessionTime)}` : ''}
        `;
      } else {
        text.innerHTML = `
          ✈️ <strong>${callsign}</strong><br>
          ${aircraft || 'Unknown aircraft'}<br>
          ${departure || '----'} → ${arrival || '----'}
          ${sessionTime ? `<br>⏱ ${formatTime(sessionTime)}` : ''}
        `;
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
