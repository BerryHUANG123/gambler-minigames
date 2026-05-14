(function() {
  // Dice Game
  const SUITS = ['♠', '♥', '♣', '♦'];
  const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  let state = {
    balance: 1000,
    bet: 0,
    result: null
  };

  const html = `<div class="game-page" id="page-dice">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🎲 掷骰子</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="diceContainer" style="display:flex;gap:15px;justify-content:center;margin:20px 0;">
        <div class="die" id="die1">?</div>
        <div class="die" id="die2">?</div>
        <div class="die" id="die3">?</div>
      </div>
      <div id="diceResult" style="font-size:1.3rem;color:var(--gold);min-height:30px;text-align:center;"></div>
      <div id="diceMessage" class="message"></div>
    </div>
    <div class="bet-options">
      <button class="bet-btn" data-choice="big" onclick="Dice.select('big')">大 (4-6) x2</button>
      <button class="bet-btn" data-choice="small" onclick="Dice.select('small')">小 (1-3) x2</button>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Dice.bet(100)">100</div>
      <div class="chip chip-500" onclick="Dice.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Dice.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="diceBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="diceRollBtn" onclick="Dice.roll()">🎲 掷骰子</button>
    </div>
  </div>`;

  function init() {
    Engine.registerPage('dice', html, Dice.init);
    Dice.updateUI();
  }

  function select(choice) {
    state.choice = choice;
    document.querySelectorAll('#page-dice .bet-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector(`#page-dice [data-choice="${choice}"]`).classList.add('selected');
    Engine.play('click');
  }

  function bet(amount) {
    if (state.balance < amount) {
      Engine.showQuote('error', '余额不足！');
      return;
    }
    state.bet = amount;
    state.choice = null;
    state.result = null;
    document.querySelectorAll('#page-dice .bet-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('diceMessage').textContent = '';
    document.getElementById('diceResult').textContent = '';
    Dice.updateUI();
    Engine.play('click');
  }

  function roll() {
    if (!state.choice || state.bet === 0) {
      Engine.showQuote('error', '请先下注并选择大或小！');
      return;
    }
    if (state.balance < state.bet) {
      Engine.showQuote('error', '余额不足！');
      return;
    }

    const die1 = Engine.randomInt(1, 6);
    const die2 = Engine.randomInt(1, 6);
    const die3 = Engine.randomInt(1, 6);
    const sum = die1 + die2 + die3;

    state.result = { die1, die2, die3, sum };
    Dice.renderDice();
    Dice.updateUI();

    const total = state.bet * 2;
    if ((sum >= 4 && sum <= 10) === state.choice === 'big') {
      state.balance += total;
      Engine.showQuote('win', `🎉 大！点数 ${sum}，赢 ${total} 筹码！`);
      Engine.play('win');
    } else if ((sum >= 4 && sum <= 10) === state.choice === 'small') {
      state.balance += total;
      Engine.showQuote('win', `🎉 小！点数 ${sum}，赢 ${total} 筹码！`);
      Engine.play('win');
    } else {
      state.balance -= state.bet;
      Engine.showQuote('lose', `😢 点数 ${sum}，输了 ${state.bet} 筹码！`);
      Engine.play('lose');
    }

    document.getElementById('diceMessage').textContent = `点数：${die1} + ${die2} + ${die3} = ${sum}`;
    state.choice = null;
    Dice.updateUI();
  }

  function renderDice() {
    for (let i = 1; i <= 3; i++) {
      const die = document.getElementById(`die${i}`);
      const val = state.result.die1 + state.result.die2 + state.result.die3;
      const points = val === 3 ? '⚀' : val === 4 ? '⚁' : val === 5 ? '⚂' : val === 6 ? '⚃' : val === 7 ? '⚄' : val === 8 ? '⚅' : '?';
      die.textContent = points;
      die.className = 'die';
    }
  }

  function updateUI() {
    document.querySelectorAll('#page-dice .balance-val').forEach(el => el.textContent = state.balance);
    document.getElementById('diceBet').textContent = state.bet;
    document.getElementById('diceRollBtn').disabled = state.bet === 0;
  }

  function init() {
    Engine.registerPage('dice', html, Dice.init);
    Dice.updateUI();
  }

  const Dice = {
    select,
    bet,
    roll,
    renderDice,
    updateUI,
    init
  };

  init();
})();
