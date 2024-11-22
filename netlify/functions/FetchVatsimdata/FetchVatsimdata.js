import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

const handler = schedule("* * * * *", async (event, context) => {
  try {
    const response = await fetch('https://api.vatsim.net/v2/members/1630701/stats', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        controllerHours: data.atc,
        pilotHours: data.pilot
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data' }),
    };
  }
});

export { handler };

 