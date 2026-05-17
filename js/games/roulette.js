(function() {
  let state = { bet: 0, choice: null, spinning: false };

  const SEGMENTS = [
    { num: 0, color: 'green' },
    { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' },
    { num: 4, color: 'black' }, { num: 21, color: 'red' }, { num: 2, color: 'black' },
    { num: 25, color: 'red' }, { num: 17, color: 'black' }, { num: 34, color: 'red' },
    { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
    { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' },
    { num: 8, color: 'black' }, { num: 23, color: 'red' }, { num: 10, color: 'black' },
    { num: 5, color: 'red' }, { num: 24, color: 'black' }, { num: 16, color: 'red' },
    { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
    { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' },
    { num: 22, color: 'black' }, { num: 18, color: 'red' }, { num: 29, color: 'black' },
    { num: 7, color: 'red' }, { num: 28, color: 'black' }, { num: 12, color: 'red' },
    { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' },
  ];

  BaseGame.init('roulette', '🎡', '轮盘', {
    tableHTML: '<div id="rtWheelDisplay" style="font-size:3rem;margin:10px 0;">🎡</div><div id="rtNumber" style="font-size:2rem;font-weight:bold;color:var(--gold);min-height:50px;">?</div><div id="rtResult" class="message"></div>',
    betOptionsHTML: '<div class="bet-options" style="max-width:400px;"><button class="bet-btn" data-choice="red" onclick="Roulette.select(\'red\')">🔴 红</button><button class="bet-btn" data-choice="black" onclick="Roulette.select(\'black\')">⚫ 黑</button><button class="bet-btn" data-choice="even" onclick="Roulette.select(\'even\')">偶</button><button class="bet-btn" data-choice="odd" onclick="Roulette.select(\'odd\')">奇</button><button class="bet-btn" data-choice="low" onclick="Roulette.select(\'low\')">1-18</button><button class="bet-btn" data-choice="high" onclick="Roulette.select(\'high\')">19-36</button><button class="bet-btn bet-btn-danger" data-choice="zero" onclick="Roulette.select(\'zero\')" style="border-color:#e74c3c;color:#e74c3c;">0 (x35)</button></div>',
    controlsHTML: '<button class="btn btn-primary" id="rtSpinBtn" onclick="Roulette.spin()">转！</button>'
  });

  function getMultiplier(choice, result) {
    const { num, color } = result;
    switch(choice) {
      case 'red': return color === 'red' ? 2 : 0;
      case 'black': return color === 'black' ? 2 : 0;
      case 'even': return num !== 0 && num % 2 === 0 ? 2 : 0;
      case 'odd': return num % 2 !== 0 ? 2 : 0;
      case 'low': return num >= 1 && num <= 18 ? 2 : 0;
      case 'high': return num >= 19 && num <= 36 ? 2 : 0;
      case 'zero': return num === 0 ? 35 : 0;
      default: return 0;
    }
  }

  BaseGame.betHandler('rt', state);

  window.Roulette = {
    select(choice) {
      state.choice = choice;
      BaseGame.selectOption('rt', choice);
      document.getElementById('rtResult').textContent = '';
      Engine.play('click');
    },

    spin() {
      if (state.spinning || state.bet <= 0 || !state.choice) return;
      state.spinning = true;
      document.getElementById('rtSpinBtn').disabled = true;
      Engine.play('spin');

      const wheel = document.getElementById('rtWheelDisplay');
      let count = 0;
      const iv = setInterval(() => {
        wheel.textContent = ['🎡','🌀','🎰'][count % 3];
        if (++count > 20) {
          clearInterval(iv);
          const idx = Engine.randomInt(0, SEGMENTS.length - 1);
          const result = SEGMENTS[idx];
          const numEl = document.getElementById('rtNumber');
          const color = result.color === 'red' ? '#c0392b' : result.color === 'black' ? '#1a1a1a' : '#2ecc71';
          numEl.innerHTML = `<span style="display:inline-block;width:50px;height:50px;line-height:50px;border-radius:50%;background:${color};color:white;">${result.num}</span>`;
          wheel.textContent = '🎡';

          const mult = getMultiplier(state.choice, result);
          const resEl = document.getElementById('rtResult');
          if (mult > 0) {
            const win = state.bet * mult;
            resEl.textContent = `中了！${result.num} ${result.color === 'red' ? '🔴' : result.color === 'black' ? '⚫' : '🟢'}！赢 ${win}`;
            resEl.className = 'message msg-win';
            Engine.showQuote('win');
            BaseGame.settle('rt', state, true, win);
          } else {
            resEl.textContent = `${result.num} 没中，输 ${state.bet}`;
            resEl.className = 'message msg-lose';
            BaseGame.settle('rt', state, false, 0);
          }

          state.choice = null;
          state.spinning = false;
          document.getElementById('rtSpinBtn').disabled = false;
          BaseGame.clearSelection('rt');
        }
      }, 80);
    }
  };
})();
