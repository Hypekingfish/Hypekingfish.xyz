const controllerHours = data.atc; // Controller hours from the data
const pilotHours = data.pilot; // Pilot hours from the data

// Combine both hours
const combinedHours = controllerHours + pilotHours;

// Display the combined hours (for example, in an element with the id "hoursDisplay")
document.getElementById("hoursDisplay").textContent = `Total Hours: ${combinedHours}`;
