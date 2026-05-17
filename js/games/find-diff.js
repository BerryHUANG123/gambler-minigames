// ========== 找不同 🔍 (Find Difference) ==========
(function() {
  let state={bet:0,diffs:[],found:[],gameOver:false,startTime:0};
  const EMOJIS='🍎🍊🍋🍇🍒🍑🍓🍌🥝🍉';
  function newGame(){state.diffs=[];state.found=[];const set=new Set();while(set.size<5){set.add(Engine.randomInt(0,19));}state.diffs=[...set];}

  BaseGame.init('find-diff', '🔍', '找不同', {
    tableHTML: '<div style="display:flex;gap:4px;"><div id="fdLeft" style="display:grid;grid-template-columns:repeat(5,1fr);gap:2px;flex:1;"></div><div id="fdRight" style="display:grid;grid-template-columns:repeat(5,1fr);gap:2px;flex:1;"></div></div><div id="fdInfo" style="font-size:0.8rem;color:#888;">找5处不同！点击不同的位置。</div><div id="fdResult" class="message"></div>'
  });

  window.find_diffBet = BaseGame.betHandler('find-diff', state);
  window.FD={
    start(){newGame();state.startTime=Date.now();state.gameOver=false;FD.render();document.getElementById('fdInfo').textContent='找到5处不同！';},
    render(){
      const l=document.getElementById('fdLeft'),r=document.getElementById('fdRight');
      l.innerHTML='';r.innerHTML='';
      for(let i=0;i<20;i++){const e='😊';const isDiff=state.diffs.includes(i);const f=state.found.includes(i);
        l.innerHTML+=`<div onclick="FD.click(${i},'l')" style="${f?'border:2px solid var(--gold);':''}aspect-ratio:1;border-radius:4px;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;border:2px solid #444;">${EMOJIS[i%EMOJIS.length]}</div>`;
        r.innerHTML+=`<div onclick="FD.click(${i},'r')" style="${f?'border:2px solid var(--gold);':''}aspect-ratio:1;border-radius:4px;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;border:2px solid ${isDiff?'#e74c3c':'#444'};">${isDiff?EMOJIS[(i+3)%EMOJIS.length]:EMOJIS[i%EMOJIS.length]}</div>`;
      }
    },
    click(i){
      if(state.gameOver||state.bet<=0)return;
      if(state.diffs.includes(i)&&!state.found.includes(i)){state.found.push(i);Engine.play('click');FD.render();
        if(state.found.length>=5){const time=Math.floor((Date.now()-state.startTime)/1000);const bonus=Math.max(1,30-time);const win=state.bet*bonus;Engine.addBalance(win);document.getElementById('fdResult').textContent=`🎉 全找到！用时${time}秒，赢 ${win}！`;document.getElementById('fdResult').className='message msg-win';Engine.play('win');Engine.showQuote('win');state.gameOver=true;state.bet=0;document.getElementById('find_diffBet').textContent='0';Engine.updateBalanceUI();}
        document.getElementById('fdInfo').textContent=`找到 ${state.found.length}/5 处不同！`;}
    }
  };
})();
