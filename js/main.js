// ========== 皮克松赌场 — 大厅主逻辑 ==========

/** 游戏配置 */
const GAMES = [
  {
    id: 'dice',
    icon: '🎲',
    name: '掷骰子',
    desc: '压大压小，买定离手！三秒见输赢。',
    status: 'ready',
  },
  {
    id: 'blackjack',
    icon: '♠️',
    name: '21点',
    desc: '经典 Blackjack，看谁点数更接近21。',
    status: 'coming-soon',
  },
  {
    id: 'card-check',
    icon: '🃏',
    name: '验牌',
    desc: '考验眼力，三张牌里找出那张老千牌。',
    status: 'coming-soon',
  },
  {
    id: 'slot',
    icon: '🎰',
    name: '老虎机',
    desc: '777！三列转盘，凑对赢钱！',
    status: 'coming-soon',
  },
  {
    id: 'hi-lo',
    icon: '🀄',
    name: '猜大小',
    desc: '三颗骰子，猜点数范围，搏一搏单车变摩托。',
    status: 'coming-soon',
  },
];

/** 渲染游戏卡片 */
function renderGames() {
  const grid = document.getElementById('gameGrid');
  grid.innerHTML = GAMES.map(game => `
    <div class="game-card ${game.status === 'coming-soon' ? 'coming-soon' : ''}"
         data-game="${game.id}"
         onclick="${game.status === 'ready' ? `openGame('${game.id}')` : ''}">
      <div class="icon">${game.icon}</div>
      <div class="name">${game.name}</div>
      <div class="desc">${game.desc}</div>
      <span class="badge ${game.status === 'ready' ? 'badge-ready' : 'badge-soon'}">
        ${game.status === 'ready' ? '▶ 开玩' : '🚧 开发中'}
      </span>
    </div>
  `).join('');
}

/** 打开游戏 */
function openGame(gameId) {
  // 动态加载游戏脚本
  const script = document.createElement('script');
  script.src = `js/games/${gameId}.js`;
  script.onload = () => {
    if (typeof window[`init${capitalize(gameId)}`] === 'function') {
      window[`init${capitalize(gameId)}`]();
    }
  };
  document.body.appendChild(script);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 启动
document.addEventListener('DOMContentLoaded', renderGames);