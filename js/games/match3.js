// ========== 三消 💎 (Match 3) ==========
(function() {
  let state={bet:0,grid:[],score:0,selected:null,playing:false,gameOver:false};const GEMS=['💎','🔮','⭐','🍀','🔥','👑'];const R=6,C=6;
  function initGrid(){const g=[];for(let i=0;i<R*C;i++)g.push(GEMS[Engine.randomInt(0,5)]);return g;}
  function findMatches(g){const m=new Set();for(let r=0;r<R;r++){for(let c=0;c<C-2;c++){const i=r*C+c;if(g[i]&&g[i]===g[i+1]&&g[i+1]===g[i+2]){m.add(i);m.add(i+1);m.add(i+2);}}}
    for(let r=0;r<R-2;r++){for(let c=0;c<C;c++){const i=r*C+c;if(g[i]&&g[i]===g[i+C]&&g[i+C]===g[i+2*C]){m.add(i);m.add(i+C);m.add(i+2*C);}}}return m;}
  function gravity(g){const ng=[];for(let c=0;c<C;c++){const col=[];for(let r=R-1;r>=0;r--){if(g[r*C+c])col.push(g[r*C+c]);}while(col.length<R){col.push(GEMS[Engine.randomInt(0,5)]);}for(let r=0;r<R;r++){ng[(R-1-r)*C+c]=col[r];}}return ng;}
  const html=`<div class="game-page" id="page-match3"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>💎 三消</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="m3Grid" style="display:grid;grid-template-columns:repeat(${C},1fr);gap:2px;max-width:260px;margin:8px auto;"></div><div style="font-size:0.9rem;">得分：<span id="m3Score" style="color:var(--gold);">0</span></div><div id="m3Result" class="message">交换相邻宝石消除！</div></div><div class="chips"><div class="chip chip-100" onclick="M3.bet(100)">100</div><div class="chip chip-500" onclick="M3.bet(500)">500</div><div class="chip chip-1000" onclick="M3.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="m3Bet">0</span></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.M3={
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('m3Bet').textContent=state.bet;Engine.play('click');if(state.bet>0&&state.grid.length===0)M3.start();},
    start(){state.grid=initGrid();state.score=0;state.selected=null;state.playing=true;state.gameOver=false;M3.render();document.getElementById('m3Score').textContent='0';},
    render(){
      document.getElementById('m3Grid').innerHTML=state.grid.map((g,i)=>`<div onclick="M3.click(${i})" style="aspect-ratio:1;border-radius:6px;background:${state.selected===i?'rgba(212,175,55,0.2)':'#1a1a2e'};display:flex;align-items:center;justify-content:center;font-size:1.3rem;cursor:pointer;border:2px solid ${state.selected===i?'var(--gold)':'#444'};transition:0.2s;">${g}</div>`).join('');
    },
    click(i){
      if(!state.playing||state.gameOver)return;
      if(state.selected===null){state.selected=i;M3.render();Engine.play('click');return;}
      if(state.selected===i){state.selected=null;M3.render();return;}
      const s=state.selected,r1=Math.floor(s/C),c1=s%C,r2=Math.floor(i/C),c2=i%C;
      if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1){state.selected=i;M3.render();return;}
      const g=[...state.grid];[g[s],g[i]]=[g[i],g[s]];const m=findMatches(g);
      if(m.size>0){state.grid=g;state.selected=null;M3.clearMatches();}
      else{state.selected=null;M3.render();}
    },
    clearMatches(){
      let m=findMatches(state.grid);
      while(m.size>0){state.score+=m.size*10;document.getElementById('m3Score').textContent=state.score;Engine.play('win');
        m.forEach(idx=>{state.grid[idx]=null;});
        state.grid=gravity(state.grid);M3.render();
        if(state.score>=200){state.gameOver=true;const win=Math.floor(state.bet*(1+state.score*0.02));Engine.addBalance(win);document.getElementById('m3Result').textContent=`🎉 ${state.score}分！赢 ${win}！`;document.getElementById('m3Result').className='message msg-win';Engine.play('win');Engine.showQuote('win');state.bet=0;document.getElementById('m3Bet').textContent='0';Engine.updateBalanceUI();return;}
        m=findMatches(state.grid);
      }
    }
  };
})();