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
          s1: data.atc_ratings?.find(r => r.rating === 2)?.hours || 0,
          s2: data.atc_ratings?.find(r => r.rating === 3)?.hours || 0,
          s3: data.atc_ratings?.find(r => r.rating === 4)?.hours || 0,
          c1: data.atc_ratings?.find(r => r.rating === 5)?.hours || 0,
          c3: data.atc_ratings?.find(r => r.rating === 7)?.hours || 0,
          i1: data.atc_ratings?.find(r => r.rating === 8)?.hours || 0,
          i3: data.atc_ratings?.find(r => r.rating === 10)?.hours || 0
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