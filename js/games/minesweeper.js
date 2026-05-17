(function () {
  'use strict';

  var gameId = 'minesweeper';
  var ROWS = 8, COLS = 8, MINES = 10;
  var board, revealed, minePositions;
  var timer = 0, revealedCount = 0, gameOver = false, timerInterval = null;
  var started = false;
  var state = { bet: 0 };

  BaseGame.init('minesweeper', '💣', '扫雷', {
    tableHTML: '<div id="minesweeper-game"></div>',
    controlsHTML: ''
  });

  function initGame() {
    board = [];
    revealed = [];
    minePositions = [];
    revealedCount = 0;
    gameOver = false;
    started = false;
    timer = 0;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

    for (var r = 0; r < ROWS; r++) {
      board[r] = [];
      revealed[r] = [];
      for (var c = 0; c < COLS; c++) {
        board[r][c] = 0;
        revealed[r][c] = false;
      }
    }
  }

  function placeMines(excludeR, excludeC) {
    var positions = [];
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (r === excludeR && c === excludeC) continue;
        positions.push([r, c]);
      }
    }
    Engine.shuffle(positions);
    for (var i = 0; i < MINES; i++) {
      var p = positions[i];
      board[p[0]][p[1]] = -1;
      minePositions.push(p);
    }
    for (var mr = 0; mr < ROWS; mr++) {
      for (var mc = 0; mc < COLS; mc++) {
        if (board[mr][mc] === -1) continue;
        var count = 0;
        for (var dr = -1; dr <= 1; dr++) {
          for (var dc = -1; dc <= 1; dc++) {
            var nr = mr + dr, nc = mc + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === -1) count++;
          }
        }
        board[mr][mc] = count;
      }
    }
  }

  function render() {
    var html = '<div class="game-container minesweeper-container">';
    html += '<div class="mines-info">💣 ' + MINES + '  ⏱ <span id="ms-timer">0</span>s  🟦 <span id="ms-revealed">0</span>/54</div>';
    html += '<div class="minesweeper-board">';
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        html += '<div class="ms-cell" data-r="' + r + '" data-c="' + c + '"></div>';
      }
    }
    html += '</div>';
    html += '<div class="msg-info" id="ms-msg">点击格子开始</div>';
    html += '</div>';
    document.getElementById('minesweeper-game').innerHTML = html;

    document.querySelector('.minesweeper-board').addEventListener('click', function (e) {
      var cell = e.target.closest('.ms-cell');
      if (!cell || gameOver) return;
      var r = parseInt(cell.dataset.r);
      var c = parseInt(cell.dataset.c);
      if (revealed[r][c]) return;
      if (!started) {
        started = true;
        placeMines(r, c);
        timerInterval = setInterval(function () {
          timer++;
          document.getElementById('ms-timer').textContent = timer;
        }, 1000);
      }
      revealCell(r, c);
    });
  }

  function revealCell(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || revealed[r][c]) return;
    revealed[r][c] = true;
    revealedCount++;
    var cell = document.querySelector('.ms-cell[data-r="' + r + '"][data-c="' + c + '"]');
    cell.classList.add('revealed');

    if (board[r][c] === -1) {
      cell.textContent = '💣';
      cell.classList.add('mine');
      gameOver = true;
      clearInterval(timerInterval);
      showAllMines();
      BaseGame.settle('minesweeper', state, false, 0);
      Engine.showQuote('lose');
      document.getElementById('ms-msg').className = 'msg-lose';
      document.getElementById('ms-msg').textContent = '踩雷了！游戏结束！';
      return;
    }

    if (board[r][c] > 0) {
      cell.textContent = board[r][c];
      cell.classList.add('num-' + board[r][c]);
    } else {
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          revealCell(r + dr, c + dc);
        }
      }
    }
    document.getElementById('ms-revealed').textContent = revealedCount;
    checkWin();
  }

  function showAllMines() {
    for (var i = 0; i < minePositions.length; i++) {
      var p = minePositions[i];
      var cell = document.querySelector('.ms-cell[data-r="' + p[0] + '"][data-c="' + p[1] + '"]');
      if (cell && !revealed[p[0]][p[1]]) {
        cell.textContent = '💣';
        cell.classList.add('revealed');
      }
    }
  }

  function checkWin() {
    var safeCells = ROWS * COLS - MINES;
    if (revealedCount >= safeCells) {
      gameOver = true;
      clearInterval(timerInterval);
      var bonus = Math.max(1, Math.floor(60 / (timer + 1)));
      var winAmount = state.bet * bonus;
      BaseGame.settle('minesweeper', state, true, state.bet + winAmount);
      Engine.showQuote('win');
      document.getElementById('ms-msg').className = 'msg-win';
      document.getElementById('ms-msg').textContent = '🎉 扫雷成功！奖金 ' + winAmount + ' 已入账！（用时' + timer + 's）';
    }
  }

  window.minesweeperBet = function(amount) {
    if (!Engine.canBet(amount)) return;
    BaseGame.betHandler('minesweeper', state)(amount);
    initGame();
    render();
  };
})();
