// ========== 猜密码 🎨 (Mastermind) ==========
(function() {
  let state={bet:0,secret:[],guesses:[],attempts:0,maxAttempts:10,gameOver:false};
  const COLORS=['🔴','🔵','🟢','🟡','🟣','🟠'];
  function generateSecret(){const s=[];for(let i=0;i<4;i++)s.push(Engine.randomInt(0,6));return s;}
  const pickerHTML=Array(4).fill(0).map((_,i)=>`<div id="mmSlot${i}" onclick="MM.pickColor(${i})" style="width:50px;height:50px;border-radius:50%;background:#333;cursor:pointer;border:2px solid #555;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">?</div>`).join('');
  BaseGame.init('mastermind', '🎨', '猜密码', {
    tableHTML: `<div id="mmHistory" style="display:flex;flex-direction:column;gap:4px;width:100%;max-height:200px;overflow-y:auto;"></div><div id="mmPicker" style="display:flex;gap:4px;justify-content:center;margin:8px 0;">${pickerHTML}</div><div id="mmInfo" style="font-size:0.9rem;color:#888;">选择4个颜色猜密码</div><div id="mmResult" class="message"></div>`,
    controlsHTML: `<button class="btn btn-primary" id="mmGuessBtn" onclick="MM.guess()" disabled>猜！</button><button class="btn" id="mmStartBtn" onclick="MM.start()">新一局</button>`
  });
  window.MM={
    _pick:[0,0,0,0],
    _selected:0,
    bet: BaseGame.betHandler('mastermind', state),
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
      if(exact===4){state.gameOver=true;const bonus=Math.max(1,10-state.attempts+1);const win=state.bet*bonus;
        BaseGame.settle('mastermind', state, true, win);
        document.getElementById('mmResult').textContent=`🎉 ${state.attempts}次猜中！赢${win}！`;document.getElementById('mmResult').className='message msg-win';Engine.showQuote('win');
        document.getElementById('mmGuessBtn').disabled=true;return;}
      if(state.attempts>=state.maxAttempts){const lost=state.bet;
        BaseGame.settle('mastermind', state, false, 0);
        document.getElementById('mmResult').textContent=`😢 答案是${state.secret.map(c=>COLORS[c]).join('')}，输${lost}`;document.getElementById('mmResult').className='message msg-lose';
        state.gameOver=true;document.getElementById('mmGuessBtn').disabled=true;}
      document.getElementById('mmInfo').textContent=`第${state.attempts}/${state.maxAttempts}次`;
    }
  };
})();
