'use client'

import { useState, useEffect, useRef } from 'react'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --white: #fafafa;
    --grey-100: #f4f4f4;
    --grey-200: #e8e8e8;
    --grey-400: #a0a0a0;
    --grey-600: #5a5a5a;
    --grey-800: #2a2a2a;
    --accent: #111111;
    --serif: 'Instrument Serif', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--sans);
    background: var(--white);
    color: var(--black);
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(1.5rem, 5vw, 4rem);
    height: 68px;
    background: rgba(250,250,250,0.88);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--grey-200);
    transition: box-shadow 0.3s;
  }
  .nav.scrolled { box-shadow: 0 2px 24px rgba(0,0,0,0.06); }

  .nav-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: var(--serif);
    font-size: 1.2rem; font-weight: 400; color: var(--black); text-decoration: none;
  }
  .nav-logo-mark {
    width: 32px; height: 32px; background: var(--black);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .nav-logo-mark span {
    width: 12px; height: 12px; background: var(--white); border-radius: 50%;
  }

  .nav-links { display: flex; align-items: center; gap: 2rem; }
  .nav-links a {
    font-size: 0.85rem; font-weight: 500; color: var(--grey-600);
    text-decoration: none; transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--black); }

  .nav-cta {
    padding: 0.55rem 1.25rem; border-radius: 100px;
    background: var(--black); color: var(--white);
    font-size: 0.82rem; font-weight: 600;
    text-decoration: none; border: none; cursor: pointer;
    font-family: var(--sans);
    transition: background 0.2s, transform 0.2s;
  }
  .nav-cta:hover { background: var(--grey-800); transform: translateY(-1px); }

  @media (max-width: 768px) {
    .nav-links { display: none; }
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
    padding: 8rem clamp(1.5rem, 8vw, 6rem) 6rem;
    position: relative; overflow: hidden;
  }

  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, #f0f0f0 0%, transparent 70%);
  }

  .hero-grid {
    position: absolute; inset: 0; z-index: 0; opacity: 0.35;
    background-image:
      linear-gradient(var(--grey-200) 1px, transparent 1px),
      linear-gradient(90deg, var(--grey-200) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 80%);
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.35rem 0.9rem; border-radius: 100px;
    border: 1px solid var(--grey-200); background: var(--white);
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--grey-600); margin-bottom: 1.75rem; position: relative; z-index: 1;
    animation: fadeUp 0.8s ease both;
  }
  .hero-badge-dot { width: 6px; height: 6px; background: #16a34a; border-radius: 50%; }

  .hero-h1 {
    font-family: var(--serif);
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 400; line-height: 1.1;
    color: var(--black); margin-bottom: 1.5rem;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s 0.1s ease both;
    max-width: 820px;
  }
  .hero-h1 em { font-style: italic; color: var(--grey-600); }

  .hero-sub {
    font-size: clamp(1rem, 2vw, 1.15rem);
    color: var(--grey-600); max-width: 540px;
    line-height: 1.7; margin-bottom: 2.5rem;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s 0.2s ease both;
  }

  .hero-btns {
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; justify-content: center;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s 0.3s ease both;
  }

  .btn-dark {
    padding: 0.8rem 1.75rem; border-radius: 100px;
    background: var(--black); color: var(--white);
    font-size: 0.9rem; font-weight: 600; font-family: var(--sans);
    text-decoration: none; border: none; cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-dark:hover { background: var(--grey-800); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }

  .btn-outline {
    padding: 0.8rem 1.75rem; border-radius: 100px;
    background: transparent; color: var(--black);
    border: 1.5px solid var(--grey-200);
    font-size: 0.9rem; font-weight: 500; font-family: var(--sans);
    text-decoration: none; cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-outline:hover { border-color: var(--black); background: var(--grey-100); transform: translateY(-2px); }

  .hero-stats {
    display: flex; gap: 2.5rem; margin-top: 5rem; justify-content: center; flex-wrap: wrap;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s 0.4s ease both;
  }
  .hero-stat { text-align: center; }
  .hero-stat-val {
    font-family: var(--serif); font-size: 2rem; font-weight: 400; color: var(--black);
    display: block; line-height: 1;
  }
  .hero-stat-label { font-size: 0.72rem; color: var(--grey-400); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.35rem; }

  /* ── SECTION SHELL ── */
  .section {
    padding: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 8vw, 6rem);
  }
  .section-inner { max-width: 1100px; margin: 0 auto; }

  .eyebrow {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--grey-400);
    margin-bottom: 0.75rem;
  }

  .h2 {
    font-family: var(--serif);
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 400; line-height: 1.15;
    color: var(--black); margin-bottom: 1rem;
  }
  .h2 em { font-style: italic; color: var(--grey-600); }

  .body-lg { font-size: 1.05rem; color: var(--grey-600); max-width: 520px; line-height: 1.75; }

  /* ── MARQUEE ── */
  .marquee-wrap {
    background: var(--black); padding: 1rem 0; overflow: hidden;
    border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a;
  }
  .marquee-track {
    display: flex; align-items: center; gap: 3rem; width: max-content;
    animation: marquee 28s linear infinite;
  }
  .marquee-item {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
    white-space: nowrap; flex-shrink: 0;
  }
  .marquee-dot { width: 4px; height: 4px; background: rgba(255,255,255,0.25); border-radius: 50%; }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* ── PRODUCT MOCKUP ── */
  .mockup-section { background: var(--grey-100); }

  .mockup-wrap {
    background: var(--black); border-radius: 24px; overflow: hidden;
    margin-top: 3rem;
    box-shadow: 0 32px 80px rgba(0,0,0,0.15);
  }

  .mockup-bar {
    padding: 0.75rem 1.25rem;
    display: flex; align-items: center; gap: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .mockup-dot { width: 10px; height: 10px; border-radius: 50%; }

  .mockup-body { padding: 2rem; display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; min-height: 420px; }
  @media (max-width: 640px) { .mockup-body { grid-template-columns: 1fr; } }

  .mockup-sidebar { display: flex; flex-direction: column; gap: 0.4rem; }
  .mockup-nav-item {
    padding: 0.55rem 0.75rem; border-radius: 8px;
    font-size: 0.72rem; font-weight: 500; color: rgba(255,255,255,0.4);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .mockup-nav-item.active { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); }
  .mockup-nav-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  .mockup-content { display: flex; flex-direction: column; gap: 1rem; }

  .mockup-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
  @media (max-width: 480px) { .mockup-cards { grid-template-columns: 1fr 1fr; } }

  .mockup-stat {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; padding: 0.85rem;
  }
  .mockup-stat-val { font-family: var(--serif); font-size: 1.6rem; color: white; line-height: 1; }
  .mockup-stat-label { font-size: 0.58rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.3rem; }

  .mockup-table { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; overflow: hidden; }
  .mockup-table-row {
    display: grid; grid-template-columns: 1fr 80px 60px;
    padding: 0.65rem 0.85rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    align-items: center; gap: 0.5rem;
  }
  .mockup-table-row:last-child { border-bottom: none; }
  .mockup-table-row.header { opacity: 0.35; }
  .mockup-td { font-size: 0.67rem; color: rgba(255,255,255,0.7); }
  .mockup-td.header { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.08em; }
  .mockup-badge {
    display: inline-block; font-size: 0.55rem; font-weight: 700;
    padding: 0.15rem 0.45rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .mockup-badge.new { background: rgba(99,102,241,0.2); color: #a5b4fc; }
  .mockup-badge.qualified { background: rgba(22,163,74,0.2); color: #86efac; }
  .mockup-badge.contacted { background: rgba(234,179,8,0.2); color: #fde047; }

  /* ── HOW IT WORKS ── */
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3.5rem; }
  @media (max-width: 768px) { .steps { grid-template-columns: 1fr; } }

  .step {
    position: relative; padding: 2rem; border-radius: 20px;
    border: 1px solid var(--grey-200);
    background: var(--white);
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  }
  .step:hover {
    border-color: var(--grey-400);
    box-shadow: 0 12px 40px rgba(0,0,0,0.06);
    transform: translateY(-4px);
  }

  .step-num {
    font-family: var(--serif); font-size: 3.5rem; font-weight: 400;
    color: var(--grey-200); line-height: 1; margin-bottom: 1.25rem;
    display: block;
  }

  .step-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--black); display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem;
  }

  .step-title { font-size: 1.05rem; font-weight: 600; color: var(--black); margin-bottom: 0.5rem; }
  .step-body { font-size: 0.875rem; color: var(--grey-600); line-height: 1.7; }

  /* ── FEATURES BENTO ── */
  .bento { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 3.5rem; }
  @media (max-width: 768px) { .bento { grid-template-columns: 1fr; } }

  .bento-card {
    padding: 2rem; border-radius: 20px;
    border: 1px solid var(--grey-200); background: var(--white);
    transition: border-color 0.3s, box-shadow 0.3s;
    overflow: hidden; position: relative;
  }
  .bento-card:hover { border-color: var(--black); box-shadow: 0 8px 32px rgba(0,0,0,0.06); }
  .bento-card.dark { background: var(--black); border-color: var(--grey-800); }
  .bento-card.dark .bento-title { color: var(--white); }
  .bento-card.dark .bento-body { color: rgba(255,255,255,0.5); }
  .bento-card.full { grid-column: 1 / -1; }

  .bento-icon { font-size: 1.75rem; margin-bottom: 1.25rem; display: block; }
  .bento-title { font-size: 1.1rem; font-weight: 600; color: var(--black); margin-bottom: 0.5rem; }
  .bento-body { font-size: 0.875rem; color: var(--grey-600); line-height: 1.7; max-width: 400px; }

  .bento-visual {
    margin-top: 1.5rem;
    display: flex; gap: 0.5rem; flex-wrap: wrap;
  }

  .channel-chip {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.35rem 0.75rem; border-radius: 100px;
    font-size: 0.72rem; font-weight: 500;
    background: var(--grey-100); border: 1px solid var(--grey-200); color: var(--grey-600);
  }

  .platform-pill {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.4rem 0.85rem; border-radius: 100px;
    font-size: 0.72rem; font-weight: 500;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6);
  }

  /* ── TESTIMONIALS ── */
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 3.5rem; }
  @media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 600px) { .testimonials-grid { grid-template-columns: 1fr; } }

  .testimonial {
    padding: 1.75rem; border-radius: 20px;
    border: 1px solid var(--grey-200); background: var(--white);
    display: flex; flex-direction: column;
    transition: border-color 0.3s, transform 0.3s;
  }
  .testimonial:hover { border-color: var(--grey-400); transform: translateY(-3px); }

  .t-stars { color: var(--black); font-size: 0.75rem; margin-bottom: 1rem; letter-spacing: 0.1em; }
  .t-quote { font-size: 0.9rem; color: var(--grey-600); line-height: 1.75; flex: 1; font-style: italic; }
  .t-author { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.25rem; }
  .t-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--black); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--serif); font-size: 0.85rem; color: white; font-weight: 400;
  }
  .t-name { font-size: 0.82rem; font-weight: 600; color: var(--black); }
  .t-biz { font-size: 0.72rem; color: var(--grey-400); }

  /* ── PRICING ── */
  .pricing-section { background: var(--grey-100); }
  .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; max-width: 760px; margin: 3rem auto 0; }
  @media (max-width: 640px) { .pricing-grid { grid-template-columns: 1fr; } }

  .pricing-card {
    padding: 2rem; border-radius: 24px;
    border: 1px solid var(--grey-200); background: var(--white);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .pricing-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
  .pricing-card.popular { background: var(--black); border-color: var(--black); position: relative; }

  .popular-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    padding: 0.25rem 0.85rem; border-radius: 100px;
    background: var(--white); border: 1px solid var(--grey-200);
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--black); white-space: nowrap;
  }

  .plan-name { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--grey-400); margin-bottom: 0.75rem; }
  .pricing-card.popular .plan-name { color: rgba(255,255,255,0.4); }

  .plan-price { font-family: var(--serif); font-size: 2.75rem; font-weight: 400; color: var(--black); line-height: 1; }
  .pricing-card.popular .plan-price { color: var(--white); }
  .plan-period { font-size: 0.78rem; color: var(--grey-400); margin-top: 0.25rem; margin-bottom: 1.5rem; }
  .pricing-card.popular .plan-period { color: rgba(255,255,255,0.35); }

  .plan-features { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.75rem; }
  .plan-feature { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--grey-600); }
  .pricing-card.popular .plan-feature { color: rgba(255,255,255,0.65); }
  .plan-check { width: 16px; height: 16px; border-radius: 50%; background: var(--black); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .pricing-card.popular .plan-check { background: rgba(255,255,255,0.15); }
  .plan-check::after { content: '✓'; font-size: 0.55rem; color: white; font-weight: 700; }
  .pricing-card.popular .plan-check::after { color: white; }

  .btn-plan-dark {
    width: 100%; padding: 0.8rem; border-radius: 100px;
    background: var(--white); color: var(--black);
    font-size: 0.85rem; font-weight: 600; font-family: var(--sans);
    border: none; cursor: pointer; transition: background 0.2s, transform 0.2s;
  }
  .btn-plan-dark:hover { background: var(--grey-200); transform: translateY(-1px); }

  .btn-plan-outline {
    width: 100%; padding: 0.8rem; border-radius: 100px;
    background: transparent; color: var(--black);
    border: 1.5px solid var(--grey-200);
    font-size: 0.85rem; font-weight: 600; font-family: var(--sans);
    cursor: pointer; transition: border-color 0.2s, transform 0.2s;
  }
  .btn-plan-outline:hover { border-color: var(--black); transform: translateY(-1px); }

  /* ── FAQ ── */
  .faq { max-width: 680px; margin: 3.5rem auto 0; }
  .faq-item { border-bottom: 1px solid var(--grey-200); overflow: hidden; }
  .faq-q {
    width: 100%; padding: 1.2rem 0;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.95rem; font-weight: 500; color: var(--black);
    background: none; border: none; cursor: pointer; font-family: var(--sans);
    text-align: left; gap: 1rem;
  }
  .faq-q:hover { color: var(--grey-600); }
  .faq-chevron { flex-shrink: 0; font-size: 0.75rem; color: var(--grey-400); transition: transform 0.3s; }
  .faq-chevron.open { transform: rotate(180deg); }
  .faq-a { font-size: 0.875rem; color: var(--grey-600); line-height: 1.75; padding-bottom: 1.2rem; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.3s; }
  .faq-a.open { max-height: 200px; }

  /* ── CTA SECTION ── */
  .cta-section { background: var(--black); padding: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 8vw, 6rem); text-align: center; }
  .cta-h2 {
    font-family: var(--serif); font-size: clamp(2rem, 5vw, 3.75rem);
    font-weight: 400; color: var(--white); line-height: 1.15;
    max-width: 640px; margin: 0 auto 1.25rem;
  }
  .cta-h2 em { font-style: italic; color: rgba(255,255,255,0.4); }
  .cta-sub { font-size: 1rem; color: rgba(255,255,255,0.4); max-width: 420px; margin: 0 auto 2.5rem; line-height: 1.7; }
  .cta-btns { display: flex; align-items: center; justify-content: center; gap: 0.75rem; flex-wrap: wrap; }
  .btn-white {
    padding: 0.8rem 1.75rem; border-radius: 100px;
    background: var(--white); color: var(--black);
    font-size: 0.9rem; font-weight: 600; font-family: var(--sans);
    text-decoration: none; border: none; cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-white:hover { background: var(--grey-100); transform: translateY(-2px); }
  .btn-ghost-white {
    padding: 0.8rem 1.75rem; border-radius: 100px;
    background: transparent; color: rgba(255,255,255,0.6);
    border: 1.5px solid rgba(255,255,255,0.12);
    font-size: 0.9rem; font-weight: 500; font-family: var(--sans);
    text-decoration: none; cursor: pointer;
    transition: border-color 0.2s, color 0.2s, transform 0.2s;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-ghost-white:hover { border-color: rgba(255,255,255,0.35); color: white; transform: translateY(-2px); }

  /* ── FOOTER ── */
  .footer {
    background: var(--black); border-top: 1px solid rgba(255,255,255,0.06);
    padding: 3rem clamp(1.5rem, 8vw, 6rem) 2rem;
  }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem; max-width: 1100px; margin: 0 auto; }
  @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }

  .footer-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: var(--serif); font-size: 1.1rem; color: white;
    margin-bottom: 0.75rem;
  }
  .footer-logo-mark { width: 28px; height: 28px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .footer-logo-mark span { width: 9px; height: 9px; background: white; border-radius: 50%; }
  .footer-tagline { font-size: 0.8rem; color: rgba(255,255,255,0.3); line-height: 1.6; max-width: 240px; }

  .footer-col-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 1rem; }
  .footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
  .footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: rgba(255,255,255,0.8); }

  .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.5rem; margin-top: 3rem; max-width: 1100px; margin-left: auto; margin-right: auto; }
  .footer-copy { font-size: 0.72rem; color: rgba(255,255,255,0.2); }
  .footer-legal { display: flex; gap: 1.25rem; }
  .footer-legal a { font-size: 0.72rem; color: rgba(255,255,255,0.2); text-decoration: none; transition: color 0.2s; }
  .footer-legal a:hover { color: rgba(255,255,255,0.5); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .reveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`

const MARQUEE_ITEMS = [
  'Capture Leads', 'Organise Customers', 'Convert More', 'Digital Business Cards',
  'WhatsApp Sharing', 'QR Code Ready', 'Analytics Dashboard', 'No Lost Customers',
  'Capture Leads', 'Organise Customers', 'Convert More', 'Digital Business Cards',
  'WhatsApp Sharing', 'QR Code Ready', 'Analytics Dashboard', 'No Lost Customers',
]

const STEPS = [
  {
    num: '01',
    emoji: '🔗',
    title: 'Share Your Link',
    body: 'Each staff member gets a unique digital card link. Share it via WhatsApp, Instagram, QR code, or anywhere you connect with customers.',
  },
  {
    num: '02',
    emoji: '📥',
    title: 'Capture Interest',
    body: 'Customers visit the page, see your team\'s full profile, and fill in a simple form. Their details land instantly in your dashboard.',
  },
  {
    num: '03',
    emoji: '📊',
    title: 'Convert & Close',
    body: 'Qualify leads, add notes, update statuses, and follow up — all from one clean dashboard. Never lose a warm lead again.',
  },
]

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Lead Capture',
    body: 'No more scribbling phone numbers or forgotten conversations. Every interested customer submits their info directly to your dashboard.',
    dark: false,
    visual: 'channels',
  },
  {
    icon: '📋',
    title: 'Structured Pipeline',
    body: 'Mark leads as New, Contacted, Qualified, or Closed. Add private notes and tags to keep your team aligned.',
    dark: true,
    visual: 'platforms',
  },
  {
    icon: '📈',
    title: 'Real Analytics',
    body: 'See exactly how many people viewed each profile, how many became leads, and your team\'s conversion rates at a glance.',
    dark: false,
    visual: null,
  },
  {
    icon: '👥',
    title: 'Team Management',
    body: 'Add unlimited staff members, each with their own branded card. One dashboard, your entire team.',
    dark: false,
    visual: null,
  },
]

const TESTIMONIALS = [
  { stars: '★★★★★', quote: 'Before Small Digital, I\'d lose customer numbers in WhatsApp chats. Now every lead is saved automatically — I closed 3 extra deals last month.', name: 'Tunde A.', biz: 'Fashion Boutique, Lagos', init: 'TA' },
  { stars: '★★★★★', quote: 'My sales team shares their cards at events and the leads pour into the dashboard instantly. It\'s the most organised we\'ve ever been.', name: 'Chioma O.', biz: 'Real Estate Agency', init: 'CO' },
  { stars: '★★★★★', quote: 'Simple, clean, and actually works. I used to forget to follow up — now I get a full list of who\'s interested and I can track every one.', name: 'Emeka S.', biz: 'Financial Services', init: 'ES' },
]

const FAQS = [
  { q: 'Do I need to install anything?', a: 'No. Small Digital is entirely web-based. Your customers click a link — no app download required. You manage everything from a browser dashboard.' },
  { q: 'How do customers submit their information?', a: 'Each profile card has a built-in contact form. Customers fill in their name, email, phone, and a note — their data lands in your leads dashboard instantly.' },
  { q: 'Can I have multiple staff members?', a: 'Yes. Add as many staff as your plan allows. Each person gets their own branded card with unique link, QR code, and individual analytics.' },
  { q: 'What does "Closed" mean for a lead?', a: '"Closed" means you\'ve completed the deal or marked the lead as converted. You can move leads through stages: New → Contacted → Qualified → Closed.' },
  { q: 'Can I share cards on Instagram or WhatsApp?', a: 'Absolutely. The profile link works everywhere — paste it in a bio, send it in a WhatsApp message, print the QR code, or tap via NFC.' },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const revealRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    revealRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const addRef = (i: number) => (el: HTMLDivElement | null) => { revealRefs.current[i] = el }

  return (
    <>
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark"><span /></div>
          Small Digital
        </a>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <a href="/login" className="nav-cta">Get Started →</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Now live for businesses across Nigeria
        </div>
        <h1 className="hero-h1">
          Stop losing customers.<br />
          <em>Start closing deals.</em>
        </h1>
        <p className="hero-sub">
          Small Digital gives your team beautiful digital business cards that automatically capture, organise, and convert every lead — so no customer ever slips through the cracks.
        </p>
        <div className="hero-btns">
          <a href="/login" className="btn-dark">Start for free →</a>
          <a href="#how-it-works" className="btn-outline">See how it works</a>
        </div>
        <div className="hero-stats">
          {[
            { val: '3×', label: 'More leads captured' },
            { val: '2 min', label: 'Setup time' },
            { val: '0', label: 'Apps to install' },
          ].map((s, i) => (
            <div key={i} className="hero-stat">
              <span className="hero-stat-val">{s.val}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* PRODUCT MOCKUP */}
      <section className="section mockup-section">
        <div className="section-inner">
          <div ref={addRef(0)} className="reveal" style={{ textAlign: 'center' }}>
            <p className="eyebrow">The Dashboard</p>
            <h2 className="h2" style={{ margin: '0 auto', textAlign: 'center' }}>
              Everything in <em>one place</em>
            </h2>
          </div>
          <div ref={addRef(1)} className="reveal mockup-wrap">
            <div className="mockup-bar">
              <div className="mockup-dot" style={{ background: '#ef4444' }} />
              <div className="mockup-dot" style={{ background: '#f59e0b' }} />
              <div className="mockup-dot" style={{ background: '#22c55e' }} />
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                {['Dashboard', 'Staff Members', 'Leads', 'Analytics', 'Settings'].map((item, i) => (
                  <div key={i} className={`mockup-nav-item ${i === 2 ? 'active' : ''}`}>
                    <span className="mockup-nav-dot" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mockup-content">
                <div className="mockup-cards">
                  {[{ val: '24', label: 'Total Leads' }, { val: '8', label: 'Qualified' }, { val: '67%', label: 'Conv. Rate' }].map((s, i) => (
                    <div key={i} className="mockup-stat">
                      <div className="mockup-stat-val">{s.val}</div>
                      <div className="mockup-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mockup-table">
                  <div className="mockup-table-row header">
                    <span className="mockup-td header">Name</span>
                    <span className="mockup-td header">Status</span>
                    <span className="mockup-td header">Via</span>
                  </div>
                  {[
                    { name: 'Amaka Okafor', badge: 'qualified', via: 'Amara' },
                    { name: 'Bode Adeyemi', badge: 'new', via: 'Tobi' },
                    { name: 'Ngozi Eze', badge: 'contacted', via: 'Amara' },
                    { name: 'Seun Williams', badge: 'new', via: 'Kemi' },
                  ].map((row, i) => (
                    <div key={i} className="mockup-table-row">
                      <span className="mockup-td">{row.name}</span>
                      <span><span className={`mockup-badge ${row.badge}`}>{row.badge}</span></span>
                      <span className="mockup-td">{row.via}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="section-inner">
          <div ref={addRef(2)} className="reveal">
            <p className="eyebrow">How it works</p>
            <h2 className="h2">Three steps to <em>zero missed leads</em></h2>
            <p className="body-lg">From first impression to closed deal — all tracked automatically.</p>
          </div>
          <div className="steps">
            {STEPS.map((step, i) => (
              <div key={i} ref={addRef(3 + i)} className="reveal step" style={{ transitionDelay: `${i * 0.12}s` }}>
                <span className="step-num">{step.num}</span>
                <div className="step-icon"><span style={{ fontSize: '1.1rem' }}>{step.emoji}</span></div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features" style={{ background: 'var(--grey-100)' }}>
        <div className="section-inner">
          <div ref={addRef(6)} className="reveal">
            <p className="eyebrow">Features</p>
            <h2 className="h2">Built for <em>real businesses</em></h2>
            <p className="body-lg">No fluff. Just the tools you need to capture every customer and convert more sales.</p>
          </div>
          <div className="bento">
            {FEATURES.map((f, i) => (
              <div key={i} ref={addRef(7 + i)} className={`reveal bento-card ${f.dark ? 'dark' : ''}`} style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <span className="bento-icon">{f.icon}</span>
                <h3 className="bento-title">{f.title}</h3>
                <p className="bento-body">{f.body}</p>
                {f.visual === 'channels' && (
                  <div className="bento-visual">
                    {['WhatsApp', 'Instagram', 'QR Code', 'NFC Tap', 'Email', 'Link'].map((c, ci) => (
                      <span key={ci} className="channel-chip">{c}</span>
                    ))}
                  </div>
                )}
                {f.visual === 'platforms' && (
                  <div className="bento-visual">
                    {['🟣 New', '🟡 Contacted', '🟢 Qualified', '🔴 Closed'].map((p, pi) => (
                      <span key={pi} className="platform-pill">{p}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-inner">
          <div ref={addRef(11)} className="reveal">
            <p className="eyebrow">What people are saying</p>
            <h2 className="h2">Businesses closing <em>more deals</em></h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} ref={addRef(12 + i)} className="reveal testimonial" style={{ transitionDelay: `${i * 0.1}s` }}>
                <p className="t-stars">{t.stars}</p>
                <p className="t-quote">"{t.quote}"</p>
                <div className="t-author">
                  <div className="t-avatar">{t.init}</div>
                  <div>
                    <p className="t-name">{t.name}</p>
                    <p className="t-biz">{t.biz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section pricing-section" id="pricing">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div ref={addRef(15)} className="reveal">
            <p className="eyebrow">Pricing</p>
            <h2 className="h2" style={{ margin: '0 auto' }}>Simple, <em>honest pricing</em></h2>
            <p className="body-lg" style={{ margin: '0.75rem auto 0', textAlign: 'center' }}>No hidden fees. No complicated tiers. Start free, grow when you're ready.</p>
          </div>
          <div className="pricing-grid">
            <div ref={addRef(16)} className="reveal pricing-card">
              <p className="plan-name">Starter</p>
              <p className="plan-price">Free</p>
              <p className="plan-period">Forever free</p>
              <div className="plan-features">
                {['Up to 3 staff profiles', 'Unlimited leads', 'Basic analytics', 'WhatsApp & link sharing'].map((f, i) => (
                  <div key={i} className="plan-feature"><span className="plan-check" />{f}</div>
                ))}
              </div>
              <button className="btn-plan-outline" onClick={() => window.location.href = '/login'}>Get started free</button>
            </div>
            <div ref={addRef(17)} className="reveal pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <p className="plan-name">Business</p>
              <p className="plan-price">₦2,500 / profile</p>
              <p className="plan-period">monthly</p>
              <div className="plan-features">
                {['Unlimited staff profiles', 'Advanced lead pipeline', 'Full analytics + exports', 'QR & NFC card support', 'Priority support'].map((f, i) => (
                  <div key={i} className="plan-feature"><span className="plan-check" />{f}</div>
                ))}
              </div>
              <button className="btn-plan-dark" onClick={() => window.location.href = '/login'}>Start 14-day trial</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div ref={addRef(18)} className="reveal">
            <p className="eyebrow">FAQ</p>
            <h2 className="h2" style={{ margin: '0 auto' }}>Questions <em>answered</em></h2>
          </div>
          <div className="faq" ref={addRef(19)}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className={`faq-chevron ${openFaq === i ? 'open' : ''}`}>▼</span>
                </button>
                <p className={`faq-a ${openFaq === i ? 'open' : ''}`}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div ref={addRef(20)} className="reveal">
          <h2 className="cta-h2">Ready to stop losing <em>customers?</em></h2>
          <p className="cta-sub">Join businesses already using Small Digital to capture every lead and close more deals.</p>
          <div className="cta-btns">
            <a href="/login" className="btn-white">Get started free →</a>
            <a href="#how-it-works" className="btn-ghost-white">See how it works</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="footer-logo-mark"><span /></div>
              Small Digital
            </div>
            <p className="footer-tagline">Capture, organise, and convert every potential customer — so your business never loses a sale.</p>
          </div>
          <div>
            <p className="footer-col-title">Product</p>
            <div className="footer-links">
              <a href="#how-it-works">How it works</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="/login">Dashboard</a>
            </div>
          </div>
          <div>
            <p className="footer-col-title">Company</p>
            <div className="footer-links">
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div>
            <p className="footer-col-title">Legal</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} Small Digital. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </>
  )
}