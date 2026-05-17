// ========== 进制转换 🔄 ==========
(function() {
  let state = { bet: 0, question: 0, total: 10, score: 0, active: false, answer: 0, options: [], mode: 'b2d', display: '' };

  BaseGame.init('base-convert', '🔄', '进制转换', {
    tableHTML: '<div id="bcProgress" class="message msg-info">第 1/10 题</div><div id="bcScore" class="message">得分：0</div><div id="bcQuestion" class="dice-area" style="font-size:1.8em;padding:20px;">二进制 1010 = ? (十进制)</div><div id="bcResult" class="message"></div><div id="bcOptions" class="bet-options" style="gap:8px;"></div>',
    controlsHTML: '<button class="btn btn-primary" id="bcStartBtn" onclick="BaseConvert.start()">开始！</button>'
  });

  BaseGame.betHandler('base-convert', state);

  function generateQuestion(level) {
    const mode = Math.random() > 0.5 ? 'b2d' : 'd2b';
    let num, answer, display, question;
    const max = Math.min(Math.pow(2, Math.min(level + 3, 8)), 256);
    if (mode === 'b2d') {
      num = Engine.randomInt(1, max);
      display = num.toString(2);
      answer = num;
      question = '二进制 ' + display + ' = ? (十进制)';
    } else {
      num = Engine.randomInt(1, max);
      display = num.toString(10);
      answer = parseInt(num.toString(2), 10);
      question = '十进制 ' + display + ' = ? (二进制)';
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
      '<button class="bet-btn" onclick="BaseConvert.guess(' + o + ')">' + o + '</button>'
    ).join('');
    document.getElementById('bcOptions').innerHTML = optHtml;
  }

  window.BaseConvert = {
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
        const prize = Math.floor(state.bet * (1 + state.score / (state.total * 10) * 3));
        const res = document.getElementById('bcResult');
        if (state.score >= 50) {
          res.textContent = '🏆 完成！得分 ' + state.score + '/100，奖金 ' + prize + ' 筹码！';
          res.className = 'message msg-win';
          Engine.showQuote('win');
          BaseGame.settle('base-convert', state, true, prize);
        } else {
          res.textContent = '🏆 完成！得分 ' + state.score + '/100，奖金 ' + prize + ' 筹码！';
          res.className = 'message msg-lose';
          BaseGame.settle('base-convert', state, false, 0);
        }
        Engine.save();
        return;
      }
      document.getElementById('bcProgress').textContent = '第 ' + state.question + '/' + state.total + ' 题';
      generateQuestion(Math.min(state.question, 8));
    },

    guess(opt) {
      if (!state.active) return;
      document.querySelectorAll('#bcOptions .bet-btn').forEach(b => b.disabled = true);
      if (opt === state.answer) {
        state.score += 10;
        document.getElementById('bcScore').textContent = '得分：' + state.score;
        document.getElementById('bcResult').textContent = '✅ 正确！+10分';
        document.getElementById('bcResult').className = 'message msg-win';
        Engine.play('win');
      } else {
        const correct = state.mode === 'b2d' ? '十进制 ' + state.answer : '二进制 ' + state.answer;
        document.getElementById('bcResult').textContent = '❌ 错误，答案是 ' + correct;
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
