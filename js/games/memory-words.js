// ========== 单词记忆 📝 (Memory Words) ==========
(function() {
  let state={bet:0,words:[],count:3,gameOver:false,showing:false,chosen:[]};
  const POOL=['苹果','香蕉','橘子','葡萄','草莓','西瓜','桃子','樱桃','芒果','柠檬','椰子','荔枝'];
  const ns='memory-words';
  BaseGame.init(ns, '📝', '单词记忆', {
    tableHTML: '<div id="mwDisplay" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:12px 0;"></div><div id="mwInfo" style="font-size:0.9rem;color:#888;">记住这些词！</div><div id="mwChoices" style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:8px 0;"></div><div id="mwResult" class="message"></div>',
    controlsHTML: '<button class="btn btn-primary" id="mwStartBtn" onclick="MW.start()">开始！</button>'
  });
  window.MW={
    bet: BaseGame.betHandler(ns, state),
    start(){if(state.bet<=0)return;state.count=3;state.gameOver=false;document.getElementById('mwStartBtn').disabled=true;MW.nextRound();},
    nextRound(){state.words=Engine.shuffle([...POOL]).slice(0,state.count);state.chosen=[];state.showing=true;
      document.getElementById('mwDisplay').innerHTML=state.words.map(w=>`<span style="padding:6px 14px;background:#1a1a2e;border-radius:8px;border:1px solid var(--gold);color:var(--gold);font-size:1.1rem;">${w}</span>`).join('');
      document.getElementById('mwInfo').textContent=`记住这些词！5秒后消失！`;Engine.play('click');
      const allChoices=Engine.shuffle([...state.words,...Engine.shuffle(POOL).slice(0,6)]);
      setTimeout(()=>{document.getElementById('mwDisplay').innerHTML='<span style="color:#888;">词已隐藏，选出你记住的！</span>';
        document.getElementById('mwChoices').innerHTML=allChoices.map((w,i)=>`<button class="bet-btn" onclick="MW.pick(${i})" data-idx="${i}">${w}</button>`).join('');
        document.getElementById('mwInfo').textContent=`选出${state.count}个词！`;state.showing=false;},5000);
    },
    pick(i){
      if(state.showing)return;const btn=document.querySelector(`#page-${ns} [data-idx="${i}"]`);
      if(btn.classList.contains('selected')){btn.classList.remove('selected');state.chosen=state.chosen.filter(c=>c!==i);return;}
      btn.classList.add('selected');state.chosen.push(i);Engine.play('click');
      if(state.chosen.length>=state.count){MW.check();}
    },
    check(){const allChoices=document.querySelectorAll(`#page-${ns} .bet-btn`);const selected=[...allChoices].filter(b=>b.classList.contains('selected'));const pickedWords=selected.map(b=>b.textContent);
      const correct=pickedWords.every(w=>state.words.includes(w))&&pickedWords.length===state.words.length;
      if(correct){state.count++;const win=Math.floor(state.bet*state.count*0.5);Engine.addBalance(win);document.getElementById('mwResult').textContent=`✅ 全对！下一轮${state.count}个词！赢${win}`;document.getElementById('mwResult').className='message msg-win';Engine.play('win');
        setTimeout(()=>{document.getElementById('mwChoices').innerHTML='';document.getElementById('mwResult').textContent='';MW.nextRound();},1000);}
      else{document.getElementById('mwResult').textContent=`❌ 错了！应该是${state.words.join('、')}`;document.getElementById('mwResult').className='message msg-lose';state.gameOver=true;document.getElementById('mwStartBtn').disabled=false;BaseGame.settle(ns,state,false,0);}
    }
  };
})();
