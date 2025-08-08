export const handler = async (event, context) => {
  try {
    const response = await fetch('https://api.vatsim.net/v2/members/1630701/history', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`VATSIM API error: ${response.status}`);
    }

    const data = await response.json();

    const latestSession = data.pilot || data.atc || [];
    const latest = latestSession.length > 0 ? latestSession[0] : null;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Enable CORS
      },
      body: JSON.stringify({
        callsign: latest ? latest.callsign : null,
        type: latest ? (data.pilot ? "pilot" : "atc") : null
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data' }),
    };
  }
};


export const config = {
  schedule: '@hourly', // Options: @daily, @hourly, @weekly, etc.
};
