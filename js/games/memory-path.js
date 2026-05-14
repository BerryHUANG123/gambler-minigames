// ========== 路径记忆 🗺️ (Memory Path) ==========
(function() {
  let state={bet:0,path:[],playerPath:[],step:3,showing:false,gameOver:false};
  const html=`<div class="game-page" id="page-memory-path"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🗺️ 路径记忆</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="mpGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;max-width:220px;margin:12px auto;"></div><div id="mpInfo" style="font-size:0.9rem;color:#888;">记住亮灯路径！</div><div id="mpResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="MP.bet(100)">100</div><div class="chip chip-500" onclick="MP.bet(500)">500</div><div class="chip chip-1000" onclick="MP.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="mpBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="mpStartBtn" onclick="MP.start()">开始！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);
    let g='';for(let i=0;i<16;i++)g+=`<div id="mpC${i}" style="aspect-ratio:1;border-radius:8px;background:#1a1a2e;cursor:pointer;border:2px solid #444;transition:0.15s;" onclick="MP.click(${i})"></div>`;
    document.getElementById('mpGrid').innerHTML=g;});
  window.MP={
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('mpBet').textContent=state.bet;Engine.play('click');},
    start(){if(state.bet<=0)return;state.path=[];state.step=3;state.gameOver=false;document.getElementById('mpStartBtn').disabled=true;MP.nextRound();},
    nextRound(){state.path=[];for(let i=0;i<state.step;i++){let n;do{n=Engine.randomInt(0,15);}while(state.path.includes(n));state.path.push(n);}state.playerPath=[];state.showing=true;document.getElementById('mpInfo').textContent=`记住${state.step}步路径！`;MP.showPath();},
    showPath(){let i=0;const iv=setInterval(()=>{for(let j=0;j<16;j++){document.getElementById(`mpC${j}`).style.background='#1a1a2e';document.getElementById(`mpC${j}`).style.borderColor='#444';}
      if(i<state.path.length){const el=document.getElementById(`mpC${state.path[i]}`);el.style.background='var(--gold)';el.style.borderColor='#fff';i++;}else{clearInterval(iv);state.showing=false;document.getElementById('mpInfo').textContent='到你了！按路径点击！';}},500);},
    click(idx){
      if(state.showing||state.gameOver)return;const el=document.getElementById(`mpC${idx}`);el.style.background='var(--gold)';setTimeout(()=>el.style.background='#1a1a2e',200);
      if(idx===state.path[state.playerPath.length]){state.playerPath.push(idx);Engine.play('click');
        if(state.playerPath.length===state.path.length){state.step++;const win=Math.floor(state.bet*state.step*0.5);Engine.addBalance(win);document.getElementById('mpResult').textContent=`✅ 正确！下一轮${state.step}步！`;document.getElementById('mpResult').className='message msg-win';Engine.play('win');setTimeout(()=>MP.nextRound(),800);}
      }else{document.getElementById('mpResult').textContent=`❌ 错了！输${state.bet}`;document.getElementById('mpResult').className='message msg-lose';Engine.play('lose');state.gameOver=true;state.bet=0;document.getElementById('mpBet').textContent='0';document.getElementById('mpStartBtn').disabled=false;Engine.updateBalanceUI();}
    }
  };
})();