// ========== 四子棋 🟡 (Connect 4) ==========
(function() {
  let state={bet:0,grid:[],turn:0,gameOver:false};const R=6,C=7;
  function initG(){return Array(R*C).fill(null);}
  function drop(g,col,p){for(let r=R-1;r>=0;r--){if(g[r*C+col]===null){g[r*C+col]=p;return r;}}return -1;}
  function checkWin(g,p){for(let r=0;r<R;r++)for(let c=0;c<C;c++){if(g[r*C+c]!==p)continue;
    const dirs=[[0,1],[1,0],[1,1],[1,-1]];for(const[dr,dc]of dirs){let cnt=1;for(let s=1;s<4;s++){const nr=r+dr*s,nc=c+dc*s;if(nr>=0&&nr<R&&nc>=0&&nc<C&&g[nr*C+nc]===p)cnt++;else break;}if(cnt>=4)return true;}}return false;}
  function aiMove(g){for(let c=0;c<C;c++){const test=[...g];if(drop(test,c,0)>=0&&checkWin(test,0))return c;}for(let c=0;c<C;c++){const test=[...g];if(drop(test,c,1)>=0&&checkWin(test,1))return c;}const cols=[];for(let c=0;c<C;c++){const test=[...g];if(drop(test,c,0)>=0)cols.push(c);}return cols.length?cols[Engine.randomInt(0,cols.length-1)]:3;}
  const html=`<div class="game-page" id="page-connect4"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🟡 四子棋</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="c4Grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;max-width:260px;margin:8px auto;"></div><div id="c4Info" style="font-size:0.9rem;color:#888;">点击列号落子</div><div id="c4Result" class="message"></div></div><div class="game-controls"><div id="c4Cols" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;max-width:260px;margin:4px auto;"></div></div><div class="chips"><div class="chip chip-100" onclick="C4.bet(100)">100</div><div class="chip chip-500" onclick="C4.bet(500)">500</div><div class="chip chip-1000" onclick="C4.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="c4Bet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="c4StartBtn" onclick="C4.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);
    document.getElementById('c4Cols').innerHTML=[0,1,2,3,4,5,6].map(c=>`<button class="btn btn-sm" onclick="C4.drop(${c})">${c+1}</button>`).join('');});
  window.C4={
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('c4Bet').textContent=state.bet;Engine.play('click');},
    start(){if(state.bet<=0)return;state.grid=initG();state.turn=0;state.gameOver=false;document.getElementById('c4StartBtn').disabled=true;document.getElementById('c4Result').textContent='';document.getElementById('c4Info').textContent='你先走！点击列号';C4.render();},
    render(){
      document.getElementById('c4Grid').innerHTML=state.grid.map(c=>`<div style="aspect-ratio:1;border-radius:50%;background:${c===null?'#1a1a2e':c===1?'#e74c3c':'#f1c40f'};border:2px solid #555;"></div>`).join('');
    },
    drop(col){
      if(state.gameOver||state.turn!==0)return;const r=drop(state.grid,col,1);if(r<0)return;
      Engine.play('click');C4.render();
      if(checkWin(state.grid,1)){C4.end(true);return;}
      state.turn=1;document.getElementById('c4Info').textContent='电脑思考中...';
      setTimeout(()=>{const c=aiMove(state.grid);drop(state.grid,c,0);Engine.play('click');C4.render();
        if(checkWin(state.grid,0)){C4.end(false);return;}state.turn=0;document.getElementById('c4Info').textContent='到你了！';},500);
    },
    end(won){state.gameOver=true;document.getElementById('c4StartBtn').disabled=false;const win=state.bet*(won?2:0);if(won)Engine.addBalance(win);
      document.getElementById('c4Result').textContent=won?`🎉 你赢了！赢${win}！`:`😢 电脑赢了，输${state.bet}`;document.getElementById('c4Result').className=won?'message msg-win':'message msg-lose';if(won){Engine.play('win');Engine.showQuote('win');}else Engine.play('lose');
      state.bet=0;document.getElementById('c4Bet').textContent='0';Engine.updateBalanceUI();}
  };
})();