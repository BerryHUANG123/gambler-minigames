(function() {
  // Slot Machine Game
  const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
  const SYMBOLS_CHINESE = ['樱桃', '柠檬', '橙子', '葡萄', '钻石', '7'];

  let state = {
    bet: 0,
    spinning: false
  };

  BaseGame.init('slot', '🎰', '老虎机', {
    tableHTML: '<div class="reels-container"><div class="reel" id="reel1">🍒</div><div class="reel" id="reel2">🍒</div><div class="reel" id="reel3">🍒</div></div><div id="slotMessage" class="message"></div>',
    controlsHTML: '<button class="btn btn-primary" id="slotSpinBtn" onclick="Slot.spin()">🎰 旋转</button>'
  });

  window.slotBet = function(amount) {
    if (!Engine.canBet(amount)) return;
    BaseGame.betHandler('slot', state)(amount);
    state.spinning = false;
    document.getElementById('slotMessage').textContent = '';
    document.getElementById('slotSpinBtn').disabled = false;
  };

  function spin() {
    if (state.spinning || state.bet === 0) {
      if (state.bet === 0) Engine.showQuote('error', '请先下注！');
      return;
    }

    state.spinning = true;
    document.getElementById('slotSpinBtn').disabled = true;

    const results = [0, 0, 0];
    let round = 0;

    const spinReel = (index) => {
      return new Promise(resolve => {
        const reel = document.getElementById(`reel${index + 1}`);
        reel.classList.add('spinning');

        const interval = setInterval(() => {
          reel.textContent = SYMBOLS[Engine.randomInt(0, SYMBOLS.length - 1)];
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reel.classList.remove('spinning');
          const finalIndex = Engine.randomInt(0, SYMBOLS.length - 1);
          results[index] = finalIndex;
          reel.textContent = SYMBOLS[finalIndex];
          resolve();
        }, 1000 + round * 500);
      });
    };

    const playRound = async (r) => {
      await spinReel(r);
      round++;
      if (round < 3) {
        playRound(round);
      } else {
        state.spinning = false;
        Slot.checkWin(results);
      }
    };

    playRound(0);
  }

  function checkWin(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
      const payouts = [5, 10, 20, 50, 100, 500];
      const win = state.bet * payouts[r1];
      BaseGame.settle('slot', state, true, win);
      Engine.showQuote('win', `🎉 三连！${SYMBOLS_CHINESE[r1]}！赢 ${win} 筹码！`);
      document.getElementById('slotMessage').textContent = `🎉 三连！${SYMBOLS_CHINESE[r1]}！`;
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      const win = Math.floor(state.bet * 1.5);
      BaseGame.settle('slot', state, true, win);
      Engine.showQuote('win', `🎉 两连！赢 ${win} 筹码！`);
      document.getElementById('slotMessage').textContent = `🎉 两连！`;
    } else {
      BaseGame.settle('slot', state, false, 0);
      Engine.showQuote('lose', '😢 再试一次！');
      document.getElementById('slotMessage').textContent = '😢 再试一次';
    }

    document.getElementById('slotSpinBtn').disabled = false;
  }

  const Slot = {
    spin,
    checkWin
  };
})();
