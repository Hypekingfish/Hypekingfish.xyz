export const handler = async () => {
  const CID = process.env.VATSIM_MEMBER_ID || "1630701";

  const LIVE_URL = "https://data.vatsim.net/v3/vatsim-data.json";
  const STATS_URL = `https://api.vatsim.net/v2/members/${CID}/stats`;

  // ===============================
  // Helpers
  // ===============================

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

  function ratingName(rating) {
    const map = {
      1: "Observer",
      2: "S1",
      3: "S2",
      4: "S3",
      5: "C1",
      6: "C2",
      7: "C3",
      8: "I1",
      9: "I2",
      10: "I3",
      11: "SUP",
      12: "ADM"
    };
    return map[rating] || "Unknown";
  }

  function getSessionMinutes(logon) {
    if (!logon) return 0;
    return Math.floor((Date.now() - new Date(logon)) / 60000);
  }

  function detectFlightPhase(altitude, groundspeed) {
    if (!altitude || !groundspeed) return null;

    if (groundspeed < 30) return "Parked";
    if (groundspeed < 80) return "Taxi";
    if (altitude < 3000) return "Climb/Departure";
    if (altitude > 30000 && groundspeed > 300) return "Cruise";
    if (altitude < 10000 && groundspeed > 200) return "Arrival/Descent";

    return "Enroute";
  }

  try {
    const [liveRes, statsRes] = await Promise.all([
      fetch(LIVE_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Hypekingfish-Live/2.0"
        }
      }),
      fetch(STATS_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Hypekingfish-Stats/2.0"
        }
      })
    ]);

    if (!liveRes.ok) throw new Error("Live feed error");

    const liveData = await liveRes.json();

    let statsData = {};
    if (statsRes.ok) {
      statsData = await statsRes.json();
    }

    const controller = liveData.controllers?.find(c => c.cid == CID);
    const pilot = liveData.pilots?.find(p => p.cid == CID);

    let liveStatus = {
      online: false,
      mode: null
    };

    // ===============================
    // CONTROLLER MODE
    // ===============================
    if (controller) {
      const fir = controller.callsign?.split("_")[0] || null;
      const sessionMinutes = getSessionMinutes(controller.logon_time);

      liveStatus = {
        online: true,
        mode: "ATC",
        callsign: controller.callsign,
        frequency: controller.frequency,
        facility: facilityName(controller.facility),
        fir,
        text_atis: controller.text_atis || null,
        logon_time: controller.logon_time,
        session_minutes: sessionMinutes
      };
    }

    // ===============================
    // PILOT MODE
    // ===============================
    else if (pilot) {
      const sessionMinutes = getSessionMinutes(pilot.logon_time);
      const flightPhase = detectFlightPhase(
        pilot.altitude,
        pilot.groundspeed
      );

      liveStatus = {
        online: true,
        mode: "PILOT",
        callsign: pilot.callsign,
        aircraft: pilot.flight_plan?.aircraft || null,
        departure: pilot.flight_plan?.departure || null,
        arrival: pilot.flight_plan?.arrival || null,
        route: pilot.flight_plan?.route || null,
        latitude: pilot.latitude,
        longitude: pilot.longitude,
        heading: pilot.heading,
        groundspeed: pilot.groundspeed,
        altitude: pilot.altitude,
        flight_phase: flightPhase,
        logon_time: pilot.logon_time,
        session_minutes: sessionMinutes
      };
    }

    // ===============================
    // RESPONSE
    // ===============================
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        ...liveStatus,

        stats: statsData.rating
          ? {
              rating_number: statsData.rating,
              rating_name: ratingName(statsData.rating),
              atc_hours: statsData.atc || 0,
              pilot_hours: statsData.pilot || 0,
              s1: statsData.s1 || 0,
              s2: statsData.s2 || 0,
              s3: statsData.s3 || 0,
              division: statsData.division || null,
              region: statsData.region || null
            }
          : null,

        network: {
          connected_clients:
            (liveData.controllers?.length || 0) +
            (liveData.pilots?.length || 0)
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
