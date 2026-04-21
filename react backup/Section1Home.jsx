// ============ SECTION 1: HOME (Oracle invocation) ============
const { useState, useEffect, useMemo, useRef } = React;

function Countdown({ targetDate, label }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetDate - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <>
      <div className="countdown">
        <div className="unit"><div className="num">{days}</div><div className="lbl">Days</div></div>
        <div className="unit"><div className="num">{pad(hours)}</div><div className="lbl">Hours</div></div>
        <div className="unit"><div className="num">{pad(mins)}</div><div className="lbl">Minutes</div></div>
        <div className="unit"><div className="num">{pad(secs)}</div><div className="lbl">Seconds</div></div>
      </div>
      <div className="countdown-caption">{label}</div>
    </>
  );
}

function OracleEye() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="50" cy="50" r="48" strokeDasharray="2 3" opacity="0.6" />
      <circle cx="50" cy="50" r="38" />
      <path d="M10,50 Q50,15 90,50 Q50,85 10,50 Z" />
      <circle cx="50" cy="50" r="12" fill="currentColor" />
      <circle cx="50" cy="50" r="4" fill="#0a0a1a" />
      <path d="M50,6 L50,14 M50,86 L50,94 M6,50 L14,50 M86,50 L94,50" strokeWidth="0.8" />
      <path d="M22,22 L28,28 M72,72 L78,78 M22,78 L28,72 M72,28 L78,22" strokeWidth="0.8" />
    </svg>
  );
}

function HomeSection({ countdownMode, onBegin, name, setName }) {
  const WC_FINAL = new Date("2026-07-19T20:00:00-05:00").getTime();
  const WC_OPEN = new Date("2026-06-11T19:00:00-06:00").getTime();
  const target = countdownMode === "final" ? WC_FINAL : WC_OPEN;
  const caption = countdownMode === "final"
    ? "Until the Final Whistle · Estadio Azteca · Mexico City"
    : "Until the Opening Whistle · Estadio Azteca · Mexico City";

  return (
    <div className="home-wrap fade-in">
      <div className="home-header">
        <div className="brand-wisp">◈ Oracle of the Cup</div>
        <div className="brand-wisp" style={{color: "var(--smoke-dim)"}}>MMXXVI</div>
      </div>

      <div className="home-inner">
        <div className="home-eye"><OracleEye /></div>

        <div className="eyebrow" style={{marginBottom: 18}}>— An Augury in Three Acts —</div>

        <h1 className="home-title headline">
          Foretell the
          <span className="em">Champion.</span>
        </h1>

        <p className="home-sub">
          <span className="tag">Est. by the Council of Pundits · 2026</span>
          Tea leaves are read. Stars are aligned. Long before the first whistle,
          the oracle demands a name and a nation. Declare yours — and let the
          record show you were right all along.
        </p>

        <Countdown targetDate={target} label={caption} />

        <div className="name-field">
          <label htmlFor="oracle-name">Inscribe Thy Name into the Ledger</label>
          <input
            id="oracle-name"
            type="text"
            maxLength={32}
            placeholder="e.g. Seer of Suburbia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onBegin(); }}
          />
        </div>

        <button
          className="btn btn-primary"
          disabled={!name.trim()}
          onClick={onBegin}
        >
          ◈ Begin the Prophecy
        </button>

        <div style={{marginTop: 28, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.3em", color: "var(--smoke-dim)", textTransform: "uppercase"}}>
          No login · No refunds · Results non-binding with reality
        </div>
      </div>

      <div className="footer-wisp">✦ 48 nations · 1 trophy · 104 matches · ∞ opinions ✦</div>
    </div>
  );
}

window.HomeSection = HomeSection;
