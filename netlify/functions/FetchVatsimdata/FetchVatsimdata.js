import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

const handler = schedule("0 * * * *", async (event, context) => {
  try {
    console.log('Function started');
    const response = await fetch('https://api.vatsim.net/v2/members/1630701/stats', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Received data:', data);
    
    const result = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        controllerHours: data.atc,
        pilotHours: data.pilot,
        s1Hours: data.s1,
        // s2Hours: data.s2,
        // s3Hours: data.s3
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

 