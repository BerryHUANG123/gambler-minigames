// ========== 猜词 💀 (Hangman) ==========
(function() {
  let state={bet:0,idx:0,score:0,gameOver:false};
  const QS=[{q:'形容非常害怕',o:['心惊胆战','得意洋洋','兴高采烈','垂头丧气'],a:0},{q:'形容非常高兴',o:['泪流满面','欢天喜地','愁眉苦脸','怒气冲天'],a:1},{q:'形容非常着急',o:['不紧不慢','心平气和','心急如焚','从容不迫'],a:2},{q:'形容非常安静',o:['人声鼎沸','鸦雀无声','热闹非凡','锣鼓喧天'],a:1},{q:'形容非常努力',o:['半途而废','三心二意','废寝忘食','偷工减料'],a:2},{q:'形容非常聪明',o:['愚不可及','大智若愚','自作聪明','笨手笨脚'],a:1}];
  BaseGame.init('hangman', '💀', '猜词', {
    tableHTML: `<div style="font-size:2rem;margin:8px 0;">💀</div><div id="hmProgress" style="font-size:0.8rem;color:#888;"></div><div id="hmQuestion" style="font-size:1.1rem;color:var(--cream);margin:12px 0;"></div><div id="hmOptions" style="display:flex;flex-direction:column;gap:6px;width:100%;max-width:320px;margin:8px auto;"></div><div id="hmResult" class="message"></div>`,
    controlsHTML: `<button class="btn" onclick="HM.reset()">重新开始</button>`
  });
  BaseGame.betHandler('hangman', state);
  const _hb=window.hangmanBet;
  window.hangmanBet=function(a){if(state.gameOver)return;_hb(a);if(state.bet>0&&state.idx===0)HM.showQ();};
  window.HM={
    bet: window.hangmanBet,
    showQ(){if(state.idx>=QS.length){HM.end();return;}const q=QS[state.idx];document.getElementById('hmProgress').textContent=`第${state.idx+1}/${QS.length}题`;document.getElementById('hmQuestion').textContent=q.q;document.getElementById('hmOptions').innerHTML=q.o.map((o,i)=>`<button class="bet-btn" onclick="HM.answer(${i})" style="width:100%;">${o}</button>`).join('');document.getElementById('hmResult').textContent='';},
    answer(i){const q=QS[state.idx];const correct=i===q.a;const res=document.getElementById('hmResult');if(correct){state.score++;res.textContent='✅ 正确！';res.className='message msg-win';Engine.play('win');}else{res.textContent=`❌ 是：${q.o[q.a]}`;res.className='message msg-lose';Engine.play('lose');}document.querySelectorAll('#page-hangman .bet-btn').forEach((b,idx)=>b.style.borderColor=idx===q.a?'var(--gold)':'#555');state.idx++;setTimeout(()=>HM.showQ(),1000);},
    end(){state.gameOver=true;const win=Math.floor(state.bet*(1+state.score*0.5));BaseGame.settle('hangman', state, true, win);document.getElementById('hmResult').textContent=`🎉 答对${state.score}/${QS.length}题，赢 ${win}！`;document.getElementById('hmResult').className='message msg-win';},
    reset(){state.bet=0;state.idx=0;state.score=0;state.gameOver=false;document.getElementById('hangmanBet').textContent='0';document.getElementById('hmQuestion').textContent='';document.getElementById('hmOptions').innerHTML='';document.getElementById('hmResult').textContent='';document.getElementById('hmProgress').textContent='';Engine.updateBalanceUI();}
  };
})();
