(function() {
  const state = { bet: 0, choice: null, flipping: false };

  BaseGame.init('coinflip', '🎪', '猜硬币', {
    tableHTML: `
      <div id="coinDisplay" style="font-size:5rem;margin:10px 0;transition:0.3s;">🪙</div>
      <div id="coinResult" class="message">正面还是反面？</div>
    `,
    betOptionsHTML: `
      <div class="bet-options">
        <button class="bet-btn" data-choice="heads" onclick="CoinFlip.select('heads')">正面 👑</button>
        <button class="bet-btn" data-choice="tails" onclick="CoinFlip.select('tails')">反面 🍀</button>
      </div>
    `,
    controlsHTML: `<button class="btn btn-primary" id="cfFlipBtn" onclick="CoinFlip.flip()">掷硬币！</button>`
  });

  window.CoinFlip = {
    select(choice) {
      state.choice = choice;
      BaseGame.selectOption('coinflip', choice);
      document.getElementById('coinResult').textContent = '';
      Engine.play('click');
    },
    bet: BaseGame.betHandler('coinflip', state),
    flip() {
      if (state.flipping || state.bet <= 0 || !state.choice) return;
      state.flipping = true;
      document.getElementById('cfFlipBtn').disabled = true;
      Engine.play('spin');
      const coin = document.getElementById('coinDisplay');
      let count = 0;
      const iv = setInterval(() => {
        coin.textContent = count % 2 ? '👑' : '🍀';
        coin.style.transform = `rotateY(${count * 180}deg)`;
        if (++count > 12) {
          clearInterval(iv);
          const result = Math.random() < 0.5 ? 'heads' : 'tails';
          coin.textContent = result === 'heads' ? '👑' : '🍀';
          coin.style.transform = 'rotateY(0deg)';
          const won = state.choice === result;
          const win = state.bet * 2;
          const res = document.getElementById('coinResult');
          res.textContent = won ? `🎉 ${result === 'heads' ? '正面' : '反面'}！中了！赢 ${win}` : `${result === 'heads' ? '正面' : '反面'}，输 ${state.bet}`;
          res.className = won ? 'message msg-win' : 'message msg-lose';
          state.choice = null;
          state.flipping = false;
          BaseGame.clearSelection('coinflip');
          document.getElementById('cfFlipBtn').disabled = false;
          BaseGame.settle('coinflip', state, won, win);
        }
      }, 80);
    }
  };
})();
