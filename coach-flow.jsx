const { useState, useRef, useEffect } = React;

/* ---------------------------------------------------------------- tokens */
const C = {
  primary: '#7c57fd',
  lavender: '#e5ddff',
  heading: '#2f2b56',
  text: '#3d3d3d',
  variant: '#666666',
  type3: '#a7a7b5',
  green: '#3bb273',
  greenBg: '#e4f5ea',
  cardShadow: '0 3px 12px rgba(0,0,0,.10)',
};
// soft lavender → white screen background, sampled from Figma
const SCREEN_BG = 'linear-gradient(180deg,#d5d5ef 0%,#e6e6f5 22%,#f1f3fb 55%,#ffffff 100%)';

/* ---------------------------------------------------------------- icons */
const Ico = {
  back: (c = '#3d3d3d') => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M15 19l-7-7 7-7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron: (c = '#9a9ab0') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mic: (c = '#3d3d3d') => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke={c} strokeWidth="1.8" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  send: (c = '#fff') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 12l16-8-6 8 6 8-16-8z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <path d="M4 12l10 0" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  thumbUp: (c = '#b3b3bf') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M7 10v9H4a1 1 0 01-1-1v-7a1 1 0 011-1h3zm0 0l4-7a2 2 0 012 2v3h5a2 2 0 012 2.3l-1.2 6A2 2 0 0118.8 19H7" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  thumbDown: (c = '#b3b3bf') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: 'scaleY(-1)' }}>
      <path d="M7 10v9H4a1 1 0 01-1-1v-7a1 1 0 011-1h3zm0 0l4-7a2 2 0 012 2v3h5a2 2 0 012 2.3l-1.2 6A2 2 0 0118.8 19H7" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  clock: (c = '#fff') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke={c} strokeWidth="1.8" />
      <path d="M12 8v4l3 2" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  flame: (c = '#9a9ab0') => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3s5 4 5 9a5 5 0 01-10 0c0-2 1-3 1-3s0 2 1.5 2S12 8 12 6c0 0 .5 1.5 0 3 0 0 2-2 0-6z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  check: (c = '#fff') => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sparkleSmall: (c = '#7c57fd') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" fill={c} />
    </svg>
  ),
};

/* ---------------------------------------------------------------- status bar */
function StatusBar() {
  return (
    <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', flexShrink: 0 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: '#1c1c1e', letterSpacing: -.2 }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="#1c1c1e"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
        {/* wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><path d="M8.5 2C5.4 2 2.6 3.2.5 5.2l1.4 1.4C3.6 4.9 5.9 4 8.5 4s4.9.9 6.6 2.6l1.4-1.4C14.4 3.2 11.6 2 8.5 2z" fill="#1c1c1e"/><path d="M8.5 6c-1.6 0-3.1.6-4.2 1.7l1.5 1.5c.7-.7 1.7-1.2 2.7-1.2s2 .5 2.7 1.2l1.5-1.5C11.6 6.6 10.1 6 8.5 6z" fill="#1c1c1e"/><circle cx="8.5" cy="10.5" r="1.3" fill="#1c1c1e"/></svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="1" y="1" width="22" height="11" rx="3" stroke="#1c1c1e" strokeOpacity=".4" strokeWidth="1"/><rect x="2.5" y="2.5" width="18" height="8" rx="1.6" fill="#1c1c1e"/><rect x="24" y="4.5" width="1.6" height="4" rx=".8" fill="#1c1c1e" fillOpacity=".4"/></svg>
      </div>
    </div>
  );
}

/* ============================================================= TODAY SCREEN */
function TodayScreen({ onContinueCoach, onCoachTab }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: SCREEN_BG, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 110px' }}>
        <div style={{ fontSize: 24, fontWeight: 600, color: C.heading, letterSpacing: -.3 }}>Good morning, Andrii!</div>
        <div style={{ fontSize: 15, color: C.variant, marginTop: 4 }}>8:30am - Wake-up breath</div>

        {/* hero card */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: C.cardShadow, marginTop: 18, padding: '20px 18px', position: 'relative', overflow: 'hidden', minHeight: 168 }}>
          <div style={{ width: '64%' }}>
            <div style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.28, color: '#2b2b33' }}>
              Your body is locked on carbs today - let's make some adjustments
            </div>
            <button onClick={onContinueCoach} style={{ marginTop: 18, background: C.primary, color: '#fff', border: 'none', borderRadius: 999, padding: '11px 20px', fontSize: 14, fontWeight: 600 }}>
              Continue with coach
            </button>
          </div>
          <img src="assets/mita_carb.png" alt="" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', height: 150, pointerEvents: 'none' }} />
        </div>

        {/* two cards */}
        <div style={{ display: 'flex', gap: 15, marginTop: 16 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 20, boxShadow: C.cardShadow, padding: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f3b600', color: '#fff', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</div>
            <div style={{ fontSize: 13, color: C.variant, marginTop: 14 }}>Lumen Level</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#2b2b33', marginTop: 2 }}>75% Carb</div>
            <div style={{ height: 1, background: '#eee', margin: '14px 0' }} />
            {Ico.flame()}
            <div style={{ fontSize: 13, color: C.variant, marginTop: 8 }}>Ketosis Level</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#2b2b33', marginTop: 2 }}>Not is ketosis</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 20, boxShadow: C.cardShadow, padding: 16, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#f6f6f9', borderRadius: 14, padding: 6, display: 'flex', justifyContent: 'center' }}>
              <img src="assets/mita_mediators.png" alt="" style={{ width: '100%', maxWidth: 124 }} />
            </div>
            <div style={{ fontSize: 13, color: C.variant, marginTop: 14 }}>Mediator status</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#2b2b33', marginTop: 2, lineHeight: 1.2 }}>Multiple<br />mediators</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginTop: 'auto', paddingTop: 12 }}>Learn more</div>
          </div>
        </div>

        {/* fast duration */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: C.cardShadow, marginTop: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{Ico.clock()}</div>
          <span style={{ fontSize: 15, color: C.variant }}>Fast duration:</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.primary, letterSpacing: -.5 }}>12:40:18</span>
          <span style={{ marginLeft: 'auto' }}>{Ico.chevron()}</span>
        </div>

        {/* daily check-in header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: C.heading }}>Daily check-in</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.primary, display: 'flex', alignItems: 'center', gap: 5 }}>
            Learn more
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.primary} strokeWidth="1.6"/><path d="M10 8l5 4-5 4z" fill={C.primary}/></svg>
          </span>
        </div>
      </div>

      {/* tab bar */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 84, background: '#fff' }}>
        <img src="assets/mita_tabbar.png" alt="" style={{ width: '100%', display: 'block' }} />
        {/* invisible Coach tab hit area (2nd of 6 columns) */}
        <button onClick={onCoachTab} aria-label="Coach tab" style={{ position: 'absolute', top: 0, left: '16.66%', width: '16.66%', height: 70, background: 'transparent', border: 'none' }} />
      </div>
    </div>
  );
}

/* ============================================================= COACH PIECES */
function CoachHeader({ onBack, showAvatar }) {
  return (
    <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 18px', position: 'relative', flexShrink: 0 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 4, display: 'flex' }}>{Ico.back()}</button>
      <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, pointerEvents: 'none' }}>
        {showAvatar && <img src="assets/mita_avatar.png" alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />}
        <span style={{ fontSize: 16, fontWeight: 600, color: '#2b2b33' }}>Coach</span>
      </div>
    </div>
  );
}

function Chip({ label, primary, onTap }) {
  return (
    <button onClick={onTap} style={{
      border: `1.5px solid ${C.primary}`,
      background: primary ? C.primary : 'transparent',
      color: primary ? '#fff' : C.primary,
      borderRadius: 999, padding: '9px 18px', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{label}</button>
  );
}

function Thumbs() {
  return (
    <div style={{ display: 'flex', gap: 18, marginTop: 14, paddingLeft: 2 }}>
      <span>{Ico.thumbUp()}</span>
      <span>{Ico.thumbDown()}</span>
    </div>
  );
}

function DinnerCard() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const status = ['done', 'done', 'done', 'today', 'future', 'future', 'future'];
  return (
    <div style={{ background: '#fbfbfe', border: '1px solid #efeef6', borderRadius: 16, padding: '16px 16px 18px', marginTop: 14, boxShadow: '0 2px 8px rgba(33,21,55,.05)' }}>
      <div style={{ fontSize: 14, color: C.variant, marginBottom: 14 }}>Early dinner this week:</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {days.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 13, fontWeight: status[i] === 'today' ? 700 : 500, color: status[i] === 'today' ? '#2b2b33' : '#aaa' }}>{d}</span>
            {status[i] === 'done' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ico.check(C.green)}</div>
            )}
            {status[i] === 'today' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px dashed ${C.green}`, background: 'transparent' }} />
            )}
            {status[i] === 'future' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#efefef' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const THINKING_LINES = [
  'Coach is thinking',
  'Looking at your last three days',
  'Checking your dinner timing',
  'Reviewing your fat-burn trend',
  'Putting together your next step',
];

function Thinking() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % THINKING_LINES.length), 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.primary, opacity: .85, display: 'inline-block', animation: `coachDot 1.2s ${i * 0.18}s infinite ease-in-out` }} />
        ))}
      </div>
      <span key={idx} style={{ fontSize: 16, color: '#5a5a66', animation: 'coachFade .4s ease' }}>{THINKING_LINES[idx]}</span>
    </div>
  );
}

const stripThinking = arr => { const a = [...(arr || [])]; while (a.length && a[a.length - 1].role === 'thinking') a.pop(); return a; };
const SpeechRec = (typeof window !== 'undefined') && (window.SpeechRecognition || window.webkitSpeechRecognition);

/* ---------------------------------------------------- on-screen iOS keyboard */
const KB = { bg: '#2c2c2e', key: '#6d6d71', fn: '#454548' };
const kbKeyBase = (extra) => ({ height: 42, borderRadius: 6, border: 'none', color: '#fff', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 0 rgba(0,0,0,.4)', cursor: 'pointer', padding: 0, ...extra });
const shiftGlyph = (active) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 8h-4.5v7h-7v-7H4z" fill={active ? '#111' : 'none'} stroke={active ? '#111' : '#fff'} strokeWidth="1.7" strokeLinejoin="round" /></svg>);
const backspaceGlyph = (<svg width="25" height="20" viewBox="0 0 26 20" fill="none"><path d="M8 2h15a1 1 0 011 1v14a1 1 0 01-1 1H8L1 10z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 7l6 6M18 7l-6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>);
const emojiGlyph = (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.5" /><circle cx="9" cy="10.5" r="1" fill="#fff" /><circle cx="15" cy="10.5" r="1" fill="#fff" /><path d="M8.5 14a4 4 0 007 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>);
const kbMicGlyph = (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="11" rx="3" stroke="#fff" strokeWidth="1.7" /><path d="M5 11a7 7 0 0014 0M12 18v3" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" /></svg>);

function Letter({ k, onChar }) {
  return <button onMouseDown={e => e.preventDefault()} onClick={() => onChar(k)} style={kbKeyBase({ flex: 1, margin: '0 3px', background: KB.key, fontSize: 18 })}>{k}</button>;
}
function IosKeyboard({ onChar, onBackspace, onSpace, onReturn, onMic, shift, onShift, listening }) {
  const row = { display: 'flex', justifyContent: 'center', padding: '0 3px', marginBottom: 9 };
  const fn = (extra) => kbKeyBase({ background: KB.fn, margin: '0 3px', ...extra });
  return (
    <div style={{ background: KB.bg, padding: '9px 2px 6px' }}>
      <div style={row}>{'QWERTYUIOP'.split('').map(k => <Letter key={k} k={k} onChar={onChar} />)}</div>
      <div style={{ ...row, padding: '0 21px' }}>{'ASDFGHJKL'.split('').map(k => <Letter key={k} k={k} onChar={onChar} />)}</div>
      <div style={row}>
        <button onMouseDown={e => e.preventDefault()} onClick={onShift} style={fn({ flex: 1.5, background: shift ? '#e9e9ec' : KB.fn })}>{shiftGlyph(shift)}</button>
        {'ZXCVBNM'.split('').map(k => <Letter key={k} k={k} onChar={onChar} />)}
        <button onMouseDown={e => e.preventDefault()} onClick={onBackspace} style={fn({ flex: 1.5 })}>{backspaceGlyph}</button>
      </div>
      <div style={{ ...row, marginBottom: 0 }}>
        <button onMouseDown={e => e.preventDefault()} style={fn({ flex: 1.4, fontSize: 15 })}>123</button>
        <button onMouseDown={e => e.preventDefault()} style={fn({ flex: 1 })}>{emojiGlyph}</button>
        <button onMouseDown={e => e.preventDefault()} onClick={onMic} aria-label="Dictate" style={fn({ flex: 1, background: listening ? C.primary : KB.fn, animation: listening ? 'micPulse 1.4s infinite' : 'none' })}>{kbMicGlyph}</button>
        <button onMouseDown={e => e.preventDefault()} onClick={onSpace} style={kbKeyBase({ flex: 5, margin: '0 3px', background: KB.key, fontSize: 15 })}>space</button>
        <button onMouseDown={e => e.preventDefault()} onClick={onReturn} style={fn({ flex: 2, fontSize: 15 })}>return</button>
      </div>
    </div>
  );
}

function RecWave() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center', height: 16 }}>
      {[0, 1, 2, 3, 4].map(i => <span key={i} style={{ width: 3, height: 14, borderRadius: 2, background: C.primary, transformOrigin: 'center', animation: `recWave 1s ${i * 0.12}s infinite ease-in-out` }} />)}
    </span>
  );
}

function InputBar({ onSend }) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const [shift, setShift] = useState(true);
  const recRef = useRef(null);
  const baseRef = useRef('');

  useEffect(() => () => { if (recRef.current) { try { recRef.current.abort(); } catch (e) {} } }, []);

  function stopListening() { try { recRef.current && recRef.current.stop(); } catch (e) {} }
  function toggleMic() {
    if (!SpeechRec) { alert("Voice input isn't supported in this browser — try Chrome, Edge, or Safari."); return; }
    if (listening) { stopListening(); return; }
    const rec = new SpeechRec();
    rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = true;
    baseRef.current = text ? text + ' ' : '';
    rec.onresult = (e) => {
      let interim = '', finals = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finals += r[0].transcript; else interim += r[0].transcript;
      }
      if (finals) baseRef.current += finals;
      setText((baseRef.current + interim).replace(/\s+/g, ' ').trimStart());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setKbOpen(true); setListening(true);
    try { rec.start(); } catch (e) { setListening(false); }
  }

  function onChar(ch) { setText(t => t + (shift ? ch : ch.toLowerCase())); if (shift) setShift(false); }
  function send() {
    const t = text.trim();
    if (!t) return;
    if (listening) stopListening();
    onSend && onSend(t);
    setText(''); setKbOpen(false); setShift(true);
  }
  function dismiss() { if (listening) stopListening(); setKbOpen(false); }

  // icon mapping mirrors the Figma states:
  //  default (keyboard closed) → mic · typing (keyboard open) → send · dictating → mic (recording)
  const showSend = kbOpen && !listening;
  const circle = (bg) => ({ width: 46, height: 46, borderRadius: '50%', background: bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      {kbOpen && <div onClick={dismiss} style={{ position: 'absolute', left: 0, right: 0, bottom: '100%', height: 900, background: 'transparent' }} />}

      {/* recording indicator — tells the user we're capturing, and how to stop */}
      {listening && (
        <button onClick={stopListening} style={{ width: '100%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 18px', background: '#f1ecff', borderTop: '1px solid rgba(124,87,253,.18)' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff3b30', animation: 'recDot 1.2s infinite' }} />
          <RecWave />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.heading }}>Listening… tap to stop</span>
        </button>
      )}

      {/* input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: kbOpen ? '#ece9f7' : 'linear-gradient(180deg,rgba(255,255,255,0)0%,#ffffff 40%)', paddingBottom: kbOpen ? 12 : 26 }}>
        <div style={{ flex: 1, minWidth: 0, background: '#fff', borderRadius: 999, boxShadow: listening ? '0 0 0 2px rgba(124,87,253,.55), 0 2px 10px rgba(33,21,55,.10)' : '0 2px 10px rgba(33,21,55,.10)', padding: '6px 18px', display: 'flex', alignItems: 'center', transition: 'box-shadow .2s' }}>
          <input
            value={text}
            inputMode="none"
            onChange={e => setText(e.target.value)}
            onFocus={() => setKbOpen(true)}
            onMouseDown={() => setKbOpen(true)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder={listening ? 'Listening…' : 'Ask the coach'}
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: '#2b2b33', fontFamily: 'inherit', padding: '7px 0' }}
          />
        </div>
        {showSend
          ? <button onClick={send} aria-label="Send" style={circle(C.primary)}>{Ico.send()}</button>
          : <button onClick={toggleMic} aria-label="Voice input" title="Tap to speak" style={{ ...circle(listening ? C.primary : '#fff'), boxShadow: listening ? 'none' : '0 2px 10px rgba(33,21,55,.10)', animation: listening ? 'micPulse 1.4s infinite' : 'none' }}>{Ico.mic(listening ? '#fff' : C.primary)}</button>}
      </div>

      {kbOpen && <IosKeyboard onChar={onChar} onBackspace={() => setText(t => t.slice(0, -1))} onSpace={() => setText(t => t + ' ')} onReturn={send} onMic={toggleMic} shift={shift} onShift={() => setShift(s => !s)} listening={listening} />}
    </div>
  );
}

/* ------------------------------------------------ coach thread (shared) */
function Turn({ t, onChip }) {
  if (t.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '18px 0' }}>
        <div style={{ background: C.lavender, color: '#2b2b33', fontSize: 15.5, lineHeight: 1.4, padding: '11px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '78%' }}>{t.text}</div>
      </div>
    );
  }
  if (t.role === 'thinking') {
    return <div style={{ margin: '18px 0' }}><Thinking /></div>;
  }
  // coach
  return (
    <div style={{ margin: '18px 0' }}>
      {t.text && <div style={{ fontSize: 16, lineHeight: 1.45, color: C.text, maxWidth: '92%' }}>{t.text}</div>}
      {t.card === 'dinner' && <DinnerCard />}
      {t.chips && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          {t.chips.map((c, i) => <Chip key={i} label={c.label} primary={c.primary} onTap={() => onChip(c.id)} />)}
        </div>
      )}
      {t.thumbs && <Thumbs />}
    </div>
  );
}

function CoachThread({ turns, onChip, anchorKey }) {
  const ref = useRef(null);
  useEffect(() => {
    // anchor the last incoming coach turn near the top rather than auto-bottom
    requestAnimationFrame(() => {
      const el = ref.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [anchorKey]);
  return (
    <div ref={ref} style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 120px' }}>
      {turns.map((t, i) => <Turn key={i} t={t} onChip={onChip} />)}
    </div>
  );
}

/* ------------------------------------------------ flow 1 entry: active greeting */
function CoachActive({ onBack }) {
  const [turns, setTurns] = useState([
    { role: 'coach', text: 'Hi Andrii how can I help you today?', chips: [
      { id: 'whatsnext', label: "What's next" },
      { id: 'explain', label: 'Explain my result', primary: true },
    ], thumbs: true },
  ]);
  const [rev, setRev] = useState(0);

  function onChip(id) {
    if (id === 'explain') {
      setTurns(t => [...t.map(x => ({ ...x, chips: undefined, thumbs: false })),
        { role: 'user', text: 'Explain my result' },
        { role: 'coach', text: "You're in mixed fuel right now - not ideal, but your trend is moving more toward fat burn. Earlier dinners over the last three days helping drive this shift!", card: 'dinner' },
        { role: 'coach', text: 'Want to know what to do next?', chips: [
          { id: 'yes', label: 'Yes', primary: true },
          { id: 'nottoday', label: 'Not today' },
        ], thumbs: true },
      ]);
      setRev(r => r + 1);
    } else if (id === 'yes') {
      setTurns(t => [...t.map(x => ({ ...x, chips: undefined, thumbs: false })),
        { role: 'user', text: 'Yes' },
        { role: 'thinking' },
      ]);
      setRev(r => r + 1);
    }
  }

  function onSend(t) {
    setTurns(prev => [...stripThinking(prev), { role: 'user', text: t }, { role: 'thinking' }]);
    setRev(r => r + 1);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: SCREEN_BG, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <CoachHeader onBack={onBack} showAvatar />
      <CoachThread turns={turns} onChip={onChip} anchorKey={rev} />
      <InputBar onSend={onSend} />
    </div>
  );
}

/* ------------------------------------------------ flow 2 entry: fresh start */
function CoachFresh({ onBack }) {
  const [thread, setThread] = useState(null);
  const [rev, setRev] = useState(0);

  function startMixedFuel() {
    setThread([
      { role: 'user', text: 'Why am i on mixed fuel' },
      { role: 'coach', text: "You're in mixed fuel right now - not ideal, but your trend is moving more toward fat burn. Earlier dinners over the last three days helping drive this shift!", card: 'dinner' },
      { role: 'coach', text: 'Want to know what to do next?', chips: [
        { id: 'yes', label: 'Yes', primary: true },
        { id: 'nottoday', label: 'Not today' },
      ], thumbs: true },
    ]);
    setRev(r => r + 1);
  }

  function onChip(id) {
    if (id === 'yes') {
      setThread(t => [...t.map(x => ({ ...x, chips: undefined, thumbs: false })),
        { role: 'user', text: 'Yes' },
        { role: 'thinking' },
      ]);
      setRev(r => r + 1);
    }
  }

  function onSend(t) {
    setThread(prev => [...stripThinking(prev), { role: 'user', text: t }, { role: 'thinking' }]);
    setRev(r => r + 1);
  }

  if (thread) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: SCREEN_BG, display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <CoachHeader onBack={onBack} showAvatar />
        <CoachThread turns={thread} onChip={onChip} anchorKey={rev} />
        <InputBar onSend={onSend} />
      </div>
    );
  }

  const freshChips = [
    { label: 'Plan my evening', onTap: () => {} },
    { label: 'Suggest a meal', onTap: () => {} },
    { label: 'Why am i on mixed fuel?', onTap: startMixedFuel },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: SCREEN_BG, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <CoachHeader onBack={onBack} showAvatar={false} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '60px 30px 120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="assets/mita_avatar.png" alt="" style={{ width: 70, height: 70, borderRadius: '50%' }} />
        <div style={{ fontSize: 22, fontWeight: 600, color: '#2b2b33', marginTop: 18 }}>Fresh start, Andreii</div>
        <div style={{ fontSize: 15, color: C.variant, textAlign: 'center', marginTop: 8, lineHeight: 1.4, maxWidth: 240 }}>
          Ask me anything, or pick up where your body is right now
        </div>
        <div style={{ width: '100%', marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {freshChips.map((c, i) => (
            <button key={i} onClick={c.onTap} style={{
              width: '100%', border: `1.5px solid ${C.primary}`, background: 'transparent', color: C.primary,
              borderRadius: 999, padding: '13px 0', fontSize: 15, fontWeight: 600,
            }}>{c.label}</button>
          ))}
        </div>
      </div>
      <InputBar onSend={onSend} />
    </div>
  );
}

/* ============================================================= APP SHELL */
function App() {
  // route: 'today' | 'active' | 'fresh'
  const [route, setRoute] = useState('today');
  const [phoneKey, setPhoneKey] = useState(0); // remount to reset coach state

  function go(r) { setRoute(r); setPhoneKey(k => k + 1); }

  let screen;
  if (route === 'today') screen = <TodayScreen onContinueCoach={() => go('active')} onCoachTab={() => go('fresh')} />;
  else if (route === 'active') screen = <CoachActive onBack={() => go('today')} />;
  else screen = <CoachFresh onBack={() => go('today')} />;

  const demoBtn = (label, active, onClick) => (
    <button onClick={onClick} style={{
      display: 'block', width: '100%', textAlign: 'left', marginBottom: 8,
      background: active ? 'rgba(124,87,253,.22)' : 'rgba(255,255,255,.06)',
      border: `1px solid ${active ? 'rgba(124,87,253,.6)' : 'rgba(255,255,255,.12)'}`,
      color: '#fff', borderRadius: 10, padding: '10px 12px', fontSize: 13, fontWeight: 500,
    }}>{label}</button>
  );

  return (
    <React.Fragment>
      <style>{`@keyframes coachDot{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}}@keyframes coachFade{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}@keyframes micPulse{0%{box-shadow:0 0 0 0 rgba(124,87,253,.45)}70%{box-shadow:0 0 0 8px rgba(124,87,253,0)}100%{box-shadow:0 0 0 0 rgba(124,87,253,0)}}@keyframes recWave{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}@keyframes recDot{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      {/* phone frame */}
      <div style={{ width: 375, height: 812, borderRadius: 44, background: '#fff', boxShadow: '0 30px 80px rgba(0,0,0,.5)', position: 'relative', overflow: 'hidden', flexShrink: 0, border: '6px solid #111' }}>
        <div key={phoneKey} style={{ position: 'absolute', inset: 0 }}>{screen}</div>
      </div>

      {/* demo panel */}
      <div style={{ width: 220, background: 'rgba(20,20,24,.85)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 16, alignSelf: 'flex-start' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: '#8f8fa3', marginBottom: 12 }}>DEMO — AI COACH</div>
        <div style={{ fontSize: 11, color: '#7a7a8c', marginBottom: 6 }}>Flow 1 · Continue with coach</div>
        {demoBtn('① Today screen', route === 'today', () => go('today'))}
        {demoBtn('② Coach (tap "Continue with coach")', route === 'active', () => go('active'))}
        <div style={{ fontSize: 11, color: '#7a7a8c', margin: '14px 0 6px' }}>Flow 2 · Coach tab</div>
        {demoBtn('① Coach tab → Fresh start', route === 'fresh', () => go('fresh'))}
        <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '14px 0' }} />
        {demoBtn('↺ Reset to Today', false, () => go('today'))}
        <div style={{ fontSize: 11, color: '#6a6a7c', marginTop: 10, lineHeight: 1.5 }}>
          Tip: from Today, tap <b style={{ color: '#bba9ff' }}>Continue with coach</b> (flow 1) or the <b style={{ color: '#bba9ff' }}>Coach</b> tab (flow 2).
        </div>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
