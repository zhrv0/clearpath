import { useState, useRef, useEffect } from "react";

/* ─── PALETTE & FONTS ───────────────────────────────────────── */
const G = {
  bg:       "#0e0c08",
  surface:  "rgba(255,245,220,0.045)",
  border:   "rgba(210,175,100,0.18)",
  borderHi: "rgba(210,175,100,0.42)",
  gold:     "#d4a855",
  goldSoft: "#c9a070",
  sage:     "#9ab87a",
  sageDark: "#6a8a52",
  cream:    "#f0ddb0",
  muted:    "#6a5a38",
  mutedLo:  "#3a2e18",
  text:     "#e8d8a8",
  textDim:  "#a09060",
  red:      "#c47a5a",
};

/* ─── DATA ──────────────────────────────────────────────────── */
const RANKS = [
  { name:"Seedling",  min:0,     color:G.sage     },
  { name:"Sprout",    min:100,   color:"#7fb96a"  },
  { name:"Sapling",   min:300,   color:"#6aaa5a"  },
  { name:"Blossom",   min:700,   color:"#d4956a"  },
  { name:"Oak",       min:1500,  color:"#b8860b"  },
  { name:"Guardian",  min:3000,  color:"#c9954a"  },
  { name:"Luminary",  min:6000,  color:"#d4a831"  },
  { name:"Phoenix",   min:10000, color:"#e08c42"  },
];

const HOME_QUESTS = [
  { id:"h1", cat:"home", title:"Make your bed",            desc:"Start the day with one small act of care for yourself",      xp:20  },
  { id:"h2", cat:"home", title:"Drink a glass of water",   desc:"Hydrate before anything else. Your body will thank you",     xp:10  },
  { id:"h3", cat:"home", title:"Open a window",            desc:"Let fresh air in. Even 2 minutes of fresh air matters",      xp:15  },
  { id:"h4", cat:"home", title:"Eat something warm",       desc:"Cook or heat up something nourishing, however simple",       xp:25  },
  { id:"h5", cat:"home", title:"Tidy one surface",         desc:"Just one — a table, a counter, the floor beside your bed",   xp:20  },
  { id:"h6", cat:"home", title:"Take a shower",            desc:"You don't have to do anything else after. Just this",        xp:30  },
  { id:"h7", cat:"home", title:"Sit in natural light",     desc:"Move near a window for 10 minutes. No phone needed",         xp:20  },
  { id:"h8", cat:"home", title:"Stretch for 5 minutes",   desc:"Lie on the floor and let your body slowly wake up",          xp:25  },
  { id:"h9", cat:"home", title:"Put on music you love",   desc:"Let sound fill the space. Let it move through you",          xp:15  },
  { id:"h10",cat:"home", title:"Write one true sentence",  desc:"Anything. How you feel right now. One sentence is enough",   xp:20  },
];

const OUT_QUESTS = [
  { id:"o1", cat:"out", title:"Step outside for 5 min",   desc:"That is it. No destination. Just air on your face",          xp:40  },
  { id:"o2", cat:"out", title:"Walk around the block",    desc:"One slow loop. Look at one thing you've never noticed",       xp:55  },
  { id:"o3", cat:"out", title:"Sit outside somewhere",    desc:"A bench, a step, the ground. Just be outside for a while",   xp:45  },
  { id:"o4", cat:"out", title:"Go to a cafe alone",       desc:"Order something. Sit. Watch the world without your phone",   xp:70  },
  { id:"o5", cat:"out", title:"Visit a green space",      desc:"A park, a garden, even a tree-lined street will do",         xp:60  },
  { id:"o6", cat:"out", title:"Say hi to a stranger",     desc:"A neighbour, a cashier. One real moment of connection",      xp:50  },
  { id:"o7", cat:"out", title:"Walk somewhere new",       desc:"A street you've never taken. No map, just wander",           xp:65  },
  { id:"o8", cat:"out", title:"Attend something social",  desc:"Briefly. You can leave early. Just show up",                 xp:120 },
];

const SOCIAL_QUESTS = [
  { id:"s1", cat:"social", title:"Text someone first",       desc:"Reach out before they reach you",                           xp:35  },
  { id:"s2", cat:"social", title:"Call instead of text",     desc:"Your voice matters. Use it",                                xp:50  },
  { id:"s3", cat:"social", title:"Make plans",               desc:"Set a date — coffee, a walk, anything",                     xp:65  },
  { id:"s4", cat:"social", title:"Share something honest",   desc:"Tell someone how you're actually doing",                    xp:80  },
  { id:"s5", cat:"social", title:"Give a real compliment",   desc:"Something true. Something you mean",                        xp:30  },
  { id:"s6", cat:"social", title:"Ask for help",             desc:"Let one person in today",                                   xp:75  },
];

const ANXIETY_TOOLS = [
  { id:"breathe", title:"Box Breathing",       desc:"4-4-4-4 breathwork to settle the nervous system", duration:"4 min",  points:20 },
  { id:"ground",  title:"5-4-3-2-1 Grounding", desc:"Name what you sense. Anchor to the present",      duration:"5 min",  points:25 },
  { id:"journal", title:"Gratitude Writing",   desc:"Three things, however small, that exist right now",duration:"10 min", points:30 },
  { id:"cold",    title:"Cold Water Reset",    desc:"Splash cold water. Shock the anxiety loop",        duration:"1 min",  points:15 },
  { id:"walk",    title:"Mindful Walk",        desc:"Ten minutes. No phone. Just movement and air",     duration:"10 min", points:35 },
  { id:"body",    title:"Body Scan",           desc:"Lie down. Breathe into each part of your body",    duration:"8 min",  points:25 },
];

/* ─── SMALL COMPONENTS ──────────────────────────────────────── */
function Toast({ msg, onClose }) {
  const [v] = useState(true);
  return v ? (
    <div style={{ position:"fixed",top:22,left:"50%",transform:"translateX(-50%)",zIndex:500,
      background:"linear-gradient(135deg,#1e1608,#160f04)",
      border:`1px solid ${G.borderHi}`,borderRadius:20,
      padding:"13px 28px",maxWidth:320,width:"90%",
      boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
      animation:"toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <p style={{ color:G.gold,fontSize:13,fontWeight:600,margin:0,
        textAlign:"center",fontFamily:"'Lato',sans-serif" }}>{msg}</p>
    </div>
  ) : null;
}

function Card({ children, style={}, onClick, className="" }) {
  return (
    <div onClick={onClick} className={className} style={{
      background:G.surface,border:`1px solid ${G.border}`,
      borderRadius:22,padding:"20px",margin:"0 16px 14px",
      backdropFilter:"blur(4px)",transition:"all 0.22s ease",
      cursor:onClick?"pointer":"default",...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, color=G.gold, style={} }) {
  return (
    <button onClick={onClick} style={{
      background:`linear-gradient(135deg,${color}22,${color}0a)`,
      border:`1px solid ${color}44`,color,
      borderRadius:14,padding:"11px 20px",cursor:"pointer",
      fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,
      letterSpacing:2,transition:"all 0.2s",width:"100%",...style
    }}>{children}</button>
  );
}

function Label({ children, style={} }) {
  return <p style={{ fontFamily:"'Lato',sans-serif",fontSize:9,
    letterSpacing:5,color:G.muted,textTransform:"uppercase",...style }}>{children}</p>;
}

function Title({ children, size=28, style={} }) {
  return <p style={{ fontFamily:"'Cormorant Garamond',serif",
    fontSize:size,color:G.cream,fontWeight:600,...style }}>{children}</p>;
}

/* ─── SCREENS ───────────────────────────────────────────────── */

/* LOGIN */
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);
  // phase 0: black → line appears
  // phase 1: app name fades in
  // phase 2: tagline fades in
  // phase 3: whole thing fades out → done

  useEffect(() => {
    const timings = [600, 1600, 2800, 4400];
    const timers = timings.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    const exit = setTimeout(onDone, 5600);
    return () => { timers.forEach(clearTimeout); clearTimeout(exit); };
  }, [onDone]);

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:1000,
      background: phase >= 3
        ? "transparent"
        : `radial-gradient(ellipse at 50% 40%, #1e1508 0%, #080604 100%)`,
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      transition: phase >= 3 ? "background 1.2s ease, opacity 1.2s ease" : "none",
      opacity: phase >= 3 ? 0 : 1,
      pointerEvents: phase >= 3 ? "none" : "all",
    }}>
      {/* horizontal light line */}
      <div style={{
        position:"absolute",
        top:"50%",left:"50%",
        transform:"translate(-50%,-50%) translateY(-48px)",
        width: phase >= 1 ? "160px" : "0px",
        height:"1px",
        background:`linear-gradient(90deg, transparent, ${G.gold}, transparent)`,
        transition:"width 1s cubic-bezier(0.4,0,0.2,1)",
        boxShadow:`0 0 12px ${G.gold}66`,
      }} />

      {/* app name */}
      <div style={{
        textAlign:"center",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
        transition:"opacity 1s ease 0.2s, transform 1s ease 0.2s",
      }}>
        <p style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:52,fontWeight:600,
          color:G.cream,letterSpacing:4,lineHeight:1,
          marginBottom:18,
        }}>ClearPath</p>
      </div>

      {/* tagline */}
      <div style={{
        textAlign:"center",
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "translateY(0)" : "translateY(8px)",
        transition:"opacity 1.2s ease, transform 1.2s ease",
        position:"absolute",
        bottom:"38%",
        width:"100%",
        padding:"0 40px",
      }}>
        <p style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontStyle:"italic",
          fontSize:19,
          color:G.goldSoft,
          lineHeight:1.7,
          letterSpacing:0.5,
        }}>
          You made it to today.<br/>That already took courage.
        </p>
      </div>

      {/* ambient glow */}
      <div style={{
        position:"absolute",top:"30%",left:"50%",
        transform:"translateX(-50%)",
        width:300,height:300,borderRadius:"50%",
        background:`radial-gradient(circle, ${G.gold}0e 0%, transparent 70%)`,
        pointerEvents:"none",
        opacity: phase >= 1 ? 1 : 0,
        transition:"opacity 1.5s ease",
      }} />
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [step, setStep]       = useState("main"); // main | email | phone | name
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [name, setName]       = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const goName = () => setStep("name");

  const handleEmailSubmit = () => {
    if (!email.includes("@")) return;
    // In production this triggers Supabase magic link — for now shows confirmation
    setEmailSent(true);
  };

  const handlePhoneSubmit = () => {
    if (phone.replace(/\D/g,"").length < 8) return;
    setStep("name");
  };

  const handleNameDone = () => {
    onLogin(name.trim() || "Wanderer");
  };

  const base = {
    minHeight:"100vh",display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",padding:"32px 28px",
    background:`radial-gradient(ellipse at 50% 15%, #241a07 0%, ${G.bg} 65%)`,
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(10px)",
    transition:"opacity 0.7s ease, transform 0.7s ease",
  };

  /* ── NAME step ── */
  if (step === "name") return (
    <div style={base}>
      <div style={{ width:"100%",maxWidth:340 }}>
        <button onClick={() => setStep("main")} style={{
          background:"transparent",border:"none",color:G.muted,
          cursor:"pointer",fontFamily:"'Lato',sans-serif",
          fontSize:11,letterSpacing:3,marginBottom:36,padding:0 }}>
          BACK
        </button>
        <Label style={{ marginBottom:14,letterSpacing:6 }}>almost there</Label>
        <Title size={30} style={{ marginBottom:8 }}>What should we call you?</Title>
        <p style={{ color:G.muted,fontSize:13,fontFamily:"'Lato',sans-serif",
          lineHeight:1.6,marginBottom:32 }}>
          A name, a nickname, anything — just yours.
        </p>
        <input value={name} onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleNameDone()}
          placeholder="your name..."
          style={{ width:"100%",padding:"16px 20px",borderRadius:18,marginBottom:14,
            background:G.surface,border:`1px solid ${G.borderHi}`,
            color:G.cream,fontFamily:"'Lato',sans-serif",fontSize:16,outline:"none" }} />
        <Btn onClick={handleNameDone} color={G.gold}>BEGIN MY PATH</Btn>
      </div>
    </div>
  );

  /* ── EMAIL step ── */
  if (step === "email") return (
    <div style={base}>
      <div style={{ width:"100%",maxWidth:340 }}>
        <button onClick={() => { setStep("main"); setEmailSent(false); setEmail(""); }} style={{
          background:"transparent",border:"none",color:G.muted,
          cursor:"pointer",fontFamily:"'Lato',sans-serif",
          fontSize:11,letterSpacing:3,marginBottom:36,padding:0 }}>
          BACK
        </button>

        {emailSent ? (
          <>
            <div style={{ width:48,height:1,background:G.gold,marginBottom:28,
              boxShadow:`0 0 10px ${G.gold}66` }} />
            <Title size={26} style={{ marginBottom:12 }}>Check your inbox</Title>
            <p style={{ color:G.muted,fontSize:14,fontFamily:"'Lato',sans-serif",
              lineHeight:1.8,marginBottom:32 }}>
              We sent a sign-in link to<br/>
              <span style={{ color:G.goldSoft }}>{email}</span><br/><br/>
              Click the link in your email to continue. No password needed.
            </p>
            <p style={{ color:G.mutedLo,fontSize:12,fontFamily:"'Lato',sans-serif",lineHeight:1.6 }}>
              Once Supabase is connected, this link will sign you in automatically.
            </p>
          </>
        ) : (
          <>
            <Label style={{ marginBottom:14,letterSpacing:6 }}>sign in with email</Label>
            <Title size={30} style={{ marginBottom:8 }}>Enter your email</Title>
            <p style={{ color:G.muted,fontSize:13,fontFamily:"'Lato',sans-serif",
              lineHeight:1.6,marginBottom:32 }}>
              We'll send you a link — no password needed.
            </p>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleEmailSubmit()}
              type="email" placeholder="you@example.com"
              style={{ width:"100%",padding:"16px 20px",borderRadius:18,marginBottom:14,
                background:G.surface,border:`1px solid ${G.borderHi}`,
                color:G.cream,fontFamily:"'Lato',sans-serif",fontSize:15,outline:"none" }} />
            <Btn onClick={handleEmailSubmit} color={G.gold}>SEND SIGN-IN LINK</Btn>
          </>
        )}
      </div>
    </div>
  );

  /* ── PHONE step ── */
  if (step === "phone") return (
    <div style={base}>
      <div style={{ width:"100%",maxWidth:340 }}>
        <button onClick={() => { setStep("main"); setPhone(""); }} style={{
          background:"transparent",border:"none",color:G.muted,
          cursor:"pointer",fontFamily:"'Lato',sans-serif",
          fontSize:11,letterSpacing:3,marginBottom:36,padding:0 }}>
          BACK
        </button>
        <Label style={{ marginBottom:14,letterSpacing:6 }}>sign in with phone</Label>
        <Title size={30} style={{ marginBottom:8 }}>Your number</Title>
        <p style={{ color:G.muted,fontSize:13,fontFamily:"'Lato',sans-serif",
          lineHeight:1.6,marginBottom:32 }}>
          We'll send a one-time code to verify it's you.
        </p>
        <div style={{ display:"flex",gap:10,marginBottom:14 }}>
          <div style={{ padding:"16px 14px",borderRadius:18,
            background:G.surface,border:`1px solid ${G.border}`,
            color:G.textDim,fontFamily:"'Lato',sans-serif",fontSize:15,
            display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
            <span style={{ fontSize:12 }}>+</span>
            <input defaultValue="1" style={{ width:32,background:"transparent",
              border:"none",outline:"none",color:G.textDim,
              fontFamily:"'Lato',sans-serif",fontSize:15 }} />
          </div>
          <input value={phone} onChange={e=>setPhone(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handlePhoneSubmit()}
            type="tel" placeholder="phone number"
            style={{ flex:1,padding:"16px 20px",borderRadius:18,
              background:G.surface,border:`1px solid ${G.borderHi}`,
              color:G.cream,fontFamily:"'Lato',sans-serif",fontSize:15,outline:"none" }} />
        </div>
        <Btn onClick={handlePhoneSubmit} color={G.gold}>CONTINUE</Btn>
        <p style={{ color:G.mutedLo,fontSize:11,fontFamily:"'Lato',sans-serif",
          lineHeight:1.6,marginTop:16,textAlign:"center" }}>
          SMS verification requires Supabase to be connected.
        </p>
      </div>
    </div>
  );

  /* ── MAIN step ── */
  return (
    <div style={base}>
      <div style={{ width:"100%",maxWidth:340 }}>
        {/* Wordmark */}
        <div style={{ textAlign:"center",marginBottom:56 }}>
          <div style={{ width:40,height:1,background:G.gold,margin:"0 auto 24px",
            boxShadow:`0 0 10px ${G.gold}55` }} />
          <Title size={42} style={{ letterSpacing:3,marginBottom:10 }}>ClearPath</Title>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",
            color:G.muted,fontSize:16,lineHeight:1.6 }}>
            grow through what you go through
          </p>
        </div>

        {/* Google */}
        <button onClick={goName} style={{
          width:"100%",padding:"15px 20px",borderRadius:18,cursor:"pointer",
          background:G.surface,border:`1px solid ${G.border}`,
          color:G.text,fontFamily:"'Lato',sans-serif",fontSize:13,
          fontWeight:600,letterSpacing:0.5,display:"flex",alignItems:"center",
          gap:16,marginBottom:12,transition:"border-color 0.2s" }}>
          {/* Google G SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display:"flex",alignItems:"center",gap:12,margin:"8px 0" }}>
          <div style={{ flex:1,height:1,background:G.border }} />
          <span style={{ color:G.mutedLo,fontSize:11,fontFamily:"'Lato',sans-serif",letterSpacing:2 }}>OR</span>
          <div style={{ flex:1,height:1,background:G.border }} />
        </div>

        {/* Email + Phone */}
        <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
          <button onClick={()=>setStep("email")} style={{
            width:"100%",padding:"14px 20px",borderRadius:18,cursor:"pointer",
            background:"transparent",border:`1px solid ${G.border}`,
            color:G.textDim,fontFamily:"'Lato',sans-serif",fontSize:13,
            fontWeight:500,letterSpacing:0.5,display:"flex",alignItems:"center",gap:16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0,opacity:0.6 }}>
              <rect x="2" y="4" width="20" height="16" rx="3" stroke={G.goldSoft} strokeWidth="1.5"/>
              <path d="M2 8l10 6 10-6" stroke={G.goldSoft} strokeWidth="1.5"/>
            </svg>
            Continue with Email
          </button>

          <button onClick={()=>setStep("phone")} style={{
            width:"100%",padding:"14px 20px",borderRadius:18,cursor:"pointer",
            background:"transparent",border:`1px solid ${G.border}`,
            color:G.textDim,fontFamily:"'Lato',sans-serif",fontSize:13,
            fontWeight:500,letterSpacing:0.5,display:"flex",alignItems:"center",gap:16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0,opacity:0.6 }}>
              <rect x="5" y="2" width="14" height="20" rx="3" stroke={G.goldSoft} strokeWidth="1.5"/>
              <circle cx="12" cy="18" r="1" fill={G.goldSoft}/>
            </svg>
            Continue with Phone Number
          </button>
        </div>

        {/* Anonymous */}
        <button onClick={goName} style={{
          width:"100%",padding:"12px",borderRadius:18,cursor:"pointer",
          background:"transparent",border:"none",
          color:G.mutedLo,fontFamily:"'Lato',sans-serif",
          fontSize:12,letterSpacing:2 }}>
          skip for now
        </button>
      </div>
    </div>
  );
}

/* PROFILE */
function ProfileScreen({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [why, setWhy] = useState(user.why || "");
  const fileRef = useRef();

  const save = () => { setUser(u=>({...u,name,bio,why})); setEditing(false); };

  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ padding:"36px 24px 20px" }}>
        <Label style={{ marginBottom:8 }}>your space</Label>
        <Title size={30}>Profile</Title>
      </div>

      <Card>
        {/* Avatar */}
        <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:24 }}>
          <div onClick={() => fileRef.current?.click()} style={{
            width:72,height:72,borderRadius:"50%",
            background:`linear-gradient(135deg,${G.gold}30,${G.sage}20)`,
            border:`1.5px solid ${G.border}`,display:"flex",
            alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
            {user.avatar
              ? <img src={user.avatar} style={{ width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover" }} />
              : <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:G.gold }}>
                  {user.name[0].toUpperCase()}
                </span>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
            onChange={e => {
              const f=e.target.files[0];
              if(!f) return;
              const r=new FileReader();
              r.onload=ev=>setUser(u=>({...u,avatar:ev.target.result}));
              r.readAsDataURL(f);
            }} />
          <div>
            {editing
              ? <input value={name} onChange={e=>setName(e.target.value)}
                  style={{ background:"transparent",border:`1px solid ${G.borderHi}`,
                    borderRadius:10,padding:"6px 12px",color:G.cream,
                    fontFamily:"'Cormorant Garamond',serif",fontSize:20,width:"100%",outline:"none" }} />
              : <Title size={22}>{user.name}</Title>}
            <Label style={{ marginTop:4 }}>tap avatar to change photo</Label>
          </div>
        </div>

        {/* Bio */}
        <Label style={{ marginBottom:8 }}>about me</Label>
        {editing
          ? <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3}
              placeholder="a few words about yourself..."
              style={{ width:"100%",background:"transparent",border:`1px solid ${G.borderHi}`,
                borderRadius:12,padding:"10px 14px",color:G.text,resize:"none",
                fontFamily:"'Lato',sans-serif",fontSize:13,outline:"none",
                lineHeight:1.6,marginBottom:16 }} />
          : <p style={{ color:G.textDim,fontSize:14,fontFamily:"'Lato',sans-serif",
              lineHeight:1.6,marginBottom:16,minHeight:40 }}>
              {user.bio || "Nothing written yet..."}
            </p>}

        {/* Why sober */}
        <Label style={{ marginBottom:8 }}>why i chose this path</Label>
        {editing
          ? <textarea value={why} onChange={e=>setWhy(e.target.value)} rows={3}
              placeholder="your reason for being here..."
              style={{ width:"100%",background:"transparent",border:`1px solid ${G.borderHi}`,
                borderRadius:12,padding:"10px 14px",color:G.text,resize:"none",
                fontFamily:"'Lato',sans-serif",fontSize:13,outline:"none",
                lineHeight:1.6,marginBottom:16 }} />
          : <p style={{ color:G.textDim,fontSize:14,fontFamily:"'Lato',sans-serif",
              lineHeight:1.6,marginBottom:16,fontStyle:"italic",minHeight:40 }}>
              {user.why || "Your reason is yours to define..."}
            </p>}

        <Btn onClick={editing?save:()=>setEditing(true)} color={editing?G.sage:G.gold}>
          {editing?"SAVE CHANGES":"EDIT PROFILE"}
        </Btn>
      </Card>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,margin:"0 16px 14px" }}>
        {[
          { label:"Sober Days", value:user.soberDays },
          { label:"Streak",     value:user.streak    },
          { label:"Points",     value:user.points    },
        ].map(s=>(
          <div key={s.label} style={{ background:G.surface,border:`1px solid ${G.border}`,
            borderRadius:18,padding:"18px 10px",textAlign:"center" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,
              color:G.gold,fontWeight:700 }}>{s.value}</p>
            <Label style={{ marginTop:4,letterSpacing:2 }}>{s.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

/* MOTIVATIONS */
function MotivationsScreen({ motivations, setMotivations }) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const fileRef = useRef();

  const addText = () => {
    if (!text.trim()) return;
    setMotivations(m => [...m, { id:Date.now(), type:"text", content:text.trim() }]);
    setText(""); setAdding(false);
  };

  const addPhoto = e => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => setMotivations(m=>[...m,{ id:Date.now(),type:"photo",content:ev.target.result }]);
    r.readAsDataURL(f);
  };

  const remove = id => setMotivations(m=>m.filter(x=>x.id!==id));

  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ padding:"36px 24px 20px" }}>
        <Label style={{ marginBottom:8 }}>your anchor</Label>
        <Title size={30}>Why I Stay</Title>
        <p style={{ color:G.muted,fontSize:13,marginTop:6,
          fontFamily:"'Lato',sans-serif",lineHeight:1.6 }}>
          Add words, notes, or photos — reasons to come back to when things get hard.
        </p>
      </div>

      {/* Add buttons */}
      <div style={{ display:"flex",gap:10,margin:"0 16px 16px" }}>
        <button onClick={()=>setAdding(a=>!a)} style={{
          flex:1,padding:"12px",borderRadius:14,cursor:"pointer",
          background:`linear-gradient(135deg,${G.gold}20,${G.gold}08)`,
          border:`1px solid ${G.gold}44`,color:G.gold,
          fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:2 }}>
          + ADD NOTE
        </button>
        <button onClick={()=>fileRef.current?.click()} style={{
          flex:1,padding:"12px",borderRadius:14,cursor:"pointer",
          background:`linear-gradient(135deg,${G.sage}20,${G.sage}08)`,
          border:`1px solid ${G.sage}44`,color:G.sage,
          fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:2 }}>
          + ADD PHOTO
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={addPhoto} />
      </div>

      {adding && (
        <Card>
          <Label style={{ marginBottom:10 }}>write your reason</Label>
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={4}
            placeholder="What are you fighting for? Who needs you? What do you want your life to feel like?..."
            style={{ width:"100%",background:"transparent",border:`1px solid ${G.borderHi}`,
              borderRadius:14,padding:"12px 16px",color:G.text,resize:"none",
              fontFamily:"'Lato',sans-serif",fontSize:14,outline:"none",
              lineHeight:1.7,marginBottom:14 }} />
          <div style={{ display:"flex",gap:10 }}>
            <Btn onClick={addText} color={G.gold} style={{ flex:1 }}>SAVE</Btn>
            <Btn onClick={()=>setAdding(false)} color={G.muted} style={{ flex:1 }}>CANCEL</Btn>
          </div>
        </Card>
      )}

      {motivations.length === 0 && !adding && (
        <div style={{ textAlign:"center",padding:"40px 32px" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",
            color:G.mutedLo,fontSize:18,lineHeight:1.7 }}>
            "Your reasons are waiting to be named.<br/>Start with one."
          </p>
        </div>
      )}

      {motivations.map(m => (
        <Card key={m.id} style={{ position:"relative" }}>
          <button onClick={()=>remove(m.id)} style={{
            position:"absolute",top:14,right:14,background:"transparent",border:"none",
            color:G.mutedLo,cursor:"pointer",fontSize:16,lineHeight:1 }}>x</button>
          {m.type==="photo"
            ? <img src={m.content} style={{ width:"100%",borderRadius:14,display:"block" }} />
            : <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",
                fontSize:17,color:G.text,lineHeight:1.75,paddingRight:20 }}>{m.content}</p>}
        </Card>
      ))}
    </div>
  );
}

/* NOTEBOOK */
function NotebookScreen({ entries, setEntries }) {
  const [open, setOpen] = useState(null); // null | "new" | entry id
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const save = () => {
    if (!text.trim()) return;
    const t = title.trim() || new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long"});
    if (open === "new") {
      setEntries(e=>[{ id:Date.now(),title:t,body:text,date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}) },...e]);
    } else {
      setEntries(e=>e.map(x=>x.id===open?{...x,title:t,body:text}:x));
    }
    setOpen(null); setText(""); setTitle("");
  };

  const openEntry = e => { setOpen(e.id); setText(e.body); setTitle(e.title); };
  const newEntry  = () => { setOpen("new"); setText(""); setTitle(""); };
  const remove    = id => setEntries(e=>e.filter(x=>x.id!==id));

  if (open !== null) return (
    <div style={{ minHeight:"100vh",background:G.bg,padding:"0 0 100px",
      display:"flex",flexDirection:"column" }}>
      <div style={{ padding:"40px 24px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div style={{ flex:1,paddingRight:16 }}>
          <Label style={{ marginBottom:8 }}>{open==="new"?"new entry":"editing"}</Label>
          <input value={title} onChange={e=>setTitle(e.target.value)}
            placeholder="give this entry a title..."
            style={{ background:"transparent",border:"none",outline:"none",
              fontFamily:"'Cormorant Garamond',serif",fontSize:26,
              color:G.cream,width:"100%",padding:0 }} />
        </div>
        <div style={{ display:"flex",gap:10,marginTop:8 }}>
          <button onClick={save} style={{ background:`${G.gold}20`,border:`1px solid ${G.gold}44`,
            color:G.gold,padding:"8px 16px",borderRadius:12,cursor:"pointer",
            fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:2 }}>SAVE</button>
          <button onClick={()=>{setOpen(null);setText("");setTitle("");}} style={{
            background:"transparent",border:`1px solid ${G.mutedLo}`,
            color:G.muted,padding:"8px 14px",borderRadius:12,cursor:"pointer",
            fontFamily:"'Lato',sans-serif",fontSize:10,letterSpacing:1 }}>BACK</button>
        </div>
      </div>
      <div style={{ flex:1,padding:"0 24px" }}>
        <div style={{ width:"100%",height:1,background:G.border,marginBottom:20 }} />
        <textarea value={text} onChange={e=>setText(e.target.value)}
          placeholder={"This is your space.\n\nNo one will read this. You can say anything here — the ugly, the raw, the things you can't say out loud.\n\nJust write."}
          style={{ width:"100%",minHeight:"60vh",background:"transparent",
            border:"none",outline:"none",resize:"none",
            fontFamily:"'Lato',sans-serif",fontSize:15,
            color:G.text,lineHeight:1.9 }} />
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ padding:"36px 24px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-end" }}>
        <div>
          <Label style={{ marginBottom:8 }}>just for you</Label>
          <Title size={30}>Notebook</Title>
        </div>
        <button onClick={newEntry} style={{
          background:`linear-gradient(135deg,${G.gold}22,${G.gold}0a)`,
          border:`1px solid ${G.gold}44`,color:G.gold,padding:"10px 18px",
          borderRadius:14,cursor:"pointer",fontFamily:"'Lato',sans-serif",
          fontSize:10,fontWeight:700,letterSpacing:2 }}>+ NEW</button>
      </div>

      {entries.length === 0 && (
        <div style={{ textAlign:"center",padding:"50px 32px" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",
            color:G.mutedLo,fontSize:18,lineHeight:1.8 }}>
            "Sometimes the bravest thing<br/>is to write it down."
          </p>
          <button onClick={newEntry} style={{
            marginTop:28,background:`${G.gold}18`,border:`1px solid ${G.gold}33`,
            color:G.goldSoft,padding:"12px 28px",borderRadius:16,cursor:"pointer",
            fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:3 }}>
            WRITE YOUR FIRST ENTRY
          </button>
        </div>
      )}

      {entries.map(e => (
        <Card key={e.id} onClick={()=>openEntry(e)} style={{ cursor:"pointer",position:"relative" }}>
          <button onClick={ev=>{ev.stopPropagation();remove(e.id);}} style={{
            position:"absolute",top:16,right:16,background:"transparent",border:"none",
            color:G.mutedLo,cursor:"pointer",fontSize:15 }}>x</button>
          <Label style={{ marginBottom:8 }}>{e.date}</Label>
          <Title size={18} style={{ marginBottom:8,paddingRight:24 }}>{e.title}</Title>
          <p style={{ color:G.textDim,fontSize:13,fontFamily:"'Lato',sans-serif",
            lineHeight:1.6,overflow:"hidden",display:"-webkit-box",
            WebkitLineClamp:3,WebkitBoxOrient:"vertical" }}>{e.body}</p>
        </Card>
      ))}
    </div>
  );
}

/* QUESTS */
function QuestsScreen({ quests, setQuests, notify }) {
  const [cat, setCat] = useState("home");
  const cats = [{ id:"home",label:"At Home" },{ id:"out",label:"Going Out" },{ id:"social",label:"Social" }];
  const all  = [...HOME_QUESTS,...OUT_QUESTS,...SOCIAL_QUESTS];
  const done = quests;

  const complete = q => {
    if (done.includes(q.id)) { notify("Already done today"); return; }
    setQuests(d=>[...d,q.id]);
    notify(`+${q.xp} xp — well done`);
  };

  const shown = all.filter(q=>q.cat===cat);

  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ padding:"36px 24px 16px" }}>
        <Label style={{ marginBottom:8 }}>small steps</Label>
        <Title size={30}>Daily Quests</Title>
      </div>

      {/* Category pills */}
      <div style={{ display:"flex",gap:8,padding:"0 16px",marginBottom:16,overflowX:"auto" }}>
        {cats.map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)} style={{
            padding:"9px 20px",borderRadius:30,cursor:"pointer",flexShrink:0,
            background:cat===c.id?`${G.gold}28`:"transparent",
            border:`1px solid ${cat===c.id?G.gold:G.mutedLo}`,
            color:cat===c.id?G.gold:G.muted,
            fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,
            letterSpacing:2,transition:"all 0.2s" }}>{c.label.toUpperCase()}</button>
        ))}
      </div>

      {cat==="home" && (
        <div style={{ margin:"0 16px 12px",padding:"14px 18px",
          background:`${G.sage}10`,border:`1px solid ${G.sage}25`,borderRadius:16 }}>
          <p style={{ color:G.sageDark,fontSize:12,fontFamily:"'Lato',sans-serif",lineHeight:1.6 }}>
            Some days you don't leave the house. That's okay. These quests exist for those days.
          </p>
        </div>
      )}
      {cat==="out" && (
        <div style={{ margin:"0 16px 12px",padding:"14px 18px",
          background:`${G.gold}0a`,border:`1px solid ${G.gold}20`,borderRadius:16 }}>
          <p style={{ color:G.goldSoft,fontSize:12,fontFamily:"'Lato',sans-serif",lineHeight:1.6 }}>
            Even 5 minutes outside changes your brain chemistry. Start with the smallest one.
          </p>
        </div>
      )}

      {shown.map(q=>{
        const isDone = done.includes(q.id);
        return (
          <Card key={q.id} style={{ opacity:isDone?0.5:1 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
              <Title size={16} style={{ flex:1,paddingRight:12 }}>{q.title}</Title>
              <span style={{ color:G.goldSoft,fontFamily:"'Cormorant Garamond',serif",
                fontSize:15,flexShrink:0 }}>+{q.xp} xp</span>
            </div>
            <p style={{ color:G.textDim,fontSize:13,fontFamily:"'Lato',sans-serif",
              lineHeight:1.55,marginBottom:14 }}>{q.desc}</p>
            <Btn onClick={()=>complete(q)} color={isDone?G.muted:G.gold}>
              {isDone?"COMPLETED":"MARK DONE"}
            </Btn>
          </Card>
        );
      })}
    </div>
  );
}

/* CALM TOOLS */
function CalmScreen({ completedTools, setCompletedTools, setPoints, notify }) {
  const [breathing, setBreathing] = useState(false);
  const [bPhase, setBPhase]   = useState(0);
  const [bCount, setBCount]   = useState(4);

  const handleTool = t => {
    if (t.id==="breathe") { setBreathing(true); return; }
    if (completedTools.includes(t.id)) { notify("Already done today"); return; }
    setCompletedTools(p=>[...p,t.id]);
    setPoints(p=>p+t.points);
    notify(`+${t.points} pts`);
  };

  return (
    <div style={{ paddingBottom:20 }}>
      {breathing && (
        <div style={{ position:"fixed",inset:0,zIndex:300,
          background:"radial-gradient(ellipse at center,#2a1f0e,#100d06)",
          display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",gap:28 }}>
          <Label style={{ letterSpacing:8 }}>box breathing</Label>
          <div style={{ width:200,height:200,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
            <div style={{
              width:[160,190,140,160][bPhase],
              height:[160,190,140,160][bPhase],
              borderRadius:"50%",
              background:`radial-gradient(circle,${G.gold}44 0%,${G.gold}0a 70%)`,
              border:`1.5px solid ${G.gold}44`,
              transition:"all 1.1s cubic-bezier(0.4,0,0.2,1)",
              display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:48,
                color:G.cream,fontWeight:600 }}>{bCount}</p>
              <Label>{["Breathe In","Hold","Breathe Out","Rest"][bPhase]}</Label>
            </div>
          </div>
          <button onClick={()=>setBreathing(false)} style={{
            background:"transparent",border:`1px solid ${G.mutedLo}`,
            color:G.muted,padding:"10px 28px",borderRadius:30,cursor:"pointer",
            fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:3 }}>CLOSE</button>
        </div>
      )}

      <div style={{ padding:"36px 24px 20px" }}>
        <Label style={{ marginBottom:8 }}>settle the storm</Label>
        <Title size={30}>Calm Garden</Title>
      </div>

      {ANXIETY_TOOLS.map(t=>{
        const done=completedTools.includes(t.id);
        return (
          <Card key={t.id} style={{ opacity:done?0.52:1 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5 }}>
              <Title size={17}>{t.title}</Title>
              <span style={{ color:G.goldSoft,fontFamily:"'Lato',sans-serif",
                fontSize:10,fontWeight:700,letterSpacing:1,
                padding:"4px 10px",borderRadius:20,
                background:`${G.gold}15`,border:`1px solid ${G.gold}28`,flexShrink:0,marginLeft:8 }}>
                +{t.points}
              </span>
            </div>
            <p style={{ color:G.textDim,fontSize:13,fontFamily:"'Lato',sans-serif",
              lineHeight:1.55,marginBottom:14 }}>{t.desc} — {t.duration}</p>
            <Btn onClick={()=>handleTool(t)} color={done?G.muted:G.gold}>
              {done?"COMPLETED TODAY":"BEGIN"}
            </Btn>
          </Card>
        );
      })}
    </div>
  );
}

/* HOME */
function HomeScreen({ user, setUser, notify, setTab }) {
  const [checkInModal, setCheckInModal] = useState(false);
  const rank     = RANKS.reduce((a,r)=>user.points>=r.min?r:a,RANKS[0]);
  const nextRank = RANKS.find(r=>user.points<r.min);
  const prog     = nextRank?Math.round(((user.points-rank.min)/(nextRank.min-rank.min))*100):100;

  const checkIn = () => {
    const today = new Date().toDateString();
    if (user.lastCheckIn===today) { notify("Already checked in today"); setCheckInModal(false); return; }
    const bonus  = user.streak*10;
    const earned = 50+bonus;
    setUser(u=>({...u,points:u.points+earned,streak:u.streak+1,
      soberDays:u.soberDays+1,lastCheckIn:today}));
    setCheckInModal(false);
    notify(`+${earned} pts — day ${user.streak+1}`);
  };

  return (
    <div style={{ paddingBottom:20 }}>
      {/* Modal */}
      {checkInModal && (
        <div style={{ position:"fixed",inset:0,zIndex:200,display:"flex",
          alignItems:"center",justifyContent:"center",padding:24,
          background:"rgba(14,12,8,0.92)",backdropFilter:"blur(10px)" }}>
          <div style={{ background:"linear-gradient(145deg,#1e1608,#160f04)",
            border:`1px solid ${G.borderHi}`,borderRadius:28,
            padding:"44px 32px",maxWidth:340,width:"100%",textAlign:"center" }}>
            <Label style={{ marginBottom:14,letterSpacing:6 }}>check in</Label>
            <Title size={26} style={{ marginBottom:12 }}>Another sober day?</Title>
            <p style={{ color:G.muted,fontSize:13,marginBottom:28,lineHeight:1.8,
              fontFamily:"'Lato',sans-serif" }}>
              50 base pts + <span style={{ color:G.gold }}>{user.streak*10} streak bonus</span>
            </p>
            <Btn onClick={checkIn} color={G.sage} style={{ marginBottom:12 }}>YES, I STAYED SOBER</Btn>
            <button onClick={()=>setCheckInModal(false)} style={{
              background:"transparent",border:"none",color:G.mutedLo,
              cursor:"pointer",fontFamily:"'Cormorant Garamond',serif",
              fontStyle:"italic",fontSize:14 }}>not today</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding:"40px 24px 20px",position:"relative" }}>
        <div style={{ position:"absolute",top:0,right:0,width:200,height:200,
          background:`radial-gradient(circle,${G.gold}0c,transparent 70%)`,
          pointerEvents:"none" }} />
        <Label style={{ marginBottom:8 }}>good to see you</Label>
        <Title size={32}>{user.name}</Title>
      </div>

      {/* Streak hero */}
      <Card style={{ background:`linear-gradient(145deg,${G.gold}10,${G.sage}06)`,
        borderColor:`${G.gold}30`,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-30,right:-20,width:140,height:140,
          background:`radial-gradient(circle,${G.gold}08,transparent 70%)`,pointerEvents:"none" }} />
        <div style={{ display:"flex",justifyContent:"space-around",marginBottom:24 }}>
          {[
            { label:"Streak",     value:user.streak,    color:G.gold },
            { label:"Sober Days", value:user.soberDays, color:G.sage },
          ].map(s=>(
            <div key={s.label} style={{ textAlign:"center" }}>
              <Label style={{ marginBottom:8 }}>{s.label}</Label>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:52,color:s.color,fontWeight:700,lineHeight:1 }}>{s.value}</p>
            </div>
          ))}
        </div>
        <Btn onClick={()=>setCheckInModal(true)} color={G.gold}>
          DAILY CHECK-IN  +{50+user.streak*10} pts
        </Btn>
      </Card>

      {/* Rank */}
      <Card>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:G.goldSoft }}>Rank — {rank.name}</p>
          {nextRank && <Label>{nextRank.name} next</Label>}
        </div>
        <div style={{ background:"rgba(0,0,0,0.4)",borderRadius:8,height:4,overflow:"hidden" }}>
          <div style={{ height:"100%",width:`${prog}%`,
            background:`linear-gradient(90deg,${rank.color}88,${rank.color})`,
            borderRadius:8,transition:"width 0.8s ease",
            boxShadow:`0 0 8px ${rank.color}44` }} />
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:8 }}>
          <Label style={{ color:rank.color }}>{rank.name}</Label>
          <Label>{prog}%</Label>
        </div>
      </Card>

      {/* Quick nav */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"0 16px 14px" }}>
        {[
          { label:"My Reasons",  sub:"Why I Stay",    tab:"motivations", color:G.gold },
          { label:"Notebook",    sub:"Vent freely",   tab:"notebook",    color:G.sage },
        ].map(s=>(
          <div key={s.label} onClick={()=>setTab(s.tab)} style={{
            background:G.surface,border:`1px solid ${G.border}`,borderRadius:20,
            padding:"20px 16px",cursor:"pointer",transition:"all 0.22s" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,
              color:s.color,marginBottom:4 }}>{s.label}</p>
            <Label style={{ color:G.mutedLo }}>{s.sub}</Label>
          </div>
        ))}
      </div>

      {/* Daily whisper */}
      <Card style={{ borderColor:`${G.sage}25`,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,
          background:`linear-gradient(135deg,${G.sage}05,transparent)`,pointerEvents:"none" }} />
        <Label style={{ color:G.sageDark,marginBottom:12 }}>today's whisper</Label>
        <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",
          fontSize:18,color:"#c8e8a0",lineHeight:1.8 }}>
          "Every sober day is sunlight breaking through the canopy — rare, golden, entirely yours."
        </p>
      </Card>
    </div>
  );
}

/* ─── ROOT APP ──────────────────────────────────────────────── */
export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [loggedIn, setLoggedIn]     = useState(false);
  const [user, setUser]             = useState({ name:"", bio:"", why:"", avatar:null,
    points:420, streak:7, soberDays:7, lastCheckIn:null });
  const [tab, setTab]               = useState("home");
  const [quests, setQuests]         = useState([]);
  const [completedTools, setCompletedTools] = useState([]);
  const [motivations, setMotivations]       = useState([]);
  const [entries, setEntries]               = useState([]);
  const [toast, setToast]                   = useState(null);

  const notify    = msg => { setToast(msg); setTimeout(()=>setToast(null),3800); };
  const setPoints = fn  => setUser(u=>({...u,points:fn(u.points)}));

  const TABS = [
    { id:"home",        label:"Home"    },
    { id:"calm",        label:"Calm"    },
    { id:"quests",      label:"Quests"  },
    { id:"motivations", label:"Why"     },
    { id:"notebook",    label:"Journal" },
    { id:"profile",     label:"Profile" },
  ];

  if (!splashDone || !loggedIn) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${G.bg}}
        input,textarea{color-scheme:dark}
        input::placeholder,textarea::placeholder{color:${G.mutedLo}}
        @keyframes toastIn{from{transform:translateX(-50%) translateY(-14px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
      `}</style>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      {splashDone && !loggedIn && <LoginScreen onLogin={name => { setUser(u=>({...u,name})); setLoggedIn(true); }} />}
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${G.bg};overflow-x:hidden}
        input,textarea{color-scheme:dark}
        input::placeholder,textarea::placeholder{color:${G.mutedLo}}
        ::-webkit-scrollbar{width:0}
        @keyframes toastIn{from{transform:translateX(-50%) translateY(-14px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
        @keyframes orbDrift{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
        @keyframes riseIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ minHeight:"100vh",maxWidth:430,margin:"0 auto",
        background:`radial-gradient(ellipse at 50% -5%,#281e08 0%,${G.bg} 60%)`,
        paddingBottom:80,position:"relative" }}>

        {/* ambient light */}
        <div style={{ position:"fixed",top:-100,left:-80,width:380,height:380,
          borderRadius:"50%",pointerEvents:"none",zIndex:0,
          background:"radial-gradient(circle,rgba(212,168,85,0.09) 0%,transparent 70%)",
          animation:"orbDrift 9s ease-in-out infinite" }} />
        <div style={{ position:"fixed",bottom:150,right:-80,width:260,height:260,
          borderRadius:"50%",pointerEvents:"none",zIndex:0,
          background:"radial-gradient(circle,rgba(154,184,122,0.06) 0%,transparent 70%)" }} />

        {toast && <Toast msg={toast} onClose={()=>setToast(null)} />}

        <div style={{ animation:"riseIn 0.4s ease",position:"relative",zIndex:1 }}>
          {tab==="home"        && <HomeScreen user={user} setUser={setUser} notify={notify} setTab={setTab} />}
          {tab==="calm"        && <CalmScreen completedTools={completedTools} setCompletedTools={setCompletedTools} setPoints={setPoints} notify={notify} />}
          {tab==="quests"      && <QuestsScreen quests={quests} setQuests={setQuests} notify={notify} />}
          {tab==="motivations" && <MotivationsScreen motivations={motivations} setMotivations={setMotivations} />}
          {tab==="notebook"    && <NotebookScreen entries={entries} setEntries={setEntries} />}
          {tab==="profile"     && <ProfileScreen user={user} setUser={setUser} />}
        </div>

        {/* Bottom nav */}
        <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
          width:"100%",maxWidth:430,zIndex:100,
          background:`linear-gradient(0deg,rgba(14,12,8,0.98) 70%,transparent)`,
          borderTop:`1px solid ${G.border}`,
          display:"flex",padding:"10px 0 16px" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,
              padding:"6px 0",background:"transparent",border:"none",cursor:"pointer",
              transition:"color 0.2s",
              color:tab===t.id?G.gold:G.mutedLo }}>
              <div style={{ width:4,height:4,borderRadius:"50%",marginBottom:2,
                background:tab===t.id?G.gold:"transparent",transition:"background 0.2s" }} />
              <span style={{ fontFamily:"'Lato',sans-serif",fontSize:8,
                letterSpacing:2,fontWeight:tab===t.id?700:400 }}>
                {t.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
