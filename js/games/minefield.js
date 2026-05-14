// ========== 踩地雷 💣 (Minefield) ==========
(function() {
  let state={bet:0,grid:[],size:6,mines:4,safe:0,gameOver:false,cashedOut:false};
  function initGrid(){const g=Array(state.size*state.size).fill('safe');const m=new Set();while(m.size<state.mines){m.add(Engine.randomInt(0,state.size*state.size-1));}m.forEach(i=>g[i]='mine');return g;}
  const html=`<div class="game-page" id="page-minefield"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>💣 踩地雷</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="mfGrid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;max-width:280px;margin:8px auto;"></div><div id="mfInfo" style="font-size:0.8rem;color:#888;">安全翻开格子，别踩雷！</div><div id="mfResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="MF.bet(100)">100</div><div class="chip chip-500" onclick="MF.bet(500)">500</div><div class="chip chip-1000" onclick="MF.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="mfBet">0</span></div><div class="game-controls"><button class="btn" id="mfCashout" onclick="MF.cashout()" disabled>💰 收手</button><button class="btn" onclick="MF.newGame()">新一局</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.MF={
    bet(a){if(state.gameOver||state.cashedOut)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('mfBet').textContent=state.bet;Engine.play('click');if(state.bet>0)MF.newGame();},
    newGame(){state.grid=initGrid();state.safe=0;state.gameOver=false;state.cashedOut=false;document.getElementById('mfCashout').disabled=true;document.getElementById('mfResult').textContent='';document.getElementById('mfResult').className='message';MF.render();},
    render(){
      const totalSafe=state.size*state.size-state.mines;
      document.getElementById('mfGrid').innerHTML=state.grid.map((t,i)=>{
        if(state.gameOver||state.cashedOut){
          if(t==='mine')return`<div style="aspect-ratio:1;border-radius:6px;background:#8b0000;display:flex;align-items:center;justify-content:center;font-size:1.2rem;border:2px solid #ff0;">💥</div>`;
          if(t==='revealed')return`<div style="aspect-ratio:1;border-radius:6px;background:var(--table-green);display:flex;align-items:center;justify-content:center;font-size:1rem;border:1px solid #555;">✅</div>`;
          return`<div style="aspect-ratio:1;border-radius:6px;background:#333;display:flex;align-items:center;justify-content:center;font-size:0.8rem;border:1px solid #555;opacity:0.3;">❓</div>`;
        }
        return t==='revealed'
          ?`<div style="aspect-ratio:1;border-radius:6px;background:var(--table-green);display:flex;align-items:center;justify-content:center;font-size:1rem;border:1px solid #555;">✅</div>`
          :`<div onclick="MF.open(${i})" style="aspect-ratio:1;border-radius:6px;background:#444;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;border:2px solid #666;transition:0.2s;" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='#666'">❓</div>`;
      }).join('');
    },
    open(i){
      if(state.gameOver||state.cashedOut||state.bet<=0)return;
      if(state.grid[i]==='revealed')return;
      if(state.grid[i]==='mine'){state.gameOver=true;MF.render();const res=document.getElementById('mfResult');res.textContent=`💥 踩雷了！输 ${state.bet}`;res.className='message msg-lose';Engine.play('lose');state.bet=0;document.getElementById('mfBet').textContent='0';Engine.updateBalanceUI();return;}
      state.grid[i]='revealed';state.safe++;MF.render();Engine.play('click');
      const totalSafe=state.size*state.size-state.mines;
      document.getElementById('mfCashout').disabled=false;
      if(state.safe>=totalSafe){MF.win();return;}
    },
    cashout(){if(state.gameOver||state.cashedOut||state.bet<=0)return;state.cashedOut=true;const win=Math.floor(state.bet*(1+state.safe*0.3));Engine.addBalance(win);document.getElementById('mfCashout').disabled=true;const res=document.getElementById('mfResult');res.textContent=`💰 安全收手！拿走 ${win} 筹码！`;res.className='message msg-win';Engine.play('win');state.bet=0;document.getElementById('mfBet').textContent='0';Engine.updateBalanceUI();MF.render();},
    win(){state.gameOver=true;const win=state.bet*3;Engine.addBalance(win);const res=document.getElementById('mfResult');res.textContent=`🎉 全部安全！赢 ${win}！`;res.className='message msg-win';Engine.play('win');Engine.showQuote('win');state.bet=0;document.getElementById('mfBet').textContent='0';Engine.updateBalanceUI();MF.render();}
  };
})();