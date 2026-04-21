/**
 * script.js — Oracle of the Cup · Vanilla JS
 * 未來串 Supabase 時，在此 import supabase.js 模組
 */
import { WC_TEAMS, WC_WEIGHTS } from './teams.js';

/* ── Lucide icons（CDN ESM）─────────────────────────────── */
import {
  createIcons,
  ArrowLeft,    // btn-back
  RotateCcw,    // btn-restart
  ArrowRight,   // btn-event
  Feather,      // btn-begin / btn-confirm
  Check,        // team-card 選取勾
  ChevronDown,  // dist-toggle 展開
  ChevronUp,    // dist-toggle 收合
} from 'https://cdn.jsdelivr.net/npm/lucide@latest/dist/esm/lucide.js';

/* 需要用到哪個 icon 就在這裡加，保持精簡 */
const LUCIDE_ICONS = {
  ArrowLeft, RotateCcw, ArrowRight,
  Feather, Check,
  ChevronDown, ChevronUp,
};

/** 將頁面上所有 <i data-lucide="..."> 替換成 SVG */
function applyIcons() {
  createIcons({ icons: LUCIDE_ICONS, attrs: { 'stroke-width': '2' } });
}

/* ═══════════════════════════════════════════════════════════
   LocalStorage helpers
   ═══════════════════════════════════════════════════════════ */
const store = {
  get: (k)    => { try { return localStorage.getItem(k); }    catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); }       catch {} },
  del: (k)    => { try { localStorage.removeItem(k); }        catch {} },
};

/* ═══════════════════════════════════════════════════════════
   應用程式狀態
   ═══════════════════════════════════════════════════════════ */
const state = {
  step:         store.get('oracle.step') || 'home',
  name:         store.get('oracle.name') || '',
  team:         store.get('oracle.team') || null,
  filter:       'ALL',
  distExpanded: false,
};

/* ═══════════════════════════════════════════════════════════
   日期常數
   ═══════════════════════════════════════════════════════════ */
const WC_FINAL = new Date('2026-07-20T03:00:00+08:00').getTime(); // 冠軍賽（台北時間）
const WC_OPEN  = new Date('2026-06-12T03:00:00+08:00').getTime(); // 開幕賽（台北時間）

/* ═══════════════════════════════════════════════════════════
   DOM 工具
   ═══════════════════════════════════════════════════════════ */
const $ = (id) => document.getElementById(id);

/* ═══════════════════════════════════════════════════════════
   SVG 素材
   ═══════════════════════════════════════════════════════════ */
const SVG = {
  eye: `
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" class="oracle-eye">
      <circle cx="50" cy="50" r="48" stroke-dasharray="2 3" opacity="0.6"/>
      <circle cx="50" cy="50" r="38"/>
      <path d="M10,50 Q50,15 90,50 Q50,85 10,50 Z"/>
      <circle cx="50" cy="50" r="12" fill="currentColor"/>
      <circle cx="50" cy="50" r="4" fill="#0a0a1a"/>
      <path d="M50,6 L50,14 M50,86 L50,94 M6,50 L14,50 M86,50 L94,50" stroke-width="0.8"/>
      <path d="M22,22 L28,28 M72,72 L78,78 M22,78 L28,72 M72,28 L78,22" stroke-width="0.8"/>
    </svg>`,

  corner: `
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="0.8" width="40" height="40">
      <path d="M1,20 Q1,1 20,1 M1,12 Q1,5 12,5 M8,20 Q8,8 20,8"/>
      <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
    </svg>`,

  seal: `
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1" width="60" height="60">
      <circle cx="30" cy="30" r="28" stroke-dasharray="1.5 2"/>
      <circle cx="30" cy="30" r="22"/>
      <circle cx="30" cy="30" r="14"/>
      <path d="M30,18 L32,26 L40,26 L34,30 L36,38 L30,33 L24,38 L26,30 L20,26 L28,26 Z"
            fill="currentColor" opacity="0.6"/>
      <path d="M8,30 L2,30 M52,30 L58,30 M30,2 L30,8 M30,52 L30,58" stroke-width="0.6"/>
    </svg>`,
};

/* ═══════════════════════════════════════════════════════════
   路由導航
   ═══════════════════════════════════════════════════════════ */
const SECTIONS = { home: 's-home', pick: 's-pick', divine: 's-divine', result: 's-result' };

function navigate(step) {
  // 取消 divine 過場中殘留的動畫（避免背景持續跑）
  if (state._divineRaf)   { cancelAnimationFrame(state._divineRaf);   state._divineRaf   = null; }
  if (state._divineTimer) { clearInterval(state._divineTimer);         state._divineTimer = null; }

  // 隱藏所有 section
  Object.values(SECTIONS).forEach(id => $( id).classList.add('hidden'));

  // 顯示目標 section 並觸發 fade-in
  const el = $(SECTIONS[step]);
  el.classList.remove('hidden', 'fade-in');
  void el.offsetWidth; // 強制 reflow，讓 animation 重新觸發
  el.classList.add('fade-in');

  // 滾到頂部
  window.scrollTo({ top: 0, behavior: 'instant' });

  // 更新狀態
  state.step = step;
  store.set('oracle.step', step);

  // 初始化對應 section
  if (step === 'home')   initHome();
  if (step === 'pick')   initPick();
  if (step === 'divine') initDivine();
  if (step === 'result') initResult();

  // 將當前頁面所有 <i data-lucide="..."> 轉成 SVG
  applyIcons();
}

/* ═══════════════════════════════════════════════════════════
   倒數計時
   ═══════════════════════════════════════════════════════════ */
let _countdownTimer = null;

function startCountdown(mode = 'final') {
  if (_countdownTimer) clearInterval(_countdownTimer);
  tick(mode);
  _countdownTimer = setInterval(() => tick(mode), 1000);
}

function tick(mode) {
  const target  = mode === 'final' ? WC_FINAL : WC_OPEN;
  const caption = mode === 'final'
    ? '距決賽終哨 · 阿茲特克球場 · 墨西哥城'
    : '距開幕賽哨聲 · 阿茲特克球場 · 墨西哥城';

  const diff  = Math.max(0, target - Date.now());
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  const pad   = n => String(n).padStart(2, '0');

  $('countdown').innerHTML = [
    ['日', days],
    ['時', pad(hours)],
    ['分', pad(mins)],
    ['秒', pad(secs)],
  ].map(([lbl, num]) => `
    <div class="unit">
      <div class="num">${num}</div>
      <div class="lbl">${lbl}</div>
    </div>
  `).join('');

  $('countdown-caption').textContent = caption;
}

/* ═══════════════════════════════════════════════════════════
   SECTION 1: HOME
   ═══════════════════════════════════════════════════════════ */
function initHome() {
  // Oracle Eye SVG
  $('oracle-eye').innerHTML = SVG.eye;

  // 名字輸入
  const input = $('name-input');
  const btn   = $('btn-begin');
  input.value  = state.name;
  btn.disabled = !state.name.trim();

  input.oninput = () => {
    state.name = input.value;
    store.set('oracle.name', state.name);
    btn.disabled = !state.name.trim();
  };

  input.onkeydown = (e) => {
    if (e.key === 'Enter' && state.name.trim()) navigate('pick');
  };

  btn.onclick = () => navigate('pick');

  // 啟動倒數
  startCountdown('final');
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2: PICK
   ═══════════════════════════════════════════════════════════ */
const CONFEDS = ['ALL', 'UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC'];
const CONFED_LABELS = {
  ALL: '全部 · 48', UEFA: '歐洲', CONMEBOL: '南美洲',
  CONCACAF: '中北美洲', AFC: '亞洲', CAF: '非洲', OFC: '大洋洲',
};

function initPick() {
  // SEER 標籤
  $('pick-name').textContent = state.name ? `預言者：${state.name}` : '';

  // 聯盟篩選 chips
  renderConfedChips();

  // 返回鍵
  $('btn-back').onclick = () => navigate('home');

  // 確認按鈕 → 先進 divining 過場，再到 result
  $('btn-confirm').onclick = () => navigate('divine');

  // 初始渲染
  renderTeamGrid();
  renderPickConfirm();
}

function renderConfedChips() {
  $('confed-filters').innerHTML = CONFEDS.map(c => `
    <button class="chip ${state.filter === c ? 'active' : ''}" data-confed="${c}">
      ${CONFED_LABELS[c]}
    </button>
  `).join('');

  $('confed-filters').querySelectorAll('.chip').forEach(btn => {
    btn.onclick = () => {
      state.filter = btn.dataset.confed;
      renderConfedChips();
      renderTeamGrid();
    };
  });
}

function renderTeamGrid() {
  const filtered = WC_TEAMS.filter(t => {
    if (state.filter !== 'ALL' && t.confed !== state.filter) return false;
    return true;
  });

  const grid  = $('team-grid');
  const empty = $('team-empty');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  grid.innerHTML = filtered.map(t => `
    <button class="team-card ${state.team === t.code ? 'selected' : ''}" data-code="${t.code}">
      ${state.team === t.code ? '<div class="check"><i data-lucide="check"></i></div>' : ''}
      <div class="flag">${t.flag}</div>
      <div>
        <div class="t-name">${t.name}</div>
        <div class="t-confed">${CONFED_LABELS[t.confed]}</div>
      </div>
    </button>
  `).join('');

  grid.querySelectorAll('.team-card').forEach(card => {
    card.onclick = () => {
      state.team = card.dataset.code;
      store.set('oracle.team', state.team);
      renderTeamGrid();
      renderPickConfirm();
    };
  });

  // 每次重新渲染後轉換新注入的 <i data-lucide="...">
  applyIcons();
}

function renderPickConfirm() {
  const bar = $('pick-confirm');
  if (!state.team) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  const team = WC_TEAMS.find(t => t.code === state.team);
  $('pick-confirm-flag').textContent = team.flag;
  $('pick-confirm-name').textContent = `${team.name} 將捧起獎盃`;
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2b: DIVINING — 過場 loading 動畫
   ═══════════════════════════════════════════════════════════ */
function initDivine() {
  // 防呆：沒選隊就回 pick
  if (!state.team) { navigate('pick'); return; }

  const team    = WC_TEAMS.find(t => t.code === state.team);
  const DURATION = 4200; // 毫秒

  const phases = [
    'Consulting the council…',
    'Shuffling the deck of destiny…',
    `Reading the vibes of ${team.name}…`,
    'Sealing the prophecy in wax…',
  ];

  // DOM 元素
  const ringEl   = $('d-ring');
  const crystalEl= $('d-crystal');
  const flagEl   = $('d-flag');
  const titleEl  = $('divine-title');
  const phaseEl  = $('divine-phase');
  const barEl    = $('divine-meter-bar');
  const pctEl    = $('divine-pct');
  const labelEl  = $('divine-label');

  // 初始狀態重置（避免上次殘留的 locked class）
  ringEl.classList.remove('locked');
  crystalEl.classList.remove('locked');
  flagEl.classList.remove('locked');
  titleEl.textContent = 'The vision sharpens…';
  phaseEl.textContent = phases[0];
  barEl.style.width   = '0%';
  pctEl.textContent   = '000%';
  labelEl.textContent = `${state.name || 'Anon'} · ${team.name}`;

  let done = false;
  let currentPhaseIdx = 0;

  // 旗幟亂跳：每 140ms 換一面隨機旗
  const pool = WC_TEAMS.filter(t => t.code !== state.team);
  state._divineTimer = setInterval(() => {
    if (done) return;
    flagEl.textContent = pool[Math.floor(Math.random() * pool.length)].flag;
  }, 140);

  // 進度條 RAF 動畫
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const p       = Math.min(1, elapsed / DURATION);
    const phaseIdx = Math.min(phases.length - 1, Math.floor(p * phases.length));

    // 更新進度條與百分比
    barEl.style.width = `${p * 100}%`;
    pctEl.textContent = `${String(Math.floor(p * 100)).padStart(3, '0')}%`;

    // 切換 phase 文字時重播淡入動畫
    if (phaseIdx !== currentPhaseIdx) {
      currentPhaseIdx = phaseIdx;
      phaseEl.style.animation = 'none';
      void phaseEl.offsetWidth; // 強制 reflow
      phaseEl.style.animation  = '';
      phaseEl.textContent = phases[phaseIdx];
    }

    if (p < 1) {
      state._divineRaf = requestAnimationFrame(tick);
    } else {
      // 動畫完成 → 鎖定狀態
      done = true;
      clearInterval(state._divineTimer);
      state._divineTimer = null;
      state._divineRaf   = null;

      flagEl.textContent = team.flag;
      flagEl.classList.add('locked');
      ringEl.classList.add('locked');
      crystalEl.classList.add('locked');
      titleEl.textContent = 'It is seen.';
      phaseEl.textContent = 'Inscribing your certificate…';

      // 700ms 後跳轉到 result
      setTimeout(() => navigate('result'), 700);
    }
  };

  state._divineRaf = requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3: RESULT
   ═══════════════════════════════════════════════════════════ */
function initResult() {
  // 防呆：沒有選隊就回 home
  if (!state.team) { navigate('home'); return; }

  const team = WC_TEAMS.find(t => t.code === state.team);
  const now  = new Date();

  // 日期標籤
  $('result-date').textContent =
    `SEALED · ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}`;

  // 穩定偽隨機序號（由隊伍權重 + 名字 hash 決定，不會每次刷新都變）
  const base    = WC_WEIGHTS[state.team] || 100;
  const hash    = (state.name || '').split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);
  const ordinal = base + (Math.abs(hash) % 73) + 1;

  // 距決賽天數
  const daysToFinal = Math.max(0, Math.ceil((WC_FINAL - Date.now()) / 86400000));

  // 排名（用於決定 flavor 文字）
  const sorted = [...WC_TEAMS].sort((a, b) => (WC_WEIGHTS[b.code] || 10) - (WC_WEIGHTS[a.code] || 10));
  const rank   = sorted.findIndex(t => t.code === state.team) + 1;

  const flavor =
    rank <= 3  ? 'A safe harbor, chosen by many. Your vision aligns with the multitudes — comforting, or suspicious, depending on temperament.' :
    rank <= 8  ? 'A respectable augury. The tea leaves bend toward possibility; the bookmakers cautiously nod.' :
    rank <= 20 ? 'A bold reading. Should this come to pass, songs will be written and uncles will grumble.' :
                 'A prophecy of the highest order — the kind whispered in back rooms by those who refuse to be ordinary. History rewards the audacious.';

  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // 渲染各子區塊
  renderCertificate({ team, dateStr, ordinal });
  renderOmens({ team, ordinal, daysToFinal, flavor });
  renderDistribution();

  // CTA
  $('btn-restart').onclick = () => {
    state.team         = null;
    state.distExpanded = false;
    store.del('oracle.team');
    navigate('home');
  };

  $('btn-event').onclick = (e) => {
    e.preventDefault();
    const ok = confirm(
      'About to depart the oracle\'s chamber for the Event Site.\n\n' +
      '[This is a prototype — the real redirect would take you to the World Cup event page.]\n\n' +
      'Continue?'
    );
    // 串接真實 URL 時取消註解：
    // if (ok) window.location.href = 'https://your-event-site.com';
  };
}

/* 證書 */
function renderCertificate({ team, dateStr, ordinal }) {
  $('certificate').innerHTML = `
    <div class="certificate-frame fade-in">
      <div class="certificate">
        <div class="cert-corner tl">${SVG.corner}</div>
        <div class="cert-corner tr">${SVG.corner}</div>
        <div class="cert-corner bl">${SVG.corner}</div>
        <div class="cert-corner br">${SVG.corner}</div>

        <div class="cert-inner">
          <div class="cert-seal">${SVG.seal}</div>

          <div class="cert-title">The Oracle Bears Witness</div>
          <div class="cert-title-main">Prophecy of a Champion</div>

          <div class="cert-divider">
            <span style="font-family: var(--font-serif); font-size: 12px;">✦ ANNO MMXXVI ✦</span>
          </div>

          <p class="cert-preamble">
            Let it be known, on this day and henceforth forevermore, that the following seer
            did in solemn ceremony declare —
          </p>

          <div class="cert-name">${state.name || 'An Anonymous Seer'}</div>

          <div class="cert-midtext">— doth foretell that the World Cup shall be lifted by —</div>

          <div class="cert-team">
            <span class="flag">${team.flag}</span>
            <span>${team.name}</span>
          </div>

          <div style="font-family: var(--font-serif); font-style: italic; font-size: 13px; color: #4a3a1a; margin-top: 6px; margin-bottom: 0;">
            on the fields of North America, summer of 2026.
          </div>

          <div class="cert-foot">
            <div class="cert-foot-item">
              <div class="k">Inscribed</div>
              <div class="v">${dateStr}</div>
            </div>
            <div class="cert-foot-sig">
              <div class="sigline">~ Oracle of the Cup ~</div>
              <div class="k">Countersigned</div>
            </div>
            <div class="cert-foot-item">
              <div class="k">Ledger №</div>
              <div class="v">${String(ordinal).padStart(6, '0')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* 預言解讀三條 */
function renderOmens({ team, ordinal, daysToFinal, flavor }) {
  $('omens').innerHTML = `
    <div class="omen">
      <div class="omen-lines">
        <div class="omen-line">
          <div class="marker">I.</div>
          <div class="text">
            Thou art the <span class="num">${ordinal.toLocaleString()}ᵗʰ</span> seer
            to foretell a <span class="hi">${team.name}</span> triumph in the Year of the Cup.
          </div>
        </div>
        <div class="omen-line">
          <div class="marker">II.</div>
          <div class="text">
            Thy prophecy was inscribed <span class="num">${daysToFinal}</span> days
            before the final whistle at the Estadio Azteca.
          </div>
        </div>
        <div class="omen-line">
          <div class="marker">III.</div>
          <div class="text" style="color: var(--color-smoke);">${flavor}</div>
        </div>
        <div class="omen-line">
          <div class="marker">◈</div>
          <div class="text" style="color: var(--color-gold-bright); font-style: normal; font-size: 18px; letter-spacing: 0.05em;">
            Should it come to pass, remember: you saw it first.
          </div>
        </div>
      </div>
    </div>
  `;
}

/* 分佈圖 */
function renderDistribution() {
  const sorted = [...WC_TEAMS]
    .map(t => ({ ...t, count: WC_WEIGHTS[t.code] || 10 }))
    .sort((a, b) => b.count - a.count);

  const total  = sorted.reduce((s, x) => s + x.count, 0);
  const max    = sorted[0]?.count || 1;
  const selIdx = sorted.findIndex(t => t.code === state.team);

  // 預設顯示前 10 名，但永遠包含自己選的隊
  const rows = state.distExpanded ? sorted : sorted.slice(0, 10);
  if (!state.distExpanded && selIdx >= 10) rows.push(sorted[selIdx]);

  $('distribution').innerHTML = `
    <div class="section-card">
      <div class="section-hdr">
        <div class="eyebrow">— The Collective Augury —</div>
        <h2>How the council has cast its lots</h2>
      </div>

      <div class="dist">
        ${rows.map(t => {
          const realIdx = sorted.findIndex(x => x.code === t.code);
          const pct     = (t.count / total * 100).toFixed(1);
          const barPct  = (t.count / max * 100).toFixed(1);
          const isYou   = t.code === state.team;
          return `
            <div class="dist-row ${isYou ? 'you' : ''}">
              <div class="rk">${realIdx + 1}</div>
              <div class="fl">${t.flag}</div>
              <div class="bar-wrap">
                <div class="bar" style="width: ${barPct}%"></div>
                <div class="label">
                  ${t.name}
                  ${isYou ? '<span class="you-tag">You</span>' : ''}
                </div>
              </div>
              <div class="pct">${pct}%</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="dist-fold">
        <button id="dist-toggle" class="btn-quiet">
          ${state.distExpanded
            ? '<i data-lucide="chevron-up"></i> Fold the scroll'
            : '<i data-lucide="chevron-down"></i> Reveal all 48 nations'}
        </button>
      </div>
    </div>
  `;

  // 綁定展開/收合（每次重新渲染後重綁）
  $('dist-toggle').onclick = () => {
    state.distExpanded = !state.distExpanded;
    renderDistribution();
    applyIcons(); // 重新渲染後轉換新的 chevron icon
  };
}

/* ═══════════════════════════════════════════════════════════
   初始化：從 localStorage 恢復上次步驟
   ═══════════════════════════════════════════════════════════ */
navigate(state.step);
