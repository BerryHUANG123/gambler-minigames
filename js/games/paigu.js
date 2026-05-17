(function() {
  let state = { bet: 0, pCards: [], bCards: [], gameOver: false };
  function draw() { return Engine.randomInt(0,13); }
  function point(v) { return v>=10?0:v; }
  const SUIT=['🀄','🀅','🀆','🀇']; const V=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  function cHTML(v) { const s=SUIT[Math.floor(v/13)%4]; const val=V[v%13]; return `<div class="card card-black"><span class="card-value">${val}</span><span class="card-suit">${s}</span></div>`; }
  BaseGame.init('paigu', '🀄', '推牌九', {
    tableHTML: '<div style="font-size:0.75rem;color:#888;">庄家</div><div class="hand" id="pgBanker"></div><div style="font-size:0.75rem;color:#888;">玩家</div><div class="hand" id="pgPlayer"></div><div id="pgResult" class="message"></div>',
    controlsHTML: '<button class="btn btn-primary" id="pgDealBtn" onclick="PG.deal()">发牌！</button>'
  });
  BaseGame.betHandler('paigu', state);
  window.PG={
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
      if(won){const win=state.bet*2;res.textContent=`🎉 你${pp}点 > 庄${bp}点！赢 ${win}！`;res.className='message msg-win';Engine.showQuote('win');BaseGame.settle('paigu', state, true, win);}
      else{res.textContent=`你${pp}点 : 庄${bp}点，输 ${state.bet}`;res.className='message msg-lose';BaseGame.settle('paigu', state, false, 0);}
      document.getElementById('pgDealBtn').disabled=false;
    }
  };
})();
