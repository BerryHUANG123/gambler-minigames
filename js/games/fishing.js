// ========== 钓鱼 🎣 (Fishing) ==========
(function() {
  let state={bet:0,casts:0,caught:[],fishing:false,gameOver:false};
  const FISH=[{name:'🐟 小鱼',mult:1.5,prob:40},{name:'🐠 中鱼',mult:3,prob:30},{name:'🐡 大鱼',mult:5,prob:20},{name:'🐋 稀有鱼',mult:10,prob:10}];
  function rollFish(){const r=Engine.randomInt(1,100);let cum=0;for(const f of FISH){cum+=f.prob;if(r<=cum)return f;}return FISH[0];}
  BaseGame.init('fishing', '🎣', '钓鱼', {
    tableHTML: `<div id="fishDisplay" style="font-size:4rem;margin:8px 0;">🌊</div><div id="fishStatus" style="font-size:0.9rem;color:#888;">下注后可以钓3次！</div><div id="fishCaught" style="font-size:0.85rem;color:#aaa;"></div><div id="fishResult" class="message"></div>`,
    controlsHTML: `<button class="btn btn-primary" id="fsCastBtn" onclick="FS.cast()">🎣 钓鱼！</button><button class="btn" onclick="FS.collect()">💰 收鱼卖钱</button>`
  });
  BaseGame.betHandler('fishing', state);
  const _fb=window.fishingBet;
  window.fishingBet=function(a){if(state.gameOver||state.fishing)return;_fb(a);};
  window.FS={
    bet: window.fishingBet,
    cast(){
      if(state.fishing||state.bet<=0||state.casts>=3)return;
      state.fishing=true;document.getElementById('fsCastBtn').disabled=true;
      document.getElementById('fishDisplay').textContent='🎣...';Engine.play('spin');
      setTimeout(()=>{const fish=rollFish();state.caught.push(fish);state.casts++;const el=document.getElementById('fishDisplay');el.textContent=fish.name.split(' ')[0];document.getElementById('fishStatus').textContent=`钓到${fish.name}！已钓${state.casts}/3次`;document.getElementById('fishCaught').textContent=state.caught.map(f=>f.name.split(' ')[0]).join(' ');state.fishing=false;document.getElementById('fsCastBtn').disabled=state.casts>=3;Engine.play('click');},800+Engine.randomInt(0,1000));
    },
    collect(){
      if(state.caught.length===0)return;
      const total=state.caught.reduce((s,f)=>s+f.mult,0);const win=Math.floor(state.bet*total);
      BaseGame.settle('fishing', state, true, win);
      const res=document.getElementById('fishResult');
      res.textContent=`🎉 卖了所有鱼！赢 ${win} 筹码！`;res.className='message msg-win';Engine.showQuote('win');
      state.casts=0;state.caught=[];document.getElementById('fishDisplay').textContent='🌊';document.getElementById('fishStatus').textContent='新的一轮！';document.getElementById('fsCastBtn').disabled=false;
    }
  };
})();
