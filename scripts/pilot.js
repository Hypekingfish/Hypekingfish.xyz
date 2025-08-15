const API_URL = '/.netlify/functions/GetVatsimData';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 min
const ROTATE_INTERVAL = 5000; // rotate stat every 5s
const MAX_RETRIES = 3;

const statsContainer = document.getElementById('vatsim-stats');
statsContainer.classList.add('stats-container');

// Stat rotation order
let statQueue = [
    { id: 'pilot-hours', label: 'Pilot Hours', icon: '🛫' },
    { id: 'atc-hours', label: 'ATC Hours', icon: '🎧' },
    { id: 'flights', label: 'Flights Logged', icon: '📋' },
    { id: 'rating', label: 'Rating', icon: '⭐' }
];

let currentStatIndex = 0;
let lastData = {};

function formatHoursWithDays(hours) {
    if (isNaN(hours)) return '0h';
    const totalMinutes = Math.round(hours * 60);
    const days = Math.floor(totalMinutes / (60 * 24));
    const remHours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    let parts = [];
    if (days) parts.push(`${days}d`);
    if (remHours) parts.push(`${remHours}h`);
    if (minutes && !days) parts.push(`${minutes}m`);
    return parts.join(' ') || '0h';
}

function displayStat(stat) {
    statsContainer.innerHTML = `
        <div class="stat-card flip-in">
            <div class="stat-icon">${stat.icon}</div>
            <div class="stat-label">${stat.label}</div>
            <div class="stat-value">${formatValue(stat.id)}</div>
        </div>
        <div class="progress-bar"></div>
    `;

    setTimeout(() => {
        statsContainer.querySelector('.stat-card').classList.remove('flip-in');
    }, 300);

    // Animate progress bar
    const bar = statsContainer.querySelector('.progress-bar');
    bar.style.animation = `progress ${ROTATE_INTERVAL}ms linear`;
}

function formatValue(statId) {
    switch (statId) {
        case 'pilot-hours': return formatHoursWithDays(lastData.pilotHours);
        case 'atc-hours': return formatHoursWithDays(lastData.atcHours);
        case 'flights': return lastData.flights || 0;
        case 'rating': return lastData.rating || 'N/A';
        default: return '—';
    }
}

async function fetchData(retries = MAX_RETRIES) {
    try {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.debug('Fetched VATSIM Data:', data);

        // Store values
        lastData = {
            pilotHours: parseFloat(data?.pilotHours) || 0,
            atcHours: parseFloat(data?.atcHours) || 0,
            flights: data?.flights || 0,
            rating: data?.rating || 'N/A'
        };

    } catch (err) {
        console.error('Fetch error:', err);
        statsContainer.innerHTML = `<div class="error-card">⚠ Failed to load stats</div>`;
        if (retries > 1) setTimeout(() => fetchData(retries - 1), 2000);
    }
}

// Cycle stats
function rotateStats() {
    displayStat(statQueue[currentStatIndex]);
    currentStatIndex = (currentStatIndex + 1) % statQueue.length;
}

// First load
fetchData().then(() => {
    rotateStats();
    setInterval(rotateStats, ROTATE_INTERVAL);
});

// Auto-refresh data
setInterval(() => {
    fetchData();
}, REFRESH_INTERVAL);

// Styles
const style = document.createElement('style');
style.textContent = `
.stats-container {
    width: 220px;
    text-align: center;
    position: relative;
    background: linear-gradient(135deg, #1c1f26, #232832);
    color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
    overflow: hidden;
}
.stat-card {
    transition: all 0.3s ease;
}
.stat-icon {
    font-size: 2em;
    margin-bottom: 5px;
}
.stat-label {
    font-size: 0.9em;
    opacity: 0.8;
}
.stat-value {
    font-size: 1.5em;
    font-weight: bold;
}
.error-card {
    padding: 15px;
    color: #ff4d6d;
    font-weight: bold;
}
.flip-in {
    animation: flipIn 0.3s ease forwards;
}
@keyframes flipIn {
    from { transform: rotateY(90deg); opacity: 0; }
    to { transform: rotateY(0deg); opacity: 1; }
}
.progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background: #00ffd1;
    width: 100%;
    transform-origin: left;
}
@keyframes progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
}
`;
document.head.appendChild(style);
