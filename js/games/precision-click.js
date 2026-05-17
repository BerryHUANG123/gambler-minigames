// ========== 精准点击 🎯 (Precision Click) ==========
(function() {
  let state = { bet: 0, score: 0, playing: false, timer: null, timeLeft: 10, targetSize: 50 };
  const ns='precision-click';
  BaseGame.init(ns, '🎯', '精准点击', {
    tableHTML: '<div id="precArea" style="position:relative;width:100%;height:220px;background:rgba(0,0,0,0.3);border-radius:12px;overflow:hidden;"><div id="precTarget" style="position:absolute;border-radius:50%;background:radial-gradient(circle,var(--gold),#c0392b);cursor:pointer;display:none;transition:all 0.3s;" onclick="Prec.hit(event)"></div><div id="precReady" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#888;">下注后开始</div></div><div style="display:flex;justify-content:space-between;width:100%;margin-top:6px;"><span>得分：<span id="precScore" style="color:var(--gold);">0</span></span><span>时间：<span id="precTime" style="color:var(--gold);">10</span>s</span></div><div id="precResult" class="message"></div>',
    controlsHTML: '<button class="btn btn-primary" id="precStartBtn" onclick="Prec.start()">开始！</button>'
  });
  window.Prec = {
    bet: BaseGame.betHandler(ns, state),
    start() {
      if (state.playing || state.bet <= 0) return;
      state.playing = true; state.score = 0; state.timeLeft = 10; state.targetSize = 50;
      document.getElementById('precStartBtn').disabled = true; document.getElementById('precReady').style.display = 'none';
      document.getElementById('precScore').textContent = '0'; document.getElementById('precTime').textContent = '10';
      const t = document.getElementById('precTarget'); t.style.display = 'block'; t.style.width = '50px'; t.style.height = '50px';
      Prec.spawn(); state.timer = setInterval(() => { state.timeLeft--; document.getElementById('precTime').textContent = state.timeLeft; state.targetSize = Math.max(20, 50 - (10 - state.timeLeft) * 3); if (state.timeLeft <= 0) Prec.end(); }, 1000);
    },
    spawn() {
      const area = document.getElementById('precArea'); const t = document.getElementById('precTarget');
      const s = state.targetSize; t.style.width = s + 'px'; t.style.height = s + 'px';
      t.style.left = Engine.randomInt(10, area.clientWidth - s - 10) + 'px';
      t.style.top = Engine.randomInt(10, area.clientHeight - s - 10) + 'px';
    },
    hit(e) {
      if (!state.playing) return;
      state.score += Math.ceil(50 / state.targetSize * 2);
      document.getElementById('precScore').textContent = state.score; Engine.play('click'); Prec.spawn();
    },
    end() {
      state.playing = false; clearInterval(state.timer);
      document.getElementById('precTarget').style.display = 'none';
      document.getElementById('precStartBtn').disabled = false;
      const win = Math.floor(state.bet * (1 + state.score * 0.15));
      const res = document.getElementById('precResult');
      res.textContent = state.score >= 20 ? `🎉 ${state.score}分！赢 ${win} 筹码！` : `${state.score}分，得 ${win} 筹码`;
      res.className = state.score >= 10 ? 'message msg-win' : 'message';
      BaseGame.settle(ns, state, true, win);
      if (state.score >= 15) Engine.showQuote('win');
      document.getElementById('precReady').style.display = 'block';
      document.getElementById('precReady').textContent = '再来一局！';
    }
  };
})();
