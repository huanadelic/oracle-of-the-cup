// ============ SECTION 3: RESULT ============
function Certificate({ name, team, date, ordinal, certStyle }) {
  const dateStr = date.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
  return (
    <div className="certificate-frame fade-in">
      <div className="certificate" style={certStyle === "noir" ? {
        background: "radial-gradient(ellipse at 50% 0%, rgba(227,191,106,0.15), transparent 70%), linear-gradient(175deg, #1a1838 0%, #0f0f22 100%)",
        color: "#f4ebd3"
      } : {}}>
        {/* corners */}
        <svg className="cert-corner tl" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M1,20 Q1,1 20,1 M1,12 Q1,5 12,5 M8,20 Q8,8 20,8" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        </svg>
        <svg className="cert-corner tr" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M1,20 Q1,1 20,1 M1,12 Q1,5 12,5 M8,20 Q8,8 20,8" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        </svg>
        <svg className="cert-corner bl" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M1,20 Q1,1 20,1 M1,12 Q1,5 12,5 M8,20 Q8,8 20,8" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        </svg>
        <svg className="cert-corner br" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M1,20 Q1,1 20,1 M1,12 Q1,5 12,5 M8,20 Q8,8 20,8" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        </svg>

        <div className="cert-inner">
          <div className="cert-seal">
            <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="30" cy="30" r="28" strokeDasharray="1.5 2" />
              <circle cx="30" cy="30" r="22" />
              <circle cx="30" cy="30" r="14" />
              <path d="M30,18 L32,26 L40,26 L34,30 L36,38 L30,33 L24,38 L26,30 L20,26 L28,26 Z" fill="currentColor" opacity="0.6"/>
              <path d="M8,30 L2,30 M52,30 L58,30 M30,2 L30,8 M30,52 L30,58" strokeWidth="0.6"/>
            </svg>
          </div>
          <div className="cert-title">The Oracle Bears Witness</div>
          <div className="cert-title-main">Prophecy of a Champion</div>

          <div className="cert-divider">
            <span style={{fontFamily: "var(--serif)", fontSize: 12}}>✦ ANNO MMXXVI ✦</span>
          </div>

          <div className="cert-preamble">
            Let it be known, on this day and henceforth forevermore, that the following seer did in solemn ceremony declare —
          </div>

          <div className="cert-name">{name || "An Anonymous Seer"}</div>

          <div className="cert-midtext">— doth foretell that the World Cup shall be lifted by —</div>

          <div className="cert-team">
            <span className="flag">{team.flag}</span>
            <span>{team.name}</span>
          </div>

          <div style={{fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, color: certStyle === "noir" ? "var(--smoke)" : "#4a3a1a", marginTop: 6}}>
            on the fields of North America, summer of 2026.
          </div>

          <div className="cert-foot">
            <div className="cert-foot-item">
              <div className="k">Inscribed</div>
              <div className="v">{dateStr}</div>
            </div>
            <div className="cert-foot-sig">
              <div className="sigline">~ Oracle of the Cup ~</div>
              <div className="k">Countersigned</div>
            </div>
            <div className="cert-foot-item">
              <div className="k">Ledger № </div>
              <div className="v">{String(ordinal).padStart(6, "0")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Distribution({ weights, selectedCode, expanded, onToggle }) {
  const sorted = React.useMemo(() => {
    const arr = window.WC_TEAMS.map(t => ({
      ...t,
      count: weights[t.code] || 10
    }));
    arr.sort((a, b) => b.count - a.count);
    const total = arr.reduce((s, x) => s + x.count, 0);
    return { arr, total };
  }, [weights]);

  const max = sorted.arr[0]?.count || 1;
  const selectedIdx = sorted.arr.findIndex(t => t.code === selectedCode);
  const topN = expanded ? sorted.arr : sorted.arr.slice(0, 10);

  const rows = [...topN];
  if (!expanded && selectedIdx >= 10) {
    rows.push(sorted.arr[selectedIdx]);
  }

  return (
    <div className="section-card">
      <div className="section-hdr">
        <div className="eyebrow">— The Collective Augury —</div>
        <h2>How the council has cast its lots</h2>
      </div>

      <div className="dist">
        {rows.map((t, i) => {
          const realIdx = sorted.arr.findIndex(x => x.code === t.code);
          const pct = (t.count / sorted.total) * 100;
          const barPct = (t.count / max) * 100;
          const isYou = t.code === selectedCode;
          return (
            <div key={t.code} className={`dist-row ${isYou ? "you" : ""}`}>
              <div className="rk">{realIdx + 1}</div>
              <div className="fl">{t.flag}</div>
              <div className="bar-wrap">
                <div className="bar" style={{width: `${barPct}%`}}></div>
                <div className="label">
                  {t.name}
                  {isYou && <span className="you-tag">You</span>}
                </div>
              </div>
              <div className="pct">{pct.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>

      <div className="dist-fold">
        <button className="btn-quiet" onClick={onToggle}>
          {expanded ? "↑ Fold the scroll" : `↓ Reveal all 48 nations`}
        </button>
      </div>
    </div>
  );
}

function ResultSection({ name, teamCode, onRestart, onEvent, certStyle }) {
  const team = window.WC_TEAMS.find(t => t.code === teamCode);
  const [expanded, setExpanded] = React.useState(false);

  const { ordinal, daysToFinal } = React.useMemo(() => {
    // Stable pseudo-ordinal based on team's existing weight + a small jitter from name hash
    const base = (window.WC_WEIGHTS[teamCode] || 100);
    const hash = (name || "").split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);
    const ordinal = base + (Math.abs(hash) % 73) + 1;
    const WC_FINAL = new Date("2026-07-19T20:00:00-05:00").getTime();
    const days = Math.max(0, Math.ceil((WC_FINAL - Date.now()) / 86400000));
    return { ordinal, daysToFinal: days };
  }, [teamCode, name]);

  const teamShort = team.name.length > 18 ? team.code : team.name;

  // Pick a flavor omen based on team ranking
  const rank = React.useMemo(() => {
    const arr = window.WC_TEAMS.map(t => ({ code: t.code, count: window.WC_WEIGHTS[t.code] || 10 }))
      .sort((a, b) => b.count - a.count);
    return arr.findIndex(x => x.code === teamCode) + 1;
  }, [teamCode]);

  const flavor = rank <= 3
    ? "A safe harbor, chosen by many. Your vision aligns with the multitudes — comforting, or suspicious, depending on temperament."
    : rank <= 8
    ? "A respectable augury. The tea leaves bend toward possibility; the bookmakers cautiously nod."
    : rank <= 20
    ? "A bold reading. Should this come to pass, songs will be written and uncles will grumble."
    : "A prophecy of the highest order — the kind whispered in back rooms by those who refuse to be ordinary. History rewards the audacious.";

  return (
    <div className="result-wrap fade-in">
      <div className="result-top">
        <div className="brand-wisp">◈ Act III · The Ledger</div>
        <div style={{fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.3em", color: "var(--smoke)"}}>
          SEALED · {new Date().toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"}).toUpperCase()}
        </div>
      </div>

      <div className="result-hero">
        <div className="eyebrow">— The Prophecy is Cast —</div>
        <h1>It is written.</h1>
        <div className="lede">
          The oracle has sealed your vision in wax and parchment. Below lies your
          certificate, your standing among the faithful, and the reading of the leaves.
        </div>
      </div>

      <Certificate
        name={name}
        team={team}
        date={new Date()}
        ordinal={ordinal}
        certStyle={certStyle}
      />

      <div className="omen">
        <div className="omen-lines">
          <div className="omen-line">
            <div className="marker">I.</div>
            <div className="text">
              Thou art the <span className="num">{ordinal.toLocaleString()}ᵗʰ</span> seer
              to foretell a <span className="hi">{team.name}</span> triumph in the Year of the Cup.
            </div>
          </div>
          <div className="omen-line">
            <div className="marker">II.</div>
            <div className="text">
              Thy prophecy was inscribed <span className="num">{daysToFinal}</span> days
              before the final whistle at the Estadio Azteca.
            </div>
          </div>
          <div className="omen-line">
            <div className="marker">III.</div>
            <div className="text">{flavor}</div>
          </div>
          <div className="omen-line">
            <div className="marker">◈</div>
            <div className="text" style={{color: "var(--gold-bright)", fontStyle: "normal", fontFamily: "var(--serif)", fontSize: 18, letterSpacing: "0.05em"}}>
              Should it come to pass, remember: you saw it first.
            </div>
          </div>
        </div>
      </div>

      <Distribution
        weights={window.WC_WEIGHTS}
        selectedCode={teamCode}
        expanded={expanded}
        onToggle={() => setExpanded(e => !e)}
      />

      <div className="result-ctas">
        <button className="btn btn-ghost" onClick={onRestart}>↺ Prophesy Again</button>
        <a className="btn btn-primary" href="#event-site" onClick={onEvent}>
          Enter the Event Site →
        </a>
      </div>

      <div style={{textAlign: "center", marginTop: 28, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.3em", color: "var(--smoke-dim)"}}>
        ✦ SHARE THY PROPHECY · #ORACLEOFTHECUP ✦
      </div>
    </div>
  );
}

window.ResultSection = ResultSection;
