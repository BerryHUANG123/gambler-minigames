// ========== 宝石迷阵 💎 (Gem Match Slot) ==========
(function() {
  let state={bet:0,spinning:false};const GEMS=['💎','🔮','⭐','💍','👑','💰'];
  const PAY={'💎💎💎':12,'👑👑👑':10,'💰💰💰':8,'💍💍💍':6,'⭐⭐⭐':5,'🔮🔮🔮':5,'💎💎':4,'👑👑':3,'💰💰':3,'💍💍':2,'⭐⭐':2,'🔮🔮':2};
  BaseGame.init('gem-match', '💎', '宝石迷阵', {
    tableHTML: '<div class="reels"><div class="reel" id="gm1">💎</div><div class="reel" id="gm2">🔮</div><div class="reel" id="gm3">⭐</div></div><div id="gmResult" class="message">转出宝石组合赢大奖！</div>',
    controlsHTML: '<button class="btn btn-primary" id="gmSpinBtn" onclick="GM.spin()">💎 转！</button>'
  });
  window.GM={
    bet: BaseGame.betHandler('gem-match', state),
    spin(){
      if(state.spinning||state.bet<=0)return;state.spinning=true;document.getElementById('gmSpinBtn').disabled=true;Engine.play('spin');
      const r=[document.getElementById('gm1'),document.getElementById('gm2'),document.getElementById('gm3')];
      r.forEach(e=>e.classList.add('spinning'));let cnt=0;
      const iv=setInterval(()=>{r.forEach(e=>{e.textContent=GEMS[Engine.randomInt(0,5)];});if(++cnt>=12){clearInterval(iv);
        const res=[GEMS[Engine.randomInt(0,5)],GEMS[Engine.randomInt(0,5)],GEMS[Engine.randomInt(0,5)]];
        r.forEach((e,i)=>{e.textContent=res[i];e.classList.remove('spinning');});
        const line=res.join(''),mult=PAY[line]||0;
        const el=document.getElementById('gmResult');
        if(mult>0){const win=state.bet*mult;BaseGame.settle('gem-match',state,true,win);el.textContent=`🎉 ${line} 中奖！赢 ${win}！`;el.className='message msg-win';Engine.showQuote(mult>=10?'jackpot':'win');}
        else{BaseGame.settle('gem-match',state,false,0);el.textContent=`${line} 没中`;el.className='message msg-lose';}
        state.spinning=false;document.getElementById('gmSpinBtn').disabled=false;
      }},80);
    }
  };
})();
