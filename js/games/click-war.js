// ========== 点击大战 👆 (Click War) ==========
(function() {
  let state = { bet: 0, playerScore: 0, compScore: 0, playing: false, timer: null, choice: null, timeLeft: 10 };
  const html = `<div class="game-page" id="page-click-war"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>👆 点击大战</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div style="font-size:3rem;margin:8px 0;">👆🤖</div><div style="display:flex;justify-content:space-around;width:100%;font-size:1.2rem;"><div>你：<span id="cwPlayer" style="color:var(--gold);">0</span></div><div>电脑：<span id="cwComp" style="color:#e74c3c;">0</span></div></div><div style="font-size:0.9rem;color:#888;margin:4px 0;">时间：<span id="cwTime" style="color:var(--gold);">10</span>s</div><div id="cwResult" class="message"></div></div><div class="bet-options"><button class="bet-btn" data-choice="player" onclick="CW.select('player')">押自己赢 🏆</button><button class="bet-btn" data-choice="comp" onclick="CW.select('comp')">押电脑赢 🤖</button></div><div class="chips"><div class="chip chip-100" onclick="CW.bet(100)">100</div><div class="chip chip-500" onclick="CW.bet(500)">500</div><div class="chip chip-1000" onclick="CW.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="cwBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="cwStartBtn" onclick="CW.start()" style="font-size:1.5rem;padding:12px 40px;">👆 狂点！</button></div></div>`;
  document.addEventListener('DOMContentLoaded', () => { document.getElementById('gamePages').insertAdjacentHTML('beforeend', html); });
  window.CW = {
    select(c) { state.choice = c; document.querySelectorAll('#page-click-war .bet-btn').forEach(b => b.classList.remove('selected')); document.querySelector(`#page-click-war [data-choice="${c}"]`).classList.add('selected'); Engine.play('click'); },
    bet(a) { if (state.playing) return; if (!Engine.canBet(a)) return; state.bet += a; Engine.state.balance -= a; Engine.save(); Engine.updateBalanceUI(); document.getElementById('cwBet').textContent = state.bet; Engine.play('click'); },
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
        const win = state.bet * 2; Engine.addBalance(win);
        res.textContent = `🎉 你${state.playerScore}:${state.compScore}电脑，赢 ${win}！`; res.className = 'message msg-win'; Engine.play('win');
      } else {
        res.textContent = `😢 ${state.playerScore}:${state.compScore}，输 ${state.bet}`; res.className = 'message msg-lose'; Engine.play('lose');
      }
      state.bet = 0; document.getElementById('cwBet').textContent = '0'; Engine.updateBalanceUI();
    }
  };
})();