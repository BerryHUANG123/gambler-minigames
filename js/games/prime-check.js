// ========== 质数判断 🔢 ==========

(function() {
  let state = { bet: 0, question: 0, total: 10, score: 0, active: false, num: 0 };

  const html = `
  <div class="game-page" id="page-prime-check">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🔢 质数判断</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="pcProgress" class="message msg-info">第 1/10 题</div>
      <div id="pcScore" class="message">得分：0</div>
      <div id="pcNum" class="dice-area" style="font-size:3em;padding:25px;">17</div>
      <div id="pcResult" class="message">是质数吗？</div>
      <div class="bet-options" style="gap:16px;">
        <button class="bet-btn" onclick="PrimeCheck.guess(true)" style="background:#28a745;padding:12px 30px;">是</button>
        <button class="bet-btn" onclick="PrimeCheck.guess(false)" style="background:#dc3545;padding:12px 30px;">否</button>
      </div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="PrimeCheck.bet(100)">100</div>
      <div class="chip chip-500" onclick="PrimeCheck.bet(500)">500</div>
      <div class="chip chip-1000" onclick="PrimeCheck.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="pcBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="pcStartBtn" onclick="PrimeCheck.start()">开始！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
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
      // Generate a prime
      const primes = [];
      for (let i = 2; i <= max; i++) if (isPrime(i)) primes.push(i);
      n = primes[Engine.randomInt(0, primes.length - 1)];
      isPrimeVal = true;
    } else {
      // Generate a composite
      do { n = Engine.randomInt(2, max); } while (isPrime(n));
      isPrimeVal = false;
    }
    state.num = n;
    document.getElementById('pcNum').textContent = n;
  }

  window.PrimeCheck = {
    bet(amount) {
      if (state.active) return;
      if (!Engine.canBet(amount)) {
        document.getElementById('pcResult').textContent = '筹码不够！';
        document.getElementById('pcResult').className = 'message msg-lose';
        return;
      }
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('pcBet').textContent = state.bet;
      Engine.play('click');
    },

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
      document.querySelectorAll('#page-prime-check .bet-btn').forEach(b => b.disabled = false);
      this.nextQ();
    },

    nextQ() {
      state.question++;
      if (state.question > state.total) {
        state.active = false;
        document.getElementById('pcStartBtn').disabled = false;
        const prize = state.bet * (1 + state.score / (state.total * 10) * 3);
        Engine.addBalance(Math.floor(prize));
        Engine.updateBalanceUI();
        document.getElementById('pcResult').textContent = `🏆 完成！答对 ${state.score/10}/${state.total}，奖金 ${Math.floor(prize)} 筹码！`;
        document.getElementById('pcResult').className = state.score >= 50 ? 'message msg-win' : 'message msg-lose';
        if (state.score >= 50) { Engine.play('win'); Engine.showQuote('win'); }
        else { Engine.play('lose'); }
        state.bet = 0;
        document.getElementById('pcBet').textContent = '0';
        Engine.save();
        return;
      }
      document.getElementById('pcProgress').textContent = `第 ${state.question}/${state.total} 题`;
      nextNum(Math.min(state.question, 5));
      document.querySelectorAll('#page-prime-check .bet-btn').forEach(b => b.disabled = false);
    },

    guess(val) {
      if (!state.active) return;
      document.querySelectorAll('#page-prime-check .bet-btn').forEach(b => b.disabled = true);
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