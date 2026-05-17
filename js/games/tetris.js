// ========== 俄罗斯方块 🧱 (Tetris) ==========
(function() {
  let state={bet:0,board:[],piece:null,next:null,score:0,playing:false,timer:null,gameOver:false};
  const COLS=10,ROWS=20;
  const SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[1,1,1],[0,1,0]],[[1,1,1],[1,0,0]],[[1,1,1],[0,0,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];
  const COLORS=['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c'];
  function initBoard(){return Array(ROWS*COLS).fill(0);}
  function newPiece(){const type=Engine.randomInt(0,SHAPES.length-1);return{shape:SHAPES[type],color:COLORS[type],x:3,y:0};}
  function rotate(s){const r=s[0].length,c=s.length;const ns=[];for(let i=0;i<r;i++){ns[i]=[];for(let j=0;j<c;j++)ns[i][j]=s[c-1-j][i];}return ns;}
  function collides(b,p,px,py){const s=p.shape||p;for(let r=0;r<s.length;r++)for(let c=0;c<s[0].length;c++){if(s[r][c]){const bx=px+c,by=py+r;if(bx<0||bx>=COLS||by>=ROWS||(by>=0&&b[by*COLS+bx]))return true;}}return false;}
  function lock(b,p){const s=p.shape;for(let r=0;r<s.length;r++)for(let c=0;c<s[0].length;c++){if(s[r][c]){const x=p.x+c,y=p.y+r;if(y>=0)b[y*COLS+x]=p.color;}}}
  function clearLines(b){let cleared=0;for(let r=ROWS-1;r>=0;r--){if(b.slice(r*COLS,(r+1)*COLS).every(c=>c)){b.splice(r*COLS,COLS);b.unshift(...Array(COLS).fill(0));cleared++;r++;}}return cleared;}
  BaseGame.init('tetris', '🧱', '俄罗斯方块', {
    tableHTML: `<div style="display:flex;gap:8px;justify-content:center;"><div id="ttBoard" style="display:grid;grid-template-columns:repeat(${COLS},1fr);gap:1px;background:#111;padding:2px;border-radius:4px;width:180px;"></div><div><div id="ttNext" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#111;padding:2px;border-radius:4px;width:72px;margin-bottom:8px;"></div><div style="font-size:0.8rem;">得分：<span id="ttScore" style="color:var(--gold);">0</span></div></div></div><div id="ttResult" class="message"></div>`,
    controlsHTML: `<div style="display:grid;grid-template-columns:repeat(5,36px);gap:3px;margin:4px auto;"><button class="btn btn-sm" style="grid-column:2;" onclick="TT.rotate()">↻</button><button class="btn btn-sm" onclick="TT.move(-1)">←</button><button class="btn btn-sm" style="grid-column:2;" onclick="TT.drop()">↓</button><button class="btn btn-sm" onclick="TT.move(1)">→</button><button class="btn btn-sm" style="grid-column:2;" onclick="TT.hardDrop()">⬇</button></div><button class="btn btn-primary" id="ttStartBtn" onclick="TT.start()">开始！</button>`
  });
  window.TT={
    bet: BaseGame.betHandler('tetris', state),
    start(){if(state.bet<=0)return;state.board=initBoard();state.score=0;state.playing=true;state.gameOver=false;state.piece=newPiece();state.next=newPiece();document.getElementById('ttStartBtn').disabled=true;document.getElementById('ttScore').textContent='0';document.addEventListener('keydown',TT.keyHandler);TT.render();state.timer=setInterval(()=>TT.tick(),400);},
    tick(){
      if(!state.playing)return;
      if(!collides(state.board,state.piece.shape,state.piece.x,state.piece.y+1)){state.piece.y++;TT.render();return;}
      lock(state.board,state.piece);Engine.play('click');
      const cl=clearLines(state.board);if(cl>0){state.score+=cl*100;document.getElementById('ttScore').textContent=state.score;Engine.play('win');}
      state.piece=state.next;state.next=newPiece();
      if(collides(state.board,state.piece.shape,state.piece.x,state.piece.y)){TT.end();return;}
      TT.render();
    },
    move(dx){if(!state.playing||!state.piece)return;if(!collides(state.board,state.piece.shape,state.piece.x+dx,state.piece.y)){state.piece.x+=dx;TT.render();}},
    rotate(){if(!state.playing||!state.piece)return;const ns=rotate(state.piece.shape);if(!collides(state.board,ns,state.piece.x,state.piece.y)){state.piece.shape=ns;TT.render();}},
    drop(){if(!state.playing||!state.piece)return;if(!collides(state.board,state.piece.shape,state.piece.x,state.piece.y+1)){state.piece.y++;TT.render();}},
    hardDrop(){if(!state.playing||!state.piece)return;while(!collides(state.board,state.piece.shape,state.piece.x,state.piece.y+1))state.piece.y++;TT.tick();},
    keyHandler(e){if(e.key==='ArrowLeft')TT.move(-1);if(e.key==='ArrowRight')TT.move(1);if(e.key==='ArrowUp')TT.rotate();if(e.key==='ArrowDown')TT.drop();if(e.key===' ')TT.hardDrop();},
    render(){
      const display=Array(ROWS*COLS).fill(0);
      if(state.piece){const s=state.piece.shape;for(let r=0;r<s.length;r++)for(let c=0;c<s[0].length;c++){if(s[r][c]){const x=state.piece.x+c,y=state.piece.y+r;if(y>=0&&y<ROWS&&x>=0&&x<COLS)display[y*COLS+x]=state.piece.color;}}}
      state.board.forEach((c,i)=>{if(c)display[i]=c;});
      document.getElementById('ttBoard').innerHTML=display.map(c=>`<div style="aspect-ratio:1;background:${c||'#1a1a2e'};border-radius:1px;"></div>`).join('');
      if(state.next){const s=state.next.shape;const nd=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++){nd.push(r<s.length&&c<s[0].length&&s[r][c]?state.next.color:0);}
        document.getElementById('ttNext').innerHTML=nd.map(c=>`<div style="aspect-ratio:1;background:${c||'#111'};border-radius:1px;"></div>`).join('');}
    },
    end(){state.playing=false;clearInterval(state.timer);document.removeEventListener('keydown',TT.keyHandler);
      const win=Math.floor(state.bet*(1+state.score*0.01));if(state.score>0)Engine.addBalance(win);
      document.getElementById('ttResult').textContent=state.score>0?`🎉 ${state.score}分！赢${win}！`:`游戏结束，输${state.bet}`;
      document.getElementById('ttResult').className=state.score>0?'message msg-win':'message msg-lose';if(state.score>=500)Engine.showQuote('win');
      state.bet=0;document.getElementById('tetrisBet').textContent='0';document.getElementById('ttStartBtn').disabled=false;Engine.updateBalanceUI();}
  };
})();
