(function() {
  // Hi-Lo Game (猜大小)
  const SUITS = ['♠', '♥', '♣', '♦'];
  const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  let state = {
    bet: 0,
    currentCard: null,
    round: 0,
    maxRounds: 3
  };

  const html = `<div class="game-page" id="page-hilo">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>📊 猜大小</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="cardDisplay" style="text-align:center;margin:20px 0;">
        <div class="card card-back" style="display:inline-block;width:100px;height:140px;border-radius:8px;">
          <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;">?</div>
        </div>
      </div>
      <div id="hiloMessage" class="message"></div>
      <div style="text-align:center;margin-top:10px;">
        <span style="color:var(--gold);">回合：<span id="hiloRound">1</span>/<span id="hiloMaxRounds">${state.maxRounds}</span></span>
      </div>
    </div>
    <div class="bet-options">
      <button class="bet-btn" data-choice="higher" onclick="HiLo.select('higher')">大 (10-K)</button>
      <button class="bet-btn" data-choice="lower" onclick="HiLo.select('lower')">小 (A-9)</button>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="HiLo.bet(100)">100</div>
      <div class="chip chip-500" onclick="HiLo.bet(500)">500</div>
      <div class="chip chip-1000" onclick="HiLo.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="hiloBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="hiloNextBtn" onclick="HiLo.next()">下一张</button>
    </div>
  </div>`;

  function init() {
    Engine.registerPage('hilo', html);
    HiLo.updateUI();
  }

  function select(choice) {
    if (!state.currentCard || state.round >= state.maxRounds) return;

    state.choice = choice;
    document.querySelectorAll('#page-hilo .bet-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector(`#page-hilo [data-choice="${choice}"]`).classList.add('selected');
    Engine.play('click');
  }

  function bet(amount) {
    if (!Engine.canBet(amount)) return;
    state.bet = amount;
    Engine.state.balance -= amount;
    Engine.save();
    Engine.updateBalanceUI();
    state.currentCard = null;
    state.round = 0;
    state.choice = null;
    document.querySelectorAll('#page-hilo .bet-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('hiloMessage').textContent = '';
    document.getElementById('cardDisplay').innerHTML = `
      <div class="card card-back" style="display:inline-block;width:100px;height:140px;border-radius:8px;">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;">?</div>
      </div>`;
    HiLo.updateUI();
    Engine.play('click');
  }

  function deal() {
    if (!state.choice || state.bet === 0) {
      Engine.showQuote('error', '请先下注并选择大或小！');
      return;
    }

    const cardIndex = Engine.randomInt(0, 12);
    const suit = SUITS[Engine.randomInt(0, 3)];
    state.currentCard = { index: cardIndex, suit };

    const v = cardIndex === 0 ? 'A' : cardIndex === 10 ? '10' : cardIndex === 11 ? 'J' : cardIndex === 12 ? 'Q' : cardIndex === 13 ? 'K' : cardIndex + 1;
    const clr = (suit === '♥' || suit === '♦') ? 'card-red' : 'card-black';

    document.getElementById('cardDisplay').innerHTML = `
      <div class="card ${clr}" style="display:inline-block;width:100px;height:140px;border-radius:8px;padding:10px;">
        <div style="text-align:center;">
          <div style="font-size:2rem;">${v}</div>
          <div style="font-size:1.5rem;">${suit}</div>
        </div>
      </div>`;

    const isHigh = cardIndex >= 10;
    const won = (isHigh && state.choice === 'higher') || (!isHigh && state.choice === 'lower');

    if (won) {
      const total = state.bet * 2;
      Engine.addBalance(total);
      Engine.showQuote('win', `🎉 ${isHigh ? '大' : '小'}！赢 ${total} 筹码！`);
      Engine.play('win');
      document.getElementById('hiloMessage').textContent = `✅ ${isHigh ? '大' : '小'}！点数 ${v}${suit}`;
    } else {
      Engine.showQuote('lose', `😢 ${isHigh ? '大' : '小'}！点数 ${v}${suit}，输了 ${state.bet} 筹码！`);
      Engine.play('lose');
      document.getElementById('hiloMessage').textContent = `❌ ${isHigh ? '大' : '小'}！点数 ${v}${suit}`;
    }

    state.round++;
    HiLo.updateUI();

    if (state.round >= state.maxRounds) {
      document.getElementById('hiloNextBtn').disabled = true;
    }
  }

  function next() {
    if (state.round >= state.maxRounds) {
      state.choice = null;
      state.currentCard = null;
      document.querySelectorAll('#page-hilo .bet-btn').forEach(b => b.classList.remove('selected'));
      document.getElementById('cardDisplay').innerHTML = `
        <div class="card card-back" style="display:inline-block;width:100px;height:140px;border-radius:8px;">
          <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;">?</div>
        </div>`;
      document.getElementById('hiloMessage').textContent = '继续下注';
      HiLo.updateUI();
    } else {
      deal();
    }
  }

  function updateUI() {
    Engine.updateBalanceUI();
    document.getElementById('hiloBet').textContent = state.bet;
    document.getElementById('hiloRound').textContent = state.round + 1;
    document.getElementById('hiloMaxRounds').textContent = state.maxRounds;
    document.getElementById('hiloNextBtn').disabled = state.round >= state.maxRounds || !state.choice;
  }

  const HiLo = {
    select,
    bet,
    deal,
    next,
    updateUI,
    init
  };

  init();
})();
