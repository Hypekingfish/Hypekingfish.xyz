import { schedule } from '@netlify/functions';
import axios from "axios";

// Define the scheduled function
export const handler = schedule("@minute", async (event, context) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.vatsim.net/v2/members/1630701/stats',
    headers: { 
      'Accept': 'application/json'
    }
  };

  try {
    const response = await axios(config);
    const atcData = JSON.stringify(response.data.atc);
    const pilotData = JSON.stringify(response.data.pilot);

    return {
      statusCode: 200,
      body: JSON.stringify({
        atc: atcData,
        pilot: pilotData
      })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch VATSIM data" })
    };
  }
});
