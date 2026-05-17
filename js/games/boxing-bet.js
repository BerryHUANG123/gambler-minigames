// ========== 拳击 🥊 (Boxing Bet) ==========
(function() {
  let state={bet:0,choice:null,round:0,pScore:0,bScore:0,gameOver:false};
  BaseGame.init('boxing-bet', '🥊', '拳击', {
    tableHTML: `<div style="font-size:3rem;margin:8px 0;">🔴 VS 🔵</div><div style="display:flex;justify-content:space-around;width:100%;font-size:1.1rem;"><div>🔴 红方：<span id="bxRed" style="color:#e74c3c;">0</span></div><div>🔵 蓝方：<span id="bxBlue" style="color:#3498db;">0</span></div></div><div id="bxRound" style="font-size:0.9rem;color:#888;">第1/3回合</div><div id="bxAction" style="font-size:1rem;color:var(--cream);min-height:30px;"></div><div id="bxResult" class="message">押红方还是蓝方？</div>`,
    betOptionsHTML: `<button class="bet-btn" data-choice="red" onclick="BX.select('red')">🔴 红方 x2</button><button class="bet-btn" data-choice="blue" onclick="BX.select('blue')">🔵 蓝方 x2</button>`,
    controlsHTML: `<button class="btn btn-primary" id="bxFightBtn" onclick="BX.fight()">🔔 开打！</button>`
  });
  BaseGame.betHandler('boxing_bet', state);
  const _bb=window.boxing_betBet;
  window.boxing_betBet=function(a){if(state.gameOver)return;_bb(a);};
  window.BX={
    select(c){state.choice=c;document.querySelectorAll('#page-boxing-bet .bet-btn').forEach(b=>b.classList.remove('selected'));document.querySelector(`#page-boxing-bet [data-choice="${c}"]`).classList.add('selected');Engine.play('click');},
    bet: window.boxing_betBet,
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
      if(won){const win=state.bet*2;BaseGame.settle('boxing_bet', state, true, win);res.textContent=`🎉 ${state.pScore}:${state.bScore} 你押对了！赢 ${win}！`;res.className='message msg-win';Engine.showQuote('win');}
      else{const lost=state.bet;BaseGame.settle('boxing_bet', state, false, 0);res.textContent=`${state.pScore}:${state.bScore} 押错了，输 ${lost}`;res.className='message msg-lose';}
      document.getElementById('bxFightBtn').disabled=false;
    }
  };
})();
