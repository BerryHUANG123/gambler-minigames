// ========== 顺序记忆 🔄 (Memory Sequence) ==========
(function() {
  let state={bet:0,seq:[],playerSeq:[],step:3,showing:false,gameOver:false};
  const COLORS=['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c','#e84393'];
  const ns='memory-seq';
  BaseGame.init(ns, '🔄', '顺序记忆', {
    tableHTML: '<div id="msGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:240px;margin:12px auto;"></div><div id="msInfo" style="font-size:0.9rem;color:#888;">记住亮灯顺序！</div><div id="msResult" class="message"></div>',
    controlsHTML: '<button class="btn btn-primary" id="msStartBtn" onclick="MS.start()">开始！</button>'
  });
  document.getElementById('msGrid').innerHTML=COLORS.map((c,i)=>`<div id="msB${i}" style="aspect-ratio:1;border-radius:12px;background:${c};opacity:0.3;cursor:pointer;transition:0.15s;border:2px solid #555;" onclick="MS.click(${i})"></div>`).join('');
  window.MS={
    bet: BaseGame.betHandler(ns, state),
    start(){if(state.bet<=0)return;state.seq=[];state.playerSeq=[];state.step=3;state.gameOver=false;document.getElementById('msStartBtn').disabled=true;MS.nextRound();},
    nextRound(){state.seq=[];for(let i=0;i<state.step;i++)state.seq.push(Engine.randomInt(0,7));state.playerSeq=[];state.showing=true;document.getElementById('msInfo').textContent=`看好了！${state.step}步`;MS.showSeq();},
    showSeq(){let i=0;const iv=setInterval(()=>{COLORS.forEach((_,idx)=>{const el=document.getElementById(`msB${idx}`);el.style.opacity='0.3';el.style.borderColor='#555';});
      if(i<state.seq.length){const el=document.getElementById(`msB${state.seq[i]}`);el.style.opacity='1';el.style.borderColor='var(--gold)';i++;}else{clearInterval(iv);state.showing=false;document.getElementById('msInfo').textContent='轮到你了！按顺序点击！';}},600);},
    click(idx){
      if(state.showing||state.gameOver)return;const el=document.getElementById(`msB${idx}`);el.style.opacity='1';setTimeout(()=>el.style.opacity='0.3',200);
      if(idx===state.seq[state.playerSeq.length]){state.playerSeq.push(idx);Engine.play('click');
        if(state.playerSeq.length===state.seq.length){state.step++;const win=Math.floor(state.bet*state.step*0.5);Engine.addBalance(win);document.getElementById('msResult').textContent=`✅ 对了！下一轮${state.step}步！`;document.getElementById('msResult').className='message msg-win';Engine.play('win');setTimeout(()=>MS.nextRound(),800);}
      }else{document.getElementById('msResult').textContent=`❌ 错了！输${state.bet}`;document.getElementById('msResult').className='message msg-lose';state.gameOver=true;document.getElementById('msStartBtn').disabled=false;BaseGame.settle(ns,state,false,0);}
    }
  };
})();
