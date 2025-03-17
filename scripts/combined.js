fetch('/.netlify/functions/GetVatsimData')
    .then(response => response.json())
    .then(data => {
        // Ensure the values are numbers
        const controllerHours = parseFloat(data.atc) || 0; // Default to 0 if it's not a valid number
        const pilotHours = parseFloat(data.pilot) || 0; // Default to 0 if it's not a valid number

        // Combine both hours
        const combinedHours = controllerHours + pilotHours;

        // Display the combined hours in the element with id "hoursDisplay"
        const hoursDisplayElement = document.getElementById("hoursDisplay");
        if (hoursDisplayElement) {
            hoursDisplayElement.textContent = `Total Hours: ${combinedHours}`;
        } else {
            console.error("Element with id 'hoursDisplay' not found");
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
