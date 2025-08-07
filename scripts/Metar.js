const API_KEY = 'T9yehQ3wif0Wpws8yb9DLfafa-_H7Tjk-XXbVIWBkEA';
const airports = ['KPDX', 'KSEA',];
let currentIndex = 0;

const airportCodeEl = document.getElementById('airport-code');
const metarTextEl = document.getElementById('metar-ticker-text');
const flightRulesEl = document.getElementById('flight-rules');
const temperatureEl = document.getElementById('temperature');
const dewpointEl = document.getElementById('dewpoint');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const windArrow = document.getElementById('wind-arrow');
const visibilityEl = document.getElementById('visibility');
const altimeterEl = document.getElementById('altimeter');
const wxEl = document.getElementById('weather');
const skyConditionsEl = document.getElementById('sky-conditions');
const obsTimeEl = document.getElementById('obs-time');
const lastUpdatedEl = document.getElementById('last-updated');
const container = document.getElementById('metar-container');
const mapLink = document.getElementById('map-link');
const refreshButton = document.getElementById('refresh-button');

function colorFlightRules(rules) {
  switch (rules.toLowerCase()) {
    case 'vfr': return 'vfr';
    case 'mvfr': return 'mvfr';
    case 'ifr': return 'ifr';
    case 'lifr': return 'lifr';
    default: return '';
  }
}

function formatWind(dir, speed, gust) {
  if (!dir?.value || !speed?.value) return 'Calm';
  const unit = speed.unit || 'kt';
  let str = `${dir.value}° at ${speed.value} ${unit}`;
  if (gust?.value) str += ` gusting ${gust.value} ${gust.unit || unit}`;
  return str;
}

function getWeatherEmoji(wx) {
  const map = {
    RA: '🌧️', TS: '⛈️', SN: '❄️', FG: '🌫️', BR: '🌁', HZ: '🌤️', DZ: '🌦️',
    '+RA': '🌧️', '-RA': '🌦️', '+SN': '❄️', '-SN': '🌨️'
  };
  return wx?.map(w => map[w.value] || '').join(' ') || '☀️';
}

function formatClouds(clouds) {
  if (!clouds?.length) return 'Clear';
  return clouds.map(c => `${c.type.toUpperCase()} ${c.base?.value ? c.base.value * 100 + ' ft' : ''}`).join(', ');
}

function formatVisibility(vis) {
  if (!vis || typeof vis.value === 'undefined' || vis.value === null) return 'N/A';

  const value = parseFloat(vis.value);
  if (isNaN(value)) return 'N/A';

  const displayValue = value >= 10 ? value : value.toFixed(1);

  return `${displayValue} Statute Miles`;
}



function formatTime(str) {
  return str ? new Date(str).toUTCString().replace('GMT', 'UTC') : 'N/A';
}

function calculateRH(tempC, dewC) {
  const es = 6.11 * Math.pow(10, 7.5 * tempC / (237.7 + tempC));
  const e = 6.11 * Math.pow(10, 7.5 * dewC / (237.7 + dewC));
  return Math.round((e / es) * 100);
}

function updateLastUpdated() {
  let seconds = 0;
  clearInterval(window._lastTimer);
  lastUpdatedEl.textContent = `Updated 0s ago`;
  window._lastTimer = setInterval(() => {
    seconds++;
    lastUpdatedEl.textContent = `Updated ${seconds}s ago`;
  }, 1000);
}

async function fetchMetar(icao) {
  refreshButton.style.display = 'inline-block';

  try {
    const res = await fetch(`https://avwx.rest/api/metar/${icao}?format=json`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();

    // Update fields
    airportCodeEl.textContent = icao;
    mapLink.href = `https://skyvector.com/airport/${icao}`;
    metarTextEl.textContent = data.raw || 'N/A';

    const rules = data.flight_rules || 'N/A';
    flightRulesEl.textContent = `${rules.toUpperCase()} ${getSignalIcon(rules)}`;
    flightRulesEl.className = colorFlightRules(rules);

    const c = data.temperature?.value;
    const f = c != null ? (c * 9 / 5 + 32).toFixed(1) : null;
    temperatureEl.textContent = c != null ? `${c}°C / ${f}°F` : 'N/A';

    const dc = data.dewpoint?.value;
    const df = dc != null ? (dc * 9 / 5 + 32).toFixed(1) : null;
    dewpointEl.textContent = dc != null ? `${dc}°C / ${df}°F` : 'N/A';

    humidityEl.textContent = (c != null && dc != null) ? `${calculateRH(c, dc)}%` : 'N/A';

    windEl.textContent = formatWind(data.wind_direction, data.wind_speed, data.wind_gust);
    windArrow.style.transform = `rotate(${data.wind_direction?.value || 0}deg)`;

    visibilityEl.textContent = formatVisibility(data.visibility);

    const alt = data.altimeter?.value;
    altimeterEl.textContent = alt != null ? `${alt.toFixed(2)} inHg 🧭` : 'N/A';
    altimeterEl.title = alt != null ? `${(alt * 33.8639).toFixed(0)} hPa` : '';

    wxEl.textContent = getWeatherEmoji(data.weather) + ' ' + (data.weather?.map(w => w.value).join(', ') || 'None');
    skyConditionsEl.textContent = formatClouds(data.clouds);
    obsTimeEl.textContent = formatTime(data.time?.dt);

    updateLastUpdated();

  } catch (err) {
    metarTextEl.textContent = 'Error fetching METAR';
  }

  refreshButton.style.display = 'none';
}

function getSignalIcon(rules) {
  switch (rules.toLowerCase()) {
    case 'vfr': return '📶📶📶📶';
    case 'mvfr': return '📶📶📶';
    case 'ifr': return '📶📶';
    case 'lifr': return '📶';
    default: return '📶❓';
  }
}

async function updateMetar() {
  const icao = airports[currentIndex];
  container.classList.remove('fade-in');
  container.classList.add('fade-out');

  setTimeout(async () => {
    await fetchMetar(icao);
    container.classList.remove('fade-out');
    container.classList.add('fade-in');
  }, 500);

  currentIndex = (currentIndex + 1) % airports.length;
}

// Events
refreshButton.onclick = () => updateMetar();

// Start
updateMetar();
setInterval(updateMetar, 15000);