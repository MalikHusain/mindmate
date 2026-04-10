import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
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
    animation: fadeInUp 0.5s ease both;
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
    cursor: pointer;
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
    margin-top: 1rem;
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

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .mm-features {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
    animation: fadeInUp 0.5s ease 0.15s both;
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
`;

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

const EyeIcon = ({ open }) => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M1.5 8.5S4 3.5 8.5 3.5 15.5 8.5 15.5 8.5 13 13.5 8.5 13.5 1.5 8.5 1.5 8.5z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
    {!open && <line x1="3" y1="3" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>}
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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!name) errs.name = "Full name is required";
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
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));
    // Store user info
    const user = {
      name: name,
      email: email,
      provider: 'email'
    };
    localStorage.setItem('user', JSON.stringify(user));

    // Track registration (login) in backend
    try {
      await trackLogin(user);
    } catch (err) {
      console.error("Failed to track registration:", err);
    }

    setLoading(false);
    navigate("/chat");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();
        const user = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          provider: 'google'
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        // Track registration in backend
        await trackLogin(user);
        
        navigate("/chat");
      } catch (err) {
        setErrors({ auth: "Google registration failed." });
      } finally {
        setLoading(false);
      }
    },
    onError: () => setErrors({ auth: "Google registration failed." }),
  });

  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      googleLogin();
    } else if (provider === 'github') {
      const GITHUB_CLIENT_ID = "Ov23liNbgYQbGVGbuhYj";
      const REDIRECT_URI = window.location.origin + "/chat";

      window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    }
  };


  return (
    <>
      <style>{styles}</style>
      <div className="mm-page">
        <div className="mm-blob" style={{ width: 340, height: 340, top: -100, left: -100 }} />
        <div className="mm-blob" style={{ width: 220, height: 220, bottom: -60, right: -60 }} />
        <div className="mm-wrapper">
          <div className="mm-card">
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
              <p className="mm-subtitle">Join us and start your mental health journey</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {errors.auth && (
                <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '13px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚠️</span> {errors.auth}
                </div>
              )}
              {/* Name */}

              <div className="mm-group">
                <div className="mm-label-row">
                  <label className="mm-label">Full Name</label>
                </div>
                <div className="mm-input-wrap">
                  <span className="mm-input-icon"><UserIcon /></span>
                  <input
                    className={`mm-input${errors.name ? " error" : ""}`}
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                    }}
                  />
                </div>
                {errors.name && <p className="mm-error-msg">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="mm-group">
                <div className="mm-label-row">
                  <label className="mm-label">Email address</label>
                </div>
                <div className="mm-input-wrap">
                  <span className="mm-input-icon"><EmailIcon /></span>
                  <input
                    className={`mm-input${errors.email ? " error" : ""}`}
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                    }}
                  />
                </div>
                {errors.email && <p className="mm-error-msg">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="mm-group">
                <div className="mm-label-row">
                  <label className="mm-label">Password</label>
                </div>
                <div className="mm-input-wrap">
                  <span className="mm-input-icon"><LockIcon /></span>
                  <input
                    className={`mm-input has-right${errors.password ? " error" : ""}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                    }}
                  />
                  <button
                    type="button"
                    className="mm-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <p className="mm-error-msg">{errors.password}</p>}
              </div>

              <button type="submit" className="mm-signin-btn" disabled={loading}>
                {loading ? <span className="mm-spinner" /> : <>Get Started <ArrowIcon /></>}
              </button>
            </form>

            <div className="mm-divider">
              <div className="mm-divider-line" />
              <span className="mm-divider-text">or sign up with</span>
              <div className="mm-divider-line" />
            </div>

            <div className="mm-social-row">
              <button type="button" className="mm-social-btn" onClick={() => handleSocialLogin("github")}>
                <GitHubIcon /> GitHub
              </button>
              <button type="button" className="mm-social-btn" onClick={() => handleSocialLogin("google")}>
                <GoogleIcon /> Google
              </button>
            </div>

            <div className="mm-join-row">
              Already have an account?{" "}
              <button type="button" className="mm-join-link" onClick={() => navigate("/login")}>
                Sign In
              </button>
            </div>
          </div>

          <div className="mm-features">
            {["Join 5,000+ users", "Secure & private"].map((f) => (
              <div className="mm-feature-pill" key={f}>
                <div className="mm-feature-dot" /> {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
