# Agent Instructions

## JS 修改后必做

更新 `index.html` 和 `js/engine.js` 中的缓存键：

- `index.html:71` — `<script src="js/base-game.js?v=N">`
- `js/engine.js:97` — `` script.src = `js/games/${id}.js?v=N`; ``

把 `N` 递增（v=2 → v=3 → v=4 ...）。
