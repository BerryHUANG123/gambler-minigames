// ========== 21点 (Blackjack) ==========

(function() {
  let state = {
    bet: 0,
    deck: [],
    playerHand: [],
    dealerHand: [],
    gameOver: false,
    standing: false,
  };

  const SUITS = ['♠','♥','♦','♣'];
  const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

  function cardValue(v) {
    if (v === 'A') return 11;
    if (['J','Q','K'].includes(v)) return 10;
    return parseInt(v);
  }

  function handValue(hand) {
    let total = hand.reduce((s, c) => s + cardValue(c[0]), 0);
    let aces = hand.filter(c => c[0] === 'A').length;
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
  }

  function newDeck() {
    const d = [];
    for (const s of SUITS) for (const v of VALUES) d.push([v, s]);
    return Engine.shuffle(d);
  }

  function cardColor(c) {
    return (c[1] === '♥' || c[1] === '♦') ? 'card-red' : 'card-black';
  }

  function cardHTML(card, hidden = false) {
    if (hidden) return '<div class="card card-back"></div>';
    const [v, s] = card;
    return `<div class="card ${cardColor(card)}"><span class="card-value">${v}</span><span class="card-suit">${s}</span></div>`;
  }

  const html = `
  <div class="game-page" id="page-blackjack">
    <div class="game-top">
      <button class="back-btn" onclick="BJ.back()">← 大厅</button>
      <h2>♠️ 21点</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div style="font-size:0.75rem;color:#888;margin-bottom:4px;">庄家</div>
      <div class="hand" id="bjDealer"></div>
      <div id="bjDealerScore" style="font-size:0.85rem;color:#aaa;"></div>
      <div style="font-size:0.75rem;color:#888;margin:8px 0 4px;">玩家</div>
      <div class="hand" id="bjPlayer"></div>
      <div id="bjPlayerScore" style="font-size:0.85rem;color:#aaa;"></div>
      <div id="bjResult" class="message"></div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="BJ.bet(100)">100</div>
      <div class="chip chip-500" onclick="BJ.bet(500)">500</div>
      <div class="chip chip-1000" onclick="BJ.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="bjBet">0</span></div>
    <div class="game-controls">
      <button class="btn" id="bjDealBtn" onclick="BJ.deal()">发牌</button>
      <button class="btn btn-primary" id="bjHitBtn" onclick="BJ.hit()" disabled>要牌</button>
      <button class="btn" id="bjStandBtn" onclick="BJ.stand()" disabled>停牌</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  window.BJ = {
    back() {
      Engine.backToHall();
    },

    bet(amount) {
      if (state.gameOver && !state.standing) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('bjBet').textContent = state.bet;
      document.getElementById('bjDealBtn').disabled = false;
      Engine.play('click');
    },

    deal() {
      if (state.bet <= 0) return;
      state.deck = newDeck();
      state.playerHand = [state.deck.pop(), state.deck.pop()];
      state.dealerHand = [state.deck.pop(), state.deck.pop()];
      state.gameOver = false;
      state.standing = false;

      document.getElementById('bjDealBtn').disabled = true;
      document.getElementById('bjHitBtn').disabled = false;
      document.getElementById('bjStandBtn').disabled = false;
      document.getElementById('bjResult').textContent = '';
      Engine.play('deal');
      this.render();

      // Check natural blackjack
      if (handValue(state.playerHand) === 21) {
        this.stand();
      }
    },

    hit() {
      if (state.gameOver) return;
      state.playerHand.push(state.deck.pop());
      Engine.play('deal');
      this.render();

      if (handValue(state.playerHand) > 21) {
        this.endGame('bust');
      }
    },

    stand() {
      if (state.standing) return;
      state.standing = true;
      document.getElementById('bjHitBtn').disabled = true;
      document.getElementById('bjStandBtn').disabled = true;

      // Dealer draws
      const draw = () => {
        this.render();
        if (handValue(state.dealerHand) < 17) {
          state.dealerHand.push(state.deck.pop());
          Engine.play('deal');
          setTimeout(draw, 600);
        } else {
          this.endGame('compare');
        }
      };
      setTimeout(draw, 400);
    },

    endGame(reason) {
      state.gameOver = true;
      document.getElementById('bjHitBtn').disabled = true;
      document.getElementById('bjStandBtn').disabled = true;

      const pVal = handValue(state.playerHand);
      const dVal = handValue(state.dealerHand);
      const result = document.getElementById('bjResult');
      let won = false;

      if (reason === 'bust') {
        result.textContent = `爆了！点数 ${pVal}，输 ${state.bet}`;
        result.className = 'message msg-lose';
        Engine.play('lose');
      } else if (dVal > 21) {
        won = true;
        result.textContent = `庄家爆了！赢 ${state.bet * 2}`;
        result.className = 'message msg-win';
        Engine.play('win');
        Engine.showQuote('win');
      } else if (pVal > dVal) {
        won = true;
        result.textContent = `${pVal} > ${dVal}，赢 ${state.bet * 2}`;
        result.className = 'message msg-win';
        Engine.play('win');
        Engine.showQuote('win');
      } else if (pVal === dVal) {
        Engine.addBalance(state.bet);
        result.textContent = `平局 ${pVal}，退回下注`;
        result.className = 'message msg-info';
      } else {
        result.textContent = `${pVal} < ${dVal}，输 ${state.bet}`;
        result.className = 'message msg-lose';
        Engine.play('lose');
      }

      if (won) Engine.addBalance(state.bet * 2);
      state.bet = 0;
      document.getElementById('bjBet').textContent = '0';
      document.getElementById('bjDealBtn').disabled = false;
      Engine.updateBalanceUI();
      this.render();
    },

    render() {
      const p = state.playerHand;
      const d = state.dealerHand;
      const showDealer = state.gameOver || state.standing;

      document.getElementById('bjDealer').innerHTML =
        d.length ? d.map((c, i) => cardHTML(c, !showDealer && i === 1)).join('') : '';
      document.getElementById('bjPlayer').innerHTML =
        p.length ? p.map(c => cardHTML(c)).join('') : '';

      if (p.length) {
        document.getElementById('bjPlayerScore').textContent = `点数：${handValue(p)}`;
      }
      if (d.length) {
        const shown = showDealer ? handValue(d) : cardValue(d[0][0]) + (d[1] ? ' + ?' : '');
        document.getElementById('bjDealerScore').textContent = `点数：${shown}`;
      }
    }
  };
})();