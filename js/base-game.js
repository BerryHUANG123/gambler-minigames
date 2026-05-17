// ========== 皮克松赌场 — 游戏基类 ==========
// 统一所有游戏的下注、筹码区、结算等公共逻辑

const BaseGame = {
  // 生成并注入完整游戏页面 HTML
  init(id, icon, name, opts = {}) {
    const ns = id.replace(/-/g, '_');
    const { tableHTML = '', controlsHTML = '', betOptionsHTML = '' } = opts;
    const html = `
      <div class="game-top">
        <button class="back-btn" onclick="Engine.backToHall()">← 大厅</button>
        <h2>${icon} ${name}</h2>
        <button class="help-btn" onclick="BaseGame.showHelp('${id}')" title="游戏说明">?</button>
      </div>
      <div class="top-bar">
        <div class="balance-display">💰 <span class="balance-val">0</span></div>
      </div>
      <div class="game-table">
        ${tableHTML}
      </div>
      ${betOptionsHTML}
      <div class="chips">
        <div class="chip chip-100" onclick="${ns}Bet(100)">100</div>
        <div class="chip chip-500" onclick="${ns}Bet(500)">500</div>
        <div class="chip chip-1000" onclick="${ns}Bet(1000)">1000</div>
      </div>
      <div class="current-bet">下注：<span id="${ns}Bet">0</span></div>
      <div class="game-controls">
        ${controlsHTML}
      </div>`;
    const el = document.getElementById(`page-${id}`);
    if (el) { el.innerHTML = html; return; }
    const pages = document.getElementById('gamePages');
    if (pages) {
      const div = document.createElement('div');
      div.className = 'game-page';
      div.id = `page-${id}`;
      div.innerHTML = html;
      pages.appendChild(div);
    }
  },

  // 创建标准下注函数（自动注册为全局 window.{ns}Bet）
  betHandler(ns, state) {
    ns = ns.replace(/-/g, '_');
    const fn = (amount) => {
      if (!Engine.canBet(amount)) return;
      state.bet += amount;
      Engine.state.balance -= amount;
      Engine.save();
      Engine.updateBalanceUI();
      document.getElementById(`${ns}Bet`).textContent = state.bet;
      Engine.play('click');
    };
    window[ns + 'Bet'] = fn;
    return fn;
  },

  // 结算（won=true时加筹码，播放音效）
  settle(ns, state, won, winAmount) {
    ns = ns.replace(/-/g, '_');
    state.bet = 0;
    document.getElementById(`${ns}Bet`).textContent = '0';
    if (won) {
      Engine.addBalance(winAmount);
      Engine.play('win');
    } else {
      Engine.play('lose');
    }
    Engine.updateBalanceUI();
  },

  // 清空下注选项高亮
  clearSelection(id) {
    document.querySelectorAll(`#page-${id} .bet-btn`).forEach(b => b.classList.remove('selected'));
  },

  // 高亮选中项
  selectOption(id, choice) {
    this.clearSelection(id);
    const el = document.querySelector(`#page-${id} [data-choice="${choice}"]`);
    if (el) el.classList.add('selected');
  },

  // 获取命名空间
  ns(id) {
    return id.replace(/-/g, '_');
  },

  // 显示游戏说明弹窗
  showHelp(id) {
    const config = Engine.getGame(id);
    if (!config) return;
    const title = document.getElementById('helpModalTitle');
    const body = document.getElementById('helpModalBody');
    if (title) title.textContent = `${config.icon} ${config.name} — 游戏说明`;
    if (body) body.textContent = config.help || config.desc || '暂无说明';
    document.getElementById('helpModal')?.classList.add('show');
  },

  // 隐藏游戏说明弹窗
  hideHelp() {
    document.getElementById('helpModal')?.classList.remove('show');
  }
};
window.BaseGame = BaseGame;
