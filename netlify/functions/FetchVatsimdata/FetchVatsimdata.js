import { schedule } from '@netlify/functions';
import axios from "axios";


export const handler = schedule('* * * * *', async (event) => {
      try {
          let config = {
            method: 'get',
          maxBodyLength: Infinity,
            url: 'https://api.vatsim.net/v2/members/1630701/stats',
            headers: { 
              'Accept': 'application/json'
            }
          };
          
          axios(config)
          .then((response) => {
            console.log(JSON.stringify(response.data.atc));
            console.log(JSON.stringify(response.data.pilot))
          })
          .catch((error) => {
            console.log(error);
          });
        // Log to track the start of the function
          console.log('Fetching VATSIM data...');
    
          const fetch = (await import('node-fetch')).default;
          const url = `https://api.vatsim.net/v2/members/1630701/stats`;
          const response = await fetch(url);
        // Check if the response is OK
          if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
          }
        // Return a valid response
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
    // Log and return error response
          console.error("Error fetching VATSIM hours:", error);
          return {
          statusCode: 500,
          body: JSON.stringify({ error: "Failed to fetch VATSIM hours" }),
    };
   }
 });
