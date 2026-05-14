// ========== 记忆数字 🔢 (Memory Numbers) ==========
(function() {
  let state={bet:0,digits:4,number:'',gameOver:false,showing:false};
  const html=`<div class="game-page" id="page-memory-numbers"><div class="game-top"><button class="back-btn" onclick="Engine.backToHall()">← 大厅</button><h2>🔢 数字记忆</h2></div><div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div><div class="game-table"><div id="mnDisplay" style="font-size:3rem;color:var(--gold);margin:12px 0;letter-spacing:8px;">---</div><div id="mnInfo" style="font-size:0.9rem;color:#888;">数字会显示3秒后消失</div><div style="margin:8px 0;"><input type="text" id="mnInput" placeholder="输入记住的数字" style="padding:8px 16px;border-radius:8px;border:2px solid var(--gold);background:#222;color:var(--cream);font-size:1.2rem;width:200px;text-align:center;font-family:inherit;" onkeydown="if(event.key==='Enter')MN.check()"></div><div id="mnResult" class="message"></div></div><div class="chips"><div class="chip chip-100" onclick="MN.bet(100)">100</div><div class="chip chip-500" onclick="MN.bet(500)">500</div><div class="chip chip-1000" onclick="MN.bet(1000)">1000</div></div><div class="current-bet">下注：<span id="mnBet">0</span></div><div class="game-controls"><button class="btn btn-primary" id="mnShowBtn" onclick="MN.show()">显示数字</button><button class="btn" id="mnCheckBtn" onclick="MN.check()" disabled>确认</button></div></div>`;
  document.addEventListener('DOMContentLoaded',()=>{document.getElementById('gamePages').insertAdjacentHTML('beforeend',html);});
  window.MN={
    bet(a){if(state.gameOver)return;if(!Engine.canBet(a))return;state.bet+=a;Engine.state.balance-=a;Engine.save();Engine.updateBalanceUI();document.getElementById('mnBet').textContent=state.bet;Engine.play('click');},
    show(){
      if(state.bet<=0)return;state.number='';for(let i=0;i<state.digits;i++)state.number+=Engine.randomInt(0,9);
      document.getElementById('mnDisplay').textContent=state.number;document.getElementById('mnShowBtn').disabled=true;
      document.getElementById('mnInfo').textContent='记住这个数字！';Engine.play('click');
      setTimeout(()=>{document.getElementById('mnDisplay').textContent='---';document.getElementById('mnInfo').textContent='输入你记住的数字！';document.getElementById('mnCheckBtn').disabled=false;document.getElementById('mnInput').value='';document.getElementById('mnInput').focus();state.showing=true;},3000);
    },
    check(){
      if(!state.showing)return;const input=document.getElementById('mnInput').value.trim();
      if(input===state.number){state.digits++;const win=Math.floor(state.bet*(state.digits-4));Engine.addBalance(win);document.getElementById('mnResult').textContent=`✅ 正确！现在是${state.digits}位数字，赢 ${win}！`;document.getElementById('mnResult').className='message msg-win';Engine.play('win');
        state.showing=false;document.getElementById('mnCheckBtn').disabled=true;document.getElementById('mnShowBtn').disabled=false;document.getElementById('mnInfo').textContent='准备下一轮！';document.getElementById('mnInput').value='';}
      else{document.getElementById('mnResult').textContent=`❌ 错了！答案是${state.number}，输${state.bet}`;document.getElementById('mnResult').className='message msg-lose';Engine.play('lose');
        state.gameOver=true;state.bet=0;document.getElementById('mnBet').textContent='0';Engine.updateBalanceUI();}
    }
  };
})();