// ========== 找不同 🔍 (Find Difference) ==========
(function() {
  let state={bet:0,diffs:[],found:[],gameOver:false,startTime:0};
  const EMOJIS='🍎🍊🍋🍇🍒🍑🍓🍌🥝🍉';
  function newGame(){state.diffs=[];state.found=[];const set=new Set();while(set.size<5){set.add(Engine.randomInt(0,19));}state.diffs=[...set];}
  const html=`<div class="game-page" id="page-find-diff"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🔍 找不同</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div style="display:flex;gap:4px;"><div id="fdLeft" style="display:grid;grid-template-columns:repeat(5,1fr);gap:2px;flex:1;"></div><div id="fdRight" style="display:grid;grid-template-columns:repeat(5,1fr);gap:2px;flex:1;"></div></div><div id="fdInfo" style="font-size:0.8rem;color:#888;">找5处不同！点击不同的位置。</div><div id="fdResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="FD.bet(100)">100</div><div class="chip chip-500" onclick="FD.bet(500)">500</div><div class="chip chip-1000" onclick="FD.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="fdBet">0</span></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.FD={
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('fdBet').textContent=state.bet;Engine.play('click');if(state.bet>0)FD.start();},
    start(){newGame();state.startTime=Date.now();state.gameOver=false;FD.render();document.getElementById('fdInfo').textContent='找到5处不同！';},
    render(){
      const l=document.getElementById('fdLeft'),r=document.getElementById('fdRight');
      l.innerHTML='';r.innerHTML='';
      for(let i=0;i<20;i++){const e='😊';const isDiff=state.diffs.includes(i);const f=state.found.includes(i);
        l.innerHTML+=`<div onclick="FD.click(${i},'l')" style="${f?'border:2px solid var(--gold);':''}aspect-ratio:1;border-radius:4px;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;border:2px solid #444;">${EMOJIS[i%EMOJIS.length]}</div>`;
        r.innerHTML+=`<div onclick="FD.click(${i},'r')" style="${f?'border:2px solid var(--gold);':''}aspect-ratio:1;border-radius:4px;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;border:2px solid ${isDiff?'#e74c3c':'#444'};">${isDiff?EMOJIS[(i+3)%EMOJIS.length]:EMOJIS[i%EMOJIS.length]}</div>`;
      }
    },
    click(i){
      if(state.gameOver||state.bet<=0)return;
      if(state.diffs.includes(i)&&!state.found.includes(i)){state.found.push(i);Engine.play('click');FD.render();
        if(state.found.length>=5){const time=Math.floor((Date.now()-state.startTime)/1000);const bonus=Math.max(1,30-time);const win=state.bet*bonus;Engine.addBalance(win);document.getElementById('fdResult').textContent=`🎉 全找到！用时${time}秒，赢 ${win}！`;document.getElementById('fdResult').className='message msg-win';Engine.play('win');Engine.showQuote('win');state.gameOver=true;state.bet=0;document.getElementById('fdBet').textContent='0';Engine.updateBalanceUI();}
        document.getElementById('fdInfo').textContent=`找到 ${state.found.length}/5 处不同！`;}
    }
  };
})();