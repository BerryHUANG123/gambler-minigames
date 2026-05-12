// ========== 刮刮乐 💳 (Scratch Card) ==========

(function() {
  let state = { bet: 0, revealed: false, cards: [] };

  const PRIZES = [
    { text: '💩 谢谢参与', mult: 0 },
    { text: '🪙 小奖', mult: 1.5 },
    { text: '💰 中奖', mult: 3 },
    { text: '💎 大奖', mult: 5 },
    { text: '👑 头奖！', mult: 10 },
  ];

  const html = `
  <div class="game-page" id="page-scratch">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>💳 刮刮乐</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div class="hand" id="scCards" style="gap:12px;"></div>
      <div id="scResult" class="message">选一张刮开！</div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Scratch.bet(100)">100</div>
      <div class="chip chip-500" onclick="Scratch.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Scratch.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="scBet">0</span></div>
    <div class="game-controls">
      <button class="btn" id="scNewBtn" onclick="Scratch.newGame()">新一局</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  window.Scratch = {
    bet(amount) {
      if (state.revealed) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById('scBet').textContent = state.bet; Engine.play('click');
      if (state.bet > 0) Scratch.deal();
    },

    deal() {
      state.cards = Engine.shuffle([...PRIZES]).slice(0, 3);
      state.revealed = false;
      document.getElementById('scCards').innerHTML = state.cards.map((_, i) =>
        `<div class="card card-back" onclick="Scratch.scratch(${i})" style="cursor:pointer;width:80px;height:110px;font-size:0.8rem;">
          <span style="color:var(--gold);font-size:0.7rem;">第${i+1}张</span>
        </div>`
      ).join('');
      document.getElementById('scResult').textContent = '选一张，刮开它！';
      document.getElementById('scResult').className = 'message msg-info';
    },

    scratch(idx) {
      if (state.revealed || state.bet <= 0) return;
      state.revealed = true;
      const prize = state.cards[idx];
      const win = Math.floor(state.bet * prize.mult);

      document.getElementById('scCards').innerHTML = state.cards.map((c, i) => {
        if (i === idx) {
          const cls = prize.mult === 0 ? 'msg-lose' : 'msg-win';
          return `<div class="card" style="width:80px;height:110px;background:#f5e6c8;border:2px solid ${prize.mult === 0 ? '#666' : 'var(--gold)'};flex-direction:column;font-size:0.9rem;">
            ${c.text}
          </div>`;
        }
        return `<div class="card card-back" style="width:80px;height:110px;opacity:0.4;"></div>`;
      });

      const res = document.getElementById('scResult');
      if (win > 0) {
        Engine.addBalance(win);
        res.textContent = `${prize.text}！赢 ${win} 筹码！`;
        res.className = 'message msg-win';
        Engine.play('win');
        Engine.showQuote(prize.mult >= 5 ? 'jackpot' : 'win');
      } else {
        res.textContent = `${prize.text}，输 ${state.bet}`;
        res.className = 'message msg-lose';
        Engine.play('lose');
      }

      state.bet = 0;
      document.getElementById('scBet').textContent = '0';
      Engine.updateBalanceUI();
    },

    newGame() {
      state.bet = 0; state.revealed = false;
      document.getElementById('scBet').textContent = '0';
      document.getElementById('scCards').innerHTML = '下注后发卡';
      document.getElementById('scResult').textContent = '下注开始！';
      document.getElementById('scResult').className = 'message msg-info';
      Engine.updateBalanceUI();
    }
  };
})();