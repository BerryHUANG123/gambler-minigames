// ========== 推牌九 🀄 (Pai Gow) ==========
(function() {
  let state = { bet: 0, pCards: [], bCards: [], gameOver: false };
  function draw() { return Engine.randomInt(0,13); }
  function point(v) { return v>=10?0:v; }
  const SUIT=['🀄','🀅','🀆','🀇']; const V=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  function cHTML(v) { const s=SUIT[Math.floor(v/13)%4]; const val=V[v%13]; return `<div class="card card-black"><span class="card-value">${val}</span><span class="card-suit">${s}</span></div>`; }
  const html=`<div class="game-page" id="page-paigu"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🀄 推牌九</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div style="font-size:0.75rem;color:#888;">庄家</div><div class="hand" id="pgBanker"></div><div style="font-size:0.75rem;color:#888;">玩家</div><div class="hand" id="pgPlayer"></div><div id="pgResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="PG.bet(100)">100</div><div class="chip chip-500" onclick="PG.bet(500)">500</div><div class="chip chip-1000" onclick="PG.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="pgBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="pgDealBtn" onclick="PG.deal()">发牌！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.PG={
    bet(a){if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('pgBet').textContent=state.bet;Engine.play('click');},
    deal(){
      if(state.bet<=0)return;
      state.pCards=[draw(),draw()];state.bCards=[draw(),draw()];state.gameOver=false;
      document.getElementById('pgDealBtn').disabled=true;
      document.getElementById('pgPlayer').innerHTML=state.pCards.map(c=>cHTML(c)).join('');
      document.getElementById('pgBanker').innerHTML=state.bCards.map(c=>cHTML(c)).join('');
      Engine.play('deal');
      const pp=(point(state.pCards[0])+point(state.pCards[1]))%10;
      const bp=(point(state.bCards[0])+point(state.bCards[1]))%10;
      const isPPair=state.pCards[0]%13===state.pCards[1]%13;
      const isBPair=state.bCards[0]%13===state.bCards[1]%13;
      const res=document.getElementById('pgResult');
      let won=false;
      if(isPPair&&!isBPair){won=true;}
      else if(!isPPair&&isBPair){won=false;}
      else if(isPPair&&isBPair){won=state.pCards[0]%13>state.bCards[0]%13;}
      else {won=pp>bp;}
      if(won){const win=state.bet*2;Engine.addBalance(win);res.textContent=`🎉 你${pp}点 > 庄${bp}点！赢 ${win}！`;res.className='message msg-win';Engine.play('win');Engine.showQuote('win');}
      else{res.textContent=`你${pp}点 : 庄${bp}点，输 ${state.bet}`;res.className='message msg-lose';Engine.play('lose');}
      state.bet=0;document.getElementById('pgBet').textContent='0';document.getElementById('pgDealBtn').disabled=false;Engine.updateBalanceUI();
    }
  };
})();