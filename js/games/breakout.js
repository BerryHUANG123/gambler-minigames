// ========== 打砖块 🧱 (Breakout) ==========
(function() {
  let state={bet:0,score:0,lives:3,playing:false,timer:null,ball:{x:150,y:180,dx:3,dy:-3},paddle:120,gameOver:false,bricks:[]};
  const BW=46,BH=16,COLS=6,ROWS=4,PW=80;
  function initBricks(){const b=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)b.push({x:c*BW+2,y:r*BH+4,alive:true});return b;}
  const html=`<div class="game-page" id="page-breakout"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🧱 打砖块</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="brCanvas" style="position:relative;width:280px;height:200px;background:#0a0a1e;border-radius:8px;margin:8px auto;overflow:hidden;border:2px solid #444;"><div id="brPaddle" style="position:absolute;bottom:8px;width:${PW}px;height:8px;background:var(--gold);border-radius:4px;left:100px;"></div><div id="brBall" style="position:absolute;width:10px;height:10px;background:#fff;border-radius:50%;left:150px;top:170px;"></div></div><div style="display:flex;justify-content:space-around;width:100%;"><span>得分：<span id="brScore" style="color:var(--gold);">0</span></span><span>命：<span id="brLives" style="color:#e74c3c;">3</span></span></div><div id="brResult" class="message"></div></div><div class="game-controls"><button class="btn btn-sm" onclick="BR.movePaddle(-15)">←</button><button class="btn btn-sm" onclick="BR.movePaddle(15)">→</button></div><div class="chips"><div class="chip chip-100" onclick="BR.bet(100)">100</div><div class="chip chip-500" onclick="BR.bet(500)">500</div><div class="chip chip-1000" onclick="BR.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="brBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="brStartBtn" onclick="BR.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.BR={
    bet(a){if(state.playing||state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('brBet').textContent=state.bet;Engine.play('click');},
    movePaddle(d){if(!state.playing)return;state.paddle=Math.max(0,Math.min(280-PW,state.paddle+d));document.getElementById('brPaddle').style.left=state.paddle+'px';},
    start(){if(state.bet<=0)return;state.bricks=initBricks();state.ball={x:150,y:180,dx:3,dy:-3};state.paddle=100;state.score=0;state.lives=3;state.playing=true;state.gameOver=false;document.getElementById('brStartBtn').disabled=true;document.getElementById('brScore').textContent='0';document.getElementById('brLives').textContent='3';BR.render();state.timer=setInterval(()=>BR.tick(),30);document.addEventListener('keydown',BR.keyHandler);},
    tick(){
      const b=state.ball;b.x+=b.dx;b.y+=b.dy;
      if(b.x<=0||b.x>=280)b.dx=-b.dx;if(b.y<=0)b.dy=-b.dy;
      if(b.y>=200){state.lives--;document.getElementById('brLives').textContent=state.lives;Engine.play('lose');if(state.lives<=0){BR.end(false);return;}b.x=150;b.y=180;b.dx=3;b.dy=-3;}
      if(b.y>=190&&b.y<200&&b.x>state.paddle&&b.x<state.paddle+PW)b.dy=-b.dy;
      BR.renderBricks();
      if(state.bricks.every(b=>!b.alive)){BR.end(true);return;}
    },
    renderBricks(){const cv=document.getElementById('brCanvas');cv.querySelectorAll('.brick').forEach(e=>e.remove());state.bricks.forEach(br=>{if(br.alive){const el=document.createElement('div');el.className='brick';el.style.cssText=`position:absolute;left:${br.x}px;top:${br.y}px;width:${BW-2}px;height:${BH-2}px;background:#3498db;border-radius:3px;`;cv.appendChild(el);const bx=state.ball.x,by=state.ball.y;if(bx>br.x&&bx<br.x+BW&&by>br.y&&by<br.y+BH){br.alive=false;state.ball.dy=-state.ball.dy;state.score+=10;document.getElementById('brScore').textContent=state.score;Engine.play('click');}}});document.getElementById('brBall').style.left=state.ball.x+'px';document.getElementById('brBall').style.top=state.ball.y+'px';},
    render(){},
    keyHandler(e){if(e.key==='ArrowLeft')BR.movePaddle(-15);if(e.key==='ArrowRight')BR.movePaddle(15);},
    end(won){state.playing=false;clearInterval(state.timer);document.removeEventListener('keydown',BR.keyHandler);
      const res=document.getElementById('brResult');
      if(won){const win=state.bet*3;Engine.addBalance(win);res.textContent=`🎉 全部打碎！得分${state.score}，赢 ${win}！`;res.className='message msg-win';Engine.play('win');Engine.showQuote('win');}
      else{const win=Math.floor(state.bet*(1+state.score*0.02));if(win>state.bet)Engine.addBalance(win);res.textContent=win>state.bet?`得分${state.score}，得${win}`:`游戏结束，输${state.bet}`;res.className=win>state.bet?'message msg-win':'message msg-lose';}
      state.bet=0;document.getElementById('brBet').textContent='0';document.getElementById('brStartBtn').disabled=false;Engine.updateBalanceUI();}
  };
})();