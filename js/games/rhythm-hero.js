// ========== 节奏大师 🥁 (Rhythm Hero) ==========
(function() {
  let state = { bet: 0, score: 0, playing: false, timer: null, spawnTimer: null, timeLeft: 30, speed: 1500 };
  const ARROWS = ['⬆️','⬇️','⬅️','➡️'];
  const KEYS = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
  BaseGame.init('rhythm-hero', '🥁', '节奏大师', {
    tableHTML: '<div id="rhythmTarget" style="display:flex;justify-content:center;gap:16px;font-size:2.5rem;margin:8px 0;"><span style="border:2px solid #555;border-radius:8px;padding:8px 16px;">⬆️</span><span style="border:2px solid #555;border-radius:8px;padding:8px 16px;">⬇️</span><span style="border:2px solid #555;border-radius:8px;padding:8px 16px;">⬅️</span><span style="border:2px solid #555;border-radius:8px;padding:8px 16px;">➡️</span></div><div id="rhythmArrow" style="font-size:4rem;margin:8px 0;min-height:80px;">⏳</div><div style="display:flex;justify-content:space-between;width:100%;"><span>得分：<span id="rhythmScore" style="color:var(--gold);">0</span></span><span>时间：<span id="rhythmTime" style="color:var(--gold);">30</span>s</span></div><div id="rhythmResult" class="message">按键盘方向键或点击箭头！</div>',
    betOptionsHTML: '<div class="bet-options" id="rhythmBtns" style="display:flex;gap:8px;justify-content:center;">' + ARROWS.map((a,i) => `<button class="bet-btn" style="font-size:1.5rem;padding:8px 16px;" onclick="Rhythm.press(${i})">${a}</button>`).join('') + '</div>',
    controlsHTML: '<button class="btn btn-primary" id="rhythmStartBtn" onclick="Rhythm.start()">开始！</button>'
  });
  BaseGame.betHandler('rhythm-hero', state);
  window.Rhythm = {
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
      const res = document.getElementById('rhythmResult');
      if (state.score >= 200) { res.textContent = '🎉 完美！' + state.score + '分！赢 ' + win + ' 筹码！'; res.className = 'message msg-win'; Engine.showQuote('win'); BaseGame.settle('rhythm-hero', state, true, win); }
      else if (state.score >= 100) { res.textContent = state.score + '分，得 ' + win + ' 筹码'; res.className = 'message msg-win'; BaseGame.settle('rhythm-hero', state, true, win); }
      else { res.textContent = state.score + '分，输 ' + state.bet; res.className = 'message msg-lose'; BaseGame.settle('rhythm-hero', state, false, 0); }
    }
  };
})();
