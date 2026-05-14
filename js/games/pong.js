// ========== 乒乓球 🏓 (Pong) ==========
(function() {
  let state={bet:0,pScore:0,cScore:0,playing:false,timer:null,ball:{x:140,y:95,dx:3,dy:2},paddle:60,cPaddle:60,gameOver:false};
  const html=`<div class="game-page" id="page-pong"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🏓 乒乓球</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="poCanvas" style="position:relative;width:280px;height:190px;background:#0a0a1e;border-radius:8px;margin:8px auto;overflow:hidden;border:2px solid #444;"><div style="position:absolute;top:0;left:50%;height:100%;width:2px;background:#333;"></div><div id="poBall" style="position:absolute;width:8px;height:8px;background:#fff;border-radius:50%;left:140px;top:95px;"></div><div id="poPaddle" style="position:absolute;left:10px;top:75px;width:8px;height:40px;background:var(--gold);border-radius:4px;"></div><div id="poCPaddle" style="position:absolute;right:10px;top:75px;width:8px;height:40px;background:#e74c3c;border-radius:4px;"></div></div><div style="display:flex;justify-content:space-around;width:100%;font-size:1.1rem;"><span>你：<span id="poScore" style="color:var(--gold);">0</span></span><span>电脑：<span id="poCScore" style="color:#e74c3c;">0</span></span></div><div id="poResult" class="message">先到7分赢！</div></div><div class="game-controls"><button class="btn btn-sm" onclick="PO.movePaddle(-20)">↑</button><button class="btn btn-sm" onclick="PO.movePaddle(20)">↓</button></div><div class="chips"><div class="chip chip-100" onclick="PO.bet(100)">100</div><div class="chip chip-500" onclick="PO.bet(500)">500</div><div class="chip chip-1000" onclick="PO.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="poBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="poStartBtn" onclick="PO.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.PO={
    bet(a){if(state.playing||state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('poBet').textContent=state.bet;Engine.play('click');},
    movePaddle(d){if(!state.playing)return;state.paddle=Math.max(0,Math.min(150,state.paddle+d));document.getElementById('poPaddle').style.top=state.paddle+'px';},
    start(){if(state.bet<=0)return;state.ball={x:140,y:95,dx:4,dy:2};state.paddle=75;state.cPaddle=75;state.pScore=0;state.cScore=0;state.playing=true;state.gameOver=false;document.getElementById('poStartBtn').disabled=true;document.getElementById('poScore').textContent='0';document.getElementById('poCScore').textContent='0';document.getElementById('poResult').textContent='';document.addEventListener('keydown',PO.keyHandler);state.timer=setInterval(()=>PO.tick(),30);},
    tick(){
      const b=state.ball;b.x+=b.dx;b.y+=b.dy;
      if(b.y<=0||b.y>=190)b.dy=-b.dy;
      // player paddle
      if(b.x<25&&b.y>state.paddle&&b.y<state.paddle+40){b.dx=-b.dx;b.x=26;}
      // computer paddle
      if(b.x>245&&b.y>state.cPaddle&&b.y<state.cPaddle+40){b.dx=-b.dx;b.x=244;}
      // computer AI
      const target=state.ball.y-20;state.cPaddle+=target>state.cPaddle?2:-2;state.cPaddle=Math.max(0,Math.min(150,state.cPaddle));document.getElementById('poCPaddle').style.top=state.cPaddle+'px';
      // scoring
      if(b.x<0){state.cScore++;document.getElementById('poCScore').textContent=state.cScore;b.x=140;b.y=95;b.dx=-4;b.dy=2;Engine.play('lose');}
      if(b.x>280){state.pScore++;document.getElementById('poScore').textContent=state.pScore;b.x=140;b.y=95;b.dx=4;b.dy=2;Engine.play('win');}
      document.getElementById('poBall').style.left=b.x+'px';document.getElementById('poBall').style.top=b.y+'px';
      if(state.pScore>=7)PO.end(true);if(state.cScore>=7)PO.end(false);
    },
    keyHandler(e){if(e.key==='ArrowUp')PO.movePaddle(-20);if(e.key==='ArrowDown')PO.movePaddle(20);},
    end(won){state.playing=false;clearInterval(state.timer);document.removeEventListener('keydown',PO.keyHandler);const res=document.getElementById('poResult');
      if(won){const win=state.bet*2;Engine.addBalance(win);res.textContent=`🎉 ${state.pScore}:${state.cScore}赢了！赢 ${win}！`;res.className='message msg-win';Engine.play('win');Engine.showQuote('win');}
      else{res.textContent=`${state.pScore}:${state.cScore}输了，输${state.bet}`;res.className='message msg-lose';Engine.play('lose');}
      state.bet=0;document.getElementById('poBet').textContent='0';document.getElementById('poStartBtn').disabled=false;Engine.updateBalanceUI();}
  };
})();