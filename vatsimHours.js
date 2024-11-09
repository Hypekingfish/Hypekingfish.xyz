document.addEventListener("DOMContentLoaded", async function() {
    const url = `https://api.vatsim.net/v2/members/1630701/stats`;

    try {
        console.log("Fetching VATSIM hours...");
        const response = await fetch(url);

        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data fetched:", data);  // Log fetched data

        const controllerHours = data.atc;
        const pilotHours = data.pilot;

        // Check if the data has the expected properties
        if (controllerHours !== undefined && pilotHours !== undefined) {
            document.getElementById('vatsim-hours').innerHTML = `
                <p>Controlling Hours: ${controllerHours}</p>
                <p>Pilot Hours: ${pilotHours}</p>
            `;
        } else {
            throw new Error("Missing data for hours");
        }
    } catch (error) {
        console.error("Error fetching VATSIM hours:", error);
        document.getElementById('vatsim-hours').innerText = "Error loading hours.";
    }
});
