// ============ INTERLUDE: DIVINING (between Act II and Act III) ============
function DivineSection({ name, teamCode, onComplete }) {
  const team = window.WC_TEAMS.find(t => t.code === teamCode);
  const [progress, setProgress] = React.useState(0);
  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const DURATION = 4200;

  const phases = React.useMemo(() => ([
    "Consulting the council…",
    "Shuffling the deck of destiny…",
    `Reading the vibes of ${team?.name ?? "the chosen"}…`,
    "Sealing the prophecy in wax…",
  ]), [team]);

  React.useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / DURATION);
      setProgress(p);
      setPhaseIdx(Math.min(phases.length - 1, Math.floor(p * phases.length)));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        setTimeout(onComplete, 700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Wandering flag preview
  const [flicker, setFlicker] = React.useState(team.flag);
  React.useEffect(() => {
    if (done) { setFlicker(team.flag); return; }
    const pool = window.WC_TEAMS.filter(t => t.code !== teamCode);
    const id = setInterval(() => {
      setFlicker(pool[Math.floor(Math.random() * pool.length)].flag);
    }, 140);
    return () => clearInterval(id);
  }, [done, teamCode, team.flag]);

  return (
    <div className="divine-wrap fade-in" data-screen-label="02b Divining — The Interlude">
      <div className="divine-stage">
        <div className={`d-ring ${done ? "locked" : ""}`}></div>
        <div className={`d-crystal ${done ? "locked" : ""}`}>
          <div className={`d-flag ${done ? "locked" : ""}`} key={done ? "lock" : "w"}>
            {flicker}
          </div>
        </div>
      </div>

      <div className="divine-copy">
        <div className="eyebrow">— The Oracle Deliberates —</div>
        <h2 className="divine-title headline">
          {done ? "It is seen." : "The vision sharpens…"}
        </h2>
        <div className="divine-phase" key={phaseIdx}>
          {done ? "Inscribing your certificate…" : phases[phaseIdx]}
        </div>
        <div className="divine-meter">
          <div className="divine-meter-bar" style={{width: `${progress * 100}%`}}></div>
          <div className="divine-meter-label">
            <span>{String(Math.floor(progress * 100)).padStart(3, "0")}%</span>
            <span>{name || "Anon"} · {team?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DivineSection = DivineSection;
