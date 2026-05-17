// ========== 猜大小 🀄 (Hi-Lo) ==========

(function() {
  let state = { bet: 0, choice: null, rolling: false };

  BaseGame.init('hilo', '🀄', '猜大小', {
    tableHTML: '<div class="dice-area"><div class="die" id="h1">⚀</div><div class="die" id="h2">⚁</div><div class="die" id="h3">⚂</div></div><div id="hiloTotal" class="message msg-info">猜点数范围！</div><div id="hiloResult" class="message"></div>',
    betOptionsHTML: '<button class="bet-btn" data-choice="small" onclick="HiLo.select(\'small\')">小 (3-10)</button><button class="bet-btn" data-choice="big" onclick="HiLo.select(\'big\')">大 (11-18)</button>',
    controlsHTML: '<button class="btn btn-primary" id="hiloRollBtn" onclick="HiLo.roll()">开骰！</button>'
  });

  const FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];

  window.hiloBet = function(amount) {
    if (!Engine.canBet(amount)) return;
    BaseGame.betHandler('hilo', state)(amount);
    document.getElementById('hiloResult').textContent = '';
    state.choice = null;
  };

  window.HiLo = {
    select(choice) {
      state.choice = choice;
      document.querySelectorAll('#page-hilo .bet-btn').forEach(b => b.classList.remove('selected'));
      document.querySelector(`#page-hilo [data-choice="${choice}"]`).classList.add('selected');
      document.getElementById('hiloResult').textContent = '';
      Engine.play('click');
    },

    roll() {
      if (state.rolling || state.bet <= 0 || !state.choice) return;

      state.rolling = true;
      document.getElementById('hiloRollBtn').disabled = true;
      Engine.play('spin');

      const d = [document.getElementById('h1'), document.getElementById('h2'), document.getElementById('h3')];
      d.forEach(el => el.classList.add('rolling'));

      let count = 0;
      const iv = setInterval(() => {
        d.forEach(el => { el.textContent = FACES[Engine.randomInt(0,5)]; });
        if (++count >= 10) {
          clearInterval(iv);
          const vals = [Engine.randomInt(1,6), Engine.randomInt(1,6), Engine.randomInt(1,6)];
          const total = vals.reduce((a,b) => a+b, 0);
          d.forEach((el, i) => { el.textContent = FACES[vals[i]-1]; el.classList.remove('rolling'); });

          document.getElementById('hiloTotal').textContent = `点数：${vals[0]} + ${vals[1]} + ${vals[2]} = ${total}`;

          const isBig = total >= 11;
          const won = (state.choice === 'big' && isBig) || (state.choice === 'small' && !isBig);

          const res = document.getElementById('hiloResult');
          if (won) {
            BaseGame.settle('hilo', state, true, state.bet * 2);
            res.textContent = `${state.choice === 'big' ? '大' : '小'}！中了！赢 ${state.bet * 2}`;
            res.className = 'message msg-win';
            Engine.showQuote('win');
          } else {
            BaseGame.settle('hilo', state, false, 0);
            res.textContent = `没中，输 ${state.bet}`;
            res.className = 'message msg-lose';
          }

          state.choice = null;
          state.rolling = false;
          document.getElementById('hiloRollBtn').disabled = false;
          document.querySelectorAll('#page-hilo .bet-btn').forEach(b => b.classList.remove('selected'));
        }
      }, 70);
    }
  };
})();