(function() {
  let state = { bet: 0, revealed: false, cards: [] };

  BaseGame.init('scratch', '💳', '刮刮乐', {
    tableHTML: '<div class="hand" id="scCards" style="gap:12px;"></div><div id="scResult" class="message">选一张刮开！</div>',
    controlsHTML: '<button class="btn" onclick="Scratch.newGame()">新一局</button>'
  });

  const PRIZES = [
    { text: '💩 谢谢参与', mult: 0 },
    { text: '🪙 小奖', mult: 1.5 },
    { text: '💰 中奖', mult: 3 },
    { text: '💎 大奖', mult: 5 },
    { text: '👑 头奖！', mult: 10 },
  ];

  var _bet = BaseGame.betHandler('sc', state);

  window.scBet = function(amount) {
    if (state.revealed) return;
    _bet(amount);
    if (state.bet > 0) Scratch.deal();
  };

  window.Scratch = {
    deal() {
      state.cards = Engine.shuffle([...PRIZES]).slice(0, 3);
      state.revealed = false;
      document.getElementById('scCards').innerHTML = state.cards.map((_, i) =>
        `<div class="card card-back" onclick="Scratch.scratch(${i})" style="cursor:pointer;width:80px;height:110px;font-size:0.8rem;">
          <span style="color:var(--gold);font-size:0.7rem;">第${i+1}张</span>
        </div>`
      ).join('');
      document.getElementById('scResult').textContent = '选一张，刮开它！';
      document.getElementById('scResult').className = 'message msg-info';
    },

    scratch(idx) {
      if (state.revealed || state.bet <= 0) return;
      state.revealed = true;
      const prize = state.cards[idx];
      const win = Math.floor(state.bet * prize.mult);

      document.getElementById('scCards').innerHTML = state.cards.map((c, i) => {
        if (i === idx) {
          return `<div class="card" style="width:80px;height:110px;background:#f5e6c8;border:2px solid ${prize.mult === 0 ? '#666' : 'var(--gold)'};flex-direction:column;font-size:0.9rem;">
            ${c.text}
          </div>`;
        }
        return `<div class="card card-back" style="width:80px;height:110px;opacity:0.4;"></div>`;
      });

      const res = document.getElementById('scResult');
      if (win > 0) {
        res.textContent = `${prize.text}！赢 ${win} 筹码！`;
        res.className = 'message msg-win';
        Engine.showQuote(prize.mult >= 5 ? 'jackpot' : 'win');
        BaseGame.settle('sc', state, true, win);
      } else {
        res.textContent = `${prize.text}，输 ${state.bet}`;
        res.className = 'message msg-lose';
        BaseGame.settle('sc', state, false, 0);
      }
    },

    newGame() {
      state.bet = 0; state.revealed = false;
      document.getElementById('scBet').textContent = '0';
      document.getElementById('scCards').innerHTML = '下注后发卡';
      document.getElementById('scResult').textContent = '下注开始！';
      document.getElementById('scResult').className = 'message msg-info';
      Engine.updateBalanceUI();
    }
  };
})();
