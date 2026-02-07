const card = document.getElementById("live-card");
const text = document.getElementById("live-text");
const subtext = document.getElementById("live-subtext");

card.className = "loading";
text.textContent = "🟡 Checking VATSIM status…";

fetch("/.netlify/functions/vatsim-live")
  .then(res => {
    if (!res.ok) throw new Error("Network response failed");
    return res.json();
  })
  .then(data => {
    if (!data || !data.online) {
      card.className = "offline";
      text.textContent = "🔴 Offline on VATSIM";
      subtext.textContent = "Not connected to the network";
      return;
    }

    card.className = "online pulse";

    // Session time helper
    const formatDuration = seconds => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return `${h}h ${m}m`;
    };

    if (data.mode === "ATC") {
      text.textContent = `🟢 Controlling ${data.callsign}`;
      subtext.textContent = `
        ${data.position || "Unknown position"}
        • ${data.frequency || "Freq N/A"}
        • ${formatDuration(data.sessionTime)}
      `;

      highlightFIR(data.callsign);

    } else {
      text.textContent = `✈️ Flying as ${data.callsign}`;

      subtext.textContent = `
        ${data.aircraft || "Unknown aircraft"}
        • ${data.departure || "----"} → ${data.arrival || "----"}
        • ${formatDuration(data.sessionTime)}
      `;
    }
  })
  .catch(err => {
    console.error(err);
    card.className = "error";
    text.textContent = "⚠️ Unable to reach VATSIM";
    subtext.textContent = "Try again in a moment";
  });
