// ========== 水果机 🍎 (Fruit Machine) ==========
(function() {
  let state={bet:0,spinning:false};const FRUITS=['🍎','🍊','🍋','🍇','🍒','🍑'];
  const PAY={'🍎🍎🍎':6,'🍊🍊🍊':5,'🍋🍋🍋':5,'🍇🍇🍇':8,'🍒🍒🍒':10,'🍑🍑🍑':8,'🍎🍎':2,'🍊🍊':2,'🍋🍋':2,'🍇🍇':3,'🍒🍒':4,'🍑🍑':3};
  const html=`<div class="game-page" id="page-fruit-machine"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🍎 水果机</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div class="reels"><div class="reel" id="fm1">🍎</div><div class="reel" id="fm2">🍊</div><div class="reel" id="fm3">🍋</div></div><div id="fmResult" class="message">拉杆试试！</div></div><div class="chips"><div class="chip chip-100" onclick="FM.bet(100)">100</div><div class="chip chip-500" onclick="FM.bet(500)">500</div><div class="chip chip-1000" onclick="FM.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="fmBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="fmSpinBtn" onclick="FM.spin()">🍎 拉杆！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.FM={
    bet(a){if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('fmBet').textContent=state.bet;Engine.play('click');},
    spin(){
      if(state.spinning||state.bet<=0)return;state.spinning=true;document.getElementById('fmSpinBtn').disabled=true;Engine.play('spin');
      const r=[document.getElementById('fm1'),document.getElementById('fm2'),document.getElementById('fm3')];
      r.forEach(e=>e.classList.add('spinning'));let cnt=0;
      const iv=setInterval(()=>{r.forEach(e=>{e.textContent=FRUITS[Engine.randomInt(0,5)];});if(++cnt>=12){clearInterval(iv);
        const res=[FRUITS[Engine.randomInt(0,5)],FRUITS[Engine.randomInt(0,5)],FRUITS[Engine.randomInt(0,5)]];
        r.forEach((e,i)=>{e.textContent=res[i];e.classList.remove('spinning');});
        const line=res.join(''),mult=PAY[line]||0;
        const el=document.getElementById('fmResult');
        if(mult>0){const win=state.bet*mult;Engine.addBalance(win);el.textContent=`🎉 ${line} 中了！赢 ${win}！`;el.className='message msg-win';Engine.play('win');Engine.showQuote(mult>=8?'jackpot':'win');}
        else{el.textContent=`${line} 没中`;el.className='message msg-lose';Engine.play('lose');}
        state.bet=0;state.spinning=false;document.getElementById('fmSpinBtn').disabled=false;document.getElementById('fmBet').textContent='0';Engine.updateBalanceUI();
      }},80);
    }
  };
})();