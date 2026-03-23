'use client'

import { useState } from 'react'
import { Eye, EyeOff, Building2, User } from 'lucide-react'
import { FaEnvelope, FaLock } from 'react-icons/fa6'
import { adminLogin } from '@/lib/api'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: #f3f4f6;
    font-family: 'DM Sans', sans-serif;
  }

  .login-wrapper {
    width: 100%;
    max-width: 420px;
    animation: fadeUp 0.5s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .login-brand {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-logo {
    width: 64px; height: 64px;
    border-radius: 18px;
    background: #111827;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700;
    color: white;
    margin: 0 auto 1rem;
  }

  .login-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem; font-weight: 700;
    color: #111827;
    margin-bottom: 0.35rem;
  }

  .login-sub {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  .login-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }

  .login-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    font-size: 0.82rem;
    color: #ef4444;
    margin-bottom: 1.25rem;
  }

  .field { margin-bottom: 1.25rem; }

  .field-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .field-wrap { position: relative; }

  .field-icon {
    position: absolute;
    left: 1rem; top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
    display: flex; align-items: center;
  }

  .field-input {
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

  .field-input::placeholder { color: #d1d5db; }
  .field-input:focus {
    border-color: #6366f1;
    background: #eef2ff;
  }

  .field-input.pr { padding-right: 3rem; }

  .eye-btn {
    position: absolute;
    right: 1rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: #9ca3af;
    cursor: pointer; padding: 0;
    transition: color 0.2s;
    display: flex; align-items: center;
  }
  .eye-btn:hover { color: #374151; }

  .remember-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .remember-label {
    display: flex; align-items: center; gap: 0.5rem;
    cursor: pointer;
    font-size: 0.82rem;
    color: #6b7280;
  }

  .remember-checkbox {
    width: 16px; height: 16px;
    accent-color: #6366f1;
    cursor: pointer;
  }

  .forgot-link {
    font-size: 0.82rem;
    font-weight: 500;
    color: #6366f1;
    text-decoration: none;
    transition: color 0.2s;
  }
  .forgot-link:hover { color: #4f46e5; }

  .login-btn {
    width: 100%;
    padding: 0.9rem;
    border-radius: 14px;
    background: #111827;
    color: white; border: none; cursor: pointer;
    font-size: 0.9rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.02em;
    transition: all 0.2s;
  }
  .login-btn:hover { background: #1f2937; transform: translateY(-2px); }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .login-btn.loading {
    position: relative;
    color: transparent;
  }
  .login-btn.loading::after {
    content: '';
    position: absolute;
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

  .login-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1.5rem 0;
  }
  .login-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
  .login-divider-text { font-size: 0.72rem; color: #d1d5db; font-weight: 500; }

  .signup-link-btn {
    width: 100%;
    padding: 0.9rem;
    border-radius: 14px;
    background: #f9fafb;
    color: #374151;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    font-size: 0.875rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    text-align: center;
  }
  .signup-link-btn:hover { background: #f3f4f6; color: #111827; transform: translateY(-2px); }

  /* SIGNUP TYPE SCREEN */
  .signup-back {
    background: none; border: none; cursor: pointer;
    color: #6366f1; font-size: 0.82rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0; margin-bottom: 1.5rem;
    transition: color 0.2s;
  }
  .signup-back:hover { color: #4f46e5; }

  .signup-heading {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700;
    color: #111827; margin-bottom: 0.35rem;
  }

  .signup-sub {
    font-size: 0.82rem; color: #9ca3af;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .type-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .type-card {
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem 1rem;
    text-align: center;
    cursor: pointer;
    background: #f9fafb;
    transition: all 0.2s;
    display: flex; flex-direction: column;
    align-items: center; gap: 0.65rem;
  }

  .type-card:hover {
    border-color: #111827;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
    transform: translateY(-2px);
  }

  .type-card.selected {
    border-color: #111827;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  }

  .type-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: #111827;
    display: flex; align-items: center; justify-content: center;
    color: white;
  }

  .type-label {
    font-size: 0.875rem; font-weight: 600;
    color: #111827;
  }

  .type-desc {
    font-size: 0.72rem; color: #9ca3af;
    line-height: 1.5;
  }

  .coming-soon-notice {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    font-size: 0.78rem;
    color: #d97706;
    text-align: center;
    margin-top: 0.75rem;
    display: none;
  }
  .coming-soon-notice.visible { display: block; }

  .login-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.68rem;
    color: #d1d5db;
    letter-spacing: 0.05em;
  }
  .login-footer span {
    color: #6366f1;
    font-weight: 600;
  }
`

type Screen = 'login' | 'signup-type'

export default function LoginPage() {
  const [screen, setScreen] = useState<Screen>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }
    setIsLoading(true)
    try {
      const response = await adminLogin({ email, password })
      localStorage.setItem('jwtToken', response.token)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', response.email)
      localStorage.setItem('orgSlug', response.organizationSlug)
      window.location.href = '/admin'
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleIndividual = () => {
    setShowComingSoon(true)
  }

  const handleBusiness = () => {
    window.location.href = '/create-organisation'
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="login-page">
        <div className="login-wrapper">

          <div className="login-brand">
            <div className="login-logo">DC</div>
            <h1 className="login-title">Digital Cards</h1>
            <p className="login-sub">
              {screen === 'login' ? "Sign in to manage your team's business cards" : 'Create your account'}
            </p>
          </div>

          <div className="login-card">

            {/* ── LOGIN SCREEN ── */}
            {screen === 'login' && (
              <>
                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="field-label">Email Address</label>
                    <div className="field-wrap">
                      <span className="field-icon"><FaEnvelope size={14} /></span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="field" style={{ marginBottom: '1.5rem' }}>
                    <label className="field-label">Password</label>
                    <div className="field-wrap">
                      <span className="field-icon"><FaLock size={14} /></span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="field-input pr"
                      />
                      <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="remember-row">
                    <label className="remember-label">
                      <input type="checkbox" className="remember-checkbox" />
                      Remember me
                    </label>
                    <a href="#" className="forgot-link">Forgot password?</a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`login-btn ${isLoading ? 'loading' : ''}`}
                  >
                    {isLoading ? '' : 'Sign In'}
                  </button>
                </form>

                <div className="login-divider">
                  <div className="login-divider-line" />
                  <span className="login-divider-text">NEW HERE?</span>
                  <div className="login-divider-line" />
                </div>

                <button className="signup-link-btn" onClick={() => { setScreen('signup-type'); setShowComingSoon(false) }}>
                  Create an Account
                </button>
              </>
            )}

            {/* ── SIGNUP TYPE SCREEN ── */}
            {screen === 'signup-type' && (
              <>
                <button className="signup-back" onClick={() => { setScreen('login'); setShowComingSoon(false) }}>
                  ← Back to Sign In
                </button>

                <p className="signup-heading">How will you use Digital Cards?</p>
                <p className="signup-sub">Choose your account type to get started.</p>

                <div className="type-grid">
                  <div className="type-card" onClick={handleIndividual}>
                    <div className="type-icon">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="type-label">Individual</p>
                      <p className="type-desc">Just for you — your own personal digital card</p>
                    </div>
                  </div>

                  <div className="type-card" onClick={handleBusiness}>
                    <div className="type-icon">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="type-label">Business</p>
                      <p className="type-desc">For teams — manage cards for your whole organisation</p>
                    </div>
                  </div>
                </div>

                <div className={`coming-soon-notice ${showComingSoon ? 'visible' : ''}`}>
                  Individual accounts are coming soon! Try Business for now.
                </div>
              </>
            )}

          </div>

          <p className="login-footer">
            Protected by <span>Digital Cards</span> enterprise security
          </p>
        </div>
      </div>
    </>
  )
}