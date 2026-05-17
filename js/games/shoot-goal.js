// ========== 射门 ⚽ ==========

(function() {
  let state = { bet: 0, round: 0, totalRounds: 5, score: 0, active: false };

  BaseGame.init('shoot-goal', '⚽', '射门', {
    tableHTML: `
      <div class="dice-area" style="flex-direction:column;gap:8px;">
        <div style="font-size:4em;">⚽🧤</div>
        <div id="sgScore" class="message msg-info">进球：0/5</div>
        <div id="sgResult" class="message">选择方向射门！</div>
      </div>
      <div class="bet-options" style="gap:10px;">
        <button class="bet-btn" onclick="ShootGoal.shoot('left')">⬅ 左</button>
        <button class="bet-btn" onclick="ShootGoal.shoot('center')">⬆ 中</button>
        <button class="bet-btn" onclick="ShootGoal.shoot('right')">➡ 右</button>
      </div>`,
    controlsHTML: `
      <button class="btn btn-primary" onclick="ShootGoal.reset()">重新开始</button>`
  });

  window.shoot_goalBet = function(amount) {
    if (state.active) return;
    if (!Engine.canBet(amount)) {
      document.getElementById('sgResult').textContent = '筹码不够！';
      document.getElementById('sgResult').className = 'message msg-lose';
      return;
    }
    BaseGame.betHandler('shoot-goal', state)(amount);
    document.getElementById('sgResult').textContent = '选方向射门！';
    document.getElementById('sgResult').className = 'message msg-info';
  };

  window.ShootGoal = {
    shoot(direction) {
      if (state.bet <= 0) {
        document.getElementById('sgResult').textContent = '先下注！';
        document.getElementById('sgResult').className = 'message msg-lose';
        return;
      }
      if (!state.active) {
        state.active = true;
        state.round = 0;
        state.score = 0;
        document.getElementById('sgScore').textContent = '进球：0/5';
      }
      if (state.round >= state.totalRounds) return;

      state.round++;
      document.querySelectorAll('#page-shoot-goal .bet-btn').forEach(b => b.disabled = true);
      Engine.play('spin');

      setTimeout(() => {
        const keeperDir = ['left', 'center', 'right'][Engine.randomInt(0, 2)];
        const goal = direction !== keeperDir;
        if (goal) state.score++;

        const dirMap = { left: '⬅左', center: '⬆中', right: '➡右' };
        document.getElementById('sgScore').textContent = `进球：${state.score}/${state.totalRounds}`;

        if (goal) {
          document.getElementById('sgResult').textContent = `⚽ 射${dirMap[direction]}，守门员扑${dirMap[keeperDir]} → 进球！(${state.score}/${state.totalRounds})`;
          document.getElementById('sgResult').className = 'message msg-win';
          Engine.play('win');
        } else {
          document.getElementById('sgResult').textContent = `❌ 射${dirMap[direction]}，守门员扑${dirMap[keeperDir]} → 被扑出！(${state.score}/${state.totalRounds})`;
          document.getElementById('sgResult').className = 'message msg-lose';
          Engine.play('lose');
        }

        if (state.round >= state.totalRounds) {
          state.active = false;
          const betAmt = state.bet;
          const prize = betAmt * (1 + state.score / state.totalRounds * 3);
          document.getElementById('sgResult').textContent += ` 🏆 共进${state.score}球，奖金 ${Math.floor(prize)} 筹码！`;
          document.getElementById('sgResult').className = state.score >= 3 ? 'message msg-win' : 'message msg-lose';
          if (state.score >= 3) Engine.showQuote('win');
          BaseGame.settle('shoot-goal', state, true, Math.floor(prize));
        }

        document.querySelectorAll('#page-shoot-goal .bet-btn').forEach(b => b.disabled = false);
      }, 700);
    },

    reset() {
      state.active = false;
      state.round = 0;
      state.score = 0;
      document.getElementById('sgScore').textContent = '进球：0/5';
      document.getElementById('sgResult').textContent = '重新开始！先下注';
      document.getElementById('sgResult').className = 'message msg-info';
      document.querySelectorAll('#page-shoot-goal .bet-btn').forEach(b => b.disabled = false);
    }
  };
})();
