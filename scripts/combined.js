fetch('/.netlify/functions/GetVatsimData')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched Data:', data); // Debugging line

        // Function to convert decimal hours to HH:mm format and also show days
        function formatHoursWithDays(hours) {
            const totalMinutes = Math.round(hours * 60);
            const hh = Math.floor(totalMinutes / 60);
            const mm = totalMinutes % 60;

            // Calculate days equivalent
            const days = Math.floor(hh / 24);
            const remHours = hh % 24;

            // Original hours display
            let result = `${hh.toLocaleString()}:${mm.toString().padStart(2, '0')}`;

            // Append days display if more than 24h
            if (days > 0) {
                result += ` (≈ ${days}d ${remHours}h)`;
            }

            return result;
        }

        // Ensure values are numbers and handle missing data
        const controllerHours = parseFloat(data.controllerHours) || 0;
        const pilotHours = parseFloat(data.pilotHours) || 0;
        const combinedHours = controllerHours + pilotHours;

        console.log('Controller Hours:', controllerHours);
        console.log('Pilot Hours:', pilotHours);
        console.log('Combined Hours:', combinedHours);

        const elements = {
            'controller-hours': formatHoursWithDays(controllerHours),
            'pilot-hours': formatHoursWithDays(pilotHours),
            'vatsim-hours': formatHoursWithDays(combinedHours)
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    })
    .catch(error => {
        console.error('Error fetching VATSIM data:', error);
        const statsElement = document.getElementById('vatsim-stats');
        if (statsElement) {
            statsElement.textContent = 'Failed to load VATSIM stats';
        }
    });
