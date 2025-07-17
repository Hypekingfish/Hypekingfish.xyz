fetch('https://api.twitch.tv/helix/streams?user_login=hypekingfish', {
  headers: {
    'Client-ID': 'qd07drxh7kt12pfrlq93v4k8z5sbw2',
    'Authorization': '3az3yvhpqktzsn5sevhxl3n93kweyj'
  }
})
.then(res => res.json())
.then(data => {
  if (data.data && data.data.length > 0) {
    const stream = data.data[0];
    document.getElementById("live-title").textContent = `"${stream.title}"`;
    document.getElementById("live-game").textContent = `Playing: ${stream.game_name}`;
  }
});
