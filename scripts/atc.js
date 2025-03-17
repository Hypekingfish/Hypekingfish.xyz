fetch('/.netlify/functions/GetVatsimData')
                  .then(response => response.json())
                  .then(data => {
                      // Add error checking before setting values
                      const elements = {
                          'controller-hours': data.controllerHours,
                          's1-hours': data.s1Hours,
                         // 's2-hours': data.s2Hours,
                         // 's3-hours': data.s3Hours
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