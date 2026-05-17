// ========== 找规律 🔍 ==========

(function() {
  let state = { bet: 0, question: 0, total: 10, score: 0, active: false, seq: [], answer: 0, options: [] };

  BaseGame.init('find-pattern', '🔍', '找规律', {
    tableHTML: '<div id="fpProgress" class="message msg-info">第 1/10 题</div><div id="fpScore" class="message">得分：0</div><div id="fpSeq" class="dice-area" style="font-size:1.8em;padding:20px;letter-spacing:4px;">2, 4, 6, 8, ?</div><div id="fpResult" class="message"></div><div id="fpOptions" class="bet-options" style="gap:8px;"></div>',
    controlsHTML: '<button class="btn btn-primary" id="fpStartBtn" onclick="FindPattern.start()">开始！</button>'
  });

  BaseGame.betHandler('find-pattern', state);

  function generateQuestion(level) {
    let seq = [], answer, options = [];
    const type = Math.min(level, 4);
    switch(type) {
      case 1: {
        const diff = Engine.randomInt(2, 5);
        const start = Engine.randomInt(1, 10);
        for (let i = 0; i < 4; i++) seq.push(start + i * diff);
        answer = start + 4 * diff;
        break;
      }
      case 2: {
        const ratio = Engine.randomInt(2, 4);
        const start = Engine.randomInt(1, 5);
        for (let i = 0; i < 4; i++) seq.push(start * Math.pow(ratio, i));
        answer = start * Math.pow(ratio, 4);
        break;
      }
      case 3: {
        const a = Engine.randomInt(1, 5);
        const b = Engine.randomInt(1, 5);
        seq = [a, b];
        for (let i = 0; i < 3; i++) seq.push(seq[i] + seq[i+1]);
        answer = seq[4] + seq[3];
        break;
      }
      case 4: {
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
        const betAmount = state.bet;
        const prize = Math.floor(betAmount * (1 + state.score / state.total * 3));
        if (state.score >= 7) {
          BaseGame.settle('find-pattern', state, true, prize);
          Engine.showQuote('win');
          document.getElementById('fpResult').textContent = `🏆 完成！答对 ${state.score}/${state.total}，奖金 ${prize} 筹码！`;
          document.getElementById('fpResult').className = 'message msg-win';
        } else {
          BaseGame.settle('find-pattern', state, false, 0);
          document.getElementById('fpResult').textContent = `😞 答对 ${state.score}/${state.total}，输 ${betAmount}`;
          document.getElementById('fpResult').className = 'message msg-lose';
        }
        return;
      }
      document.getElementById('fpProgress').textContent = `第 ${state.question}/${state.total} 题`;
      const level = Math.min(Math.ceil(state.question / 3), 4);
      generateQuestion(level);
    },

    guess(opt) {
      if (!state.active) return;
      document.querySelectorAll('#page-find-pattern .bet-btn').forEach(b => b.disabled = true);
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
        document.querySelectorAll('#page-find-pattern .bet-btn').forEach(b => b.disabled = false);
        this.nextQ();
      }, 1000);
    }
  };
})();
