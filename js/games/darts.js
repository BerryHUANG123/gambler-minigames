// ========== 飞镖 🎯 (Darts) ==========
(function() {
  let state = { bet: 0, throws: 0, total: 0, playing: false };
  const html = `<div class="game-page" id="page-darts"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🎯 飞镖</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="dartsBoard" style="position:relative;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,#e74c3c 30%,#fff 30%,#fff 55%,#e74c3c 55%,#e74c3c 70%,#000 70%);margin:8px auto;border:4px solid var(--gold);"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:2rem;color:var(--gold);text-shadow:0 0 10px rgba(212,175,55,0.5);">🎯</div></div><div id="dartsScore" style="font-size:1.2rem;color:var(--gold);min-height:30px;">投3支镖！</div><div id="dartsResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="Darts.bet(100)">100</div><div class="chip chip-500" onclick="Darts.bet(500)">500</div><div class="chip chip-1000" onclick="Darts.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="dartsBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="dartsThrowBtn" onclick="Darts.throwDart()">🎯 投镖！</button></div></div>`;
  document.addEventListener('DOMContentLoaded', () => { document.getElementById('gamePages').insertAdjacentHTML('beforeend', html); });
  window.Darts = {
    bet(a) { if (state.playing) return; if (!Engine.canBet(a)) return; state.bet += a; Engine.state.balance -= a; Engine.save(); Engine.updateBalanceUI(); document.getElementById('dartsBet').textContent = state.bet; Engine.play('click'); },
    throwDart() {
      if (state.playing || state.bet <= 0) return;
      state.playing = true; state.throws = 0; state.total = 0;
      document.getElementById('dartsThrowBtn').disabled = true;
      Darts.throwOne();
    },
    throwOne() {
      const score = [0,0,0,0,0,1,1,1,1,2,2,2,3,3,3,4,4,5,5,6,7,8,9,10][Engine.randomInt(0,23)];
      state.total += score; state.throws++;
      const board = document.getElementById('dartsBoard');
      const angle = Math.random() * 2 * Math.PI;
      const dist = Math.sqrt(Math.random()) * 80;
      const x = 100 + Math.cos(angle) * dist - 12;
      const y = 100 + Math.sin(angle) * dist - 12;
      const dart = document.createElement('div');
      dart.textContent = '📍'; dart.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:1.2rem;transform:rotate(${angle}rad);`;
      board.appendChild(dart);
      document.getElementById('dartsScore').textContent = `第${state.throws}镖：${score}环 总分：${state.total}`;
      Engine.play('click');
      if (state.throws >= 3) {
        setTimeout(() => Darts.end(), 500);
      } else {
        setTimeout(() => Darts.throwOne(), 1000);
      }
    },
    end() {
      state.playing = false;
      const mult = state.total >= 25 ? 5 : state.total >= 20 ? 4 : state.total >= 15 ? 3 : state.total >= 10 ? 2 : 1;
      const win = Math.floor(state.bet * mult);
      Engine.addBalance(win);
      const res = document.getElementById('dartsResult');
      if (mult >= 3) { res.textContent = `🎉 ${state.total}环！赢 ${win} 筹码！`; res.className = 'message msg-win'; Engine.play('win'); Engine.showQuote('win'); }
      else { res.textContent = `${state.total}环，得 ${win} 筹码`; res.className = mult > 1 ? 'message msg-win' : 'message msg-info'; Engine.play('click'); }
      state.bet = 0; document.getElementById('dartsBet').textContent = '0'; document.getElementById('dartsThrowBtn').disabled = false; Engine.updateBalanceUI();
      setTimeout(() => { document.getElementById('dartsBoard').querySelectorAll('div:not(:first-child)').forEach(e => e.remove()); document.getElementById('dartsScore').textContent = '投3支镖！'; }, 2000);
    }
  };
})();