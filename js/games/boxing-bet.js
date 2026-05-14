// ========== 拳击 🥊 (Boxing Bet) ==========
(function() {
  let state={bet:0,choice:null,round:0,pScore:0,bScore:0,gameOver:false};
  const html=`<div class="game-page" id="page-boxing"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🥊 拳击</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div style="font-size:3rem;margin:8px 0;">🔴 VS 🔵</div><div style="display:flex;justify-content:space-around;width:100%;font-size:1.1rem;"><div>🔴 红方：<span id="bxRed" style="color:#e74c3c;">0</span></div><div>🔵 蓝方：<span id="bxBlue" style="color:#3498db;">0</span></div></div><div id="bxRound" style="font-size:0.9rem;color:#888;">第1/3回合</div><div id="bxAction" style="font-size:1rem;color:var(--cream);min-height:30px;"></div><div id="bxResult" class="message">押红方还是蓝方？</div></div><div class="bet-options"><button class="bet-btn" data-choice="red" onclick="BX.select('red')">🔴 红方 x2</button><button class="bet-btn" data-choice="blue" onclick="BX.select('blue')">🔵 蓝方 x2</button></div><div class="chips"><div class="chip chip-100" onclick="BX.bet(100)">100</div><div class="chip chip-500" onclick="BX.bet(500)">500</div><div class="chip chip-1000" onclick="BX.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="bxBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="bxFightBtn" onclick="BX.fight()">🔔 开打！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.BX={
    select(c){state.choice=c;document.querySelectorAll('#page-boxing .bet-btn').forEach(b=>b.classList.remove('selected'));document.querySelector(`#page-boxing [data-choice="${c}"]`).classList.add('selected');Engine.play('click');},
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('bxBet').textContent=state.bet;Engine.play('click');},
    fight(){
      if(state.bet<=0||!state.choice||state.gameOver)return;
      state.round=1;state.pScore=0;state.bScore=0;state.gameOver=false;
      document.getElementById('bxFightBtn').disabled=true;Engine.play('click');
      BX.doRound();
    },
    doRound(){
      if(state.round>3){BX.end();return;}
      document.getElementById('bxRound').textContent=`第${state.round}/3回合`;
      const r=Engine.randomInt(0,2);const action=document.getElementById('bxAction');
      if(r===0){state.pScore++;action.textContent='🔴 红方重拳出击！';}else if(r===1){state.bScore++;action.textContent='🔵 蓝方反击得分！';}else{action.textContent='⚡ 双方互换拳！';}
      document.getElementById('bxRed').textContent=state.pScore;document.getElementById('bxBlue').textContent=state.bScore;
      state.round++;setTimeout(()=>BX.doRound(),1000);
    },
    end(){
      state.gameOver=true;const res=document.getElementById('bxResult');
      const won=(state.pScore>state.bScore&&state.choice==='red')||(state.bScore>state.pScore&&state.choice==='blue');
      if(won){const win=state.bet*2;Engine.addBalance(win);res.textContent=`🎉 ${state.pScore}:${state.bScore} 你押对了！赢 ${win}！`;res.className='message msg-win';Engine.play('win');Engine.showQuote('win');}
      else{res.textContent=`${state.pScore}:${state.bScore} 押错了，输 ${state.bet}`;res.className='message msg-lose';Engine.play('lose');}
      state.bet=0;document.getElementById('bxBet').textContent='0';document.getElementById('bxFightBtn').disabled=false;Engine.updateBalanceUI();
    }
  };
})();