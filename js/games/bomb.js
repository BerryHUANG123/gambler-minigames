// ========== 拆弹 💣 (Bomb Defusal) ==========

(function() {
  let state = { bet: 0, bombIndex: -1, exploded: false, picked: false };

  const html = `
  <div class="game-page" id="page-bomb">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>💣 拆弹</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="bombDisplay" style="font-size:4rem;margin:10px 0;">💣</div>
      <div class="hand" id="bombButtons" style="gap:16px;"></div>
      <div id="bombResult" class="message">三个按钮，一个会炸！</div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Bomb.bet(100)">100</div>
      <div class="chip chip-500" onclick="Bomb.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Bomb.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="bombBet">0</span></div>
    <div class="game-controls">
      <button class="btn" id="bombNewBtn" onclick="Bomb.newGame()">新一局</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  window.Bomb = {
    bet(amount) {
      if (state.picked) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById('bombBet').textContent = state.bet; Engine.play('click');
      if (state.bet > 0 && state.bombIndex === -1) Bomb.setup();
    },

    setup() {
      state.bombIndex = Engine.randomInt(0, 2);
      state.exploded = false;
      state.picked = false;
      document.getElementById('bombDisplay').textContent = '💣';
      document.getElementById('bombButtons').innerHTML = [0,1,2].map(i =>
        `<div onclick="Bomb.press(${i})" style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#555,#333);display:flex;align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer;border:2px solid #888;transition:0.2s;" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='#888'">
          ❓
        </div>`
      ).join('');
      document.getElementById('bombResult').textContent = '选一个按钮按下去！';
      document.getElementById('bombResult').className = 'message msg-info';
    },

    press(idx) {
      if (state.picked || state.bet <= 0) return;
      state.picked = true;
      const isBomb = idx === state.bombIndex;

      document.getElementById('bombButtons').innerHTML = [0,1,2].map((_, i) => {
        if (i === idx) {
          if (isBomb) return `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#8b0000,#cc0000);display:flex;align-items:center;justify-content:center;font-size:2rem;border:3px solid #ff0;">💥</div>`;
          return `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#006400,#00aa00);display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid var(--gold);">✅</div>`;
        }
        const show = isBomb && i === state.bombIndex;
        if (show) return `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#8b0000,#cc0000);display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid #ff0;opacity:0.5;">💥</div>`;
        return `<div style="width:80px;height:80px;border-radius:50%;background:#222;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid #444;opacity:0.3;">❓</div>`;
      });

      Engine.play(isBomb ? 'lose' : 'win');
      const res = document.getElementById('bombResult');
      if (isBomb) {
        document.getElementById('bombDisplay').textContent = '💥💀';
        res.textContent = `💥 炸了！输 ${state.bet}`;
        res.className = 'message msg-lose';
        Engine.showQuote('taunt');
      } else {
        const win = state.bet * 3;
        Engine.addBalance(win);
        res.textContent = `✅ 安全！你拆掉了炸弹！赢 ${win}`;
        res.className = 'message msg-win';
        Engine.play('win');
        Engine.showQuote('win');
      }
      state.bet = 0;
      document.getElementById('bombBet').textContent = '0';
      Engine.updateBalanceUI();
    },

    newGame() {
      state.bet = 0; state.bombIndex = -1; state.picked = false;
      document.getElementById('bombBet').textContent = '0';
      document.getElementById('bombDisplay').textContent = '💣';
      document.getElementById('bombButtons').innerHTML = '下注后开始';
      document.getElementById('bombResult').textContent = '下注开始！';
      document.getElementById('bombResult').className = 'message msg-info';
      Engine.updateBalanceUI();
    }
  };
})();