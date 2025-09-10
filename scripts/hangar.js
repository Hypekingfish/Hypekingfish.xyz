// Aircraft Data
    const aircraftList = [
      {
        name: "Cessna 172",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Cessna_172S_Skyhawk_SP%2C_Private_JP6816462.jpg/640px-Cessna_172S_Skyhawk_SP%2C_Private_JP6816462.jpg",
        specs: "Single-engine | 4 seats",
        routes: "Short hops, VFR training"
      },
      {
        name: "Boeing 737-800",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Ryanair_Boeing_737-800_EI-EBF_ZRH_2011-10-27_10-55-08.jpg/640px-Ryanair_Boeing_737-800_EI-EBF_ZRH_2011-10-27_10-55-08.jpg",
        specs: "Twin-engine | 189 seats",
        routes: "Regional & medium haul flights"
      },
      {
        name: "Airbus A320neo",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/IndiGo_Airbus_A320neo_VT-ITK_Take_Off_from_Indira_Gandhi_International_Airport_DSC_7803_%2836800374632%29.jpg/640px-IndiGo_Airbus_A320neo_VT-ITK_Take_Off_from_Indira_Gandhi_International_Airport_DSC_7803_%2836800374632%29.jpg",
        specs: "Twin-engine | 180-240 seats",
        routes: "Short to medium haul"
      },
      {
        name: "Boeing 787 Dreamliner",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Boeing_787-9_Dreamliner%2C_Air_New_Zealand_AN2082984.jpg/640px-Boeing_787-9_Dreamliner%2C_Air_New_Zealand_AN2082984.jpg",
        specs: "Twin-engine | 242-330 seats",
        routes: "Long haul international flights"
      }
      {
        name: "Cessna Citation X",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/N975QS_2002_Cessna_750_C-N_750-0175_Citation_X_%287039507775%29.jpg/500px-N975QS_2002_Cessna_750_C-N_750-0175_Citation_X_%287039507775%29.jpg",
        specs: "Twin-engine | 8 seats",
        routes: "Business jet, transcontinental"
      }
    ];

    // Generate Cards
    const hangar = document.getElementById("hangar");

    aircraftList.forEach(plane => {
      const card = document.createElement("div");
      card.classList.add("plane-card");

      card.innerHTML = `
        <img src="${plane.image}" alt="${plane.name}">
        <div class="plane-info">
          <h2>${plane.name}</h2>
          <p><strong>Specs:</strong> ${plane.specs}</p>
          <p><strong>Fav Routes:</strong> ${plane.routes}</p>
        </div>
      `;

      hangar.appendChild(card);
    });