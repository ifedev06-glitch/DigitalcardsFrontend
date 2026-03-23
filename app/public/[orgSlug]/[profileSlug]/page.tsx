'use client'

import { use, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok, FaYoutube, FaWhatsapp, FaGlobe, FaEnvelope, FaPhone, FaLink, FaFileArrowDown } from 'react-icons/fa6'
import { getPublicProfile, submitLead, ProfileResponse } from '@/lib/api'

type Params = Promise<{ orgSlug: string; profileSlug: string }>

export default function PublicProfilePage({ params }: { params: Params }) {
  const { orgSlug, profileSlug } = use(params)

  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', note: '' })
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadError, setLeadError] = useState('')

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    color: '#111827',
    fontSize: '0.82rem',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'all 0.2s',
  }

  const inputFocusStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: 12,
    border: '1px solid #6366f1',
    background: '#eef2ff',
    color: '#111827',
    fontSize: '0.82rem',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'all 0.2s',
  }

  const handleLeadSubmit = async () => {
    if (!leadForm.name.trim()) {
      setLeadError('Name is required')
      return
    }
    setLeadError('')
    setLeadSubmitting(true)
    try {
      await submitLead(orgSlug, profileSlug, {
        name: leadForm.name,
        email: leadForm.email || undefined,
        phoneNumber: leadForm.phone || undefined,
        note: leadForm.note || undefined,
      })
      setLeadSubmitted(true)
    } catch {
      setLeadError('Something went wrong. Please try again.')
    } finally {
      setLeadSubmitting(false)
    }
  }

  useEffect(() => {
    getPublicProfile(orgSlug, profileSlug)
      .then(setProfile)
      .catch(() => setError('Profile not found'))
      .finally(() => setLoading(false))
  }, [orgSlug, profileSlug])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#6366f1' }} className="animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#111827', fontSize: '1.5rem', fontWeight: 700 }}>Profile Not Found</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>This profile does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: #f3f4f6;
          font-family: 'DM Sans', sans-serif;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-section {
          background: #f9fafb;
          border-bottom: 1px solid #f3f4f6;
          padding: 2rem 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .logo-wrap {
          width: 110px;
          height: 110px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 10px;
        }

        .logo-initials {
          font-size: 2rem;
          font-weight: 700;
          color: #6366f1;
          font-family: 'DM Sans', sans-serif;
        }

        .org-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          line-height: 1.2;
          margin-bottom: 0.3rem;
        }

        .profile-sub {
          font-size: 0.78rem;
          font-weight: 500;
          color: #9ca3af;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .body { padding: 1.5rem; }

        .about {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.75;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #f3f4f6;
          margin-bottom: 1.25rem;
          text-align: center;
        }

        .section-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.65rem;
        }

        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .contact-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 14px;
          font-size: 0.82rem;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid #f3f4f6;
          color: #374151;
          background: #f9fafb;
          transition: all 0.2s;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .contact-btn:hover {
          background: #f3f4f6;
          border-color: #e5e7eb;
          color: #111827;
          transform: translateY(-1px);
        }

        .contact-btn-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .contact-btn-text { display: flex; flex-direction: column; }
        .contact-btn-label { font-size: 0.68rem; color: #9ca3af; margin-bottom: 0.1rem; }
        .contact-btn-value { font-size: 0.82rem; color: #111827; font-weight: 500; }

        .socials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.65rem 0.5rem;
          border-radius: 12px;
          font-size: 0.78rem;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          color: #374151;
          background: #f9fafb;
          transition: all 0.2s;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .social-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #111827;
          transform: translateY(-2px);
        }

        .website-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.85rem;
          border-radius: 14px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid #e0e7ff;
          background: #eef2ff;
          color: #4f46e5;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 1.5rem;
        }

        .website-btn:hover {
          background: #e0e7ff;
          color: #3730a3;
          transform: translateY(-2px);
        }

        .actions { display: flex; flex-direction: column; gap: 0.6rem; }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.85rem;
          border-radius: 14px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
        }

        .action-primary {
          background: #111827;
          color: #ffffff;
        }
        .action-primary:hover { background: #1f2937; transform: translateY(-2px); }

        .action-ghost {
          background: #f9fafb;
          color: #6b7280;
          border: 1px solid #e5e7eb !important;
        }
        .action-ghost:hover { background: #f3f4f6; color: #111827; transform: translateY(-2px); }

        .divider {
          height: 1px;
          background: #f3f4f6;
          margin: 1.25rem 0;
        }

        .powered {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.68rem;
          color: #d1d5db;
          letter-spacing: 0.04em;
        }
        .powered span {
          color: #6366f1;
          font-weight: 600;
        }
      `}</style>

      <div className="page">
        <div className="card">

          {/* LOGO + ORG NAME SECTION */}
          <div className="logo-section">
            <div className="logo-wrap">
              {profile.organizationLogoUrl ? (
                <img src={profile.organizationLogoUrl} alt={profile.organizationName} />
              ) : (
                <span className="logo-initials">
                  {profile.organizationName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <h1 className="org-name">{profile.organizationName}</h1>
            <p className="profile-sub">{profile.name} · {profile.role}</p>
          </div>

          <div className="body">
            {profile.about && <p className="about">{profile.about}</p>}

            {/* CONTACT SECTION */}
            {(profile.email || profile.phoneNumber || profile.whatsappUrl) && (
              <>
                <p className="section-label">Contact</p>
                <div className="contact-list">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="contact-btn">
                      <div className="contact-btn-icon" style={{ background: '#eef2ff' }}>
                        <FaEnvelope size={14} color="#6366f1" />
                      </div>
                      <div className="contact-btn-text">
                        <span className="contact-btn-label">Email</span>
                        <span className="contact-btn-value">{profile.email}</span>
                      </div>
                    </a>
                  )}
                  {profile.phoneNumber && (
                    <a href={`tel:${profile.phoneNumber}`} className="contact-btn">
                      <div className="contact-btn-icon" style={{ background: '#f0fdf4' }}>
                        <FaPhone size={14} color="#16a34a" />
                      </div>
                      <div className="contact-btn-text">
                        <span className="contact-btn-label">Phone</span>
                        <span className="contact-btn-value">{profile.phoneNumber}</span>
                      </div>
                    </a>
                  )}
                  {profile.whatsappUrl && (
                    <a href={profile.whatsappUrl} target="_blank" rel="noreferrer" className="contact-btn">
                      <div className="contact-btn-icon" style={{ background: '#f0fdf4' }}>
                        <FaWhatsapp size={14} color="#16a34a" />
                      </div>
                      <div className="contact-btn-text">
                        <span className="contact-btn-label">WhatsApp</span>
                        <span className="contact-btn-value">Send a message</span>
                      </div>
                    </a>
                  )}
                </div>
              </>
            )}

            {/* WEBSITE BUTTON */}
            {profile.websiteUrl && (
              <>
                <p className="section-label">Website</p>
                <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="website-btn">
                  <FaGlobe size={15} /> Company Website
                </a>
              </>
            )}

            {/* SOCIALS SECTION */}
            {(profile.linkedinUrl || profile.instagramUrl || profile.twitterUrl || profile.tiktokUrl || profile.youtubeUrl) && (
              <>
                <p className="section-label">Socials</p>
                <div className="socials-grid">
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="social-btn">
                      <FaLinkedin size={15} color="#0A66C2" /> LinkedIn
                    </a>
                  )}
                  {profile.instagramUrl && (
                    <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="social-btn">
                      <FaInstagram size={15} color="#E1306C" /> Instagram
                    </a>
                  )}
                  {profile.twitterUrl && (
                    <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="social-btn">
                      <FaXTwitter size={15} color="#111827" /> Twitter
                    </a>
                  )}
                  {profile.tiktokUrl && (
                    <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="social-btn">
                      <FaTiktok size={15} color="#111827" /> TikTok
                    </a>
                  )}
                  {profile.youtubeUrl && (
                    <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="social-btn">
                      <FaYoutube size={15} color="#FF0000" /> YouTube
                    </a>
                  )}
                </div>
              </>
            )}

            <div className="divider" />

            {/* ACTIONS */}
            <div className="actions">
              <button onClick={() => window.print()} className="action-btn action-primary">
                <FaFileArrowDown size={15} /> Download Company Profile
              </button>
              <button onClick={handleCopyLink} className="action-btn action-ghost">
                <FaLink size={15} /> {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>

            {/* LEAD CAPTURE FORM */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6' }}>
              <p className="section-label">Get in touch</p>

              {leadSubmitted ? (
                <div style={{
                  background: '#eef2ff',
                  border: '1px solid #e0e7ff',
                  borderRadius: 14,
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#4f46e5', fontSize: '0.85rem', fontWeight: 500 }}>✓ Info received!</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: 4 }}>
                    {profile.name} will be in touch soon.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={leadForm.name}
                    onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={leadForm.email}
                    onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={leadForm.phone}
                    onChange={e => setLeadForm(p => ({ ...p, phone: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                  <textarea
                    placeholder="Message (optional)"
                    value={leadForm.note}
                    onChange={e => setLeadForm(p => ({ ...p, note: e.target.value }))}
                    rows={2}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                  {leadError && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 2 }}>{leadError}</p>
                  )}
                  <button
                    onClick={handleLeadSubmit}
                    disabled={leadSubmitting}
                    className="action-btn action-primary"
                    style={{ marginTop: '0.25rem', opacity: leadSubmitting ? 0.7 : 1 }}
                  >
                    {leadSubmitting ? <Loader2 size={15} className="animate-spin" /> : null}
                    {leadSubmitting ? 'Sending...' : 'Send Info'}
                  </button>
                </div>
              )}
            </div>

            <p className="powered">Powered by <span>Digital Cards</span></p>
          </div>
        </div>
      </div>
    </>
  )
}