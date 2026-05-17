(function() {
  let state = { bet: 0, cards: [], tries: 0, maxTries: 5, solved: false };

  BaseGame.init('game24', '🔢', '24点', {
    tableHTML: '<div id="g24Cards" class="dice-area" style="font-size:2.5em;padding:15px;gap:12px;">♠ 3 ♥ 7 ♦ 8 ♣ 9</div><div id="g24Result" class="message msg-info">用加减乘除凑出24</div><div id="g24Tries" class="message">剩余尝试：5</div><div class="bet-options" style="gap:8px;"><input type="text" id="g24Answer" placeholder="如 (3+7)+8+9" style="width:250px;padding:8px;font-size:1em;border-radius:8px;border:2px solid #ffd700;background:#222;color:#fff;text-align:center;"><button class="btn btn-primary" onclick="Game24.submit()">验算</button><button class="btn" onclick="Game24.newRound()">换牌 (-50)</button></div>',
    controlsHTML: '<button class="btn btn-primary" onclick="Game24.start()">发牌</button>'
  });

  function getCardSymbol(n) {
    const symbols = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    return symbols[n - 1];
  }

  function hasSolution(nums) {
    const ops = ['+', '-', '*', '/'];
    function calc(a, b, op) {
      switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : NaN;
      }
    }
    function permute(arr) {
      if (arr.length === 1) return Math.abs(arr[0] - 24) < 0.001;
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const rest = arr.filter((_, k) => k !== i && k !== j);
          for (const op of ops) {
            for (const val of [calc(arr[i], arr[j], op), calc(arr[j], arr[i], op)]) {
              if (!isNaN(val) && permute([...rest, val])) return true;
            }
          }
        }
      }
      return false;
    }
    return permute(nums);
  }

  window.g24Bet = function(amount) {
    if (!Engine.canBet(amount)) {
      document.getElementById('g24Result').textContent = '筹码不够！';
      document.getElementById('g24Result').className = 'message msg-lose';
      return;
    }
    BaseGame.betHandler('game24', state)(amount);
  };

  window.Game24 = {
    start() {
      if (state.bet <= 0) {
        document.getElementById('g24Result').textContent = '先下注！';
        document.getElementById('g24Result').className = 'message msg-lose';
        return;
      }
      state.tries = state.maxTries;
      state.solved = false;
      do {
        state.cards = [Engine.randomInt(1,13), Engine.randomInt(1,13), Engine.randomInt(1,13), Engine.randomInt(1,13)];
      } while (!hasSolution(state.cards));
      document.getElementById('g24Cards').textContent = state.cards.map(getCardSymbol).join(' ');
      document.getElementById('g24Tries').textContent = `剩余尝试：${state.tries}`;
      document.getElementById('g24Result').textContent = '用加减乘除凑出24！';
      document.getElementById('g24Result').className = 'message msg-info';
      document.getElementById('g24Answer').value = '';
      Engine.play('click');
    },

    submit() {
      if (state.solved || state.tries <= 0) return;
      const input = document.getElementById('g24Answer').value.trim();
      if (!input) return;
      state.tries--;
      document.getElementById('g24Tries').textContent = `剩余尝试：${state.tries}`;
      try {
        const result = new Function('return ' + input)();
        if (Math.abs(result - 24) < 0.001) {
          state.solved = true;
          const win = state.bet * 5;
          document.getElementById('g24Result').textContent = `🎉 24！赢 ${win} 筹码！`;
          document.getElementById('g24Result').className = 'message msg-win';
          Engine.showQuote('jackpot');
          BaseGame.settle('game24', state, true, win);
          Engine.save();
        } else {
          document.getElementById('g24Result').textContent = `结果 ${result}，不是24，再想想！`;
          document.getElementById('g24Result').className = 'message msg-lose';
          if (state.tries <= 0) {
            document.getElementById('g24Result').textContent += ' 没机会了！';
            BaseGame.settle('game24', state, false, 0);
            Engine.save();
          }
        }
      } catch(e) {
        document.getElementById('g24Result').textContent = '表达式无效！';
        document.getElementById('g24Result').className = 'message msg-lose';
      }
    },

    newRound() {
      if (!Engine.canBet(50)) {
        document.getElementById('g24Result').textContent = '不够50筹码换牌！';
        document.getElementById('g24Result').className = 'message msg-lose';
        return;
      }
      Engine.state.balance -= 50;
      Engine.save();
      Engine.updateBalanceUI();
      state.tries = state.maxTries;
      state.solved = false;
      do {
        state.cards = [Engine.randomInt(1,13), Engine.randomInt(1,13), Engine.randomInt(1,13), Engine.randomInt(1,13)];
      } while (!hasSolution(state.cards));
      document.getElementById('g24Cards').textContent = state.cards.map(getCardSymbol).join(' ');
      document.getElementById('g24Tries').textContent = `剩余尝试：${state.tries}`;
      document.getElementById('g24Result').textContent = '换牌成功！';
      document.getElementById('g24Result').className = 'message msg-info';
      document.getElementById('g24Answer').value = '';
      Engine.play('click');
    }
  };
})();
