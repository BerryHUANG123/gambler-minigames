// ========== 华容道 🧩 (Klotski) ==========
(function() {
  let state={bet:0,grid:[],moves:0,gameOver:false,started:false};
  // 0=空,1=兵,2=曹操(2x2左上角)
  function initGrid(){return[2,2,1,1,2,2,1,0,1,1,1,1,1,1,1,1];}
  function isSolved(g){return g[6]===2&&g[7]===2&&g[10]===2&&g[11]===2;}
  const SYM={0:' ',1:'⚔️',2:'👑'};
  const html=`<div class="game-page" id="page-klotski"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🧩 华容道</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="klGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:3px;max-width:220px;margin:8px auto;"></div><div style="font-size:0.9rem;">步数：<span id="klMoves" style="color:var(--gold);">0</span></div><div id="klResult" class="message">让曹操(👑)从下面逃出去！</div></div><div class="chips"><div class="chip chip-100" onclick="KL.bet(100)">100</div><div class="chip chip-500" onclick="KL.bet(500)">500</div><div class="chip chip-1000" onclick="KL.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="klBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="klStartBtn" onclick="KL.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.KL={
    bet(a){if(state.started)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('klBet').textContent=state.bet;Engine.play('click');},
    start(){if(state.bet<=0)return;state.grid=initGrid();state.moves=0;state.gameOver=false;state.started=true;document.getElementById('klStartBtn').disabled=true;document.getElementById('klMoves').textContent='0';KL.render();},
    render(){
      document.getElementById('klGrid').innerHTML=state.grid.map((v,i)=>{
        const isCao=v===2;const r=Math.floor(i/4),c=i%4;
        if(isCao){// 曹操2x2，只在左上角渲染
          if(c<3&&r<3&&state.grid[i+1]===2&&state.grid[i+4]===2&&state.grid[i+5]===2)
            return`<div onclick="KL.move(${i})" style="grid-column:${c+1}/${c+3};grid-row:${r+1}/${r+3};border-radius:10px;background:linear-gradient(135deg,#c0392b,#8b0000);display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;border:2px solid var(--gold);">👑</div>`;
          return'';}
        return v===1?`<div onclick="KL.move(${i})" style="aspect-ratio:1;border-radius:6px;background:#2c2c3e;display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer;border:1px solid #555;">⚔️</div>`:`<div style="aspect-ratio:1;"></div>`;
      }).filter((_,i)=>state.grid[i]!==2||(i%4<3&&Math.floor(i/4)<3&&state.grid[i+1]===2&&state.grid[i+4]===2&&state.grid[i+5]===2)).join('');
    },
    move(i){
      if(state.gameOver||!state.started)return;const v=state.grid[i];if(v===0)return;
      const r=Math.floor(i/4),c=i%4;const dirs=[[0,1],[0,-1],[1,0],[-1,0]];let moved=false;
      for(const[dr,dc]of dirs){
        const nr=r+dr,nc=c+dc;if(nr<0||nr>=4||nc<0||nc>=4)continue;
        const ni=nr*4+nc;if(state.grid[ni]===0){// 单格移动
          if(v===2){// 曹操2x2需要两个空格
            const r2=r+(dr||1),c2=c+(dc||1);
            if(r2>=0&&r2<4&&c2>=0&&c2<4&&state.grid[ni+dr*4+dc]===0){[state.grid[i],state.grid[ni],state.grid[i+(dr||1)*4+(dc||0)],state.grid[ni+(dr||1)*4+(dc||0)]]=[0,2,0,2];moved=true;break;}
          }else{[state.grid[i],state.grid[ni]]=[0,1];moved=true;break;}
        }
      }
      if(moved){state.moves++;document.getElementById('klMoves').textContent=state.moves;Engine.play('click');KL.render();
        if(isSolved(state.grid)){state.gameOver=true;state.started=false;const bonus=Math.max(1,30-state.moves);const win=state.bet*bonus;Engine.addBalance(win);document.getElementById('klResult').textContent=`🎉 曹操逃出去了！赢${win}！`;document.getElementById('klResult').className='message msg-win';Engine.play('win');state.bet=0;document.getElementById('klBet').textContent='0';document.getElementById('klStartBtn').disabled=false;Engine.updateBalanceUI();}}
    }
  };
})();