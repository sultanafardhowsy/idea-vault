'use client';

import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* ── Slide data ── */
const slides = [
  {
    img: '/images/banner1.png',
    accent: '#e8a87c',
  },
  {
    img: '/images/banner2.png',
    accent: '#7cb8e8',
  },
  {
    img: '/images/banner3.png',
    accent: '#a87ce8',
  },
];

export default function HeroPage() {
  const canvasRef = useRef(null);
  const animRef  = useRef(null);

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 45;
    const particles = Array.from({ length: COUNT }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.6 + 0.3,
      vx:      (Math.random() - 0.5) * 0.28,
      vy:      (Math.random() - 0.5) * 0.28,
      opacity: Math.random() * 0.45 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Root vars ── */
        :root {
          --h: 100dvh;
          --white: #ffffff;
          --off: rgba(255,255,255,0.82);
          --muted: rgba(255,255,255,0.55);
          --accent: #e8a87c;
          --radius: 14px;
        }

        /* ── Wrapper: stacking context ── */
        .hero-root {
          position: relative;
          width: 100%;
          height: var(--h);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ════════════════════════════════
           LAYER 1 – Swiper background
        ════════════════════════════════ */
        .hero-swiper-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        /* Make swiper & slides fill container */
        .hero-swiper-bg .swiper,
        .hero-swiper-bg .swiper-wrapper,
        .hero-swiper-bg .swiper-slide {
          width: 100%;
          height: 100%;
        }

        .hero-swiper-bg .swiper-slide {
          background-size: cover;
          background-position: center;
          transition: transform 6s ease-out;
          transform: scale(1.06);
        }
        .hero-swiper-bg .swiper-slide-active {
          transform: scale(1);
        }
        /* subtle Ken Burns on active slide */
        .hero-swiper-bg .swiper-slide-active {
          animation: kenburns 7s ease-out forwards;
        }
        @keyframes kenburns {
          from { transform: scale(1.06); }
          to   { transform: scale(1); }
        }

        /* Dark gradient scrim so text is always readable */
        .hero-swiper-bg .slide-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.38) 55%,
            rgba(0,0,0,0.55) 100%
          );
        }

        /* Swiper nav overrides */
        .hero-swiper-bg .swiper-button-prev,
        .hero-swiper-bg .swiper-button-next {
          color: rgba(255,255,255,0.6);
          width: 44px; height: 44px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50%;
          backdrop-filter: blur(6px);
          transition: background 0.2s, color 0.2s;
        }
        .hero-swiper-bg .swiper-button-prev::after,
        .hero-swiper-bg .swiper-button-next::after {
          font-size: 14px;
          font-weight: 700;
        }
        .hero-swiper-bg .swiper-button-prev:hover,
        .hero-swiper-bg .swiper-button-next:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
        .hero-swiper-bg .swiper-pagination-bullet {
          background: rgba(255,255,255,0.45);
          opacity: 1;
          transition: background 0.25s, transform 0.25s;
        }
        .hero-swiper-bg .swiper-pagination-bullet-active {
          background: #fff;
          transform: scale(1.3);
        }

        /* ════════════════════════════════
           LAYER 2 – Particle canvas
        ════════════════════════════════ */
        .hero-canvas {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        /* ════════════════════════════════
           LAYER 3 – Static text content
        ════════════════════════════════ */
        .hero-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          padding: 0 clamp(1.5rem, 6vw, 7rem);
          pointer-events: none; /* let clicks pass through to swiper */
        }

        .hero-text-box {
          max-width: 620px;
          pointer-events: auto; /* re-enable for interactive elements */
        }

        /* Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--white);
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          margin-bottom: 1.4rem;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
          animation: pulse 2s infinite;
        }

        /* Headline */
        .hero-h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 5.5vw, 4.2rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.01em;
          color: var(--white);
          margin-bottom: 1.2rem;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .hero-h1 em {
          font-style: normal;
          background: linear-gradient(90deg, var(--accent), #f7c59f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Sub */
        .hero-sub {
          font-size: clamp(0.95rem, 1.8vw, 1.05rem);
          line-height: 1.75;
          color: var(--off);
          font-weight: 300;
          max-width: 480px;
          margin-bottom: 2rem;
          animation: fadeUp 0.7s 0.32s ease both;
        }

        /* CTA row */
        .hero-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 2.5rem;
          animation: fadeUp 0.7s 0.44s ease both;
        }

        .hero-btn-primary {
          padding: 14px 30px;
          border-radius: var(--radius);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          color: #1a0a00;
          background: linear-gradient(135deg, var(--accent) 0%, #f7c59f 100%);
          box-shadow: 0 6px 24px rgba(232,168,124,0.4);
          transition: transform 0.18s, box-shadow 0.18s;
          text-decoration: none;
          display: inline-block;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(232,168,124,0.55);
        }

        .hero-btn-ghost {
          padding: 13px 28px;
          border-radius: var(--radius);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          color: var(--white);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.22);
          backdrop-filter: blur(8px);
          transition: background 0.18s, border-color 0.18s;
          text-decoration: none;
          display: inline-block;
        }
        .hero-btn-ghost:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.4);
        }

        /* Stats */
        .hero-stats {
          display: flex;
          gap: clamp(1.5rem, 4vw, 3rem);
          border-top: 1px solid rgba(255,255,255,0.12);
          padding-top: 1.5rem;
          animation: fadeUp 0.7s 0.56s ease both;
        }
        .hero-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          font-weight: 700;
          color: var(--white);
          line-height: 1;
          margin-bottom: 4px;
        }
        .hero-stat-label {
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ── Keyframes ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.82); }
        }

        /* ── Responsive ── */
        @media (max-width: 500px) {
          .hero-btn-primary,
          .hero-btn-ghost { width: 100%; text-align: center; }
          .hero-stats { gap: 1.2rem; }
        }
      `}</style>

      <div className="hero-root">

        {/* ── LAYER 1: Swiper as full-bleed background ── */}
        <div className="hero-swiper-bg">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            speed={900}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              stopOnLastSlide: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            style={{ width: '100%', height: '100%' }}
          >
            {slides.map((slide, i) => (
              <SwiperSlide
                key={i}
                style={{ backgroundImage: `url(${slide.img})` }}
              >
                <div className="slide-scrim" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── LAYER 2: Particle canvas ── */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* ── LAYER 3: Static hero text (never moves) ── */}
        <div className="hero-content">
          <div className="hero-text-box">

            <div className="hero-badge">
              <span className="hero-badge-dot" />
              The Launchpad for Raw Innovation
            </div>

            <h1 className="hero-h1">
              Where Brilliantly Raw Ideas Meet{' '}
              <em>Market Validation</em>.
            </h1>

            <p className="hero-sub">
              Bring your next big startup concept out of your head and into the
              vault. Share your vision, gather brutal but constructive feedback,
              and collaborate with builders to turn sparks into fires.
            </p>

            <div className="hero-cta-row">
              <a href="#" className="hero-btn-primary">Deposit an Idea +</a>
              <a href="#" className="hero-btn-ghost">Explore the Vault 🔍</a>
            </div>

            <div className="hero-stats">
              {[
                { num: '12.4k+', label: 'Ideas Deposited' },
                { num: '45k+',   label: 'Active Builders' },
                { num: '62%',    label: 'Avg. Pivot Success' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="hero-stat-num">{s.num}</p>
                  <p className="hero-stat-label">{s.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
