(function() {
  let state={bet:0,spinning:false};const FRUITS=['🍎','🍊','🍋','🍇','🍒','🍑'];
  const PAY={'🍎🍎🍎':6,'🍊🍊🍊':5,'🍋🍋🍋':5,'🍇🍇🍇':8,'🍒🍒🍒':10,'🍑🍑🍑':8,'🍎🍎':2,'🍊🍊':2,'🍋🍋':2,'🍇🍇':3,'🍒🍒':4,'🍑🍑':3};

  BaseGame.init('fruit-machine', '🍎', '水果机', {
    tableHTML: '<div class="reels"><div class="reel" id="fm1">🍎</div><div class="reel" id="fm2">🍊</div><div class="reel" id="fm3">🍋</div></div><div id="fmResult" class="message">拉杆试试！</div>',
    controlsHTML: '<button class="btn btn-primary" id="fmSpinBtn" onclick="FM.spin()">🍎 拉杆！</button>'
  });

  BaseGame.betHandler('fm', state);

  window.FM={
    spin(){
      if(state.spinning||state.bet<=0)return;state.spinning=true;document.getElementById('fmSpinBtn').disabled=true;Engine.play('spin');
      const r=[document.getElementById('fm1'),document.getElementById('fm2'),document.getElementById('fm3')];
      r.forEach(e=>e.classList.add('spinning'));let cnt=0;
      const iv=setInterval(()=>{r.forEach(e=>{e.textContent=FRUITS[Engine.randomInt(0,5)];});if(++cnt>=12){clearInterval(iv);
        const res=[FRUITS[Engine.randomInt(0,5)],FRUITS[Engine.randomInt(0,5)],FRUITS[Engine.randomInt(0,5)]];
        r.forEach((e,i)=>{e.textContent=res[i];e.classList.remove('spinning');});
        const line=res.join(''),mult=PAY[line]||0;
        const el=document.getElementById('fmResult');
        if(mult>0){const win=state.bet*mult;el.textContent=`🎉 ${line} 中了！赢 ${win}！`;el.className='message msg-win';Engine.showQuote(mult>=8?'jackpot':'win');BaseGame.settle('fm',state,true,win);}
        else{el.textContent=`${line} 没中`;el.className='message msg-lose';BaseGame.settle('fm',state,false,0);}
        state.spinning=false;document.getElementById('fmSpinBtn').disabled=false;
      }},80);
    }
  };
})();
