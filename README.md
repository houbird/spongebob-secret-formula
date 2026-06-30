# 神奇海螺秘方

用 Next.js 建的單頁靜態站，資料在瀏覽器執行時從 opensheet API 抓取，最後輸出成 GitHub Pages 可直接部署的 HTML / CSS / JS。

## 功能

- 好手氣：隨機抽一張海綿寶寶台詞圖
- 查詢：關鍵字篩選 + 分頁結果
- 省流策略：首頁預設不渲染搜尋圖片，只有抽中的圖片與查詢當前頁結果才會載入

## 技術選型

- Next.js 16 App Router
- Tailwind CSS v4
- lucide-react
- `output: "export"` 靜態匯出
- GitHub Pages Project Pages 路徑：`/spongebob-secret-formula`

## 資料來源

- API: `https://opensheet.elk.sh/1P7h4--lgGrIEsLNz-qyVJUJ7V6yPgZUaFU-wwfqwH7M/wumbo`

## 本機開發

```bash
npm install
npm run dev
```

開啟：`http://localhost:3000/`

## 靜態建置

```bash
npm run build
```

建置結果會輸出到 `out/`。

如果你想直接本機預覽靜態輸出：

```bash
npx serve out
```

預覽路徑：`http://localhost:3000/spongebob-secret-formula/`

## 部署到 GitHub Pages

1. 到 repo 的 `Settings > Pages`
2. `Build and deployment` 選 `GitHub Actions`
3. 推到 `main` 後，workflow 會自動建置並部署 `out/`

Workflow 檔案在 `.github/workflows/deploy.yml`。
