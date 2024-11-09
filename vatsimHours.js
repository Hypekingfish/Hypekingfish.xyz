document.addEventListener("DOMContentLoaded", async function () {
    const url = `https://api.vatsim.net/v2/members/1630701/stats`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const controllerHours = data.atc;
        const pilotHours = data.pilot;

        document.getElementById('vatsim-hours').innerHTML = `
            <p>Controlling Hours: ${controllerHours}</p>
            <p>Pilot Hours: ${pilotHours}</p>
        `;
    } catch (error) {
        console.error("Error fetching VATSIM hours:", error);
        document.getElementById('vatsim-hours').innerText = "Error loading hours.";
    }
});
