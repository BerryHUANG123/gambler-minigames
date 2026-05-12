// ========== 猜大小 🀄 (Hi-Lo) ==========

(function() {
  let state = { bet: 0, choice: null, rolling: false };

  const html = `
  <div class="game-page" id="page-hilo">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🀄 猜大小</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div class="dice-area">
        <div class="die" id="h1">⚀</div>
        <div class="die" id="h2">⚁</div>
        <div class="die" id="h3">⚂</div>
      </div>
      <div id="hiloTotal" class="message msg-info">猜点数范围！</div>
      <div id="hiloResult" class="message"></div>
    </div>
    <div class="bet-options">
      <button class="bet-btn" data-choice="small" onclick="HiLo.select('small')">小 (3-10)</button>
      <button class="bet-btn" data-choice="big" onclick="HiLo.select('big')">大 (11-18)</button>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="HiLo.bet(100)">100</div>
      <div class="chip chip-500" onclick="HiLo.bet(500)">500</div>
      <div class="chip chip-1000" onclick="HiLo.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="hiloBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="hiloRollBtn" onclick="HiLo.roll()">开骰！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  const FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];

  window.HiLo = {
    select(choice) {
      state.choice = choice;
      document.querySelectorAll('#page-hilo .bet-btn').forEach(b => b.classList.remove('selected'));
      document.querySelector(`#page-hilo [data-choice="${choice}"]`).classList.add('selected');
      document.getElementById('hiloResult').textContent = '';
      Engine.play('click');
    },

    bet(amount) {
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('hiloBet').textContent = state.bet;
      Engine.play('click');
    },

    roll() {
      if (state.rolling || state.bet <= 0 || !state.choice) return;

      state.rolling = true;
      document.getElementById('hiloRollBtn').disabled = true;
      Engine.play('spin');

      const d = [document.getElementById('h1'), document.getElementById('h2'), document.getElementById('h3')];
      d.forEach(el => el.classList.add('rolling'));

      let count = 0;
      const iv = setInterval(() => {
        d.forEach(el => { el.textContent = FACES[Engine.randomInt(0,5)]; });
        if (++count >= 10) {
          clearInterval(iv);
          const vals = [Engine.randomInt(1,6), Engine.randomInt(1,6), Engine.randomInt(1,6)];
          const total = vals.reduce((a,b) => a+b, 0);
          d.forEach((el, i) => { el.textContent = FACES[vals[i]-1]; el.classList.remove('rolling'); });

          document.getElementById('hiloTotal').textContent = `点数：${vals[0]} + ${vals[1]} + ${vals[2]} = ${total}`;

          const isBig = total >= 11;
          const won = (state.choice === 'big' && isBig) || (state.choice === 'small' && !isBig);

          const res = document.getElementById('hiloResult');
          if (won) {
            const win = state.bet * 2;
            Engine.addBalance(win);
            res.textContent = `${state.choice === 'big' ? '大' : '小'}！中了！赢 ${win}`;
            res.className = 'message msg-win';
            Engine.play('win');
            Engine.showQuote('win');
          } else {
            res.textContent = `没中，输 ${state.bet}`;
            res.className = 'message msg-lose';
            Engine.play('lose');
          }

          state.bet = 0;
          state.choice = null;
          state.rolling = false;
          document.getElementById('hiloRollBtn').disabled = false;
          document.getElementById('hiloBet').textContent = '0';
          document.querySelectorAll('#page-hilo .bet-btn').forEach(b => b.classList.remove('selected'));
          Engine.updateBalanceUI();
        }
      }, 70);
    }
  };
})();