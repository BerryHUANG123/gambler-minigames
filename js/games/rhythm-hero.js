// ========== 节奏大师 🥁 (Rhythm Hero) ==========
(function() {
  let state = { bet: 0, score: 0, playing: false, timer: null, spawnTimer: null, timeLeft: 30, speed: 1500 };
  const ARROWS = ['⬆️','⬇️','⬅️','➡️'];
  const KEYS = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
  const html = `<div class="game-page" id="page-rhythm-hero"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🥁 节奏大师</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="rhythmTarget" style="display:flex;justify-content:center;gap:16px;font-size:2.5rem;margin:8px 0;"><span style="border:2px solid #555;border-radius:8px;padding:8px 16px;">⬆️</span><span style="border:2px solid #555;border-radius:8px;padding:8px 16px;">⬇️</span><span style="border:2px solid #555;border-radius:8px;padding:8px 16px;">⬅️</span><span style="border:2px solid #555;border-radius:8px;padding:8px 16px;">➡️</span></div><div id="rhythmArrow" style="font-size:4rem;margin:8px 0;min-height:80px;">⏳</div><div style="display:flex;justify-content:space-between;width:100%;"><span>得分：<span id="rhythmScore" style="color:var(--gold);">0</span></span><span>时间：<span id="rhythmTime" style="color:var(--gold);">30</span>s</span></div><div id="rhythmResult" class="message">按键盘方向键或点击箭头！</div></div><div class="bet-options" id="rhythmBtns" style="display:flex;gap:8px;justify-content:center;">${ARROWS.map((a,i) => `<button class="bet-btn" style="font-size:1.5rem;padding:8px 16px;" onclick="Rhythm.press(${i})">${a}</button>`).join('')}</div><div class="chips"><div class="chip chip-100" onclick="Rhythm.bet(100)">100</div><div class="chip chip-500" onclick="Rhythm.bet(500)">500</div><div class="chip chip-1000" onclick="Rhythm.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="rhythmBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="rhythmStartBtn" onclick="Rhythm.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded', () => { document.getElementById('gamePages').insertAdjacentHTML('beforeend', html); });
  window.Rhythm = {
    bet(a) { if (state.playing) return; if (!Engine.canBet(a)) return; state.bet += a; Engine.state.balance -= a; Engine.save(); Engine.updateBalanceUI(); document.getElementById('rhythmBet').textContent = state.bet; Engine.play('click'); },
    start() {
      if (state.playing || state.bet <= 0) return;
      state.playing = true; state.score = 0; state.timeLeft = 30; state.speed = 1500;
      document.getElementById('rhythmStartBtn').disabled = true; document.getElementById('rhythmScore').textContent = '0'; document.getElementById('rhythmTime').textContent = '30';
      document.addEventListener('keydown', Rhythm.keyHandler);
      state.timer = setInterval(() => { state.timeLeft--; document.getElementById('rhythmTime').textContent = state.timeLeft; state.speed = Math.max(500, 1500 - (30 - state.timeLeft) * 33); if (state.timeLeft <= 0) Rhythm.end(); }, 1000);
      Rhythm.spawn();
    },
    spawn() { if (!state.playing) return; const idx = Engine.randomInt(0, 3); document.getElementById('rhythmArrow').textContent = ARROWS[idx]; state._currentArrow = idx; },
    press(idx) {
      if (!state.playing) return;
      if (idx === state._currentArrow) { state.score += 10; document.getElementById('rhythmScore').textContent = state.score; Engine.play('click'); }
      else { state.score = Math.max(0, state.score - 5); document.getElementById('rhythmScore').textContent = state.score; }
      Rhythm.spawn();
    },
    keyHandler(e) {
      const idx = KEYS.indexOf(e.key);
      if (idx >= 0) { e.preventDefault(); Rhythm.press(idx); }
    },
    end() {
      state.playing = false; clearInterval(state.timer); document.removeEventListener('keydown', Rhythm.keyHandler);
      document.getElementById('rhythmStartBtn').disabled = false; document.getElementById('rhythmArrow').textContent = '⏳';
      const win = Math.floor(state.bet * (1 + state.score * 0.02));
      Engine.addBalance(win);
      const res = document.getElementById('rhythmResult');
      if (state.score >= 200) { res.textContent = `🎉 完美！${state.score}分！赢 ${win} 筹码！`; res.className = 'message msg-win'; Engine.play('win'); Engine.showQuote('win'); }
      else { res.textContent = `${state.score}分，得 ${win} 筹码`; res.className = state.score >= 100 ? 'message msg-win' : 'message'; }
      state.bet = 0; document.getElementById('rhythmBet').textContent = '0'; Engine.updateBalanceUI();
    }
  };
})();