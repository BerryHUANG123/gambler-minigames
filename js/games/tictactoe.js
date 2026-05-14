(function () {
  'use strict';

  var gameId = 'tictactoe';
  var board, currentPlayer, playerWins, computerWins;
  var betAmount = 0;
  var gameOver = false;

  function initBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    playerWins = 0;
    computerWins = 0;
    gameOver = false;
  }

  function render() {
    var html = '<div class="game-container tictactoe-container">';
    html += '<h3>❌ 井字棋</h3>';
    html += '<div class="score-bar"><span>玩家: ' + playerWins + '</span><span>电脑: ' + computerWins + '</span></div>';
    html += '<div class="tictactoe-board">';
    for (var i = 0; i < 9; i++) {
      html += '<div class="tictactoe-cell" data-index="' + i + '">' + board[i] + '</div>';
    }
    html += '</div>';
    html += '<div class="msg-info" id="tictactoe-msg">点击格子下棋</div>';
    html += '<button class="btn-back" onclick="Engine.backToHall()">返回大厅</button>';
    html += '</div>';
    var el = document.getElementById('gamePages');
    if (el) el.insertAdjacentHTML('beforeend', html);

    document.querySelector('.tictactoe-board').addEventListener('click', function (e) {
      var cell = e.target.closest('.tictactoe-cell');
      if (!cell || gameOver) return;
      var idx = parseInt(cell.dataset.index);
      playerMove(idx);
    });
  }

  function playerMove(idx) {
    if (board[idx] !== '' || currentPlayer !== 'X' || gameOver) return;
    board[idx] = 'X';
    document.querySelector('.tictactoe-cell[data-index="' + idx + '"]').textContent = 'X';
    if (checkWinner('X')) {
      playerWins++;
      gameOver = true;
      if (playerWins >= 2) {
        Engine.play('win');
        Engine.showQuote('win');
        Engine.addBalance(betAmount * 2);
        document.getElementById('tictactoe-msg').className = 'msg-win';
        document.getElementById('tictactoe-msg').textContent = '你赢了！奖金 ' + (betAmount * 2) + ' 已入账！';
      } else {
        document.getElementById('tictactoe-msg').textContent = '你赢了这局！';
        setTimeout(nextRound, 1000);
      }
      Engine.updateBalanceUI();
      Engine.save();
      return;
    }
    if (isBoardFull()) {
      gameOver = true;
      document.getElementById('tictactoe-msg').textContent = '平局！';
      setTimeout(nextRound, 1000);
      return;
    }
    currentPlayer = 'O';
    document.getElementById('tictactoe-msg').textContent = '电脑思考中...';
    setTimeout(computerMove, 500);
  }

  function computerMove() {
    if (gameOver) return;
    var idx = getBestMove();
    if (idx === -1) {
      for (var i = 0; i < 9; i++) {
        if (board[i] === '') { idx = i; break; }
      }
    }
    if (idx === -1) return;
    board[idx] = 'O';
    document.querySelector('.tictactoe-cell[data-index="' + idx + '"]').textContent = 'O';
    if (checkWinner('O')) {
      computerWins++;
      gameOver = true;
      if (computerWins >= 2) {
        Engine.play('lose');
        Engine.showQuote('lose');
        document.getElementById('tictactoe-msg').className = 'msg-lose';
        document.getElementById('tictactoe-msg').textContent = '电脑赢了！';
      } else {
        document.getElementById('tictactoe-msg').textContent = '电脑赢了这局！';
        setTimeout(nextRound, 1000);
      }
      Engine.updateBalanceUI();
      Engine.save();
      return;
    }
    if (isBoardFull()) {
      gameOver = true;
      document.getElementById('tictactoe-msg').textContent = '平局！';
      setTimeout(nextRound, 1000);
      return;
    }
    currentPlayer = 'X';
    document.getElementById('tictactoe-msg').textContent = '该你了！';
  }

  function getBestMove() {
    // Try to win
    for (var i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        if (checkWinner('O')) { board[i] = ''; return i; }
        board[i] = '';
      }
    }
    // Block player
    for (var j = 0; j < 9; j++) {
      if (board[j] === '') {
        board[j] = 'X';
        if (checkWinner('X')) { board[j] = ''; return j; }
        board[j] = '';
      }
    }
    return -1;
  }

  function checkWinner(player) {
    var wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (var i = 0; i < wins.length; i++) {
      var w = wins[i];
      if (board[w[0]] === player && board[w[1]] === player && board[w[2]] === player) return true;
    }
    return false;
  }

  function isBoardFull() {
    for (var i = 0; i < 9; i++) {
      if (board[i] === '') return false;
    }
    return true;
  }

  function nextRound() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    currentPlayer = 'X';
    var cells = document.querySelectorAll('.tictactoe-cell');
    for (var i = 0; i < cells.length; i++) cells[i].textContent = '';
    document.getElementById('tictactoe-msg').className = 'msg-info';
    document.getElementById('tictactoe-msg').textContent = '新一局！你先手';
  }

  function startGame(amount) {
    betAmount = amount;
    if (!Engine.canBet(amount)) return;
    Engine.addBalance(-amount);
    Engine.play('click');
    initBoard();
    render();
    document.getElementById('tictactoe-msg').textContent = '你先手，点击格子下棋！';
    Engine.updateBalanceUI();
    Engine.save();
  }

  // Register
  if (window.GameRegistry) {
    GameRegistry.register(gameId, {
      name: '井字棋',
      icon: '❌',
      start: startGame,
      minBet: 10
    });
  }
})();