// ========== 数字华容道 🧩 (Fifteen Puzzle) ==========
(function() {
  let state={bet:0,grid:[],moves:0,gameOver:false,started:false};
  function initGrid(){let g=[];for(let i=1;i<16;i++)g.push(i);g.push(0);return g;}
  function shuffle(g){for(let i=g.length-1;i>0;i--){const j=Engine.randomInt(0,i);[g[i],g[j]]=[g[j],g[i]];}return g;}
  function isSolved(g){for(let i=0;i<15;i++){if(g[i]!==i+1)return false;}return g[15]===0;}
  const html=`<div class="game-page" id="page-fifteen"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🧩 数字华容道</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="ftGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:3px;max-width:220px;margin:8px auto;"></div><div style="font-size:0.9rem;">步数：<span id="ftMoves" style="color:var(--gold);">0</span></div><div id="ftResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="FT.bet(100)">100</div><div class="chip chip-500" onclick="FT.bet(500)">500</div><div class="chip chip-1000" onclick="FT.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="ftBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="ftStartBtn" onclick="FT.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.FT={
    bet(a){if(state.started)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('ftBet').textContent=state.bet;Engine.play('click');},
    start(){if(state.bet<=0)return;state.grid=shuffle(initGrid());state.moves=0;state.gameOver=false;state.started=true;document.getElementById('ftStartBtn').disabled=true;document.getElementById('ftMoves').textContent='0';FT.render();},
    render(){
      document.getElementById('ftGrid').innerHTML=state.grid.map((v,i)=>v?`<div onclick="FT.move(${i})" style="aspect-ratio:1;border-radius:8px;background:linear-gradient(135deg,#2c2c3e,#1a1a2e);display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:bold;color:var(--gold);cursor:pointer;border:2px solid #555;transition:0.15s;">${v}</div>`:`<div style="aspect-ratio:1;border-radius:8px;"></div>`).join('');
    },
    move(i){
      if(state.gameOver||!state.started)return;
      const zi=state.grid.indexOf(0);const r1=Math.floor(i/4),c1=i%4,r2=Math.floor(zi/4),c2=zi%4;
      if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1)return;
      [state.grid[i],state.grid[zi]]=[state.grid[zi],state.grid[i]];state.moves++;document.getElementById('ftMoves').textContent=state.moves;Engine.play('click');FT.render();
      if(isSolved(state.grid)){state.gameOver=true;state.started=false;const bonus=Math.max(1,50-state.moves);const win=state.bet*bonus;Engine.addBalance(win);document.getElementById('ftResult').textContent=`🎉 ${state.moves}步拼好！赢 ${win}！`;document.getElementById('ftResult').className='message msg-win';Engine.play('win');Engine.showQuote('win');state.bet=0;document.getElementById('ftBet').textContent='0';document.getElementById('ftStartBtn').disabled=false;Engine.updateBalanceUI();}
    }
  };
})();