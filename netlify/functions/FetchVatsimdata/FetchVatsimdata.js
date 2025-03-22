const handler = schedule("* * * * *", async (event, context) => {
  try {
    console.log('Function started');

    // Fetch both API responses concurrently
    const [vatsimNetResponse, vatsimHistoryResponse] = await Promise.all([
      fetch('https://api.vatsim.net/v2/members/1630701/stats', {
        headers: { 'accept': 'application/json' },
      }),
      fetch('https://api.vatsim.net/v2/members/1630701/history', {
        headers: { 'accept': 'application/json' },
      }),
    ]);
    
    // Ensure both responses are valid
    if (!vatsimNetResponse.ok || !vatsimHistoryResponse.ok) {
      throw new Error('Failed to fetch data from VATSIM');
    }

    const data = await vatsimNetResponse.json();
    const historyData = await vatsimHistoryResponse.json();

    console.log('Received data:', data);
    console.log('Received history data:', data);

    // Structure the response to match the required format
    const result = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Callsign: data.callsign, // from stats endpoint
        controllerHours: data.atc, // from stats endpoint
        pilotHours: data.pilot, // from stats endpoint
        s1Hours: data.s1, // from stats endpoint
        s2Hours: data.s2, // from stats endpoint
        s3Hours: data.s3, // from stats endpoint
        // Add history-related data if needed, like:
        // You can extract specific fields from historyData if needed
        // history: historyData or specific history fields
      }),
    };
    
    console.log('Returning:', result);
    return result;
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data' }),
    };
  }
});
