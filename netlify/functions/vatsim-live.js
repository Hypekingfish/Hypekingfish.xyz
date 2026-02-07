export const handler = async () => {
  const CID = process.env.VATSIM_MEMBER_ID || "1630701";
  const DATA_URL = "https://data.vatsim.net/v3/vatsim-data.json";

  try {
    const res = await fetch(DATA_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Hypekingfish-Live/1.0"
      }
    });

    if (!res.ok) throw new Error("VATSIM feed error");

    const data = await res.json();

    const controller = data.controllers.find(c => c.cid == CID);
    const pilot = data.pilots.find(p => p.cid == CID);

    let status = { online: false };

    if (controller) {
      status = {
        online: true,
        mode: "ATC",
        callsign: controller.callsign,
        position: controller.frequency,
        facility: controller.facility,
        latitude: controller.latitude,
        longitude: controller.longitude
      };
    } else if (pilot) {
      status = {
        online: true,
        mode: "PILOT",
        callsign: pilot.callsign,
        aircraft: pilot.flight_plan?.aircraft,
        latitude: pilot.latitude,
        longitude: pilot.longitude
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // 🔥 1 min cache
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        ...status,
        fetched: new Date().toISOString()
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ online: false, error: true })
    };
  }
};
