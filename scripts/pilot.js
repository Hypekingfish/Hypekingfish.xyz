document.addEventListener('DOMContentLoaded', () => {
    // Immediately show a loading state (only if #vatsim-stats exists)
    const statsElement = document.getElementById('vatsim-stats');
    if (statsElement) {
        statsElement.textContent = 'Loading VATSIM stats...';
    }

    fetch('/.netlify/functions/GetVatsimData')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.debug('VATSIM data fetched:', data);

            // Function to convert decimal hours to HH:mm format and show days if applicable
            function formatHoursWithDays(hours) {
                if (isNaN(hours)) return '0:00';

                const totalMinutes = Math.round(hours * 60);
                const hh = Math.floor(totalMinutes / 60);
                const mm = totalMinutes % 60;

                const days = Math.floor(hh / 24);
                const remHours = hh % 24;

                let base = `${hh}:${mm.toString().padStart(2, '0')}`;
                if (days > 0) {
                    const dLabel = days === 1 ? 'day' : 'days';
                    const hLabel = remHours === 1 ? 'hr' : 'hrs';
                    base += ` (~${days} ${dLabel} ${remHours} ${hLabel})`;
                }
                return base;
            }

            // Define all elements to update and their data mapping
            const elements = {
                'pilot-hours': parseFloat(data?.pilotHours) || 0,
                // Add more mappings here if needed
            };

            // Update DOM elements safely
            for (const [id, value] of Object.entries(elements)) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = formatHoursWithDays(value);
                }
            }

            // Clear loading text if present
            if (statsElement && Object.keys(elements).length > 0) {
                statsElement.textContent = '';
            }
        })
        .catch(error => {
            console.error('Error fetching VATSIM stats:', error);
            const statsElement = document.getElementById('vatsim-stats');
            if (statsElement) {
                statsElement.textContent = '⚠ Failed to load VATSIM stats. Please try again later.';
                statsElement.style.color = 'red';
            }
        });
});
