fetch('/.netlify/functions/FetchVatsimdata')
    .then(response => response.json())
    .then(data => {
        // Function to convert decimal hours to HH:mm format
        function formatHours(hours) {
            const totalMinutes = Math.round(hours * 60);
            const hh = Math.floor(totalMinutes / 60);
            const mm = totalMinutes % 60;
            return `${hh}:${mm.toString().padStart(2, '0')}`;
        }

        // Add error checking before setting values
        const elements = {
            'controller-hours': data.controllerHours,
            's1-hours': data.s1Hours,
            's2-hours': data.s2Hours,
            's3-hours': data.s3Hours
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = formatHours(value);
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
