/**
 * script.js — Oracle of the Cup · Vanilla JS
 * 未來串 Supabase 時，在此 import supabase.js 模組
 */

// ── Dev flag：console 輸入 window.__pauseDivine = true 可凍結在 divine 頁面
const DEV_PAUSE_DIVINE = () => !!window.__pauseDivine;
import { WC_TEAMS, WC_WEIGHTS } from './teams.js';

/* ── 點擊漣漪 ────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  // 第一圈（主漣漪）
  const r1 = document.createElement('div');
  r1.className = 'click-ripple';
  r1.style.left = `${e.clientX}px`;
  r1.style.top  = `${e.clientY}px`;
  document.body.appendChild(r1);
  r1.addEventListener('animationend', () => r1.remove());

  // 第二圈（細、透明、稍微延遲）
  const r2 = document.createElement('div');
  r2.className = 'click-ripple click-ripple-2';
  r2.style.left = `${e.clientX}px`;
  r2.style.top  = `${e.clientY}px`;
  document.body.appendChild(r2);
  r2.addEventListener('animationend', () => r2.remove());
});

/* ── Lucide icons（UMD，由 index.html <script> 載入，window.lucide） ── */

/** 將頁面上所有 <i data-lucide="..."> 替換成 SVG */
function applyIcons() {
  window.lucide?.createIcons({ attrs: { 'stroke-width': '2' } });
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
// 只有已完成預言（result）才從 localStorage 恢復；流程中 refresh 一律重來
const _savedStep = store.get('oracle.step');
const state = {
  step:         _savedStep === 'result' ? 'result' : 'home',
  name:         store.get('oracle.name') || '',
  team:         _savedStep === 'result' ? store.get('oracle.team') : null,
  filter:       'ALL',
  distExpanded: false,
};

/* ═══════════════════════════════════════════════════════════
   日期常數
   ═══════════════════════════════════════════════════════════ */
const WC_FINAL = new Date('2026-07-20T03:00:00+08:00').getTime(); // 冠軍賽（台北時間）
const WC_OPEN  = new Date('2026-06-12T03:00:00+08:00').getTime(); // 開幕賽（台北時間）— TODO: 開幕賽倒數模式保留備用，目前永遠使用 'final' 模式

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

  corner: `<img src="img/corner ornament.svg" width="24" height="24" alt="" aria-hidden="true" draggable="false">`,

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
  Object.values(SECTIONS).forEach(id => $(id).classList.add('hidden'));

  // pick-confirm 不在 section 內，離開 pick 時手動隱藏
  if (step !== 'pick') $('pick-confirm').classList.add('hidden');

  // 顯示目標 section 並觸發 fade-in
  const el = $(SECTIONS[step]);
  el.classList.remove('hidden', 'fade-in');
  void el.offsetWidth; // 強制 reflow，讓 animation 重新觸發
  el.classList.add('fade-in');

  // 滾到頂部
  window.scrollTo({ top: 0, behavior: 'instant' });

  // 更新狀態：只有抵達 result 才持久化，流程中 refresh 一律重來
  state.step = step;
  if (step === 'result') {
    store.set('oracle.step', 'result');
    store.set('oracle.team', state.team);
  } else {
    store.del('oracle.step');
    store.del('oracle.team');
  }

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
  const input     = $('name-input');
  const btn       = $('btn-begin');
  const clearBtn  = $('btn-clear-name');

  function syncNameState() {
    const hasValue = !!input.value.trim();
    btn.disabled = !hasValue;
    clearBtn.classList.toggle('hidden', !hasValue);
  }

  input.value = state.name;
  syncNameState();

  input.oninput = () => {
    state.name = input.value;
    store.set('oracle.name', state.name);
    syncNameState();
  };

  input.onkeydown = (e) => {
    if (e.key === 'Enter' && state.name.trim()) navigate('pick');
  };

  clearBtn.onclick = () => {
    input.value = '';
    state.name  = '';
    store.set('oracle.name', '');
    syncNameState();
    input.focus();
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

// ALL 模式下的聯盟顯示順序（UEFA、CONMEBOL 優先）
const CONFED_ORDER = { UEFA: 0, CONMEBOL: 1, CONCACAF: 2, AFC: 3, CAF: 4, OFC: 5 };

function renderTeamGrid() {
  const filtered = WC_TEAMS
    .filter(t => state.filter === 'ALL' || t.confed === state.filter)
    .sort((a, b) => {
      // 只在 ALL 模式下依聯盟排序，單一聯盟篩選時保持原始順序
      if (state.filter !== 'ALL') return 0;
      return (CONFED_ORDER[a.confed] ?? 9) - (CONFED_ORDER[b.confed] ?? 9);
    });

  const grid  = $('team-grid');
  const empty = $('team-empty');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  grid.innerHTML = filtered.map(t => {
    const w    = WC_WEIGHTS[t.code] || 0;
    const tier = w >= 5000 ? 'tier-hot' : w >= 1000 ? 'tier-fav' : 'tier-low';
    return `
    <button class="team-card ${tier} ${state.team === t.code ? 'selected' : ''}" data-code="${t.code}">
      ${state.team === t.code ? '<div class="check"><i data-lucide="check"></i></div>' : ''}
      <div class="flag">${t.flag}</div>
      <div>
        <div class="t-name">${t.name}</div>
        <div class="t-confed">${CONFED_LABELS[t.confed]}</div>
      </div>
    </button>`;
  }).join('');

  grid.querySelectorAll('.team-card').forEach(card => {
    card.onclick = () => {
      state.team = card.dataset.code;
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
    '諮詢預言議會中…',
    '洗牌命運之牌…',
    `解讀 ${team.name} 的氣場…`,
    '以蠟封印預言…',
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
  titleEl.textContent = '景象逐漸清晰…';
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
      titleEl.textContent = '已然洞見。';
      phaseEl.textContent = '刻寫你的預言證書…';

      // 700ms 後跳轉到 result（DEV_PAUSE_DIVINE = true 時暫停，方便檢視）
      if (!DEV_PAUSE_DIVINE()) setTimeout(() => navigate('result'), 700);
    }
  };

  state._divineRaf = requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3: RESULT
   ═══════════════════════════════════════════════════════════ */
// 證書圖片預載 Promise（result 頁初始化時啟動，download 時 await）
let _certImagesPromise = null;

function precacheCertImages() {
  if (!_certImagesPromise) {
    _certImagesPromise = Promise.all([
      toDataUrl('img/parchment-texture.jpg'),
      toDataUrl('img/wax-seal.png'),
    ]).then(([parchment, wax]) => ({ parchment, wax }))
      .catch(() => null); // 失敗不卡住，讓 download 自己處理
  }
  return _certImagesPromise;
}

function initResult() {
  // 防呆：沒有選隊就回 home
  if (!state.team) { navigate('home'); return; }

  // 立刻開始預載證書圖片，存成 Promise 讓 download 可以 await
  precacheCertImages();

  const team = WC_TEAMS.find(t => t.code === state.team);
  const now  = new Date();

  // 日期標籤
  $('result-date').textContent =
    `預言於 · ${now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}`;

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
    rank <= 3  ? '安全的選擇，眾人所向。你的預言與大多數人一致 — 令人安心，或許也令人起疑，端看性情而定。' :
    rank <= 8  ? '值得尊重的預感。茶葉彎向可能，賠率師謹慎地點頭。' :
    rank <= 20 ? '大膽的解讀。若成真，歌謠將傳頌千里，旁人們則會碎念不休。' :
                 '預言之最高境界 — 那種在密室中低語、唯有不甘平庸者方敢說出口的話。歷史獎勵勇者。';

  const dateStr = now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
    .replace(/(\d)(年|月|日)/g, '$1 $2')   // 數字後加空格
    .replace(/(年|月)(\d)/g, '$1 $2');     // 年/月後加空格

  // 渲染各子區塊
  renderCertificate({ team, dateStr, ordinal });
  renderOmens({ team, ordinal, daysToFinal, flavor });
  renderDistribution();

  // 捲動 reveal：certificate + omen
  const revealOpts = { threshold: 0.12 };
  ['.certificate-frame', '.omen'].forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.transitionDelay = `${i * 120}ms`; // 證書先、omen 稍後
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('in-view');
        obs.disconnect();
      }
    }, revealOpts);
    obs.observe(el);
  });

  // CTA
  $('btn-restart').onclick = () => {
    state.team         = null;
    state.distExpanded = false;
    store.del('oracle.step');
    store.del('oracle.team');
    navigate('home');
  };

  // btn-event 由 <a href target="_blank"> 原生處理，不需要額外 JS

  // 下載證書按鈕
  $('btn-download').onclick = downloadCertificate;

  // 分享按鈕：手機走 native share sheet，桌機開 popover
  const shareBtn     = $('btn-share');
  const sharePopover = $('share-popover');

  function closePopover() {
    sharePopover.classList.add('closing');
    setTimeout(() => {
      sharePopover.classList.add('hidden');
      sharePopover.classList.remove('closing');
    }, 180);
  }

  shareBtn.onclick = async (e) => {
    e.stopPropagation();
    const team = WC_TEAMS.find(t => t.code === state.team);
    const text = `我預言 ${team?.flag ?? ''} ${team?.name ?? ''} 奪得 2026 世界盃冠軍！#OracleOfTheCup`;

    // 手機優先走原生 share sheet
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      await navigator.share({ title: '金盃神諭', text, url: location.href });
      return;
    }
    // 桌機：toggle popover
    if (!sharePopover.classList.contains('hidden')) { closePopover(); return; }
    sharePopover.classList.remove('hidden');
    applyIcons();
  };

  // popover 各項目點擊
  sharePopover.querySelectorAll('.share-item').forEach(item => {
    item.onclick = async (e) => {
      e.stopPropagation();
      const team = WC_TEAMS.find(t => t.code === state.team);
      const text = encodeURIComponent(`我預言 ${team?.flag ?? ''} ${team?.name ?? ''} 奪得 2026 世界盃冠軍！#OracleOfTheCup`);
      const url  = encodeURIComponent(location.href);

      switch (item.dataset.platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
          break;
        case 'line':
          window.open(`https://line.me/R/msg/text/?${text}%0A${url}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${decodeURIComponent(text)}\n${location.href}`);
          item.querySelector('span').textContent = '已複製！';
          setTimeout(() => {
            item.querySelector('span').textContent = '複製連結';
            closePopover();
          }, 2000);
          return; // 不往下走 closePopover
      }
      closePopover();
    };
  });

  // 點外面關閉 popover（點 popover 或 shareBtn 內部不關閉）
  document.addEventListener('click', (e) => {
    if (!sharePopover.classList.contains('hidden') &&
        !sharePopover.contains(e.target) &&
        !shareBtn.contains(e.target)) {
      closePopover();
    }
  }, { capture: true });
}

/* 將 URL 轉成 base64 data URL（繞過 Safari canvas 跨域限制） */
async function toDataUrl(url) {
  const blob = await fetch(url).then(r => r.blob());
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/* 等待 img 元素解碼完成 */
function waitForImage(img) {
  return new Promise(resolve => {
    if (img.complete && img.naturalWidth > 0) { resolve(); return; }
    img.onload  = resolve;
    img.onerror = resolve; // 失敗也繼續，不卡住
  });
}

/* 證書下載 */
async function downloadCertificate() {
  const el  = document.querySelector('.certificate');
  const btn = $('btn-download');
  if (!el || !window.htmlToImage) return;

  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-circle" class="spin"></i>';
  applyIcons();

  // 暫存原始值，擷取後還原
  const imgEls  = [...el.querySelectorAll('img[src]')];
  const origSrc = imgEls.map(i => i.src);
  const origBg  = el.style.backgroundImage;

  try {
    // 等待預載完成（initResult 已啟動，通常早就 ready；若使用者點很快才等）
    const cached = await precacheCertImages();
    await document.fonts.ready;

    const parchmentDataUrl = cached?.parchment ?? await toDataUrl('img/parchment-texture.jpg');
    const waxDataUrl       = cached?.wax       ?? await toDataUrl('img/wax-seal.png');

    // 替換 <img> src 並等待瀏覽器解碼完成
    await Promise.all(imgEls.map(async (img) => {
      const du = img.src.includes('wax-seal') ? waxDataUrl
               : await toDataUrl(img.src).catch(() => null);
      if (du) { img.src = du; await waitForImage(img); }
    }));

    // 覆蓋背景紋理（inline style 優先於 class style）
    const computedBg = getComputedStyle(el).backgroundImage;
    el.style.backgroundImage = computedBg.replace(
      /url\(["']?[^"')]*parchment[^"')]*["']?\)/,
      `url('${parchmentDataUrl}')`
    );

    // 強制固定寬度，確保截圖不受 browser 視窗寬度影響
    el.style.width    = '600px';
    el.style.maxWidth = '600px';

    // 等一個 frame 讓背景確實渲染
    await new Promise(r => requestAnimationFrame(r));

    const dataUrl = await window.htmlToImage.toPng(el, {
      pixelRatio: 2,
      skipFonts: true,
    });

    // 還原寬度
    el.style.width    = '';
    el.style.maxWidth = '';

    const link    = document.createElement('a');
    link.download = `預言冠軍-${state.name || 'prophecy'}-世足看東森.png`;
    link.href     = dataUrl;
    link.click();
  } catch (err) {
    console.error('證書下載失敗', err);
  } finally {
    // 還原原始 DOM
    imgEls.forEach((img, i) => { img.src = origSrc[i]; });
    el.style.backgroundImage = origBg;
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="download"></i> 下載證書';
    applyIcons();
  }
}

/* 證書 */
function renderCertificate({ team, dateStr, ordinal }) {
  $('certificate').innerHTML = `
    <div class="certificate-frame reveal">
      <div class="certificate">
        <div class="cert-corner tl">${SVG.corner}</div>
        <div class="cert-corner tr">${SVG.corner}</div>
        <div class="cert-corner bl">${SVG.corner}</div>
        <div class="cert-corner br">${SVG.corner}</div>

        <div class="cert-inner">
          <div class="cert-seal">${SVG.seal}</div>

          <div class="cert-title">神諭見證</div>
          <div class="cert-title-main">冠軍預言書</div>

          <div class="cert-divider">
            <span style="font-family: var(--font-serif); font-size: 12px;">✦ ANNO MMXXVI ✦</span>
          </div>

          <p class="cert-preamble">
            茲聲明，自今日起，永久為憑，以下預言者已於莊嚴儀式中宣告——
          </p>

          <div class="cert-name">${state.name || 'An Anonymous Seer'}</div>

          <div class="cert-midtext">— 預言世界盃冠軍將由以下國家奪得 —</div>

          <div class="cert-team">
            <span class="flag">${team.flag}</span>
            <span>${team.name}</span>
          </div>

          <div style="font-family: var(--font-serif); font-size: 13px; color: var(--color-cert-ink-2); margin-top: 6px; margin-bottom: 0;">
            在北美賽場，2026 年夏。
          </div>

          <div class="cert-foot">
            <div class="cert-foot-item">
              <div class="k">刻印日期</div>
              <div class="v">${dateStr}</div>
            </div>
            <div class="cert-foot-seal">
              <img src="img/wax-seal.png" alt="蠟印" draggable="false">
            </div>
            <div class="cert-foot-item">
              <div class="k">典籍編號</div>
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
    <div class="omen reveal">
      <div class="omen-lines">
        <div class="omen-line">
          <div class="marker">I.</div>
          <div class="text">
            你是第 <span class="num">${ordinal.toLocaleString()}</span> 位預言
            <span class="hi">${team.name}</span> 奪冠的見證者。
          </div>
        </div>
        <div class="omen-line">
          <div class="marker">II.</div>
          <div class="text">
            你在決賽開始前 <span class="num">${daysToFinal}</span> 天做出了預言。
          </div>
        </div>
        <div class="omen-line">
          <div class="marker">III.</div>
          <div class="text" style="color: var(--color-smoke); font-style: italic;">${flavor}</div>
        </div>
        <div class="omen-line">
          <div class="marker">◈</div>
          <div class="text" style="color: var(--color-gold-bright); font-style: normal; font-size: 18px; letter-spacing: 0.05em;">
            若預言成真，請記住：你早已洞見一切。
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
        <div class="eyebrow">— 集體神諭 —</div>
        <h2>議會的集體預言</h2>
      </div>

      <div class="dist">
        ${rows.map((t, i) => {
          const realIdx = sorted.findIndex(x => x.code === t.code);
          const pct     = (t.count / total * 100).toFixed(1);
          const barPct  = (t.count / max * 100).toFixed(1);
          const isYou   = t.code === state.team;
          const delay   = `${i * 50}ms`;
          return `
            <div class="dist-row ${isYou ? 'you' : ''}">
              <div class="rk">${realIdx + 1}</div>
              <div class="fl">${t.flag}</div>
              <div class="bar-wrap">
                <div class="bar" style="width: ${barPct}%; animation-delay: ${delay}"></div>
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
            ? '<i data-lucide="chevron-up"></i> 收起卷軸'
            : '<i data-lucide="chevron-down"></i> 展開全部 48 國'}
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

  // 捲到畫面內才觸發 bar 動畫
  const distEl = document.querySelector('.dist');
  if (distEl) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        distEl.classList.add('in-view');
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(distEl);
  }
}

/* ═══════════════════════════════════════════════════════════
   初始化：從 localStorage 恢復上次步驟
   ═══════════════════════════════════════════════════════════ */
navigate(state.step);
