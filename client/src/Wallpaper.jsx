import { useEffect, useRef } from 'react';

export default function Wallpaper() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d');
    const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    let w, h, P = [], mx = -999, my = -999, raf;
    const rs = () => {
      w = c.width = innerWidth; h = c.height = innerHeight;
      P = Array.from({ length: Math.min(80, Math.floor(w * h / 20000)) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6, r: 1.5 + Math.random() * 2,
      }));
    };
    const mv = (e) => { mx = e.clientX; my = e.clientY; };
    const f = () => {
      const s = getComputedStyle(document.documentElement);
      const a = s.getPropertyValue('--ac').trim(), b = s.getPropertyValue('--ac2').trim();
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
      if (!rm) raf = requestAnimationFrame(f);
    };
    addEventListener('resize', rs); addEventListener('pointermove', mv);
    rs(); f();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); removeEventListener('pointermove', mv); };
  }, []);
  return <canvas id="wall" ref={ref} />;
}
