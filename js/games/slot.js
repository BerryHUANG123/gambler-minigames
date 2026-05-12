// ========== 老虎机 🎰 ==========

(function() {
  let state = { bet: 0, spinning: false };

  const SYMBOLS = ['🍒','🍋','🍊','🍇','🔔','💎','7️⃣','⭐','💰'];
  const PAYOUTS = {
    '💰💰💰': 50, '7️⃣7️⃣7️⃣': 30, '💎💎💎': 20,
    '⭐⭐⭐': 15, '🔔🔔🔔': 12,
    '🍇🍇🍇': 8, '🍊🍊🍊': 6, '🍋🍋🍋': 5, '🍒🍒🍒': 4,
    '💰💰': 5, '7️⃣7️⃣': 4,
  };

  function checkWin(reels) {
    const line = reels.join('');
    return PAYOUTS[line] || 0;
  }

  const html = `
  <div class="game-page" id="page-slot">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🎰 老虎机</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div class="reels">
        <div class="reel" id="slot1">🍒</div>
        <div class="reel" id="slot2">🍋</div>
        <div class="reel" id="slot3">🍇</div>
      </div>
      <div id="slotResult" class="message">拉杆试试手气！</div>
      <div id="slotPayout" style="font-size:0.8rem;color:#888;"></div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Slot.bet(100)">100</div>
      <div class="chip chip-500" onclick="Slot.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Slot.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="slotBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="slotSpinBtn" onclick="Slot.spin()">🎰 拉杆！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
    document.getElementById('slotPayout').textContent =
      '💰💰💰 x50 | 7️⃣7️⃣7️⃣ x30 | 💎💎💎 x20 | ⭐⭐⭐ x15 | 🍇🍇🍇 x8';
  });

  window.Slot = {
    bet(amount) {
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('slotBet').textContent = state.bet;
      Engine.play('click');
    },

    spin() {
      if (state.spinning || state.bet <= 0) return;
      state.spinning = true;
      document.getElementById('slotSpinBtn').disabled = true;
      document.getElementById('slotResult').textContent = '';
      Engine.play('spin');

      const r1 = document.getElementById('slot1');
      const r2 = document.getElementById('slot2');
      const r3 = document.getElementById('slot3');
      const reels = [r1, r2, r3];

      reels.forEach(r => r.classList.add('spinning'));

      let count = 0;
      const iv = setInterval(() => {
        reels.forEach(r => { r.textContent = SYMBOLS[Engine.randomInt(0, SYMBOLS.length-1)]; });
        if (++count >= 15) {
          clearInterval(iv);
          const result = [
            SYMBOLS[Engine.randomInt(0, SYMBOLS.length-1)],
            SYMBOLS[Engine.randomInt(0, SYMBOLS.length-1)],
            SYMBOLS[Engine.randomInt(0, SYMBOLS.length-1)],
          ];
          reels.forEach((r, i) => { r.textContent = result[i]; r.classList.remove('spinning'); });

          const multiplier = checkWin(result);
          const resEl = document.getElementById('slotResult');
          if (multiplier > 0) {
            const win = state.bet * multiplier;
            Engine.addBalance(win);
            resEl.textContent = `🎉 ${result.join('')} 中了！赢 ${win} 筹码！`;
            resEl.className = 'message msg-win';
            Engine.play('win');
            if (multiplier >= 20) Engine.showQuote('jackpot');
            else Engine.showQuote('win');
          } else {
            resEl.textContent = `${result.join('')} 没中，再来！`;
            resEl.className = 'message msg-lose';
            Engine.play('lose');
          }

          state.bet = 0;
          state.spinning = false;
          document.getElementById('slotBet').textContent = '0';
          document.getElementById('slotSpinBtn').disabled = false;
          Engine.updateBalanceUI();
        }
      }, 80);
    }
  };
})();