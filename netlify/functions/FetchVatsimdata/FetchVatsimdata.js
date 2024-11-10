import { schedule } from '@netlify/functions';

export const handler = schedule('* * * * *', async (event) => {
  try {
    // Log to track the start of the function
    console.log('Fetching VATSIM data...');
    
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.vatsim.net/v2/members/1630701/stats`;
    const response = await fetch(url);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();
    console.log('Fetched data:', data); // Log the fetched data

    // Return a valid response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        controllerHours: data.atc,
        pilotHours: data.pilot,
      }),
    };

  } catch (error) {
    // Log and return error response
    console.error("Error fetching VATSIM hours:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch VATSIM hours" }),
    };
  }
});
