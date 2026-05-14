// ========== 拼图 🧩 (Jigsaw) ==========
(function() {
  let state={bet:0,grid:[],empty:8,moves:0,gameOver:false,started:false};
  function initGrid(){let g=[];for(let i=1;i<9;i++)g.push(i);g.push(0);return g;}
  function shuffle(g){for(let i=g.length-1;i>0;i--){const j=Engine.randomInt(0,i);[g[i],g[j]]=[g[j],g[i]];}return g;}
  function isSolved(g){for(let i=0;i<8;i++){if(g[i]!==i+1)return false;}return g[8]===0;}
  const html=`<div class="game-page" id="page-jigsaw"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🧩 拼图</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="jgGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;max-width:200px;margin:12px auto;"></div><div style="font-size:0.9rem;">步数：<span id="jgMoves" style="color:var(--gold);">0</span></div><div id="jgResult" class="message">拼回1-8顺序！</div></div><div class="chips"><div class="chip chip-100" onclick="JG.bet(100)">100</div><div class="chip chip-500" onclick="JG.bet(500)">500</div><div class="chip chip-1000" onclick="JG.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="jgBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="jgStartBtn" onclick="JG.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.JG={
    bet(a){if(state.started)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('jgBet').textContent=state.bet;Engine.play('click');},
    start(){if(state.bet<=0)return;state.grid=shuffle(initGrid());state.empty=state.grid.indexOf(0);state.moves=0;state.gameOver=false;state.started=true;document.getElementById('jgStartBtn').disabled=true;document.getElementById('jgMoves').textContent='0';JG.render();},
    render(){
      document.getElementById('jgGrid').innerHTML=state.grid.map((v,i)=>{
        const emojis=['','🍎','🍊','🍋','🍇','🍒','🍑','🍓','🍌'];
        return v?`<div onclick="JG.move(${i})" style="aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,#2c2c3e,#1a1a2e);display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;border:2px solid #555;transition:0.15s;">${emojis[v]}</div>`:`<div style="aspect-ratio:1;border-radius:10px;"></div>`;
      }).join('');
    },
    move(i){
      if(state.gameOver||!state.started)return;
      const er=Math.floor(state.empty/3),ec=state.empty%3;
      const nr=Math.floor(i/3),nc=i%3;
      if(Math.abs(nr-er)+Math.abs(nc-ec)!==1)return;
      [state.grid[i],state.grid[state.empty]]=[state.grid[state.empty],state.grid[i]];
      state.empty=i;state.moves++;document.getElementById('jgMoves').textContent=state.moves;Engine.play('click');JG.render();
      if(isSolved(state.grid)){state.gameOver=true;state.started=false;const bonus=Math.max(1,30-state.moves);const win=state.bet*bonus;Engine.addBalance(win);document.getElementById('jgResult').textContent=`🎉 ${state.moves}步拼好！赢${win}！`;document.getElementById('jgResult').className='message msg-win';Engine.play('win');Engine.showQuote('win');state.bet=0;document.getElementById('jgBet').textContent='0';document.getElementById('jgStartBtn').disabled=false;Engine.updateBalanceUI();}
    }
  };
})();