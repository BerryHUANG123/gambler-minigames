// ========== 连连看 🔗 (Link Match) ==========
(function() {
  let state={bet:0,grid:[],selected:null,gameOver:false};const ICONS=['🍎','🍊','🍋','🍇','🍒','🍑','🍓','🍌'];
  function initGrid(){let g=[];for(let i=0;i<18;i++)g.push(ICONS[i%8]);return Engine.shuffle(g);}

  BaseGame.init('link-match', '🔗', '连连看', {
    tableHTML: '<div id="lmGrid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:3px;max-width:300px;margin:8px auto;"></div><div id="lmInfo" style="font-size:0.8rem;color:#888;">点击两个相同图标消除！</div><div id="lmResult" class="message"></div>',
    controlsHTML: '<button class="btn" onclick="LM.newGame()">新一局</button>'
  });

  window.link_matchBet = BaseGame.betHandler('link-match', state);
  window.LM={
    newGame(){state.grid=initGrid();state.selected=null;state.gameOver=false;LM.render();document.getElementById('lmInfo').textContent='点击两个相同图标消除！';document.getElementById('lmResult').textContent='';},
    render(){
      document.getElementById('lmGrid').innerHTML=state.grid.map((c,i)=>c?`<div onclick="LM.click(${i})" style="aspect-ratio:1;border-radius:8px;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer;border:2px solid ${state.selected===i?'var(--gold)':'#444'};transition:0.2s;">${c}</div>`:`<div style="aspect-ratio:1;border-radius:8px;"></div>`).join('');
      const left=state.grid.filter(c=>c).length;document.getElementById('lmInfo').textContent=`剩余${left}个方块`;
    },
    click(i){
      if(state.gameOver||state.bet<=0||!state.grid[i])return;
      if(state.selected===null){state.selected=i;LM.render();Engine.play('click');return;}
      if(state.selected===i){state.selected=null;LM.render();return;}
      const si=state.selected;state.selected=null;
      const r1=Math.floor(si/6),c1=si%6,r2=Math.floor(i/6),c2=i%6;
      if(state.grid[si]===state.grid[i]&&(r1===r2||c1===c2)){
        let blocked=false;
        if(r1===r2){const minC=Math.min(c1,c2),maxC=Math.max(c1,c2);for(let cc=minC+1;cc<maxC;cc++){if(state.grid[r1*6+cc]){blocked=true;break;}}}
        else{const minR=Math.min(r1,r2),maxR=Math.max(r1,r2);for(let rr=minR+1;rr<maxR;rr++){if(state.grid[rr*6+c1]){blocked=true;break;}}}
        if(!blocked){state.grid[si]=null;state.grid[i]=null;Engine.play('win');LM.render();
          if(state.grid.every(c=>!c)){const win=state.bet*3;Engine.addBalance(win);document.getElementById('lmResult').textContent=`🎉 全部消除！赢 ${win}！`;document.getElementById('lmResult').className='message msg-win';Engine.play('win');Engine.showQuote('win');state.gameOver=true;state.bet=0;document.getElementById('link_matchBet').textContent='0';Engine.updateBalanceUI();}
          return;}
      }
      LM.render();
    }
  };
})();
