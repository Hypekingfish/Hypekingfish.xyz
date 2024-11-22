import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

const handler = schedule("* * * * *", async (event, context) => {
  try {
    console.log('Function started');
    const response = await fetch('https://api.vatsim.net/v2/members/1630701/stats', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Received data:', data);
    
    console.log('Raw data structure:', JSON.stringify(data, null, 2));
    
    const result = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        controllerHours: parseFloat(data.atc) || 0,
        pilotHours: parseFloat(data.pilot) || 0,
        s1Hours: parseFloat(data.s1) || 0,
        s2Hours: parseFloat(data.s2) || 0,
        s3Hours: parseFloat(data.s3) || 0
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

 