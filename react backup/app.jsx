// ============ APP SHELL ============
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "countdownMode": "final",
  "certStyle": "parchment"
}/*EDITMODE-END*/;

function App() {
  const [step, setStep] = React.useState(() => {
    try { return localStorage.getItem("oracle.step") || "home"; } catch { return "home"; }
  });
  const [name, setName] = React.useState(() => {
    try { return localStorage.getItem("oracle.name") || ""; } catch { return ""; }
  });
  const [selected, setSelected] = React.useState(() => {
    try { return localStorage.getItem("oracle.team") || null; } catch { return null; }
  });

  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = React.useState(false);

  // Persist state
  React.useEffect(() => { try { localStorage.setItem("oracle.step", step); } catch {} }, [step]);
  React.useEffect(() => { try { localStorage.setItem("oracle.name", name); } catch {} }, [name]);
  React.useEffect(() => { try { if (selected) localStorage.setItem("oracle.team", selected); } catch {} }, [selected]);

  // Edit mode protocol
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "__activate_edit_mode") setEditMode(true);
      if (d.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const updateTweak = (k, v) => {
    setTweaks(prev => {
      const next = { ...prev, [k]: v };
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
      return next;
    });
  };

  const handleRestart = () => {
    setStep("home");
    setSelected(null);
    try { localStorage.removeItem("oracle.team"); } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEvent = (e) => {
    e.preventDefault();
    // Simulated event site redirect
    const ok = confirm("About to depart the oracle's chamber for the Event Site.\n\n[This is a prototype — the real redirect would take you to the World Cup event page.]\n\nContinue?");
    if (ok) {
      // window.location.href = "https://example.com/world-cup-event";
    }
  };

  return (
    <div className="stage" data-screen-label={
      step === "home" ? "01 Home — Invocation" :
      step === "pick" ? "02 Pick — The Choosing" :
      step === "divine" ? "02b Divining — Interlude" :
      "03 Result — The Ledger"
    }>
      <div className="starfield"></div>

      {step === "home" && (
        <HomeSection
          countdownMode={tweaks.countdownMode}
          name={name}
          setName={setName}
          onBegin={() => {
            setStep("pick");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />
      )}

      {step === "pick" && (
        <PickSection
          name={name}
          selected={selected}
          setSelected={setSelected}
          onConfirm={() => {
            setStep("divine");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          onBack={() => setStep("home")}
        />
      )}

      {step === "divine" && selected && (
        <DivineSection
          name={name}
          teamCode={selected}
          onComplete={() => {
            setStep("result");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />
      )}

      {step === "result" && selected && (
        <ResultSection
          name={name}
          teamCode={selected}
          onRestart={handleRestart}
          onEvent={handleEvent}
          certStyle={tweaks.certStyle}
        />
      )}

      {editMode && (
        <div className="tweaks">
          <h4>
            <span>◈ Tweaks</span>
            <span style={{color: "var(--smoke-dim)"}}>v1</span>
          </h4>
          <div className="tw-row">
            <label>Countdown target</label>
            <div className="tw-opts">
              <button
                className={`tw-opt ${tweaks.countdownMode === "opening" ? "on" : ""}`}
                onClick={() => updateTweak("countdownMode", "opening")}
              >Opener</button>
              <button
                className={`tw-opt ${tweaks.countdownMode === "final" ? "on" : ""}`}
                onClick={() => updateTweak("countdownMode", "final")}
              >Final</button>
            </div>
          </div>
          <div className="tw-row">
            <label>Certificate style</label>
            <div className="tw-opts">
              <button
                className={`tw-opt ${tweaks.certStyle === "parchment" ? "on" : ""}`}
                onClick={() => updateTweak("certStyle", "parchment")}
              >Parchment</button>
              <button
                className={`tw-opt ${tweaks.certStyle === "noir" ? "on" : ""}`}
                onClick={() => updateTweak("certStyle", "noir")}
              >Midnight</button>
            </div>
          </div>
          <div className="tw-row">
            <label>Jump to section</label>
            <div className="tw-opts">
              <button className={`tw-opt ${step === "home" ? "on" : ""}`} onClick={() => setStep("home")}>1</button>
              <button
                className={`tw-opt ${step === "pick" ? "on" : ""}`}
                onClick={() => { if (!name) setName("Seer of Taipei"); setStep("pick"); }}
              >2</button>
              <button
                className={`tw-opt ${step === "divine" ? "on" : ""}`}
                onClick={() => {
                  if (!name) setName("Seer of Taipei");
                  if (!selected) setSelected("ARG");
                  setStep("divine");
                }}
              >⚯</button>
              <button
                className={`tw-opt ${step === "result" ? "on" : ""}`}
                onClick={() => {
                  if (!name) setName("Seer of Taipei");
                  if (!selected) setSelected("ARG");
                  setStep("result");
                }}
              >3</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
