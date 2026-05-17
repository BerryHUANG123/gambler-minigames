(function() {
  let state = { bet: 0, playing: false };

  const SUITS = ['♠','♥','♦','♣'];
  const VALUES = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const VAL_MAP = { '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14 };

  function draw() {
    const v = VALUES[Engine.randomInt(0, VALUES.length-1)];
    const s = SUITS[Engine.randomInt(0, SUITS.length-1)];
    return [v, s];
  }

  function cardHTML(card) {
    const [v, s] = card;
    const cls = (s === '♥' || s === '♦') ? 'card-red' : 'card-black';
    return `<div class="card ${cls}"><span class="card-value">${v}</span><span class="card-suit">${s}</span></div>`;
  }

  BaseGame.init('war', '⚔️', '比点数', {
    tableHTML: `
      <div style="font-size:0.75rem;color:#888;">庄家</div>
      <div class="hand" id="warDealer"></div>
      <div style="font-size:1.5rem;margin:4px 0;">⚔️</div>
      <div style="font-size:0.75rem;color:#888;">玩家</div>
      <div class="hand" id="warPlayer"></div>
      <div id="warResult" class="message">翻牌比大小，A最大2最小！</div>
    `,
    controlsHTML: `<button class="btn btn-primary" id="warBtn" onclick="War.play()">翻牌！</button>`
  });

  window.War = {
    bet: BaseGame.betHandler('war', state),
    play() {
      if (state.playing || state.bet <= 0) return;
      state.playing = true;
      document.getElementById('warBtn').disabled = true;
      Engine.play('deal');

      const pCard = draw();
      const dCard = draw();
      const pVal = VAL_MAP[pCard[0]];
      const dVal = VAL_MAP[dCard[0]];

      document.getElementById('warDealer').innerHTML = cardHTML(dCard);
      document.getElementById('warPlayer').innerHTML = cardHTML(pCard);

      const res = document.getElementById('warResult');
      if (pVal > dVal) {
        const win = state.bet * 2;
        Engine.addBalance(win);
        res.textContent = `你 ${pCard[0]} > 庄家 ${dCard[0]}！赢 ${win}`;
        res.className = 'message msg-win';
        Engine.play('win');
        Engine.showQuote('win');
      } else if (pVal < dVal) {
        res.textContent = `你 ${pCard[0]} < 庄家 ${dCard[0]}，输 ${state.bet}`;
        res.className = 'message msg-lose';
        Engine.play('lose');
      } else {
        Engine.addBalance(state.bet);
        res.textContent = `都是 ${pCard[0]}！平局，退回下注`;
        res.className = 'message msg-info';
      }

      state.bet = 0;
      state.playing = false;
      document.getElementById('warBtn').disabled = false;
      document.getElementById('warBet').textContent = '0';
      Engine.updateBalanceUI();
    }
  };
})();
