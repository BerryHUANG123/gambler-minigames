// ========== 成语填空 📖 (Idiom Fill) ==========
(function() {
  let state={bet:0,idx:0,score:0,gameOver:false,_started:false};
  const QS=[{q:'一_当先',o:['马','车','人','刀'],a:0},{q:'_上添花',o:['锦','花','雪','金'],a:0},{q:'画蛇_足',o:['添','加','多','补'],a:0},{q:'_中送炭',o:['雪','雨','风','火'],a:0},{q:'亡羊_牢',o:['补','修','建','围'],a:0},{q:'_目寸光',o:['鼠','蛇','龙','兔'],a:0},{q:'守株_兔',o:['待','等','候','抓'],a:0},{q:'对_弹琴',o:['牛','马','猪','鸡'],a:0},{q:'打草惊_',o:['蛇','龙','虎','兔'],a:0},{q:'叶公好_',o:['龙','凤','虎','马'],a:0}];

  BaseGame.init('idiom-fill', '📖', '成语填空', {
    tableHTML: '<div id="ifProgress" style="font-size:0.8rem;color:#888;"></div><div id="ifQuestion" style="font-size:1.3rem;color:var(--gold);margin:12px 0;"></div><div id="ifOptions" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;"></div><div id="ifResult" class="message"></div>',
    controlsHTML: '<button class="btn" id="ifNextBtn" onclick="IF.next()" style="display:none;">下一题</button><button class="btn" onclick="IF.reset()">重新开始</button>'
  });

  BaseGame.betHandler('idiom-fill', state);

  const _ifBet = window.idiom_fillBet;
  window.idiom_fillBet = function(a) {
    if (state.gameOver) return;
    _ifBet(a);
    if (state.bet > 0 && !state._started) {
      state._started = true;
      IF.showQ();
    }
  };

  window.IF={
    showQ(){if(state.idx>=QS.length){IF.end();return;}const q=QS[state.idx];document.getElementById('ifProgress').textContent=`第${state.idx+1}/${QS.length}题`;document.getElementById('ifQuestion').textContent=q.q;document.getElementById('ifOptions').innerHTML=q.o.map((o,i)=>`<button class="bet-btn" style="font-size:1.2rem;padding:8px 20px;" onclick="IF.answer(${i})">${o}</button>`).join('');document.getElementById('ifResult').textContent='';document.getElementById('ifNextBtn').style.display='none';},
    answer(i){const q=QS[state.idx];const correct=i===q.a;const res=document.getElementById('ifResult');if(correct){state.score++;res.textContent='✅ 正确！';res.className='message msg-win';Engine.play('win');}else{res.textContent=`❌ 正确答案是：${q.o[q.a]}`;res.className='message msg-lose';Engine.play('lose');}document.querySelectorAll('#page-idiom-fill .bet-btn').forEach((b,idx)=>b.style.borderColor=idx===q.a?'var(--gold)':'#555');document.getElementById('ifNextBtn').style.display='inline-block';},
    next(){state.idx++;IF.showQ();},
    end(){state.gameOver=true;const win=Math.floor(state.bet*(1+state.score*0.3));BaseGame.settle('idiom-fill',state,true,win);document.getElementById('ifResult').textContent=`🎉 答对${state.score}/${QS.length}题，赢 ${win}！`;document.getElementById('ifResult').className='message msg-win';if(state.score>=8)Engine.showQuote('win');},
    reset(){state.bet=0;state.idx=0;state.score=0;state.gameOver=false;state._started=false;document.getElementById('idiom_fillBet').textContent='0';document.getElementById('ifQuestion').textContent='';document.getElementById('ifOptions').innerHTML='';document.getElementById('ifResult').textContent='';document.getElementById('ifProgress').textContent='';document.getElementById('ifNextBtn').style.display='none';Engine.updateBalanceUI();}
  };
})();
