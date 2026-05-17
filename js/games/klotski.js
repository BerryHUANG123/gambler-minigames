// ========== 华容道 🧩 (Klotski) ==========
(function() {
  let state={bet:0,grid:[],moves:0,gameOver:false,started:false};
  // 0=空,1=兵,2=曹操(2x2左上角)
  function initGrid(){return[2,2,1,1,2,2,1,0,1,1,1,1,1,1,1,1];}
  function isSolved(g){return g[6]===2&&g[7]===2&&g[10]===2&&g[11]===2;}
  const SYM={0:' ',1:'\u2694\uFE0F',2:'\uD83D\uDC51'};

  BaseGame.init('klotski', '\uD83E\uDDE9', '\u534E\u5BB9\u9053', {
    tableHTML: '<div id="klGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:3px;max-width:220px;margin:8px auto;"></div><div style="font-size:0.9rem;">\u6B65\u6570\uFF1A<span id="klMoves" style="color:var(--gold);">0</span></div><div id="klResult" class="message">\u8BA9\u66F9\u64CD(👑)\u4ECE\u4E0B\u9762\u9003\u51FA\u53BB\uFF01</div>',
    controlsHTML: '<button class="btn btn-primary" id="klStartBtn" onclick="KL.start()">\u5F00\u59CB\uFF01</button>'
  });

  BaseGame.betHandler('klotski', state);

  window.KL={
    start(){if(state.bet<=0)return;state.grid=initGrid();state.moves=0;state.gameOver=false;state.started=true;document.getElementById('klStartBtn').disabled=true;document.getElementById('klMoves').textContent='0';KL.render();},
    render(){
      document.getElementById('klGrid').innerHTML=state.grid.map((v,i)=>{
        const isCao=v===2;const r=Math.floor(i/4),c=i%4;
        if(isCao){
          if(c<3&&r<3&&state.grid[i+1]===2&&state.grid[i+4]===2&&state.grid[i+5]===2)
            return'<div onclick="KL.move('+i+')" style="grid-column:'+(c+1)+'/'+(c+3)+';grid-row:'+(r+1)+'/'+(r+3)+';border-radius:10px;background:linear-gradient(135deg,#c0392b,#8b0000);display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;border:2px solid var(--gold);">👑</div>';
          return'';}
        return v===1?'<div onclick="KL.move('+i+')" style="aspect-ratio:1;border-radius:6px;background:#2c2c3e;display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer;border:1px solid #555;">\u2694\uFE0F</div>':'<div style="aspect-ratio:1;"></div>';
      }).filter((_,i)=>state.grid[i]!==2||(i%4<3&&Math.floor(i/4)<3&&state.grid[i+1]===2&&state.grid[i+4]===2&&state.grid[i+5]===2)).join('');
    },
    move(i){
      if(state.gameOver||!state.started)return;const v=state.grid[i];if(v===0)return;
      const r=Math.floor(i/4),c=i%4;const dirs=[[0,1],[0,-1],[1,0],[-1,0]];let moved=false;
      for(const[dr,dc]of dirs){
        const nr=r+dr,nc=c+dc;if(nr<0||nr>=4||nc<0||nc>=4)continue;
        const ni=nr*4+nc;if(state.grid[ni]===0){
          if(v===2){
            const r2=r+(dr||1),c2=c+(dc||1);
            if(r2>=0&&r2<4&&c2>=0&&c2<4&&state.grid[ni+dr*4+dc]===0){[state.grid[i],state.grid[ni],state.grid[i+(dr||1)*4+(dc||0)],state.grid[ni+(dr||1)*4+(dc||0)]]=[0,2,0,2];moved=true;break;}
          }else{[state.grid[i],state.grid[ni]]=[0,1];moved=true;break;}
        }
      }
      if(moved){state.moves++;document.getElementById('klMoves').textContent=state.moves;Engine.play('click');KL.render();
        if(isSolved(state.grid)){state.gameOver=true;state.started=false;const bonus=Math.max(1,30-state.moves);const win=state.bet*bonus;BaseGame.settle('klotski',state,true,win);document.getElementById('klResult').textContent='\uD83C\uDF89 \u66F9\u64CD\u9003\u51FA\u53BB\u4E86\uFF01\u8D62'+win+'\uFF01';document.getElementById('klResult').className='message msg-win';document.getElementById('klStartBtn').disabled=false;}}
    }
  };
})();
