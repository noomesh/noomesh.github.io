/* Animated node-link field — the motif both pages share.
   It is the product's own shape: a mesh of nodes with edges between them.

   Honours prefers-reduced-motion (renders one static frame), pauses when the
   tab is hidden, and caps device-pixel-ratio so a 3x phone doesn't render 9x
   the pixels for a background. */
(function () {
  const canvas = document.getElementById('mesh');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const css = getComputedStyle(document.documentElement);
  const line = (css.getPropertyValue('--mesh-line') || '95,143,208').trim();
  const dot = (css.getPropertyValue('--mesh-dot') || '170,180,196').trim();

  let w, h, dpr, points, raf = null;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    // Density scales with area but is capped — beyond ~70 the O(n^2) link pass
    // costs more than it adds visually.
    const count = Math.min(70, Math.max(18, Math.floor((innerWidth * innerHeight) / 18000)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.32 * dpr,
      vy: (Math.random() - 0.5) * 0.32 * dpr,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const linkDist = 168 * dpr;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < linkDist) {
          ctx.strokeStyle = `rgba(${line}, ${(1 - d / linkDist) * 0.34})`;
          ctx.lineWidth = dpr;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = `rgba(${dot}, 0.5)`;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick() {
    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (reduced) { draw(); return; }
    if (raf === null) raf = requestAnimationFrame(tick);
  }
  function stop() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  addEventListener('resize', () => { resize(); if (reduced) draw(); });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  resize();
  start();
})();
