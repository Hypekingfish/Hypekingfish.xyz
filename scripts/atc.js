fetch('/.netlify/functions/GetVatsimData')
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {

    // Convert decimal hours → HH:mm
    function formatHours(hours = 0) {
      const totalMinutes = Math.round(hours * 60);
      const hh = Math.floor(totalMinutes / 60);
      const mm = totalMinutes % 60;
      return `${hh}:${mm.toString().padStart(2, '0')}`;
    }

    if (!data.hours) throw new Error("Missing hours data");

    const elements = {
      'controller-hours': data.hours.atc,
      's1-hours': data.hours.s1,
      's2-hours': data.hours.s2,
      's3-hours': data.hours.s3
    };

    for (const [id, value] of Object.entries(elements)) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = formatHours(value);
      }
    }
  })
  .catch(error => {
    console.error('VATSIM fetch error:', error);
    const statsElement = document.getElementById('vatsim-stats');
    if (statsElement) {
      statsElement.textContent = 'Failed to load VATSIM stats';
    }
  });
