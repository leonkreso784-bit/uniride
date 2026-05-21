/**
 * UniRide — 3D Interactive Background
 * Particle network with depth and mouse parallax
 */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let mouse = { x: 0, y: 0, active: false };
  let particles = [];
  const N = 75;
  const MAX_DIST = 140;

  /* ── Resize ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Particle ── */
  class Particle {
    constructor() { this.reset(true); }

    reset(init) {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.z  = 0.15 + Math.random() * 0.85;   // depth 0.15 (near) – 1 (far)
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.r  = 1.2 + this.z * 2.8;
    }

    update() {
      // Gentle parallax toward mouse
      if (mouse.active) {
        const mx = (mouse.x / W - 0.5);
        const my = (mouse.y / H - 0.5);
        this.x += this.vx + mx * this.z * 0.55;
        this.y += this.vy + my * this.z * 0.55;
      } else {
        this.x += this.vx;
        this.y += this.vy;
      }

      // Wrap around
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }

    draw() {
      const alpha = 0.18 + this.z * 0.52;
      // Glow
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2.5);
      grd.addColorStop(0, `rgba(14,165,233,${alpha})`);
      grd.addColorStop(1, 'rgba(14,165,233,0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
      ctx.fill();
    }
  }

  /* ── Connections ── */
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = dx * dx + dy * dy;
        if (d < MAX_DIST * MAX_DIST) {
          const dist  = Math.sqrt(d);
          const alpha = (1 - dist / MAX_DIST) * 0.13;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(14,165,233,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  /* ── Animation loop ── */
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  /* ── Init ── */
  function init() {
    resize();
    particles = Array.from({ length: N }, () => new Particle());
    animate();
  }

  /* ── Events ── */
  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      p.x = Math.min(p.x, W);
      p.y = Math.min(p.y, H);
    });
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('touchmove', e => {
    if (e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { mouse.active = false; });

  // Start after fonts / DOM loaded
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
