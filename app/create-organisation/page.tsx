'use client'

import { useState, useRef } from 'react'
import { Building2, Link, Mail, Lock, Eye, EyeOff, CheckCircle, Upload, X } from 'lucide-react'
import { createOrganization } from '@/lib/api'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .co-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: #f3f4f6;
    font-family: 'DM Sans', sans-serif;
  }

  .co-wrapper {
    width: 100%;
    max-width: 420px;
    animation: fadeUp 0.5s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .co-brand {
    text-align: center;
    margin-bottom: 2rem;
  }

  .co-logo {
    width: 64px; height: 64px;
    border-radius: 18px;
    background: #111827;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700;
    color: white;
    margin: 0 auto 1rem;
  }

  .co-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem; font-weight: 700;
    color: #111827;
    margin-bottom: 0.35rem;
  }

  .co-sub {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  .co-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }

  .co-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    font-size: 0.82rem;
    color: #ef4444;
    margin-bottom: 1.25rem;
  }

  .co-field { margin-bottom: 1.25rem; }

  .co-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .co-field-wrap { position: relative; }

  .co-field-icon {
    position: absolute;
    left: 1rem; top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
    display: flex; align-items: center;
  }

  .co-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.75rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    color: #111827;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .co-input::placeholder { color: #d1d5db; }
  .co-input:focus { border-color: #6366f1; background: #eef2ff; }
  .co-input.pr { padding-right: 3rem; }

  .co-hint {
    margin-top: 0.4rem;
    font-size: 0.72rem;
    color: #9ca3af;
  }
  .co-hint span { color: #6366f1; font-weight: 500; }

  .co-eye {
    position: absolute;
    right: 1rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: #9ca3af; cursor: pointer; padding: 0;
    transition: color 0.2s;
    display: flex; align-items: center;
  }
  .co-eye:hover { color: #374151; }

  .co-divider { height: 1px; background: #f3f4f6; margin: 0.25rem 0 1.25rem; }

  /* LOGO UPLOAD */
  .co-upload-zone {
    width: 100%;
    padding: 1.5rem 1rem;
    border: 1.5px dashed #e5e7eb;
    border-radius: 12px;
    background: #f9fafb;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  }
  .co-upload-zone:hover { border-color: #111827; background: #f3f4f6; }

  .co-upload-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af;
  }

  .co-upload-text { font-size: 0.82rem; color: #6b7280; font-weight: 500; }
  .co-upload-hint { font-size: 0.72rem; color: #d1d5db; }

  .co-preview-row {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }

  .co-preview-img {
    width: 44px; height: 44px;
    border-radius: 8px;
    object-fit: contain;
    border: 1px solid #e5e7eb;
    background: white;
    padding: 4px;
    flex-shrink: 0;
  }

  .co-preview-name {
    flex: 1; font-size: 0.82rem; color: #374151;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .co-remove-btn {
    background: none; border: none; cursor: pointer;
    color: #9ca3af; transition: color 0.2s;
    display: flex; align-items: center; padding: 0;
  }
  .co-remove-btn:hover { color: #ef4444; }

  /* SUBMIT */
  .co-submit {
    width: 100%;
    padding: 0.9rem;
    border-radius: 14px;
    background: #111827;
    color: white; border: none; cursor: pointer;
    font-size: 0.9rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    margin-top: 0.25rem;
  }
  .co-submit:hover { background: #1f2937; transform: translateY(-2px); }
  .co-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .co-signin {
    text-align: center;
    margin-top: 1.25rem;
    font-size: 0.82rem;
    color: #9ca3af;
  }
  .co-signin a { color: #6366f1; font-weight: 500; text-decoration: none; }
  .co-signin a:hover { color: #4f46e5; }

  /* SUCCESS */
  .co-success-page {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1rem;
    background: #f3f4f6;
    font-family: 'DM Sans', sans-serif;
  }

  .co-success-wrap {
    width: 100%; max-width: 420px;
    text-align: center;
    animation: fadeUp 0.5s ease forwards;
  }

  .co-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem;
  }

  .co-success-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem; font-weight: 700;
    color: #111827; margin-bottom: 0.5rem;
  }

  .co-success-sub {
    font-size: 0.875rem; color: #9ca3af;
    margin-bottom: 1.5rem; line-height: 1.6;
  }

  .co-success-details {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.25rem;
    text-align: left;
    margin-bottom: 1.5rem;
    display: flex; flex-direction: column; gap: 0.6rem;
  }

  .co-detail-row {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.82rem;
  }
  .co-detail-label { color: #9ca3af; }
  .co-detail-value { font-weight: 600; color: #111827; }
  .co-detail-value.accent { color: #6366f1; }

  .co-goto-btn {
    width: 100%;
    padding: 0.9rem;
    border-radius: 14px;
    background: #111827;
    color: white; border: none; cursor: pointer;
    font-size: 0.9rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .co-goto-btn:hover { background: #1f2937; transform: translateY(-2px); }

  .co-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.68rem;
    color: #d1d5db;
    letter-spacing: 0.05em;
  }
  .co-footer span { color: #6366f1; font-weight: 600; }
`

export default function CreateOrganizationPage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !slug || !adminEmail || !adminPassword) { setError('All fields are required'); return }
    if (!logoFile) { setError('Please upload an organisation logo'); return }
    setIsLoading(true)
    try {
      await createOrganization({ name, slug, adminEmail, adminPassword }, logoFile)
      setSuccess(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create organisation')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="co-success-page">
          <div className="co-success-wrap">
            <div className="co-success-icon">
              <CheckCircle size={32} color="#16a34a" />
            </div>
            <h1 className="co-success-title">Organisation Created!</h1>
            <p className="co-success-sub">
              <strong style={{ color: '#111827' }}>{name}</strong> has been set up successfully. You can now sign in with your admin credentials.
            </p>
            <div className="co-success-details">
              <div className="co-detail-row">
                <span className="co-detail-label">Organisation</span>
                <span className="co-detail-value">{name}</span>
              </div>
              <div className="co-detail-row">
                <span className="co-detail-label">Slug</span>
                <span className="co-detail-value accent">/{slug}</span>
              </div>
              <div className="co-detail-row">
                <span className="co-detail-label">Admin email</span>
                <span className="co-detail-value">{adminEmail}</span>
              </div>
            </div>
            <button className="co-goto-btn" onClick={() => window.location.href = '/'}>
              Go to Sign In
            </button>
            <p className="co-footer">Powered by <span>Digital Cards</span></p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="co-page">
        <div className="co-wrapper">

          <div className="co-brand">
            <div className="co-logo">DC</div>
            <h1 className="co-title">Create Organisation</h1>
            <p className="co-sub">Set up your company on Digital Cards</p>
          </div>

          <div className="co-card">
            {error && <div className="co-error">{error}</div>}

            <form onSubmit={handleSubmit}>

              {/* Org Name */}
              <div className="co-field">
                <label className="co-label">Organisation Name</label>
                <div className="co-field-wrap">
                  <span className="co-field-icon"><Building2 size={15} /></span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Acme Corp"
                    className="co-input"
                  />
                </div>
              </div>

              {/* Slug */}
              <div className="co-field">
                <label className="co-label">Organisation Slug</label>
                <div className="co-field-wrap">
                  <span className="co-field-icon"><Link size={15} /></span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="acme-corp"
                    className="co-input"
                  />
                </div>
                {slug && (
                  <p className="co-hint">Cards will be at <span>digitalcards.app/{slug}/...</span></p>
                )}
              </div>

              <div className="co-divider" />

              {/* Logo Upload */}
              <div className="co-field">
                <label className="co-label">Organisation Logo</label>
                {logoPreview ? (
                  <div className="co-preview-row">
                    <img src={logoPreview} alt="Logo preview" className="co-preview-img" />
                    <span className="co-preview-name">{logoFile?.name}</span>
                    <button type="button" className="co-remove-btn" onClick={removeLogo}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button type="button" className="co-upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <div className="co-upload-icon"><Upload size={18} /></div>
                    <p className="co-upload-text">Click to upload logo</p>
                    <p className="co-upload-hint">PNG, JPG, SVG up to 2MB</p>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>

              <div className="co-divider" />

              {/* Admin Email */}
              <div className="co-field">
                <label className="co-label">Admin Email</label>
                <div className="co-field-wrap">
                  <span className="co-field-icon"><Mail size={15} /></span>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@acme.com"
                    className="co-input"
                  />
                </div>
              </div>

              {/* Admin Password */}
              <div className="co-field">
                <label className="co-label">Admin Password</label>
                <div className="co-field-wrap">
                  <span className="co-field-icon"><Lock size={15} /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="co-input pr"
                  />
                  <button type="button" className="co-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="co-submit">
                {isLoading ? 'Creating...' : 'Create Organisation'}
              </button>
            </form>

            <p className="co-signin">
              Already have an account? <a href="/">Sign in</a>
            </p>
          </div>

          <p className="co-footer">Powered by <span>Digital Cards</span></p>
        </div>
      </div>
    </>
  )
}