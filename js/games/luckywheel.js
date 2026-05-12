// ========== 幸运转盘 🍀 (Lucky Wheel) ==========

(function() {
  let state = { bet: 0, spinning: false };

  const SEGMENTS = [
    { label: '🍀 x1', mult: 1, color: '#e74c3c' },
    { label: '💀 x0', mult: 0, color: '#2c3e50' },
    { label: '💰 x2', mult: 2, color: '#e67e22' },
    { label: '🍀 x3', mult: 3, color: '#27ae60' },
    { label: '💀 x0', mult: 0, color: '#2c3e50' },
    { label: '👑 x5', mult: 5, color: '#8e44ad' },
    { label: '🍀 x1.5', mult: 1.5, color: '#2980b9' },
    { label: '💀 x0', mult: 0, color: '#2c3e50' },
    { label: '⭐ x4', mult: 4, color: '#f1c40f' },
    { label: '🍀 x2', mult: 2, color: '#d35400' },
    { label: '💀 x0', mult: 0, color: '#2c3e50' },
    { label: '🏆 x10', mult: 10, color: '#c0392b' },
  ];

  const html = `
  <div class="game-page" id="page-luckywheel">
    <div class="game-top">
      <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
      <h2>🍀 幸运转盘</h2>
    </div>
    <div class="top-bar">
      <div class="balance-display">💰 <span class="balance-val">0</span></div>
    </div>
    <div class="game-table">
      <div id="wheelWrap" style="position:relative;width:180px;height:180px;margin:10px auto;">
        <div id="wheelPointer" style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:1.8rem;z-index:2;">⬇️</div>
        <canvas id="wheelCanvas" width="180" height="180" style="border-radius:50%;border:4px solid var(--gold);"></canvas>
      </div>
      <div id="wheelResult" style="font-size:1.5rem;font-weight:bold;min-height:40px;color:var(--gold);">?</div>
      <div id="lwResult" class="message"></div>
    </div>
    <div class="chips">
      <div class="chip chip-100" onclick="LuckyWheel.bet(100)">100</div>
      <div class="chip chip-500" onclick="LuckyWheel.bet(500)">500</div>
      <div class="chip chip-1000" onclick="LuckyWheel.bet(1000)">1000</div>
    </div>
    <div class="current-bet">下注：<span id="lwBet">0</span></div>
    <div class="game-controls">
      <button class="btn btn-primary" id="lwSpinBtn" onclick="LuckyWheel.spin()">转！</button>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gamePages').insertAdjacentHTML('beforeend', html);
    drawWheel();
  });

  function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 90, cy = 90, r = 86;
    const angle = (2 * Math.PI) / SEGMENTS.length;

    SEGMENTS.forEach((seg, i) => {
      const startAngle = i * angle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + angle);
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + angle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(seg.label, r - 8, 4);
      ctx.restore();
    });
  }

  window.LuckyWheel = {
    bet(amount) {
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById('lwBet').textContent = state.bet; Engine.play('click');
    },

    spin() {
      if (state.spinning || state.bet <= 0) return;
      state.spinning = true;
      document.getElementById('lwSpinBtn').disabled = true;
      Engine.play('spin');

      const canvas = document.getElementById('wheelCanvas');
      const idx = Engine.randomInt(0, SEGMENTS.length - 1);
      const seg = SEGMENTS[idx];
      const spinAngle = 720 + (idx * (360 / SEGMENTS.length));
      let currentAngle = 0;
      let count = 0;

      const iv = setInterval(() => {
        currentAngle += 30 + count * 1.5;
        canvas.style.transform = `rotate(${currentAngle}deg)`;
        if (++count > 25) {
          clearInterval(iv);
          canvas.style.transform = `rotate(${spinAngle}deg)`;

          setTimeout(() => {
            const res = document.getElementById('lwResult');
            const val = document.getElementById('wheelResult');
            val.textContent = seg.label;

            if (seg.mult > 0) {
              const win = Math.floor(state.bet * seg.mult);
              Engine.addBalance(win);
              res.textContent = seg.mult >= 5 ? `🎉🎉 头奖！赢 ${win}！` : `中了！赢 ${win}`;
              res.className = 'message msg-win';
              Engine.play('win');
              Engine.showQuote(seg.mult >= 5 ? 'jackpot' : 'win');
            } else {
              res.textContent = `💀 没中，输 ${state.bet}`;
              res.className = 'message msg-lose';
              Engine.play('lose');
            }

            state.bet = 0; state.spinning = false;
            document.getElementById('lwSpinBtn').disabled = false;
            document.getElementById('lwBet').textContent = '0';
            Engine.updateBalanceUI();
          }, 500);
        }
      }, 50);
    }
  };
})();