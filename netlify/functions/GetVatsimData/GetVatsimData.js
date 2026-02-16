export const handler = async () => {
  const CID = process.env.VATSIM_MEMBER_ID || "1630701";

  const LIVE_URL = "https://data.vatsim.net/v3/vatsim-data.json";
  const STATS_URL = `https://api.vatsim.net/v2/members/${CID}/stats`;

  function facilityName(fac) {
    const map = {
      0: "Observer",
      1: "FSS",
      2: "Delivery",
      3: "Ground",
      4: "Tower",
      5: "Approach/Departure",
      6: "Center"
    };
    return map[fac] || "Unknown";
  }

  try {
    const [liveRes, statsRes] = await Promise.all([
      fetch(LIVE_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Hypekingfish-Live/1.0"
        }
      }),
      fetch(STATS_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Hypekingfish-Stats/1.0"
        }
      })
    ]);

    if (!liveRes.ok) throw new Error("Live feed error");
    if (!statsRes.ok) throw new Error("Stats API error");

    const liveData = await liveRes.json();
    const statsData = await statsRes.json();

    const controller = liveData.controllers?.find(c => c.cid == CID);
    const pilot = liveData.pilots?.find(p => p.cid == CID);

    let liveStatus = { online: false };

    if (controller) {
      const fir = controller.callsign?.split("_")[0] || null;

      liveStatus = {
        online: true,
        mode: "ATC",
        callsign: controller.callsign,
        frequency: controller.frequency,
        facility: facilityName(controller.facility),
        text_atis: controller.text_atis
      };

    } else if (pilot) {

      liveStatus = {
        online: true,
        mode: "PILOT",
        callsign: pilot.callsign,
        aircraft: pilot.flight_plan?.aircraft,
        latitude: pilot.latitude,
        longitude: pilot.longitude,
        heading: pilot.heading,
        groundspeed: pilot.groundspeed,
        altitude: pilot.altitude
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        ...liveStatus,

        stats: {
          rating: statsData.rating,
          atc_hours: statsData.atc,
          pilot_hours: statsData.pilot,
          s1: statsData.s1,
          s2: statsData.s2,
          s3: statsData.s3
        },

        fetched: new Date().toISOString()
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        online: false,
        error: true,
        message: err.message
      })
    };
  }
};
