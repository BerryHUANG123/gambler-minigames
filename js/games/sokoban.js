// ========== 推箱子 📦 (Sokoban) ==========
(function() {
  let state={bet:0,grid:[],moves:0,level:0,gameOver:false,started:false};
  const LEVELS=[
    {w:5,h:5,map:['www.','wb..','w.p.','w...','www.']},
    {w:5,h:5,map:['www..','w.bw.','w.pw.','w..w.','wwww.']},
    {w:6,h:6,map:['wwwww.','w...w.','w.b.w.','w.p.w.','w...w.','wwwww.']},
  ];
  function parseLevel(lv){const l=LEVELS[lv];const g=[];let px,py,bx,by;
    for(let r=0;r<l.h;r++){for(let c=0;c<l.w;c++){const ch=l.map[r][c];if(ch==='p'){px=r;py=c;g.push('.');}else if(ch==='b'){bx=r;by=c;g.push('b');}else if(ch==='g'){g.push('g');}else{g.push(ch);}}}
    return{grid:g,px,py,bx,by,w:l.w,h:l.h};}
  function checkWin(g,goalR,goalC,w){return g[goalR*w+goalC]==='b';}
  BaseGame.init('sokoban', '📦', '推箱子', {
    tableHTML: '<div id="skGrid" style="display:grid;gap:2px;margin:8px auto;"></div><div style="font-size:0.9rem;">关卡<span id="skLevel">1</span>/3 步数：<span id="skMoves" style="color:var(--gold);">0</span></div><div id="skResult" class="message">把箱子推到目标位置！</div>',
    controlsHTML: '<div style="display:grid;grid-template-columns:repeat(3,40px);gap:4px;margin:6px auto;"><button class="btn btn-sm" style="grid-column:2;" onclick="SK.move(-1,0)">↑</button><button class="btn btn-sm" onclick="SK.move(0,-1)">←</button><button class="btn btn-sm" onclick="SK.move(1,0)">↓</button><button class="btn btn-sm" onclick="SK.move(0,1)">→</button></div><button class="btn btn-primary" id="skStartBtn" onclick="SK.start()">开始！</button>'
  });
  BaseGame.betHandler('sokoban', state);
  window.SK={
    start(){if(state.bet<=0)return;state.level=0;state.moves=0;state.gameOver=false;state.started=true;document.getElementById('skStartBtn').disabled=true;SK.loadLevel();},
    loadLevel(){const ld=parseLevel(state.level);state.grid=ld.grid;state.px=ld.px;state.py=ld.py;state.w=ld.w;state.h=ld.h;document.getElementById('skGrid').style.gridTemplateColumns='repeat('+ld.w+',1fr)';document.getElementById('skLevel').textContent=state.level+1;SK.render();},
    render(){
      document.getElementById('skGrid').innerHTML=state.grid.map((c,i)=>{
        const r=Math.floor(i/state.w),col=i%state.w;
        if(r===state.px&&col===state.py)return'<div style="aspect-ratio:1;border-radius:6px;background:#3498db;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🧑</div>';
        if(c==='w')return'<div style="aspect-ratio:1;border-radius:4px;background:#444;"></div>';
        if(c==='b')return'<div style="aspect-ratio:1;border-radius:6px;background:#8b4513;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📦</div>';
        if(c==='g')return'<div style="aspect-ratio:1;border-radius:6px;background:#2ecc71;border:2px dashed #888;"></div>';
        return'<div style="aspect-ratio:1;border-radius:4px;background:#1a1a2e;"></div>';
      }).join('');
    },
    move(dr,dc){
      if(state.gameOver||!state.started)return;
      const nr=state.px+dr,nc=state.py+dc;
      if(nr<0||nr>=state.h||nc<0||nc>=state.w)return;
      const ni=nr*state.w+nc;
      if(state.grid[ni]==='w')return;
      if(state.grid[ni]==='b'){const nnr=nr+dr,nnc=nc+dc;if(nnr<0||nnr>=state.h||nnc<0||nnc>=state.w)return;const nni=nnr*state.w+nnc;if(state.grid[nni]!=='.')return;
        state.grid[ni]='.';state.grid[nni]='b';}
      state.px=nr;state.py=nc;state.moves++;document.getElementById('skMoves').textContent=state.moves;Engine.play('click');SK.render();
      const ld=parseLevel(state.level);
      for(let r=0;r<state.h;r++)for(let c=0;c<state.w;c++){if(ld.map[r][c]==='g'&&state.grid[r*state.w+c]==='b'){
        state.level++;if(state.level>=LEVELS.length){state.gameOver=true;state.started=false;const w=state.bet*3;BaseGame.settle('sokoban',state,true,w);document.getElementById('skResult').textContent='🎉 通关！赢'+w+'！';document.getElementById('skResult').className='message msg-win';document.getElementById('skStartBtn').disabled=false;return;}
        document.getElementById('skResult').textContent='🎉 过关！下一关！';setTimeout(()=>SK.loadLevel(),500);return;}}
    }
  };
})();
