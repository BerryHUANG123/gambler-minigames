// ========== 颜色记忆 🌈 (Memory Colors) ==========
(function() {
  let state={bet:0,seq:[],playerSeq:[],step:3,showing:false,gameOver:false};
  const COLS=['🔴','🔵','🟢','🟡'];
  const COLS_CSS=['#e74c3c','#3498db','#2ecc71','#f1c40f'];
  const html=`<div class="game-page" id="page-memory-colors"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🌈 颜色记忆</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="mcGrid" style="display:flex;gap:10px;justify-content:center;margin:12px 0;"></div><div id="mcInfo" style="font-size:0.9rem;color:#888;">记住颜色顺序！</div><div id="mcResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="MC.bet(100)">100</div><div class="chip chip-500" onclick="MC.bet(500)">500</div><div class="chip chip-1000" onclick="MC.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="mcBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="mcStartBtn" onclick="MC.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);
    document.getElementById('mcGrid').innerHTML=COLS.map((c,i)=>`<div id="mcB${i}" style="width:60px;height:60px;border-radius:12px;background:${COLS_CSS[i]};opacity:0.3;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid #555;transition:0.15s;" onclick="MC.click(${i})">${c}</div>`).join('');});
  window.MC={
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('mcBet').textContent=state.bet;Engine.play('click');},
    start(){if(state.bet<=0)return;state.seq=[];state.step=3;state.gameOver=false;document.getElementById('mcStartBtn').disabled=true;MC.nextRound();},
    nextRound(){state.seq=[];for(let i=0;i<state.step;i++)state.seq.push(Engine.randomInt(0,3));state.playerSeq=[];state.showing=true;document.getElementById('mcInfo').textContent=`记住${state.step}个颜色！`;MC.showSeq();},
    showSeq(){let i=0;const iv=setInterval(()=>{for(let j=0;j<4;j++){const el=document.getElementById(`mcB${j}`);el.style.opacity='0.3';el.style.borderColor='#555';}
      if(i<state.seq.length){const el=document.getElementById(`mcB${state.seq[i]}`);el.style.opacity='1';el.style.borderColor='var(--gold)';i++;}else{clearInterval(iv);state.showing=false;document.getElementById('mcInfo').textContent='到你了！按顺序点击！';}},600);},
    click(idx){
      if(state.showing||state.gameOver)return;const el=document.getElementById(`mcB${idx}`);el.style.opacity='1';setTimeout(()=>el.style.opacity='0.3',200);
      if(idx===state.seq[state.playerSeq.length]){state.playerSeq.push(idx);Engine.play('click');
        if(state.playerSeq.length===state.seq.length){state.step++;const win=Math.floor(state.bet*state.step*0.5);Engine.addBalance(win);document.getElementById('mcResult').textContent=`✅ 正确！下一轮${state.step}步！`;document.getElementById('mcResult').className='message msg-win';Engine.play('win');setTimeout(()=>MC.nextRound(),800);}
      }else{document.getElementById('mcResult').textContent=`❌ 错了！输${state.bet}`;document.getElementById('mcResult').className='message msg-lose';Engine.play('lose');state.gameOver=true;state.bet=0;document.getElementById('mcBet').textContent='0';document.getElementById('mcStartBtn').disabled=false;Engine.updateBalanceUI();}
    }
  };
})();