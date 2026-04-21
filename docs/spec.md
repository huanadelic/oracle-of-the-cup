# Oracle of the Cup — 專案規格書

> 版本：1.1 · 更新日期：2026-04-21

---

## 1. 專案概述

**Oracle of the Cup** 是一個 FIFA World Cup 2026 互動預言 web app。使用者輸入名字、選擇冠軍隊伍，系統產生一張個人化「預言證書」，並呈現社群投票分佈。

整體體驗分為四個 Act：

| Step | 代碼 | 中文名稱 |
|------|------|----------|
| Act I | `home` | 召喚——輸入名字 |
| Act II | `pick` | 選擇——挑選冠軍隊伍 |
| Act IIb | `divine` | 占卜——過場 loading 動畫 |
| Act III | `result` | 封印——證書與統計 |

---

## 2. 技術棧

| 層面 | 技術 |
|------|------|
| HTML | 語意化單頁 HTML（index.html） |
| CSS | 純 CSS（`style.css`，`:root` design tokens，無 build step） |
| JS | Vanilla JS ES Module（`type="module"`） |
| 字型 | Shippori Mincho B1（serif）、Noto Sans TC / Noto Serif TC、Inter（sans）、JetBrains Mono（mono）|
| 資料 | 靜態 `teams.js`（未來接 Supabase） |
| Build | 無需 build，直接編輯 `style.css` |

---

## 3. 檔案結構

```
Oracle of the Cup/
├── index.html          # 單頁 HTML 殼層
├── script.js           # 主邏輯（ES Module）
├── teams.js            # 48 支球隊資料 + 投票權重（export）
├── style.css           # 主要 CSS 來源（設計 tokens + 所有元件，直接編輯）
├── docs/
│   └── spec.md         # 本規格書
└── react backup/       # 原始 React 版備份（含 SectionDivining）
```

---

## 4. 設計 Token（`src/input.css` `@theme` block）

### 顏色

| Token | 值 | 用途 |
|-------|----|------|
| `--color-ink` | `#0a0a1a` | 主背景 |
| `--color-ink-2` | `#0f0f22` | 次背景（浮動卡片） |
| `--color-night` | `#141432` | 深色元素 |
| `--color-vellum` | `#f4ebd3` | 主文字色（羊皮紙白） |
| `--color-vellum-2` | `#ebe0c0` | 次文字 |
| `--color-parchment` | `#e8dcb8` | 證書背景輔助色 |
| `--color-gold` | `#c8a14a` | 金色主調 |
| `--color-gold-bright` | `#e3bf6a` | 高亮金 |
| `--color-gold-dim` | `#8a6d2d` | 暗金（裝飾、角標） |
| `--color-wine` | `#5a1f2e` | 酒紅（證書強調色） |
| `--color-smoke` | `rgba(244,235,211,0.55)` | 半透明文字 |
| `--color-smoke-dim` | `rgba(244,235,211,0.28)` | 更淡的輔助文字 |
| `--color-rule` | `rgba(200,161,74,0.35)` | 分隔線、邊框 |

### 字型

| Token | 字型 |
|-------|------|
| `--font-serif` | Cormorant Garamond → Georgia → serif |
| `--font-sans` | Inter → -apple-system → sans-serif |
| `--font-mono` | JetBrains Mono → IBM Plex Mono → monospace |

---

## 5. 全域 CSS 元件

| Class | 說明 |
|-------|------|
| `.headline` | serif italic，weight 500，line-height 0.95，letter-spacing -0.02em |
| `.eyebrow` | mono，10px，letter-spacing 0.4em，金色大寫 |
| `.brand-wisp` | mono，11px，letter-spacing 0.32em，金色大寫 |
| `.btn` | base 按鈕（inline-flex，16px 24px padding，radius 2px） |
| `.btn-primary` | 金色漸層 + glow box-shadow，hover 微浮 |
| `.btn-ghost` | 透明底 + rule 邊框，hover 轉金色 |
| `.btn-quiet` | 無邊框文字按鈕（用於 back、展開等） |

---

## 6. 動畫

| 名稱 | 用途 |
|------|------|
| `fadeIn` | Section 切換淡入（section 元素本身） |
| `eyePulse` | Oracle Eye 呼吸脈動（4s，scale 1→1.05） |
| `starDrift` | 星空背景飄移視差（40s / 65s） |
| `d-spin` | Divining 旋轉光環（2.4s linear infinite） |
| `d-lock` | Divining 旗幟鎖定彈入（600ms cubic-bezier） |
| `fadeInPhase` | Divining phase 文字切換（400ms） |

---

## 7. App 流程與路由

`script.js` 用 `navigate(step)` 控制頁面切換，step 為：`home` / `pick` / `divine` / `result`。

```
navigate(step)
  → 取消殘留 divine RAF / timer（清理資源）
  → 隱藏所有 section
  → 顯示目標 section + 觸發 fadeIn
  → scrollTo top
  → 呼叫對應 initXxx()
```

狀態持久化透過 `localStorage`（key prefix: `oracle.*`）。

---

## 8. 各 Section 規格

### Section 1 — Home（`#s-home`）

**結構：** `section > .home-wrap > .home-header + .home-inner + .footer-wisp`

| 元素 | 說明 |
|------|------|
| `.home-header` | 兩端對齊，max-width 960px，margin-bottom 80px |
| `#oracle-eye` | JS 注入 SVG，72px，eyePulse 動畫，flex 置中 |
| `.home-title` | `clamp(52px, 8vw, 104px)`，`.em` span 顯示「Champion.」 |
| `.home-sub` | serif italic 22px，max-width 540px；`.tag` 為 block mono 小標 |
| `#countdown` | 倒數至決賽（2026-07-19 Estadio Azteca），`requestInterval(1s)` |
| `#countdown-caption` | 說明文字，固定顯示在倒數下方 |
| `.name-field input` | 底線式輸入，serif italic 26px，focus 轉金色 |
| `#btn-begin` | 預設 disabled，有文字才啟用，→ `navigate('pick')` |
| `.footer-wisp` | `position: fixed; bottom: 16px`，跨 section 常駐顯示 |

### Section 2 — Pick（`#s-pick`）

**結構：** `section > .pick-wrap > .pick-top(grid) + .pick-title-block + #confed-filters + #team-search + #team-grid + #pick-confirm`

| 元素 | 說明 |
|------|------|
| `.pick-top` | `grid-template-columns: 1fr auto 1fr`，確保中間 brand-wisp 真正置中 |
| `#confed-filters` | JS 渲染聯盟篩選 chip（ALL / UEFA / CONMEBOL / CONCACAF / AFC / CAF / OFC） |
| `.chip` | `border-radius: 99px` 膠囊形，`.active` 金底墨字 |
| `#team-search` | 即時篩選（`oninput`） |
| `#team-grid` | `grid auto-fill minmax(160px, 1fr)`，gap 10px |
| `.team-card` | 水平 flex（flag 左、文字右），hover 微浮，`.selected` 金框 glow |
| `.team-card .check` | 右上角圓形金底勾（position absolute，16×16） |
| `#pick-confirm` | 固定底部浮動列，`pointer-events: none`；內層 `.pick-confirm-inner` `pointer-events: auto` |
| `#btn-confirm` | → `navigate('divine')` |

### Section 2b — Divining（`#s-divine`）

**結構：** `section > .divine-wrap > .divine-stage + .divine-copy`

| 元素 | 說明 |
|------|------|
| `.divine-stage` | 220×220px flex 容器 |
| `#d-ring` | 旋轉光環（d-spin 動畫），完成後 `.locked`（發光，停止旋轉） |
| `#d-crystal` | 150×150px 球形，完成後 glow 加強 |
| `#d-flag` | 64px emoji 旗，每 140ms 隨機換旗；完成後 `.locked`（80px 彈入） |
| `#divine-title` | 「The vision sharpens…」→「It is seen.」 |
| `#divine-phase` | 4 個階段文字循環，切換時重播 fadeInPhase 動畫 |
| `#divine-meter-bar` | `requestAnimationFrame` 推進，transition 80ms linear |
| `#divine-pct` | 000%–100%，padStart(3, '0') |
| `#divine-label` | `{name} · {team.name}` |

**時序：**
- 總時長：4200ms
- 完成後：鎖定視覺 + 等待 700ms → `navigate('result')`

### Section 3 — Result（`#s-result`）

**結構：** `section > .result-wrap > .result-top + .result-hero + #certificate + #omens + #distribution + .result-ctas`

| 元素 | 說明 |
|------|------|
| `.result-top` | 兩端對齊（brand-wisp ↔ 封印日期） |
| `.result-hero h1` | serif italic，`clamp(40px, 5vw, 64px)` |
| `.result-hero .lede` | serif italic 20px，max-width 580px |
| `#certificate` | JS 渲染，`.certificate-frame > .certificate`，羊皮紙漸層背景 |
| `#omens` | JS 渲染，`.omen`（全框 + L 形金角），3+1 條解讀 |
| `#distribution` | JS 渲染，`.section-card`（上邊框），top-10 + 自選隊排行 |
| `.result-ctas` | flex gap 14px，`.btn.btn-ghost` + `.btn.btn-primary` |

**證書子元件：**

| Class | 說明 |
|-------|------|
| `.certificate` | 多層 box-shadow（金環 + 深色間距 + 外發光），overflow hidden |
| `.certificate::before/::after` | 雙層內邊框（inset 16px / 22px） |
| `.cert-corner.tl/tr/bl/br` | 四角 SVG 裝飾，position absolute |
| `.cert-name` | 52px serif italic，底線 |
| `.cert-team` | 36px serif，wine 色，flag emoji 44px |
| `.cert-foot` | flex space-between，dashed 上邊框；中間 `.sigline` 用 Brush Script MT |

**Omens 偽隨機序號邏輯：**
```js
ordinal = WC_WEIGHTS[teamCode] + (Math.abs(nameHash) % 73) + 1
// nameHash = name.split('').reduce((a,c) => (a*31 + c.charCodeAt(0))|0, 7)
```
同樣的名字 + 隊伍，每次刷新序號不變。

---

## 9. 資料結構（`teams.js`）

```js
export const WC_TEAMS = [
  { code: 'ARG', name: '阿根廷', flag: '🇦🇷', confed: 'CONMEBOL' },
  // ... 48 支隊伍（隊名皆為繁體中文）
];

export const WC_WEIGHTS = {
  ARG: 18420, BRA: 17890, FRA: 14230, /* ... */
};
```

- **`WC_TEAMS`**：48 支 FIFA WC 2026 正式參賽隊，隊名繁體中文，按 confed 分組
- **`WC_WEIGHTS`**：模擬投票權重（用於 distribution 圖表與 ordinal 計算）

### 各聯盟參賽隊（v1.1 更新）

| 聯盟 | 隊伍 |
|------|------|
| CONCACAF（6） | 加拿大、墨西哥、美國、巴拿馬、古拉索、海地 |
| AFC（9） | 澳洲、伊朗、日本、約旦、韓國、烏茲別克、卡達、沙烏地阿拉伯、伊拉克 |
| CAF（9） | 摩洛哥、突尼西亞、埃及、阿爾及利亞、迦納、塞內加爾、象牙海岸、維德角、南非、剛果民主共和國 |
| CONMEBOL（6） | 阿根廷、巴西、烏拉圭、哥倫比亞、厄瓜多、巴拉圭 |
| OFC（1） | 紐西蘭 |
| UEFA（16） | 英格蘭、法國、德國、西班牙、葡萄牙、荷蘭、比利時、克羅埃西亞、瑞士、奧地利、挪威、蘇格蘭、土耳其、波士尼亞與赫塞哥維納、瑞典、捷克 |

> v1.1 變更：移除 哥斯大黎加、牙買加、喀麥隆、奈及利亞、秘魯、義大利、丹麥、波蘭；新增 古拉索、海地、維德角、南非、剛果民主共和國、波士尼亞與赫塞哥維納、瑞典、捷克。

---

## 10. RWD 斷點

統一使用 `max-width: 720px`（對齊原版 React）：

| 元素 | 720px 以下變化 |
|------|---------------|
| `.home-header` | margin-bottom 縮為 40px |
| `.countdown` | gap 縮為 10px，數字縮為 32px |
| `.certificate` | padding 縮小，cert-name 36px，cert-team 26px |
| `.cert-foot` | 改為垂直排列，全置中 |
| `.omen` | padding 縮小，omen-line 改垂直排列 |
| `.team-grid` | minmax 從 160px 縮為 140px |
| `.divine-stage` | 220→180px |
| `.d-crystal` | 150→120px |
| `.d-flag` | 64→48px（locked: 80→60px） |

---

## 11. 未來擴充：Supabase 整合

`script.js` 以 ES Module 格式撰寫，預留串接入口：

```js
// 未來在此 import Supabase client
// import { createClient } from './supabase.js'
```

計劃將 `WC_WEIGHTS` 替換為 Supabase 即時投票資料，讓 distribution 反映真實使用者選擇。

---

## 12. Dev 指令

無需 build step。直接編輯 `style.css` 與 `script.js`，搭配 Live Server（VS Code extension）或任意靜態伺服器即可。
