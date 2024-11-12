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
  
    await axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error("Error in scheduled function:", error);
  }
});
