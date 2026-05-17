(function() {
  let state = { bet: 0, bombIndex: -1, exploded: false, picked: false };

  BaseGame.init('bomb', '💣', '拆弹', {
    tableHTML: '<div id="bombDisplay" style="font-size:4rem;margin:10px 0;">💣</div><div class="hand" id="bombButtons" style="gap:16px;"></div><div id="bombResult" class="message">三个按钮，一个会炸！</div>',
    controlsHTML: '<button class="btn" onclick="Bomb.newGame()">新一局</button>'
  });

  var _bet = BaseGame.betHandler('bomb', state);

  window.bombBet = function(amount) {
    if (state.picked) return;
    _bet(amount);
    if (state.bet > 0 && state.bombIndex === -1) Bomb.setup();
  };

  window.Bomb = {
    setup() {
      state.bombIndex = Engine.randomInt(0, 2);
      state.exploded = false;
      state.picked = false;
      document.getElementById('bombDisplay').textContent = '💣';
      document.getElementById('bombButtons').innerHTML = [0,1,2].map(i =>
        `<div onclick="Bomb.press(${i})" style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#555,#333);display:flex;align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer;border:2px solid #888;transition:0.2s;" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='#888'">
          ❓
        </div>`
      ).join('');
      document.getElementById('bombResult').textContent = '选一个按钮按下去！';
      document.getElementById('bombResult').className = 'message msg-info';
    },

    press(idx) {
      if (state.picked || state.bet <= 0) return;
      state.picked = true;
      const isBomb = idx === state.bombIndex;

      document.getElementById('bombButtons').innerHTML = [0,1,2].map((_, i) => {
        if (i === idx) {
          if (isBomb) return `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#8b0000,#cc0000);display:flex;align-items:center;justify-content:center;font-size:2rem;border:3px solid #ff0;">💥</div>`;
          return `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#006400,#00aa00);display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid var(--gold);">✅</div>`;
        }
        const show = isBomb && i === state.bombIndex;
        if (show) return `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#8b0000,#cc0000);display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid #ff0;opacity:0.5;">💥</div>`;
        return `<div style="width:80px;height:80px;border-radius:50%;background:#222;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid #444;opacity:0.3;">❓</div>`;
      });

      const res = document.getElementById('bombResult');
      if (isBomb) {
        document.getElementById('bombDisplay').textContent = '💥💀';
        res.textContent = `💥 炸了！输 ${state.bet}`;
        res.className = 'message msg-lose';
        Engine.showQuote('taunt');
        BaseGame.settle('bomb', state, false, 0);
      } else {
        const win = state.bet * 3;
        res.textContent = `✅ 安全！你拆掉了炸弹！赢 ${win}`;
        res.className = 'message msg-win';
        Engine.showQuote('win');
        BaseGame.settle('bomb', state, true, win);
      }
    },

    newGame() {
      state.bet = 0; state.bombIndex = -1; state.picked = false;
      document.getElementById('bombBet').textContent = '0';
      document.getElementById('bombDisplay').textContent = '💣';
      document.getElementById('bombButtons').innerHTML = '下注后开始';
      document.getElementById('bombResult').textContent = '下注开始！';
      document.getElementById('bombResult').className = 'message msg-info';
      Engine.updateBalanceUI();
    }
  };
})();
