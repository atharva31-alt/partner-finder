import { useEffect, useRef } from 'react';

export default function Wallpaper() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d');
    const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const small = innerWidth < 900;                         // phones/tablets: lighter animation
    const canHover = matchMedia('(hover:hover)').matches;   // only follow a mouse, not a finger
    const cs = getComputedStyle(document.documentElement);
    const a = cs.getPropertyValue('--ac').trim() || '#FF8B32', b = cs.getPropertyValue('--ac2').trim() || '#FFB066';
    let w = 0, h = 0, P = [], mx = -999, my = -999, raf, tick = 0;

    const build = () => {
      w = c.width = innerWidth; h = c.height = innerHeight;
      const n = small ? 26 : Math.min(80, Math.floor(w * h / 20000));
      P = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6, r: 1.5 + Math.random() * 2,
      }));
    };
    // Mobile browsers fire "resize" whenever the address bar hides or shows while scrolling.
    // Ignore those small height changes so the background does not flicker or restart.
    const rs = () => { if (w && innerWidth === w && Math.abs(innerHeight - h) < 220) return; build(); };
    const mv = (e) => { mx = e.clientX; my = e.clientY; };

    const draw = () => {
      x.clearRect(0, 0, w, h);
      P.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 140 && d > 0) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
        x.globalAlpha = .7; x.fillStyle = b; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill();
        for (let j = i + 1; j < P.length; j++) {
          const q = P[j], l = Math.hypot(p.x - q.x, p.y - q.y);
          if (l < 130) {
            x.globalAlpha = (1 - l / 130) * .35; x.strokeStyle = a;
            x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
          }
        }
      });
    };
    const loop = () => {
      if (!document.hidden && !(small && (tick++ & 1))) draw();   // phones draw every other frame
      if (!rm) raf = requestAnimationFrame(loop);
    };

    addEventListener('resize', rs);
    if (canHover) addEventListener('pointermove', mv);
    build(); loop();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); removeEventListener('pointermove', mv); };
  }, []);
  return <canvas id="wall" ref={ref} />;
}
