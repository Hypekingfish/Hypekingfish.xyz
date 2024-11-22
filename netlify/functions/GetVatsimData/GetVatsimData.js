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
        "Access-Control-Allow-Origin": "*",
        "X-RateLimit-Limit": response.headers.get('X-RateLimit-Limit'),
        "X-RateLimit-Remaining": response.headers.get('X-RateLimit-Remaining'),
      },
      body: JSON.stringify({
        controllerHours: data.atc,
        pilotHours: data.pilot,
        ratingHours: {
          observer: data.rating_hours.OBS || 0,
          student1: data.rating_hours.S1 || 0,
          student2: data.rating_hours.S2 || 0,
          student3: data.rating_hours.S3 || 0,
          controller1: data.rating_hours.C1 || 0,
          controller3: data.rating_hours.C3 || 0,
          instructor1: data.rating_hours.I1 || 0,
          instructor3: data.rating_hours.I3 || 0,
          supervisor: data.rating_hours.SUP || 0,
          administrator: data.rating_hours.ADM || 0
        }
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch VATSIM data' }),
    };
  }
}; 