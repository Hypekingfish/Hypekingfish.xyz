fetch('/.netlify/functions/GetVatsimData')
  .then(response => {
    if (!response.ok) throw new Error("Network error");
    return response.json();
  })
  .then(data => {

    // Convert decimal hours → HH:mm + days
    function formatHoursWithDays(hours = 0) {
      const totalMinutes = Math.round(hours * 60);
      const hh = Math.floor(totalMinutes / 60);
      const mm = totalMinutes % 60;

      const days = Math.floor(hh / 24);
      const remHours = hh % 24;

      let result = `${hh}:${mm.toString().padStart(2, '0')}`;
      if (days > 0) {
        result += ` (≈ ${days}d ${remHours}h)`;
      }

      return result;
    }

    if (!data.hours) throw new Error("Missing hours object");

    const elements = {
      'pilot-hours': data.hours.pilot ?? 0
    };

    for (const [id, value] of Object.entries(elements)) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = formatHoursWithDays(value);
      }
    }
  })
  .catch(error => {
    console.error('VATSIM error:', error);
    const statsElement = document.getElementById('vatsim-stats');
    if (statsElement) {
      statsElement.textContent = 'Failed to load VATSIM stats';
    }
  });
