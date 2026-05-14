(function() {
  // Slot Machine Game
  const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
  const SYMBOLS_CHINESE = ['樱桃', '柠檬', '橙子', '葡萄', '钻石', '7'];

  let state = {
    balance: 1000,
    bet: 0,
    spinning: false
  };

  const html = `<div class="game-page" id="page-slot">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🎰 老虎机</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div class="reels-container">
        <div class="reel" id="reel1">🍒</div>
        <div class="reel" id="reel2">🍒</div>
        <div class="reel" id="reel3">🍒</div>
      </div>
      <div id="slotMessage" class="message"></div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Slot.bet(100)">100</div>
      <div class="chip chip-500" onclick="Slot.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Slot.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="slotBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="slotSpinBtn" onclick="Slot.spin()">🎰 旋转</button>
    </div>
  </div>`;

  function init() {
    Engine.registerPage('slot', html, Slot.init);
    Slot.updateUI();
  }

  function bet(amount) {
    if (state.balance < amount) {
      Engine.showQuote('error', '余额不足！');
      return;
    }
    state.bet = amount;
    state.spinning = false;
    document.getElementById('slotMessage').textContent = '';
    Slot.updateUI();
    Engine.play('click');
  }

  function spin() {
    if (state.spinning || state.bet === 0) {
      if (state.bet === 0) Engine.showQuote('error', '请先下注！');
      return;
    }
    if (state.balance < state.bet) {
      Engine.showQuote('error', '余额不足！');
      return;
    }

    state.spinning = true;
    state.balance -= state.bet;
    Slot.updateUI();

    const results = [0, 0, 0];
    let round = 0;

    const spinReel = (index) => {
      return new Promise(resolve => {
        const reel = document.getElementById(`reel${index + 1}`);
        reel.classList.add('spinning');

        const interval = setInterval(() => {
          reel.textContent = SYMBOLS[Engine.randomInt(0, SYMBOLS.length - 1)];
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reel.classList.remove('spinning');
          const finalIndex = Engine.randomInt(0, SYMBOLS.length - 1);
          results[index] = finalIndex;
          reel.textContent = SYMBOLS[finalIndex];
          resolve();
        }, 1000 + round * 500);
      });
    };

    const playRound = async (r) => {
      await spinReel(r);
      round++;
      if (round < 3) {
        playRound(round);
      } else {
        state.spinning = false;
        Slot.checkWin(results);
      }
    };

    playRound(0);
  }

  function checkWin(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
      // Three of a kind
      const payouts = [5, 10, 20, 50, 100, 500];
      const win = state.bet * payouts[r1];
      state.balance += win;
      Engine.showQuote('win', `🎉 三连！${SYMBOLS_CHINESE[r1]}！赢 ${win} 筹码！`);
      Engine.play('win');
      document.getElementById('slotMessage').textContent = `🎉 三连！${SYMBOLS_CHINESE[r1]}！`;
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      // Two of a kind
      const win = Math.floor(state.bet * 1.5);
      state.balance += win;
      Engine.showQuote('win', `🎉 两连！赢 ${win} 筹码！`);
      Engine.play('win');
      document.getElementById('slotMessage').textContent = `🎉 两连！`;
    } else {
      Engine.showQuote('lose', '😢 再试一次！');
      Engine.play('lose');
      document.getElementById('slotMessage').textContent = '😢 再试一次';
    }

    Slot.updateUI();
  }

  function updateUI() {
    document.querySelectorAll('#page-slot .balance-val').forEach(el => el.textContent = state.balance);
    document.getElementById('slotBet').textContent = state.bet;
    document.getElementById('slotSpinBtn').disabled = state.spinning || state.bet === 0;
  }

  const Slot = {
    bet,
    spin,
    checkWin,
    updateUI,
    init
  };

  init();
})();
