fetch('/.netlify/functions/FetchVatsimdata')
    .then(response => response.json())
    .then(data => {
        // Function to convert decimal hours to HH:mm format and show days if applicable
        function formatHoursWithDays(hours) {
            const totalMinutes = Math.round(hours * 60);
            const hh = Math.floor(totalMinutes / 60);
            const mm = totalMinutes % 60;

            const days = Math.floor(hh / 24);
            const remHours = hh % 24;

            let result = `${hh}:${mm.toString().padStart(2, '0')}`;
            if (days > 0) {
                result += ` (≈ ${days}d ${remHours}h)`;
            }

            return result;
        }

        // Add error checking before setting values
        const elements = {
            'pilot-hours': parseFloat(data.pilotHours) || 0,
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = formatHoursWithDays(value);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const statsElement = document.getElementById('vatsim-stats');
        if (statsElement) {
            statsElement.textContent = 'Failed to load VATSIM stats';
        }
    });
