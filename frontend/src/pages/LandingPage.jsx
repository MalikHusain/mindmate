import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─── Inject Google Fonts once ───────────────────────────────────────── */
if (!document.getElementById('mm-fonts')) {
  const l1 = document.createElement('link'); l1.id = 'mm-fonts'; l1.rel = 'stylesheet'
  l1.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap'
  document.head.appendChild(l1)
  const l2 = document.createElement('link'); l2.rel = 'stylesheet'
  l2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
  document.head.appendChild(l2)
}

/* ─── Tokens ──────────────────────────────────────────────────────────── */
const C = {
  primary:       '#006162',
  primaryCont:   '#2c7a7b',
  primaryFixed:  '#a5eff0',
  secondary:     '#006398',
  secondaryCont: '#6cbdfe',
  secondaryFixed:'#cde5ff',
  surface:       '#f9f9f8',
  surfaceBright: '#ffffff',
  surfaceCont:   '#eeeeed',
  surfaceContLow:'#f4f4f3',
  surfaceContH2: '#e2e2e2',
  onSurface:     '#1a1c1c',
  onSurfaceVar:  '#3f4949',
  outline:       '#6f7979',
  outlineVar:    '#bec9c8',
}

const font = {
  headline: '"Plus Jakarta Sans", sans-serif',
  body:     '"Manrope", sans-serif',
}

/* ─── Icon ────────────────────────────────────────────────────────────── */
function Icon({ name, size = 24, color, filled = false, style = {} }) {
  return (
    <span style={{
      fontFamily: '"Material Symbols Outlined"',
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: size,
      lineHeight: 1,
      display: 'inline-block',
      userSelect: 'none',
      color,
      fontVariationSettings: filled
        ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
        : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      ...style,
    }}>
      {name}
    </span>
  )
}

/* ─── Button ──────────────────────────────────────────────────────────── */
function Btn({ children, onClick, outline = false, style = {} }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: outline ? C.surfaceBright : `linear-gradient(135deg,${C.primary},${C.primaryCont})`,
        color: outline ? C.primary : '#fff',
        border: outline ? `1.5px solid ${C.outlineVar}` : 'none',
        borderRadius: 9999, cursor: 'pointer',
        padding: '1rem 2.5rem',
        fontFamily: font.body, fontWeight: 700, fontSize: '1rem',
        transition: 'all .2s',
        boxShadow: hov && !outline ? '0 8px 28px rgba(0,97,98,.32)' : 'none',
        transform: hov ? 'scale(1.03)' : 'scale(1)',
        whiteSpace: 'nowrap',
        ...style,
      }}>
      {children}
    </button>
  )
}

/* ─── Nav ─────────────────────────────────────────────────────────────── */
function Nav({ nav }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <style>{`
        .mm-nav-links{display:flex!important}
        .mm-hamburger{display:none!important}
        @media(max-width:768px){
          .mm-nav-links{display:none!important}
          .mm-hamburger{display:flex!important}
        }
      `}</style>
      <header style={{
        position:'fixed',top:0,left:0,right:0,zIndex:50,
        background:'rgba(249,249,248,.88)',
        backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        borderBottom:`1px solid ${C.outlineVar}44`,
      }}>
        <div style={{
          maxWidth:1280,margin:'0 auto',padding:'0 2rem',
          display:'flex',alignItems:'center',justifyContent:'space-between',
          height:72,boxSizing:'border-box',
        }}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <Icon name="spa" size={28} color={C.primary}/>
            <span style={{
              fontFamily:font.headline,fontWeight:800,fontSize:'1.35rem',
              background:`linear-gradient(135deg,${C.primary},${C.secondary})`,
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            }}>MindMate</span>
          </div>

          {/* Desktop links */}
          <div className="mm-nav-links" style={{alignItems:'center',gap:40}}>
            {['Features','Process'].map((l,i)=>(
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                fontFamily:font.body,fontWeight:i===0?700:500,
                color:i===0?C.primary:C.onSurfaceVar,
                textDecoration:'none',fontSize:'.95rem',transition:'color .2s',
              }}
              onMouseEnter={e=>e.target.style.color=C.primary}
              onMouseLeave={e=>e.target.style.color=i===0?C.primary:C.onSurfaceVar}>
                {l}
              </a>
            ))}
            <a href="/login" style={{
              fontFamily:font.body,fontWeight:600,color:C.onSurfaceVar,
              textDecoration:'none',fontSize:'.95rem',transition:'color .2s',
            }} onMouseEnter={e=>e.target.style.color=C.primary} onMouseLeave={e=>e.target.style.color=C.onSurfaceVar}>
              Login
            </a>
            <Btn onClick={()=>nav('/register')} style={{padding:'.65rem 1.75rem',fontSize:'.9rem'}}>Get Started</Btn>
          </div>

          {/* Hamburger */}
          <button className="mm-hamburger"
            onClick={()=>setOpen(!open)}
            style={{background:'none',border:'none',cursor:'pointer',alignItems:'center',justifyContent:'center'}}>
            <Icon name={open?'close':'menu'} size={28} color={C.primary}/>
          </button>
        </div>

        {/* Mobile menu */}
        {open&&(
          <div style={{
            background:C.surface,borderTop:`1px solid ${C.outlineVar}33`,
            padding:'1rem 2rem 1.5rem',display:'flex',flexDirection:'column',gap:16,
          }}>
            {['Features','Process'].map(l=>(
              <a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)} style={{
                fontFamily:font.body,fontWeight:600,color:C.onSurface,textDecoration:'none',fontSize:'1rem',
              }}>{l}</a>
            ))}
            <a href="/login" onClick={()=>setOpen(false)} style={{
              fontFamily:font.body,fontWeight:600,color:C.onSurface,textDecoration:'none',fontSize:'1rem',
            }}>Login</a>
            <Btn onClick={()=>{setOpen(false);nav('/login')}} style={{alignSelf:'flex-start',padding:'.75rem 2rem'}}>
              Get Started
            </Btn>
          </div>
        )}
      </header>
    </>
  )
}

/* ─── Mind Illustration (replaces stock photo) ────────────────────────── */
function MindIllustration() {
  return (
    <div style={{
      borderRadius:'3rem',
      overflow:'hidden',
      background:`linear-gradient(145deg,${C.primaryFixed}28,${C.secondaryFixed}20,${C.surfaceContLow})`,
      boxShadow:'0 32px 80px rgba(0,97,98,.18)',
      position:'relative',
      aspectRatio:'1/1',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      border:`1px solid ${C.outlineVar}22`,
    }}>
      <style>{`
        @keyframes mm-float1{0%,100%{transform:translateY(0px)}50%{transform:translateY(-14px)}}
        @keyframes mm-float2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-9px)}}
        @keyframes mm-float3{0%,100%{transform:translateY(-5px)}50%{transform:translateY(7px)}}
        @keyframes mm-pulse{0%,100%{opacity:.22;transform:scale(.9)}50%{opacity:.08;transform:scale(1.08)}}
        @keyframes mm-dash{to{stroke-dashoffset:-240}}
        @keyframes mm-beat{0%,100%{opacity:.9;stroke-width:2.2}50%{opacity:.45;stroke-width:1.6}}
        @keyframes mm-spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes mm-glow{0%,100%{opacity:.5}50%{opacity:1}}
      `}</style>

      <svg
        viewBox="0 0 480 480"
        xmlns="http://www.w3.org/2000/svg"
        style={{width:'88%',height:'88%',overflow:'visible'}}
        aria-label="MindMate neural mind illustration"
      >
        {/* ── Outer pulse rings ── */}
        <circle cx="240" cy="224" r="138" fill="none" stroke="#006162" strokeWidth="1"
          style={{animation:'mm-pulse 4.2s ease-in-out infinite',transformOrigin:'240px 224px'}}/>
        <circle cx="240" cy="224" r="164" fill="none" stroke="#006162" strokeWidth=".5"
          style={{animation:'mm-pulse 4.2s ease-in-out infinite',animationDelay:'.9s',transformOrigin:'240px 224px'}}/>

        {/* ── Decorative orbit ring ── */}
        <circle cx="240" cy="224" r="112" fill="none" stroke="#006162" strokeWidth=".8"
          strokeDasharray="3 8" opacity=".18"
          style={{animation:'mm-spin-slow 30s linear infinite',transformOrigin:'240px 224px'}}/>

        {/* ── Center glow disc ── */}
        <circle cx="240" cy="224" r="78" fill="#006162" opacity=".06"/>
        <circle cx="240" cy="224" r="78" fill="none" stroke="#006162" strokeWidth="1.5" opacity=".25"/>

        {/* ── Abstract brain left lobe ── */}
        <path
          d="M240,148 C218,134 185,138 172,162 C158,188 163,218 180,236 C194,250 218,254 240,248"
          fill="#006162" fillOpacity=".14" stroke="#006162" strokeWidth="1.5" strokeOpacity=".35"/>

        {/* ── Abstract brain right lobe ── */}
        <path
          d="M240,148 C262,134 295,138 308,162 C322,188 317,218 300,236 C286,250 262,254 240,248"
          fill="#2c7a7b" fillOpacity=".11" stroke="#2c7a7b" strokeWidth="1.5" strokeOpacity=".3"/>

        {/* ── Corpus callosum line ── */}
        <path d="M240,152 Q246,194 240,248" fill="none" stroke="#006162"
          strokeWidth="1" strokeOpacity=".2" strokeDasharray="3 4"/>

        {/* ── Neural connection lines (animated dash) ── */}
        <line x1="240" y1="224" x2="120" y2="138" stroke="#006162" strokeWidth="1"
          strokeOpacity=".22" strokeDasharray="5 5"
          style={{animation:'mm-dash 7s linear infinite'}}/>
        <line x1="240" y1="224" x2="364" y2="130" stroke="#006398" strokeWidth="1"
          strokeOpacity=".22" strokeDasharray="5 5"
          style={{animation:'mm-dash 7s linear infinite',animationDelay:'1s'}}/>
        <line x1="240" y1="224" x2="96" y2="300" stroke="#006162" strokeWidth="1"
          strokeOpacity=".22" strokeDasharray="5 5"
          style={{animation:'mm-dash 7s linear infinite',animationDelay:'.5s'}}/>
        <line x1="240" y1="224" x2="382" y2="310" stroke="#006398" strokeWidth="1"
          strokeOpacity=".22" strokeDasharray="5 5"
          style={{animation:'mm-dash 7s linear infinite',animationDelay:'1.6s'}}/>
        <line x1="240" y1="224" x2="192" y2="356" stroke="#006162" strokeWidth="1"
          strokeOpacity=".22" strokeDasharray="5 5"
          style={{animation:'mm-dash 7s linear infinite',animationDelay:'.3s'}}/>
        <line x1="240" y1="224" x2="292" y2="358" stroke="#006398" strokeWidth="1"
          strokeOpacity=".22" strokeDasharray="5 5"
          style={{animation:'mm-dash 7s linear infinite',animationDelay:'2.1s'}}/>

        {/* ── EEG / heartbeat line ── */}
        <path
          d="M183,224 L202,224 L211,202 L220,246 L229,212 L238,232 L247,224 L297,224"
          fill="none" stroke="#006162" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          style={{animation:'mm-beat 2.6s ease-in-out infinite'}}/>

        {/* ── Node dots at connection ends ── */}
        <circle cx="120" cy="138" r="5.5" fill="#006162" opacity=".45"
          style={{animation:'mm-glow 3s ease-in-out infinite'}}/>
        <circle cx="364" cy="130" r="5.5" fill="#006398" opacity=".45"
          style={{animation:'mm-glow 3s ease-in-out infinite',animationDelay:'.6s'}}/>
        <circle cx="96"  cy="300" r="5"   fill="#006162" opacity=".4"
          style={{animation:'mm-glow 3s ease-in-out infinite',animationDelay:'1.2s'}}/>
        <circle cx="382" cy="310" r="5"   fill="#006398" opacity=".4"
          style={{animation:'mm-glow 3s ease-in-out infinite',animationDelay:'1.8s'}}/>
        <circle cx="192" cy="356" r="4.5" fill="#006162" opacity=".38"
          style={{animation:'mm-glow 3s ease-in-out infinite',animationDelay:'2.4s'}}/>
        <circle cx="292" cy="358" r="4.5" fill="#006398" opacity=".38"
          style={{animation:'mm-glow 3s ease-in-out infinite',animationDelay:'.9s'}}/>

        {/* ── Floating concept cards ── */}

        {/* Card: Calm — top left */}
        <g style={{animation:'mm-float1 5.2s ease-in-out infinite'}}>
          <rect x="44" y="100" width="100" height="48" rx="13"
            fill="white" fillOpacity=".92" stroke="#006162" strokeWidth=".8" strokeOpacity=".4"/>
          <circle cx="66" cy="124" r="9" fill="#006162" fillOpacity=".85"/>
          <rect x="82" y="117" width="46" height="7" rx="3.5" fill="#006162" fillOpacity=".25"/>
          <rect x="82" y="128" width="34" height="5.5" rx="2.75" fill="#006162" fillOpacity=".12"/>
          <text x="66" y="128" textAnchor="middle" fontSize="9.5" fontWeight="700"
            fill="#006162" fontFamily="Manrope,sans-serif" fillOpacity=".95">☯</text>
        </g>
        <text x="94" y="96" textAnchor="middle" fontSize="10.5" fontWeight="700"
          fill="#006162" fontFamily="Manrope,sans-serif" fillOpacity=".8">Calm</text>

        {/* Card: Focus — top right */}
        <g style={{animation:'mm-float2 6.1s ease-in-out infinite',animationDelay:'.7s'}}>
          <rect x="338" y="88" width="100" height="48" rx="13"
            fill="white" fillOpacity=".92" stroke="#006398" strokeWidth=".8" strokeOpacity=".4"/>
          <circle cx="360" cy="112" r="9" fill="#006398" fillOpacity=".85"/>
          <rect x="376" y="105" width="46" height="7" rx="3.5" fill="#006398" fillOpacity=".25"/>
          <rect x="376" y="116" width="30" height="5.5" rx="2.75" fill="#006398" fillOpacity=".12"/>
          <text x="360" y="116" textAnchor="middle" fontSize="9.5" fontWeight="700"
            fill="white" fontFamily="Manrope,sans-serif">◎</text>
        </g>
        <text x="388" y="84" textAnchor="middle" fontSize="10.5" fontWeight="700"
          fill="#006398" fontFamily="Manrope,sans-serif" fillOpacity=".8">Focus</text>

        {/* Card: Breathe — mid left */}
        <g style={{animation:'mm-float3 7s ease-in-out infinite',animationDelay:'1.2s'}}>
          <rect x="28" y="278" width="108" height="48" rx="13"
            fill="white" fillOpacity=".92" stroke="#006162" strokeWidth=".8" strokeOpacity=".4"/>
          <circle cx="52" cy="302" r="9" fill="#006162" fillOpacity=".85"/>
          <rect x="68" y="295" width="50" height="7" rx="3.5" fill="#006162" fillOpacity=".25"/>
          <rect x="68" y="306" width="38" height="5.5" rx="2.75" fill="#006162" fillOpacity=".12"/>
          <text x="52" y="306" textAnchor="middle" fontSize="9" fontWeight="700"
            fill="white" fontFamily="Manrope,sans-serif">♡</text>
        </g>
        <text x="82" y="274" textAnchor="middle" fontSize="10.5" fontWeight="700"
          fill="#006162" fontFamily="Manrope,sans-serif" fillOpacity=".8">Breathe</text>

        {/* Card: Reflect — mid right */}
        <g style={{animation:'mm-float1 5.8s ease-in-out infinite',animationDelay:'2s'}}>
          <rect x="352" y="280" width="104" height="48" rx="13"
            fill="white" fillOpacity=".92" stroke="#006398" strokeWidth=".8" strokeOpacity=".4"/>
          <circle cx="374" cy="304" r="9" fill="#006398" fillOpacity=".85"/>
          <rect x="390" y="297" width="48" height="7" rx="3.5" fill="#006398" fillOpacity=".25"/>
          <rect x="390" y="308" width="32" height="5.5" rx="2.75" fill="#006398" fillOpacity=".12"/>
          <text x="374" y="308" textAnchor="middle" fontSize="8.5" fontWeight="700"
            fill="white" fontFamily="Manrope,sans-serif">✦</text>
        </g>
        <text x="404" y="276" textAnchor="middle" fontSize="10.5" fontWeight="700"
          fill="#006398" fontFamily="Manrope,sans-serif" fillOpacity=".8">Reflect</text>

        {/* Card: Clarity — bottom left */}
        <g style={{animation:'mm-float2 6.4s ease-in-out infinite',animationDelay:'.4s'}}>
          <rect x="120" y="354" width="96" height="44" rx="12"
            fill="white" fillOpacity=".9" stroke="#006162" strokeWidth=".8" strokeOpacity=".35"/>
          <circle cx="142" cy="376" r="8" fill="#006162" fillOpacity=".8"/>
          <rect x="156" y="370" width="42" height="6" rx="3" fill="#006162" fillOpacity=".22"/>
          <rect x="156" y="380" width="30" height="5" rx="2.5" fill="#006162" fillOpacity=".1"/>
          <text x="142" y="380" textAnchor="middle" fontSize="9" fontWeight="700"
            fill="white" fontFamily="Manrope,sans-serif">◇</text>
        </g>
        <text x="168" y="350" textAnchor="middle" fontSize="10.5" fontWeight="700"
          fill="#006162" fontFamily="Manrope,sans-serif" fillOpacity=".8">Clarity</text>

        {/* Card: Grow — bottom right */}
        <g style={{animation:'mm-float3 5.6s ease-in-out infinite',animationDelay:'1.8s'}}>
          <rect x="272" y="358" width="90" height="44" rx="12"
            fill="white" fillOpacity=".9" stroke="#006398" strokeWidth=".8" strokeOpacity=".35"/>
          <circle cx="294" cy="380" r="8" fill="#006398" fillOpacity=".8"/>
          <rect x="308" y="374" width="38" height="6" rx="3" fill="#006398" fillOpacity=".22"/>
          <rect x="308" y="384" width="26" height="5" rx="2.5" fill="#006398" fillOpacity=".1"/>
          <text x="294" y="384" textAnchor="middle" fontSize="9" fontWeight="700"
            fill="white" fontFamily="Manrope,sans-serif">▲</text>
        </g>
        <text x="317" y="354" textAnchor="middle" fontSize="10.5" fontWeight="700"
          fill="#006398" fontFamily="Manrope,sans-serif" fillOpacity=".8">Grow</text>
      </svg>

      {/* ── Floating info card (bottom overlay) ── */}
      <div style={{
        position:'absolute',bottom:28,left:28,right:28,
        background:'rgba(255,255,255,.88)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',
        borderRadius:'1rem',padding:'1.1rem 1.4rem',
        boxShadow:'0 8px 32px rgba(0,97,98,.14)',
        border:'1px solid rgba(255,255,255,.4)',
        display:'flex',alignItems:'center',gap:14,
      }}>
        <div style={{
          width:44,height:44,background:C.primary,borderRadius:'50%',
          display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
        }}>
          <Icon name="graphic_eq" size={20} color="#fff"/>
        </div>
        <div>
          <p style={{fontFamily:font.body,fontWeight:700,color:C.onSurface,margin:0,fontSize:'.92rem'}}>"I'm here for you."</p>
          <p style={{fontFamily:font.body,fontSize:'.78rem',color:C.onSurfaceVar,fontStyle:'italic',margin:'2px 0 0'}}>Active Listening Mode</p>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'#22c55e',animation:'mm-glow 2s ease-in-out infinite'}}/>
          <span style={{fontFamily:font.body,fontSize:'.72rem',fontWeight:700,color:'#22c55e'}}>Live</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Hero ────────────────────────────────────────────────────────────── */
function Hero({ nav }) {
  return (
    <section id="features" style={{position:'relative',overflow:'hidden',minHeight:760,display:'flex',alignItems:'center',paddingTop:96,paddingBottom:80}}>
      <style>{`
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
        .hero-btns{display:flex;gap:16px;flex-wrap:wrap}
        @media(max-width:1024px){.hero-grid{grid-template-columns:1fr!important}}
        @media(max-width:640px){.hero-btns{flex-direction:column;width:100%}.hero-btns button{width:100%}}
      `}</style>

      {/* Blobs */}
      <div style={{position:'absolute',inset:0,zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',right:'-10%',width:600,height:600,background:`${C.primaryFixed}2a`,borderRadius:'50%',filter:'blur(120px)'}}/>
        <div style={{position:'absolute',bottom:'-5%',left:'-5%',width:400,height:400,background:`${C.secondaryFixed}2a`,borderRadius:'50%',filter:'blur(100px)'}}/>
      </div>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 2rem',position:'relative',zIndex:1,width:'100%',boxSizing:'border-box'}}>
        <div className="hero-grid">
          {/* Left */}
          <div style={{display:'flex',flexDirection:'column',gap:28,alignItems:'flex-start'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'.5rem 1rem',background:C.surfaceContLow,borderRadius:9999}}>
              <Icon name="auto_awesome" size={16} color={C.primary}/>
              <span style={{fontFamily:font.body,fontSize:'.7rem',fontWeight:700,color:C.primary,letterSpacing:'.12em',textTransform:'uppercase'}}>
                New: AI Pulse Technology
              </span>
            </div>

            <h1 style={{fontFamily:font.headline,fontWeight:800,fontSize:'clamp(2.2rem,5vw,4.25rem)',lineHeight:1.1,letterSpacing:'-.02em',color:C.onSurface,margin:0}}>
              Your Compassionate AI Companion for{' '}
              <span style={{background:`linear-gradient(135deg,${C.primary},${C.secondary})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                Mental Well-being
              </span>
            </h1>

            <p style={{fontFamily:font.body,fontSize:'clamp(1rem,1.5vw,1.15rem)',color:C.onSurfaceVar,lineHeight:1.75,maxWidth:520,margin:0}}>
              MindMate uses empathetic AI to provide a safe haven for your thoughts. Navigate life's challenges with 24/7 support designed to help you breathe, reflect, and grow.
            </p>

            <div className="hero-btns">
              <Btn onClick={()=>nav('/login')}>Start Your Journey</Btn>
            </div>

            {/* Trust badges */}
            <div style={{display:'flex',gap:24,flexWrap:'wrap',marginTop:4}}>
              {[
                {icon:'lock',label:'End-to-End Encrypted'},
                {icon:'verified_user',label:'HIPAA Compliant'},
                {icon:'star',label:'4.9 / 5 Rating'},
              ].map(b=>(
                <div key={b.label} style={{display:'flex',alignItems:'center',gap:6}}>
                  <Icon name={b.icon} size={14} color={C.primary}/>
                  <span style={{fontFamily:font.body,fontSize:'.75rem',fontWeight:600,color:C.onSurfaceVar}}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — professional SVG illustration */}
          <MindIllustration />
        </div>
      </div>
    </section>
  )
}

/* ─── Abstract Support ────────────────────────────────────────────────── */
function AbstractSupport() {
  return (
    <section id="process" style={{padding:'6rem 0',background:C.surfaceContLow}}>
      <style>{`
        .support-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
        @media(max-width:768px){.support-grid{grid-template-columns:1fr!important}}
      `}</style>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 2rem',boxSizing:'border-box'}}>
        <div className="support-grid">
          {/* Mosaic */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div style={{display:'flex',flexDirection:'column',gap:16,paddingTop:48}}>
              <div style={{height:192,borderRadius:'1rem',background:`${C.primaryCont}22`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="bubble_chart" size={48} color={C.primaryCont}/>
              </div>
              <div style={{height:256,borderRadius:'1rem',overflow:'hidden'}}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtOEE0FgDsVhehZnxeBiWC_DNiduKHOytuuXK48PRlBJE5iB33EWAR2vk_OEdcGqlKl_OMXcKAMeL6IvnjiICR7EWYy50EzDa7KFAE5fFHN17Ggm8ERyEt5PudBfy3D3Jjtxnh5dOwbgebEYK6_PnYSVzp6268v2b3bQURwfYkde-YMsBb14WE_Qjc9CMlNMH16g3zz_hf54mC74iX9sP3i6IbrU57eMfzFEFHQ9WYDprMM5lMh3sfYBUHWHaEXQRx0TzG0gvLnAkx" alt="Nature" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div style={{height:256,borderRadius:'1rem',overflow:'hidden'}}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt15qT4Hd0dcMJeCpAj9shfrn1YWQSBR5-n8plR6G025Nv5z6YwSdrKfED08KZVm1hk6oBWWDSQsrWWHnLtZKy59tzEMAPhdFJWfv--VkM7ImczUoLaVcvGdeCbWqU9fUUukkhbEfLwoycR456zemGSLtYyV_nkxZKk-mCBxFlHbg-lO9LNKjCiVGXRpVyAZT89_s7uiwGeAx8pWvGUUJgtOzcy6LJ1xBvO69CjoPQtjtEM8rW8xRuLCSSUcf5npCvyXkukXtwuEjP" alt="Gradient" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              </div>
              <div style={{height:192,borderRadius:'1rem',background:C.surfaceBright,boxShadow:'0 4px 20px rgba(0,0,0,.06)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="favorite" size={52} color={C.primary} filled/>
              </div>
            </div>
          </div>

          {/* Text */}
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <h2 style={{fontFamily:font.headline,fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.5rem)',color:C.onSurface,lineHeight:1.25,margin:0}}>
              Advanced Empathy,<br/>Zero Judgment.
            </h2>
            <p style={{fontFamily:font.body,fontSize:'1.05rem',color:C.onSurfaceVar,lineHeight:1.75,margin:0}}>
              Our AI isn't just about logic — it's trained on thousands of therapeutic frameworks to understand the nuance of human emotion. Whether you're feeling anxious, lonely, or just need to vent, MindMate adapts to your mood in real-time.
            </p>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:14}}>
              {['Neural Emotion Recognition','Cognitive Behavioral Adaptations','Real-time Mood Adaptation'].map(item=>(
                <li key={item} style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:`${C.primary}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Icon name="check" size={16} color={C.primary}/>
                  </div>
                  <span style={{fontFamily:font.body,fontWeight:600,color:C.onSurface,fontSize:'.95rem'}}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Features Bento ──────────────────────────────────────────────────── */
function Features() {
  return (
    <section style={{padding:'8rem 0',background:C.surface}}>
      <style>{`
        .bento{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}
        .b8{grid-column:span 8}.b4{grid-column:span 4}
        @media(max-width:1024px){.b8{grid-column:span 12!important}.b4{grid-column:span 6!important}}
        @media(max-width:640px){.b8,.b4{grid-column:span 12!important}.bento{grid-template-columns:1fr!important}}
      `}</style>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 2rem',boxSizing:'border-box'}}>
        <div style={{textAlign:'center',maxWidth:560,margin:'0 auto 5rem',display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
          <h2 style={{fontFamily:font.headline,fontWeight:800,fontSize:'clamp(1.75rem,3.5vw,2.5rem)',color:C.onSurface,margin:0}}>
            Designed for Your Peace of Mind
          </h2>
          <p style={{fontFamily:font.body,color:C.onSurfaceVar,fontSize:'1.05rem',margin:0}}>
            Sophisticated technology meets human-centric design.
          </p>
        </div>

        <div className="bento">
          {/* 24/7 */}
          <div className="b8" style={{background:C.surfaceBright,borderRadius:'2rem',padding:'2.5rem',boxShadow:'0 10px 40px rgba(26,28,28,.04)',minHeight:380,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div>
              <div style={{width:64,height:64,borderRadius:'50%',background:`${C.primary}18`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:28}}>
                <Icon name="auto_awesome" size={30} color={C.primary}/>
              </div>
              <h3 style={{fontFamily:font.headline,fontWeight:700,fontSize:'1.75rem',color:C.onSurface,margin:'0 0 12px'}}>24/7 AI Support</h3>
              <p style={{fontFamily:font.body,color:C.onSurfaceVar,fontSize:'1rem',lineHeight:1.7,maxWidth:440,margin:0}}>
                Your companion is always awake. Whether it's 3 AM or mid-workday, get instant, mindful responses whenever you need them most.
              </p>
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:28}}>
              {['Always Available','Real-time Response','No Waiting Room'].map(t=>(
                <span key={t} style={{padding:'.5rem 1.25rem',background:C.surfaceCont,borderRadius:9999,fontFamily:font.body,fontWeight:700,fontSize:'.85rem',color:C.onSurface}}>{t}</span>
              ))}
            </div>
          </div>

          {/* Wellness */}
          <div className="b4" style={{background:`linear-gradient(145deg,${C.primaryCont},${C.primary})`,borderRadius:'2rem',padding:'2.5rem',display:'flex',flexDirection:'column',justifyContent:'space-between',color:'#fff',overflow:'hidden',position:'relative'}}>
            <div>
              <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:28}}>
                <Icon name="psychology" size={30} color="#fff"/>
              </div>
              <h3 style={{fontFamily:font.headline,fontWeight:700,fontSize:'1.4rem',margin:'0 0 12px'}}>Wellness Insights</h3>
              <p style={{fontFamily:font.body,opacity:.9,lineHeight:1.65,margin:0,fontSize:'.95rem'}}>
                Deep pattern recognition that helps you understand your emotional triggers and progress over time.
              </p>
            </div>
            <Icon name="trending_up" size={96} style={{opacity:.12,alignSelf:'flex-end',marginTop:16}}/>
          </div>

          {/* Safe */}
          <div className="b4" style={{background:C.surfaceContLow,borderRadius:'2rem',padding:'2.5rem',minHeight:320,display:'flex',flexDirection:'column'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:`${C.primary}18`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:28}}>
              <Icon name="lock" size={30} color={C.primary}/>
            </div>
            <h3 style={{fontFamily:font.headline,fontWeight:700,fontSize:'1.4rem',color:C.onSurface,margin:'0 0 12px'}}>Safe &amp; Anonymous</h3>
            <p style={{fontFamily:font.body,color:C.onSurfaceVar,lineHeight:1.65,margin:0,fontSize:'.95rem'}}>
              Your privacy is our priority. End-to-end encrypted conversations ensure your sanctuary remains private.
            </p>
          </div>

          {/* Meditation */}
          <div className="b8" style={{background:C.surfaceContH2,borderRadius:'2rem',padding:4}}>
            <div style={{background:C.surfaceBright,borderRadius:'calc(2rem - 4px)',padding:'2.5rem',display:'flex',gap:40,alignItems:'center',flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:200}}>
                <h3 style={{fontFamily:font.headline,fontWeight:700,fontSize:'1.4rem',color:C.onSurface,margin:'0 0 12px'}}>Guided Meditations</h3>
                <p style={{fontFamily:font.body,color:C.onSurfaceVar,lineHeight:1.65,margin:0,fontSize:'.95rem'}}>
                  Personalized breathing exercises and soundscapes generated specifically for your current emotional state.
                </p>
              </div>
              <div style={{flex:1,minWidth:180,height:200,borderRadius:'1rem',overflow:'hidden'}}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-xZ1uMXpVf2Bow0YmSb5mPoxaC6nKsQv6qWumJ0DcBM6GeP2MZ08Zne59U1rf1T9qkVf1VX_EZ6GGcrf0NG2_XPIwX5aM7a2du9O4GU7twhCl8nabWHwVxPThWeHaclI7GEr2SHCKQoRIVQ7K9ys6F4rD9U7WBe-e8xNf-CSj39BkwiYi6091FvoYxxp30zgBf7BAg8zo8tjvaUAnv4U5hvOc-y2dCvZVNRPy3n40XNReOJ8ck399WlaSkON55QOomU6vOqeTMMud" alt="Meditation" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─────────────────────────────────────────────────────────────── */
function CTA({ nav }) {
  const [email,setEmail]=useState('')
  return (
    <section style={{padding:'8rem 0'}}>
      <style>{`
        .cta-form{display:flex;gap:12px;flex-direction:row}
        @media(max-width:520px){.cta-form{flex-direction:column!important}.cta-form input,.cta-form button{width:100%;box-sizing:border-box}}
      `}</style>
      <div style={{maxWidth:900,margin:'0 auto',padding:'0 2rem',boxSizing:'border-box'}}>
        <div style={{
          background:`linear-gradient(135deg,${C.primary},${C.primaryCont})`,
          borderRadius:'3rem',padding:'clamp(3rem,6vw,6rem)',
          textAlign:'center',color:'#fff',position:'relative',overflow:'hidden',
          display:'flex',flexDirection:'column',alignItems:'center',gap:20,
        }}>
          <div style={{position:'absolute',inset:0,zIndex:0,opacity:.18,overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,width:256,height:256,background:'#fff',borderRadius:'50%',filter:'blur(100px)'}}/>
            <div style={{position:'absolute',bottom:0,right:0,width:384,height:384,background:C.secondaryCont,borderRadius:'50%',filter:'blur(100px)'}}/>
          </div>
          <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:16,width:'100%'}}>
            <h2 style={{fontFamily:font.headline,fontWeight:800,fontSize:'clamp(2rem,5vw,3.5rem)',margin:0}}>Ready to feel better?</h2>
            <p style={{fontFamily:font.body,fontSize:'1.1rem',opacity:.9,maxWidth:480,margin:0,lineHeight:1.7}}>
              Join MindMate today and begin your journey toward lasting mental clarity and emotional resilience.
            </p>
            <div className="cta-form" style={{maxWidth:480,width:'100%',marginTop:8}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="Your email address"
                style={{flex:1,borderRadius:9999,padding:'1rem 1.5rem',background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.25)',color:'#fff',fontFamily:font.body,fontSize:'.95rem',outline:'none',backdropFilter:'blur(10px)',minWidth:0}}
              />
              <button onClick={() => {
                if(email) {
                  alert("Thank you for your interest! We'll notify you soon.");
                  setEmail('');
                } else {
                  alert("Please enter a valid email address.");
                }
              }}
                style={{background:'#fff',color:C.primary,border:'none',borderRadius:9999,padding:'1rem 1.75rem',fontFamily:font.body,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,transition:'all .2s'}}
                onMouseEnter={e=>e.currentTarget.style.background=C.surfaceContLow}
                onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                Join Now
              </button>
            </div>
            <p style={{fontFamily:font.body,fontSize:'.85rem',opacity:.7,margin:0}}>No credit card required. Free 7-day trial.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ──────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{background:'#f8fafb',borderTop:`1px solid ${C.outlineVar}33`,padding:'4rem 0'}}>
      <style>{`
        .footer-inner{display:flex;justify-content:space-between;gap:48px;flex-wrap:wrap}
        @media(max-width:640px){.footer-inner{flex-direction:column;gap:32px}}
      `}</style>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 2rem',boxSizing:'border-box'}}>
        <div className="footer-inner">
          <div style={{maxWidth:280,display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <Icon name="spa" size={24} color={C.primary}/>
              <span style={{fontFamily:font.headline,fontWeight:800,fontSize:'1.2rem',color:C.primary}}>MindMate</span>
            </div>
            <p style={{fontFamily:font.body,color:C.outline,fontSize:'.875rem',lineHeight:1.65,margin:0}}>
              The sanctuary for your mental well-being. AI-powered support, grounded in human empathy.
            </p>
          </div>
          <div style={{display:'flex',gap:48,flexWrap:'wrap'}}>
            {[
              {title:'Platform', links:['Support','How it works','Pricing']},
              {title:'Legal',    links:['Privacy Policy','Terms of Service']},
              {title:'Connect',  links:['Twitter','LinkedIn']},
            ].map(col=>(
              <div key={col.title} style={{display:'flex',flexDirection:'column',gap:12}}>
                <p style={{fontFamily:font.body,fontWeight:700,color:C.primary,fontSize:'.75rem',letterSpacing:'.12em',textTransform:'uppercase',margin:0}}>{col.title}</p>
                {col.links.map(l=>(
                  <a key={l} href="#" style={{fontFamily:font.body,color:C.outline,fontSize:'.875rem',textDecoration:'none',transition:'color .2s'}}
                    onMouseEnter={e=>e.target.style.color=C.primary}
                    onMouseLeave={e=>e.target.style.color=C.outline}>{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{marginTop:48,paddingTop:24,borderTop:`1px solid ${C.outlineVar}33`,textAlign:'center'}}>
          <p style={{fontFamily:font.body,color:C.outlineVar,fontSize:'.78rem',margin:'0 0 8px 0'}}>
            © 2026 Tech Titans — Nagpur Institute of Technology
          </p>
          <p style={{fontFamily:font.body,color:C.outlineVar,fontSize:'.7rem',margin:0,opacity:0.6}}>
            Project Lead: Malik Husain | Frontend: Kartik Burde | AI: Dibyanshu Behura
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Root ────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div style={{minHeight:'100vh',background:C.surface,color:C.onSurface,overflowX:'hidden',fontFamily:font.body}}>
      <style>{`*{box-sizing:border-box}img{max-width:100%}a{-webkit-tap-highlight-color:transparent}`}</style>
      <Nav nav={navigate}/>
      <main style={{paddingTop:72,paddingBottom:80}}>
        <Hero nav={navigate}/>
        <AbstractSupport/>
        <Features/>
        <CTA nav={navigate}/>
      </main>
      <Footer/>
      <BottomNav nav={navigate}/>
    </div>
  )
}

/* ─── Bottom mobile nav ───────────────────────────────────────────────── */
function BottomNav({ nav }) {
  const items=[
    {icon:'auto_awesome',label:'Features',href:'#features'},
    {icon:'psychology',  label:'Process', href:'#process'},
    {icon:'mail',        label:'Contact', href:'#contact'},
  ]
  const [active,setActive]=useState(0)
  return (
    <>
      <style>{`
        .mm-bottom-nav{display:none}
        @media(max-width:768px){.mm-bottom-nav{display:flex!important}}
      `}</style>
      <nav className="mm-bottom-nav" style={{
        position:'fixed',bottom:0,left:0,right:0,zIndex:50,
        justifyContent:'space-around',alignItems:'center',
        padding:'.75rem 1.5rem 1.25rem',
        background:'rgba(255,255,255,.88)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',
        borderTop:`1px solid ${C.outlineVar}33`,
        borderRadius:'1.5rem 1.5rem 0 0',
      }}>
        {items.map((item,i)=>(
          <a key={i} href={item.href} onClick={()=>setActive(i)}
            style={{
              display:'flex',flexDirection:'column',alignItems:'center',gap:2,textDecoration:'none',
              padding:'.35rem .75rem',borderRadius:9999,transition:'all .15s',
              background:active===i?`${C.primary}12`:'transparent',
            }}>
            <Icon name={item.icon} size={22} color={active===i?C.primary:C.onSurfaceVar}/>
            <span style={{fontFamily:font.body,fontSize:'10px',fontWeight:600,color:active===i?C.primary:C.onSurfaceVar}}>{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  )
}

