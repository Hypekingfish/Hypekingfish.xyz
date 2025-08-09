import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

// Replace CID with the actual VATSIM member ID
const CID = 1630701;
const url = `https://api.vatsim.net/v2/members/${CID}/atc`;
const params = new URLSearchParams({ limit: '1' });

export const handler = schedule("* * * * *", async () => {
  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const callsign = data[0]?.callsign || 'No callsign found';

    console.log(`Latest ATC callsign: ${callsign}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ callsign })
    };
  } catch (error) {
    console.error('Error fetching VATSIM data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
});
