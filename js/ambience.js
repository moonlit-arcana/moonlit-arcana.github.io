// Page-wide background life: twinkling stars + drifting motes on one fixed
// canvas, and the line-drawn sigil. Motes/twinkle are off for reduced motion
// (stars are then drawn once, still) and everything pauses while the tab is hidden.
export function initAmbience() {
  drawSigil();
  const cv = document.getElementById("motes");
  if (!cv) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, motes = [], stars = [], raf = 0, t = 0;

  const moteCount = () => Math.round(Math.min(46, Math.max(18, (W * H) / 42000)));
  const starCount = () => Math.round(Math.min(220, Math.max(60, (W * H) / 7000)));
  const mk = (fresh) => ({
    x: Math.random() * W, y: fresh ? Math.random() * H : H + 10,
    r: 0.8 + Math.random() * 1.8, vx: (Math.random() - 0.5) * 0.15, vy: -0.06 - Math.random() * 0.18,
    life: 0, max: 600 + Math.random() * 700, ph: Math.random() * 6.28,
  });
  // Stars crowd the top of the sky and thin out towards the water.
  const mkStar = () => ({
    x: Math.random() * W, y: H * 0.72 * Math.pow(Math.random(), 1.7),
    r: 0.35 + Math.pow(Math.random(), 3) * 1.1, a: 0.25 + Math.random() * 0.55,
    sp: 0.004 + Math.random() * 0.018, ph: Math.random() * 6.28, warm: Math.random() < 0.15,
  });

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Keep stars off the moon's face.
    const m = document.querySelector(".moon-disc")?.getBoundingClientRect();
    const onMoon = (s) => m && Math.hypot(s.x - (m.left + m.width / 2), s.y - (m.top + m.height / 2)) < m.width * 0.6;
    stars = [];
    for (let n = starCount(), guard = 0; stars.length < n && guard < n * 3; guard++) {
      const s = mkStar(); if (!onMoon(s)) stars.push(s);
    }
    motes = Array.from({ length: moteCount() }, () => mk(true));
    if (reduced) drawStars(false);
  }

  function drawStars(twinkle) {
    for (const s of stars) {
      const a = twinkle ? s.a * (0.55 + 0.45 * Math.sin(s.ph + t * s.sp * 60)) : s.a * 0.8;
      ctx.fillStyle = s.warm ? `rgba(255,232,200,${a})` : `rgba(220,240,232,${a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    }
  }

  function tick() {
    t += 1 / 60;
    ctx.clearRect(0, 0, W, H);
    drawStars(true);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < motes.length; i++) {
      const p = motes[i];
      p.life++; p.ph += 0.025; p.x += p.vx + Math.sin(p.ph) * 0.12; p.y += p.vy;
      const a = Math.sin(Math.PI * Math.min(p.life / p.max, 1)) * 0.6;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      g.addColorStop(0, `rgba(170,235,210,${a})`); g.addColorStop(1, "rgba(170,235,210,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.283); ctx.fill();
      if (p.life > p.max || p.y < -10) motes[i] = mk(false);
    }
    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(tick);
  }

  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
  resize();
  if (reduced) return;
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(tick);
  });
  raf = requestAnimationFrame(tick);
}

/** Thin occult-astrolabe rings, drawn once into #sigil (centred on 0,0). */
function drawSigil() {
  const svg = document.getElementById("sigil");
  if (!svg) return;
  const pt = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)]; };
  const poly = (r, n, rot = 0) => Array.from({ length: n }, (_, i) => pt(r, rot + (i * 360) / n).map((v) => v.toFixed(1)).join(" ")).join(" L");
  let ticks = "";
  for (let i = 0; i < 120; i++) {
    const [x1, y1] = pt(452, i * 3), [x2, y2] = pt(i % 10 === 0 ? 428 : i % 5 === 0 ? 438 : 444, i * 3);
    ticks += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  let nodes = "";
  for (let i = 0; i < 12; i++) {
    const [x, y] = pt(398, i * 30 + 15);
    nodes += i % 3 === 0
      ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" class="s-fill"/><circle cx="${(x + 4).toFixed(1)}" cy="${(y - 3).toFixed(1)}" r="8" class="s-cut"/>`
      : `<path d="M${x.toFixed(1)} ${(y - 6).toFixed(1)}l5 6-5 6-5-6Z" class="s-fill"/>`;
  }
  svg.innerHTML = `
    <g class="s-outer">
      <circle r="470"/><circle r="458" class="s-thin"/>
      <path d="${ticks}" class="s-thin"/>
      <circle r="420" class="s-thin"/>
      ${nodes}
      <circle r="376"/>
    </g>
    <g class="s-inner">
      <path d="M${poly(330, 3)}Z"/><path d="M${poly(330, 3, 180)}Z"/>
      <circle r="330" class="s-thin"/>
      <path d="M${poly(250, 8, 22.5)}Z" class="s-thin"/>
      <circle r="168"/><circle r="156" class="s-thin"/>
    </g>`;
}
