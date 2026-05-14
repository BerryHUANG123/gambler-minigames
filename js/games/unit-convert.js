// ========== 单位换算 📏 ==========

(function() {
  let state = { bet: 0, question: 0, total: 10, score: 0, active: false, answer: 0, options: [], questionText: '' };

  const conversions = [
    { from: '米', to: '公里', factor: 0.001, label: 'm→km' },
    { from: '公里', to: '米', factor: 1000, label: 'km→m' },
    { from: '厘米', to: '米', factor: 0.01, label: 'cm→m' },
    { from: '米', to: '厘米', factor: 100, label: 'm→cm' },
    { from: '克', to: '千克', factor: 0.001, label: 'g→kg' },
    { from: '千克', to: '克', factor: 1000, label: 'kg→g' },
    { from: '千克', to: '吨', factor: 0.001, label: 'kg→t' },
    { from: '吨', to: '千克', factor: 1000, label: 't→kg' },
  ];

  const html = `
  <div class="game-page" id="page-unit-convert">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>📏 单位换算</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="ucProgress" class="message msg-info">第 1/10 题</div>
      <div id="ucScore" class="message">得分：0</div>
      <div id="ucQuestion" class="dice-area" style="font-size:1.6em;padding:20px;">5000 米 = ? 公里</div>
      <div id="ucResult" class="message"></div>
      <div id="ucOptions" class="bet-options" style="gap:8px;"></div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="UnitConvert.bet(100)">100</div>
      <div class="chip chip-500" onclick="UnitConvert.bet(500)">500</div>
      <div class="chip chip-1000" onclick="UnitConvert.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="ucBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="ucStartBtn" onclick="UnitConvert.start()">开始！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  function generateQuestion(level) {
    const conv = conversions[Engine.randomInt(0, conversions.length - 1)];
    const bases = conv.factor >= 1 ? [1, 2, 5, 10, 20, 50, 100] : [100, 250, 500, 1000, 2500, 5000];
    const val = bases[Engine.randomInt(0, bases.length - 1)];
    const answer = Math.round(val * conv.factor * 100) / 100;
    const qText = `${val} ${conv.from} = ? ${conv.to}`;
    state.answer = answer;
    state.questionText = qText;
    let options = [answer];
    while (options.length < 4) {
      const r = Math.round((answer + Math.random() * 4 - 2) * 100) / 100;
      if (!options.includes(r) && r >= 0) options.push(r);
    }
    Engine.shuffle(options);
    state.options = options;
    document.getElementById('ucQuestion').textContent = qText;
    const optHtml = options.map(o => 
      `<button class="bet-btn" onclick="UnitConvert.guess(${o})">${o}</button>`
    ).join('');
    document.getElementById('ucOptions').innerHTML = optHtml;
  }

  window.UnitConvert = {
    bet(amount) {
      if (state.active) return;
      if (!Engine.canBet(amount)) {
        document.getElementById('ucResult').textContent = '筹码不够！';
        document.getElementById('ucResult').className = 'message msg-lose';
        return;
      }
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('ucBet').textContent = state.bet;
      Engine.play('click');
    },

    start() {
      if (state.bet <= 0) {
        document.getElementById('ucResult').textContent = '先下注！';
        document.getElementById('ucResult').className = 'message msg-lose';
        return;
      }
      state.active = true;
      state.question = 0;
      state.score = 0;
      document.getElementById('ucStartBtn').disabled = true;
      document.getElementById('ucResult').textContent = '';
      document.getElementById('ucResult').className = 'message';
      document.getElementById('ucScore').textContent = '得分：0';
      this.nextQ();
    },

    nextQ() {
      state.question++;
      if (state.question > state.total) {
        state.active = false;
        document.getElementById('ucStartBtn').disabled = false;
        const prize = state.bet * (1 + state.score / (state.total * 10) * 3);
        Engine.addBalance(Math.floor(prize));
        Engine.updateBalanceUI();
        document.getElementById('ucResult').textContent = `🏆 完成！得分 ${state.score}/100，奖金 ${Math.floor(prize)} 筹码！`;
        document.getElementById('ucResult').className = state.score >= 50 ? 'message msg-win' : 'message msg-lose';
        if (state.score >= 50) { Engine.play('win'); Engine.showQuote('win'); }
        else { Engine.play('lose'); }
        state.bet = 0;
        document.getElementById('ucBet').textContent = '0';
        Engine.save();
        return;
      }
      document.getElementById('ucProgress').textContent = `第 ${state.question}/${state.total} 题`;
      generateQuestion(Math.min(state.question, 8));
    },

    guess(opt) {
      if (!state.active) return;
      document.querySelectorAll('#ucOptions .bet-btn').forEach(b => b.disabled = true);
      if (Math.abs(opt - state.answer) < 0.01) {
        state.score += 10;
        document.getElementById('ucScore').textContent = `得分：${state.score}`;
        document.getElementById('ucResult').textContent = '✅ 正确！+10分';
        document.getElementById('ucResult').className = 'message msg-win';
        Engine.play('win');
      } else {
        document.getElementById('ucResult').textContent = `❌ 错误，答案是 ${state.answer}`;
        document.getElementById('ucResult').className = 'message msg-lose';
        Engine.play('lose');
      }
      setTimeout(() => {
        document.querySelectorAll('#ucOptions .bet-btn').forEach(b => b.disabled = false);
        this.nextQ();
      }, 1000);
    }
  };
})();