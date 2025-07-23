// Time updater (24-hour format)
function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  document.getElementById('local-time').textContent = timeStr;
}

setInterval(updateTime, 1000);
updateTime();
