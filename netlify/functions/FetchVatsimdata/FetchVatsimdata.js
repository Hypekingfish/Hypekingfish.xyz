const { schedule } = require('@netlify/functions');
const fetch = require('node-fetch');

// Schedule the function to run every minute
module.exports.handler = schedule('* * * * *', async (event) => {
  try {
    // Fetch VATSIM hours
    const response = await fetch('https://api.vatsim.net/v2/members/1630701/stats');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const controllerHours = data.atc;
    const pilotHours = data.pilot;

    // Log the VATSIM hours in the Netlify function logs
    console.log(`Controlling Hours: ${controllerHours}`);
    console.log(`Pilot Hours: ${pilotHours}`);
    console.log(`Next function run at ${new Date().toLocaleString()}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Fetched VATSIM hours successfully.`,
        controllerHours,
        pilotHours,
      }),
    };
  } catch (error) {
    console.error("Error fetching VATSIM hours:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch VATSIM hours" }),
    };
  }
});
