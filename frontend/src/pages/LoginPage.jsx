import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { trackLogin } from '../api';



if (!document.getElementById('mm-fonts')) {
  const l2 = document.createElement('link'); l2.id = 'mm-fonts'; l2.rel = 'stylesheet'
  l2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
  document.head.appendChild(l2)
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .mm-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #085041 0%, #1a9e75 55%, #5dcaa5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .mm-blob {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    pointer-events: none;
  }

  .mm-wrapper {
    width: 100%;
    max-width: 440px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .mm-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 2.5rem 2.25rem 2rem;
    width: 100%;
    box-shadow: 0 24px 60px rgba(8, 80, 65, 0.25);
  }

  .mm-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }

  .mm-logo {
    width: 68px;
    height: 68px;
    background: linear-gradient(135deg, #1a9e75 0%, #085041 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.125rem;
    box-shadow: 0 10px 28px rgba(26, 158, 117, 0.38);
    transition: transform 0.2s ease;
  }

  .mm-logo:hover { transform: scale(1.04); }

  .mm-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 5px;
    letter-spacing: -0.5px;
  }

  .mm-subtitle {
    font-size: 14px;
    color: #9ca3af;
    font-weight: 400;
  }

  .mm-group {
    margin-bottom: 1rem;
  }

  .mm-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .mm-label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .mm-forgot {
    font-size: 12px;
    color: #1a9e75;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    transition: color 0.15s;
  }

  .mm-forgot:hover { color: #085041; }

  .mm-input-wrap {
    position: relative;
  }

  .mm-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #d1d5db;
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .mm-input {
    width: 100%;
    height: 50px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-size: 15px;
    padding: 0 14px 0 44px;
    color: #111827;
    background: #f9fafb;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-family: inherit;
  }

  .mm-input:focus {
    border-color: #1a9e75;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(26, 158, 117, 0.12);
  }

  .mm-input.has-right { padding-right: 44px; }
  .mm-input::placeholder { color: #d1d5db; }
  .mm-input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

  .mm-error-msg {
    font-size: 12px;
    color: #ef4444;
    margin-top: 5px;
    font-weight: 500;
  }

  .mm-eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }

  .mm-eye-btn:hover { color: #1a9e75; }

  .mm-remember {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 1.25rem;
    cursor: pointer;
  }

  .mm-checkbox {
    width: 18px;
    height: 18px;
    border: 1.5px solid #d1d5db;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9fafb;
    transition: border-color 0.15s, background 0.15s;
    flex-shrink: 0;
  }

  .mm-checkbox.checked {
    background: #1a9e75;
    border-color: #1a9e75;
  }

  .mm-remember-text {
    font-size: 13px;
    color: #6b7280;
    user-select: none;
  }

  .mm-signin-btn {
    width: 100%;
    height: 52px;
    background: linear-gradient(135deg, #1a9e75, #085041);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
    font-family: inherit;
    letter-spacing: 0.2px;
    box-shadow: 0 6px 20px rgba(26, 158, 117, 0.35);
  }

  .mm-signin-btn:hover { opacity: 0.92; box-shadow: 0 8px 24px rgba(26, 158, 117, 0.45); }
  .mm-signin-btn:active { transform: scale(0.99); }
  .mm-signin-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .mm-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .mm-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1.5rem 0;
  }

  .mm-divider-line { flex: 1; height: 1px; background: #f0f0f0; }

  .mm-divider-text {
    font-size: 12px;
    color: #c4c4c4;
    font-weight: 500;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mm-social-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .mm-social-btn {
    height: 48px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.1s;
    font-family: inherit;
  }

  .mm-social-btn:hover { border-color: #1a9e75; background: #f0fdf9; transform: translateY(-1px); }
  .mm-social-btn:active { transform: translateY(0); }

  .mm-join-row {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 14px;
    color: #9ca3af;
  }

  .mm-join-link {
    color: #1a9e75;
    font-weight: 700;
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
    font-size: 14px;
    padding: 0;
    transition: color 0.15s;
  }

  .mm-join-link:hover { color: #085041; }

  .mm-secure {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: rgba(255,255,255,0.6);
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  .mm-features {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .mm-feature-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.8);
    font-weight: 500;
  }

  .mm-feature-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .mm-card { animation: fadeInUp 0.5s ease both; }
  .mm-features { animation: fadeInUp 0.5s ease 0.15s both; }
`;

const EmailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <rect x="2" y="4" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M2 6l6.5 4L15 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <rect x="3.5" y="7.5" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5.5 7.5V5.5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="8.5" cy="11" r="1.2" fill="currentColor"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M1.5 8.5S4 3.5 8.5 3.5 15.5 8.5 15.5 8.5 13 13.5 8.5 13.5 1.5 8.5 1.5 8.5z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M1.5 8.5S4 3.5 8.5 3.5 15.5 8.5 15.5 8.5 13 13.5 8.5 13.5 1.5 8.5 1.5 8.5z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="3" y1="3" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M2 5.5l2.5 2.5L9 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BrainIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <circle cx="17" cy="17" r="13" stroke="white" strokeWidth="2.2"/>
    <path d="M11 17C11 13 14.5 11 17 14.5C19.5 11 23 13 23 17C23 21 17 25 17 25C17 25 11 21 11 17Z" fill="white"/>
    <circle cx="17" cy="11" r="1.5" fill="rgba(255,255,255,0.5)"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.5 1a7.5 7.5 0 00-2.372 14.621c.375.069.512-.163.512-.362 0-.178-.006-.65-.01-1.276-2.086.453-2.526-.504-2.526-.504-.341-.867-.832-1.098-.832-1.098-.68-.465.052-.455.052-.455.751.053 1.146.772 1.146.772.667 1.143 1.75.813 2.177.622.068-.483.261-.813.475-.1C5.35 12.748 3.524 12.07 3.524 9.058c0-.866.309-1.574.816-2.129-.082-.2-.354-1.007.078-2.1 0 0 .666-.213 2.181.813A7.6 7.6 0 018.5 5.397a7.6 7.6 0 011.9.256c1.515-1.026 2.18-.812 2.18-.812.433 1.092.16 1.899.079 2.099.508.555.815 1.263.815 2.129 0 3.02-1.84 3.687-3.592 3.882.283.243.534.724.534 1.46 0 1.054-.01 1.905-.01 2.163 0 .2.135.435.515.361A7.502 7.502 0 008.5 1z" fill="#24292e"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17">
    <path d="M16.5 8.7c0-.61-.05-1.2-.15-1.76H8.5v3.33h4.6a3.94 3.94 0 01-1.71 2.58v2.15h2.77C15.63 13.6 16.5 11.37 16.5 8.7z" fill="#4285F4"/>
    <path d="M8.5 17c2.31 0 4.25-.77 5.67-2.07l-2.77-2.15a5.1 5.1 0 01-7.6-2.68H1v2.22A8.5 8.5 0 008.5 17z" fill="#34A853"/>
    <path d="M3.8 10.1A5.09 5.09 0 013.52 8.5c0-.56.1-1.1.28-1.6V4.68H1A8.5 8.5 0 000 8.5c0 1.37.33 2.67.92 3.82L3.8 10.1z" fill="#FBBC05"/>
    <path d="M8.5 3.4c1.3 0 2.47.45 3.39 1.33l2.54-2.54A8.5 8.5 0 001 4.68L3.8 6.9A5.07 5.07 0 018.5 3.4z" fill="#EA4335"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1L2 3v3c0 2.5 1.67 4.5 4 5 2.33-.5 4-2.5 4-5V3L6 1z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"/>
    <path d="M4 6l1.5 1.5L8 4.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    
    // Simulate API call with potential error
    await new Promise((r) => setTimeout(r, 1800));
    
    if (email === "error@example.com") {
      setErrors({ auth: "Invalid email or password. Please try again." });
      setLoading(false);
      return;
    }

    // Store user info
    const user = {
      name: email.split('@')[0],
      email: email,
      provider: 'email'
    };
    localStorage.setItem('user', JSON.stringify(user));

    // Track login in backend
    try {
      await trackLogin(user);
    } catch (err) {
      console.error("Failed to track login:", err);
    }

    setLoading(false);
    // Redirect to chat after login
    navigate("/chat");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Fetch user info from Google's userInfo endpoint using the access token
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();
        
        // Store user info
        const user = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          provider: 'google'
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        // Track login in backend
        await trackLogin(user);
        
        navigate("/chat");
      } catch (err) {
        setErrors({ auth: "Google login failed. Please try again." });
      } finally {
        setLoading(false);
      }
    },
    onError: () => setErrors({ auth: "Google login failed. Please try again." }),
  });

  const handleGithubLogin = () => {
    const GITHUB_CLIENT_ID = "Ov23liNbgYQbGVGbuhYj";
    const REDIRECT_URI = window.location.origin + "/chat";

    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    
    // For demo/development: if no ID, show error or simulate
    if (GITHUB_CLIENT_ID === "YOUR_GITHUB_CLIENT_ID") {
      console.log("GitHub Redirect URL:", githubUrl);
      setErrors({ auth: "Please set YOUR_GITHUB_CLIENT_ID in the code." });
    } else {
      window.location.href = githubUrl;
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      googleLogin();
    } else if (provider === 'github') {
      handleGithubLogin();
    }
  };




  return (
    <>
      <style>{styles}</style>
      <div className="mm-page">
        {/* Background blobs */}
        <div className="mm-blob" style={{ width: 340, height: 340, top: -100, left: -100 }} />
        <div className="mm-blob" style={{ width: 220, height: 220, bottom: -60, right: -60 }} />
        <div className="mm-blob" style={{ width: 130, height: 130, bottom: 140, left: 80 }} />
        <div className="mm-blob" style={{ width: 80, height: 80, top: 60, right: 120 }} />

        <div className="mm-wrapper">
          <div className="mm-card">
            {/* Header */}
            <div className="mm-header" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ 
                  fontFamily: '"Material Symbols Outlined"', 
                  fontSize: '32px', 
                  color: '#006162' 
                }}>spa</span>
                <span style={{ 
                  fontFamily: '"Plus Jakarta Sans", sans-serif', 
                  fontWeight: 800, 
                  fontSize: '1.75rem',
                  background: 'linear-gradient(135deg, #006162, #006398)',
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent', 
                  backgroundClip: 'text',
                }}>MindMate</span>
              </div>
              <p className="mm-subtitle">Welcome back! Please sign in to continue.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {errors.auth && (
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '12px',
                  color: '#dc2626',
                  fontSize: '13px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>⚠️</span>
                  {errors.auth}
                </div>
              )}
              {/* Email */}

              <div className="mm-group">
                <div className="mm-label-row">
                  <label className="mm-label">Email address</label>
                </div>
                <div className="mm-input-wrap">
                  <span className="mm-input-icon">
                    <EmailIcon />
                  </span>
                  <input
                    className={`mm-input${errors.email ? " error" : ""}`}
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                    }}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="mm-error-msg">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="mm-group">
                <div className="mm-label-row">
                  <label className="mm-label">Password</label>
                  <button type="button" className="mm-forgot">Forgot password?</button>
                </div>
                <div className="mm-input-wrap">
                  <span className="mm-input-icon">
                    <LockIcon />
                  </span>
                  <input
                    className={`mm-input has-right${errors.password ? " error" : ""}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="mm-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <p className="mm-error-msg">{errors.password}</p>}
              </div>

              {/* Remember me */}
              <div
                className="mm-remember"
                onClick={() => setRememberMe((v) => !v)}
                role="checkbox"
                aria-checked={rememberMe}
                tabIndex={0}
                onKeyDown={(e) => e.key === " " && setRememberMe((v) => !v)}
              >
                <div className={`mm-checkbox${rememberMe ? " checked" : ""}`}>
                  {rememberMe && <CheckIcon />}
                </div>
                <span className="mm-remember-text">Remember me for 30 days</span>
              </div>

              {/* Sign In Button */}
              <button type="submit" className="mm-signin-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="mm-spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowIcon />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mm-divider">
              <div className="mm-divider-line" />
              <span className="mm-divider-text">or continue with</span>
              <div className="mm-divider-line" />
            </div>

            {/* Social Buttons */}
            <div className="mm-social-row">
              <button 
                type="button" 
                className="mm-social-btn"
                onClick={() => handleSocialLogin("github")}
                disabled={loading}
              >
                <GitHubIcon />
                GitHub
              </button>
              <button 
                type="button" 
                className="mm-social-btn"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                <GoogleIcon />
                Google
              </button>
            </div>

            {/* Join link */}
            <div className="mm-join-row">
              New to MindMate?{" "}
              <button type="button" className="mm-join-link" onClick={() => navigate("/register")}>
                Create an account
              </button>
            </div>

          </div>

          {/* Bottom features */}
          <div className="mm-features">
            {["AI-powered support", "Private & secure", "Available 24/7"].map((f) => (
              <div className="mm-feature-pill" key={f}>
                <div className="mm-feature-dot" />
                {f}
              </div>
            ))}
          </div>

          {/* Secure badge */}
          <div className="mm-secure">
            <ShieldIcon />
            Secure authentication · Tech Titans
          </div>
        </div>
      </div>
    </>
  );
}