import { schedule } from '@netlify/functions';
import axios from "axios";

// Rename the handler function to avoid redeclaration
const fetchVatsimData = async (event) => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.vatsim.net/v2/members/1630701/stats',
      headers: {
        'Accept': 'application/json'
      }
    };
    
    const response = await axios(config);
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        controllerHours: response.data.atc,
        pilotHours: response.data.pilot
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data' }),
    };
  }
};

// Export the scheduled function (runs every hour)
export const handler = schedule("@hourly", fetchVatsimData);

 