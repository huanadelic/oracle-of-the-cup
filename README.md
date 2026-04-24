# Oracle of the Cup · 金盃神諭

2026 FIFA 世界盃互動預言 Web App — 東森電視台 #世足看東森 活動

使用者輸入名字、選擇冠軍隊伍，系統產生個人化「預言證書」並呈現社群投票分佈。

---

## 功能流程

四個 Act，以 `navigate(step)` 控制切換：

| Step | 說明 |
|------|------|
| `home` | 輸入預言者名字，觀看決賽倒數計時 |
| `pick` | 從 48 支參賽隊中選擇冠軍（支援聯盟篩選） |
| `divine` | 4.2 秒預言過場動畫 |
| `result` | 預言證書 + 解讀文字 + 集體投票分佈圖 |

---

## 技術棧

| 層面 | 說明 |
|------|------|
| HTML/CSS/JS | 純 Vanilla，無 build step |
| JS 模組 | ES Module（`type="module"`） |
| 圖示 | Lucide Icons（UMD CDN） |
| 國旗 | flagcdn.com SVG（取代系統 emoji，解決 Windows 不顯示問題） |
| 證書截圖 | html-to-image（CDN） |
| 字型嵌入 | Shippori Mincho B1 本地 subset woff2（base64 embed，供截圖用） |
| 狀態持久化 | localStorage（key prefix: `oracle.*`，僅 result 步驟持久化） |

---

## 檔案結構

```
Oracle of the Cup/
├── index.html              # 單頁 HTML
├── script.js               # 主邏輯（ES Module）
├── teams.js                # 48 支球隊資料 + 模擬投票權重
├── style.css               # 全部樣式（design tokens + 元件）
├── fonts/
│   ├── shippori-mincho-b1-400.woff2
│   ├── shippori-mincho-b1-500.woff2
│   └── shippori-mincho-b1-600.woff2
├── img/
│   ├── Trophy_spins.mov        # 旋轉獎盃（HEVC，Safari 用）
│   ├── Trophy_spins.webm       # 旋轉獎盃（VP9，其他瀏覽器）
│   ├── Trophy_spins_master.mov # 母帶（勿刪）
│   ├── trophy.png              # 影片 poster
│   ├── parchment-texture.jpg   # 證書羊皮紙背景
│   ├── wax-seal.png            # 證書蠟印
│   ├── corner ornament.svg     # 證書四角裝飾
│   ├── Facebook.svg            # 分享按鈕
│   ├── LINE.svg                # 分享按鈕
│   └── 世足看東森_標準字.png
└── docs/
    └── spec.md                 # 原始規格書（部分內容已過時）
```

---

## 本地開發

無 build step，直接用靜態伺服器即可：

```bash
# VS Code Live Server、或任意靜態伺服器皆可
npx serve .
```

### Dev 工具

證書截圖完成前，可在 console 凍結在 divine 頁面檢視：

```js
window.__pauseDivine = true
```

---

## 證書下載

`html-to-image` 截圖流程，有大量 Safari 相容性處理：

- 所有圖片（parchment、wax-seal、國旗）預先 fetch 轉 base64，避免跨域問題
- Shippori Mincho B1 字型 woff2 同樣 base64 embed，確保截圖字型正確
- Safari 需呼叫兩次 `toPng`，捨棄第一次（冷啟動 resource cache 問題）
- iOS 不支援 `<a download>`，改用 `window.open`

---

## 球隊資料（teams.js）

48 支 FIFA WC 2026 正式參賽隊，隊名繁體中文。

`WC_WEIGHTS` 為模擬投票權重，用於：
1. distribution 圖表（集體神諭）
2. 序號計算（`ordinal = base + nameHash % 73 + 1`，同名字 + 隊伍每次刷新結果一致）

---

## 分享功能

- 手機（含 Android）：Web Share API 原生分享
- 桌機：Popover 選單（Facebook / LINE / 複製連結）

---

## 未來規劃

- **Supabase 整合**：將 `WC_WEIGHTS` 靜態資料替換為即時投票，讓分佈圖反映真實使用者選擇
