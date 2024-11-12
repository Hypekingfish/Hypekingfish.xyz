import { schedule } from '@netlify/functions';
import axios from "axios";

// Define the function to handle requests
export const handler = async (event, context) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.vatsim.net/v2/members/1630701/stats',
    headers: { 
      'Accept': 'application/json'
    }
  };

  try {
    // Make the Axios request
    const response = await axios(config);
    const atcData = JSON.stringify(response.data.atc);
    const pilotData = JSON.stringify(response.data.pilot);

    // Return the response as JSON
    return {
      statusCode: 200,
      body: JSON.stringify({
        atc: atcData,
        pilot: pilotData
      })
    };
  } catch (error) {
    console.error(error);

    // Handle errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch VATSIM data" })
    };
  }
};
