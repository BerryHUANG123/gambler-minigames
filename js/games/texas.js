// ========== 德州扑克 ♠️ (Texas Hold'em) ==========
(function() {
  let state={bet:0,pCards:[],bCards:[],gameOver:false};
  function draw(){const v=Engine.randomInt(0,12);const s=['♠','♥','♦','♣'][Engine.randomInt(0,3)];return[v,s];}
  const V=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  function cHTML(c){const[v,s]=c;const clr=(s==='♥'||s==='♦')?'card-red':'card-black';return '<div class="card '+clr+'"><span class="card-value">'+V[v]+'</span><span class="card-suit">'+s+'</span></div>';}
  function rankHand(cards){
    const vals=cards.map(c=>c[0]).sort((a,b)=>b-a);const counts={};vals.forEach(v=>{counts[v]=(counts[v]||0)+1;});
    const groups=Object.values(counts).sort((a,b)=>b-a);const isFlush=cards.every(c=>c[1]===cards[0][1]);
    const isStraight=vals[4]-vals[0]===4&&new Set(vals).size===5;
    if(isFlush&&isStraight&&vals[4]===12)return{name:'皇家同花顺',mult:50};
    if(isFlush&&isStraight)return{name:'同花顺',mult:30};
    if(groups[0]===4)return{name:'四条',mult:15};
    if(groups[0]===3&&groups[1]===2)return{name:'葫芦',mult:10};
    if(isFlush)return{name:'同花',mult:6};
    if(isStraight)return{name:'顺子',mult:5};
    if(groups[0]===3)return{name:'三条',mult:4};
    if(groups[0]===2&&groups[1]===2)return{name:'两对',mult:3};
    if(groups[0]===2)return{name:'一对',mult:2};
    return{name:'高牌',mult:1};
  }
  BaseGame.init('texas', '♠️', '德州扑克', {
    tableHTML: '<div style="font-size:0.75rem;color:#888;">庄家</div><div class="hand" id="txBanker"></div><div style="font-size:0.75rem;color:#888;">你</div><div class="hand" id="txPlayer"></div><div id="txRank" style="font-size:0.9rem;color:var(--gold);"></div><div id="txResult" class="message"></div>',
    controlsHTML: '<button class="btn btn-primary" id="txDealBtn" onclick="TX.deal()">发牌比大小！</button>'
  });
  BaseGame.betHandler('texas', state);
  window.TX={
    deal(){
      if(state.bet<=0)return;
      state.pCards=[draw(),draw(),draw(),draw(),draw()];state.bCards=[draw(),draw(),draw(),draw(),draw()];
      document.getElementById('txDealBtn').disabled=true;Engine.play('deal');
      document.getElementById('txPlayer').innerHTML=state.pCards.map(c=>cHTML(c)).join('');
      document.getElementById('txBanker').innerHTML=state.bCards.map(c=>cHTML(c)).join('');
      const pRank=rankHand(state.pCards),bRank=rankHand(state.bCards);
      document.getElementById('txRank').textContent='你：'+pRank.name+' vs 庄：'+bRank.name;
      const multMap={皇家同花顺:50,同花顺:30,四条:15,葫芦:10,同花:6,顺子:5,三条:4,两对:3,一对:2,高牌:1};
      const won=multMap[pRank.name]>=multMap[bRank.name];
      const res=document.getElementById('txResult');
      if(won){const win=state.bet*2;BaseGame.settle('texas',state,true,win);res.textContent='🎉 '+pRank.name+'赢了！赢 '+win+'！';res.className='message msg-win';if(pRank.mult>=5)Engine.showQuote('win');}
      else{BaseGame.settle('texas',state,false,0);res.textContent='庄家'+bRank.name+'大，输 '+state.bet;res.className='message msg-lose';}
      document.getElementById('txDealBtn').disabled=false;
    }
  };
})();
