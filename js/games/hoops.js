// ========== 投篮 🏀 ==========

(function() {
  let state = { bet: 0, round: 0, totalRounds: 10, score: 0, active: false };

  BaseGame.init('hoops', '🏀', '投篮', {
    tableHTML: `
      <div class="dice-area" style="flex-direction:column;gap:12px;">
        <div style="font-size:4em;">🏀</div>
        <div id="hoopsScore" class="message msg-info">命中：0/10</div>
        <div id="hoopsResult" class="message">准备好了吗？</div>
      </div>`,
    controlsHTML: `
      <button class="btn btn-primary" onclick="Hoops.shoot()" id="hoopsShootBtn">🏀 投篮！</button>`
  });

  window.hoopsBet = function(amount) {
    if (state.active) return;
    if (!Engine.canBet(amount)) {
      document.getElementById('hoopsResult').textContent = '筹码不够！';
      document.getElementById('hoopsResult').className = 'message msg-lose';
      return;
    }
    BaseGame.betHandler('hoops', state)(amount);
    document.getElementById('hoopsResult').textContent = '开始投篮吧！';
    document.getElementById('hoopsResult').className = 'message msg-info';
  };

  window.Hoops = {
    shoot() {
      if (state.bet <= 0) {
        document.getElementById('hoopsResult').textContent = '先下注！';
        document.getElementById('hoopsResult').className = 'message msg-lose';
        return;
      }
      if (!state.active) {
        state.active = true;
        state.round = 0;
        state.score = 0;
        document.getElementById('hoopsScore').textContent = '命中：0/10';
        document.getElementById('hoopsResult').textContent = '';
      }
      if (state.round >= state.totalRounds) return;

      state.round++;
      Engine.play('spin');
      document.getElementById('hoopsShootBtn').disabled = true;

      setTimeout(() => {
        const hit = Math.random() < 0.5;
        if (hit) state.score++;
        document.getElementById('hoopsScore').textContent = `命中：${state.score}/${state.totalRounds}`;

        if (hit) {
          document.getElementById('hoopsResult').textContent = `🎯 第${state.round}球命中！(${state.score}/${state.totalRounds})`;
          document.getElementById('hoopsResult').className = 'message msg-win';
          Engine.play('win');
        } else {
          document.getElementById('hoopsResult').textContent = `😅 第${state.round}球没中(${state.score}/${state.totalRounds})`;
          document.getElementById('hoopsResult').className = 'message msg-lose';
          Engine.play('lose');
        }

        if (state.round >= state.totalRounds) {
          document.getElementById('hoopsShootBtn').disabled = false;
          state.active = false;
          const betAmt = state.bet;
          const prize = betAmt * (1 + state.score / state.totalRounds * 2);
          document.getElementById('hoopsResult').textContent += ` 🏆 共命中${state.score}球，奖金 ${Math.floor(prize)} 筹码！`;
          document.getElementById('hoopsResult').className = state.score >= 6 ? 'message msg-win' : 'message msg-lose';
          if (state.score >= 6) Engine.showQuote('win');
          BaseGame.settle('hoops', state, true, Math.floor(prize));
        } else {
          document.getElementById('hoopsShootBtn').disabled = false;
        }
      }, 600);
    }
  };
})();
