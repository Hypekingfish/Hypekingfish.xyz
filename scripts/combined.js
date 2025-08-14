fetch('/.netlify/functions/GetVatsimData')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched Data:', data); // Debugging line

        // Function to convert decimal hours to HH:mm format, handling 1000+ hours
        function formatHours(hours) {
            const totalMinutes = Math.round(hours * 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const mm = totalMinutes % 60;

            // If more than 24 hours, break into days
            if (totalHours >= 24) {
                const days = Math.floor(totalHours / 24);
                const hh = totalHours % 24;
                return `${days}d ${hh}:${mm.toString().padStart(2, '0')}`;
            }

            // Less than a day: show normal hours
            return `${totalHours}:${mm.toString().padStart(2, '0')}`;
        }

        // Ensure values are numbers and handle missing data
        const controllerHours = parseFloat(data.controllerHours) || 0;
        const pilotHours = parseFloat(data.pilotHours) || 0;
        const combinedHours = controllerHours + pilotHours;

        console.log('Controller Hours:', controllerHours);
        console.log('Pilot Hours:', pilotHours);
        console.log('Combined Hours:', combinedHours);

        const elements = {
            'controller-hours': formatHours(controllerHours),
            'pilot-hours': formatHours(pilotHours),
            'vatsim-hours': formatHours(combinedHours)
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
