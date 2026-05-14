// ========== 宝石迷阵 💎 (Gem Match Slot) ==========
(function() {
  let state={bet:0,spinning:false};const GEMS=['💎','🔮','⭐','💍','👑','💰'];
  const PAY={'💎💎💎':12,'👑👑👑':10,'💰💰💰':8,'💍💍💍':6,'⭐⭐⭐':5,'🔮🔮🔮':5,'💎💎':4,'👑👑':3,'💰💰':3,'💍💍':2,'⭐⭐':2,'🔮🔮':2};
  const html=`<div class="game-page" id="page-gem-match"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>💎 宝石迷阵</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div class="reels"><div class="reel" id="gm1">💎</div><div class="reel" id="gm2">🔮</div><div class="reel" id="gm3">⭐</div></div><div id="gmResult" class="message">转出宝石组合赢大奖！</div></div><div class="chips"><div class="chip chip-100" onclick="GM.bet(100)">100</div><div class="chip chip-500" onclick="GM.bet(500)">500</div><div class="chip chip-1000" onclick="GM.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="gmBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="gmSpinBtn" onclick="GM.spin()">💎 转！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.GM={
    bet(a){if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('gmBet').textContent=state.bet;Engine.play('click');},
    spin(){
      if(state.spinning||state.bet<=0)return;state.spinning=true;document.getElementById('gmSpinBtn').disabled=true;Engine.play('spin');
      const r=[document.getElementById('gm1'),document.getElementById('gm2'),document.getElementById('gm3')];
      r.forEach(e=>e.classList.add('spinning'));let cnt=0;
      const iv=setInterval(()=>{r.forEach(e=>{e.textContent=GEMS[Engine.randomInt(0,5)];});if(++cnt>=12){clearInterval(iv);
        const res=[GEMS[Engine.randomInt(0,5)],GEMS[Engine.randomInt(0,5)],GEMS[Engine.randomInt(0,5)]];
        r.forEach((e,i)=>{e.textContent=res[i];e.classList.remove('spinning');});
        const line=res.join(''),mult=PAY[line]||0;
        const el=document.getElementById('gmResult');
        if(mult>0){const win=state.bet*mult;Engine.addBalance(win);el.textContent=`🎉 ${line} 中奖！赢 ${win}！`;el.className='message msg-win';Engine.play('win');Engine.showQuote(mult>=10?'jackpot':'win');}
        else{el.textContent=`${line} 没中`;el.className='message msg-lose';Engine.play('lose');}
        state.bet=0;state.spinning=false;document.getElementById('gmSpinBtn').disabled=false;document.getElementById('gmBet').textContent='0';Engine.updateBalanceUI();
      }},80);
    }
  };
})();