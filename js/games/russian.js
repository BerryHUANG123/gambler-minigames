// ========== 俄罗斯轮盘 💀 ==========

(function() {
  let state = { bet: 0, chambers: [], current: 0, playing: false };

  function resetGun() {
    state.chambers = [false, false, false, false, false, false];
    state.chambers[Engine.randomInt(0, 5)] = true; // one bullet
    state.current = 0;
  }

  const html = `
  <div class="game-page" id="page-russian">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>💀 俄罗斯轮盘</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="gunDisplay" style="font-size:4rem;margin:10px 0;">🔫</div>
      <div id="gunChamber" style="font-size:0.9rem;color:#888;">已扣扳机：0/6</div>
      <div id="russianResult" class="message">按扣扳机！活下来赢双倍！</div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Russian.bet(100)">100</div>
      <div class="chip chip-500" onclick="Russian.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Russian.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="ruBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="ruFireBtn" onclick="Russian.fire()">🔫 扣扳机！</button>
      <button class="btn" id="ruNewBtn" onclick="Russian.newGame()">新一局</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  window.Russian = {
    bet(amount) {
      if (state.playing) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('ruBet').textContent = state.bet;
      Engine.play('click');
    },

    newGame() {
      state.bet = 0;
      state.playing = false;
      resetGun();
      document.getElementById('ruBet').textContent = '0';
      document.getElementById('ruFireBtn').disabled = false;
      document.getElementById('russianResult').textContent = '新的一局！敢扣扳机吗？';
      document.getElementById('russianResult').className = 'message msg-info';
      document.getElementById('gunDisplay').textContent = '🔫';
      document.getElementById('gunChamber').textContent = '已扣扳机：0/6';
      Engine.updateBalanceUI();
    },

    fire() {
      if (state.playing || state.bet <= 0) return;
      if (!state.chambers.length) resetGun();

      state.playing = true;
      document.getElementById('ruFireBtn').disabled = true;
      Engine.play('spin');

      setTimeout(() => {
        const isDead = state.chambers[state.current];
        state.current++;
        const res = document.getElementById('russianResult');
        const gun = document.getElementById('gunDisplay');

        if (isDead) {
          gun.textContent = '💥💀';
          res.textContent = `💥 砰！你死了！输 ${state.bet}`;
          res.className = 'message msg-lose';
          Engine.play('lose');
          Engine.showQuote('taunt');
        } else {
          const survived = state.current;
          gun.textContent = survived >= 3 ? '😎🔫' : '😰🔫';
          document.getElementById('gunChamber').textContent = `已扣扳机：${survived}/6`;

          if (survived >= 6) {
            const win = state.bet * 6;
            Engine.addBalance(win);
            res.textContent = `🎉 6枪全空！你活下来了！赢 ${win}！赌神保佑！`;
            res.className = 'message msg-celebrate';
            Engine.play('win');
            Engine.showQuote('jackpot');
          } else {
            const cashout = Math.floor(state.bet * (1 + survived * 0.5));
            res.innerHTML = `你活过了 ${survived} 枪！<br>继续扣还是收手？<br>现在收手拿 ${cashout}，继续扣翻倍！`;
            res.className = 'message msg-info';

            // Add cashout option
            const controls = document.querySelector('#page-russian .game-controls');
            if (!document.getElementById('ruCashoutBtn')) {
              const btn = document.createElement('button');
              btn.className = 'btn btn-primary';
              btn.id = 'ruCashoutBtn';
              btn.textContent = `💰 收手 (拿 ${cashout})`;
              btn.onclick = () => {
                Engine.addBalance(cashout);
                res.textContent = `见好就收！拿走 ${cashout}`;
                res.className = 'message msg-win';
                Engine.play('win');
                document.getElementById('ruFireBtn').disabled = true;
                document.getElementById('ruCashoutBtn').disabled = true;
                Engine.updateBalanceUI();
              };
              controls.appendChild(btn);

              // Re-enable fire with higher stakes
              const fireBtn = document.getElementById('ruFireBtn');
              fireBtn.disabled = false;
              fireBtn.textContent = `🔥 继续 (x${survived + 1})`;
              state.playing = false;
              Engine.play('click');
            }
          }
        }

        Engine.updateBalanceUI();
      }, 1000);
    }
  };
})();