import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

const handler = schedule("* * * * *", async (event, context) => {
  try {
    console.log('Function started');

    const responses = await Promise.all([
      fetch('https://api.vatsim.net/v2/members/1630701/stats', {
        headers: { 'accept': 'application/json'},
      }),
      fetch('https://api.vatsim.net/v2/members/1630701/history', {
        headers: { 'accept': 'application/json'},
      }),
    ]);

    const vatsimNetResponse = responses[0]; // Ensure the first response is used
    const data = await vatsimNetResponse.json();

    console.log('Received data:', data);

    const result = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Callsign: data.callsign || "Unknown",
        controllerHours: data.atc || 0,
        pilotHours: data.pilot || 0,
        s1Hours: data.s1 || 0,
        s2Hours: data.s2 || 0,
        s3Hours: data.s3 || 0
      }),
    };

    console.log('Returning:', result);
    return result;

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data' }),
    };
  }
});

export { handler };
