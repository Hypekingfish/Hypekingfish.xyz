export const handler = async (event, context) => {
  try {
    // Here you would typically fetch from your database where the scheduled function stores the data
    // For now, we'll just call the VATSIM API directly
    const response = await fetch('https://api.vatsim.net/v2/members/1630701/history', {
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
        Callsign: data.callsign
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data' }),
    };
  }
}; 