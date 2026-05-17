(function() {
  // Hi-Lo Game (猜大小)
  const SUITS = ['♠', '♥', '♣', '♦'];
  const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  let state = {
    bet: 0,
    currentCard: null,
    round: 0,
    maxRounds: 3
  };

  BaseGame.init('hilo_card', '📊', '猜大小(牌)', {
    tableHTML: '<div id="cardDisplay" style="text-align:center;margin:20px 0;"><div class="card card-back" style="display:inline-block;width:100px;height:140px;border-radius:8px;"><div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;">?</div></div></div><div id="hiloMessage" class="message"></div><div style="text-align:center;margin-top:10px;"><span style="color:var(--gold);">回合：<span id="hiloRound">1</span>/<span id="hiloMaxRounds">3</span></span></div>',
    betOptionsHTML: '<button class="bet-btn" data-choice="higher" onclick="HiLo.select(\'higher\')">大 (10-K)</button><button class="bet-btn" data-choice="lower" onclick="HiLo.select(\'lower\')">小 (A-9)</button>',
    controlsHTML: '<button class="btn btn-primary" id="hiloNextBtn" onclick="HiLo.next()">下一张</button>'
  });

  window.hilo_cardBet = function(amount) {
    if (!Engine.canBet(amount)) return;
    BaseGame.betHandler('hilo_card', state)(amount);
    state.currentCard = null;
    state.round = 0;
    state.choice = null;
    document.querySelectorAll('#page-hilo_card .bet-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('hiloMessage').textContent = '';
    document.getElementById('cardDisplay').innerHTML = '<div class="card card-back" style="display:inline-block;width:100px;height:140px;border-radius:8px;"><div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;">?</div></div>';
    document.getElementById('hiloNextBtn').disabled = false;
  };

  function select(choice) {
    if (!state.currentCard || state.round >= state.maxRounds) return;

    state.choice = choice;
    document.querySelectorAll('#page-hilo_card .bet-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector(`#page-hilo_card [data-choice="${choice}"]`).classList.add('selected');
    Engine.play('click');
  }

  function deal() {
    if (!state.choice || state.bet === 0) {
      Engine.showQuote('error', '请先下注并选择大或小！');
      return;
    }

    const cardIndex = Engine.randomInt(0, 12);
    const suit = SUITS[Engine.randomInt(0, 3)];
    state.currentCard = { index: cardIndex, suit };

    const v = cardIndex === 0 ? 'A' : cardIndex === 10 ? '10' : cardIndex === 11 ? 'J' : cardIndex === 12 ? 'Q' : cardIndex === 13 ? 'K' : cardIndex + 1;
    const clr = (suit === '♥' || suit === '♦') ? 'card-red' : 'card-black';

    document.getElementById('cardDisplay').innerHTML = `<div class="card ${clr}" style="display:inline-block;width:100px;height:140px;border-radius:8px;padding:10px;"><div style="text-align:center;"><div style="font-size:2rem;">${v}</div><div style="font-size:1.5rem;">${suit}</div></div></div>`;

    const isHigh = cardIndex >= 10;
    const won = (isHigh && state.choice === 'higher') || (!isHigh && state.choice === 'lower');

    if (won) {
      BaseGame.settle('hilo_card', state, true, state.bet * 2);
      Engine.showQuote('win', `🎉 ${isHigh ? '大' : '小'}！赢 ${state.bet * 2} 筹码！`);
      document.getElementById('hiloMessage').textContent = `✅ ${isHigh ? '大' : '小'}！点数 ${v}${suit}`;
    } else {
      BaseGame.settle('hilo_card', state, false, 0);
      Engine.showQuote('lose', `😢 ${isHigh ? '大' : '小'}！点数 ${v}${suit}，输了！`);
      document.getElementById('hiloMessage').textContent = `❌ ${isHigh ? '大' : '小'}！点数 ${v}${suit}`;
    }

    state.round++;

    document.getElementById('hiloNextBtn').disabled = state.round >= state.maxRounds;
  }

  function next() {
    if (state.round >= state.maxRounds) {
      state.choice = null;
      state.currentCard = null;
      document.querySelectorAll('#page-hilo_card .bet-btn').forEach(b => b.classList.remove('selected'));
      document.getElementById('cardDisplay').innerHTML = '<div class="card card-back" style="display:inline-block;width:100px;height:140px;border-radius:8px;"><div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;">?</div></div>';
      document.getElementById('hiloMessage').textContent = '继续下注';
    } else {
      deal();
    }
  }

  const HiLo = {
    select,
    deal,
    next
  };
})();
