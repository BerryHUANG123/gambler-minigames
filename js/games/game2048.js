(function () {
  'use strict';

  BaseGame.init('game2048', '🔢', '2048', {
    tableHTML: [
      '<div class="game-container game2048-container">',
      '<h3>🔢 2048</h3>',
      '<div class="score-bar"><span>分数: <span id="g2048-score">0</span></span></div>',
      '<div class="g2048-board" id="g2048-board">',
      '<div class="g2048-cell" data-r="0" data-c="0"></div>',
      '<div class="g2048-cell" data-r="0" data-c="1"></div>',
      '<div class="g2048-cell" data-r="0" data-c="2"></div>',
      '<div class="g2048-cell" data-r="0" data-c="3"></div>',
      '<div class="g2048-cell" data-r="1" data-c="0"></div>',
      '<div class="g2048-cell" data-r="1" data-c="1"></div>',
      '<div class="g2048-cell" data-r="1" data-c="2"></div>',
      '<div class="g2048-cell" data-r="1" data-c="3"></div>',
      '<div class="g2048-cell" data-r="2" data-c="0"></div>',
      '<div class="g2048-cell" data-r="2" data-c="1"></div>',
      '<div class="g2048-cell" data-r="2" data-c="2"></div>',
      '<div class="g2048-cell" data-r="2" data-c="3"></div>',
      '<div class="g2048-cell" data-r="3" data-c="0"></div>',
      '<div class="g2048-cell" data-r="3" data-c="1"></div>',
      '<div class="g2048-cell" data-r="3" data-c="2"></div>',
      '<div class="g2048-cell" data-r="3" data-c="3"></div>',
      '</div>',
      '<div class="msg-info" id="g2048-msg">合并方块，达到2048！</div>',
      '</div>'
    ].join(''),
    controlsHTML: [
      '<button class="chip-100" onclick="doMove(\'up\')">↑</button>',
      '<div>',
      '<button class="chip-100" onclick="doMove(\'left\')">←</button>',
      '<button class="chip-100" onclick="doMove(\'down\')">↓</button>',
      '<button class="chip-100" onclick="doMove(\'right\')">→</button>',
      '</div>'
    ].join('')
  });

  var gameId = 'game2048';
  var SIZE = 4;
  var grid, score, bestScore;
  var betAmount = 0, gameOver = false, won = false;

  function initGrid() {
    grid = [];
    for (var r = 0; r < SIZE; r++) {
      grid[r] = [];
      for (var c = 0; c < SIZE; c++) {
        grid[r][c] = 0;
      }
    }
    score = 0;
    gameOver = false;
    won = false;
    addRandom();
    addRandom();
  }

  function addRandom() {
    var empty = [];
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return;
    var pos = empty[Math.floor(Math.random() * empty.length)];
    grid[pos[0]][pos[1]] = Math.random() < 0.9 ? 2 : 4;
  }

  function slideRow(row) {
    var arr = row.filter(function (v) { return v !== 0; });
    var newArr = [];
    var pts = 0;
    for (var i = 0; i < arr.length; i++) {
      if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
        newArr.push(arr[i] * 2);
        pts += arr[i] * 2;
        i++;
      } else {
        newArr.push(arr[i]);
      }
    }
    while (newArr.length < SIZE) newArr.push(0);
    return { row: newArr, score: pts };
  }

  function moveLeft() {
    var moved = false, pts = 0;
    for (var r = 0; r < SIZE; r++) {
      var result = slideRow(grid[r]);
      for (var c = 0; c < SIZE; c++) {
        if (grid[r][c] !== result.row[c]) moved = true;
        grid[r][c] = result.row[c];
      }
      pts += result.score;
    }
    if (moved) {
      score += pts;
      addRandom();
      renderBoard();
      checkGameState();
    }
  }

  function moveRight() {
    var moved = false, pts = 0;
    for (var r = 0; r < SIZE; r++) {
      var reversed = grid[r].slice().reverse();
      var result = slideRow(reversed);
      var newRow = result.row.reverse();
      for (var c = 0; c < SIZE; c++) {
        if (grid[r][c] !== newRow[c]) moved = true;
        grid[r][c] = newRow[c];
      }
      pts += result.score;
    }
    if (moved) {
      score += pts;
      addRandom();
      renderBoard();
      checkGameState();
    }
  }

  function moveUp() {
    var moved = false, pts = 0;
    for (var c = 0; c < SIZE; c++) {
      var col = [];
      for (var r = 0; r < SIZE; r++) col.push(grid[r][c]);
      var result = slideRow(col);
      for (var r2 = 0; r2 < SIZE; r2++) {
        if (grid[r2][c] !== result.row[r2]) moved = true;
        grid[r2][c] = result.row[r2];
      }
      pts += result.score;
    }
    if (moved) {
      score += pts;
      addRandom();
      renderBoard();
      checkGameState();
    }
  }

  function moveDown() {
    var moved = false, pts = 0;
    for (var c = 0; c < SIZE; c++) {
      var col = [];
      for (var r = 0; r < SIZE; r++) col.push(grid[r][c]);
      col.reverse();
      var result = slideRow(col);
      result.row.reverse();
      for (var r2 = 0; r2 < SIZE; r2++) {
        if (grid[r2][c] !== result.row[r2]) moved = true;
        grid[r2][c] = result.row[r2];
      }
      pts += result.score;
    }
    if (moved) {
      score += pts;
      addRandom();
      renderBoard();
      checkGameState();
    }
  }

  function renderBoard() {
    var cells = document.querySelectorAll('.g2048-cell');
    cells.forEach(function (cell) {
      var r = parseInt(cell.dataset.r);
      var c = parseInt(cell.dataset.c);
      var val = grid[r][c];
      cell.textContent = val || '';
      cell.className = 'g2048-cell tile-' + val;
    });
    document.getElementById('g2048-score').textContent = score;
  }

  function doMove(dir) {
    if (gameOver || won) return;
    Engine.play('click');
    switch (dir) {
      case 'left': moveLeft(); break;
      case 'right': moveRight(); break;
      case 'up': moveUp(); break;
      case 'down': moveDown(); break;
    }
  }

  function checkGameState() {
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (grid[r][c] >= 2048 && !won) {
          won = true;
          gameOver = true;
          var winAmount = betAmount * Math.max(2, Math.floor(score / 100));
          Engine.play('win');
          Engine.showQuote('jackpot');
          Engine.addBalance(betAmount + winAmount);
          document.getElementById('g2048-msg').className = 'msg-win';
          document.getElementById('g2048-msg').textContent = '🎉 2048！奖金 ' + winAmount + ' 已入账！';
          Engine.updateBalanceUI();
          Engine.save();
          return;
        }
      }
    }

    var hasEmpty = false;
    for (var r2 = 0; r2 < SIZE; r2++) {
      for (var c2 = 0; c2 < SIZE; c2++) {
        if (grid[r2][c2] === 0) hasEmpty = true;
      }
    }
    if (!hasEmpty) {
      var canMerge = false;
      for (var r3 = 0; r3 < SIZE && !canMerge; r3++) {
        for (var c3 = 0; c3 < SIZE && !canMerge; c3++) {
          if (c3 + 1 < SIZE && grid[r3][c3] === grid[r3][c3 + 1]) canMerge = true;
          if (r3 + 1 < SIZE && grid[r3][c3] === grid[r3 + 1][c3]) canMerge = true;
        }
      }
      if (!canMerge && !won) {
        gameOver = true;
        Engine.play('lose');
        Engine.showQuote('lose');
        document.getElementById('g2048-msg').className = 'msg-lose';
        document.getElementById('g2048-msg').textContent = '游戏结束！最终分数：' + score;
      }
    }
  }

  function startGame(amount) {
    betAmount = amount;
    if (!Engine.canBet(amount)) return;
    Engine.addBalance(-amount);
    Engine.play('click');
    initGrid();
    renderBoard();
    Engine.updateBalanceUI();
    Engine.save();
  }

  window.game2048Bet = startGame;
  window.doMove = doMove;
})();
