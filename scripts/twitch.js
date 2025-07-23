const username = 'Hypekingfish';

  const statusSpan = document.getElementById('stream-status');
  const titleSpan = document.getElementById('stream-title');
  const gameSpan = document.getElementById('stream-game');

  function animateFade(el) {
    el.classList.remove('fade');
    void el.offsetWidth; // Force reflow to restart animation
    el.classList.add('fade');
  }

  async function updateStreamInfo() {
    try {
      statusSpan.textContent = 'Loading...';
      statusSpan.classList.add('loading');
      titleSpan.textContent = '...';
      gameSpan.textContent = '...';

      const uptimeRes = await fetch(`https://decapi.me/twitch/uptime/${username}`);
      const uptimeText = await uptimeRes.text();

      // Handle various offline responses
      const isOffline = /not live|offline/i.test(uptimeText);

      statusSpan.classList.remove('loading');

      if (isOffline) {
        statusSpan.textContent = '⚫ Offline';
        statusSpan.style.color = 'gray';
        titleSpan.textContent = '-';
        gameSpan.textContent = '-';
      } else {
        statusSpan.textContent = `🔴 Live (${uptimeText})`;
        statusSpan.style.color = '#ff4e4e';

        const [titleRes, gameRes] = await Promise.all([
          fetch(`https://decapi.me/twitch/title/${username}`),
          fetch(`https://decapi.me/twitch/game/${username}`)
        ]);

        titleSpan.textContent = await titleRes.text();
        gameSpan.textContent = await gameRes.text();
      }

      animateFade(statusSpan);
      animateFade(titleSpan);
      animateFade(gameSpan);

    } catch (err) {
      console.error('Error fetching Twitch data:', err);
      statusSpan.classList.remove('loading');
      statusSpan.textContent = '⚠️ Error';
      statusSpan.style.color = 'orange';
      titleSpan.textContent = '-';
      gameSpan.textContent = '-';
    }
  }

  // Initial load
  updateStreamInfo();

  // Auto-refresh every 60 seconds
  setInterval(updateStreamInfo, 60000);