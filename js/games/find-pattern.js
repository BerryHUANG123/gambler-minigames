// ========== 找规律 🔍 ==========

(function() {
  let state = { bet: 0, question: 0, total: 10, score: 0, active: false, seq: [], answer: 0, options: [] };

  const html = `
  <div class="game-page" id="page-find-pattern">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🔍 找规律</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="fpProgress" class="message msg-info">第 1/10 题</div>
      <div id="fpScore" class="message">得分：0</div>
      <div id="fpSeq" class="dice-area" style="font-size:1.8em;padding:20px;letter-spacing:4px;">2, 4, 6, 8, ?</div>
      <div id="fpResult" class="message"></div>
      <div id="fpOptions" class="bet-options" style="gap:8px;"></div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="FindPattern.bet(100)">100</div>
      <div class="chip chip-500" onclick="FindPattern.bet(500)">500</div>
      <div class="chip chip-1000" onclick="FindPattern.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="fpBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="fpStartBtn" onclick="FindPattern.start()">开始！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  function generateQuestion(level) {
    let seq = [], answer, options = [];
    const type = Math.min(level, 4);
    switch(type) {
      case 1: { // 简单等差
        const diff = Engine.randomInt(2, 5);
        const start = Engine.randomInt(1, 10);
        for (let i = 0; i < 4; i++) seq.push(start + i * diff);
        answer = start + 4 * diff;
        break;
      }
      case 2: { // 等比
        const ratio = Engine.randomInt(2, 4);
        const start = Engine.randomInt(1, 5);
        for (let i = 0; i < 4; i++) seq.push(start * Math.pow(ratio, i));
        answer = start * Math.pow(ratio, 4);
        break;
      }
      case 3: { // 斐波那契类
        const a = Engine.randomInt(1, 5);
        const b = Engine.randomInt(1, 5);
        seq = [a, b];
        for (let i = 0; i < 3; i++) seq.push(seq[i] + seq[i+1]);
        answer = seq[4] + seq[3];
        break;
      }
      case 4: { // 平方/n^2
        const start = Engine.randomInt(2, 6);
        for (let i = 0; i < 4; i++) seq.push(Math.pow(start + i, 2));
        answer = Math.pow(start + 4, 2);
        break;
      }
    }
    options = [answer];
    while (options.length < 4) {
      const r = answer + Engine.randomInt(-20, 20);
      if (!options.includes(r) && r > 0) options.push(r);
    }
    Engine.shuffle(options);
    state.seq = seq; state.answer = answer; state.options = options;
    document.getElementById('fpSeq').textContent = seq.join(', ') + ', ?';
    const optHtml = options.map(o => 
      `<button class="bet-btn" onclick="FindPattern.guess(${o})">${o}</button>`
    ).join('');
    document.getElementById('fpOptions').innerHTML = optHtml;
  }

  window.FindPattern = {
    bet(amount) {
      if (state.active) return;
      if (!Engine.canBet(amount)) {
        document.getElementById('fpResult').textContent = '筹码不够！';
        document.getElementById('fpResult').className = 'message msg-lose';
        return;
      }
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('fpBet').textContent = state.bet;
      Engine.play('click');
    },

    start() {
      if (state.bet <= 0) {
        document.getElementById('fpResult').textContent = '先下注！';
        document.getElementById('fpResult').className = 'message msg-lose';
        return;
      }
      state.active = true;
      state.question = 0;
      state.score = 0;
      document.getElementById('fpStartBtn').disabled = true;
      document.getElementById('fpResult').textContent = '';
      document.getElementById('fpScore').textContent = '得分：0';
      this.nextQ();
    },

    nextQ() {
      state.question++;
      if (state.question > state.total) {
        state.active = false;
        document.getElementById('fpStartBtn').disabled = false;
        const prize = state.bet * (1 + state.score / state.total * 3);
        Engine.addBalance(Math.floor(prize));
        Engine.updateBalanceUI();
        document.getElementById('fpResult').textContent = `🏆 完成！答对 ${state.score}/${state.total}，奖金 ${Math.floor(prize)} 筹码！`;
        document.getElementById('fpResult').className = state.score >= 7 ? 'message msg-win' : 'message msg-lose';
        if (state.score >= 7) { Engine.play('win'); Engine.showQuote('win'); }
        else { Engine.play('lose'); }
        state.bet = 0;
        document.getElementById('fpBet').textContent = '0';
        Engine.save();
        return;
      }
      document.getElementById('fpProgress').textContent = `第 ${state.question}/${state.total} 题`;
      const level = Math.min(Math.ceil(state.question / 3), 4);
      generateQuestion(level);
    },

    guess(opt) {
      if (!state.active) return;
      document.querySelectorAll('#fpOptions .bet-btn').forEach(b => b.disabled = true);
      if (opt === state.answer) {
        state.score += 10;
        document.getElementById('fpScore').textContent = `得分：${state.score}`;
        document.getElementById('fpResult').textContent = '✅ 正确！+10分';
        document.getElementById('fpResult').className = 'message msg-win';
        Engine.play('win');
      } else {
        document.getElementById('fpResult').textContent = `❌ 错误，答案是 ${state.answer}`;
        document.getElementById('fpResult').className = 'message msg-lose';
        Engine.play('lose');
      }
      setTimeout(() => {
        document.querySelectorAll('#fpOptions .bet-btn').forEach(b => b.disabled = false);
        this.nextQ();
      }, 1000);
    }
  };
})();
