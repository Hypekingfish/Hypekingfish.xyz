export const handler = async () => {
  const CID = process.env.VATSIM_MEMBER_ID || "1630701";

  const LIVE_URL = "https://data.vatsim.net/v3/vatsim-data.json";
  const STATS_URL = `https://api.vatsim.net/v2/members/${CID}/stats`;

  // ===============================
  // Helpers
  // ===============================

  const facilityMap = {
    0: "Observer",
    1: "FSS",
    2: "Delivery",
    3: "Ground",
    4: "Tower",
    5: "Approach",
    6: "Center"
  };

  const ratingMap = {
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

  const getSessionMinutes = (logon) =>
    logon ? Math.floor((Date.now() - new Date(logon)) / 60000) : 0;

  const formatSession = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const detectFlightPhase = (alt, gs, vs = 0) => {
    if (!alt || !gs) return null;

    if (gs < 5) return "Cold & Dark";
    if (gs < 30) return "Parked";
    if (gs < 80) return "Taxi";
    if (alt < 3000 && vs > 500) return "Climb";
    if (alt < 10000 && vs < -500) return "Descent";
    if (alt > 28000 && gs > 400) return "Cruise";
    if (alt < 3000 && gs > 140) return "Approach";

    return "Enroute";
  };

  const getControllerTypeFromCallsign = (callsign = "") => {
    if (callsign.includes("_DEL")) return "Delivery";
    if (callsign.includes("_GND")) return "Ground";
    if (callsign.includes("_TWR")) return "Tower";
    if (callsign.includes("_APP") || callsign.includes("_DEP")) return "Approach";
    if (callsign.includes("_CTR")) return "Center";
    return "ATC";
  };

  try {
    const [liveRes, statsRes] = await Promise.all([
      fetch(LIVE_URL, {
        headers: { Accept: "application/json" }
      }),
      fetch(STATS_URL, {
        headers: { Accept: "application/json" }
      })
    ]);

    if (!liveRes.ok) throw new Error("Live feed error");

    const liveData = await liveRes.json();
    const statsData = statsRes.ok ? await statsRes.json() : {};

    const controller = liveData.controllers?.find(c => c.cid == CID);
    const pilot = liveData.pilots?.find(p => p.cid == CID);

    let liveStatus = { online: false, mode: null };

    // ===============================
    // CONTROLLER MODE
    // ===============================
    if (controller) {
      const sessionMinutes = getSessionMinutes(controller.logon_time);

      liveStatus = {
        online: true,
        mode: "ATC",
        callsign: controller.callsign,
        frequency: controller.frequency,
        facility: facilityMap[controller.facility] || "Unknown",
        position_type: getControllerTypeFromCallsign(controller.callsign),
        fir: controller.callsign?.split("_")[0] || null,
        logon_time: controller.logon_time,
        session_minutes: sessionMinutes,
        session_readable: formatSession(sessionMinutes),
        text_atis: controller.text_atis || null
      };
    }

    // ===============================
    // PILOT MODE
    // ===============================
    else if (pilot) {
      const sessionMinutes = getSessionMinutes(pilot.logon_time);

      liveStatus = {
        online: true,
        mode: "PILOT",
        callsign: pilot.callsign,
        aircraft: pilot.flight_plan?.aircraft ?? null,
        departure: pilot.flight_plan?.departure ?? null,
        arrival: pilot.flight_plan?.arrival ?? null,
        route: pilot.flight_plan?.route ?? null,
        latitude: pilot.latitude,
        longitude: pilot.longitude,
        heading: pilot.heading,
        groundspeed: pilot.groundspeed,
        altitude: pilot.altitude,
        flight_phase: detectFlightPhase(
          pilot.altitude,
          pilot.groundspeed,
          pilot.vertical_speed
        ),
        logon_time: pilot.logon_time,
        session_minutes: sessionMinutes,
        session_readable: formatSession(sessionMinutes)
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
            rating_name: ratingMap[statsData.rating] || "Unknown",
            atc_hours: statsData.atc || 0,
            pilot_hours: statsData.pilot || 0,
            division: statsData.division || null,
            region: statsData.region || null
          }
          : null,

        network: {
          controllers: liveData.controllers?.length || 0,
          pilots: liveData.pilots?.length || 0,
          total_clients:
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