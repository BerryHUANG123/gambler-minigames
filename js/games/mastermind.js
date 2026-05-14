// ========== 猜密码 🎨 (Mastermind) ==========
(function() {
  let state={bet:0,secret:[],guesses:[],attempts:0,maxAttempts:10,gameOver:false};
  const COLORS=['🔴','🔵','🟢','🟡','🟣','🟠'];
  function generateSecret(){const s=[];for(let i=0;i<4;i++)s.push(Engine.randomInt(0,6));return s;}
  const html=`<div class="game-page" id="page-mastermind"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🎨 猜密码</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="mmHistory" style="display:flex;flex-direction:column;gap:4px;width:100%;max-height:200px;overflow-y:auto;"></div><div id="mmPicker" style="display:flex;gap:4px;justify-content:center;margin:8px 0;"></div><div id="mmInfo" style="font-size:0.9rem;color:#888;">选择4个颜色猜密码</div><div id="mmResult" class="message"></div></div><div class="game-controls"><button class="btn btn-primary" id="mmGuessBtn" onclick="MM.guess()">猜！</button></div><div class="chips"><div class="chip chip-100" onclick="MM.bet(100)">100</div><div class="chip chip-500" onclick="MM.bet(500)">500</div><div class="chip chip-1000" onclick="MM.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="mmBet">0</span></div><div class="game-controls"><button class="btn" id="mmStartBtn" onclick="MM.start()">新一局</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);
    document.getElementById('mmPicker').innerHTML=Array(4).fill(0).map((_,i)=>`<div id="mmSlot${i}" onclick="MM.pickColor(${i})" style="width:50px;height:50px;border-radius:50%;background:#333;cursor:pointer;border:2px solid #555;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">?</div>`).join('');
    document.getElementById('mmGuessBtn').disabled=true;});
  window.MM={
    _pick:[0,0,0,0],
    _selected:0,
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('mmBet').textContent=state.bet;Engine.play('click');},
    start(){if(state.bet<=0)return;state.secret=generateSecret();state.guesses=[];state.attempts=0;state.gameOver=false;MM._pick=[0,0,0,0];
      document.getElementById('mmGuessBtn').disabled=false;document.getElementById('mmHistory').innerHTML='';document.getElementById('mmResult').textContent='';document.getElementById('mmInfo').textContent='选择4个颜色！10次机会';
      for(let i=0;i<4;i++){const el=document.getElementById(`mmSlot${i}`);el.textContent='?';el.style.background='#333';el.style.borderColor='#555';}},
    pickColor(i){
      if(state.gameOver)return;MM._pick[i]=(MM._pick[i]+1)%6;const el=document.getElementById(`mmSlot${i}`);
      el.textContent=COLORS[MM._pick[i]];el.style.background='#2c2c3e';el.style.borderColor='var(--gold)';Engine.play('click');},
    guess(){
      if(state.gameOver||state.attempts>=state.maxAttempts)return;
      const g=[...MM._pick];state.attempts++;
      let exact=0,color=0;const secC=[...state.secret];const guessC=[...g];
      for(let i=0;i<4;i++){if(g[i]===secC[i]){exact++;secC[i]=-1;guessC[i]=-1;}}
      for(let i=0;i<4;i++){if(guessC[i]>=0){const idx=secC.indexOf(guessC[i]);if(idx>=0){color++;secC[idx]=-1;}}}
      const row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;gap:6px;padding:4px 8px;background:#1a1a2e;border-radius:6px;';
      row.innerHTML=g.map(c=>`<span style="font-size:1rem;">${COLORS[c]}</span>`).join('')+` <span style="color:#888;font-size:0.8rem;">⬤${exact} ◯${color}</span>`;
      document.getElementById('mmHistory').prepend(row);
      if(exact===4){state.gameOver=true;const bonus=Math.max(1,10-state.attempts+1);const win=state.bet*bonus;Engine.addBalance(win);document.getElementById('mmResult').textContent=`🎉 ${state.attempts}次猜中！赢${win}！`;document.getElementById('mmResult').className='message msg-win';Engine.play('win');Engine.showQuote('win');state.bet=0;document.getElementById('mmBet').textContent='0';document.getElementById('mmGuessBtn').disabled=true;Engine.updateBalanceUI();return;}
      if(state.attempts>=state.maxAttempts){document.getElementById('mmResult').textContent=`😢 答案是${state.secret.map(c=>COLORS[c]).join('')}，输${state.bet}`;document.getElementById('mmResult').className='message msg-lose';Engine.play('lose');state.gameOver=true;state.bet=0;document.getElementById('mmBet').textContent='0';document.getElementById('mmGuessBtn').disabled=true;Engine.updateBalanceUI();}
      document.getElementById('mmInfo').textContent=`第${state.attempts}/${state.maxAttempts}次`;
    }
  };
})();