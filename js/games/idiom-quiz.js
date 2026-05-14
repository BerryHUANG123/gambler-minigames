// ========== 成语猜谜 📖 (Idiom Quiz) ==========
(function() {
  let state={bet:0,idx:0,score:0,gameOver:false};
  const QS=[
    {q:'最长的腿',o:['一步登天','一日千里','一马当先','一举成名'],a:1},
    {q:'最贵的字',o:['一字千金','一字千钧','字字珠玑','一字之师'],a:0},
    {q:'最大的嘴',o:['口若悬河','气吞山河','血盆大口','一鸣惊人'],a:1},
    {q:'最重的话',o:['一言九鼎','千钧一发','一诺千金','金口玉言'],a:0},
    {q:'最高的人',o:['顶天立地','高人一等','高不可攀','一柱擎天'],a:0},
    {q:'最快的流水',o:['一泻千里','一日千里','水流湍急','飞流直下'],a:0},
    {q:'最大的手',o:['一手遮天','手到擒来','大手大脚','妙手回春'],a:0},
    {q:'最尖的针',o:['针锋相对','一针见血','细如针尖','锋芒毕露'],a:1},
    {q:'最长的寿命',o:['长命百岁','万寿无疆','长生不老','寿比南山'],a:2},
    {q:'最大的差别',o:['天壤之别','天差地别','截然不同','大相径庭'],a:0},
  ];
  const html=`<div class="game-page" id="page-idiom-quiz"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>📖 成语猜谜</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="iqProgress" style="font-size:0.8rem;color:#888;"></div><div id="iqQuestion" style="font-size:1.1rem;color:var(--cream);margin:12px 0;"></div><div id="iqOptions" style="display:flex;flex-direction:column;gap:6px;width:100%;max-width:320px;margin:8px auto;"></div><div id="iqResult" class="message"></div><div id="iqFinal" style="font-size:1.2rem;color:var(--gold);"></div></div><div class="chips"><div class="chip chip-100" onclick="IQ.bet(100)">100</div><div class="chip chip-500" onclick="IQ.bet(500)">500</div><div class="chip chip-1000" onclick="IQ.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="iqBet">0</span></div><div class="game-controls"><button class="btn" id="iqNextBtn" onclick="IQ.next()" style="display:none;">下一题</button><button class="btn" onclick="IQ.reset()">重新开始</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.IQ={
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('iqBet').textContent=state.bet;Engine.play('click');if(state.bet>0&&state.idx===0)IQ.showQ();},
    showQ(){if(state.idx>=QS.length){IQ.end();return;}const q=QS[state.idx];document.getElementById('iqProgress').textContent=`第${state.idx+1}/${QS.length}题`;document.getElementById('iqQuestion').textContent=q.q;document.getElementById('iqOptions').innerHTML=q.o.map((o,i)=>`<button class="bet-btn" onclick="IQ.answer(${i})" style="width:100%;">${o}</button>`).join('');document.getElementById('iqResult').textContent='';document.getElementById('iqNextBtn').style.display='none';},
    answer(i){const q=QS[state.idx];const correct=i===q.a;const res=document.getElementById('iqResult');if(correct){state.score++;res.textContent='✅ 正确！';res.className='message msg-win';Engine.play('win');}else{res.textContent=`❌ 正确答案是：${q.o[q.a]}`;res.className='message msg-lose';Engine.play('lose');}document.querySelectorAll('#page-idiom-quiz .bet-btn').forEach((b,idx)=>b.style.borderColor=idx===q.a?'var(--gold)':'#555');document.getElementById('iqNextBtn').style.display='inline-block';},
    next(){state.idx++;IQ.showQ();},
    end(){state.gameOver=true;const win=Math.floor(state.bet*(1+state.score*0.3));Engine.addBalance(win);document.getElementById('iqFinal').textContent=`🎉 答对${state.score}/${QS.length}题，赢 ${win} 筹码！`;if(state.score>=8)Engine.showQuote('jackpot');Engine.play('win');},
    reset(){state.bet=0;state.idx=0;state.score=0;state.gameOver=false;document.getElementById('iqBet').textContent='0';document.getElementById('iqQuestion').textContent='';document.getElementById('iqOptions').innerHTML='';document.getElementById('iqResult').textContent='';document.getElementById('iqFinal').textContent='';document.getElementById('iqProgress').textContent='';document.getElementById('iqNextBtn').style.display='none';Engine.updateBalanceUI();}
  };
})();