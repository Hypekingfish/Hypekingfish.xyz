// --- Plane Data with Tail + ICAO24 ---
// Note: ICAO24 must match OpenSky "states" f[0] value
const aircraftList = [
  {
    name: "Boeing 737-8H4",
    tail: "N500WR",
    icao24: "A63BF4", // example hex
    specs: "",
    routes: "",
    image: "https://dummyimage.com/600x400/000/fff&text=Loading..."
  }
];

// --- Generate Cards ---
const hangar = document.getElementById('hangar');
const noPlanes = document.getElementById('noPlanes');

function generateCards() {
  hangar.innerHTML = '';
  aircraftList.forEach((plane, index) => {
    const card = document.createElement('div');
    card.classList.add('plane-card');
    card.dataset.name = plane.name.toLowerCase();
    card.dataset.tail = plane.tail.toLowerCase();
    card.dataset.icao24 = plane.icao24.toLowerCase();
    card.dataset.index = index; // keep track of array index
    card.innerHTML = `
      <img src="${plane.image}" alt="${plane.name}">
      <div class="plane-info">
        <h2>${plane.name}</h2>
        <p>${plane.specs}</p>
        <p>${plane.routes}</p>
      </div>
      <div class="tail-badge">${plane.tail}</div>
      <div class="in-flight-badge"></div>
      <div class="tooltip"></div>
    `;
    hangar.appendChild(card);
  });
}

generateCards();

// --- Search Functionality ---
const searchInput = document.getElementById('searchPlanes');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll('.plane-card');
  let found = false;
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.dataset.name;
    const title = card.querySelector('h2');

    // Reset title text before highlighting
    title.innerHTML = title.textContent;
    card.classList.remove('centered');

    if (name.includes(query) && query !== '') {
      visibleCount++;
      card.classList.remove('hidden');
      if (!found) {
        card.classList.add('centered');
        found = true;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const regex = new RegExp(`(${query})`, 'gi');
      title.innerHTML = title.textContent.replace(regex, `<span class="highlight">$1</span>`);
    } else if (query === '') {
      card.classList.remove('hidden', 'centered');
    } else {
      card.classList.add('hidden');
    }
  });

  noPlanes.style.display = visibleCount === 0 ? 'block' : 'none';
});

// --- Live Flight Integration by ICAO24 with Tooltip ---
async function fetchLiveFlights() {
  try {
    const response = await fetch('https://opensky-network.org/api/states/all');
    const data = await response.json();
    return data.states || [];
  } catch (e) {
    console.error('Error fetching live flights:', e);
    return [];
  }
}

async function updateLiveStatus() {
  const flights = await fetchLiveFlights();
  const cards = document.querySelectorAll('.plane-card');

  cards.forEach(card => {
    const icao24 = card.dataset.icao24;
    const badge = card.querySelector('.in-flight-badge');
    const tooltip = card.querySelector('.tooltip');

    const flightData = flights.find(f => f[0] && f[0].toLowerCase() === icao24);
    if (flightData) {
      badge.textContent = '🟢 In Flight';

      // Altitude in feet
      const altitude = flightData[7]
        ? `${Math.round(flightData[7] * 3.28084)} ft`
        : 'N/A';

      // Speed in knots
      const speed = flightData[9]
        ? `${Math.round(flightData[9] * 1.94384)} kt`
        : 'N/A';

      tooltip.textContent = `Altitude: ${altitude} | Speed: ${speed}`;
    } else {
      badge.textContent = '';
      tooltip.textContent = '';
    }

    // Tooltip show/hide
    badge.onmouseenter = () => { if (tooltip.textContent) tooltip.style.display = 'block'; };
    badge.onmouseleave = () => { tooltip.style.display = 'none'; };
  });
}

// Update every 30 seconds
updateLiveStatus();
setInterval(updateLiveStatus, 30000);

// --- PlaneSpotters.net API for Photos with Caching ---
async function fetchPlanePhoto(icao24, reg) {
  try {
    // Try hex first
    let url = `https://api.planespotters.net/pub/photos/hex/${icao24}`;
    let response = await fetch(url);
    let data = await response.json();

    console.log("Photo fetch (hex):", icao24, data);

    if (data && data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return photo.thumbnail_large || photo.thumbnail || null;
    }

    // Fallback: try registration
    url = `https://api.planespotters.net/pub/photos/reg/${reg}`;
    response = await fetch(url);
    data = await response.json();

    console.log("Photo fetch (reg):", reg, data);

    if (data && data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return photo.thumbnail_large || photo.thumbnail || null;
    }
  } catch (err) {
    console.error("Photo fetch error:", err);
  }
  return null; // return null instead of dummy directly
}

async function updatePlanePhotos() {
  const cards = document.querySelectorAll('.plane-card');
  for (const card of cards) {
    const icao24 = card.dataset.icao24;
    const tail = card.dataset.tail;
    const index = parseInt(card.dataset.index, 10);
    const img = card.querySelector('img');

    // If cached already, use it
    if (aircraftList[index].image && !aircraftList[index].image.includes("dummyimage")) {
      img.src = aircraftList[index].image;
      continue;
    }

    const newPhoto = await fetchPlanePhoto(icao24, tail);

    if (newPhoto) {
      img.src = newPhoto;
      aircraftList[index].image = newPhoto; // cache in memory
    } else {
      img.src = "https://dummyimage.com/600x400/000/fff&text=No+Photo"; // fallback
      aircraftList[index].image = img.src;
    }
  }
}

// Fetch photos after rendering cards
updatePlanePhotos();