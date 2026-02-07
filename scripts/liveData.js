fetch('/.netlify/functions/GetVatsimData')
    .then(response => response.json())
    .then(data => {
        console.log('Live Data:', data);
        const statusElement = document.getElementById('live-status');

        if (data.online) {
            const { mode, callsign, position, facility, latitude, longitude } = data; 
            statusElement.textContent = `${mode} ${callsign} at ${position} (${facility}) [${latitude.toFixed(2)}, ${longitude.toFixed(2)}]`;
        } else {
            statusElement.textContent = 'Offline';
        }
    })
    .catch(error => {
        console.error('Error fetching live data:', error);
        const statusElement = document.getElementById('live-status');
        if (statusElement) {
            statusElement.textContent = 'Failed to load live data';
        }
    });