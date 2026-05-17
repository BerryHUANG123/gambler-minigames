// ========== 保龄球 🎳 ==========

(function() {
  let state = { bet: 0, frameBet: 0, round: 0, totalRounds: 10, score: 0, active: false };

  BaseGame.init('bowling', '🎳', '保龄球', {
    tableHTML: `
      <div class="dice-area" style="flex-direction:column;gap:10px;">
        <div id="bowlingPins" style="font-size:3em;">🎳🎳🎳🎳🎳🎳🎳🎳🎳🎳</div>
        <div id="bowlingScore" class="message msg-info">局数：0/10 总分：0</div>
        <div id="bowlingResult" class="message">下注后投球！</div>
      </div>`,
    betOptionsHTML: `
      <div class="bet-options" style="gap:10px;">
        <button class="bet-btn" onclick="Bowling.betFrame(100)">每局下注100</button>
        <button class="bet-btn" onclick="Bowling.betFrame(200)">每局下注200</button>
      </div>`,
    controlsHTML: `
      <button class="btn btn-primary" onclick="Bowling.roll()" id="bowlingRollBtn">🎳 投球！</button>`
  });

  window.bowlingBet = function(amount) {
    if (state.active) return;
    if (!Engine.canBet(amount)) {
      document.getElementById('bowlingResult').textContent = '筹码不够！';
      document.getElementById('bowlingResult').className = 'message msg-lose';
      return;
    }
    BaseGame.betHandler('bowling', state)(amount);
  };

  function getPinsEmoji(knocked) {
    const total = 10;
    const standing = total - knocked;
    return '🎳'.repeat(standing) + '💫'.repeat(knocked);
  }

  window.Bowling = {
    betFrame(amount) {
      if (!Engine.canBet(amount)) {
        document.getElementById('bowlingResult').textContent = '筹码不够！';
        document.getElementById('bowlingResult').className = 'message msg-lose';
        return;
      }
      state.frameBet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById('bowlingFrameBet').textContent = state.frameBet;
      Engine.play('click');
      document.getElementById('bowlingResult').textContent = '可以投球了！';
      document.getElementById('bowlingResult').className = 'message msg-info';
    },

    roll() {
      if (state.bet <= 0 && state.frameBet <= 0) {
        document.getElementById('bowlingResult').textContent = '先下注！';
        document.getElementById('bowlingResult').className = 'message msg-lose';
        return;
      }
      if (!state.active) {
        state.active = true;
        state.round = 0;
        state.score = 0;
        document.getElementById('bowlingScore').textContent = `局数：0/${state.totalRounds} 总分：0`;
      }
      if (state.round >= state.totalRounds) return;

      state.round++;
      document.getElementById('bowlingRollBtn').disabled = true;
      Engine.play('spin');

      setTimeout(() => {
        const knocked = Engine.randomInt(0, 10);
        state.score += knocked;
        const currentBet = state.frameBet > 0 ? state.frameBet : state.bet / state.totalRounds;
        let multiplier = 0;
        if (knocked === 10) multiplier = 3;
        else if (knocked >= 7) multiplier = 2;
        else if (knocked >= 1) multiplier = 1;

        const winAmount = Math.floor(currentBet * multiplier);
        if (winAmount > 0) {
          Engine.addBalance(winAmount);
          Engine.updateBalanceUI();
        }

        document.getElementById('bowlingPins').textContent = getPinsEmoji(knocked);
        document.getElementById('bowlingScore').textContent = `局数：${state.round}/${state.totalRounds} 总分：${state.score}`;

        const label = knocked === 10 ? '🎉 全倒！' : knocked >= 7 ? '👍 补中！' : knocked >= 1 ? '👌 一般' : '💔 没中';
        document.getElementById('bowlingResult').textContent = `${label} 击倒${knocked}瓶，${winAmount > 0 ? '赢 '+winAmount : '没赢'}筹码`;
        document.getElementById('bowlingResult').className = knocked >= 7 ? 'message msg-win' : knocked >= 1 ? 'message msg-info' : 'message msg-lose';
        if (knocked >= 7) { Engine.play('win'); }
        else { Engine.play('lose'); }

        if (state.round >= state.totalRounds) {
          state.active = false;
          document.getElementById('bowlingResult').textContent += ` 🏆 总分${state.score}！`;
          if (state.score >= 80) Engine.showQuote('jackpot');
          state.bet = 0;
          state.frameBet = 0;
          document.getElementById('bowlingBet').textContent = '0';
          document.getElementById('bowlingFrameBet').textContent = '0';
          Engine.save();
        }
        document.getElementById('bowlingRollBtn').disabled = false;
      }, 700);
    }
  };
})();
