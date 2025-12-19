(() => {
  const now = new Date();
  if (now.getMonth() !== 11) return; // December only
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const snowContainer = document.getElementById("snow-container");
  if (!snowContainer) return;

  let isMobile = window.innerWidth < 768;
  const MAX_FLAKES = () => (isMobile ? 120 : 260);
  const SNOW_SYMBOLS = ["❄", "❅", "❆", "✻", "✼"];
  const flakes = [];

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth < 768;
  });

  class Snowflake {
    constructor() {
      this.depth = Math.random(); // 0 = far, 1 = near
      this.el = document.createElement("div");
      this.el.className = "snowflake";
      this.el.textContent = SNOW_SYMBOLS[Math.floor(Math.random() * SNOW_SYMBOLS.length)];

      // Parallax & visual properties
      this.size = 8 + 20 * this.depth;
      this.speed = 30 + 120 * this.depth;
      this.swayAmplitude = 10 + 40 * this.depth;
      this.swayFrequency = 0.5 + 2 * this.depth;
      this.drift = (Math.random() - 0.5) * (5 + 30 * this.depth);
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * (30 + 180 * this.depth);
      this.opacity = 0.3 + 0.7 * this.depth;

      // Sparkle / glow effect
      this.glowColor = Math.random() > 0.8 ? "lightblue" : "white"; // subtle blue accent
      this.textShadowBase = `0 0 6px rgba(255,255,255,0.6)`;
      this.el.style.textShadow = this.textShadowBase;

      // Position
      this.x = Math.random() * window.innerWidth;
      this.y = -20;

      // Size variation over time
      this.sizeVariation = (Math.random() - 0.5) * 4; // px/sec

      // For trailing effect
      this.trailEl = document.createElement("div");
      this.trailEl.className = "snowflake-trail";
      this.trailEl.style.position = "fixed";
      this.trailEl.style.pointerEvents = "none";
      this.trailEl.style.color = this.glowColor;
      this.trailEl.style.opacity = 0.2 * this.opacity;
      this.trailEl.textContent = this.el.textContent;

      this.el.style.position = "fixed";
      this.el.style.top = "0px";
      this.el.style.left = "0px";
      this.el.style.fontSize = `${this.size}px`;
      this.el.style.opacity = this.opacity;
      this.el.style.color = this.glowColor;
      this.el.style.pointerEvents = "none";
      this.el.style.willChange = "transform";

      snowContainer.appendChild(this.trailEl);
      snowContainer.appendChild(this.el);
    }

    update(delta) {
      this.y += this.speed * delta;
      this.x += this.drift * delta;

      // Sway
      const sway = Math.sin(this.y / window.innerHeight * this.swayFrequency * Math.PI * 2) * this.swayAmplitude;

      // Rotation
      this.rotation += this.rotationSpeed * delta;

      // Size variation
      this.size += this.sizeVariation * delta;
      this.el.style.fontSize = `${this.size}px`;

      // Fade near bottom
      let fade = 1;
      if (this.y > window.innerHeight * 0.8) {
        fade = 1 - (this.y - window.innerHeight * 0.8) / (window.innerHeight * 0.2);
      }

      // Sparkle effect (subtle pulsing opacity)
      const sparkle = 0.8 + Math.sin(this.y * 0.1) * 0.2;

      // Update main flake
      this.el.style.transform = `translate(${this.x + sway}px, ${this.y}px) rotate(${this.rotation}deg)`;
      this.el.style.opacity = Math.max(0, fade * this.opacity * sparkle);

      // Update trail
      this.trailEl.style.transform = `translate(${this.x + sway}px, ${this.y - this.size/2}px) rotate(${this.rotation}deg)`;
      this.trailEl.style.opacity = Math.max(0, fade * 0.2 * sparkle);
    }

    isOutOfView() {
      return this.y > window.innerHeight + 50;
    }

    destroy() {
      this.el.remove();
      this.trailEl.remove();
    }
  }

  let lastTime = performance.now();

  function animate(time) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    // Occasionally spawn small clusters
    const clusterChance = Math.random();
    if (flakes.length < MAX_FLAKES()) {
      if (clusterChance > 0.95) {
        const clusterCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < clusterCount; i++) {
          flakes.push(new Snowflake());
        }
      } else {
        flakes.push(new Snowflake());
      }
    }

    for (let i = flakes.length - 1; i >= 0; i--) {
      const flake = flakes[i];
      flake.update(delta);
      if (flake.isOutOfView()) {
        flake.destroy();
        flakes.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
