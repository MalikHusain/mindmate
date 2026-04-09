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
        border: 'none', borderRadius: 9999, cursor: 'pointer',
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
            {['Features','Process','Stories'].map((l,i)=>(
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
            {['Features','Process','Stories'].map(l=>(
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
              <Btn onClick={()=>nav('/chat')}>Start Your Journey</Btn>
              <Btn outline>Watch Video</Btn>
            </div>
          </div>

          {/* Right */}
          <div style={{position:'relative'}}>
            <div style={{borderRadius:'3rem',overflow:'hidden',background:C.surfaceContLow,boxShadow:'0 32px 80px rgba(0,97,98,.18)',position:'relative',aspectRatio:'1/1'}}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmuofbc64NapB4U1d78Kq_KQ40F6QCMbuI7C5H8N7kx0u84m4wHIwwyydbva2gGyUVq7e4_UaLxITg_iKEsZ0a5eo7i7HEccd3lWpDR8_PGboRd9osEms6P9z18Z-c8t4gu7qsNyGgixMYi9TD1H_4TDApvdkZw5CbIgpAA_IbL6KRw-MqUHtItASvPW5SJGfRoEsn-ewjF7XWeSO-JxJlx_dq19ykmTJRiWgQZEnhGixDX5i-q_4OQJlfBkCIl4yHVyf1Bh7u2_0Z"
                alt="AI Companion"
                style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .7s'}}
                onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
                onMouseLeave={e=>e.target.style.transform='scale(1)'}
              />
              <div style={{position:'absolute',inset:0,background:`linear-gradient(to top,${C.primary}4d,transparent)`}}/>
              {/* Floating card */}
              <div style={{
                position:'absolute',bottom:28,left:28,right:28,
                background:'rgba(255,255,255,.85)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',
                borderRadius:'1rem',padding:'1.25rem 1.5rem',
                boxShadow:'0 8px 32px rgba(0,0,0,.12)',border:'1px solid rgba(255,255,255,.3)',
                display:'flex',alignItems:'center',gap:16,
              }}>
                <div style={{width:48,height:48,background:C.primary,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Icon name="graphic_eq" size={22} color="#fff"/>
                </div>
                <div>
                  <p style={{fontFamily:font.body,fontWeight:700,color:C.onSurface,margin:0,fontSize:'.95rem'}}>"I'm here for you."</p>
                  <p style={{fontFamily:font.body,fontSize:'.8rem',color:C.onSurfaceVar,fontStyle:'italic',margin:'2px 0 0'}}>Active Listening Mode</p>
                </div>
              </div>
            </div>
          </div>
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
              {['Neural Emotion Recognition','Cognitive Behavioral Adaptations'].map(item=>(
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
              {['Always Available','Real-time Response'].map(t=>(
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

/* ─── Testimonials ────────────────────────────────────────────────────── */
const TESTS = [
  { q:'"MindMate has become a daily ritual. It\'s like having a therapist in my pocket who knows exactly what to say when I\'m overwhelmed."', name:'Sarah Jenkins', role:'Marketing Director', img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCmi_iAbfOWDDhs1c2Ztc-Dt5Xm1HKeyOkANlmE9oRpMyBm_LPKjgAbMlkFuDb6kQoI0CD6V4-xfBhDNfYMmhNjl0gVfsnpNnTg3RA4VsnvKgREc0A6E912gdMgcv-TyGV5IkNax-dLg8h7-emj9SsEztQEM9F45_oVS8F4H7GAQH-XOzxEQvoSsaQl3TFeSVKRWbK4ZvFMjhFD3asKmkpcUW1YBeYg1KmQyMV3hv632G0JUIltr4S2ue-R76ZXHTJaq-UNsRfsJw86', offset:0},
  { q:'"The insights I get about my mood trends have been eye-opening. I\'ve finally identified the triggers I couldn\'t see before."',         name:'David Chen',    role:'Software Architect',  img:'https://lh3.googleusercontent.com/aida-public/AB6AXuD9nIz02lJz58zzzC4t1fFg3FfgD4ZY2k3gTiUfOpnFp0Dg4HRSVt5MqstPMFV4cr3V_BRxZpudMkb6Jg2poApBFYOg4TUzmCLb3lx3-FXS-AJ4lMDqPPaDutm7JQNACBnSSt-WPYrwlhZZTVofbGDVl80vLuv6s2o6mctBESjgunTchxLGIfp3cFXhrcwMdVjHXj4db7E8_8p6HP-2HSMO2oL8hz0pUau4nn3Qk1hnQGuVvVRXs1nNH-TL6agL6kvFpK4B6yyZi4xz', offset:40},
  { q:'"I was skeptical about AI, but the level of empathy and understanding here is remarkable. It truly feels like it cares."',               name:'Elena Rodriguez',role:'Graphic Designer',    img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCWMSRk_fW9FZZFn5REohUack-LaGxM5yCQqc9RhxzGRMYDcc75Jc4Jjclebs0enbGZsAXtTj2CJYuQb43JNRXlE6pSYHPscSrDJtPBwbH44-osYLKWrZyTHx2wiNVJOOvS04cCdPNl_qzMYbCSnOjwfy6o-y-9_24LqRChzkxWHtb9Uadd0u9mvSZ47O0rzxnVLdaGnnvjnksmVeSSLzgh-b3xmtBIk93_UyE0esAL80cL0PMfRvHbT0D8sJ4yM_Q0I3dTe1YFdtNm', offset:0},
]

function Testimonials() {
  return (
    <section id="stories" style={{padding:'8rem 0',background:C.surfaceContLow}}>
      <style>{`
        .test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;align-items:start}
        @media(max-width:768px){.test-grid{grid-template-columns:1fr!important}.test-offset{margin-top:0!important}}
      `}</style>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 2rem',boxSizing:'border-box'}}>
        <div style={{marginBottom:56}}>
          <span style={{fontFamily:font.body,fontWeight:700,color:C.primary,fontSize:'.8rem',letterSpacing:'.14em',textTransform:'uppercase',display:'block',marginBottom:12}}>User Stories</span>
          <h2 style={{fontFamily:font.headline,fontWeight:800,fontSize:'clamp(1.75rem,3.5vw,2.5rem)',color:C.onSurface,margin:0,maxWidth:480}}>
            Trusted by thousands finding their inner calm.
          </h2>
        </div>
        <div className="test-grid">
          {TESTS.map((t,i)=>(
            <div key={i} className="test-offset" style={{marginTop:t.offset}}>
              <div style={{background:C.surfaceBright,borderRadius:'2rem',padding:'2.5rem',boxShadow:'0 10px 40px rgba(26,28,28,.06)',position:'relative',display:'flex',flexDirection:'column',gap:24}}>
                <Icon name="format_quote" size={64} color={`${C.primary}22`} filled style={{position:'absolute',top:24,right:24}}/>
                <p style={{fontFamily:font.body,fontSize:'1.05rem',fontStyle:'italic',color:C.onSurface,lineHeight:1.7,margin:0,position:'relative',zIndex:1}}>{t.q}</p>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <img src={t.img} alt={t.name} style={{width:48,height:48,borderRadius:'50%',objectFit:'cover',display:'block',flexShrink:0}}/>
                  <div>
                    <p style={{fontFamily:font.body,fontWeight:700,color:C.onSurface,margin:0,fontSize:'.95rem'}}>{t.name}</p>
                    <p style={{fontFamily:font.body,fontSize:'.82rem',color:C.onSurfaceVar,margin:'2px 0 0'}}>{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              <button onClick={()=>nav('/chat')}
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
            © 2024 Tech Titans — Nagpur Institute of Technology
          </p>
          <p style={{fontFamily:font.body,color:C.outlineVar,fontSize:'.7rem',margin:0,opacity:0.6}}>
            Project Lead: Malik Husain | Frontend: Kartik Burde | AI: Dibyanshu Behura
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Bottom mobile nav ───────────────────────────────────────────────── */
function BottomNav({ nav }) {
  const items=[
    {icon:'auto_awesome',label:'Features',href:'#features'},
    {icon:'psychology',  label:'Process', href:'#process'},
    {icon:'format_quote',label:'Stories', href:'#stories'},
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
        <Testimonials/>
        <CTA nav={navigate}/>
      </main>
      <Footer/>
      <BottomNav nav={navigate}/>
    </div>
  )
}