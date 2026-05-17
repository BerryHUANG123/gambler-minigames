// ========== 踩地雷 💣 (Minefield) ==========
(function() {
  let state={bet:0,grid:[],size:6,mines:4,safe:0,gameOver:false,cashedOut:false};
  const ns='minefield';
  function initGrid(){const g=Array(state.size*state.size).fill('safe');const m=new Set();while(m.size<state.mines){m.add(Engine.randomInt(0,state.size*state.size-1));}m.forEach(i=>g[i]='mine');return g;}
  BaseGame.init(ns, '💣', '踩地雷', {
    tableHTML: '<div id="mfGrid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;max-width:280px;margin:8px auto;"></div><div id="mfInfo" style="font-size:0.8rem;color:#888;">安全翻开格子，别踩雷！</div><div id="mfResult" class="message"></div>',
    controlsHTML: '<button class="btn" id="mfCashout" onclick="MF.cashout()" disabled>💰 收手</button><button class="btn" onclick="MF.newGame()">新一局</button>'
  });
  window.MF={
    bet: BaseGame.betHandler(ns, state),
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
      if(state.grid[i]==='mine'){state.gameOver=true;MF.render();const res=document.getElementById('mfResult');res.textContent=`💥 踩雷了！输 ${state.bet}`;res.className='message msg-lose';BaseGame.settle(ns,state,false,0);return;}
      state.grid[i]='revealed';state.safe++;MF.render();Engine.play('click');
      const totalSafe=state.size*state.size-state.mines;
      document.getElementById('mfCashout').disabled=false;
      if(state.safe>=totalSafe){MF.win();return;}
    },
    cashout(){if(state.gameOver||state.cashedOut||state.bet<=0)return;state.cashedOut=true;const win=Math.floor(state.bet*(1+state.safe*0.3));document.getElementById('mfCashout').disabled=true;const res=document.getElementById('mfResult');res.textContent=`💰 安全收手！拿走 ${win} 筹码！`;res.className='message msg-win';BaseGame.settle(ns,state,true,win);MF.render();},
    win(){state.gameOver=true;const win=state.bet*3;const res=document.getElementById('mfResult');res.textContent=`🎉 全部安全！赢 ${win}！`;res.className='message msg-win';BaseGame.settle(ns,state,true,win);Engine.showQuote('win');MF.render();}
  };
})();
