'use client'

import { useState, useEffect } from 'react'
import { LogOut, Plus, Users, BarChart3, Settings, Menu, X, UserCheck } from 'lucide-react'
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok, FaYoutube, FaWhatsapp, FaGlobe, FaEnvelope, FaPhone, FaLink, FaCopy } from 'react-icons/fa6'
import { getAllProfiles, createProfile, deleteProfile, ProfileResponse, getLeads, updateLead, deleteLead, LeadResponse, LeadStatus, getProfileStats, ProfileStatsResponse } from '@/lib/api'

type Section = 'dashboard' | 'staff' | 'analytics' | 'settings' | 'public-profile' | 'leads'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }

  .db-root {
    min-height: 100vh;
    background: #f3f4f6;
    font-family: 'DM Sans', sans-serif;
    color: #111827;
  }

  /* ── HEADER ── */
  .db-header {
    position: sticky; top: 0; z-index: 50;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    padding: 0 1.25rem;
    height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .db-header-left { display: flex; align-items: center; gap: 0.75rem; }

  .db-logo {
    width: 36px; height: 36px; border-radius: 9px;
    background: #111827;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-weight: 700; font-size: 0.9rem; color: white; flex-shrink: 0;
  }

  .db-company-name {
    font-family: 'Playfair Display', serif;
    font-size: 1rem; font-weight: 700; color: #111827;
  }

  .db-header-right {
    font-size: 0.65rem; color: #9ca3af;
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  @media (max-width: 480px) { .db-header-right { display: none; } }

  .db-menu-btn {
    background: none; border: none; cursor: pointer;
    color: #6b7280; padding: 0.25rem; display: none; line-height: 0;
    -webkit-tap-highlight-color: transparent;
  }
  @media (max-width: 1024px) { .db-menu-btn { display: block; } }

  /* ── LAYOUT ── */
  .db-layout { display: flex; position: relative; }

  .db-sidebar {
    width: 240px; flex-shrink: 0;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    min-height: calc(100vh - 60px);
    padding: 1.25rem 0.875rem;
    position: sticky; top: 60px;
    height: calc(100vh - 60px);
    overflow-y: auto;
    transition: transform 0.25s ease;
  }

  @media (max-width: 1024px) {
    .db-sidebar {
      position: fixed; top: 60px; left: 0; z-index: 40;
      height: calc(100vh - 60px);
      width: 260px;
      box-shadow: 4px 0 24px rgba(0,0,0,0.1);
    }
    .db-sidebar.closed { transform: translateX(-100%); }
  }

  .db-overlay {
    display: none;
    position: fixed; inset: 0; top: 60px;
    background: rgba(0,0,0,0.3);
    z-index: 39;
  }
  @media (max-width: 1024px) { .db-overlay.show { display: block; } }

  .db-nav { display: flex; flex-direction: column; gap: 0.25rem; }

  .db-nav-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.7rem 0.875rem; border-radius: 10px;
    font-size: 0.875rem; font-weight: 500; color: #6b7280;
    background: none; border: none; cursor: pointer;
    width: 100%; text-align: left; transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
    -webkit-tap-highlight-color: transparent;
  }
  .db-nav-item:hover { background: #f3f4f6; color: #111827; }
  .db-nav-item.active { background: #111827; color: white; }
  .db-nav-item.danger { color: #ef4444; }
  .db-nav-item.danger:hover { background: #fef2f2; color: #dc2626; }
  .db-nav-divider { height: 1px; background: #f3f4f6; margin: 0.5rem 0; }

  /* ── BOTTOM NAV (mobile only) ── */
  .db-bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
    background: #ffffff;
    border-top: 1px solid #e5e7eb;
    padding: 0.4rem 0 calc(0.4rem + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
  }
  @media (max-width: 640px) { .db-bottom-nav { display: flex; } }

  .db-bottom-nav-inner {
    display: flex; justify-content: space-around; align-items: center; width: 100%;
  }

  .db-bottom-btn {
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    padding: 0.3rem 0.4rem; border-radius: 8px;
    background: none; border: none; cursor: pointer;
    font-size: 0.55rem; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    color: #9ca3af; transition: color 0.15s;
    font-family: 'DM Sans', sans-serif;
    -webkit-tap-highlight-color: transparent; min-width: 48px;
  }
  .db-bottom-btn.active { color: #111827; }

  /* ── MAIN ── */
  .db-main { flex: 1; padding: 1.5rem 1.25rem; min-width: 0; }
  @media (max-width: 640px) {
    .db-main { padding: 1.1rem 0.875rem; padding-bottom: calc(76px + env(safe-area-inset-bottom)); }
  }

  /* ── SECTION HEADER ── */
  .section-header { margin-bottom: 1.5rem; }
  .section-header-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700; color: #111827; margin-bottom: 0.2rem;
  }
  @media (max-width: 480px) { .section-title { font-size: 1.35rem; } }
  .section-sub { font-size: 0.82rem; color: #9ca3af; }

  .g-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.25rem; }

  /* ── STATS ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem; margin-bottom: 1.5rem;
  }
  @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

  .stat-card {
    background: #ffffff; border: 1px solid #e5e7eb;
    border-radius: 14px; padding: 1rem 1.1rem;
    animation: fadeUp 0.5s ease forwards;
  }
  .stat-label {
    font-size: 0.62rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #9ca3af; margin-bottom: 0.4rem;
  }
  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem; font-weight: 700; color: #111827; line-height: 1;
  }
  @media (max-width: 480px) { .stat-value { font-size: 1.5rem; } }
  .stat-value.accent { color: #6366f1; }

  /* ── QUICK ACTIONS ── */
  .actions-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.65rem; margin-bottom: 1.5rem;
  }
  @media (max-width: 600px) { .actions-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 380px) { .actions-grid { grid-template-columns: 1fr; } }

  .quick-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    padding: 0.75rem 0.65rem; border-radius: 12px;
    font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid #e0e7ff; background: #eef2ff; color: #4f46e5;
    -webkit-tap-highlight-color: transparent;
  }
  .quick-btn:hover { background: #e0e7ff; transform: translateY(-2px); }
  .quick-btn.ghost { border-color: #e5e7eb; background: #f9fafb; color: #6b7280; }
  .quick-btn.ghost:hover { background: #f3f4f6; color: #111827; }

  /* ── STAFF ── */
  .staff-grid { display: grid; gap: 0.875rem; }

  .staff-card {
    background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;
    padding: 1.1rem;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 0.875rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    animation: fadeUp 0.4s ease forwards;
  }
  .staff-card:hover { border-color: #c7d2fe; box-shadow: 0 2px 12px rgba(99,102,241,0.08); }

  @media (max-width: 480px) {
    .staff-card { flex-direction: column; }
    .staff-actions { flex-direction: row !important; align-items: center !important; width: 100%; justify-content: flex-end; }
  }

  .staff-avatar {
    width: 44px; height: 44px; border-radius: 50%; background: #111827;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem; font-weight: 700; color: white; flex-shrink: 0;
  }

  .staff-name { font-weight: 600; font-size: 0.92rem; color: #111827; margin-bottom: 0.1rem; }
  .staff-role { font-size: 0.72rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.45rem; }
  .staff-about { font-size: 0.78rem; color: #6b7280; margin-bottom: 0.45rem; line-height: 1.5; }
  .staff-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.45rem; }
  .staff-meta-item { font-size: 0.7rem; color: #9ca3af; display: flex; align-items: center; gap: 0.25rem; }
  .staff-socials { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .staff-social-tag { font-size: 0.65rem; font-weight: 500; padding: 0.18rem 0.5rem; border-radius: 100px; background: #eef2ff; border: 1px solid #e0e7ff; color: #4f46e5; }
  .staff-link-row { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.5rem; flex-wrap: wrap; }
  .staff-link-text { font-size: 0.62rem; color: #d1d5db; font-family: monospace; word-break: break-all; }
  .staff-copy-btn {
    font-size: 0.68rem; color: #6366f1; background: none; border: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500;
    -webkit-tap-highlight-color: transparent; white-space: nowrap;
  }
  .staff-copy-btn:hover { color: #4f46e5; }
  .staff-actions { display: flex; flex-direction: column; gap: 0.45rem; align-items: flex-end; flex-shrink: 0; }
  .staff-stats { display: flex; gap: 0.4rem; margin-top: 0.4rem; flex-wrap: wrap; }
  .staff-stat-chip {
    font-size: 0.65rem; font-weight: 500; padding: 0.18rem 0.5rem; border-radius: 100px;
    display: flex; align-items: center; gap: 0.2rem;
  }
  .staff-stat-chip.views { background: #eef2ff; border: 1px solid #e0e7ff; color: #4f46e5; }
  .staff-stat-chip.leads { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }
  .staff-stat-chip.conversion { background: #fffbeb; border: 1px solid #fde68a; color: #d97706; }

  /* ── BUTTONS ── */
  .btn-view {
    padding: 0.4rem 0.9rem; border-radius: 9px; font-size: 0.75rem; font-weight: 500;
    background: #111827; border: 1px solid #111827; color: white;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-view:hover { background: #1f2937; }

  .btn-delete {
    padding: 0.4rem 0.9rem; border-radius: 9px; font-size: 0.75rem; font-weight: 500;
    background: #fef2f2; border: 1px solid #fecaca; color: #ef4444;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-delete:hover { background: #fee2e2; }

  /* ── FORM ── */
  .form-card {
    background: #ffffff; border: 1px solid #e0e7ff;
    border-radius: 18px; padding: 1.5rem; margin-bottom: 1.25rem;
    animation: fadeUp 0.3s ease forwards;
  }
  @media (max-width: 480px) { .form-card { padding: 1.1rem; } }

  .form-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: #111827; margin-bottom: 1.1rem; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
  @media (max-width: 540px) { .form-grid { grid-template-columns: 1fr; } }

  .form-input {
    width: 100%; padding: 0.65rem 0.9rem;
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 9px; color: #111827; font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  .form-input::placeholder { color: #9ca3af; }
  .form-input:focus { border-color: #6366f1; background: #eef2ff; }

  .form-select {
    width: 100%; padding: 0.65rem 0.9rem;
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 9px; color: #111827; font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer; transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  .form-select:focus { border-color: #6366f1; }
  .form-select option { background: #ffffff; color: #111827; }

  .form-textarea {
    width: 100%; padding: 0.65rem 0.9rem;
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 9px; color: #111827; font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif; outline: none; resize: vertical;
    transition: border-color 0.2s; grid-column: 1 / -1; -webkit-appearance: none;
  }
  .form-textarea::placeholder { color: #9ca3af; }
  .form-textarea:focus { border-color: #6366f1; }

  .form-error { font-size: 0.78rem; color: #ef4444; margin-bottom: 0.65rem; }
  .form-btns { display: flex; gap: 0.65rem; margin-top: 0.875rem; flex-wrap: wrap; }

  .btn-primary {
    padding: 0.65rem 1.4rem; border-radius: 9px;
    background: #111827; color: white; border: none; cursor: pointer;
    font-size: 0.875rem; font-weight: 600; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-primary:hover { background: #1f2937; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-secondary {
    padding: 0.65rem 1.1rem; border-radius: 9px;
    background: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;
    cursor: pointer; font-size: 0.875rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.45rem;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-secondary:hover { background: #f3f4f6; color: #111827; }

  .btn-add-staff {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.6rem 1.1rem; border-radius: 10px;
    background: #111827; color: white; border: none; cursor: pointer;
    font-size: 0.82rem; font-weight: 600; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    white-space: nowrap; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-add-staff:hover { background: #1f2937; transform: translateY(-1px); }

  .sec-label {
    font-size: 0.62rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: #9ca3af; margin-bottom: 0.65rem; margin-top: 1.25rem;
  }

  /* ── ANALYTICS ── */
  .chart-wrap {
    background: #ffffff; border: 1px solid #e5e7eb;
    border-radius: 16px; padding: 1.25rem; margin-bottom: 1.25rem; overflow-x: auto;
  }
  .chart-legend { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .chart-legend-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; color: #6b7280; }
  .chart-legend-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .chart-bars { display: flex; align-items: flex-end; gap: 0.5rem; height: 180px; padding-bottom: 0.5rem; min-width: min-content; }
  .chart-bar-group { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; flex-shrink: 0; min-width: 52px; }
  .chart-bar-set { display: flex; align-items: flex-end; gap: 3px; height: 150px; }
  .chart-bar { border-radius: 4px 4px 0 0; min-height: 4px; transition: opacity 0.2s; cursor: pointer; }
  .chart-bar:hover { opacity: 0.75; }
  .chart-bar-label { font-size: 0.6rem; color: #9ca3af; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 52px; }

  .perf-table { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .perf-row {
    display: grid; grid-template-columns: 1fr 70px 70px 70px 90px;
    align-items: center; padding: 0.8rem 0; border-bottom: 1px solid #f3f4f6; gap: 0.75rem; min-width: 420px;
  }
  .perf-row:last-child { border-bottom: none; }
  .perf-header { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; }
  .perf-val { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: #111827; text-align: right; }
  .perf-val.green { color: #16a34a; }
  .perf-val.yellow { color: #d97706; }

  /* ── LEADS ── */
  .leads-filters { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .filter-btn {
    padding: 0.38rem 0.875rem; border-radius: 100px; font-size: 0.75rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    background: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;
    -webkit-tap-highlight-color: transparent;
  }
  .filter-btn:hover { background: #f3f4f6; color: #111827; }
  .filter-btn.active { background: #111827; border-color: #111827; color: white; }

  .lead-card {
    background: #ffffff; border: 1px solid #e5e7eb;
    border-radius: 16px; padding: 1.1rem;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 0.875rem;
    transition: all 0.2s; animation: fadeUp 0.4s ease forwards;
  }
  .lead-card:hover { border-color: #c7d2fe; box-shadow: 0 2px 12px rgba(99,102,241,0.07); }

  @media (max-width: 480px) {
    .lead-card { flex-direction: column; }
    .lead-actions { flex-direction: row !important; align-items: center !important; width: 100%; justify-content: flex-end; }
  }

  .lead-avatar {
    width: 40px; height: 40px; border-radius: 50%; background: #111827;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 0.85rem; font-weight: 700; color: white; flex-shrink: 0;
  }

  .lead-name { font-weight: 600; font-size: 0.88rem; color: #111827; margin-bottom: 0.1rem; }
  .lead-contact { font-size: 0.72rem; color: #9ca3af; display: flex; align-items: center; gap: 0.3rem; margin-bottom: 0.15rem; }
  .lead-source { font-size: 0.65rem; color: #d1d5db; margin-top: 0.3rem; }
  .lead-note { font-size: 0.75rem; color: #9ca3af; margin-top: 0.3rem; font-style: italic; line-height: 1.5; }

  .lead-status-badge {
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
    padding: 0.22rem 0.6rem; border-radius: 100px;
  }
  .lead-status-badge.NEW { background: #eef2ff; border: 1px solid #e0e7ff; color: #4f46e5; }
  .lead-status-badge.CONTACTED { background: #fffbeb; border: 1px solid #fde68a; color: #d97706; }
  .lead-status-badge.QUALIFIED { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }
  .lead-status-badge.CLOSED { background: #fef2f2; border: 1px solid #fecaca; color: #ef4444; }

  .lead-actions { display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-end; flex-shrink: 0; }
  .lead-expand-panel {
    margin-top: 0.875rem; padding-top: 0.875rem; border-top: 1px solid #f3f4f6;
    display: flex; flex-direction: column; gap: 0.55rem;
  }

  /* ── SETTINGS ── */
  .settings-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.875rem 0; border-bottom: 1px solid #f3f4f6; gap: 1rem;
  }
  .settings-row:last-child { border-bottom: none; }
  .settings-label { font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.1rem; }
  .settings-sub { font-size: 0.75rem; color: #9ca3af; }

  .toggle {
    width: 44px; height: 24px; background: #6366f1; border-radius: 100px; position: relative;
    cursor: pointer; border: none; transition: background 0.2s; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .toggle::after {
    content: ''; position: absolute; width: 18px; height: 18px; background: white; border-radius: 50%;
    top: 3px; left: 3px; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  }

  /* ── PUBLIC PROFILE ── */
  .pub-profile-wrap { max-width: 420px; margin: 0 auto; }
  @media (max-width: 480px) { .pub-profile-wrap { max-width: 100%; } }

  .pub-hero {
    position: relative; background: #111827;
    padding: 1.5rem; border-radius: 18px 18px 0 0; overflow: hidden;
  }
  .pub-org-badge {
    position: absolute; top: 0.875rem; right: 0.875rem;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 100px; padding: 0.18rem 0.6rem;
    font-size: 0.58rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.7);
  }
  .pub-identity { display: flex; align-items: center; gap: 0.875rem; position: relative; z-index: 1; }
  .pub-avatar {
    width: 68px; height: 68px; border-radius: 50%;
    background: rgba(255,255,255,0.15); border: 3px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: white; flex-shrink: 0;
  }
  .pub-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: white; margin-bottom: 0.15rem; }
  .pub-role { font-size: 0.68rem; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; text-transform: uppercase; }
  .pub-chips { display: flex; gap: 0.35rem; margin-top: 0.65rem; position: relative; z-index: 1; flex-wrap: wrap; }
  .pub-chip {
    display: inline-flex; align-items: center; gap: 0.25rem;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 100px; padding: 0.22rem 0.55rem;
    font-size: 0.65rem; color: rgba(255,255,255,0.75); text-decoration: none;
  }
  .pub-body {
    background: #ffffff; border: 1px solid #e5e7eb; border-top: none;
    border-radius: 0 0 18px 18px; padding: 1.1rem;
  }
  .pub-about { font-size: 0.8rem; color: #6b7280; line-height: 1.7; padding-bottom: 0.875rem; border-bottom: 1px solid #f3f4f6; margin-bottom: 0.875rem; }
  .pub-socials { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 0.35rem; margin-bottom: 0.875rem; }
  .pub-social {
    display: flex; align-items: center; justify-content: center; gap: 0.35rem;
    padding: 0.5rem; border-radius: 9px; font-size: 0.72rem; font-weight: 500;
    background: #f9fafb; border: 1px solid #e5e7eb; color: #374151; text-decoration: none; transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .pub-social:hover { background: #f3f4f6; color: #111827; transform: translateY(-1px); }
  .pub-actions { display: flex; flex-direction: column; gap: 0.45rem; }
  .pub-action {
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    padding: 0.75rem; border-radius: 11px; font-size: 0.82rem; font-weight: 500;
    text-decoration: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .pub-action.primary { background: #111827; color: white; }
  .pub-action.primary:hover { background: #1f2937; transform: translateY(-1px); }
  .pub-action.wa { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0 !important; }
  .pub-action.wa:hover { background: #dcfce7; transform: translateY(-1px); }
  .pub-action.ghost { background: #f9fafb; color: #6b7280; border: 1px solid #e5e7eb !important; }
  .pub-action.ghost:hover { background: #f3f4f6; color: #111827; transform: translateY(-1px); }
  .pub-powered { text-align: center; margin-top: 0.875rem; font-size: 0.62rem; color: #d1d5db; }
  .pub-powered span { color: #6366f1; font-weight: 600; }

  /* ── MISC ── */
  .danger-zone { background: #fef2f2; border: 1px solid #fecaca; border-radius: 14px; padding: 1.25rem; }
  .danger-title { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: #ef4444; margin-bottom: 0.875rem; }
  .btn-danger {
    padding: 0.6rem 1.1rem; border-radius: 9px; background: #fef2f2; border: 1px solid #fecaca;
    color: #ef4444; cursor: pointer; font-size: 0.875rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s; -webkit-tap-highlight-color: transparent;
  }
  .btn-danger:hover { background: #fee2e2; }

  .btn-back {
    background: none; border: none; cursor: pointer; color: #6366f1;
    font-size: 0.875rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.35rem;
    transition: color 0.2s; padding: 0; -webkit-tap-highlight-color: transparent;
  }
  .btn-back:hover { color: #4f46e5; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .empty-state { text-align: center; padding: 3.5rem 1.5rem; color: #9ca3af; font-size: 0.875rem; }
`

// ─── BOTTOM NAV ICONS ──────────────────────────────────────────────────────────
const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Home', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? '#111827' : 'none'} stroke={a ? '#111827' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'staff', label: 'Staff', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#111827' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'leads', label: 'Leads', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#111827' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg> },
  { id: 'analytics', label: 'Stats', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#111827' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { id: 'settings', label: 'More', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#111827' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
]

export default function BusinessCardDashboard() {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const companyBranding = { logo: 'SD', companyName: 'Small Digital' }
  const [profiles, setProfiles] = useState<ProfileResponse[]>([])
  const [selectedProfile, setSelectedProfile] = useState<ProfileResponse | null>(null)
  const [orgSlug, setOrgSlug] = useState('')
  const [profileStats, setProfileStats] = useState<ProfileStatsResponse[]>([])

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (!token) { window.location.href = '/login'; return }
    const slug = localStorage.getItem('orgSlug') ?? ''
    setOrgSlug(slug)
    if (!slug) return
    getAllProfiles(slug).then(setProfiles).catch(console.error)
    getProfileStats(slug).then(setProfileStats).catch(console.error)
  }, [])

  const navigate = (id: string) => { setCurrentSection(id as Section); setSidebarOpen(false) }

  const sidebarNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: null },
    { id: 'staff', label: 'Staff Members', icon: <Users size={15} /> },
    { id: 'leads', label: 'Leads', icon: <UserCheck size={15} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={15} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={15} /> },
  ]

  return (
    <>
      <style>{STYLES}</style>
      <div className="db-root">
        <header className="db-header">
          <div className="db-header-left">
            <button className="db-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="db-logo">{companyBranding.logo}</div>
            <span className="db-company-name">{companyBranding.companyName}</span>
          </div>
          <div className="db-header-right">Admin Dashboard</div>
        </header>

        <div className="db-layout">
          <div className={`db-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

          <aside className={`db-sidebar ${sidebarOpen ? '' : 'closed'}`}>
            <nav className="db-nav">
              {sidebarNavItems.map(item => (
                <button key={item.id} className={`db-nav-item ${currentSection === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}>
                  {item.icon} {item.label}
                </button>
              ))}
              <div className="db-nav-divider" />
              <button className="db-nav-item danger" onClick={() => {
                ['jwtToken', 'isLoggedIn', 'userEmail', 'orgSlug'].forEach(k => localStorage.removeItem(k))
                window.location.href = '/login'
              }}>
                <LogOut size={15} /> Logout
              </button>
            </nav>
          </aside>

          <main className="db-main">
            {currentSection === 'dashboard' && (
              <DashboardSection profiles={profiles} profileStats={profileStats}
                onViewProfile={(p) => { setSelectedProfile(p); setCurrentSection('public-profile') }}
                onAddStaff={() => setCurrentSection('staff')} />
            )}
            {currentSection === 'staff' && (
              <StaffSection profiles={profiles} setProfiles={setProfiles} orgSlug={orgSlug} profileStats={profileStats}
                onViewProfile={(p) => { setSelectedProfile(p); setCurrentSection('public-profile') }} />
            )}
            {currentSection === 'leads' && <LeadsSection orgSlug={orgSlug} />}
            {currentSection === 'analytics' && <AnalyticsSection profiles={profiles} profileStats={profileStats} />}
            {currentSection === 'settings' && <SettingsSection />}
            {currentSection === 'public-profile' && selectedProfile && (
              <PublicProfileSection profile={selectedProfile} onBack={() => setCurrentSection('staff')} />
            )}
          </main>
        </div>

        {/* Mobile bottom nav */}
        <nav className="db-bottom-nav">
          <div className="db-bottom-nav-inner">
            {BOTTOM_NAV.map(item => {
              const isActive = currentSection === item.id || (currentSection === 'public-profile' && item.id === 'staff')
              return (
                <button key={item.id} className={`db-bottom-btn ${isActive ? 'active' : ''}`} onClick={() => navigate(item.id)}>
                  {item.icon(isActive)}
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}

// ─── LEADS SECTION ─────────────────────────────────────────────────────────────

function LeadsSection({ orgSlug }: { orgSlug: string }) {
  const [leads, setLeads] = useState<LeadResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<LeadStatus | 'ALL'>('ALL')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{ status: LeadStatus; tags: string; adminNotes: string }>({ status: 'NEW', tags: '', adminNotes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!orgSlug) return
    setLoading(true)
    getLeads(orgSlug).then(setLeads).catch(console.error).finally(() => setLoading(false))
  }, [orgSlug])

  const filtered = activeFilter === 'ALL' ? leads : leads.filter(l => l.status === activeFilter)
  const counts: Record<string, number> = {
    ALL: leads.length,
    NEW: leads.filter(l => l.status === 'NEW').length,
    CONTACTED: leads.filter(l => l.status === 'CONTACTED').length,
    QUALIFIED: leads.filter(l => l.status === 'QUALIFIED').length,
    CLOSED: leads.filter(l => l.status === 'CLOSED').length,
  }

  const handleExpand = (lead: LeadResponse) => {
    if (expandedId === lead.id) { setExpandedId(null); setEditingId(null); return }
    setExpandedId(lead.id); setEditingId(null)
  }

  const handleEdit = (lead: LeadResponse) => {
    setEditingId(lead.id)
    setEditForm({ status: lead.status, tags: lead.tags ?? '', adminNotes: lead.adminNotes ?? '' })
  }

  const handleSave = async (leadId: number) => {
    setSaving(true)
    try {
      const updated = await updateLead(orgSlug, leadId, editForm)
      setLeads(leads.map(l => l.id === leadId ? updated : l))
      setEditingId(null)
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  const handleDelete = async (leadId: number) => {
    if (!confirm('Delete this lead?')) return
    try {
      await deleteLead(orgSlug, leadId)
      setLeads(leads.filter(l => l.id !== leadId))
      if (expandedId === leadId) setExpandedId(null)
    } catch (e) { console.error(e) }
  }

  const formatDate = (iso: string) => !iso ? '' : new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Leads</h2>
        <p className="section-sub">People who submitted their info through your profile cards</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Leads', value: counts.ALL },
          { label: 'New', value: counts.NEW },
          { label: 'Qualified', value: counts.QUALIFIED },
          { label: 'Closed', value: counts.CLOSED },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <p className="stat-label">{s.label}</p>
            <p className={`stat-value ${i === 0 ? 'accent' : ''}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="leads-filters">
        {(['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'] as const).map(f => (
          <button key={f} className={`filter-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
            {f} {counts[f] > 0 && <span style={{ opacity: 0.6, marginLeft: 3 }}>({counts[f]})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">Loading leads...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No leads yet — share your profile card links to start collecting!</div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {filtered.map(lead => (
            <div key={lead.id} className="lead-card" style={{ flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.875rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <div className="lead-avatar">{initials(lead.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="lead-name">{lead.name}</p>
                    {lead.email && <p className="lead-contact"><FaEnvelope size={10} /> {lead.email}</p>}
                    {lead.phoneNumber && <p className="lead-contact"><FaPhone size={10} /> {lead.phoneNumber}</p>}
                    {lead.note && <p className="lead-note">"{lead.note}"</p>}
                    <p className="lead-source">via {lead.profileName}'s card · {formatDate(lead.createdAt)}</p>
                  </div>
                </div>
                <div className="lead-actions">
                  <span className={`lead-status-badge ${lead.status}`}>{lead.status}</span>
                  <button className="btn-view" onClick={() => handleExpand(lead)}>{expandedId === lead.id ? 'Close' : 'Manage'}</button>
                  <button className="btn-delete" onClick={() => handleDelete(lead.id)}>Delete</button>
                </div>
              </div>

              {expandedId === lead.id && (
                <div className="lead-expand-panel">
                  {editingId === lead.id ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                        <div>
                          <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.35rem' }}>Status</p>
                          <select className="form-select" value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value as LeadStatus }))}>
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.35rem' }}>Tags</p>
                          <input className="form-input" placeholder="e.g. hot, client" value={editForm.tags} onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.35rem' }}>Notes</p>
                          <textarea className="form-textarea" placeholder="Internal notes..." rows={2} value={editForm.adminNotes} onChange={e => setEditForm(f => ({ ...f, adminNotes: e.target.value }))} style={{ gridColumn: 'unset' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.78rem' }} onClick={() => handleSave(lead.id)} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                        <button className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
                        <div>
                          <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.25rem' }}>Status</p>
                          <span className={`lead-status-badge ${lead.status}`}>{lead.status}</span>
                        </div>
                        {lead.tags && (
                          <div>
                            <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.25rem' }}>Tags</p>
                            <p style={{ fontSize: '0.78rem', color: '#6366f1' }}>{lead.tags}</p>
                          </div>
                        )}
                        {lead.adminNotes && (
                          <div style={{ flex: 1, minWidth: 160 }}>
                            <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.25rem' }}>Notes</p>
                            <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.6 }}>{lead.adminNotes}</p>
                          </div>
                        )}
                      </div>
                      <button className="btn-view" style={{ alignSelf: 'flex-start' }} onClick={() => handleEdit(lead)}>Edit Lead</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── DASHBOARD SECTION ─────────────────────────────────────────────────────────

function DashboardSection({ profiles, profileStats, onViewProfile, onAddStaff }: {
  profiles: ProfileResponse[], profileStats: ProfileStatsResponse[],
  onViewProfile: (p: ProfileResponse) => void, onAddStaff: () => void
}) {
  const totalViews = profileStats.reduce((sum, s) => sum + s.viewCount, 0)
  const totalLeads = profileStats.reduce((sum, s) => sum + s.leadCount, 0)

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Welcome Back 👋</h2>
        <p className="section-sub">Manage your team's digital business cards and track engagement</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Staff', value: profiles.length.toString() },
          { label: 'Total Views', value: totalViews.toString() },
          { label: 'Total Leads', value: totalLeads.toString() },
          { label: 'Plan', value: 'Premium', accent: true },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <p className="stat-label">{s.label}</p>
            <p className={`stat-value ${s.accent ? 'accent' : ''}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <p className="sec-label" style={{ marginTop: 0 }}>Quick Actions</p>
      <div className="actions-grid">
        <button className="quick-btn" onClick={onAddStaff}><Plus size={14} /> Add Staff Member</button>
        <button className="quick-btn ghost"><FaEnvelope size={13} /> Send Invites</button>
        <button className="quick-btn ghost"><FaGlobe size={13} /> View Public Page</button>
      </div>

      <p className="sec-label">Staff Members</p>
      {profiles.length === 0 ? (
        <div className="empty-state">No staff members yet — add your first one!</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
          {profiles.map((p) => {
            const stats = profileStats.find(s => s.profileId === p.id)
            return (
              <div key={p.id} className="staff-card" style={{ flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                  <div className="staff-avatar">{p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                  <div><p className="staff-name">{p.name}</p><p className="staff-role">{p.role}</p></div>
                </div>
                {stats && (
                  <div className="staff-stats">
                    <span className="staff-stat-chip views">👁 {stats.viewCount}</span>
                    <span className="staff-stat-chip leads">👤 {stats.leadCount}</span>
                  </div>
                )}
                <button className="btn-view" onClick={() => onViewProfile(p)} style={{ width: '100%', marginTop: '0.65rem' }}>View Profile →</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── STAFF SECTION ─────────────────────────────────────────────────────────────

function StaffSection({ profiles, setProfiles, orgSlug, onViewProfile, profileStats }: {
  profiles: ProfileResponse[], setProfiles: (p: ProfileResponse[]) => void,
  orgSlug: string, onViewProfile: (p: ProfileResponse) => void,
  profileStats: ProfileStatsResponse[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const empty = { name: '', role: '', about: '', email: '', phoneNumber: '', linkedinUrl: '', instagramUrl: '', twitterUrl: '', tiktokUrl: '', youtubeUrl: '', whatsappUrl: '', websiteUrl: '', profilePictureUrl: '' }
  const [form, setForm] = useState(empty)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.name || !form.role) { setFormError('Name and role are required'); return }
    setIsSubmitting(true); setFormError('')
    try {
      const p = await createProfile(orgSlug, form)
      setProfiles([...profiles, p]); setShowForm(false); setForm(empty)
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Failed to add member')
    } finally { setIsSubmitting(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this profile?')) return
    try {
      await deleteProfile(orgSlug, id); setProfiles(profiles.filter(p => p.id !== id))
    } catch (err: any) { alert(err?.response?.data?.message || 'Failed to delete') }
  }

  const socialTags = (p: ProfileResponse) =>
    [p.linkedinUrl && 'LinkedIn', p.instagramUrl && 'Instagram', p.twitterUrl && 'Twitter',
     p.tiktokUrl && 'TikTok', p.youtubeUrl && 'YouTube', p.websiteUrl && 'Website'].filter(Boolean)

  return (
    <div>
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Staff Members</h2>
          <p className="section-sub">Manage your team and their digital business cards</p>
        </div>
        <button className="btn-add-staff" onClick={() => setShowForm(!showForm)}>
          <Plus size={15} /> Add Staff
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <p className="form-title">Add New Staff Member</p>
          {formError && <p className="form-error">{formError}</p>}
          <div className="form-grid">
            {[
              { name: 'name', placeholder: 'Full Name *' },
              { name: 'role', placeholder: 'Role / Title *' },
              { name: 'email', placeholder: 'Email Address' },
              { name: 'phoneNumber', placeholder: 'Phone Number' },
              { name: 'linkedinUrl', placeholder: 'LinkedIn URL' },
              { name: 'instagramUrl', placeholder: 'Instagram URL' },
              { name: 'twitterUrl', placeholder: 'Twitter URL' },
              { name: 'tiktokUrl', placeholder: 'TikTok URL' },
              { name: 'youtubeUrl', placeholder: 'YouTube URL' },
              { name: 'whatsappUrl', placeholder: 'WhatsApp URL' },
              { name: 'websiteUrl', placeholder: 'Website URL' },
              { name: 'profilePictureUrl', placeholder: 'Profile Picture URL' },
            ].map(f => (
              <input key={f.name} name={f.name} placeholder={f.placeholder}
                value={(form as any)[f.name]} onChange={handleChange} className="form-input" />
            ))}
            <textarea name="about" placeholder="About (short bio)" value={form.about}
              onChange={handleChange} rows={3} className="form-textarea" />
          </div>
          <div className="form-btns">
            <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="empty-state">No staff members yet. Add your first one!</div>
      ) : (
        <div className="staff-grid">
          {profiles.map((p) => {
            const stats = profileStats.find(s => s.profileId === p.id)
            return (
              <div key={p.id} className="staff-card">
                <div style={{ display: 'flex', gap: '0.875rem', flex: 1, minWidth: 0 }}>
                  {p.profilePictureUrl ? (
                    <img src={p.profilePictureUrl} alt={p.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #e5e7eb' }} />
                  ) : (
                    <div className="staff-avatar">{p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="staff-name">{p.name}</p>
                    <p className="staff-role">{p.role}</p>
                    {p.about && <p className="staff-about">{p.about}</p>}
                    <div className="staff-meta">
                      {p.email && <span className="staff-meta-item"><FaEnvelope size={10} /> {p.email}</span>}
                      {p.phoneNumber && <span className="staff-meta-item"><FaPhone size={10} /> {p.phoneNumber}</span>}
                    </div>
                    {socialTags(p).length > 0 && (
                      <div className="staff-socials">{socialTags(p).map(tag => <span key={tag as string} className="staff-social-tag">{tag}</span>)}</div>
                    )}
                    {stats && (
                      <div className="staff-stats">
                        <span className="staff-stat-chip views">👁 {stats.viewCount} views</span>
                        <span className="staff-stat-chip leads">👤 {stats.leadCount} leads</span>
                        <span className="staff-stat-chip conversion">📈 {stats.conversionRate}%</span>
                      </div>
                    )}
                    <div className="staff-link-row">
                      <span className="staff-link-text">/public/{p.organizationSlug}/{p.slug}</span>
                      <button className="staff-copy-btn" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/public/${p.organizationSlug}/${p.slug}`)}>
                        <FaCopy size={10} style={{ display: 'inline', marginRight: 3 }} /> Copy
                      </button>
                    </div>
                  </div>
                </div>
                <div className="staff-actions">
                  <button className="btn-view" onClick={() => onViewProfile(p)}>View</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── ANALYTICS SECTION ─────────────────────────────────────────────────────────

function AnalyticsSection({ profiles, profileStats }: { profiles: ProfileResponse[], profileStats: ProfileStatsResponse[] }) {
  const totalViews = profileStats.reduce((sum, s) => sum + s.viewCount, 0)
  const totalLeads = profileStats.reduce((sum, s) => sum + s.leadCount, 0)
  const totalClosed = profileStats.reduce((sum, s) => sum + (s.leadCount > 0 ? Math.round(s.leadCount * s.conversionRate / 100) : 0), 0)
  const avgConversion = profileStats.length > 0
    ? (profileStats.reduce((sum, s) => sum + s.conversionRate, 0) / profileStats.length).toFixed(1) : '0'
  const maxVal = Math.max(...profileStats.map(s => s.viewCount), 1)

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Analytics</h2>
        <p className="section-sub">Real performance data across all your profile cards</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Views', value: totalViews.toString() },
          { label: 'Total Leads', value: totalLeads.toString() },
          { label: 'Closed Deals', value: totalClosed.toString() },
          { label: 'Avg Conversion', value: `${avgConversion}%`, accent: true },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <p className="stat-label">{s.label}</p>
            <p className={`stat-value ${s.accent ? 'accent' : ''}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {profileStats.length > 0 && (
        <div className="chart-wrap">
          <p className="sec-label" style={{ marginTop: 0 }}>Profile Performance Chart</p>
          <div className="chart-legend">
            <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#6366f1' }} /> Views</span>
            <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#16a34a' }} /> Leads</span>
            <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#ef4444' }} /> Closed</span>
          </div>
          <div className="chart-bars">
            {profileStats.map((s) => {
              const viewH = Math.max((s.viewCount / maxVal) * 140, 4)
              const leadH = Math.max((s.leadCount / maxVal) * 140, 4)
              const closedCount = s.leadCount > 0 ? Math.round(s.leadCount * s.conversionRate / 100) : 0
              const closedH = Math.max((closedCount / maxVal) * 140, closedCount > 0 ? 4 : 0)
              return (
                <div key={s.profileId} className="chart-bar-group">
                  <div className="chart-bar-set">
                    <div title={`${s.viewCount} views`} className="chart-bar" style={{ width: 16, height: viewH, background: '#6366f1' }} />
                    <div title={`${s.leadCount} leads`} className="chart-bar" style={{ width: 16, height: leadH, background: '#16a34a' }} />
                    <div title={`${closedCount} closed`} className="chart-bar" style={{ width: 16, height: closedH, background: '#ef4444' }} />
                  </div>
                  <span className="chart-bar-label">{s.profileName.split(' ')[0]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="g-card">
        <p className="sec-label" style={{ marginTop: 0 }}>Staff Performance</p>
        {profileStats.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No data yet — share your profile card links to start tracking!</p>
        ) : (
          <div className="perf-table">
            <div className="perf-row">
              <span className="perf-header">Profile</span>
              <span className="perf-header" style={{ textAlign: 'right' }}>Views</span>
              <span className="perf-header" style={{ textAlign: 'right' }}>Leads</span>
              <span className="perf-header" style={{ textAlign: 'right' }}>Closed</span>
              <span className="perf-header" style={{ textAlign: 'right' }}>Conv %</span>
            </div>
            {profileStats.map((s) => {
              const closed = s.leadCount > 0 ? Math.round(s.leadCount * s.conversionRate / 100) : 0
              return (
                <div key={s.profileId} className="perf-row">
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{s.profileName}</p>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.role}</p>
                  </div>
                  <span className="perf-val">{s.viewCount}</span>
                  <span className="perf-val green">{s.leadCount}</span>
                  <span className="perf-val" style={{ color: '#ef4444' }}>{closed}</span>
                  <span className="perf-val yellow">{s.conversionRate}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PUBLIC PROFILE SECTION ────────────────────────────────────────────────────

function PublicProfileSection({ profile, onBack }: { profile: ProfileResponse, onBack: () => void }) {
  const [copied, setCopied] = useState(false)
  const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}/public/${profile.organizationSlug}/${profile.slug}` : ''
  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div>
      <button className="btn-back" onClick={onBack}>← Back to Staff</button>
      <div className="section-header">
        <h2 className="section-title">Profile Preview</h2>
        <p className="section-sub">This is how the public card looks</p>
      </div>
      <div className="pub-profile-wrap">
        <div className="pub-hero">
          <div className="pub-org-badge">{profile.organizationName}</div>
          <div className="pub-identity">
            {profile.profilePictureUrl ? (
              <img src={profile.profilePictureUrl} alt={profile.name} style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
            ) : (
              <div className="pub-avatar">{initials}</div>
            )}
            <div>
              <p className="pub-name">{profile.name}</p>
              <p className="pub-role">{profile.role}</p>
            </div>
          </div>
          {(profile.email || profile.phoneNumber) && (
            <div className="pub-chips">
              {profile.email && <a href={`mailto:${profile.email}`} className="pub-chip"><FaEnvelope size={10} /> {profile.email}</a>}
              {profile.phoneNumber && <a href={`tel:${profile.phoneNumber}`} className="pub-chip"><FaPhone size={10} /> {profile.phoneNumber}</a>}
            </div>
          )}
        </div>
        <div className="pub-body">
          {profile.about && <p className="pub-about">{profile.about}</p>}
          {(profile.linkedinUrl || profile.instagramUrl || profile.twitterUrl || profile.tiktokUrl || profile.youtubeUrl || profile.websiteUrl) && (
            <>
              <p className="sec-label" style={{ marginTop: 0 }}>Connect</p>
              <div className="pub-socials">
                {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="pub-social"><FaLinkedin size={13} color="#0A66C2" /> LinkedIn</a>}
                {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="pub-social"><FaInstagram size={13} color="#E1306C" /> Instagram</a>}
                {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="pub-social"><FaXTwitter size={13} color="#111827" /> Twitter</a>}
                {profile.tiktokUrl && <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="pub-social"><FaTiktok size={13} color="#111827" /> TikTok</a>}
                {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="pub-social"><FaYoutube size={13} color="#FF0000" /> YouTube</a>}
                {profile.websiteUrl && <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="pub-social"><FaGlobe size={13} /> Website</a>}
              </div>
            </>
          )}
          <p className="sec-label">Actions</p>
          <div className="pub-actions">
            <a href={`mailto:?subject=Contact ${profile.name}&body=Here is ${profile.name}'s digital card: ${pageUrl}`} className="pub-action primary">
              <FaEnvelope size={14} /> Save Contact
            </a>
            {profile.whatsappUrl ? (
              <a href={profile.whatsappUrl} target="_blank" rel="noreferrer" className="pub-action wa"><FaWhatsapp size={15} /> WhatsApp</a>
            ) : (
              <a href={`https://wa.me/?text=Check out ${profile.name}'s digital card: ${pageUrl}`} target="_blank" rel="noreferrer" className="pub-action wa"><FaWhatsapp size={15} /> Share via WhatsApp</a>
            )}
            <button onClick={() => { navigator.clipboard.writeText(pageUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="pub-action ghost">
              <FaLink size={13} /> {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className="pub-powered">Powered by <span>Small Digital</span></p>
        </div>
      </div>
    </div>
  )
}

// ─── SETTINGS SECTION ──────────────────────────────────────────────────────────

function SettingsSection() {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Settings</h2>
        <p className="section-sub">Manage your account and preferences</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: 560 }}>
        <div className="g-card">
          <p className="sec-label" style={{ marginTop: 0 }}>Notifications</p>
          <div className="settings-row">
            <div><p className="settings-label">Email Notifications</p><p className="settings-sub">Receive updates about your staff cards</p></div>
            <button className="toggle" />
          </div>
          <div className="settings-row">
            <div><p className="settings-label">Analytics Emails</p><p className="settings-sub">Weekly performance reports</p></div>
            <button className="toggle" />
          </div>
        </div>
        <div className="g-card">
          <p className="sec-label" style={{ marginTop: 0 }}>Subscription</p>
          <div className="settings-row">
            <div>
              <p className="settings-label">Current Plan: <span style={{ color: '#6366f1', fontWeight: 700 }}>Premium</span></p>
              <p className="settings-sub">₦9,900/month · Next billing: April 22, 2026</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary">Manage Subscription</button>
            <button className="btn-danger">Downgrade Plan</button>
          </div>
        </div>
        <div className="danger-zone">
          <p className="danger-title">Danger Zone</p>
          <button className="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  )
}