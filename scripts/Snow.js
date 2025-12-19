(() => {
  const now = new Date();
  if (now.getMonth() !== 11) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const snowContainer = document.getElementById("snow-container");
  const ground = document.getElementById("snow-ground");
  if (!snowContainer || !ground) return;

  let isMobile = window.innerWidth < 768;
  let MAX_FLAKES = isMobile ? 120 : 260;

  const SPAWN_RATE = 10;
  const COLUMN_COUNT = 50; // number of snow “columns”

  let activeFlakes = 0;
  let snowInterval = null;
  let running = true;

  // Wind state
  let targetWind = 0;
  let currentWind = 0;
  let windTimer = 0;

  // Snow pile state (array of heights per column)
  let columns = new Array(COLUMN_COUNT).fill(0);

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth < 768;
    MAX_FLAKES = isMobile ? 120 : 260;
  });

  function createSnowflake() {
    if (!running || activeFlakes >= MAX_FLAKES) return;

    activeFlakes++;

    const flake = document.createElement("div");
    flake.className = "snowflake";
    flake.textContent = Math.random() > 0.5 ? "❄" : "❅";

    const size = Math.random() * 12 + 8;
    const duration = Math.random() * 10 + 8;
    const opacity = Math.random() * 0.6 + 0.3;

    const leftPercent = Math.random() * 100;
    flake.style.left = leftPercent + "vw";
    flake.style.fontSize = size + "px";
    flake.style.opacity = opacity;
    flake.style.animationDuration = `${duration}s, ${Math.random() * 4 + 3}s`;
    flake.style.willChange = "transform";

    snowContainer.appendChild(flake);

    setTimeout(() => {
      flake.remove();
      activeFlakes--;

      // Determine column based on horizontal position
      const columnIndex = Math.floor((leftPercent / 100) * COLUMN_COUNT);
      columns[columnIndex] += 0.6; // increase pile height at this column

      // Update ground height visually using linear-gradient
      const gradientStops = columns.map((h, i) => {
        const percent = (i / COLUMN_COUNT) * 100;
        return `rgba(255,255,255,1) ${h}px`;
      });
      // Instead of actual gradient math, just set max pile
      ground.style.height = Math.max(...columns) + "px";

    }, duration * 1000);
  }

  function windLoop() {
    if (!running) return;

    windTimer++;
    if (windTimer > 300) {
      windTimer = 0;
      targetWind = (Math.random() - 0.5) * 80;
    }

    currentWind += (targetWind - currentWind) * 0.02;

    document.querySelectorAll(".snowflake").forEach(flake => {
      flake.style.transform = `translateX(${currentWind}px)`;
    });

    requestAnimationFrame(windLoop);
  }

  function startSnow() {
    running = true;
    if (!snowInterval) {
      snowInterval = setInterval(createSnowflake, SPAWN_RATE);
    }
    requestAnimationFrame(windLoop);
  }

  function stopSnow() {
    running = false;
    clearInterval(snowInterval);
    snowInterval = null;
  }

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopSnow() : startSnow();
  });

  startSnow();
})();
