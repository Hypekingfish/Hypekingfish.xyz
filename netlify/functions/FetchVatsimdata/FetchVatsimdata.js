// Import schedule from Netlify functions
import { schedule } from '@netlify/functions';

export const handler = schedule('* * * * *', async (event) => {
  try {
    // Use dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default;

    const url = `https://api.vatsim.net/v2/members/1630701/stats`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    // Check if 'data.atc' and 'data.pilot' are defined and extract them
    const controllerHours = data?.atc?.hours || 0; // Default to 0 if undefined
    const pilotHours = data?.pilot?.hours || 0;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
