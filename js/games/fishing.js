// ========== 钓鱼 🎣 (Fishing) ==========
(function() {
  let state={bet:0,casts:0,caught:[],fishing:false,gameOver:false};
  const FISH=[{name:'🐟 小鱼',mult:1.5,prob:40},{name:'🐠 中鱼',mult:3,prob:30},{name:'🐡 大鱼',mult:5,prob:20},{name:'🐋 稀有鱼',mult:10,prob:10}];
  function rollFish(){const r=Engine.randomInt(1,100);let cum=0;for(const f of FISH){cum+=f.prob;if(r<=cum)return f;}return FISH[0];}
  const html=`<div class="game-page" id="page-fishing"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🎣 钓鱼</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="fishDisplay" style="font-size:4rem;margin:8px 0;">🌊</div><div id="fishStatus" style="font-size:0.9rem;color:#888;">下注后可以钓3次！</div><div id="fishCaught" style="font-size:0.85rem;color:#aaa;"></div><div id="fishResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="FS.bet(100)">100</div><div class="chip chip-500" onclick="FS.bet(500)">500</div><div class="chip chip-1000" onclick="FS.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="fsBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="fsCastBtn" onclick="FS.cast()">🎣 钓鱼！</button><button class="btn" onclick="FS.collect()">💰 收鱼卖钱</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.FS={
    bet(a){if(state.gameOver||state.fishing)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('fsBet').textContent=state.bet;Engine.play('click');},
    cast(){
      if(state.fishing||state.bet<=0||state.casts>=3)return;
      state.fishing=true;document.getElementById('fsCastBtn').disabled=true;
      document.getElementById('fishDisplay').textContent='🎣...';Engine.play('spin');
      setTimeout(()=>{const fish=rollFish();state.caught.push(fish);state.casts++;const el=document.getElementById('fishDisplay');el.textContent=fish.name.split(' ')[0];document.getElementById('fishStatus').textContent=`钓到${fish.name}！已钓${state.casts}/3次`;document.getElementById('fishCaught').textContent=state.caught.map(f=>f.name.split(' ')[0]).join(' ');state.fishing=false;document.getElementById('fsCastBtn').disabled=state.casts>=3;Engine.play('click');},800+Engine.randomInt(0,1000));
    },
    collect(){
      if(state.caught.length===0)return;
      const total=state.caught.reduce((s,f)=>s+f.mult,0);const win=Math.floor(state.bet*total);
      Engine.addBalance(win);const res=document.getElementById('fishResult');
      res.textContent=`🎉 卖了所有鱼！赢 ${win} 筹码！`;res.className='message msg-win';Engine.play('win');Engine.showQuote('win');
      state.bet=0;state.casts=0;state.caught=[];document.getElementById('fsBet').textContent='0';document.getElementById('fishCaught').textContent='';document.getElementById('fishDisplay').textContent='🌊';document.getElementById('fishStatus').textContent='新的一轮！';document.getElementById('fsCastBtn').disabled=false;Engine.updateBalanceUI();
    }
  };
})();