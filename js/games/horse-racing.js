// ========== 赛马 🐎 (Horse Racing) ==========
(function() {
  let state={bet:0,choice:null,racing:false};
  const HORSES=[{id:'a',icon:'🐎',name:'赤兔',mult:2},{id:'b',icon:'🐎',name:'的卢',mult:3},{id:'c',icon:'🐎',name:'乌骓',mult:5},{id:'d',icon:'🐎',name:'绝影',mult:8}];
  BaseGame.init('horse-racing', '🐎', '赛马', {
    tableHTML: `<div id="hrTrack" style="position:relative;width:100%;height:200px;background:linear-gradient(180deg,#4a7c3f,#3a6c2f);border-radius:8px;overflow:hidden;border:2px solid #555;"><div id="hrH0" style="position:absolute;left:10px;top:20px;font-size:2rem;transition:left 0.1s;">🐎</div><div id="hrH1" style="position:absolute;left:10px;top:65px;font-size:2rem;transition:left 0.1s;">🐎</div><div id="hrH2" style="position:absolute;left:10px;top:110px;font-size:2rem;transition:left 0.1s;">🐎</div><div id="hrH3" style="position:absolute;left:10px;top:155px;font-size:2rem;transition:left 0.1s;">🐎</div></div><div id="hrResult" class="message">选一匹马下注！</div>`,
    betOptionsHTML: HORSES.map(h=>`<button class="bet-btn" data-choice="${h.id}" onclick="HR.select('${h.id}')">${h.icon} ${h.name} x${h.mult}</button>`).join(''),
    controlsHTML: `<button class="btn btn-primary" id="hrGoBtn" onclick="HR.go()">开跑！</button>`
  });
  BaseGame.betHandler('horse_racing', state);
  const _hb=window.horse_racingBet;
  window.horse_racingBet=function(a){if(state.racing)return;_hb(a);};
  window.HR={
    select(c){state.choice=c;document.querySelectorAll('#page-horse-racing .bet-btn').forEach(b=>b.classList.remove('selected'));document.querySelector(`#page-horse-racing [data-choice="${c}"]`).classList.add('selected');Engine.play('click');},
    bet: window.horse_racingBet,
    go(){
      if(state.racing||state.bet<=0||!state.choice)return;state.racing=true;document.getElementById('hrGoBtn').disabled=true;Engine.play('spin');
      const pos=[0,0,0,0];let cnt=0;
      const iv=setInterval(()=>{pos.forEach((p,i)=>{pos[i]+=Engine.randomInt(1,5);const d=document.getElementById(`hrH${i}`);if(d)d.style.left=pos[i]+'px';});if(++cnt>40){clearInterval(iv);
        const idx=pos.indexOf(Math.max(...pos));const winner=HORSES[idx];
        const res=document.getElementById('hrResult');
        if(winner.id===state.choice){const win=state.bet*winner.mult;BaseGame.settle('horse_racing', state, true, win);res.textContent=`🎉 ${winner.icon}${winner.name}第一！赢 ${win}！`;res.className='message msg-win';Engine.showQuote('win');}
        else{const lost=state.bet;BaseGame.settle('horse_racing', state, false, 0);res.textContent=`${winner.icon}${winner.name}第一，你押输了${lost}`;res.className='message msg-lose';}
        state.racing=false;document.getElementById('hrGoBtn').disabled=false;
      }},80);
    }
  };
})();
