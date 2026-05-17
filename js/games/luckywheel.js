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

  BaseGame.init('luckywheel', '🍀', '幸运转盘', {
    tableHTML: '<div id="wheelWrap" style="position:relative;width:180px;height:180px;margin:10px auto;"><div id="wheelPointer" style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:1.8rem;z-index:2;">⬇️</div><canvas id="wheelCanvas" width="180" height="180" style="border-radius:50%;border:4px solid var(--gold);"></canvas></div><div id="wheelResult" style="font-size:1.5rem;font-weight:bold;min-height:40px;color:var(--gold);">?</div><div id="luckywheelResult" class="message"></div>',
    controlsHTML: '<button class="btn btn-primary" id="luckywheelSpinBtn" onclick="LuckyWheel.spin()">转！</button>'
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

  BaseGame.betHandler('luckywheel', state);
  drawWheel();

  window.LuckyWheel = {
    spin() {
      if (state.spinning || state.bet <= 0) return;
      state.spinning = true;
      document.getElementById('luckywheelSpinBtn').disabled = true;
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
            const res = document.getElementById('luckywheelResult');
            const val = document.getElementById('wheelResult');
            val.textContent = seg.label;

            if (seg.mult > 0) {
              const win = Math.floor(state.bet * seg.mult);
              res.textContent = seg.mult >= 5 ? `🎉🎉 头奖！赢 ${win}！` : `中了！赢 ${win}`;
              res.className = 'message msg-win';
              Engine.showQuote(seg.mult >= 5 ? 'jackpot' : 'win');
              BaseGame.settle('luckywheel', state, true, win);
            } else {
              res.textContent = `💀 没中，输 ${state.bet}`;
              res.className = 'message msg-lose';
              BaseGame.settle('luckywheel', state, false, 0);
            }

            state.spinning = false;
            document.getElementById('luckywheelSpinBtn').disabled = false;
          }, 500);
        }
      }, 50);
    }
  };
})();
