import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

const handler = schedule("* * * * *", async (event, context) => {
  try {
    console.log('Function started');

    const response = await fetch('https://vatsim.dev/api/core-api/members-api-retrieve-member-stats', {
      headers: {
        'Accept': 'application/json',
      },
    });

    // Check if the response is ok (status code 2xx)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Check if the response is JSON
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const data = await response.json();
    console.log('Received data:', data);

    // Check if data contains the expected 'callsign' property
    if (!data.callsign) {
      throw new Error('Callsilln not found in the response');
    }

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
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data', details: error.message }),
    };
  }
});

export { handler };