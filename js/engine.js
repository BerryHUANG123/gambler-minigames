// ========== 皮克松赌场 — 游戏引擎 ==========

const Engine = {
  state: {
    balance: 1000,
    totalPlayed: 0,
    totalWon: 0,
  },

  // 游戏注册表
  _registry: [],
  _registryMap: {},
  _loaded: new Set(),

  // ---- 初始化 ----
  init() {
    this.load();
    this.initSound();
  },

  // ---- 存档 ----
  load() {
    try {
      const saved = localStorage.getItem('pks_casino');
      if (saved) Object.assign(this.state, JSON.parse(saved));
    } catch(e) { /* ignore */ }
  },

  save() {
    try {
      localStorage.setItem('pks_casino', JSON.stringify(this.state));
    } catch(e) { /* ignore */ }
  },

  addBalance(amount) {
    this.state.balance += amount;
    if (amount > 0) this.state.totalWon += amount;
    this.state.totalPlayed++;
    this.save();
    this.updateBalanceUI();
  },

  resetBalance(to = 1000) {
    this.state.balance = to;
    this.state.totalPlayed = 0;
    this.state.totalWon = 0;
    this.save();
    this.updateBalanceUI();
  },

  canBet(amount) {
    return amount <= this.state.balance;
  },

  // ---- UI ----
  updateBalanceUI() {
    document.querySelectorAll('.balance-val').forEach(el => {
      el.textContent = this.state.balance;
    });
  },

  // ---- 游戏注册系统 ----
  registerGame(config) {
    if (this._registryMap[config.id]) return; // 不重复注册
    this._registry.push(config);
    this._registryMap[config.id] = config;
  },

  getGames(category) {
    if (!category || category === 'all') return this._registry;
    if (category === 'hot') return this._registry.filter(g => g.hot);
    return this._registry.filter(g => g.category === category);
  },

  getGame(id) {
    return this._registryMap[id] || null;
  },

  getCategories() {
    const cats = {};
    this._registry.forEach(g => {
      if (!cats[g.category]) cats[g.category] = { id: g.category, name: g.catName, icon: g.catIcon, count: 0 };
      cats[g.category].count++;
    });
    return Object.values(cats);
  },

  // ---- 游戏懒加载 ----
  loadGame(id) {
    const config = this._registryMap[id];
    if (!config) return;

    // 如果是模板游戏（不需要独立文件）
    if (config.template) {
      this._loaded.add(id);
      this.showGame(id);
      return;
    }

    if (this._loaded.has(id)) {
      this.showGame(id);
      return;
    }

    const script = document.createElement('script');
    script.src = `js/games/${id}.js?v=9`;
    script.onload = () => {
      this._loaded.add(id);
      this.showGame(id);
    };
    script.onerror = () => {
      this._loaded.add(id);
      this.showGame(id);
    };
    document.body.appendChild(script);
  },

  // ---- 注册独立游戏页面（用于旧的模块化游戏脚本） ----
  registerPage(id, html, init) {
    const page = document.getElementById(`page-${id}`);
    if (page) {
      page.innerHTML = html;
      page.style.display = 'block';
    } else {
      const gamePages = document.getElementById('gamePages');
      if (gamePages) {
        const div = document.createElement('div');
        div.className = 'game-page';
        div.id = `page-${id}`;
        div.innerHTML = html;
        div.style.display = 'none';
        gamePages.appendChild(div);
      }
    }
    // 执行初始化函数
    if (typeof init === 'function') {
      init();
    }
  },

  // ---- 导航 ----
  showGame(gameId) {
    document.querySelectorAll('.game-page').forEach(p => p.classList.remove('active'));
    document.querySelector('.hall')?.classList.remove('active');
    const page = document.getElementById(`page-${gameId}`);
    if (page) {
      page.classList.add('active');
      page.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.updateBalanceUI();
    }
  },

  backToHall() {
    document.querySelectorAll('.game-page').forEach(p => p.classList.remove('active'));
    document.querySelector('.hall')?.classList.add('active');
    this.updateBalanceUI();
  },

  // ---- 音效 ----
  audioCtx: null,

  initSound() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { /* no audio */ }
  },

  play(type) {
    if (!this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.08;

      switch(type) {
        case 'win':
          osc.frequency.setValueAtTime(523, ctx.currentTime);
          osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
          osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
          break;
        case 'lose':
          osc.frequency.setValueAtTime(400, ctx.currentTime);
          osc.frequency.setValueAtTime(300, ctx.currentTime + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.3);
          break;
        case 'click':
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.05);
          break;
        case 'spin':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          osc.frequency.setValueAtTime(400, ctx.currentTime + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.3);
          break;
        case 'deal':
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          osc.frequency.setValueAtTime(900, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.1);
          break;
        case 'reveal':
          osc.frequency.setValueAtTime(400, ctx.currentTime);
          osc.frequency.setValueAtTime(600, ctx.currentTime + 0.08);
          osc.frequency.setValueAtTime(800, ctx.currentTime + 0.16);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.3);
          break;
      }
    } catch(e) { /* ignore */ }
  },

  // ---- 皮克松台词 ----
  quotes: {
    win: [
      '牌没有问题！赢钱那是天经地义！',
      '跟我皮克松玩？你还嫩了点！',
      '这碗饭是您赏的，我皮克松心里有数。',
      '好手气！今天运势在我这边！',
      '看到了吗？这才叫技术！',
    ],
    lose: [
      '给我擦皮鞋，小瘪三！这点钱算啥！',
      '别急，好戏在后头。',
      '我要验牌！这牌肯定有问题！',
      '运气守恒，下一把全赢回来！',
      '你看我这表情，像输了吗？',
    ],
    jackpot: [
      '通杀！全场肃静！',
      '赌神高进在此，谁敢造次！',
      '今晚全场由皮公子买单！',
    ],
    taunt: [
      '就这？不够我塞牙缝的。',
      '赌桌上别眨眼，眨眼就输一半。',
      '别在这儿搞小动作，你还嫩了点！',
    ],
  },

  showQuote(type) {
    const pool = this.quotes[type] || this.quotes.taunt;
    const quote = pool[Math.floor(Math.random() * pool.length)];
    const el = document.getElementById('quote');
    if (!el) return;
    el.textContent = `"${quote}"`;
    el.classList.add('show');
    clearTimeout(this._quoteTimer);
    this._quoteTimer = setTimeout(() => el.classList.remove('show'), 3000);
  },

  // ---- 工具函数 ----
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  rollDie() {
    return this.randomInt(1, 6);
  },

  // ---- 渲染大厅 ----
  renderHall(category) {
    const grid = document.getElementById('gameGrid');
    if (!grid) return;

    const games = this.getGames(category);
    let html = '';

    // 热门推荐 section（仅在"全部"视图顶部展示）
    if (category === 'all') {
      const hotGames = this._registry.filter(g => g.hot);
      if (hotGames.length) {
        html += `<div class="hot-section"><h3 class="hot-title">🔥 热门推荐</h3><div class="hot-grid">`;
        hotGames.forEach(g => { html += this._gameCardHTML(g); });
        html += `</div></div><div class="section-divider"></div>`;
      }
    }

    const page = this._page || 0;
    const perPage = 24;
    const totalPages = Math.ceil(games.length / perPage);
    const start = page * perPage;
    const pageGames = games.slice(start, start + perPage);

    html += pageGames.map(g => this._gameCardHTML(g)).join('');
    html += this._renderPagination(totalPages, page);

    grid.innerHTML = html;
    this._currentCategory = category;
    this.updateBalanceUI();
  },

  _gameCardHTML(g) {
    return `
      <div class="game-card" data-game="${g.id}" onmouseenter="Engine.showTooltip('${g.id}', event)" onmousemove="Engine.moveTooltip(event)" onmouseleave="Engine.hideTooltip()" onclick="Engine.loadGame('${g.id}')">
        <div class="icon">${g.icon}</div>
        <div class="name">${g.name}</div>
        <div class="desc">${g.desc}</div>
        <span class="badge badge-ready">▶ 开玩</span>
      </div>
    `;
  },

  _renderPagination(totalPages, page) {
    if (totalPages <= 1) return '';
    let html = '<div class="pagination" style="grid-column:1/-1;display:flex;justify-content:center;gap:8px;margin-top:12px;">';
    for (let i = 0; i < totalPages; i++) {
      html += `<button class="btn btn-sm ${i === page ? 'btn-primary' : ''}" onclick="Engine.goPage(${i})" style="min-width:36px;">${i + 1}</button>`;
    }
    html += '</div>';
    return html;
  },

  _page: 0,
  _currentCategory: 'all',

  goPage(p) {
    this._page = p;
    this.renderHall(this._currentCategory);
  },

  switchCategory(cat) {
    this._page = 0;
    this._currentCategory = cat;
    this.renderHall(cat);
  },

  // ---- 悬浮提示 ----
  showTooltip(id, event) {
    const config = this.getGame(id);
    if (!config) return;
    const tip = document.getElementById('gameTooltip');
    if (!tip) return;
    tip.innerHTML = `<div><span class="tooltip-icon">${config.icon}</span> <span class="tooltip-name">${config.name}</span></div><div class="tooltip-desc">${config.help || config.desc || '暂无说明'}</div>`;
    tip.classList.add('show');
    this.moveTooltip(event);
  },

  moveTooltip(event) {
    const tip = document.getElementById('gameTooltip');
    if (!tip) return;
    let x = event.clientX + 16;
    let y = event.clientY + 16;
    if (x + 340 > window.innerWidth) x = event.clientX - 340;
    if (y + 200 > window.innerHeight) y = event.clientY - 200;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  },

  hideTooltip() {
    document.getElementById('gameTooltip')?.classList.remove('show');
  },
};

// DOM 就绪后启动
document.addEventListener('DOMContentLoaded', () => Engine.init());