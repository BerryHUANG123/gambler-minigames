// ========== 质数判断 🔢 ==========

(function() {
  let state = { bet: 0, question: 0, total: 10, score: 0, active: false, num: 0 };
  const ns = 'prime-check';

  BaseGame.init(ns, '🔢', '质数判断', {
    tableHTML: '<div id="pcProgress" class="message msg-info">第 1/10 题</div><div id="pcScore" class="message">得分：0</div><div id="pcNum" class="dice-area" style="font-size:3em;padding:25px;">17</div><div id="pcResult" class="message">是质数吗？</div>',
    betOptionsHTML: '<div class="bet-options" style="gap:16px;"><button class="bet-btn" onclick="PrimeCheck.guess(true)" style="background:#28a745;padding:12px 30px;">是</button><button class="bet-btn" onclick="PrimeCheck.guess(false)" style="background:#dc3545;padding:12px 30px;">否</button></div>',
    controlsHTML: '<button class="btn btn-primary" id="pcStartBtn" onclick="PrimeCheck.start()">开始！</button>'
  });

  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  function nextNum(level) {
    let n, isPrimeVal;
    const max = Math.pow(10, Math.min(level + 1, 3));
    if (Math.random() > 0.5) {
      const primes = [];
      for (let i = 2; i <= max; i++) if (isPrime(i)) primes.push(i);
      n = primes[Engine.randomInt(0, primes.length - 1)];
      isPrimeVal = true;
    } else {
      do { n = Engine.randomInt(2, max); } while (isPrime(n));
      isPrimeVal = false;
    }
    state.num = n;
    document.getElementById('pcNum').textContent = n;
  }

  window.PrimeCheck = {
    bet: BaseGame.betHandler(ns, state),

    start() {
      if (state.bet <= 0) {
        document.getElementById('pcResult').textContent = '先下注！';
        document.getElementById('pcResult').className = 'message msg-lose';
        return;
      }
      state.active = true;
      state.question = 0;
      state.score = 0;
      document.getElementById('pcStartBtn').disabled = true;
      document.getElementById('pcResult').textContent = '是质数吗？';
      document.getElementById('pcResult').className = 'message msg-info';
      document.getElementById('pcScore').textContent = '得分：0';
      document.querySelectorAll(`#page-${ns} .bet-btn`).forEach(b => b.disabled = false);
      this.nextQ();
    },

    nextQ() {
      state.question++;
      if (state.question > state.total) {
        state.active = false;
        document.getElementById('pcStartBtn').disabled = false;
        const prize = Math.floor(state.bet * (1 + state.score / (state.total * 10) * 3));
        const won = state.score >= 50;
        if (won) {
          BaseGame.settle(ns, state, true, prize);
          Engine.showQuote('win');
        } else {
          Engine.addBalance(prize);
          BaseGame.settle(ns, state, false, 0);
          Engine.updateBalanceUI();
        }
        document.getElementById('pcResult').textContent = `🏆 完成！答对 ${state.score/10}/${state.total}，奖金 ${prize} 筹码！`;
        document.getElementById('pcResult').className = won ? 'message msg-win' : 'message msg-lose';
        return;
      }
      document.getElementById('pcProgress').textContent = `第 ${state.question}/${state.total} 题`;
      nextNum(Math.min(state.question, 5));
      document.querySelectorAll(`#page-${ns} .bet-btn`).forEach(b => b.disabled = false);
    },

    guess(val) {
      if (!state.active) return;
      document.querySelectorAll(`#page-${ns} .bet-btn`).forEach(b => b.disabled = true);
      const correct = isPrime(state.num);
      if (val === correct) {
        state.score += 10;
        document.getElementById('pcScore').textContent = `得分：${state.score}`;
        document.getElementById('pcResult').textContent = `✅ 正确！${state.num} ${correct ? '是' : '不是'}质数`;
        document.getElementById('pcResult').className = 'message msg-win';
        Engine.play('win');
      } else {
        document.getElementById('pcResult').textContent = `❌ 错误！${state.num} ${correct ? '是' : '不是'}质数`;
        document.getElementById('pcResult').className = 'message msg-lose';
        Engine.play('lose');
      }
      setTimeout(() => this.nextQ(), 1000);
    }
  };
})();
