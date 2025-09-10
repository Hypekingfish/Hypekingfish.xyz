const aircraftList = [
      { name: "Cessna 172", image: "", typecode: "C172", specs: "Single-engine | 4 seats", routes: "Short hops, VFR training" },
      { name: "Boeing 737-900ER", image: "", typecode: "B739", specs: "Twin-engine | 220 seats", routes: "Regional & medium haul flights" },
      { name: "Airbus A320neo", image: "", typecode: "A320", specs: "Twin-engine | 180-240 seats", routes: "Short to medium haul" },
      { name: "Boeing 787 Dreamliner", image: "", typecode: "B787", specs: "Twin-engine | 242-330 seats", routes: "Long haul international flights" },
      { name: "Cessna Citation X", image: "", typecode: "C750", specs: "Twin-engine | 8 seats", routes: "Business jet, transcontinental" },
      { name: "Piper PA-28 Cherokee", image: "", typecode: "PA28", specs: "Single-engine | 4 seats", routes: "Flight training, short trips" },
      { name: "Cirrus SR22", image: "", typecode: "SR22", specs: "Single-engine | 4 seats", routes: "Personal use, cross-country" },
      { name: "Beechcraft Turbine Duke", image: "", typecode: "B60T", tailnumber: "N3675D", specs: "Specifications not available", routes: "Routes not available" }
    ];

    const hangar = document.getElementById("hangar");
    const searchInput = document.getElementById("searchPlanes");

    function renderHangar(list) {
      hangar.innerHTML = ""; // Clear existing cards
      list.forEach(plane => {
        const card = document.createElement("div");
        card.classList.add("plane-card");

        const name = plane.name || "Unknown Aircraft";
        const image = plane.image || "https://dummyimage.com/250x180/333/fff&text=Image+Coming+Soon";
        const typecode = plane.typecode || "N/A";
        const specs = plane.specs || "Specifications not available";
        const routes = plane.routes || "Routes not available";
        const tailBadge = plane.tailnumber ? `<div class="tail-badge">${plane.tailnumber}</div>` : "";

        card.innerHTML = `
          <div style="position: relative;">
            <img src="${image}" alt="${name}">
            ${tailBadge}
          </div>
          <div class="plane-info">
            <h2>${name}</h2>
            <p><strong>Typecode:</strong> ${typecode}</p>
            <p><strong>Specs:</strong> ${specs}</p>
            <p><strong>Fav Routes:</strong> ${routes}</p>
          </div>
        `;

        hangar.appendChild(card);
      });
    }

    // Initial render
    renderHangar(aircraftList);

    // Filter on input
    searchInput.addEventListener("input", e => {
      const query = e.target.value.toLowerCase();
      const filtered = aircraftList.filter(plane =>
        plane.name.toLowerCase().includes(query) ||
        plane.typecode.toLowerCase().includes(query)
      );
      renderHangar(filtered);
    });