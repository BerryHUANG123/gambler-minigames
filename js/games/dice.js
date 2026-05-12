// ========== 掷骰子 — 皮克松赌场 ==========

let diceState = {
  balance: 1000,
  currentBet: 0,
  result: null,
  rolling: false,
};

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function initDice() {
  diceState = { balance: 1000, currentBet: 0, result: null, rolling: false };
  renderDiceGame();
}

function renderDiceGame() {
  document.getElementById('gameGrid')?.remove();

  const container = document.getElementById('root') || document.body;
  const existing = document.getElementById('dice-game');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.id = 'dice-game';
  div.innerHTML = `
    <div class="game-container">
      <div class="game-header">
        <button class="back-btn" onclick="backToHall()">← 大厅</button>
        <h2>🎲 掷骰子</h2>
      </div>

      <div class="balance">筹码余额：<span id="diceBalance">${diceState.balance}</span></div>

      <div class="game-table">
        <div class="dice-container">
          <div class="dice" id="dice1">⚀</div>
          <div class="dice" id="dice2">⚀</div>
        </div>

        <div id="diceTotal" class="message message-info">点击下注开始</div>

        <div id="diceResult" class="message"></div>
      </div>

      <div class="bet-options">
        <button class="bet-btn" data-bet="big" onclick="selectDiceBet('big')">大 (7-12)</button>
        <button class="bet-btn" data-bet="small" onclick="selectDiceBet('small')">小 (2-6)</button>
      </div>

      <div class="chips">
        <div class="chip chip-100" data-amount="100" onclick="addDiceBet(100)">100</div>
        <div class="chip chip-500" data-amount="500" onclick="addDiceBet(500)">500</div>
        <div class="chip chip-1000" data-amount="1000" onclick="addDiceBet(1000)">1000</div>
      </div>

      <div style="text-align:center; margin:10px 0; color:#888; font-size:0.9rem;">
        当前下注：<span id="diceCurrentBet" style="color:var(--gold);font-weight:bold;">0</span>
      </div>

      <div style="text-align:center;">
        <button class="btn btn-primary" id="diceRollBtn" onclick="rollDice()">掷骰子！</button>
      </div>
    </div>
  `;

  container.prepend(div);
  document.title = '🎲 掷骰子 — 皮克松赌场';
}

function selectDiceBet(type) {
  document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('selected'));
  if (type === 'big') {
    document.querySelector('[data-bet="big"]').classList.add('selected');
    document.getElementById('diceResult').textContent = '';
    document.getElementById('diceTotal').textContent = '选好了，下注吧！';
  } else {
    document.querySelector('[data-bet="small"]').classList.add('selected');
    document.getElementById('diceResult').textContent = '';
    document.getElementById('diceTotal').textContent = '选好了，下注吧！';
  }
}

function addDiceBet(amount) {
  if (amount > diceState.balance) {
    document.getElementById('diceResult').textContent = '筹码不够，穷鬼别来！';
    document.getElementById('diceResult').className = 'message message-lose';
    return;
  }
  diceState.currentBet += amount;
  diceState.balance -= amount;
  updateDiceUI();
}

function updateDiceUI() {
  document.getElementById('diceBalance').textContent = diceState.balance;
  document.getElementById('diceCurrentBet').textContent = diceState.currentBet;
}

function rollDice() {
  if (diceState.rolling) return;

  const selected = document.querySelector('.bet-btn.selected');
  if (!selected) {
    document.getElementById('diceResult').textContent = '选大小啊！押大还是押小？';
    document.getElementById('diceResult').className = 'message message-info';
    return;
  }
  if (diceState.currentBet <= 0) {
    document.getElementById('diceResult').textContent = '没钱下注？想空手套白狼？';
    document.getElementById('diceResult').className = 'message message-info';
    return;
  }

  diceState.rolling = true;
  document.getElementById('diceRollBtn').disabled = true;

  const dice1 = document.getElementById('dice1');
  const dice2 = document.getElementById('dice2');
  dice1.classList.add('rolling');
  dice2.classList.add('rolling');

  let count = 0;
  const interval = setInterval(() => {
    dice1.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
    dice2.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
    count++;
    if (count >= 8) {
      clearInterval(interval);

      const v1 = Math.floor(Math.random() * 6);
      const v2 = Math.floor(Math.random() * 6);
      dice1.textContent = DICE_FACES[v1];
      dice2.textContent = DICE_FACES[v2];
      dice1.classList.remove('rolling');
      dice2.classList.remove('rolling');

      const total = (v1 + 1) + (v2 + 1);
      const betType = document.querySelector('.bet-btn.selected').dataset.bet;
      const isBig = total >= 7;
      const isWin = (betType === 'big' && isBig) || (betType === 'small' && !isBig);

      document.getElementById('diceTotal').textContent = `点数：${total}`;

      const resultEl = document.getElementById('diceResult');
      if (total === 7) {
        // 7点庄家通吃
        resultEl.textContent = '7点！庄家通吃！';
        resultEl.className = 'message message-lose';
      } else if (isWin) {
        const winAmount = diceState.currentBet * 2;
        diceState.balance += winAmount;
        resultEl.textContent = `${betType === 'big' ? '大' : '小'}！中了！赢 ${winAmount}！`;
        resultEl.className = 'message message-win';
      } else {
        resultEl.textContent = `${betType === 'big' ? '大' : '小'}没中，继续？`;
        resultEl.className = 'message message-lose';
      }

      diceState.currentBet = 0;
      diceState.rolling = false;
      document.getElementById('diceRollBtn').disabled = false;
      diceState.balance <= 0 && (resultEl.textContent += ' 输光了，去借高利贷吧！');
      updateDiceUI();
    }
  }, 80);
}

function backToHall() {
  document.getElementById('dice-game')?.remove();
  location.reload();
}