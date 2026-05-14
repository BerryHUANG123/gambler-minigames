// ========== 皮克松赌场 — 大厅主逻辑 ==========

(function() {
  // 等待DOM和Engine就绪
  function init() {
    if (!document.getElementById('hall')) {
      setTimeout(init, 100);
      return;
    }

    // 注册所有游戏
    ALL_GAMES.forEach(g => Engine.registerGame(g));

    // 渲染分类导航
    renderCategories();

    // 渲染大厅
    Engine._page = 0;
    Engine.renderHall('all');

    // 更新余额
    Engine.updateBalanceUI();
  }

  function renderCategories() {
    const nav = document.getElementById('categoryNav');
    if (!nav) return;

    const categories = Engine.getCategories();
    let html = `<button class="cat-btn cat-active" data-cat="all" onclick="Engine.switchCategory('all')">🏠 全部</button>`;
    categories.forEach(c => {
      html += `<button class="cat-btn" data-cat="${c.id}" onclick="Engine.switchCategory('${c.id}')">${c.icon || '📁'} ${c.name}</button>`;
    });
    nav.innerHTML = html;

    // 分类按钮高亮切换
    nav.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        nav.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('cat-active'));
        this.classList.add('cat-active');
      });
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();