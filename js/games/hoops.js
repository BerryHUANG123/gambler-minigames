// ========== 投篮 🏀 ==========

(function() {
  let state = { bet: 0, round: 0, totalRounds: 10, score: 0, active: false };

  const html = `
  <div class="game-page" id="page-hoops">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🏀 投篮</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div class="dice-area" style="flex-direction:column;gap:12px;">
        <div style="font-size:4em;">🏀</div>
        <div id="hoopsScore" class="message msg-info">命中：0/10</div>
        <div id="hoopsResult" class="message">准备好了吗？</div>
      </div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Hoops.bet(100)">100</div>
      <div class="chip chip-500" onclick="Hoops.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Hoops.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="hoopsBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" onclick="Hoops.shoot()" id="hoopsShootBtn">🏀 投篮！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  window.Hoops = {
    bet(amount) {
      if (state.active) return;
      if (!Engine.canBet(amount)) {
        document.getElementById('hoopsResult').textContent = '筹码不够！';
        document.getElementById('hoopsResult').className = 'message msg-lose';
        return;
      }
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('hoopsBet').textContent = state.bet;
      Engine.play('click');
      document.getElementById('hoopsResult').textContent = '开始投篮吧！';
      document.getElementById('hoopsResult').className = 'message msg-info';
    },

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
          const prize = state.bet * (1 + state.score / state.totalRounds * 2);
          Engine.addBalance(Math.floor(prize));
          Engine.updateBalanceUI();
          document.getElementById('hoopsResult').textContent += ` 🏆 共命中${state.score}球，奖金 ${Math.floor(prize)} 筹码！`;
          document.getElementById('hoopsResult').className = state.score >= 6 ? 'message msg-win' : 'message msg-lose';
          if (state.score >= 6) Engine.showQuote('win');
          state.bet = 0;
          document.getElementById('hoopsBet').textContent = '0';
          Engine.save();
        } else {
          document.getElementById('hoopsShootBtn').disabled = false;
        }
      }, 600);
    }
  };
})();