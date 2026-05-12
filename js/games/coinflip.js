// ========== 猜硬币 🎪 (Coin Flip) ==========

(function() {
  let state = { bet: 0, choice: null, flipping: false };

  const html = `
  <div class="game-page" id="page-coinflip" style="display:none;">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🎪 猜硬币</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="coinDisplay" style="font-size:5rem;margin:10px 0;transition:0.3s;">🪙</div>
      <div id="coinResult" class="message">正面还是反面？</div>
    </div>
    <div class="bet-options">
      <button class="bet-btn" data-choice="heads" onclick="CoinFlip.select('heads')">正面 👑</button>
      <button class="bet-btn" data-choice="tails" onclick="CoinFlip.select('tails')">反面 🍀</button>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="CoinFlip.bet(100)">100</div>
      <div class="chip chip-500" onclick="CoinFlip.bet(500)">500</div>
      <div class="chip chip-1000" onclick="CoinFlip.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="cfBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="cfFlipBtn" onclick="CoinFlip.flip()">掷硬币！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
    // Register this game in the hall (we'll add to main.js grid later)
    // For now, add it dynamically
    setTimeout(() => {
      const grid = document.getElementById('gameGrid');
      if (grid && !document.querySelector('[onclick*="coinflip"]')) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => Engine.showGame('coinflip');
        card.innerHTML = '<div class="icon">🎪</div><div class="name">猜硬币</div><div class="desc">正面反面？50%胜率，简单刺激。</div><span class="badge badge-ready">▶ 开玩</span>';
        grid.appendChild(card);
      }
    }, 100);
  });

  window.CoinFlip = {
    select(choice) {
      state.choice = choice;
      document.querySelectorAll('#page-coinflip .bet-btn').forEach(b => b.classList.remove('selected'));
      document.querySelector(`#page-coinflip [data-choice="${choice}"]`).classList.add('selected');
      document.getElementById('coinResult').textContent = '';
      Engine.play('click');
    },
    bet(amount) {
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById('cfBet').textContent = state.bet; Engine.play('click');
    },
    flip() {
      if (state.flipping || state.bet <= 0 || !state.choice) return;
      state.flipping = true;
      document.getElementById('cfFlipBtn').disabled = true;
      Engine.play('spin');
      const coin = document.getElementById('coinDisplay');
      let count = 0;
      const iv = setInterval(() => {
        coin.textContent = count % 2 ? '👑' : '🍀';
        coin.style.transform = `rotateY(${count * 180}deg)`;
        if (++count > 12) {
          clearInterval(iv);
          const result = Math.random() < 0.5 ? 'heads' : 'tails';
          coin.textContent = result === 'heads' ? '👑' : '🍀';
          coin.style.transform = 'rotateY(0deg)';
          const won = state.choice === result;
          const res = document.getElementById('coinResult');
          if (won) {
            const win = state.bet * 2;
            Engine.addBalance(win);
            res.textContent = `${result === 'heads' ? '正面' : '反面'}！中了！赢 ${win}`;
            res.className = 'message msg-win'; Engine.play('win');
          } else {
            res.textContent = `${result === 'heads' ? '正面' : '反面'}，输 ${state.bet}`;
            res.className = 'message msg-lose'; Engine.play('lose');
          }
          state.bet = 0; state.choice = null; state.flipping = false;
          document.getElementById('cfFlipBtn').disabled = false;
          document.getElementById('cfBet').textContent = '0';
          document.querySelectorAll('#page-coinflip .bet-btn').forEach(b => b.classList.remove('selected'));
          Engine.updateBalanceUI();
        }
      }, 80);
    }
  };
})();