import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

const handler = schedule("0 * * * *", async (event, context) => {
  try {
    console.log('Function started');
    const response = await fetch('https://vatsim.dev/api/core-api/members-api-retrieve-member-stats', {
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
        Callsign: data.callsign
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

 