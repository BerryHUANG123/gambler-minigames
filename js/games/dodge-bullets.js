// ========== 躲子弹 💫 (Dodge Bullets) ==========
(function() {
  let state = { bet: 0, score: 0, playing: false, timer: null, spawnTimer: null, timeLeft: 15, bullets: [] };

  const html = `
  <div class="game-page" id="page-dodge">
    <div class="game-top">
      <button class="back-btn" onclick="Dodge.back()">← 大厅</button>
      <h2>💫 躲子弹</h2>
    </div>
    <div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div>
    <div class="game-table">
      <div id="dodgeArea" style="position:relative;width:100%;height:260px;background:rgba(0,0,0,0.3);border-radius:12px;overflow:hidden;cursor:pointer;" onclick="Dodge.movePlayer(event)">
        <div id="dodgePlayer" style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-size:2rem;transition:left 0.05s;">🧑</div>
      </div>
      <div style="display:flex;justify-content:space-between;width:100%;margin-top:6px;">
        <span>躲过：<span id="dodgeScore" style="color:var(--gold);">0</span></span>
        <span>时间：<span id="dodgeTime" style="color:var(--gold);">15</span>s</span>
      </div>
      <div id="dodgeResult" class="message"></div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="Dodge.bet(100)">100</div>
      <div class="chip chip-500" onclick="Dodge.bet(500)">500</div>
      <div class="chip chip-1000" onclick="Dodge.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="dodgeBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="dodgeStartBtn" onclick="Dodge.start()">开始！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
  });

  window.Dodge = {
    back() { Engine.backToHall(); },
    bet(amount) { if (state.playing) return; if (!Engine.canBet(amount)) return; state.bet += amount; Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI(); document.getElementById('dodgeBet').textContent = state.bet; Engine.play('click'); },
    movePlayer(e) {
      if (!state.playing) return;
      const area = document.getElementById('dodgeArea');
      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left - 20;
      const p = document.getElementById('dodgePlayer');
      p.style.left = Math.max(0, Math.min(rect.width - 40, x)) + 'px';
    },
    start() {
      if (state.playing || state.bet <= 0) return;
      state.playing = true; state.score = 0; state.timeLeft = 15; state.bullets = [];
      document.getElementById('dodgeStartBtn').disabled = true;
      document.getElementById('dodgeScore').textContent = '0';
      document.getElementById('dodgeTime').textContent = '15';
      document.getElementById('dodgeResult').textContent = '';

      state.timer = setInterval(() => {
        state.timeLeft--;
        document.getElementById('dodgeTime').textContent = state.timeLeft;
        if (state.timeLeft <= 0) Dodge.end(true);
      }, 1000);
      Dodge.spawnBullet();
      state.spawnTimer = setInterval(() => Dodge.spawnBullet(), 800);
    },
    spawnBullet() {
      if (!state.playing) return;
      const area = document.getElementById('dodgeArea');
      const speed = 2 + Math.floor((15 - state.timeLeft) / 3);
      const left = Engine.randomInt(10, area.clientWidth - 30);
      const bullet = document.createElement('div');
      bullet.textContent = ['💥','🔴','⚡','🔥'][Engine.randomInt(0,3)];
      bullet.style.cssText = `position:absolute;top:-30px;left:${left}px;font-size:1.5rem;transition:top ${speed}s linear;`;
      area.appendChild(bullet);
      state.bullets.push(bullet);
      setTimeout(() => { bullet.style.top = area.clientHeight + 'px'; }, 50);
      setTimeout(() => { if (bullet.parentNode) bullet.remove(); state.bullets = state.bullets.filter(b => b !== bullet); }, speed * 1000 + 100);
    },
    checkHit() {
      if (!state.playing) return;
      const area = document.getElementById('dodgeArea');
      const player = document.getElementById('dodgePlayer');
      const px = parseInt(player.style.left) || area.clientWidth / 2 - 20;
      const py = area.clientHeight - 50;
      state.bullets.forEach(b => {
        if (!b.parentNode) return;
        const bx = parseInt(b.style.left) || 0;
        const by = parseInt(b.style.top) || 0;
        if (by > py - 20 && by < py + 40 && Math.abs(bx - px) < 30) {
          Dodge.end(false);
        }
      });
    },
    end(won) {
      state.playing = false;
      clearInterval(state.timer); clearInterval(state.spawnTimer);
      document.getElementById('dodgeStartBtn').disabled = false;
      state.bullets.forEach(b => { if (b.parentNode) b.remove(); });
      state.bullets = [];
      const res = document.getElementById('dodgeResult');
      if (won) {
        const win = Math.floor(state.bet * (1 + state.score * 0.1));
        Engine.addBalance(win);
        res.textContent = `🎉 活下来了！躲过 ${state.score} 颗子弹！赢 ${win} 筹码！`;
        res.className = 'message msg-win';
        Engine.showQuote('win');
      } else {
        res.textContent = `💥 被击中了！输 ${state.bet}`;
        res.className = 'message msg-lose';
        Engine.play('lose');
      }
      state.bet = 0; document.getElementById('dodgeBet').textContent = '0';
      Engine.updateBalanceUI();
    }
  };
  // Hit detection loop
  setInterval(() => { if (state.playing) Dodge.checkHit(); }, 100);
})();