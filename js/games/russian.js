// ========== 俄罗斯轮盘 💀 ==========

(function() {
  let state = { bet: 0, chambers: [], current: 0, playing: false };

  function resetGun() {
    state.chambers = [false, false, false, false, false, false];
    state.chambers[Engine.randomInt(0, 5)] = true;
    state.current = 0;
  }

  BaseGame.init('russian', '\uD83D\uDC80', '\u4FC4\u7F57\u65AF\u8F6E\u76D8', {
    tableHTML: '<div id="gunDisplay" style="font-size:4rem;margin:10px 0;">\uD83D\uDD2B</div><div id="gunChamber" style="font-size:0.9rem;color:#888;">\u5DF2\u6263\u677F\u673A\uFF1A0/6</div><div id="russianResult" class="message">\u6309\u6263\u677F\u673A\uFF01\u6D3B\u4E0B\u6765\u8D62\u53CC\u500D\uFF01</div>',
    controlsHTML: '<button class="btn btn-primary" id="ruFireBtn" onclick="Russian.fire()">\uD83D\uDD2B \u6263\u677F\u673A\uFF01</button><button class="btn" id="ruNewBtn" onclick="Russian.newGame()">\u65B0\u4E00\u5C40</button>'
  });

  BaseGame.betHandler('russian', state);

  const _ruBet = window.russianBet;
  window.russianBet = function(a) {
    if (state.playing) return;
    _ruBet(a);
  };

  window.Russian = {
    newGame() {
      state.bet = 0;
      state.playing = false;
      resetGun();
      document.getElementById('russianBet').textContent = '0';
      document.getElementById('ruFireBtn').disabled = false;
      document.getElementById('russianResult').textContent = '\u65B0\u7684\u4E00\u5C40\uFF01\u6562\u6263\u677F\u673A\u5417\uFF1F';
      document.getElementById('russianResult').className = 'message msg-info';
      document.getElementById('gunDisplay').textContent = '\uD83D\uDD2B';
      document.getElementById('gunChamber').textContent = '\u5DF2\u6263\u677F\u673A\uFF1A0/6';
      Engine.updateBalanceUI();
    },

    fire() {
      if (state.playing || state.bet <= 0) return;
      if (!state.chambers.length) resetGun();

      state.playing = true;
      document.getElementById('ruFireBtn').disabled = true;
      Engine.play('spin');

      setTimeout(() => {
        const isDead = state.chambers[state.current];
        state.current++;
        const res = document.getElementById('russianResult');
        const gun = document.getElementById('gunDisplay');

        if (isDead) {
          gun.textContent = '\uD83D\uDCA5\uD83D\uDC80';
          const lost = state.bet;
          BaseGame.settle('russian', state, false, 0);
          res.textContent = '\uD83D\uDCA5 \u7830\uFF01\u4F60\u6B7B\u4E86\uFF01\u8F93 ' + lost;
          res.className = 'message msg-lose';
          Engine.showQuote('taunt');
        } else {
          const survived = state.current;
          gun.textContent = survived >= 3 ? '\uD83D\uDE0E\uD83D\uDD2B' : '\uD83D\uDE30\uD83D\uDD2B';
          document.getElementById('gunChamber').textContent = '\u5DF2\u6263\u677F\u673A\uFF1A' + survived + '/6';

          if (survived >= 6) {
            const win = state.bet * 6;
            BaseGame.settle('russian', state, true, win);
            Engine.showQuote('jackpot');
            res.textContent = '\uD83C\uDF89 6\u67AA\u5168\u7A7A\uFF01\u4F60\u6D3B\u4E0B\u6765\u4E86\uFF01\u8D62 ' + win + '\uFF01\u8D4C\u795E\u4FDD\u4F51\uFF01';
            res.className = 'message msg-celebrate';
          } else {
            const cashout = Math.floor(state.bet * (1 + survived * 0.5));
            res.innerHTML = '\u4F60\u6D3B\u8FC7\u4E86 ' + survived + ' \u67AA\uFF01<br>\u7EE7\u7EED\u6263\u8FD8\u662F\u6536\u624B\uFF1F<br>\u73B0\u5728\u6536\u624B\u62FF ' + cashout + '\uFF0C\u7EE7\u7EED\u6263\u7FFB\u500D\uFF01';
            res.className = 'message msg-info';

            const controls = document.querySelector('#page-russian .game-controls');
            if (!document.getElementById('ruCashoutBtn')) {
              const btn = document.createElement('button');
              btn.className = 'btn btn-primary';
              btn.id = 'ruCashoutBtn';
              btn.textContent = '\uD83D\uDCB0 \u6536\u624B (\u62FF ' + cashout + ')';
              btn.onclick = function() {
                BaseGame.settle('russian', state, true, cashout);
                res.textContent = '\u89C1\u597D\u5C31\u6536\uFF01\u62FF\u8D70 ' + cashout;
                res.className = 'message msg-win';
                document.getElementById('ruFireBtn').disabled = true;
                document.getElementById('ruCashoutBtn').disabled = true;
              };
              controls.appendChild(btn);

              const fireBtn = document.getElementById('ruFireBtn');
              fireBtn.disabled = false;
              fireBtn.textContent = '\uD83D\uDD25 \u7EE7\u7EED (x' + (survived + 1) + ')';
              state.playing = false;
              Engine.play('click');
            }
          }
        }
      }, 1000);
    }
  };
})();
