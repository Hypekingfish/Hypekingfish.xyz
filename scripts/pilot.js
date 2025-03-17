fetch('/.netlify/functions/GetVatsimData')
                    .then(response => response.json())
                    .then(data => {
                        // Add error checking before setting values
                        const elements = {
                            'pilot-hours': data.pilotHours,
                        };
  
                        for (const [id, value] of Object.entries(elements)) {
                            const element = document.getElementById(id);
                            if (element) {
                                element.textContent = value;
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