// ========== 抽鬼牌 🃏 (Old Maid) ==========
(function() { let state = { bet: 0, hand: [], compHand: [], deck: [], turn: 'player', gameOver: false };
  function newDeck() { let cards = []; for (let i=0;i<13;i++){cards.push(i,i)} cards.push('joker'); return Engine.shuffle(cards); }
  const SYM = ['🂡','🂢','🂣','🂤','🂥','🂦','🂧','🂨','🂩','🂪','🂫','🂭','🂮','🃏'];
  const html = `<div class="game-page" id="page-old-maid"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🃏 抽鬼牌</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div style="font-size:0.75rem;color:#888;">电脑（${13}张）</div><div class="hand" id="omCompHand"></div><hr style="width:80%;border-color:#333;margin:6px auto;"><div style="font-size:0.75rem;color:#888;">你</div><div class="hand" id="omPlayerHand"></div><div id="omResult" class="message"></div></div><div class="game-controls"><button class="btn btn-primary" id="omDrawBtn" onclick="OM.draw()">从电脑抽牌</button><button class="btn" id="omNewBtn" onclick="OM.newGame()">新一局</button></div><div class="chips"><div class="chip chip-100" onclick="OM.bet(100)">100</div><div class="chip chip-500" onclick="OM.bet(500)">500</div><div class="chip chip-1000" onclick="OM.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="omBet">0</span></div></div>`;
  document.addEventListener('DOMContentLoaded', () => { document.getElementById('gamePages').insertAdjacentHTML('beforeend', html); });
  window.OM = {
    bet(a) { if (state.gameOver) return; if (!Engine.canBet(a)) return; state.bet += a; Engine.state.balance -= a; Engine.save(); Engine.updateBalanceUI(); document.getElementById('omBet').textContent = state.bet; Engine.play('click'); if (state.bet>0 && state.deck.length===0) OM.newGame(); },
    newGame() { state.deck = newDeck(); state.hand = state.deck.splice(0,6); state.compHand = state.deck.splice(0,6); state.turn = 'player'; state.gameOver = false; OM.render(); document.getElementById('omResult').textContent = '从电脑手里抽一张牌！'; document.getElementById('omResult').className = 'message msg-info'; document.getElementById('omDrawBtn').disabled = false; },
    render() {
      const drawable = []; state.compHand.forEach((c,i) => { if (c !== null) drawable.push(i); });
      document.getElementById('omCompHand').innerHTML = state.compHand.map(c => c !== null ? '<div class="card card-back"></div>' : '<div style="width:64px;"></div>').join('');
      document.getElementById('omPlayerHand').innerHTML = state.hand.map(c => { const s = SYM[c]||'🃏'; const clr = c==='joker'?'card-red':'card-black'; return `<div class="card ${clr}"><span style="font-size:0.8rem;">${s}</span></div>`; }).join('');
    },
    draw() {
      if (state.gameOver || state.turn !== 'player' || state.bet<=0) return;
      const drawable = []; state.compHand.forEach((c,i) => { if (c !== null) drawable.push(i); });
      const pick = drawable[Engine.randomInt(0, drawable.length-1)];
      const card = state.compHand[pick]; state.compHand[pick] = null; state.hand.push(card); Engine.play('click');
      // match pairs
      for (let i=0;i<state.hand.length;i++){for(let j=i+1;j<state.hand.length;j++){if(state.hand[i]===state.hand[j]&&state.hand[i]!=='joker'){state.hand.splice(j,1);state.hand.splice(i,1);i--;break;}}}
      if (state.hand.length===1 && state.hand[0]==='joker') { OM.endGame(false); return; }
      OM.render();
      if (state.compHand.every(c=>c===null)) { OM.endGame(true); return; }
      state.turn = 'comp'; document.getElementById('omResult').textContent = '电脑抽牌中...';
      setTimeout(() => { const pDraw = Engine.randomInt(0, state.hand.length-1); state.compHand.push(state.hand[pDraw]); state.hand.splice(pDraw,1);
        for (let i=0;i<state.compHand.length;i++){for(let j=i+1;j<state.compHand.length;j++){if(state.compHand[i]===state.compHand[j]&&state.compHand[i]!=='joker'){state.compHand.splice(j,1);state.compHand.splice(i,1);i--;break;}}}
        state.turn = 'player'; OM.render();
        if (state.compHand.length===1 && state.compHand[0]==='joker') { OM.endGame(true); return; }
        if (state.hand.length===1 && state.hand[0]==='joker') { OM.endGame(false); return; }
        document.getElementById('omResult').textContent = '到你了！从电脑抽牌！';
      }, 800);
    },
    endGame(playerWon) {
      state.gameOver = true; document.getElementById('omDrawBtn').disabled = true;
      const win = state.bet * (playerWon ? 2 : 0); if (playerWon) Engine.addBalance(win);
      const res = document.getElementById('omResult');
      if (playerWon) { res.textContent = `🎉 鬼牌在电脑手里！你赢了！赢 ${win} 筹码！`; res.className = 'message msg-win'; Engine.play('win'); Engine.showQuote('win'); }
      else { res.textContent = `😢 鬼牌在你手里！输 ${state.bet}`; res.className = 'message msg-lose'; Engine.play('lose'); }
      state.bet=0; document.getElementById('omBet').textContent='0'; Engine.updateBalanceUI();
    }
  };
})();