// ========== 掷骰子 ==========

(function() {
  let state = { bet: 0, choice: null, rolling: false };

  // 注册页面
  const html = `
  <div class="game-page" id="page-dice">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🎲 掷骰子</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div class="dice-area">
        <div class="die" id="d1">⚀</div>
        <div class="die" id="d2">⚁</div>
      </div>
      <div id="diceTotal" class="message msg-info">押大还是押小？</div>
      <div id="diceResult" class="message"></div>
    </div>
    <div class="bet-options">
      <button class="bet-btn" data-choice="big" onclick="Dice.select('big')">大 (7-12)</button>
      <button class="bet-btn" data-choice="small" onclick="Dice.select('small')">小 (2-6)</button>
      <button class="bet-btn" data-choice="triple" onclick="Dice.select('triple')">围骰 (1:10)</button>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Dice.bet(100)">100</div>
      <div class="chip chip-500" onclick="Dice.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Dice.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="diceBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="diceRollBtn" onclick="Dice.roll()">掷骰子！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  window.Dice = {
    select(choice) {
      state.choice = choice;
      document.querySelectorAll('#page-dice .bet-btn').forEach(b => b.classList.remove('selected'));
      document.querySelector(`#page-dice [data-choice="${choice}"]`).classList.add('selected');
      document.getElementById('diceResult').textContent = '';
      Engine.play('click');
    },

    bet(amount) {
      if (!Engine.canBet(amount)) {
        document.getElementById('diceResult').textContent = '筹码不够，穷鬼别来！';
        document.getElementById('diceResult').className = 'message msg-lose';
        return;
      }
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('diceBet').textContent = state.bet;
      Engine.play('click');
    },

    roll() {
      if (state.rolling || state.bet <= 0 || !state.choice) {
        if (!state.choice) document.getElementById('diceResult').textContent = '先选大小！';
        else if (state.bet <= 0) document.getElementById('diceResult').textContent = '先下注！';
        return;
      }

      state.rolling = true;
      document.getElementById('diceRollBtn').disabled = true;
      Engine.play('spin');

      const d1 = document.getElementById('d1');
      const d2 = document.getElementById('d2');
      const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
      d1.classList.add('rolling');
      d2.classList.add('rolling');

      let count = 0;
      const iv = setInterval(() => {
        d1.textContent = faces[Engine.randomInt(0,5)];
        d2.textContent = faces[Engine.randomInt(0,5)];
        if (++count >= 10) {
          clearInterval(iv);
          const v1 = Engine.randomInt(1,6);
          const v2 = Engine.randomInt(1,6);
          d1.textContent = faces[v1-1];
          d2.textContent = faces[v2-1];
          d1.classList.remove('rolling');
          d2.classList.remove('rolling');

          const total = v1 + v2;
          const isTriple = v1 === v2;
          document.getElementById('diceTotal').textContent = `点数：${v1} + ${v2} = ${total}`;
          
          let won = false;
          let multiplier = 1;
          const choice = state.choice;

          if (choice === 'triple' && isTriple) {
            won = true;
            multiplier = 10;
          } else if (choice === 'big' && total >= 8 && !isTriple) {
            won = true;
            multiplier = 2;
          } else if (choice === 'small' && total <= 6 && !isTriple) {
            won = true;
            multiplier = 2;
          }

          const result = document.getElementById('diceResult');
          if (won) {
            const win = state.bet * multiplier;
            Engine.addBalance(win);
            result.textContent = `中了！赢 ${win} 筹码！`;
            result.className = 'message msg-win';
            Engine.play('win');
            Engine.showQuote('win');
          } else {
            result.textContent = isTriple && choice !== 'triple' ? '围骰！通杀！' : '没中，继续！';
            result.className = 'message msg-lose';
            Engine.play('lose');
          }

          if (Engine.state.balance <= 0) {
            result.textContent += ' 💸 输光了，去借高利贷吧！';
            Engine.showQuote('taunt');
          }

          state.bet = 0;
          state.choice = null;
          state.rolling = false;
          document.getElementById('diceRollBtn').disabled = false;
          document.getElementById('diceBet').textContent = '0';
          document.querySelectorAll('#page-dice .bet-btn').forEach(b => b.classList.remove('selected'));
          Engine.updateBalanceUI();
        }
      }, 70);
    }
  };
})();