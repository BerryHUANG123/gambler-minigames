// ========== 百家乐 🃏 (Baccarat) ==========
(function() {
  let state = { bet: 0, choice: null, playerCards: [], bankerCards: [], gameOver: false };
  function cardPoint(c) { if (c>=10) return 0; return c; }
  function handPoint(cards) { return cards.reduce((s,c)=>s+cardPoint(c),0) % 10; }
  function drawCard() { return Engine.randomInt(0,13); }
  const SUIT = ['♠','♥','♦','♣'];
  function cardHTML(c, hidden) { if (hidden) return '<div class="card card-back"></div>'; const v = c===0?'A':c===10?'10':c===11?'J':c===12?'Q':c===13?'K':c; const s=SUIT[Engine.randomInt(0,3)]; const clr=(s==='♥'||s==='♦')?'card-red':'card-black'; return `<div class="card ${clr}"><span class="card-value">${v}</span><span class="card-suit">${s}</span></div>`; }
  const html = `<div class="game-page" id="page-baccarat"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🃏 百家乐</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div style="font-size:0.75rem;color:#888;">庄家</div><div class="hand" id="bacBanker"></div><div id="bacBankerPts" style="font-size:0.9rem;color:#aaa;"></div><div style="font-size:1.5rem;margin:4px;">VS</div><div style="font-size:0.75rem;color:#888;">闲家</div><div class="hand" id="bacPlayer"></div><div id="bacPlayerPts" style="font-size:0.9rem;color:#aaa;"></div><div id="bacResult" class="message"></div></div><div class="bet-options"><button class="bet-btn" data-choice="player" onclick="Bac.select('player')">闲家 x2</button><button class="bet-btn" data-choice="banker" onclick="Bac.select('banker')">庄家 x1.95</button><button class="bet-btn" data-choice="tie" onclick="Bac.select('tie')">和 x8</button></div><div class="chips"><div class="chip chip-100" onclick="Bac.bet(100)">100</div><div class="chip chip-500" onclick="Bac.bet(500)">500</div><div class="chip chip-1000" onclick="Bac.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="bacBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="bacDealBtn" onclick="Bac.deal()">发牌！</button></div></div>`;
  document.addEventListener('DOMContentLoaded', () => { document.getElementById('gamePages').insertAdjacentHTML('beforeend', html); });
  window.Bac = {
    select(c) { state.choice=c; document.querySelectorAll('#page-baccarat .bet-btn').forEach(b=>b.classList.remove('selected')); document.querySelector(`#page-baccarat [data-choice="${c}"]`).classList.add('selected'); Engine.play('click'); },
    bet(a) { if (!Engine.canBet(a)) return; state.bet+=a; Engine.state.balance-=a; Engine.save(); Engine.updateBalanceUI(); document.getElementById('bacBet').textContent=state.bet; Engine.play('click'); },
    deal() {
      if (state.bet<=0||!state.choice) return;
      state.playerCards=[drawCard(),drawCard()]; state.bankerCards=[drawCard(),drawCard()]; state.gameOver=false;
      document.getElementById('bacDealBtn').disabled=true; Engine.play('deal');
      let p=handPoint(state.playerCards), b=handPoint(state.bankerCards);
      // 补牌规则简化版
      if (p<=5) { state.playerCards.push(drawCard()); p=handPoint(state.playerCards); }
      if (b<=5) { state.bankerCards.push(drawCard()); b=handPoint(state.bankerCards); }
      Bac.showCards();
      setTimeout(() => {
        const winner = p>b?'player':b>p?'banker':'tie';
        const won = state.choice===winner;
        const mult = state.choice==='tie'?8:state.choice==='banker'?1.95:2;
        const res = document.getElementById('bacResult');
        if (won) { const win=Math.floor(state.bet*mult); Engine.addBalance(win); res.textContent=`🎉 闲${p}:庄${b}，赢了！赢 ${win}！`; res.className='message msg-win'; Engine.play('win'); }
        else { res.textContent=`闲${p}:庄${b}，输 ${state.bet}`; res.className='message msg-lose'; Engine.play('lose'); }
        state.bet=0; document.getElementById('bacBet').textContent='0'; document.getElementById('bacDealBtn').disabled=false; Engine.updateBalanceUI();
      }, 500);
    },
    showCards() { document.getElementById('bacPlayer').innerHTML=state.playerCards.map(c=>cardHTML(c)).join(''); document.getElementById('bacBanker').innerHTML=state.bankerCards.map(c=>cardHTML(c)).join(''); document.getElementById('bacPlayerPts').textContent=`点数：${handPoint(state.playerCards)}`; document.getElementById('bacBankerPts').textContent=`点数：${handPoint(state.bankerCards)}`; }
  };
})();