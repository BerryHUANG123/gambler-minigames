// ========== 进制转换 🔄 ==========

(function() {
  let state = { bet: 0, question: 0, total: 10, score: 0, active: false, answer: 0, options: [], mode: 'b2d', display: '' };

  const html = `
  <div class="game-page" id="page-base-convert">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🔄 进制转换</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="bcProgress" class="message msg-info">第 1/10 题</div>
      <div id="bcScore" class="message">得分：0</div>
      <div id="bcQuestion" class="dice-area" style="font-size:1.8em;padding:20px;">二进制 1010 = ? (十进制)</div>
      <div id="bcResult" class="message"></div>
      <div id="bcOptions" class="bet-options" style="gap:8px;"></div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="BaseConvert.bet(100)">100</div>
      <div class="chip chip-500" onclick="BaseConvert.bet(500)">500</div>
      <div class="chip chip-1000" onclick="BaseConvert.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="bcBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="bcStartBtn" onclick="BaseConvert.start()">开始！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  function generateQuestion(level) {
    const mode = Math.random() > 0.5 ? 'b2d' : 'd2b';
    let num, answer, display, question;
    const max = Math.min(Math.pow(2, Math.min(level + 3, 8)), 256);
    if (mode === 'b2d') {
      num = Engine.randomInt(1, max);
      display = num.toString(2);
      answer = num;
      question = `二进制 ${display} = ? (十进制)`;
    } else {
      num = Engine.randomInt(1, max);
      display = num.toString(10);
      answer = parseInt(num.toString(2), 10);
      question = `十进制 ${display} = ? (二进制)`;
    }
    state.mode = mode; state.answer = answer; state.display = display;
    let options = [answer];
    while (options.length < 4) {
      const r = answer + Engine.randomInt(-20, 20);
      if (!options.includes(r) && r >= 0) options.push(r);
    }
    Engine.shuffle(options);
    state.options = options;
    document.getElementById('bcQuestion').textContent = question;
    const optHtml = options.map(o => 
      `<button class="bet-btn" onclick="BaseConvert.guess(${o})">${o}</button>`
    ).join('');
    document.getElementById('bcOptions').innerHTML = optHtml;
  }

  window.BaseConvert = {
    bet(amount) {
      if (state.active) return;
      if (!Engine.canBet(amount)) {
        document.getElementById('bcResult').textContent = '筹码不够！';
        document.getElementById('bcResult').className = 'message msg-lose';
        return;
      }
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('bcBet').textContent = state.bet;
      Engine.play('click');
    },

    start() {
      if (state.bet <= 0) {
        document.getElementById('bcResult').textContent = '先下注！';
        document.getElementById('bcResult').className = 'message msg-lose';
        return;
      }
      state.active = true;
      state.question = 0;
      state.score = 0;
      document.getElementById('bcStartBtn').disabled = true;
      document.getElementById('bcResult').textContent = '';
      document.getElementById('bcResult').className = 'message';
      document.getElementById('bcScore').textContent = '得分：0';
      this.nextQ();
    },

    nextQ() {
      state.question++;
      if (state.question > state.total) {
        state.active = false;
        document.getElementById('bcStartBtn').disabled = false;
        const prize = state.bet * (1 + state.score / (state.total * 10) * 3);
        Engine.addBalance(Math.floor(prize));
        Engine.updateBalanceUI();
        document.getElementById('bcResult').textContent = `🏆 完成！得分 ${state.score}/100，奖金 ${Math.floor(prize)} 筹码！`;
        document.getElementById('bcResult').className = state.score >= 50 ? 'message msg-win' : 'message msg-lose';
        if (state.score >= 50) { Engine.play('win'); Engine.showQuote('win'); }
        else { Engine.play('lose'); }
        state.bet = 0;
        document.getElementById('bcBet').textContent = '0';
        Engine.save();
        return;
      }
      document.getElementById('bcProgress').textContent = `第 ${state.question}/${state.total} 题`;
      generateQuestion(Math.min(state.question, 8));
    },

    guess(opt) {
      if (!state.active) return;
      document.querySelectorAll('#bcOptions .bet-btn').forEach(b => b.disabled = true);
      if (opt === state.answer) {
        state.score += 10;
        document.getElementById('bcScore').textContent = `得分：${state.score}`;
        document.getElementById('bcResult').textContent = '✅ 正确！+10分';
        document.getElementById('bcResult').className = 'message msg-win';
        Engine.play('win');
      } else {
        const correct = state.mode === 'b2d' ? `十进制 ${state.answer}` : `二进制 ${state.answer}`;
        document.getElementById('bcResult').textContent = `❌ 错误，答案是 ${correct}`;
        document.getElementById('bcResult').className = 'message msg-lose';
        Engine.play('lose');
      }
      setTimeout(() => {
        document.querySelectorAll('#bcOptions .bet-btn').forEach(b => b.disabled = false);
        this.nextQ();
      }, 1000);
    }
  };
})();