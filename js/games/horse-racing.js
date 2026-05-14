// ========== 赛马 🐎 (Horse Racing) ==========
(function() {
  let state={bet:0,choice:null,racing:false};
  const HORSES=[{id:'a',icon:'🐎',name:'赤兔',mult:2},{id:'b',icon:'🐎',name:'的卢',mult:3},{id:'c',icon:'🐎',name:'乌骓',mult:5},{id:'d',icon:'🐎',name:'绝影',mult:8}];
  const html=`<div class="game-page" id="page-horse-racing"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🐎 赛马</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="hrTrack" style="position:relative;width:100%;height:200px;background:linear-gradient(180deg,#4a7c3f,#3a6c2f);border-radius:8px;overflow:hidden;border:2px solid #555;"></div><div id="hrResult" class="message">选一匹马下注！</div></div><div class="bet-options" id="hrOptions"></div><div class="chips"><div class="chip chip-100" onclick="HR.bet(100)">100</div><div class="chip chip-500" onclick="HR.bet(500)">500</div><div class="chip chip-1000" onclick="HR.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="hrBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="hrGoBtn" onclick="HR.go()">开跑！</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);document.getElementById('hrOptions').innerHTML=HORSES.map((h,i)=>`<button class="bet-btn" data-choice="${h.id}" onclick="HR.select('${h.id}')">${h.icon} ${h.name} x${h.mult}</button>`).join('');const track=document.getElementById('hrTrack');HORSES.forEach((h,i)=>{const d=document.createElement('div');d.id=`hrH${i}`;d.textContent=h.icon;d.style.cssText=`position:absolute;left:10px;top:${20+i*45}px;font-size:2rem;transition:left 0.1s;`;track.appendChild(d);});});
  window.HR={
    select(c){state.choice=c;document.querySelectorAll('#page-horse-racing .bet-btn').forEach(b=>b.classList.remove('selected'));document.querySelector(`#page-horse-racing [data-choice="${c}"]`).classList.add('selected');Engine.play('click');},
    bet(a){if(state.racing)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('hrBet').textContent=state.bet;Engine.play('click');},
    go(){
      if(state.racing||state.bet<=0||!state.choice)return;state.racing=true;document.getElementById('hrGoBtn').disabled=true;Engine.play('spin');
      const pos=[0,0,0,0];let cnt=0;
      const iv=setInterval(()=>{pos.forEach((p,i)=>{pos[i]+=Engine.randomInt(1,5);const d=document.getElementById(`hrH${i}`);if(d)d.style.left=pos[i]+'px';});if(++cnt>40){clearInterval(iv);
        const idx=pos.indexOf(Math.max(...pos));const winner=HORSES[idx];
        const res=document.getElementById('hrResult');
        if(winner.id===state.choice){const win=state.bet*winner.mult;Engine.addBalance(win);res.textContent=`🎉 ${winner.icon}${winner.name}第一！赢 ${win}！`;res.className='message msg-win';Engine.play('win');Engine.showQuote('win');}
        else{res.textContent=`${winner.icon}${winner.name}第一，你押输了${state.bet}`;res.className='message msg-lose';Engine.play('lose');}
        state.bet=0;state.racing=false;document.getElementById('hrGoBtn').disabled=false;document.getElementById('hrBet').textContent='0';Engine.updateBalanceUI();
      }},80);
    }
  };
})();