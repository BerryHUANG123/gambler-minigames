// ========== 轮盘 🎡 (Roulette) ==========

(function() {
  let state = { bet: 0, choice: null, spinning: false };

  const SEGMENTS = [
    { num: 0, color: 'green' },
    { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' },
    { num: 4, color: 'black' }, { num: 21, color: 'red' }, { num: 2, color: 'black' },
    { num: 25, color: 'red' }, { num: 17, color: 'black' }, { num: 34, color: 'red' },
    { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
    { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' },
    { num: 8, color: 'black' }, { num: 23, color: 'red' }, { num: 10, color: 'black' },
    { num: 5, color: 'red' }, { num: 24, color: 'black' }, { num: 16, color: 'red' },
    { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
    { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' },
    { num: 22, color: 'black' }, { num: 18, color: 'red' }, { num: 29, color: 'black' },
    { num: 7, color: 'red' }, { num: 28, color: 'black' }, { num: 12, color: 'red' },
    { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' },
  ];

  function getMultiplier(choice, result) {
    const { num, color } = result;
    switch(choice) {
      case 'red': return color === 'red' ? 2 : 0;
      case 'black': return color === 'black' ? 2 : 0;
      case 'even': return num !== 0 && num % 2 === 0 ? 2 : 0;
      case 'odd': return num % 2 !== 0 ? 2 : 0;
      case 'low': return num >= 1 && num <= 18 ? 2 : 0;
      case 'high': return num >= 19 && num <= 36 ? 2 : 0;
      case 'zero': return num === 0 ? 35 : 0;
      default: return 0;
    }
  }

  const html = `
  <div class="game-page" id="page-roulette">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🎡 轮盘</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="rtWheelDisplay" style="font-size:3rem;margin:10px 0;">🎡</div>
      <div id="rtNumber" style="font-size:2rem;font-weight:bold;color:var(--gold);min-height:50px;">?</div>
      <div id="rtResult" class="message"></div>
    </div>
    <div class="bet-options" style="max-width:400px;">
      <button class="bet-btn" data-choice="red" onclick="Roulette.select('red')">🔴 红</button>
      <button class="bet-btn" data-choice="black" onclick="Roulette.select('black')">⚫ 黑</button>
      <button class="bet-btn" data-choice="even" onclick="Roulette.select('even')">偶</button>
      <button class="bet-btn" data-choice="odd" onclick="Roulette.select('odd')">奇</button>
      <button class="bet-btn" data-choice="low" onclick="Roulette.select('low')">1-18</button>
      <button class="bet-btn" data-choice="high" onclick="Roulette.select('high')">19-36</button>
      <button class="bet-btn bet-btn-danger" data-choice="zero" onclick="Roulette.select('zero')" style="border-color:#e74c3c;color:#e74c3c;">0 (x35)</button>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Roulette.bet(100)">100</div>
      <div class="chip chip-500" onclick="Roulette.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Roulette.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="rtBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="rtSpinBtn" onclick="Roulette.spin()">转！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  window.Roulette = {
    select(choice) {
      state.choice = choice;
      document.querySelectorAll('#page-roulette .bet-btn').forEach(b => b.classList.remove('selected'));
      document.querySelector(`#page-roulette [data-choice="${choice}"]`).classList.add('selected');
      document.getElementById('rtResult').textContent = '';
      Engine.play('click');
    },

    bet(amount) {
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('rtBet').textContent = state.bet;
      Engine.play('click');
    },

    spin() {
      if (state.spinning || state.bet <= 0 || !state.choice) return;
      state.spinning = true;
      document.getElementById('rtSpinBtn').disabled = true;
      Engine.play('spin');

      const wheel = document.getElementById('rtWheelDisplay');
      let count = 0;
      const iv = setInterval(() => {
        wheel.textContent = ['🎡','🌀','🎰'][count % 3];
        if (++count > 20) {
          clearInterval(iv);
          const idx = Engine.randomInt(0, SEGMENTS.length - 1);
          const result = SEGMENTS[idx];
          const numEl = document.getElementById('rtNumber');
          const color = result.color === 'red' ? '#c0392b' : result.color === 'black' ? '#1a1a1a' : '#2ecc71';
          numEl.innerHTML = `<span style="display:inline-block;width:50px;height:50px;line-height:50px;border-radius:50%;background:${color};color:white;">${result.num}</span>`;
          wheel.textContent = '🎡';

          const mult = getMultiplier(state.choice, result);
          const resEl = document.getElementById('rtResult');
          if (mult > 0) {
            const win = state.bet * mult;
            Engine.addBalance(win);
            resEl.textContent = `中了！${result.num} ${result.color === 'red' ? '🔴' : result.color === 'black' ? '⚫' : '🟢'}！赢 ${win}`;
            resEl.className = 'message msg-win';
            Engine.play('win');
            Engine.showQuote('win');
          } else {
            resEl.textContent = `${result.num} 没中，输 ${state.bet}`;
            resEl.className = 'message msg-lose';
            Engine.play('lose');
          }

          state.bet = 0;
          state.choice = null;
          state.spinning = false;
          document.getElementById('rtSpinBtn').disabled = false;
          document.getElementById('rtBet').textContent = '0';
          document.querySelectorAll('#page-roulette .bet-btn').forEach(b => b.classList.remove('selected'));
          Engine.updateBalanceUI();
        }
      }, 80);
    }
  };
})();