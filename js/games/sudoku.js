(function () {
  'use strict';

  var gameId = 'sudoku';
  var SIZE = 4;
  var puzzle, solution, userGrid;
  var gameOver = false;
  var state = { bet: 0 };

  BaseGame.init('sudoku', '🔢', '迷你数独', {
    tableHTML: '<div id="sudoku-game"></div>',
    controlsHTML: ''
  });

  function generatePuzzle() {
    var base = [
      [1,2,3,4],
      [3,4,1,2],
      [2,1,4,3],
      [4,3,2,1]
    ];
    var grid = [];
    for (var r = 0; r < SIZE; r++) {
      grid[r] = base[r].slice();
    }
    solution = grid;

    puzzle = [];
    userGrid = [];
    for (var r2 = 0; r2 < SIZE; r2++) {
      puzzle[r2] = [];
      userGrid[r2] = [];
      for (var c = 0; c < SIZE; c++) {
        if (Math.random() < 0.5) {
          puzzle[r2][c] = 0;
          userGrid[r2][c] = 0;
        } else {
          puzzle[r2][c] = solution[r2][c];
          userGrid[r2][c] = solution[r2][c];
        }
      }
    }
  }

  function render() {
    var html = '<div class="game-container sudoku-container">';
    html += '<div class="sudoku-board">';
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var val = puzzle[r][c];
        var isFixed = val !== 0;
        html += '<input type="text" class="sudoku-cell' + (isFixed ? ' fixed' : '') + '" data-r="' + r + '" data-c="' + c + '" value="' + (val || '') + '" ' + (isFixed ? 'disabled' : 'maxlength="1"') + '>';
        if (c === 1) html += '<span class="sudoku-gap"></span>';
      }
      if (r === 1) html += '</div><div class="sudoku-gap-row"></div><div class="sudoku-board">';
    }
    html += '</div>';
    html += '<div class="sudoku-buttons">';
    html += '<button class="chip-100" onclick="checkSudoku()">提交</button>';
    html += '</div>';
    html += '<div class="msg-info" id="sudoku-msg">填入数字1-4</div>';
    html += '</div>';
    document.getElementById('sudoku-game').innerHTML = html;

    document.querySelectorAll('.sudoku-cell:not(.fixed)').forEach(function (input) {
      input.addEventListener('input', function () {
        var v = this.value.replace(/[^1-4]/g, '');
        this.value = v;
      });
    });

    window.checkSudoku = function () {
      if (gameOver) return;
      Engine.play('click');
      var inputs = document.querySelectorAll('.sudoku-cell:not(.fixed)');
      var correct = true;
      inputs.forEach(function (input) {
        var r = parseInt(input.dataset.r);
        var c = parseInt(input.dataset.c);
        var v = parseInt(input.value) || 0;
        userGrid[r][c] = v;
        if (v !== solution[r][c]) correct = false;
      });

      if (correct) {
        gameOver = true;
        var winAmount = state.bet * 3;
        BaseGame.settle('sudoku', state, true, state.bet + winAmount);
        Engine.showQuote('win');
        document.getElementById('sudoku-msg').className = 'msg-win';
        document.getElementById('sudoku-msg').textContent = '🎉 全部正确！奖金 ' + winAmount + ' 已入账！';
      } else {
        Engine.play('lose');
        document.getElementById('sudoku-msg').className = 'msg-lose';
        document.getElementById('sudoku-msg').textContent = '有错误，再试试！';
      }
    };
  }

  window.sudokuBet = function(amount) {
    if (!Engine.canBet(amount)) return;
    BaseGame.betHandler('sudoku', state)(amount);
    generatePuzzle();
    render();
  };
})();
