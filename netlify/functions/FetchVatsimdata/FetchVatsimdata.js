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
    const data = await vatsimHistoryResponse.json();

    console.log('Received data:', data);
    console.log('Received history data:', data);
    
    const result = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Callsign: data.callsign,
        controllerHours: data.atc,
        pilotHours: data.pilot,
        s1Hours: data.s1,
        s2Hours: data.s2,
        s3Hours: data.s3,
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
