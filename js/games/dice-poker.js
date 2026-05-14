// ========== 骰子梭哈 🎲 (Dice Poker) ==========
(function() {
  let state = { bet: 0, dice: [1,1,1,1,1], held: [false,false,false,false,false], rolls: 0, gameOver: false };
  const FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];
  function rankHand(vals) {
    const counts = {}; vals.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    const c = Object.values(counts).sort((a,b) => b-a);
    if (c[0] === 5) return { name:'豹子', mult:8 }; if (c[0] === 4) return { name:'四同', mult:5 };
    if (c[0] === 3 && c[1] === 2) return { name:'葫芦', mult:4 };
    const sorted = [...vals].sort((a,b) => a-b); const isStraight = sorted[4]-sorted[0]===4 && new Set(vals).size===5;
    if (isStraight) return { name:'顺子', mult:3 };
    if (c[0] === 3) return { name:'三同', mult:2.5 };
    if (c[0] === 2 && c[1] === 2) return { name:'两对', mult:2 };
    if (c[0] === 2) return { name:'一对', mult:1.5 };
    return { name:'散牌', mult:1 };
  }
  const html = `<div class="game-page" id="page-dice-poker"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🎲 骰子梭哈</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div class="hand" id="dpDice" style="gap:10px;"></div><div id="dpRank" style="font-size:1.1rem;color:var(--gold);min-height:30px;"></div><div id="dpResult" class="message">掷出好组合赢钱！</div></div><div class="game-controls"><button class="btn btn-primary" id="dpRollBtn" onclick="DP.roll()">🎲 掷骰子</button></div><div class="chips"><div class="chip chip-100" onclick="DP.bet(100)">100</div><div class="chip chip-500" onclick="DP.bet(500)">500</div><div class="chip chip-1000" onclick="DP.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="dpBet">0</span></div></div>`;
  document.addEventListener('DOMContentLoaded', () => { document.getElementById('gamePages').insertAdjacentHTML('beforeend', html); });
  window.DP = {
    bet(a) { if (state.gameOver) return; if (!Engine.canBet(a)) return; state.bet += a; Engine.state.balance -= a; Engine.save(); Engine.updateBalanceUI(); document.getElementById('dpBet').textContent = state.bet; Engine.play('click'); if (state.bet > 0 && state.rolls === 0) DP.init(); },
    init() { state.dice = [1,1,1,1,1]; state.held = [false,false,false,false,false]; state.rolls = 0; state.gameOver = false; DP.render(); },
    roll() {
      if (state.gameOver || state.bet <= 0) return;
      state.dice = state.dice.map((v, i) => state.held[i] ? v : Engine.randomInt(1, 6));
      state.rolls++;
      Engine.play('spin'); DP.render();
      const rank = rankHand(state.dice);
      document.getElementById('dpRank').textContent = `${rank.name} — ${rank.mult}x`;
      if (state.rolls >= 2) { state.gameOver = true; DP.end(rank); }
    },
    toggleHold(idx) { if (state.gameOver || state.rolls === 0) return; state.held[idx] = !state.held[idx]; DP.render(); },
    render() {
      document.getElementById('dpDice').innerHTML = state.dice.map((v, i) =>
        `<div class="die" onclick="DP.toggleHold(${i})" style="cursor:pointer;${state.held[i] ? 'border:3px solid var(--gold);' : ''}">${FACES[v-1]}${state.held[i] ? '<br><span style="font-size:0.5rem;color:var(--gold);">保留</span>' : ''}</div>`
      ).join('');
    },
    end(rank) {
      const win = Math.floor(state.bet * rank.mult);
      Engine.addBalance(win);
      const res = document.getElementById('dpResult');
      if (rank.mult >= 3) { res.textContent = `🎉 ${rank.name}！赢 ${win} 筹码！`; res.className = 'message msg-win'; Engine.play('win'); Engine.showQuote('win'); }
      else { res.textContent = `${rank.name}，得 ${win} 筹码`; res.className = rank.mult > 1 ? 'message msg-win' : 'message'; Engine.play('click'); }
      state.bet = 0; document.getElementById('dpBet').textContent = '0'; Engine.updateBalanceUI();
      setTimeout(() => { state.rolls = 0; document.getElementById('dpRank').textContent = ''; document.getElementById('dpDice').innerHTML = ''; }, 2000);
    }
  };
})();