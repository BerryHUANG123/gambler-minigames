(function() {
  let state = { bet: 0, playerScore: 0, compScore: 0, round: 0, maxRounds: 3 };

  const CHOICES = [
    { id: 'rock', icon: '✊', beat: 'scissors' },
    { id: 'paper', icon: '✋', beat: 'rock' },
    { id: 'scissors', icon: '✌️', beat: 'paper' },
  ];

  BaseGame.init('rps', '✂️', '猜拳', {
    tableHTML: `
      <div style="display:flex;justify-content:space-around;width:100%;margin-bottom:8px;">
        <div>你：<span id="rpsP"></span></div>
        <div>电脑：<span id="rpsC"></span></div>
      </div>
      <div id="rpsBattle" style="display:flex;justify-content:center;align-items:center;gap:20px;font-size:3rem;margin:8px 0;min-height:80px;">
        <span id="rpsPlayerChoice">🤚</span>
        <span style="font-size:1.5rem;color:#888;">VS</span>
        <span id="rpsCompChoice">🤖</span>
      </div>
      <div id="rpsScore" style="font-size:0.9rem;color:#aaa;">第 1/3 局</div>
      <div id="rpsResult" class="message">三局两胜，先下注！</div>
    `,
    betOptionsHTML: `
      <div class="bet-options">
        <button class="bet-btn" onclick="RPS.throw('rock')">✊ 石头</button>
        <button class="bet-btn" onclick="RPS.throw('paper')">✋ 布</button>
        <button class="bet-btn" onclick="RPS.throw('scissors')">✌️ 剪刀</button>
      </div>
    `
  });

  window.RPS = {
    bet: BaseGame.betHandler('rps', state),

    throw(playerId) {
      if (state.bet <= 0) {
        document.getElementById('rpsResult').textContent = '先下注！';
        return;
      }
      if (state.round >= state.maxRounds) {
        document.getElementById('rpsResult').textContent = '这局已经结束了！';
        return;
      }

      const compChoice = CHOICES[Engine.randomInt(0, 2)];
      const playerChoice = CHOICES.find(c => c.id === playerId);
      const playerWon = playerChoice.beat === compChoice.id;

      document.getElementById('rpsPlayerChoice').textContent = playerChoice.icon;
      document.getElementById('rpsCompChoice').textContent = compChoice.icon;
      Engine.play('click');

      const res = document.getElementById('rpsResult');
      if (playerWon) {
        state.playerScore++;
        res.textContent = '你赢了这局！';
        res.className = 'message msg-win';
      } else if (playerChoice.id === compChoice.id) {
        res.textContent = '平局！';
        res.className = 'message msg-info';
      } else {
        state.compScore++;
        res.textContent = '电脑赢了这局！';
        res.className = 'message msg-lose';
      }

      state.round++;
      document.getElementById('rpsScore').textContent = `第 ${state.round + 1}/3 局 | 你 ${state.playerScore} - ${state.compScore} 电脑`;
      document.getElementById('rpsP').textContent = `${state.playerScore} 胜`;
      document.getElementById('rpsC').textContent = `${state.compScore} 胜`;

      if (state.round >= state.maxRounds || state.playerScore >= 2 || state.compScore >= 2) {
        setTimeout(() => {
          if (state.playerScore > state.compScore) {
            const win = state.bet * 2;
            Engine.addBalance(win);
            res.textContent = `🎉 你赢了系列赛！赢 ${win} 筹码！`;
            res.className = 'message msg-win';
            Engine.play('win');
            Engine.showQuote('win');
          } else {
            res.textContent = `😢 系列赛输了！输 ${state.bet}`;
            res.className = 'message msg-lose';
            Engine.play('lose');
          }
          state.bet = 0;
          document.getElementById('rpsBet').textContent = '0';
          Engine.updateBalanceUI();
          setTimeout(() => RPS.reset(), 2000);
        }, 500);
      }
    },

    reset() {
      state.playerScore = 0;
      state.compScore = 0;
      state.round = 0;
      document.getElementById('rpsScore').textContent = '第 1/3 局';
      document.getElementById('rpsPlayerChoice').textContent = '🤚';
      document.getElementById('rpsCompChoice').textContent = '🤖';
      document.getElementById('rpsP').textContent = '';
      document.getElementById('rpsC').textContent = '';
      document.getElementById('rpsResult').textContent = '新一局！下注开始！';
      document.getElementById('rpsResult').className = 'message msg-info';
      document.getElementById('rpsBet').textContent = '0';
      Engine.updateBalanceUI();
    }
  };
})();
