// ========== 皮克松赌场 — 游戏工厂 ==========
// 模板化批量生成小游戏，从配置数据自动创建完整可玩的游戏页面

const GameFactory = {
  // ===== 工厂方法：根据模板类型创建游戏 =====

  /** 猜数字类模板 */
  createGuessGame(id, opts) {
    const { name, icon, min = 1, max = 10, desc, attempts = 5, multiplier = 5 } = opts;
    const ns = id.replace(/-/g,'_');
    const state = { bet: 0, target: 0, guesses: 0, gameOver: false };

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('gamePages').insertAdjacentHTML('beforeend', `
      <div class="game-page" id="page-${id}">
        <div class="game-top">
          <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
          <h2>${icon} ${name}</h2>
        </div>
        <div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div>
        <div class="game-table">
          <div style="font-size:3rem;" id="${ns}Display">${icon}</div>
          <div id="${ns}Hint" class="message msg-info">${desc} 猜${min}-${max}，${attempts}次机会</div>
          <div id="${ns}Result" class="message"></div>
          <div style="margin:8px 0;"><input type="number" id="${ns}Input" min="${min}" max="${max}" placeholder="输入数字" style="padding:8px 16px;border-radius:8px;border:2px solid var(--gold);background:#222;color:var(--cream);font-size:1.2rem;width:120px;text-align:center;font-family:inherit;"></div>
          <div id="${ns}Guesses" style="font-size:0.8rem;color:#888;"></div>
        </div>
        <div class="chips">
          <div class="chip chip-100" onclick="${ns}Bet(100)">100</div>
          <div class="chip chip-500" onclick="${ns}Bet(500)">500</div>
          <div class="chip chip-1000" onclick="${ns}Bet(1000)">1000</div>
        </div>
        <div class="current-bet">下注：<span id="${ns}Bet">0</span></div>
        <div class="game-controls">
          <button class="btn btn-primary" id="${ns}GuessBtn" onclick="${ns}Guess()">猜！</button>
          <button class="btn" onclick="${ns}Reset()">新一局</button>
        </div>
      </div>`);
    });

    window[`${ns}Bet`] = (amount) => {
      if (state.gameOver) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById(`${ns}Bet`).textContent = state.bet;
      Engine.play('click');
      if (state.bet > 0 && state.target === 0) {
        state.target = Engine.randomInt(min, max);
        state.guesses = 0;
        document.getElementById(`${ns}Hint`).textContent = `猜${min}-${max}之间的数字！`;
      }
    };

    window[`${ns}Guess`] = () => {
      if (state.gameOver || state.bet <= 0) return;
      const input = document.getElementById(`${ns}Input`);
      const val = parseInt(input.value);
      if (isNaN(val) || val < min || val > max) return;

      state.guesses++;
      Engine.play('click');
      const res = document.getElementById(`${ns}Result`);
      if (val === state.target) {
        const win = state.bet * multiplier;
        Engine.addBalance(win);
        res.textContent = `🎉 对了！就是${val}！赢 ${win} 筹码！`;
        res.className = 'message msg-win';
        Engine.play('win');
        Engine.showQuote('win');
        document.getElementById(`${ns}Display`).textContent = `🎉 ${val}`;
        state.gameOver = true;
      } else if (state.guesses >= attempts) {
        res.textContent = `😢 次数用完了，答案是${state.target}，输 ${state.bet}`;
        res.className = 'message msg-lose';
        Engine.play('lose');
        document.getElementById(`${ns}Display`).textContent = `💀 ${state.target}`;
        state.gameOver = true;
      } else {
        const hint = val < state.target ? '小了' : '大了';
        res.textContent = `${val} ${hint}，还有${attempts - state.guesses}次机会`;
        res.className = 'message msg-info';
        Engine.play('click');
      }
      document.getElementById(`${ns}Guesses`).textContent = `已猜：${state.guesses}/${attempts}`;
      input.value = '';
      input.focus();
    };

    window[`${ns}Reset`] = () => {
      state.bet = 0; state.target = 0; state.guesses = 0; state.gameOver = false;
      document.getElementById(`${ns}Bet`).textContent = '0';
      document.getElementById(`${ns}Hint`).textContent = desc;
      document.getElementById(`${ns}Result`).textContent = '';
      document.getElementById(`${ns}Result`).className = 'message';
      document.getElementById(`${ns}Guesses`).textContent = '';
      document.getElementById(`${ns}Display`).textContent = icon;
      document.getElementById(`${ns}Input`).value = '';
      Engine.updateBalanceUI();
    };
  },

  /** 问答/选择题模板 */
  createQuizGame(id, opts) {
    const { name, icon, desc, questions } = opts;
    const ns = id.replace(/-/g,'_');
    const state = { bet: 0, qIdx: 0, score: 0, total: questions.length, answered: false, gameOver: false };

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('gamePages').insertAdjacentHTML('beforeend', `
      <div class="game-page" id="page-${id}">
        <div class="game-top">
          <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
          <h2>${icon} ${name}</h2>
        </div>
        <div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div>
        <div class="game-table">
          <div id="${ns}Progress" style="font-size:0.8rem;color:#888;margin-bottom:8px;"></div>
          <div id="${ns}Question" style="font-size:1.1rem;color:var(--cream);margin:12px 0;"></div>
          <div id="${ns}Options" style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:360px;margin:8px auto;"></div>
          <div id="${ns}Result" class="message"></div>
          <div id="${ns}Final" style="font-size:1.2rem;font-weight:bold;color:var(--gold);"></div>
        </div>
        <div class="chips">
          <div class="chip chip-100" onclick="${ns}Bet(100)">100</div>
          <div class="chip chip-500" onclick="${ns}Bet(500)">500</div>
          <div class="chip chip-1000" onclick="${ns}Bet(1000)">1000</div>
        </div>
        <div class="current-bet">下注：<span id="${ns}Bet">0</span></div>
        <div class="game-controls">
          <button class="btn" id="${ns}NextBtn" onclick="${ns}Next()" style="display:none;">下一题</button>
          <button class="btn" onclick="${ns}Reset()">重新开始</button>
        </div>
      </div>`);
    });

    window[`${ns}Bet`] = (amount) => {
      if (state.gameOver) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById(`${ns}Bet`).textContent = state.bet;
      Engine.play('click');
      if (state.bet > 0 && state.qIdx === 0) window[`${ns}ShowQuestion`]();
    };

    window[`${ns}ShowQuestion`] = () => {
      if (state.qIdx >= state.total) { window[`${ns}End`](); return; }
      const q = questions[state.qIdx];
      document.getElementById(`${ns}Progress`).textContent = `第 ${state.qIdx + 1}/${state.total} 题`;
      document.getElementById(`${ns}Question`).textContent = q.q;
      document.getElementById(`${ns}Options`).innerHTML = q.options.map((o, i) =>
        `<button class="bet-btn" onclick="${ns}Answer(${i})" style="width:100%;">${o}</button>`
      ).join('');
      document.getElementById(`${ns}Result`).textContent = '';
      document.getElementById(`${ns}NextBtn`).style.display = 'none';
      state.answered = false;
    };

    window[`${ns}Answer`] = (idx) => {
      if (state.answered) return;
      state.answered = true;
      const q = questions[state.qIdx];
      const correct = idx === q.a;
      const res = document.getElementById(`${ns}Result`);
      if (correct) {
        state.score++;
        res.textContent = `✅ 正确！`;
        res.className = 'message msg-win';
        Engine.play('win');
      } else {
        res.textContent = `❌ 错误！正确答案是：${q.options[q.a]}`;
        res.className = 'message msg-lose';
        Engine.play('lose');
      }
      document.querySelectorAll(`#page-${id} .bet-btn`).forEach((b, i) => {
        b.style.borderColor = i === q.a ? 'var(--gold)' : '#555';
        b.style.background = i === q.a ? 'rgba(212,175,55,0.15)' : 'transparent';
      });
      document.getElementById(`${ns}NextBtn`).style.display = 'inline-block';
    };

    window[`${ns}Next`] = () => {
      state.qIdx++;
      window[`${ns}ShowQuestion`]();
    };

    window[`${ns}End`] = () => {
      state.gameOver = true;
      const pct = state.score / state.total;
      const win = Math.floor(state.bet * (1 + pct * 2));
      Engine.addBalance(win);
      document.getElementById(`${ns}Final`).textContent =
        `🎉 答对 ${state.score}/${state.total} 题，赢得 ${win} 筹码！`;
      if (pct >= 0.8) Engine.showQuote('jackpot');
      else if (pct >= 0.5) Engine.showQuote('win');
      Engine.play('win');
    };

    window[`${ns}Reset`] = () => {
      state.bet = 0; state.qIdx = 0; state.score = 0; state.answered = false; state.gameOver = false;
      document.getElementById(`${ns}Bet`).textContent = '0';
      document.getElementById(`${ns}Question`).textContent = '';
      document.getElementById(`${ns}Options`).innerHTML = '';
      document.getElementById(`${ns}Result`).textContent = '';
      document.getElementById(`${ns}Final`).textContent = '';
      document.getElementById(`${ns}Progress`).textContent = '';
      document.getElementById(`${ns}NextBtn`).style.display = 'none';
      Engine.updateBalanceUI();
    };
  },

  /** 反应点击类模板 */
  createReactionGame(id, opts) {
    const { name, icon, desc, type = 'click', timeLimit = 10 } = opts;
    const ns = id.replace(/-/g,'_');
    const state = { bet: 0, score: 0, playing: false, timeLeft: 0, timer: null };

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('gamePages').insertAdjacentHTML('beforeend', `
      <div class="game-page" id="page-${id}">
        <div class="game-top">
          <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
          <h2>${icon} ${name}</h2>
        </div>
        <div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div>
        <div class="game-table">
          <div id="${ns}GameArea" style="position:relative;width:100%;height:200px;background:rgba(0,0,0,0.3);border-radius:12px;overflow:hidden;cursor:pointer;">
            <div id="${ns}Target" style="position:absolute;font-size:3rem;cursor:pointer;display:none;transition:all 0.1s;"></div>
            <div id="${ns}Ready" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#888;">下注后开始游戏</div>
          </div>
          <div style="display:flex;justify-content:space-between;width:100%;margin-top:6px;">
            <span>得分：<span id="${ns}Score" style="color:var(--gold);">0</span></span>
            <span>时间：<span id="${ns}Time" style="color:var(--gold);">${timeLimit}</span>s</span>
          </div>
          <div id="${ns}Result" class="message"></div>
        </div>
        <div class="chips">
          <div class="chip chip-100" onclick="${ns}Bet(100)">100</div>
          <div class="chip chip-500" onclick="${ns}Bet(500)">500</div>
          <div class="chip chip-1000" onclick="${ns}Bet(1000)">1000</div>
        </div>
        <div class="current-bet">下注：<span id="${ns}Bet">0</span></div>
        <div class="game-controls">
          <button class="btn btn-primary" id="${ns}StartBtn" onclick="${ns}Start()">开始！</button>
        </div>
      </div>`);
    });

    window[`${ns}Bet`] = (amount) => {
      if (state.playing) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById(`${ns}Bet`).textContent = state.bet;
      Engine.play('click');
    };

    window[`${ns}Start`] = () => {
      if (state.playing || state.bet <= 0) return;
      state.playing = true;
      state.score = 0;
      state.timeLeft = timeLimit;
      document.getElementById(`${ns}StartBtn`).disabled = true;
      document.getElementById(`${ns}Ready`).style.display = 'none';
      document.getElementById(`${ns}Score`).textContent = '0';
      document.getElementById(`${ns}Time`).textContent = timeLimit;
      document.getElementById(`${ns}Result`).textContent = '';
      const area = document.getElementById(`${ns}GameArea`);
      const target = document.getElementById(`${ns}Target`);
      target.style.display = 'block';
      target.onclick = () => { if (state.playing) window[`${ns}Hit`](); };

      state.timer = setInterval(() => {
        state.timeLeft--;
        document.getElementById(`${ns}Time`).textContent = state.timeLeft;
        window[`${ns}SpawnTarget`]();
        if (state.timeLeft <= 0) window[`${ns}End`]();
      }, 1000);
      window[`${ns}SpawnTarget`]();
    };

    window[`${ns}SpawnTarget`] = () => {
      const area = document.getElementById(`${ns}GameArea`);
      const target = document.getElementById(`${ns}Target`);
      if (!area || !target) return;
      const icons = {
        'click': ['🎯','⭐','💎','💰','👑'], 'mole': ['🐹','🐰','🐱','🐶','🦊'],
        'coin': ['🪙','💰','💵','💎','🥇'], 'apple': ['🍎','🍊','🍇','🍑','🍒'],
        'dart': ['🎯','🎯','🎯','🎯','🎯']
      };
      const pool = icons[type] || icons.click;
      target.textContent = pool[Math.floor(Math.random() * pool.length)];
      const w = area.clientWidth - 60;
      const h = area.clientHeight - 60;
      target.style.left = Engine.randomInt(0, w) + 'px';
      target.style.top = Engine.randomInt(0, h) + 'px';
    };

    window[`${ns}Hit`] = () => {
      state.score++;
      document.getElementById(`${ns}Score`).textContent = state.score;
      Engine.play('click');
      window[`${ns}SpawnTarget`]();
    };

    window[`${ns}End`] = () => {
      state.playing = false;
      clearInterval(state.timer);
      document.getElementById(`${ns}Target`).style.display = 'none';
      document.getElementById(`${ns}StartBtn`).disabled = false;
      const win = Math.floor(state.bet * (1 + state.score * 0.2));
      Engine.addBalance(win);
      const res = document.getElementById(`${ns}Result`);
      res.textContent = `⏰ 时间到！击中 ${state.score} 次，赢得 ${win} 筹码！`;
      res.className = state.score >= 5 ? 'message msg-win' : 'message';
      if (state.score >= 8) Engine.showQuote('jackpot');
      else if (state.score >= 5) Engine.showQuote('win');
      state.bet = 0;
      document.getElementById(`${ns}Bet`).textContent = '0';
      document.getElementById(`${ns}Ready`).style.display = 'block';
      document.getElementById(`${ns}Ready`).textContent = '再来一局！';
      Engine.updateBalanceUI();
    };
  },

  /** 转盘抽奖类模板 */
  createWheelGame(id, opts) {
    const { name, icon, desc, segments } = opts;
    const ns = id.replace(/-/g,'_');
    const state = { bet: 0, spinning: false };

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('gamePages').insertAdjacentHTML('beforeend', `
      <div class="game-page" id="page-${id}">
        <div class="game-top">
          <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
          <h2>${icon} ${name}</h2>
        </div>
        <div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div>
        <div class="game-table">
          <div id="${ns}Display" style="font-size:3rem;margin:8px 0;">${icon}</div>
          <div id="${ns}Result" style="font-size:1.5rem;font-weight:bold;min-height:40px;color:var(--gold);">?</div>
          <div id="${ns}Msg" class="message"></div>
        </div>
        <div class="chips">
          <div class="chip chip-100" onclick="${ns}Bet(100)">100</div>
          <div class="chip chip-500" onclick="${ns}Bet(500)">500</div>
          <div class="chip chip-1000" onclick="${ns}Bet(1000)">1000</div>
        </div>
        <div class="current-bet">下注：<span id="${ns}Bet">0</span></div>
        <div class="game-controls">
          <button class="btn btn-primary" id="${ns}SpinBtn" onclick="${ns}Spin()">转！</button>
        </div>
      </div>`);
    });

    window[`${ns}Bet`] = (amount) => {
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById(`${ns}Bet`).textContent = state.bet; Engine.play('click');
    };

    window[`${ns}Spin`] = () => {
      if (state.spinning || state.bet <= 0) return;
      state.spinning = true;
      document.getElementById(`${ns}SpinBtn`).disabled = true;
      Engine.play('spin');
      let count = 0;
      const iv = setInterval(() => {
        const r = segments[Engine.randomInt(0, segments.length - 1)];
        document.getElementById(`${ns}Display`).textContent = r.icon || '🎰';
        document.getElementById(`${ns}Result`).textContent = r.label || '?';
        if (++count > 18) {
          clearInterval(iv);
          const idx = Engine.randomInt(0, segments.length - 1);
          const result = segments[idx];
          const mult = result.mult || 0;
          document.getElementById(`${ns}Display`).textContent = result.icon || icon;
          document.getElementById(`${ns}Result`).textContent = result.label;
          const msg = document.getElementById(`${ns}Msg`);
          if (mult > 0) {
            const win = Math.floor(state.bet * mult);
            Engine.addBalance(win);
            msg.textContent = `🎉 中了！赢 ${win} 筹码！`;
            msg.className = 'message msg-win';
            Engine.play('win');
            if (mult >= 5) Engine.showQuote('jackpot');
            else Engine.showQuote('win');
          } else {
            msg.textContent = `💀 没中，输 ${state.bet}`;
            msg.className = 'message msg-lose';
            Engine.play('lose');
          }
          state.bet = 0; state.spinning = false;
          document.getElementById(`${ns}SpinBtn`).disabled = false;
          document.getElementById(`${ns}Bet`).textContent = '0';
          Engine.updateBalanceUI();
        }
      }, 80);
    };
  },

  /** 记忆翻牌类模板 */
  createMemoryGame(id, opts) {
    const { name, icon, desc, pairs = 6 } = opts;
    const ns = id.replace(/-/g,'_');
    const state = { bet: 0, cards: [], flipped: [], matched: 0, total: pairs, locked: false, started: false };

    const EMOJIS = ['🍎','🍊','🍋','🍇','🍒','🍑','🍓','🍌','🥝','🍉','🍍','🥭','🫐','🍈','🍐','🥑',
                     '🐶','🐱','🐰','🐼','🐨','🦊','🐸','🐵','🦁','🐯','🐮','🐷','🐭','🐹','🐻','🐨'];

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('gamePages').insertAdjacentHTML('beforeend', `
      <div class="game-page" id="page-${id}">
        <div class="game-top">
          <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
          <h2>${icon} ${name}</h2>
        </div>
        <div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div>
        <div class="game-table">
          <div style="font-size:0.8rem;color:#888;margin-bottom:6px;">${desc}</div>
          <div id="${ns}Grid" class="hand" style="gap:6px;max-width:360px;margin:0 auto;"></div>
          <div id="${ns}Stat" style="font-size:0.8rem;color:#888;">匹配：0/${pairs}</div>
          <div id="${ns}Result" class="message"></div>
        </div>
        <div class="chips">
          <div class="chip chip-100" onclick="${ns}Bet(100)">100</div>
          <div class="chip chip-500" onclick="${ns}Bet(500)">500</div>
          <div class="chip chip-1000" onclick="${ns}Bet(1000)">1000</div>
        </div>
        <div class="current-bet">下注：<span id="${ns}Bet">0</span></div>
      </div>`);
    });

    function shuffleCards() {
      const chosen = Engine.shuffle(EMOJIS).slice(0, pairs);
      const cards = [...chosen, ...chosen];
      return Engine.shuffle(cards).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    }

    function renderGrid() {
      const grid = document.getElementById(`${ns}Grid`);
      if (!grid) return;
      grid.innerHTML = state.cards.map(c =>
        c.matched
          ? `<div class="card" style="background:var(--table-green);border:1px solid #555;">${c.emoji}</div>`
          : c.flipped
            ? `<div class="card" style="background:var(--card-bg);color:var(--black);cursor:default;" onclick="">${c.emoji}</div>`
            : `<div class="card card-back" style="cursor:pointer;" onclick="${ns}Flip(${c.id})"></div>`
      ).join('');
    }

    window[`${ns}Bet`] = (amount) => {
      if (state.locked && !state.started) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById(`${ns}Bet`).textContent = state.bet;
      Engine.play('click');
      if (state.bet > 0 && !state.started) {
        state.started = true;
        state.cards = shuffleCards();
        state.matched = 0;
        state.flipped = [];
        renderGrid();
        document.getElementById(`${ns}Result`).textContent = '翻牌配对！';
        document.getElementById(`${ns}Result`).className = 'message';
      }
    };

    window[`${ns}Flip`] = (idx) => {
      if (state.locked) return;
      const card = state.cards[idx];
      if (card.flipped || card.matched) return;

      card.flipped = true;
      state.flipped.push(idx);
      renderGrid();
      Engine.play('reveal');

      if (state.flipped.length === 2) {
        state.locked = true;
        const [i1, i2] = state.flipped;
        const c1 = state.cards[i1];
        const c2 = state.cards[i2];
        if (c1.emoji === c2.emoji) {
          c1.matched = true;
          c2.matched = true;
          state.matched++;
          document.getElementById(`${ns}Stat`).textContent = `匹配：${state.matched}/${pairs}`;
          state.flipped = [];
          state.locked = false;
          renderGrid();
          Engine.play('win');
          if (state.matched === pairs) {
            const win = Math.floor(state.bet * (1 + pairs * 0.3));
            Engine.addBalance(win);
            document.getElementById(`${ns}Result`).textContent = `🎉 全部配对！赢 ${win} 筹码！`;
            document.getElementById(`${ns}Result`).className = 'message msg-win';
            Engine.showQuote('win');
            state.bet = 0;
            document.getElementById(`${ns}Bet`).textContent = '0';
            Engine.updateBalanceUI();
          }
        } else {
          setTimeout(() => {
            c1.flipped = false;
            c2.flipped = false;
            state.flipped = [];
            state.locked = false;
            renderGrid();
          }, 800);
        }
      }
    };
  },

  /** 简单运气抽奖类模板 */
  createLuckGame(id, opts) {
    const { name, icon, desc, options } = opts;
    const ns = id.replace(/-/g,'_');
    const state = { bet: 0, revealed: false };

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('gamePages').insertAdjacentHTML('beforeend', `
      <div class="game-page" id="page-${id}">
        <div class="game-top">
          <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
          <h2>${icon} ${name}</h2>
        </div>
        <div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div>
        <div class="game-table">
          <div id="${ns}Display" style="font-size:4rem;margin:8px 0;">${icon}</div>
          <div id="${ns}Reveal" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:8px 0;"></div>
          <div id="${ns}Result" class="message">${desc}</div>
        </div>
        <div class="chips">
          <div class="chip chip-100" onclick="${ns}Bet(100)">100</div>
          <div class="chip chip-500" onclick="${ns}Bet(500)">500</div>
          <div class="chip chip-1000" onclick="${ns}Bet(1000)">1000</div>
        </div>
        <div class="current-bet">下注：<span id="${ns}Bet">0</span></div>
        <div class="game-controls">
          <button class="btn btn-primary" id="${ns}DrawBtn" onclick="${ns}Draw()">抽！</button>
          <button class="btn" onclick="${ns}Reset()">新一局</button>
        </div>
      </div>`);
    });

    window[`${ns}Bet`] = (amount) => {
      if (state.revealed) return;
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById(`${ns}Bet`).textContent = state.bet; Engine.play('click');
    };

    window[`${ns}Draw`] = () => {
      if (state.revealed || state.bet <= 0) return;
      state.revealed = true;
      document.getElementById(`${ns}DrawBtn`).disabled = true;
      Engine.play('spin');

      let count = 0;
      const iv = setInterval(() => {
        const r = options[Engine.randomInt(0, options.length - 1)];
        document.getElementById(`${ns}Display`).textContent = r.icon || icon;
        if (++count > 12) {
          clearInterval(iv);
          const idx = Engine.randomInt(0, options.length - 1);
          const result = options[idx];
          document.getElementById(`${ns}Display`).textContent = result.icon;
          const msg = document.getElementById(`${ns}Result`);
          if (result.mult > 0) {
            const win = Math.floor(state.bet * result.mult);
            Engine.addBalance(win);
            msg.textContent = `${result.label}！赢 ${win} 筹码！`;
            msg.className = 'message msg-win';
            Engine.play('win');
            if (result.mult >= 5) Engine.showQuote('jackpot');
            else Engine.showQuote('win');
          } else {
            msg.textContent = `${result.label}，输 ${state.bet}`;
            msg.className = 'message msg-lose';
            Engine.play('lose');
          }
          state.bet = 0;
          document.getElementById(`${ns}Bet`).textContent = '0';
          Engine.updateBalanceUI();
        }
      }, 80);
    };

    window[`${ns}Reset`] = () => {
      state.bet = 0; state.revealed = false;
      document.getElementById(`${ns}Bet`).textContent = '0';
      document.getElementById(`${ns}Display`).textContent = icon;
      document.getElementById(`${ns}Result`).textContent = desc;
      document.getElementById(`${ns}Result`).className = 'message';
      document.getElementById(`${ns}DrawBtn`).disabled = false;
      Engine.updateBalanceUI();
    };
  },

  /** 骰子比大小类模板 */
  createDiceGame(id, opts) {
    const { name, icon, desc, diceCount = 2, choices, multiplier } = opts;
    const ns = id.replace(/-/g,'_');
    const FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];
    const state = { bet: 0, choice: null, rolling: false };

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('gamePages').insertAdjacentHTML('beforeend', `
      <div class="game-page" id="page-${id}">
        <div class="game-top">
          <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
          <h2>${icon} ${name}</h2>
        </div>
        <div class="top-bar"><div class="balance-display">💰 <span class="balance-val">0</span></div></div>
        <div class="game-table">
          <div class="dice-area" id="${ns}Dice"></div>
          <div id="${ns}Total" class="message msg-info">${desc}</div>
          <div id="${ns}Result" class="message"></div>
        </div>
        <div class="bet-options" id="${ns}Choices"></div>
        <div class="chips">
          <div class="chip chip-100" onclick="${ns}Bet(100)">100</div>
          <div class="chip chip-500" onclick="${ns}Bet(500)">500</div>
          <div class="chip chip-1000" onclick="${ns}Bet(1000)">1000</div>
        </div>
        <div class="current-bet">下注：<span id="${ns}Bet">0</span></div>
        <div class="game-controls">
          <button class="btn btn-primary" id="${ns}RollBtn" onclick="${ns}Roll()">掷骰子！</button>
        </div>
      </div>`);

      if (choices) {
        document.getElementById(`${ns}Choices`).innerHTML = Object.entries(choices).map(([key, val]) =>
          `<button class="bet-btn" data-choice="${key}" onclick="${ns}Select('${key}')">${val}</button>`
        ).join('');
      }
    });

    window[`${ns}Select`] = (choice) => {
      state.choice = choice;
      document.querySelectorAll(`#page-${id} .bet-btn`).forEach(b => b.classList.remove('selected'));
      document.querySelector(`#page-${id} [data-choice="${choice}"]`).classList.add('selected');
      document.getElementById(`${ns}Result`).textContent = '';
      Engine.play('click');
    };

    window[`${ns}Bet`] = (amount) => {
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount; Engine.save(); Engine.updateBalanceUI();
      document.getElementById(`${ns}Bet`).textContent = state.bet; Engine.play('click');
    };

    window[`${ns}Roll`] = () => {
      if (state.rolling || state.bet <= 0) return;
      if (choices && !state.choice) {
        document.getElementById(`${ns}Result`).textContent = '先选下注选项！';
        document.getElementById(`${ns}Result`).className = 'message msg-info';
        return;
      }
      state.rolling = true;
      document.getElementById(`${ns}RollBtn`).disabled = true;
      Engine.play('spin');

      const diceArea = document.getElementById(`${ns}Dice`);
      diceArea.innerHTML = '';
      for (let i = 0; i < diceCount; i++) {
        const d = document.createElement('div');
        d.className = 'die rolling';
        d.id = `${ns}D${i}`;
        diceArea.appendChild(d);
      }

      let count = 0;
      const iv = setInterval(() => {
        document.querySelectorAll(`#${ns}Dice .die`).forEach(d => {
          d.textContent = FACES[Engine.randomInt(0, 5)];
        });
        if (++count >= 10) {
          clearInterval(iv);
          const vals = [];
          for (let i = 0; i < diceCount; i++) {
            vals.push(Engine.randomInt(1, 6));
          }
          document.querySelectorAll(`#${ns}Dice .die`).forEach((d, i) => {
            d.textContent = FACES[vals[i] - 1];
            d.classList.remove('rolling');
          });

          const total = vals.reduce((a, b) => a + b, 0);
          const isTriple = diceCount === 3 && vals[0] === vals[1] && vals[1] === vals[2];
          document.getElementById(`${ns}Total`).textContent = `点数：${vals.join(' + ')} = ${total}`;

          let won = false;
          let mult = 1;
          if (choices && state.choice) {
            const check = choices[state.choice];
            if (typeof check === 'function') {
              const result = check(total, vals, isTriple);
              won = result.won;
              mult = result.mult || 2;
            }
          }

          const res = document.getElementById(`${ns}Result`);
          if (won) {
            const win = state.bet * mult;
            Engine.addBalance(win);
            res.textContent = `中了！赢 ${win} 筹码！`;
            res.className = 'message msg-win';
            Engine.play('win');
            Engine.showQuote('win');
          } else {
            res.textContent = isTriple && diceCount >= 2 ? '围骰！通杀！' : `没中，输 ${state.bet}`;
            res.className = 'message msg-lose';
            Engine.play('lose');
          }

          state.bet = 0; state.choice = null; state.rolling = false;
          document.getElementById(`${ns}RollBtn`).disabled = false;
          document.getElementById(`${ns}Bet`).textContent = '0';
          document.querySelectorAll(`#page-${id} .bet-btn`).forEach(b => b.classList.remove('selected'));
          Engine.updateBalanceUI();
        }
      }, 70);
    };
  },

  // ===== 批量创建游戏 =====
  // 根据配置数据自动调用对应的工厂方法

  generateGames(configs) {
    configs.forEach(cfg => {
      if (cfg.template === 'standalone') {
        // 独立游戏需要有JS文件，这里只注册
        Engine.registerGame(cfg);
        return;
      }

      // 注册模板游戏
      Engine.registerGame(cfg);

      // 根据模板类型创建游戏逻辑
      switch(cfg.template) {
        case 'guess':
          this.createGuessGame(cfg.id, cfg);
          break;
        case 'quiz':
          this.createQuizGame(cfg.id, cfg);
          break;
        case 'reaction':
          this.createReactionGame(cfg.id, cfg);
          break;
        case 'wheel':
          this.createWheelGame(cfg.id, cfg);
          break;
        case 'memory':
          this.createMemoryGame(cfg.id, cfg);
          break;
        case 'luck':
          this.createLuckGame(cfg.id, cfg);
          break;
        case 'dice':
          this.createDiceGame(cfg.id, cfg);
          break;
      }
    });
  }
};