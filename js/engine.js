// ========== 皮克松赌场 — 游戏引擎 ==========

const Engine = {
  state: {
    balance: 1000,
    totalPlayed: 0,
    totalWon: 0,
  },

  init() {
    this.load();
    this.renderHall();
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

  canBet(amount) {
    return amount <= this.state.balance;
  },

  // ---- UI ----
  updateBalanceUI() {
    document.querySelectorAll('.balance-val').forEach(el => {
      el.textContent = this.state.balance;
    });
  },

  // ---- 导航 ----
  showGame(gameId) {
    document.querySelectorAll('.game-page').forEach(p => p.classList.remove('active'));
    document.querySelector('.hall')?.classList.remove('active');
    const page = document.getElementById(`page-${gameId}`);
    if (page) page.classList.add('active');
  },

  backToHall() {
    document.querySelectorAll('.game-page').forEach(p => p.classList.remove('active'));
    document.querySelector('.hall')?.classList.add('active');
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
  renderHall() {
    const games = [
      { id: 'dice', icon: '🎲', name: '掷骰子', desc: '压大压小，买定离手！三秒见输赢。' },
      { id: 'blackjack', icon: '♠️', name: '21点', desc: '经典 Blackjack，跟庄家对赌。' },
      { id: 'cardcheck', icon: '🃏', name: '验牌', desc: '三张牌里找出老千，皮克松的绝活。' },
      { id: 'slot', icon: '🎰', name: '老虎机', desc: '777！三列转盘，一拉暴富。' },
      { id: 'hilo', icon: '🀄', name: '猜大小', desc: '三颗骰子，猜点数范围。' },
      { id: 'roulette', icon: '🎡', name: '轮盘', desc: '转盘一响，黄金万两。' },
      { id: 'war', icon: '⚔️', name: '比点数', desc: '简单粗暴，翻牌比大小。' },
      { id: 'russian', icon: '💀', name: '俄罗斯轮盘', desc: '纯赌命，高风险高回报。' },
      { id: 'coinflip', icon: '🎪', name: '猜硬币', desc: '正面反面？50%胜率，简单刺激。' },
      { id: 'scratch', icon: '💳', name: '刮刮乐', desc: '三张刮刮卡，看谁中大奖！' },
      { id: 'bomb', icon: '💣', name: '拆弹', desc: '三个按钮，一个会炸！' },
      { id: 'luckywheel', icon: '🍀', name: '幸运转盘', desc: '转一转，大奖等你拿！' },
      { id: 'rps', icon: '✂️', name: '猜拳', desc: '石头剪刀布，三局两胜！' },
    ];

    const grid = document.getElementById('gameGrid');
    if (!grid) return;
    grid.innerHTML = games.map(g => `
      <div class="game-card" onclick="Engine.showGame('${g.id}')">
        <div class="icon">${g.icon}</div>
        <div class="name">${g.name}</div>
        <div class="desc">${g.desc}</div>
        <span class="badge badge-ready">▶ 开玩</span>
      </div>
    `).join('');

    this.updateBalanceUI();
  },
};

// DOM 就绪后启动
document.addEventListener('DOMContentLoaded', () => Engine.init());