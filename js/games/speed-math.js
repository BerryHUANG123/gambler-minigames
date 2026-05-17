// ========== 速算 ⚡ ==========
(function() {
  let state = { bet: 0, score: 0, timeLeft: 10, active: false, a: 0, b: 0, op: '+', timer: null };

  BaseGame.init('speed-math', '⚡', '速算', {
    tableHTML: '<div id="smTimer" class="message msg-info">时间：10s</div><div id="smScore" class="message">得分：0</div><div id="smQuestion" class="dice-area" style="font-size:2.5em;padding:20px;">23 + 45 = ?</div><div id="smResult" class="message"></div><div class="bet-options" style="gap:8px;"><input type="number" id="smAnswer" placeholder="输入答案" style="width:200px;padding:8px;font-size:1.1em;border-radius:8px;border:2px solid #ffd700;background:#222;color:#fff;text-align:center;"><button class="btn btn-primary" onclick="SpeedMath.submit()">确认</button></div>',
    controlsHTML: '<button class="btn btn-primary" id="smStartBtn" onclick="SpeedMath.start()">开始游戏！</button>'
  });

  BaseGame.betHandler('speed-math', state);

  function generateQuestion(level) {
    let a = Engine.randomInt(10 * level, 50 * level);
    let b = Engine.randomInt(10 * level, 50 * level);
    if (a < b) [a, b] = [b, a];
    const op = Math.random() > 0.5 ? '+' : '-';
    state.a = a; state.b = b; state.op = op;
    document.getElementById('smQuestion').textContent = a + ' ' + op + ' ' + b + ' = ?';
    document.getElementById('smAnswer').value = '';
    document.getElementById('smAnswer').focus();
  }

  window.SpeedMath = {
    start() {
      if (state.active) return;
      if (state.bet <= 0) {
        document.getElementById('smResult').textContent = '先下注！';
        document.getElementById('smResult').className = 'message msg-lose';
        return;
      }
      state.active = true;
      state.score = 0;
      state.timeLeft = 10;
      document.getElementById('smStartBtn').disabled = true;
      document.getElementById('smResult').textContent = '';
      document.getElementById('smResult').className = 'message';
      document.getElementById('smTimer').textContent = '时间：10s';
      document.getElementById('smTimer').className = 'message msg-info';
      document.getElementById('smScore').textContent = '得分：0';
      generateQuestion(1);

      state.timer = setInterval(() => {
        state.timeLeft--;
        document.getElementById('smTimer').textContent = '时间：' + state.timeLeft + 's';
        if (state.timeLeft <= 3) {
          document.getElementById('smTimer').className = 'message msg-lose';
        }
        if (state.timeLeft <= 0) {
          clearInterval(state.timer);
          state.active = false;
          document.getElementById('smStartBtn').disabled = false;
          const prize = Math.floor(state.bet * (1 + state.score / 10));
          const res = document.getElementById('smResult');
          if (state.score >= 5) {
            res.textContent = '⏰ 时间到！得分 ' + state.score + '，奖金 ' + prize + ' 筹码！';
            res.className = 'message msg-win';
            Engine.showQuote('win');
            BaseGame.settle('speed-math', state, true, prize);
          } else {
            res.textContent = '⏰ 时间到！得分 ' + state.score + '，奖金 ' + prize + ' 筹码！';
            res.className = 'message msg-lose';
            BaseGame.settle('speed-math', state, false, 0);
          }
          Engine.save();
        }
      }, 1000);
    },

    submit() {
      if (!state.active) return;
      const input = document.getElementById('smAnswer');
      const ans = parseInt(input.value);
      if (isNaN(ans)) return;
      const correct = state.op === '+' ? state.a + state.b : state.a - state.b;
      if (ans === correct) {
        state.score++;
        document.getElementById('smScore').textContent = '得分：' + state.score;
        document.getElementById('smResult').textContent = '✅ 正确！+10分';
        document.getElementById('smResult').className = 'message msg-win';
        Engine.play('win');
      } else {
        document.getElementById('smResult').textContent = '❌ 错误，答案是 ' + correct;
        document.getElementById('smResult').className = 'message msg-lose';
        Engine.play('lose');
      }
      const level = Math.min(Math.floor(state.score / 3) + 1, 10);
      generateQuestion(level);
    }
  };
})();
