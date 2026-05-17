(function() {
  let state = { bet: 0, question: 0, total: 10, score: 0, active: false, seq: [], answer: 0, options: [] };

  BaseGame.init('number-seq', '🔢', '数列', {
    tableHTML: '<div id="nsProgress" class="message msg-info">第 1/10 题</div><div id="nsScore" class="message">得分：0</div><div id="nsSeq" class="dice-area" style="font-size:1.6em;padding:20px;letter-spacing:3px;">1, 2, 4, 7, 11, ?</div><div id="nsResult" class="message"></div><div id="nsOptions" class="bet-options" style="gap:8px;"></div>',
    controlsHTML: '<button class="btn btn-primary" id="nsStartBtn" onclick="NumberSeq.start()">开始！</button>'
  });

  function generateQuestion(level) {
    let seq = [], answer;
    const type = level <= 3 ? Engine.randomInt(1,3) : Engine.randomInt(1,5);
    switch(type) {
      case 1: {
        let cur = Engine.randomInt(1, 10);
        let diff = Engine.randomInt(1, 3);
        for (let i = 0; i < 5; i++) { seq.push(cur); cur += diff; diff += Engine.randomInt(1, 2); }
        answer = cur;
        break;
      }
      case 2: {
        const a = Engine.randomInt(1, 5);
        const b = Engine.randomInt(1, 5);
        seq = [];
        for (let i = 0; i < 5; i++) seq.push(i % 2 === 0 ? a + i * 2 : b + i * 3);
        answer = 5 % 2 === 0 ? a + 5 * 2 : b + 5 * 3;
        break;
      }
      case 3: {
        const base = Engine.randomInt(2, 4);
        let cur = Engine.randomInt(1, 5);
        for (let i = 0; i < 5; i++) { seq.push(cur); cur = cur * base + Engine.randomInt(1, 3); }
        answer = cur;
        break;
      }
      case 4: {
        const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];
        const start = Engine.randomInt(0, primes.length - 6);
        seq = primes.slice(start, start + 5);
        answer = primes[start + 5];
        break;
      }
      case 5: {
        const start = Engine.randomInt(2, 5);
        for (let i = 0; i < 5; i++) seq.push(Math.pow(start + i, 3));
        answer = Math.pow(start + 5, 3);
        break;
      }
    }
    let options = [answer];
    while (options.length < 4) {
      const r = answer + Engine.randomInt(-30, 30);
      if (!options.includes(r) && r > 0) options.push(r);
    }
    Engine.shuffle(options);
    state.seq = seq; state.answer = answer; state.options = options;
    document.getElementById('nsSeq').textContent = seq.join(', ') + ', ?';
    const optHtml = options.map(o => 
      `<button class="bet-btn" onclick="NumberSeq.guess(${o})">${o}</button>`
    ).join('');
    document.getElementById('nsOptions').innerHTML = optHtml;
  }

  window.nsBet = function(amount) {
    if (state.active) return;
    if (!Engine.canBet(amount)) {
      document.getElementById('nsResult').textContent = '筹码不够！';
      document.getElementById('nsResult').className = 'message msg-lose';
      return;
    }
    BaseGame.betHandler('number-seq', state)(amount);
  };

  window.NumberSeq = {
    start() {
      if (state.bet <= 0) {
        document.getElementById('nsResult').textContent = '先下注！';
        document.getElementById('nsResult').className = 'message msg-lose';
        return;
      }
      state.active = true;
      state.question = 0;
      state.score = 0;
      document.getElementById('nsStartBtn').disabled = true;
      document.getElementById('nsResult').textContent = '';
      document.getElementById('nsScore').textContent = '得分：0';
      this.nextQ();
    },

    nextQ() {
      state.question++;
      if (state.question > state.total) {
        state.active = false;
        document.getElementById('nsStartBtn').disabled = false;
        const prize = Math.floor(state.bet * (1 + state.score / (state.total * 10) * 3));
        document.getElementById('nsResult').textContent = `🏆 完成！得分 ${state.score}/100，奖金 ${prize} 筹码！`;
        document.getElementById('nsResult').className = state.score >= 50 ? 'message msg-win' : 'message msg-lose';
        if (state.score >= 50) { Engine.showQuote('win'); }
        BaseGame.settle('number-seq', state, true, prize);
        Engine.save();
        return;
      }
      document.getElementById('nsProgress').textContent = `第 ${state.question}/${state.total} 题`;
      generateQuestion(Math.min(state.question, 5));
    },

    guess(opt) {
      if (!state.active) return;
      document.querySelectorAll('#nsOptions .bet-btn').forEach(b => b.disabled = true);
      if (opt === state.answer) {
        state.score += 10;
        document.getElementById('nsScore').textContent = `得分：${state.score}`;
        document.getElementById('nsResult').textContent = '✅ 正确！+10分';
        document.getElementById('nsResult').className = 'message msg-win';
        Engine.play('win');
      } else {
        document.getElementById('nsResult').textContent = `❌ 错误，答案是 ${state.answer}`;
        document.getElementById('nsResult').className = 'message msg-lose';
        Engine.play('lose');
      }
      setTimeout(() => {
        document.querySelectorAll('#nsOptions .bet-btn').forEach(b => b.disabled = false);
        this.nextQ();
      }, 1000);
    }
  };
})();
