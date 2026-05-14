// ========== 贪吃蛇 🐍 (Snake) ==========
(function() {
  let state={bet:0,snake:[{x:5,y:5}],food:{x:7,y:5},dir:{x:1,y:0},score:0,playing:false,timer:null,gameOver:false};
  const SIZE=15;function spawnFood(){let f;do{f={x:Engine.randomInt(0,SIZE-1),y:Engine.randomInt(0,SIZE-1)};}while(state.snake.some(s=>s.x===f.x&&s.y===f.y));state.food=f;}
  const html=`<div class="game-page" id="page-snake"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🐍 贪吃蛇</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="snGrid" style="display:grid;grid-template-columns:repeat(${SIZE},1fr);gap:1px;max-width:300px;margin:8px auto;background:#111;padding:2px;border-radius:4px;"></div><div style="font-size:0.9rem;">得分：<span id="snScore" style="color:var(--gold);">0</span></div><div id="snResult" class="message">方向键或按钮控制</div></div><div class="game-controls"><div style="display:grid;grid-template-columns:repeat(3,40px);gap:4px;margin:6px auto;"><button class="btn btn-sm" style="grid-column:2;" onclick="SN.setDir(0,-1)">↑</button><button class="btn btn-sm" onclick="SN.setDir(-1,0)">←</button><button class="btn btn-sm" onclick="SN.setDir(0,1)">↓</button><button class="btn btn-sm" onclick="SN.setDir(1,0)">→</button></div></div><div class="chips"><div class="chip chip-100" onclick="SN.bet(100)">100</div><div class="chip chip-500" onclick="SN.bet(500)">500</div><div class="chip chip-1000" onclick="SN.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="snBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="snStartBtn" onclick="SN.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.SN={
    bet(a){if(state.playing||state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('snBet').textContent=state.bet;Engine.play('click');},
    setDir(x,y){if((state.dir.x===0&&x!==0&&state.dir.y===0)||(state.dir.y===0&&y!==0&&state.dir.x===0)){state.dir={x,y};}},
    start(){if(state.bet<=0)return;state.playing=true;state.snake=[{x:5,y:5}];state.dir={x:1,y:0};state.score=0;state.gameOver=false;spawnFood();document.getElementById('snStartBtn').disabled=true;document.getElementById('snScore').textContent='0';document.addEventListener('keydown',SN.keyHandler);state.timer=setInterval(()=>SN.tick(),200);},
    tick(){
      const head={x:state.snake[0].x+state.dir.x,y:state.snake[0].y+state.dir.y};
      if(head.x<0||head.x>=SIZE||head.y<0||head.y>=SIZE||state.snake.some(s=>s.x===head.x&&s.y===head.y)){SN.end();return;}
      state.snake.unshift(head);
      if(head.x===state.food.x&&head.y===state.food.y){state.score+=10;document.getElementById('snScore').textContent=state.score;spawnFood();}
      else{state.snake.pop();}
      SN.render();
    },
    render(){
      const grid=Array(SIZE*SIZE).fill('');state.snake.forEach((s,i)=>{grid[s.y*SIZE+s.x]=i===0?'🐍':'🟢';});grid[state.food.y*SIZE+state.food.x]='🍎';
      document.getElementById('snGrid').innerHTML=grid.map(c=>`<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:${SIZE>12?'0.7rem':'0.9rem'};background:${c==='🐍'?'#2ecc71':c==='🟢'?'#27ae60':c==='🍎'?'#c0392b':'#1a1a2e'};border-radius:2px;">${c}</div>`).join('');
    },
    keyHandler(e){const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};if(m[e.key]){e.preventDefault();SN.setDir(m[e.key][0],m[e.key][1]);}},
    end(){state.playing=false;clearInterval(state.timer);document.removeEventListener('keydown',SN.keyHandler);const win=Math.floor(state.bet*(1+state.score*0.05));if(state.score>0){Engine.addBalance(win);}const res=document.getElementById('snResult');res.textContent=state.score>0?`🎉 ${state.score}分！赢 ${win}！`:`撞了，输${state.bet}`;res.className=state.score>0?'message msg-win':'message msg-lose';if(state.score>=50)Engine.showQuote('win');state.bet=0;document.getElementById('snBet').textContent='0';document.getElementById('snStartBtn').disabled=false;Engine.updateBalanceUI();}
  };
})();