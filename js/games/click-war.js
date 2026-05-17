// ========== 点击大战 👆 (Click War) ==========
(function() {
  let state = { bet: 0, playerScore: 0, compScore: 0, playing: false, timer: null, choice: null, timeLeft: 10 };
  BaseGame.init('click-war', '👆', '点击大战', {
    tableHTML: `<div style="font-size:3rem;margin:8px 0;">👆🤖</div><div style="display:flex;justify-content:space-around;width:100%;font-size:1.2rem;"><div>你：<span id="cwPlayer" style="color:var(--gold);">0</span></div><div>电脑：<span id="cwComp" style="color:#e74c3c;">0</span></div></div><div style="font-size:0.9rem;color:#888;margin:4px 0;">时间：<span id="cwTime" style="color:var(--gold);">10</span>s</div><div id="cwResult" class="message"></div>`,
    betOptionsHTML: `<button class="bet-btn" data-choice="player" onclick="CW.select('player')">押自己赢 🏆</button><button class="bet-btn" data-choice="comp" onclick="CW.select('comp')">押电脑赢 🤖</button>`,
    controlsHTML: `<button class="btn btn-primary" id="cwStartBtn" onclick="CW.start()" style="font-size:1.5rem;padding:12px 40px;">👆 狂点！</button>`
  });
  BaseGame.betHandler('click_war', state);
  const _cb=window.click_warBet;
  window.click_warBet=function(a){if(state.playing)return;_cb(a);};
  window.CW = {
    select(c) { state.choice = c; document.querySelectorAll('#page-click-war .bet-btn').forEach(b => b.classList.remove('selected')); document.querySelector(`#page-click-war [data-choice="${c}"]`).classList.add('selected'); Engine.play('click'); },
    bet: window.click_warBet,
    start() {
      if (state.playing || state.bet <= 0 || !state.choice) return;
      state.playing = true; state.playerScore = 0; state.compScore = 0; state.timeLeft = 10;
      document.getElementById('cwStartBtn').disabled = false;
      document.getElementById('cwPlayer').textContent = '0'; document.getElementById('cwComp').textContent = '0';
      document.getElementById('cwTime').textContent = '10'; document.getElementById('cwResult').textContent = '';
      state.timer = setInterval(() => {
        state.timeLeft--; document.getElementById('cwTime').textContent = state.timeLeft;
        state.compScore += Engine.randomInt(1, 3);
        document.getElementById('cwComp').textContent = state.compScore;
        if (state.timeLeft <= 0) CW.end();
      }, 1000);
    },
    click() { if (!state.playing) return; state.playerScore++; document.getElementById('cwPlayer').textContent = state.playerScore; Engine.play('click'); },
    end() {
      state.playing = false; clearInterval(state.timer); document.getElementById('cwStartBtn').disabled = false;
      const playerWon = state.playerScore > state.compScore;
      const betWon = (state.choice === 'player' && playerWon) || (state.choice === 'comp' && !playerWon);
      const res = document.getElementById('cwResult');
      if (betWon) {
        const win = state.bet * 2; BaseGame.settle('click_war', state, true, win);
        res.textContent = `🎉 你${state.playerScore}:${state.compScore}电脑，赢 ${win}！`; res.className = 'message msg-win';
      } else {
        const lost = state.bet; BaseGame.settle('click_war', state, false, 0);
        res.textContent = `😢 ${state.playerScore}:${state.compScore}，输 ${lost}`; res.className = 'message msg-lose';
      }
    }
  };
})();
