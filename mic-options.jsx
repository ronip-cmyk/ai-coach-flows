const { useState, useRef, useEffect } = React;

/* ----------------------------------------------------------------- tokens */
const C = { primary: '#7c57fd', heading: '#2f2b56', variant: '#666' };
const SCREEN_BG = 'linear-gradient(180deg,#e7e6f6 0%,#eeeef8 40%,#fbfbfe 100%)';

/* ------------------------------------------------------- speech recognition */
const SpeechRec = (typeof window !== 'undefined') && (window.SpeechRecognition || window.webkitSpeechRecognition);
let activeRec = null;
function startRec({ seed = '', onText, onEnd }) {
  if (!SpeechRec) { alert("Voice input isn't supported here — try Chrome, Edge, or Safari."); return false; }
  if (activeRec) { try { activeRec.stop(); } catch (e) {} }
  const rec = new SpeechRec();
  rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = false;
  let base = seed ? seed + ' ' : '';
  rec.onresult = (e) => {
    let interim = '', finals = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finals += r[0].transcript; else interim += r[0].transcript;
    }
    if (finals) base += finals;
    onText((base + interim).replace(/\s+/g, ' ').trimStart());
  };
  rec.onend = () => { activeRec = null; onEnd(); };
  rec.onerror = () => { activeRec = null; onEnd(); };
  activeRec = rec;
  try { rec.start(); return true; } catch (e) { activeRec = null; onEnd(); return false; }
}
function stopRec() { if (activeRec) { try { activeRec.stop(); } catch (e) {} } }

/* ----------------------------------------------------------------- icons */
const mic = (c, s = 22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <rect x="9" y="3" width="6" height="11" rx="3" stroke={c} strokeWidth="1.8" />
    <path d="M5 11a7 7 0 0014 0M12 18v3" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const send = (c = '#fff') => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 12l16-8-6 8 6 8-16-8z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 12l10 0" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const waveform = (c) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
    <path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" />
  </svg>
);
const keyboard = (c) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round">
    <rect x="2.5" y="6" width="19" height="12" rx="2" /><path d="M6 9h0M9 9h0M12 9h0M15 9h0M18 9h0M6 12h0M9 12h0M12 12h0M15 12h0M18 12h0M8 15h8" />
  </svg>
);

/* a tiny coach context line shown above each bar */
function CoachContext() {
  return (
    <div style={{ padding: '18px 18px 10px' }}>
      <div style={{ fontSize: 13, color: '#8a8a96', marginBottom: 8 }}>Coach</div>
      <div style={{ fontSize: 14.5, color: '#3d3d3d', lineHeight: 1.4, maxWidth: '88%' }}>
        You're in mixed fuel right now — want to tell me what you had for lunch?
      </div>
    </div>
  );
}

/* generic input shell used by several variants */
const pill = (extra = {}) => ({ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 999, boxShadow: '0 2px 10px rgba(33,21,55,.10)', padding: '6px 8px 6px 18px', transition: 'box-shadow .2s', ...extra });
const inputStyle = { flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: '#2b2b33', fontFamily: 'inherit' };
const circle = (bg) => ({ width: 46, height: 46, borderRadius: '50%', background: bg, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

/* =========================================================== OPTION 1 — adaptive */
function AdaptiveBar() {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const has = text.trim().length > 0;
  function onMic() { listening ? stopRec() : (startRec({ seed: text, onText: setText, onEnd: () => setListening(false) }) && setListening(true)); }
  function onSend() { setText(''); }
  return (
    <div style={barWrap}>
      <div style={pill(listening ? { boxShadow: '0 0 0 2px rgba(124,87,253,.55),0 2px 10px rgba(33,21,55,.10)' } : {})}>
        <input style={inputStyle} value={text} onChange={e => setText(e.target.value)} placeholder={listening ? 'Listening…' : 'Ask the coach'} />
      </div>
      {has && !listening
        ? <button aria-label="Send" onClick={onSend} style={circle(C.primary)}>{send()}</button>
        : <button aria-label="Voice input" onClick={onMic} style={{ ...circle(listening ? C.primary : '#fff'), boxShadow: listening ? 'none' : '0 2px 10px rgba(33,21,55,.10)', animation: listening ? 'mp 1.4s infinite' : 'none' }}>{mic(listening ? '#fff' : C.primary)}</button>}
    </div>
  );
}

/* =========================================================== OPTION 2 — dictation + voice mode */
function DualBar() {
  const [text, setText] = useState('');
  const [dictating, setDictating] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const has = text.trim().length > 0;
  function onDictate() { dictating ? stopRec() : (startRec({ seed: text, onText: setText, onEnd: () => setDictating(false) }) && setDictating(true)); }
  function onVoice() { setVoiceMode(true); startRec({ onText: setText, onEnd: () => setVoiceMode(false) }); }
  return (
    <div style={{ position: 'relative' }}>
      <div style={barWrap}>
        <div style={pill(dictating ? { boxShadow: '0 0 0 2px rgba(124,87,253,.55),0 2px 10px rgba(33,21,55,.10)' } : {})}>
          <input style={inputStyle} value={text} onChange={e => setText(e.target.value)} placeholder={dictating ? 'Listening…' : 'Ask the coach'} />
          <button aria-label="Dictate" onClick={onDictate} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: dictating ? C.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{mic(dictating ? '#fff' : '#3d3d3d', 20)}</button>
        </div>
        {has
          ? <button aria-label="Send" onClick={() => setText('')} style={circle(C.primary)}>{send()}</button>
          : <button aria-label="Voice mode" onClick={onVoice} style={circle('#efeaff')}>{waveform(C.primary)}</button>}
      </div>
      {voiceMode && (
        <div onClick={() => { stopRec(); }} style={{ position: 'absolute', inset: 0, bottom: -12, top: -140, background: 'rgba(247,245,255,.97)', borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'mp 1.4s infinite' }}>{mic('#fff', 36)}</div>
          <div style={{ color: C.heading, fontWeight: 600 }}>Listening… tap to stop</div>
          <div style={{ color: C.variant, fontSize: 13, maxWidth: 220, textAlign: 'center' }}>{text || 'Talk to your coach'}</div>
        </div>
      )}
    </div>
  );
}

/* =========================================================== OPTION 3 — polished in-field */
function PolishedBar() {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const has = text.trim().length > 0;
  function onMic() { listening ? stopRec() : (startRec({ seed: text, onText: setText, onEnd: () => setListening(false) }) && setListening(true)); }
  return (
    <div style={barWrap}>
      <div style={pill(listening ? { boxShadow: '0 0 0 2px rgba(124,87,253,.55),0 2px 10px rgba(33,21,55,.10)' } : {})}>
        <input style={inputStyle} value={text} onChange={e => setText(e.target.value)} placeholder={listening ? 'Listening…' : 'Ask the coach'} />
        <button aria-label="Voice input" onClick={onMic} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: listening ? C.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: listening ? 'mp 1.4s infinite' : 'none' }}>{mic(listening ? '#fff' : '#3d3d3d')}</button>
      </div>
      {has && <button aria-label="Send" onClick={() => setText('')} style={circle(C.primary)}>{send()}</button>}
    </div>
  );
}

/* =========================================================== OPTION 4 — voice-first */
function VoiceFirstBar() {
  const [mode, setMode] = useState('voice'); // 'voice' | 'type'
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  function onTalk() { listening ? stopRec() : (startRec({ seed: text, onText: setText, onEnd: () => setListening(false) }) && setListening(true)); }
  if (mode === 'type') {
    return (
      <div style={{ padding: '10px 16px 18px' }}>
        <div style={barWrap}>
          <div style={pill()}><input style={inputStyle} value={text} onChange={e => setText(e.target.value)} placeholder="Type your message" autoFocus /></div>
          <button aria-label="Send" onClick={() => setText('')} style={circle(C.primary)}>{send()}</button>
        </div>
        <div onClick={() => setMode('voice')} style={{ textAlign: 'center', marginTop: 10, color: C.primary, fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>{mic(C.primary, 15)} talk instead</div>
      </div>
    );
  }
  return (
    <div style={{ padding: '10px 16px 18px' }}>
      <button onClick={onTalk} style={{ width: '100%', border: 'none', borderRadius: 999, padding: '15px 0', background: listening ? C.primary : '#fff', boxShadow: '0 2px 12px rgba(33,21,55,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: listening ? '#fff' : C.heading, fontSize: 15, fontWeight: 600, animation: listening ? 'mp 1.4s infinite' : 'none' }}>
        {mic(listening ? '#fff' : C.primary)} {listening ? (text || 'Listening…') : 'Tap to talk to your coach'}
      </button>
      <div onClick={() => { stopRec(); setMode('type'); }} style={{ textAlign: 'center', marginTop: 10, color: C.variant, fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>{keyboard(C.variant)} type instead</div>
    </div>
  );
}

/* =========================================================== OPTION 5 — hold to talk */
function HoldToTalkBar() {
  const [text, setText] = useState('');
  const [holding, setHolding] = useState(false);
  const has = text.trim().length > 0;
  function down(e) { e.preventDefault(); if (startRec({ seed: text, onText: setText, onEnd: () => setHolding(false) })) setHolding(true); }
  function up() { if (holding) stopRec(); }
  return (
    <div style={barWrap}>
      <div style={pill(holding ? { boxShadow: '0 0 0 2px rgba(124,87,253,.55),0 2px 10px rgba(33,21,55,.10)', background: '#f3f0ff' } : {})}>
        <input style={inputStyle} value={text} onChange={e => setText(e.target.value)} placeholder={holding ? 'Recording… release to stop' : 'Hold the mic to talk, or type'} />
      </div>
      {has && !holding
        ? <button aria-label="Send" onClick={() => setText('')} style={circle(C.primary)}>{send()}</button>
        : <button aria-label="Hold to talk" onPointerDown={down} onPointerUp={up} onPointerLeave={up} style={{ ...circle(holding ? C.primary : '#fff'), boxShadow: holding ? 'none' : '0 2px 10px rgba(33,21,55,.10)', transform: holding ? 'scale(1.12)' : 'none', transition: 'transform .12s', animation: holding ? 'mp 1.2s infinite' : 'none', touchAction: 'none' }}>{mic(holding ? '#fff' : C.primary)}</button>}
    </div>
  );
}

const barWrap = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 18px' };

/* ----------------------------------------------------------------- card */
const OPTIONS = [
  { n: 1, name: 'Adaptive button', rec: true, Comp: AdaptiveBar,
    why: 'One right button: mic when empty → send once you type. The iMessage/WhatsApp standard.',
    pros: ['Fewest controls, no redundancy', '46px tap target', 'Mic is primary when idle — good for a voice-led coach'] },
  { n: 2, name: 'Dictation mic + Voice mode', Comp: DualBar,
    why: "Full ChatGPT layout — in-field mic dictates; the waveform button opens an immersive 'talk to coach' overlay.",
    pros: ['Two clear, separate jobs', 'Showcases a hands-free voice mode', 'Most capable'], cons: ['Busiest bar — 3 controls'] },
  { n: 3, name: 'Polished current placement', Comp: PolishedBar,
    why: 'Keep the mic inside the field (where it is now); just fix the issues.',
    pros: ['Smallest change from today', 'Send hidden until there’s text', '44px mic target'] },
  { n: 4, name: "Voice-first ‘Tap to talk’", Comp: VoiceFirstBar,
    why: 'Lead with voice. A full-width talk button; “type instead” reveals the keyboard field.',
    pros: ['Strongest voice statement', 'Huge tap target', 'Great for hands-busy moments'], cons: ['Typing is one tap away, not default'] },
  { n: 5, name: 'Hold to talk', Comp: HoldToTalkBar,
    why: 'Press-and-hold the mic to record, release to stop (WhatsApp voice-note feel). Tap field to type.',
    pros: ['No accidental always-on listening', 'Familiar gesture'], cons: ['Hold gesture is less obvious; needs a hint'] },
];

function Card({ o, selected, onSelect }) {
  const { Comp } = o;
  return (
    <div style={{ background: '#16161b', border: `1px solid ${selected ? 'rgba(124,87,253,.7)' : 'rgba(255,255,255,.09)'}`, borderRadius: 20, overflow: 'hidden', boxShadow: selected ? '0 0 0 2px rgba(124,87,253,.4)' : 'none' }}>
      <div style={{ padding: '16px 18px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{o.n}. {o.name}</span>
          {o.rec && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: .5, color: '#cdbcff', background: 'rgba(124,87,253,.22)', borderRadius: 6, padding: '3px 7px' }}>RECOMMENDED</span>}
        </div>
        <div style={{ fontSize: 13, color: '#9a9aaa', marginTop: 6, lineHeight: 1.45 }}>{o.why}</div>
      </div>
      {/* mini screen */}
      <div style={{ margin: '12px 14px', borderRadius: 16, overflow: 'hidden', background: SCREEN_BG, border: '1px solid rgba(0,0,0,.05)' }}>
        <CoachContext />
        <Comp />
      </div>
      <div style={{ padding: '0 18px 16px' }}>
        <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {o.pros.map((p, i) => <li key={i} style={{ fontSize: 12.5, color: '#c9c9d4', display: 'flex', gap: 7 }}><span style={{ color: '#7dd39a' }}>+</span>{p}</li>)}
          {(o.cons || []).map((p, i) => <li key={i} style={{ fontSize: 12.5, color: '#9a9aaa', display: 'flex', gap: 7 }}><span style={{ color: '#e0a06a' }}>−</span>{p}</li>)}
        </ul>
        <button onClick={() => onSelect(o.n)} style={{ marginTop: 14, width: '100%', borderRadius: 10, padding: '10px 0', fontSize: 13.5, fontWeight: 600, border: selected ? 'none' : `1.5px solid ${C.primary}`, background: selected ? C.primary : 'transparent', color: '#fff' }}>
          {selected ? '✓ Selected — tell Claude to build this' : 'I want this one'}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [sel, setSel] = useState(null);
  return (
    <React.Fragment>
      <style>{`@keyframes mp{0%{box-shadow:0 0 0 0 rgba(124,87,253,.5)}70%{box-shadow:0 0 0 12px rgba(124,87,253,0)}100%{box-shadow:0 0 0 0 rgba(124,87,253,0)}}`}</style>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -.3 }}>Voice input — 5 options</div>
        <div style={{ fontSize: 14, color: '#9a9aaa', marginTop: 8, lineHeight: 1.5 }}>
          Each bar below is live — tap the mic / hold to talk and it really transcribes (allow mic access; works best in Chrome over HTTPS). Try them, then hit “I want this one”.
        </div>
        {!SpeechRec && <div style={{ marginTop: 12, fontSize: 12.5, color: '#e0a06a', background: 'rgba(224,160,106,.12)', borderRadius: 8, padding: '8px 12px' }}>Heads-up: this browser doesn’t expose speech recognition — the layouts still work, but live transcription needs Chrome/Edge/Safari.</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 22 }}>
          {OPTIONS.map(o => <Card key={o.n} o={o} selected={sel === o.n} onSelect={setSel} />)}
        </div>
        {sel && <div style={{ position: 'sticky', bottom: 12, marginTop: 18, background: C.primary, borderRadius: 12, padding: '12px 16px', fontSize: 13.5, fontWeight: 600, textAlign: 'center' }}>You picked option {sel}. Tell Claude “build option {sel}” and I’ll ship it to the prototype.</div>}
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
