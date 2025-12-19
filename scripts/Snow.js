(() => {
  const now = new Date();
  if (now.getMonth() !== 11) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const snowContainer = document.getElementById("snow-container");
  if (!snowContainer) return;

  let isMobile = window.innerWidth < 768;
  const MAX_FLAKES = () => (isMobile ? 80 : 150); // reduced max flakes
  const SNOW_SYMBOLS = ["❄", "❅", "❆", "✻", "✼"];
  const flakes = [];

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth < 768;
  });

  class Snowflake {
    constructor() {
      this.depth = Math.random();
      this.el = document.createElement("div");
      this.el.className = "snowflake";
      this.el.textContent = SNOW_SYMBOLS[Math.floor(Math.random() * SNOW_SYMBOLS.length)];

      // Slower flakes
      this.size = 8 + 15 * this.depth;
      this.speed = 20 + 80 * this.depth; // slower than before
      this.swayAmplitude = 5 + 25 * this.depth;
      this.swayFrequency = 0.5 + 1.5 * this.depth;
      this.drift = (Math.random() - 0.5) * (5 + 15 * this.depth);
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * (20 + 120 * this.depth);
      this.opacity = 0.3 + 0.7 * this.depth;

      // Glow color
      this.glowColor = Math.random() > 0.85 ? "lightblue" : "white";
      this.textShadowBase = `0 0 6px rgba(255,255,255,0.6)`;
      this.el.style.textShadow = this.textShadowBase;

      this.x = Math.random() * window.innerWidth;
      this.y = -20;

      this.sizeVariation = (Math.random() - 0.5) * 2; // slower size changes

      // Trail
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

      const sway = Math.sin(this.y / window.innerHeight * this.swayFrequency * Math.PI * 2) * this.swayAmplitude;
      this.rotation += this.rotationSpeed * delta;
      this.size += this.sizeVariation * delta;
      this.el.style.fontSize = `${this.size}px`;

      let fade = 1;
      if (this.y > window.innerHeight * 0.8) {
        fade = 1 - (this.y - window.innerHeight * 0.8) / (window.innerHeight * 0.2);
      }

      const sparkle = 0.8 + Math.sin(this.y * 0.1) * 0.2;

      this.el.style.transform = `translate(${this.x + sway}px, ${this.y}px) rotate(${this.rotation}deg)`;
      this.el.style.opacity = Math.max(0, fade * this.opacity * sparkle);

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

    // Slower cluster chance
    const clusterChance = Math.random();
    if (flakes.length < MAX_FLAKES()) {
      if (clusterChance > 0.97) { // less frequent clusters
        const clusterCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < clusterCount; i++) {
          flakes.push(new Snowflake());
        }
      } else if (Math.random() > 0.4) { // reduce spawn rate
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
