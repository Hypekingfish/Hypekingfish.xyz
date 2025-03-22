import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

const handler = schedule("0 * * * *", async (event, context) => {
  try {
    console.log('Function started');

    // Fetch data from both APIs simultaneously using Promise.all
    const [vatsimNetResponse, vatsimDevResponse] = await Promise.all([
      fetch('https://api.vatsim.net/v2/members/1630701/stats', {
        headers: { 'Accept': 'application/json' },
      }),
      fetch('https://vatsim.dev/api/core-api/members-api-retrieve-member-stats', {
        headers: { 'Accept': 'application/json' },
      }),
    ]);

    // Check if vatsim.net response is OK
    if (!vatsimNetResponse.ok) {
      throw new Error(`Failed vatsim.net API request with status: ${vatsimNetResponse.status}`);
    }

    // Check if vatsim.dev response is OK
    if (!vatsimDevResponse.ok) {
      const text = await vatsimDevResponse.text(); // Get the response as text if not OK
      throw new Error(`Failed vatsim.dev API request with status: ${vatsimDevResponse.status}. Response: ${text}`);
    }

    // Parse both responses
    const vatsimNetData = await vatsimNetResponse.json();
    const vatsimDevData = await vatsimDevResponse.json();

    console.log('Received data from vatsim.net:', vatsimNetData);
    console.log('Received data from vatsim.dev:', vatsimDevData);

    // Combine the data or handle it as needed
    const result = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vatsimNetControllerHours: vatsimNetData.atc,
        vatsimNetPilotHours: vatsimNetData.pilot,
        vatsimNetS1Hours: vatsimNetData.s1,
        vatsimNetS2Hours: vatsimNetData.s2,
        vatsimNetS3Hours: vatsimNetData.s3,
        vatsimDevControllerHours: vatsimDevData.atc,
        vatsimDevPilotHours: vatsimDevData.pilot,
        vatsimDevS1Hours: vatsimDevData.s1,
        vatsimDevS2Hours: vatsimDevData.s2,
        vatsimDevS3Hours: vatsimDevData.s3
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
