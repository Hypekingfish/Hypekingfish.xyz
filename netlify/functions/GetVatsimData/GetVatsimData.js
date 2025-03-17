export const handler = async (event, context) => {
  try {
    // Here you would typically fetch from your database where the scheduled function stores the data
    // For now, we'll just call the VATSIM API directly
    const response = await fetch('https://api.vatsim.net/v2/members/1630701/stats', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Enable CORS
      },
      body: JSON.stringify({
        controllerHours: data.atc,
        pilotHours: data.pilot,
        s1Hours: data.s1,
        s2Hours: data.s2,
        s3Hours: data.s3
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data' }),
    };
  }
}; 