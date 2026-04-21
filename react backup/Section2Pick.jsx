// ============ SECTION 2: PICK TEAM ============
function PickSection({ name, selected, setSelected, onConfirm, onBack }) {
  const [filter, setFilter] = React.useState("ALL");
  const [query, setQuery] = React.useState("");

  const confeds = ["ALL", "UEFA", "CONMEBOL", "CONCACAF", "AFC", "CAF", "OFC"];
  const filtered = React.useMemo(() => {
    return window.WC_TEAMS.filter(t => {
      if (filter !== "ALL" && t.confed !== filter) return false;
      if (query && !t.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query]);

  const picked = selected ? window.WC_TEAMS.find(t => t.code === selected) : null;

  return (
    <div className="pick-wrap fade-in">
      <div className="pick-top">
        <button className="btn-quiet" onClick={onBack}>← Back to the threshold</button>
        <div className="brand-wisp">◈ Act II · The Choosing</div>
        <div style={{fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.3em", color: "var(--smoke)"}}>
          {name ? `SEER: ${name.toUpperCase()}` : ""}
        </div>
      </div>

      <div className="pick-title-block">
        <div className="eyebrow">— Choose One Nation —</div>
        <h1 className="pick-title headline">Upon whom shall the <span style={{color: "var(--gold-bright)", fontStyle: "italic"}}>trophy</span> fall?</h1>
        <p className="pick-sub">
          Forty-eight flags flutter in the metaphysical breeze. The oracle will record
          but one. Trust the pattern, the pang of instinct, the sudden conviction —
          or whichever nation your uncle insists upon at dinner.
        </p>
      </div>

      <div className="pick-controls">
        {confeds.map(c => (
          <button
            key={c}
            className={`chip ${filter === c ? "active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c === "ALL" ? `All · 48` : c}
          </button>
        ))}
      </div>

      <div style={{display: "flex", justifyContent: "center", marginBottom: 20}}>
        <input
          type="text"
          placeholder="⌕  search a nation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            background: "transparent",
            border: "1px solid var(--rule)",
            borderRadius: 2,
            padding: "10px 16px",
            color: "var(--vellum)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            letterSpacing: "0.1em",
            width: 260,
            outline: "none",
            textAlign: "center"
          }}
        />
      </div>

      <div className="team-grid">
        {filtered.map(t => (
          <button
            key={t.code}
            className={`team-card ${selected === t.code ? "selected" : ""}`}
            onClick={() => setSelected(t.code)}
          >
            {selected === t.code && <div className="check">✓</div>}
            <div className="flag">{t.flag}</div>
            <div>
              <div className="t-name">{t.name}</div>
              <div className="t-confed">{t.confed}</div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{textAlign: "center", padding: 40, fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--smoke)"}}>
          No nation found. The oracle is perplexed.
        </div>
      )}

      {picked && (
        <div className="pick-confirm">
          <div className="pick-confirm-inner">
            <div className="picked">
              <div className="flag">{picked.flag}</div>
              <div className="txt">
                <div className="eyebrow">Your Prophecy</div>
                <div className="n">{picked.name} lifts the trophy</div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={onConfirm} style={{padding: "14px 20px"}}>
              Seal it ◈
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

window.PickSection = PickSection;
