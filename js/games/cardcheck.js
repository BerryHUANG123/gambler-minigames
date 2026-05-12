// ========== 验牌 🃏— 皮克松招牌游戏 ==========

(function() {
  let state = {
    bet: 0,
    cards: [],
    riggedIndex: -1,
    revealed: false,
    stage: 'bet', // bet | pick | result
  };

  const FACES = ['A','K','Q','J'];

  function createCards() {
    // 3 cards, one is "rigged" (has a different back or is marked)
    const idx = Engine.randomInt(0, 2);
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const face = FACES[Math.floor(Math.random() * FACES.length)];
      cards.push({ face, suit: i === idx ? '★' : (['♠','♥','♦','♣'][i]), isRigged: i === idx });
    }
    return { cards, riggedIndex: idx };
  }

  const html = `
  <div class="game-page" id="page-cardcheck">
    <div class="game-top">
      <button class="back-btn" onclick="CC.back()">← 大厅</button>
      <h2>🃏 验牌</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div id="ccPrompt" style="text-align:center;padding:6px;color:#aaa;font-size:0.85rem;">
      三张牌里有一张被动了手脚，把它找出来！
    </div>
    <div class="game-table">
      <div class="hand" id="ccHand">
        <div class="card card-back" data-idx="0" onclick="CC.pick(0)" style="cursor:pointer;"></div>
        <div class="card card-back" data-idx="1" onclick="CC.pick(1)" style="cursor:pointer;"></div>
        <div class="card card-back" data-idx="2" onclick="CC.pick(2)" style="cursor:pointer;"></div>
      </div>
      <div id="ccResult" class="message">哪张是老千牌？</div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="CC.bet(100)">100</div>
      <div class="chip chip-500" onclick="CC.bet(500)">500</div>
      <div class="chip chip-1000" onclick="CC.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="ccBet">0</span></div>
    <div class="game-controls">
      <button class="btn" id="ccNewBtn" onclick="CC.newGame()">新一局</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  function renderCard(card, idx, revealed) {
    if (!revealed) {
      return `<div class="card card-back" data-idx="${idx}" onclick="CC.pick(${idx})" style="cursor:pointer;"></div>`;
    }
    if (card.isRigged) {
      return `<div class="card" style="background:#f5e6c8;color:#c0392b;border:3px solid #c0392b;">
        <span class="card-value">${card.face}</span><span class="card-suit">${card.suit}</span>
      </div>`;
    }
    const cls = (card.suit === '♥' || card.suit === '♦') ? 'card-red' : 'card-black';
    return `<div class="card ${cls}"><span class="card-value">${card.face}</span><span class="card-suit">${card.suit}</span></div>`;
  }

  window.CC = {
    back() { Engine.backToHall(); },

    bet(amount) {
      if (state.stage !== 'bet') return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('ccBet').textContent = state.bet;
      Engine.play('click');
    },

    newGame() {
      const result = createCards();
      state.cards = result.cards;
      state.riggedIndex = result.riggedIndex;
      state.revealed = false;
      state.stage = 'bet';
      state.bet = 0;
      document.getElementById('ccBet').textContent = '0';
      document.getElementById('ccResult').textContent = '哪张是老千牌？';
      document.getElementById('ccResult').className = 'message msg-info';
      document.getElementById('ccPrompt').textContent = '三张牌里有一张被动了手脚，把它找出来！';
      document.getElementById('ccHand').innerHTML =
        state.cards.map((_, i) =>
          `<div class="card card-back" data-idx="${i}" onclick="CC.pick(${i})" style="cursor:pointer;"></div>`
        ).join('');
      Engine.updateBalanceUI();
    },

    pick(idx) {
      if (state.stage === 'result') return;
      if (state.bet <= 0) {
        document.getElementById('ccResult').textContent = '先下注再验牌！';
        document.getElementById('ccResult').className = 'message msg-info';
        return;
      }
      if (!state.cards.length) {
        state.cards = createCards().cards;
        state.riggedIndex = createCards().riggedIndex;
      }

      state.stage = 'result';
      state.revealed = true;
      const isCorrect = state.cards[idx].isRigged;

      // Reveal all
      document.getElementById('ccHand').innerHTML =
        state.cards.map((c, i) => renderCard(c, i, true)).join('');

      const result = document.getElementById('ccResult');
      if (isCorrect) {
        const win = state.bet * 3;
        Engine.addBalance(win);
        result.textContent = `好眼力！老千牌被你找到了！赢 ${win} 筹码！牌没有问题！`;
        result.className = 'message msg-win';
        Engine.play('win');
        Engine.showQuote('win');
      } else {
        result.textContent = `看走眼了！这张是干净的，老千是第 ${state.riggedIndex + 1} 张。输 ${state.bet}`;
        result.className = 'message msg-lose';
        Engine.play('lose');
        Engine.showQuote('lose');
      }

      Engine.updateBalanceUI();
    },
  };
})();