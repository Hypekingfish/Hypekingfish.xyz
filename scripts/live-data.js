fetch("/.netlify/functions/vatsim-live")
  .then(res => res.json())
  .then(data => {
    const card = document.getElementById("live-card");
    const text = document.getElementById("live-text");

    if (!data.online) {
      card.className = "offline";
      text.textContent = "🔴 Offline on VATSIM";
      return;
    }

    card.className = "online";

    if (data.mode === "ATC") {
      text.textContent = `🟢 Controlling ${data.callsign} (${data.position})`;
      highlightFIR(data.callsign);
    } else {
      text.textContent = `✈️ Flying as ${data.callsign}`;
    }
  });
