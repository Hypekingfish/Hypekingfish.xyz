const username = 'hypekingfish'; // Replace with your Twitch username

const statusSpan = document.getElementById('stream-status');
const titleSpan = document.getElementById('stream-title');
const gameSpan = document.getElementById('stream-game');
const viewerSpan = document.getElementById('stream-viewers');

function animateFade(el) {
  el.classList.remove('fade');
  void el.offsetWidth; // Force reflow
  el.classList.add('fade');
}

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(timer);
  return response;
}

let retryDelay = 2000;

async function updateStreamInfo() {
  try {
    statusSpan.textContent = 'Loading...';
    statusSpan.classList.add('loading');
    titleSpan.textContent = '...';
    gameSpan.textContent = '...';
    viewerSpan.textContent = '...';

    const uptimeRes = await fetchWithTimeout(`https://decapi.me/twitch/uptime/${username}`);
    const uptimeText = await uptimeRes.text();

    const isOffline = /not live|offline/i.test(uptimeText);
    statusSpan.classList.remove('loading');

    if (isOffline) {
      statusSpan.textContent = '⚫ Offline';
      statusSpan.style.color = 'gray';
      titleSpan.textContent = '-';
      gameSpan.textContent = '-';
      viewerSpan.textContent = '-';
    } else {
      statusSpan.textContent = `🔴 Live (${uptimeText})`;
      statusSpan.style.color = '#ff4e4e';


      const [titleRes, gameRes, viewersRes, followRes] = await Promise.all([
        fetch(`https://decapi.me/twitch/title/${username}`),
        fetch(`https://decapi.me/twitch/game/${username}`),
        fetch(`https://decapi.me/twitch/viewercount/${username}`),
      ]);

      titleSpan.textContent = `🎯 ${await titleRes.text()}`;
      gameSpan.textContent = `🎮 ${await gameRes.text()}`;
      viewerSpan.textContent = `👥 ${await viewersRes.text()}`;
    }

    animateFade(statusSpan);
    animateFade(titleSpan);
    animateFade(gameSpan);
    animateFade(viewerSpan);

    retryDelay = 2000; // reset on success
  } catch (err) {
    console.error('Error fetching Twitch data:', err);
    statusSpan.classList.remove('loading');
    statusSpan.textContent = '⚠️ Error';
    statusSpan.style.color = 'orange';
    titleSpan.textContent = '-';
    gameSpan.textContent = '-';
    viewerSpan.textContent = '-';

    // Retry with exponential backoff
    setTimeout(updateStreamInfo, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 30000);
    return;
  }
}

// Initial load
updateStreamInfo();

// Auto-refresh every 5 minutes
setInterval(updateStreamInfo, 300000);
