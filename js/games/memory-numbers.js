// ========== 记忆数字 🔢 (Memory Numbers) ==========
(function() {
  let state={bet:0,digits:4,number:'',gameOver:false,showing:false};
  BaseGame.init('memory-numbers', '🔢', '数字记忆', {
    tableHTML: '<div id="mnDisplay" style="font-size:3rem;color:var(--gold);margin:12px 0;letter-spacing:8px;">---</div><div id="mnInfo" style="font-size:0.9rem;color:#888;">数字会显示3秒后消失</div><div style="margin:8px 0;"><input type="text" id="mnInput" placeholder="输入记住的数字" style="padding:8px 16px;border-radius:8px;border:2px solid var(--gold);background:#222;color:var(--cream);font-size:1.2rem;width:200px;text-align:center;font-family:inherit;" onkeydown="if(event.key===\'Enter\')MN.check()"></div><div id="mnResult" class="message"></div>',
    controlsHTML: '<button class="btn btn-primary" id="mnShowBtn" onclick="MN.show()">显示数字</button><button class="btn" id="mnCheckBtn" onclick="MN.check()" disabled>确认</button>'
  });
  window.MN={
    bet: BaseGame.betHandler('memory-numbers', state),
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
      else{const bet=state.bet;BaseGame.settle('memory-numbers',state,false,0);document.getElementById('mnResult').textContent=`❌ 错了！答案是${state.number}，输${bet}`;document.getElementById('mnResult').className='message msg-lose';state.gameOver=true;}
    }
  };
})();
