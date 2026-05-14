(function() {
  // Card Check Game
  const SUITS = ['♠', '♥', '♣', '♦'];
  const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  let state = {
    balance: 1000,
    bet: 0,
    cards: [],
    revealed: [],
    solved: false
  };

  const html = `<div class="game-page" id="page-cardcheck">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🃏 验牌</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="cardsContainer" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:20px 0;"></div>
      <div id="cardcheckMessage" class="message"></div>
    </div>
    <div class="bet-options">
      <button class="bet-btn" data-choice="all" onclick="CardCheck.select('all')">全对 x2</button>
      <button class="bet-btn" data-choice="one" onclick="CardCheck.select('one')">猜对一张 x1</button>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="CardCheck.bet(100)">100</div>
      <div class="chip chip-500" onclick="CardCheck.bet(500)">500</div>
      <div class="chip chip-1000" onclick="CardCheck.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="cardcheckBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="cardcheckStartBtn" onclick="CardCheck.start()">🃏 开始验牌</button>
    </div>
  </div>`;

  function init() {
    Engine.registerPage('cardcheck', html, CardCheck.init);
    CardCheck.updateUI();
  }

  function select(choice) {
    state.choice = choice;
    document.querySelectorAll('#page-cardcheck .bet-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector(`#page-cardcheck [data-choice="${choice}"]`).classList.add('selected');
    Engine.play('click');
  }

  function bet(amount) {
    if (state.balance < amount) {
      Engine.showQuote('error', '余额不足！');
      return;
    }
    state.bet = amount;
    state.choice = null;
    state.cards = [];
    state.revealed = [];
    state.solved = false;
    document.querySelectorAll('#page-cardcheck .bet-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('cardcheckMessage').textContent = '';
    CardCheck.updateUI();
    Engine.play('click');
  }

  function start() {
    if (!state.choice || state.bet === 0) {
      Engine.showQuote('error', '请先下注并选择玩法！');
      return;
    }

    // Generate 4 cards (2 pairs)
    const used = new Set();
    state.cards = [];
    for (let i = 0; i < 4; i++) {
      let val;
      do {
        val = Engine.randomInt(0, 12);
      } while (used.has(val) && used.size < 13);
      used.add(val);

      const suit = SUITS[Engine.randomInt(0, 3)];
      state.cards.push({ value: val, suit, id: i });
    }

    state.revealed = [false, false, false, false];
    state.solved = false;
    CardCheck.renderCards();
    document.getElementById('cardcheckMessage').textContent = '点击卡片，找出所有相同的牌对！';
    Engine.play('click');
  }

  function clickCard(index) {
    if (state.revealed[index] || state.solved) return;

    state.revealed[index] = true;
    CardCheck.renderCards();

    // Check if we've revealed all matching pairs
    const revealedCards = state.cards.filter((c, i) => state.revealed[i]);
    const valueCounts = {};
    revealedCards.forEach(c => {
      valueCounts[c.value] = (valueCounts[c.value] || 0) + 1;
    });

    const pairsFound = Object.values(valueCounts).filter(count => count === 2).length;
    const totalPairs = 2;

    if (pairsFound === totalPairs) {
      state.solved = true;
      const total = state.bet * 2;
      state.balance += total;
      Engine.showQuote('win', `🎉 全对！赢 ${total} 筹码！`);
      Engine.play('win');
      document.getElementById('cardcheckMessage').textContent = `🎉 全对！所有牌对都已找到！`;
    }

    Engine.play('click');
  }

  function renderCards() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    state.cards.forEach((card, index) => {
      const el = document.createElement('div');
      el.className = 'card ' + (state.revealed[index] ? 'card-revealed' : 'card-back');
      el.style.cursor = state.revealed[index] ? 'pointer' : 'default';
      el.onclick = () => CardCheck.clickCard(index);

      if (state.revealed[index]) {
        const v = card.value === 0 ? 'A' : card.value === 10 ? '10' : card.value === 11 ? 'J' : card.value === 12 ? 'Q' : card.value === 13 ? 'K' : card.value + 1;
        const clr = (card.suit === '♥' || card.suit === '♦') ? 'card-red' : 'card-black';
        el.innerHTML = `<span class="card-value">${v}</span><span class="card-suit">${card.suit}</span>`;
        el.className = 'card ' + clr;
      }

      container.appendChild(el);
    });
  }

  function updateUI() {
    document.querySelectorAll('#page-cardcheck .balance-val').forEach(el => el.textContent = state.balance);
    document.getElementById('cardcheckBet').textContent = state.bet;
  }

  const CardCheck = {
    select,
    bet,
    start,
    clickCard,
    renderCards,
    updateUI,
    init
  };

  init();
})();
