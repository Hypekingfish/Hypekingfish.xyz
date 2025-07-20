const username = 'Hypekingfish';

  async function updateStreamInfo() {
    try {
      // Check if user is live
      const uptimeRes = await fetch(`https://decapi.me/twitch/uptime/${username}`);
      const uptimeText = await uptimeRes.text();

      const isOffline = uptimeText.toLowerCase().includes('not live');

      const statusSpan = document.getElementById('stream-status');
      const titleSpan = document.getElementById('stream-title');
      const gameSpan = document.getElementById('stream-game');

      if (isOffline) {
        statusSpan.textContent = 'Offline';
        titleSpan.textContent = '-';
        gameSpan.textContent = '-';
      } else {
        statusSpan.textContent = `(${uptimeText})`;

        const titleRes = await fetch(`https://decapi.me/twitch/title/${username}`);
        const title = await titleRes.text();
        titleSpan.textContent = title;

        const gameRes = await fetch(`https://decapi.me/twitch/game/${username}`);
        const game = await gameRes.text();
        gameSpan.textContent = game;
      }
    } catch (err) {
      console.error('Error fetching Twitch data:', err);
      document.getElementById('stream-status').textContent = 'Error';
    }
  }

  // Initial check
  updateStreamInfo();