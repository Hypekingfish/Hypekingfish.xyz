fetch('/.netlify/functions/GetVatsimData')
                    .then(response => response.json())
                    .then(data => {
                        console.log('Fetched Data:', data); // Debugging line
            
                        // Ensure values are numbers and handle missing data
                        const controllerHours = parseFloat(data.controllerHours) || 0;
                        const pilotHours = parseFloat(data.pilotHours) || 0;
                        const combinedHours = controllerHours + pilotHours;
            
                        console.log('Controller Hours:', controllerHours);
                        console.log('Pilot Hours:', pilotHours);
                        console.log('Combined Hours:', combinedHours);
            
                        const elements = {
                            'controller-hours': controllerHours,
                            'pilot-hours': pilotHours,
                            'vatsim-hours': combinedHours
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