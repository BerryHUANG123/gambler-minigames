// ========== 皮克松赌场 — 100个游戏配置 ==========
// 纯数据配置，由 game-factory.js 和 main.js 处理

const ALL_GAMES = [

  // ==================== 🎲 骰子类 (7个) ====================
  { id:'dice', icon:'🎲', name:'掷骰子', desc:'押大押小围骰，买定离手！', category:'dice', catName:'骰子', catIcon:'🎲', help:'选择一个选项（大/小/围骰）下注，然后点击"掷骰子！"。两颗骰子点数之和4-6为大，1-3为小，两颗相同为围骰。猜中即可赢得对应倍数的奖金。', file:'js/games/dice.js' },
  { id:'hilo', icon:'🀄', name:'猜大小', desc:'三颗骰子猜点数范围，11以上还是10以下？', category:'dice', catName:'骰子', catIcon:'🎲', help:'下注后系统掷三颗骰子，猜三颗骰子点数总和是11以上（大）还是10以下（小）。猜中赢得2倍奖金。', file:'js/games/hilo.js' },
  { id:'dice3', icon:'🎲', name:'三骰比大小', desc:'你和电脑各掷三骰，比比谁的总和大！', category:'dice', catName:'骰子', catIcon:'🎲', template:'dice', diceCount:3, choices:{big:'比电脑大 🏆',small:'比电脑小 💀'}, mult:2 },
  { id:'dice-oe', icon:'🎲', name:'猜单双', desc:'猜两骰点数之和是单还是双。', category:'dice', catName:'骰子', catIcon:'🎲', template:'dice', choices:{odd:'单数 🌀',even:'双数 ✌️'}, mult:2 },
  { id:'dice-exact', icon:'🎲', name:'押点数', desc:'精确押两骰点数之和（2-12）！', category:'dice', catName:'骰子', catIcon:'🎲', template:'dice', choices:{'7':'7点 x5'}, mult:5 },
  { id:'dice-race', icon:'🏁', name:'赛骰子', desc:'两枚骰子赛跑，押谁的点数更大！', category:'dice', catName:'骰子', catIcon:'🎲', template:'dice', choices:{d1:'骰子1赢 🏆',d2:'骰子2赢 🏆',tie:'平局 x8'}, mult:3 },
  { id:'dice-poker', icon:'🎲', name:'骰子梭哈', desc:'五颗骰子，豹子>顺子>对子，比组合大小！', category:'dice', catName:'骰子', catIcon:'🎲', help:'下注后掷五颗骰子，按骰子组合大小判定输赢。豹子（五颗相同）> 四条 > 葫芦 > 顺子 > 三条 > 两对 > 一对。组合越大，奖金越高。', file:'js/games/dice-poker.js' },

  // ==================== ♠️ 扑克/牌类 (10个) ====================
  { id:'blackjack', icon:'♠️', name:'21点', desc:'经典Blackjack，跟庄家对赌！', category:'card', catName:'扑克牌', catIcon:'♠️', help:'玩家和庄家各发两张牌，玩家可继续要牌（Hit）或停牌（Stand）。目标是使牌面点数尽量接近21但不超过21。比庄家点数大即获胜，黑杰克（A+10点牌）直接获胜。', file:'js/games/blackjack.js' },
  { id:'cardcheck', icon:'🃏', name:'验牌', desc:'三张牌里找出老千牌，皮克松的绝活！', category:'card', catName:'扑克牌', catIcon:'♠️', help:'皮克松出了三张牌让你检查，其中有一张是老千牌。找出哪张牌被做了手脚即可获胜。仔细看牌的细节！', file:'js/games/cardcheck.js' },
  { id:'war', icon:'⚔️', name:'比点数', desc:'翻牌比大小，A最大2最小！', category:'card', catName:'扑克牌', catIcon:'♠️', help:'你和电脑各发一张牌比大小，A最大2最小。牌面大的一方获胜。下注后点击翻牌！', file:'js/games/war.js' },
  { id:'rps', icon:'✂️', name:'猜拳', desc:'石头剪刀布，三局两胜！', category:'card', catName:'扑克牌', catIcon:'♠️', help:'石头剪刀布，三局两胜制。石头赢剪刀，剪刀赢布，布赢石头。每轮选择你的手势，先赢两局者获胜。', file:'js/games/rps.js' },
  { id:'guess-suit', icon:'♠️', name:'猜花色', desc:'猜下一张牌的花色，x4赔率！', category:'card', catName:'扑克牌', catIcon:'♠️', template:'wheel', segments:[{label:'♠ 黑桃 x4',mult:4,icon:'♠️'},{label:'♥ 红心 x4',mult:4,icon:'♥️'},{label:'♦ 方块 x4',mult:4,icon:'♦️'},{label:'♣ 梅花 x4',mult:4,icon:'♣️'},{label:'💀 没中',mult:0,icon:'💀'},{label:'💀 没中',mult:0,icon:'💀'}] },
  { id:'guess-face', icon:'♠️', name:'猜牌面', desc:'猜牌面A-K，一次机会x13！', category:'card', catName:'扑克牌', catIcon:'♠️', template:'guess', min:1, max:13, attempts:1, multiplier:13, desc:'猜1-13（A-K），中了x13！' },
  { id:'old-maid', icon:'🃏', name:'抽鬼牌', desc:'抽牌配对，最后拿鬼牌的人输！', category:'card', catName:'扑克牌', catIcon:'♠️', help:'轮流向对方抽牌，抽到配对就弃牌。最后手里拿着鬼牌（Joker）的人输。注意不要抽到鬼牌！', file:'js/games/old-maid.js' },
  { id:'paigu', icon:'🀄', name:'推牌九', desc:'两张牌比点数大小！', category:'card', catName:'扑克牌', catIcon:'♠️', help:'两张牌比点数大小。每张牌有对应的点数，两张牌组合成最佳点数。比庄家点数大就赢。', file:'js/games/paigu.js' },
  { id:'baccarat', icon:'🃏', name:'百家乐', desc:'经典百家乐，庄闲对赌！', category:'card', catName:'扑克牌', catIcon:'♠️', help:'押庄家或闲家谁的点数更接近9。也可以押和局。牌面点数：A=1，10/J/Q/K=0，其他按牌面数字。下注后发牌判定输赢。', file:'js/games/baccarat.js' },
  { id:'texas', icon:'♠️', name:'德州扑克', desc:'简化版，五张牌比大小！', category:'card', catName:'扑克牌', catIcon:'♠️', help:'简化版德州扑克。系统发五张牌比大小，按标准扑克牌型判定。下注后点击发牌，看你的牌型能赢多少。', file:'js/games/texas.js' },

  // ==================== 🎰 老虎机/转盘类 (10个) ====================
  { id:'slot', icon:'🎰', name:'老虎机', desc:'777！三列转盘，一拉暴富！', category:'slot', catName:'老虎机', catIcon:'🎰', help:'点击"转！"按钮旋转老虎机转盘。三列转出相同图案即可中奖，不同图案组合对应不同赔率。777是大奖！', file:'js/games/slot.js' },
  { id:'luckywheel', icon:'🍀', name:'幸运转盘', desc:'转一转，大奖等你拿！', category:'slot', catName:'老虎机', catIcon:'🎰', help:'点击"转！"旋转幸运转盘，转盘上的指针会停在某个区域。每个区域标注了对应的奖励倍数。停中即获得对应倍数的奖金！', file:'js/games/luckywheel.js' },
  { id:'roulette', icon:'🎡', name:'轮盘', desc:'红黑奇偶任你押！', category:'slot', catName:'老虎机', catIcon:'🎰', help:'经典轮盘游戏。可选择押红/黑、奇/偶、高/低（1-18/19-36）或具体数字。点击轮盘下方的筹码按钮下注，然后点击"转！"旋转轮盘。', file:'js/games/roulette.js' },
  { id:'fruit-machine', icon:'🍎', name:'水果机', desc:'水果主题老虎机！', category:'slot', catName:'老虎机', catIcon:'🎰', help:'水果主题老虎机！三种水果图案组合中奖。不同水果组合对应不同赔率。点击"转！"开始。', file:'js/games/fruit-machine.js' },
  { id:'gem-match', icon:'💎', name:'宝石迷阵', desc:'匹配宝石赢大奖！', category:'slot', catName:'老虎机', catIcon:'🎰', help:'宝石匹配游戏！旋转转盘匹配相同的宝石图案，匹配成功即可赢得对应奖励。', file:'js/games/gem-match.js' },
  { id:'number-wheel', icon:'🎡', name:'数字转盘', desc:'转盘1-8猜数字！', category:'slot', catName:'老虎机', catIcon:'🎰', template:'wheel', segments:[{label:'💰 1 x8',mult:8,icon:'💰'},{label:'💎 2 x4',mult:4,icon:'💎'},{label:'⭐ 3 x3',mult:3,icon:'⭐'},{label:'🍀 4 x2',mult:2,icon:'🍀'},{label:'🎯 5 x2',mult:2,icon:'🎯'},{label:'👑 6 x2',mult:2,icon:'👑'},{label:'🎪 7 x2',mult:2,icon:'🎪'},{label:'🔮 8 x2',mult:2,icon:'🔮'},{label:'💀 没中',mult:0,icon:'💀'},{label:'💀 没中',mult:0,icon:'💀'}] },
  { id:'animal-wheel', icon:'🐯', name:'动物转盘', desc:'押中生肖赢钱！', category:'slot', catName:'老虎机', catIcon:'🎰', template:'wheel', segments:[{label:'🐯 虎 x3',mult:3,icon:'🐯'},{label:'🐰 兔 x2',mult:2,icon:'🐰'},{label:'🐲 龙 x5',mult:5,icon:'🐲'},{label:'🐴 马 x3',mult:3,icon:'🐴'},{label:'🐵 猴 x4',mult:4,icon:'🐵'},{label:'💀 没中',mult:0,icon:'💀'},{label:'💀 没中',mult:0,icon:'💀'},{label:'🐔 鸡 x2',mult:2,icon:'🐔'},{label:'🐶 狗 x3',mult:3,icon:'🐶'}] },
  { id:'zodiac-wheel', icon:'♈', name:'星座转盘', desc:'十二星座转盘！', category:'slot', catName:'老虎机', catIcon:'🎰', template:'wheel', segments:[{label:'♈ x3',mult:3,icon:'♈'},{label:'♉ x2',mult:2,icon:'♉'},{label:'♊ x4',mult:4,icon:'♊'},{label:'♋ x2',mult:2,icon:'♋'},{label:'♌ x5',mult:5,icon:'♌'},{label:'♍ x2',mult:2,icon:'♍'},{label:'♎ x3',mult:3,icon:'♎'},{label:'♏ x4',mult:4,icon:'♏'},{label:'💀 没中',mult:0,icon:'💀'},{label:'💀 没中',mult:0,icon:'💀'},{label:'♐ x3',mult:3,icon:'♐'},{label:'♑ x5',mult:5,icon:'♑'},{label:'♒ x3',mult:3,icon:'♒'},{label:'♓ x4',mult:4,icon:'♓'}] },
  { id:'super-wheel', icon:'🎡', name:'超级转盘', desc:'大奖翻倍再翻倍！', category:'slot', catName:'老虎机', catIcon:'🎰', template:'wheel', segments:[{label:'🍀 x2',mult:2,icon:'🍀'},{label:'💰 x3',mult:3,icon:'💰'},{label:'💎 x5',mult:5,icon:'💎'},{label:'👑 x10',mult:10,icon:'👑'},{label:'⭐ x2',mult:2,icon:'⭐'},{label:'🎰 x4',mult:4,icon:'🎰'},{label:'💀 没中',mult:0,icon:'💀'},{label:'💀 没中',mult:0,icon:'💀'},{label:'🔥 x3',mult:3,icon:'🔥'},{label:'🏆 x8',mult:8,icon:'🏆'}] },
  { id:'lottery-ball', icon:'🔮', name:'彩球机', desc:'3次猜1-36，中了x12！', category:'slot', catName:'老虎机', catIcon:'🎰', template:'guess', min:1, max:36, attempts:3, multiplier:12, desc:'3次猜1-36的彩球号码！' },

  // ==================== 🎯 反应/技巧类 (13个) ====================
  { id:'reaction-test', icon:'⚡', name:'反应测试', desc:'10秒限时狂点！', category:'reaction', catName:'反应', catIcon:'🎯', template:'reaction', type:'click', timeLimit:10 },
  { id:'whack-mole', icon:'🔨', name:'打地鼠', desc:'30秒打地鼠！', category:'reaction', catName:'反应', catIcon:'🎯', template:'reaction', type:'mole', timeLimit:30 },
  { id:'catch-coins', icon:'🪙', name:'接金币', desc:'10秒接金币！', category:'reaction', catName:'反应', catIcon:'🎯', template:'reaction', type:'coin', timeLimit:10 },
  { id:'shoot-target', icon:'🎯', name:'打靶子', desc:'10秒限时打靶！', category:'reaction', catName:'反应', catIcon:'🎯', template:'reaction', type:'dart', timeLimit:10 },
  { id:'catch-apples', icon:'🍎', name:'接苹果', desc:'10秒接苹果丰收！', category:'reaction', catName:'反应', catIcon:'🎯', template:'reaction', type:'apple', timeLimit:10 },
  { id:'speed-tap', icon:'👆', name:'快按', desc:'10秒狂按比赛！', category:'reaction', catName:'反应', catIcon:'🎯', template:'reaction', type:'click', timeLimit:10 },
  { id:'bomb', icon:'💣', name:'拆弹', desc:'三个按钮一个会炸！', category:'reaction', catName:'反应', catIcon:'🎯', help:'三个按钮中选择一个按下，其中一个按钮会"爆炸"。避开炸弹按钮即可赢得筹码。每轮安全递增奖励！', file:'js/games/bomb.js' },
  { id:'dodge-bullets', icon:'💫', name:'躲子弹', desc:'躲避飞来的子弹！', category:'reaction', catName:'反应', catIcon:'🎯', help:'躲避从各个方向飞来的子弹！用键盘方向键或屏幕按钮移动角色，尽可能长时间存活。每多存活一秒奖励更高。', file:'js/games/dodge.js' },
  { id:'precision-click', icon:'🎯', name:'精准点击', desc:'点中移动目标！', category:'reaction', catName:'反应', catIcon:'🎯', help:'屏幕上会出现一个移动的目标，在它消失前点击它。点击越精准、越快，得分越高。下注后开始游戏。', file:'js/games/precision.js' },
  { id:'darts', icon:'🎯', name:'飞镖', desc:'射靶心赢大奖！', category:'reaction', catName:'反应', catIcon:'🎯', help:'点击"投掷"按钮射飞镖，瞄准靶心得分。越靠近靶心分数越高，根据总得分结算奖金。', file:'js/games/darts.js' },
  { id:'minefield', icon:'💣', name:'踩地雷', desc:'6x6格子选路！', category:'reaction', catName:'反应', catIcon:'🎯', help:'在6x6的格子中点击格子，避开地雷。每点开一个安全格获得分数，点到地雷则游戏结束。下注后开始踩格子。', file:'js/games/minefield.js' },
  { id:'rhythm-hero', icon:'🥁', name:'节奏大师', desc:'跟着节奏敲鼓点！', category:'reaction', catName:'反应', catIcon:'🎯', help:'跟随节奏在正确的时机点击鼓点。屏幕上会出现下落音符，当音符到达目标区域时按下对应按键。准确率越高得分越高。', file:'js/games/rhythm-hero.js' },
  { id:'click-war', icon:'👆', name:'点击大战', desc:'和电脑比赛点击！', category:'reaction', catName:'反应', catIcon:'🎯', help:'和电脑比赛谁点击得更快！在限定时间内疯狂点击你的按钮，点击次数多者获胜。下注后开始比赛。', file:'js/games/click-war.js' },

  // ==================== 🧠 记忆类 (8个) ====================
  { id:'memory-cards', icon:'🃏', name:'记忆翻牌', desc:'6对12张牌配对！', category:'memory', catName:'记忆', catIcon:'🧠', template:'memory', pairs:6 },
  { id:'memory-hard', icon:'🃏', name:'记忆翻牌·难', desc:'8对16张高级挑战！', category:'memory', catName:'记忆', catIcon:'🧠', template:'memory', pairs:8 },
  { id:'memory-patterns', icon:'🎨', name:'图案记忆', desc:'5对图案配对吧！', category:'memory', catName:'记忆', catIcon:'🧠', template:'memory', pairs:5 },
  { id:'memory-numbers', icon:'🔢', name:'数字记忆', desc:'记住数字序列！', category:'memory', catName:'记忆', catIcon:'🧠', help:'屏幕上会显示一串数字，记住它们。数字消失后，按顺序输入你记住的数字。正确数字越多奖金越高。', file:'js/games/memory-numbers.js' },
  { id:'memory-seq', icon:'🔄', name:'顺序记忆', desc:'记住点击顺序！', category:'memory', catName:'记忆', catIcon:'🧠', help:'屏幕上会依次亮起一些图案或位置，记住它们的顺序。然后按照相同的顺序点击它们。序列越来越长，全部正确即可获胜。', file:'js/games/memory-seq.js' },
  { id:'memory-colors', icon:'🌈', name:'颜色记忆', desc:'记住颜色序列！', category:'memory', catName:'记忆', catIcon:'🧠', help:'屏幕上显示一系列颜色，记住颜色出现的顺序。然后在选项中按照相同顺序选择颜色。全部正确即可赢得奖金。', file:'js/games/memory-colors.js' },
  { id:'memory-words', icon:'📝', name:'单词记忆', desc:'记住单词列表！', category:'memory', catName:'记忆', catIcon:'🧠', help:'屏幕上显示一系列词语，记住它们。词语消失后从选项中找到你刚才看到的词语。正确数量越多奖金越高。', file:'js/games/memory-words.js' },
  { id:'memory-path', icon:'🗺️', name:'路径记忆', desc:'记住迷宫路径！', category:'memory', catName:'记忆', catIcon:'🧠', help:'屏幕上显示一条迷宫路径，记住路径走向。然后按照记忆重新走出正确的路径。路径越长越复杂，奖金越高。', file:'js/games/memory-path.js' },

  // ==================== 🧩 益智类 (12个) ====================
  { id:'tictactoe', icon:'❌', name:'井字棋', desc:'和电脑三局两胜！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'和电脑玩井字棋，三局两胜。在3x3的格子中轮流下子，横、竖或斜连成一线即获胜。下注后开始。', file:'js/games/tictactoe.js' },
  { id:'guess-number', icon:'🔢', name:'猜数字', desc:'5次猜1-100，猜中赢钱！', category:'puzzle', catName:'益智', catIcon:'🧩', template:'guess', min:1, max:100, attempts:5, multiplier:6, desc:'猜1-100，5次机会！' },
  { id:'minesweeper', icon:'💣', name:'扫雷', desc:'经典扫雷8x8！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'经典扫雷游戏8x8。点击格子翻开，数字表示周围地雷数量。标记所有地雷即可获胜。点击到地雷则游戏结束。', file:'js/games/minesweeper.js' },
  { id:'game2048', icon:'🔢', name:'2048', desc:'合并冲到2048！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'经典2048游戏。用方向键移动方块，相同数字的方块合并相加。目标是合并出2048这个数字方块。', file:'js/games/game2048.js' },
  { id:'sudoku', icon:'🔢', name:'数独', desc:'4x4小数独填满！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'4x4数独游戏。每行、每列和每个2x2宫格都填入数字1-4，不重复。全部填对即可获胜。', file:'js/games/sudoku.js' },
  { id:'idiom-fill', icon:'📖', name:'成语填空', desc:'填成语考语文功底！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'根据提示补全成语中的空缺字。选择正确的字填入，全部填对即可获胜。', file:'js/games/idiom-fill.js' },
  { id:'find-diff', icon:'🔍', name:'找不同', desc:'找出两幅图的不同！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'两幅看似相同的图片，找出它们之间的不同之处。找到所有不同点即可获胜。', file:'js/games/find-diff.js' },
  { id:'klotski', icon:'🧩', name:'华容道', desc:'让曹操逃出去！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'经典华容道游戏。通过滑动方块让曹操（最大方块）移动到出口位置。步数越少奖励越高。', file:'js/games/klotski.js' },
  { id:'sokoban', icon:'📦', name:'推箱子', desc:'把箱子推到目标！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'经典推箱子游戏。把所有的箱子推到指定的目标位置上。规划好推箱子的路线，全部到位即可过关。', file:'js/games/sokoban.js' },
  { id:'fifteen', icon:'🧩', name:'数字华容道', desc:'4x4排列1-15！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'4x4的数字华容道，数字1-15打乱排列。通过滑动方块按顺序排列1-15即可获胜，最后一位留空。', file:'js/games/fifteen.js' },
  { id:'connect4', icon:'🟡', name:'四子棋', desc:'横竖斜连四子赢！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'和电脑玩四子棋，在7x6的竖立棋盘上轮流落子。横、竖或斜连成四子即获胜。', file:'js/games/connect4.js' },
  { id:'mastermind', icon:'🎨', name:'猜密码', desc:'猜颜色密码组合！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'猜颜色密码组合。系统生成一组4个颜色的密码，你有若干次机会猜测。每次猜完后会提示正确颜色和正确位置的数量。', file:'js/games/mastermind.js' },

  // ==================== ❓ 问答/知识类 (10个) ====================
  { id:'trivia', icon:'❓', name:'常识问答', desc:'10题日常知识！', category:'quiz', catName:'问答', catIcon:'❓', template:'quiz',
    questions:[{q:'中国的首都是？',o:['北京','上海','广州','深圳'],a:0},{q:'一年有几天？',o:['360','365','300','350'],a:1},{q:'水的化学式是？',o:['CO2','H2O','NaCl','O2'],a:1},{q:'太阳从哪边升起？',o:['西边','北边','东边','南边'],a:2},{q:'一公里等于多少米？',o:['100','500','1000','2000'],a:2},{q:'最大的海洋是？',o:['大西洋','太平洋','印度洋','北冰洋'],a:1},{q:'人体心脏几个腔？',o:['2个','3个','4个','5个'],a:2},{q:'《西游记》作者是？',o:['曹雪芹','施耐庵','吴承恩','罗贯中'],a:2},{q:'光年是啥单位？',o:['时间','距离','速度','质量'],a:1},{q:'面积最大的国家？',o:['中国','美国','加拿大','俄罗斯'],a:3}] },
  { id:'riddles', icon:'🤔', name:'猜谜语', desc:'10题谜语开动脑筋！', category:'quiz', catName:'问答', catIcon:'❓', template:'quiz',
    questions:[{q:'什么东西越洗越脏？',o:['衣服','水','手','碗'],a:1},{q:'什么动物最怕水？',o:['猫','狗','鱼','老虎'],a:0},{q:'什么字人人念错？',o:['错字','生字','难字','多音字'],a:0},{q:'什么东西不怕火？',o:['木头','冰','纸','金'],a:1},{q:'什么车不能上路？',o:['自行车','火车','汽车','风车'],a:3},{q:'什么东西越削越大？',o:['铅笔','苹果','坑','木头'],a:2},{q:'什么球不能踢？',o:['足球','篮球','排球','眼球'],a:3},{q:'什么布不能做衣服？',o:['棉布','丝绸','瀑布','麻布'],a:2},{q:'什么门永远关不上？',o:['木门','铁门','球门','石门'],a:2},{q:'什么花不能摸？',o:['玫瑰','牡丹','火花','梅花'],a:2}] },
  { id:'brain-teasers', icon:'🧠', name:'脑筋急转弯', desc:'小心被绕晕！', category:'quiz', catName:'问答', catIcon:'❓', template:'quiz',
    questions:[{q:'越给它吃它越瘦？',o:['猪','火','狗','牛'],a:1},{q:'拿起来轻放下重？',o:['羽毛','呼吸','气球','棉花'],a:1},{q:'啥人生病不看医生？',o:['盲人','铁人','木头人','机器人'],a:2},{q:'啥东西晚上才出生？',o:['月亮','星星','影子','梦'],a:0},{q:'啥东西越擦越黑？',o:['黑板','桌子','玻璃','鞋子'],a:0},{q:'天天在门口不出门？',o:['看门狗','门槛','门牌','门铃'],a:1},{q:'越分越少合起来多？',o:['钱','时间','水','声音'],a:1},{q:'最不能爬的啥山？',o:['黄山','珠峰','人山','泰山'],a:2},{q:'不用白色用了黑？',o:['墨镜','黑板','粉笔','黑板擦'],a:2},{q:'整天坐着一动不动？',o:['学生','军人','和尚','病人'],a:2}] },
  { id:'guess-country', icon:'🌍', name:'猜国家', desc:'5题国家知识！', category:'quiz', catName:'问答', catIcon:'❓', template:'quiz',
    questions:[{q:'樱花富士山？',o:['韩国','日本','泰国','越南'],a:1},{q:'袋鼠考拉故乡？',o:['新西兰','南非','澳大利亚','巴西'],a:2},{q:'埃菲尔铁塔在哪？',o:['英国','意大利','德国','法国'],a:3},{q:'金字塔在哪？',o:['埃及','印度','墨西哥','希腊'],a:0},{q:'自由女神像在哪？',o:['法国','美国','英国','加拿大'],a:1}] },
  { id:'guess-city', icon:'🏙️', name:'猜城市', desc:'5题城市知识！', category:'quiz', catName:'问答', catIcon:'❓', template:'quiz',
    questions:[{q:'东方明珠塔？',o:['北京','广州','上海','深圳'],a:2},{q:'故宫在哪？',o:['西安','南京','北京','洛阳'],a:2},{q:'西湖在哪？',o:['杭州','苏州','无锡','宁波'],a:0},{q:'维多利亚港？',o:['上海','深圳','广州','香港'],a:3},{q:'熊猫繁育基地？',o:['重庆','成都','西安','昆明'],a:1}] },
  { id:'guess-animal', icon:'🐾', name:'猜动物', desc:'5题动物知识！', category:'quiz', catName:'问答', catIcon:'❓', template:'quiz',
    questions:[{q:'海洋最大动物？',o:['鲸鲨','蓝鲸','虎鲸','海豚'],a:1},{q:'陆地跑最快？',o:['狮子','猎豹','老虎','羚羊'],a:1},{q:'唯一会飞的哺乳动物？',o:['鸟','蝙蝠','蜜蜂','蝴蝶'],a:1},{q:'脖子最长？',o:['鸵鸟','长颈鹿','骆驼','大象'],a:1},{q:'沙漠之舟？',o:['骆驼','马','驴','牦牛'],a:0}] },
  { id:'history-quiz', icon:'📜', name:'历史问答', desc:'5题历史知识！', category:'quiz', catName:'问答', catIcon:'❓', template:'quiz',
    questions:[{q:'中国第一个皇帝？',o:['刘邦','嬴政','李世民','朱元璋'],a:1},{q:'长城哪个朝代建？',o:['秦朝','汉朝','明朝','唐朝'],a:0},{q:'四大发明不包括？',o:['造纸','印刷','陶瓷','火药'],a:2},{q:'蜀国开国皇帝？',o:['曹操','孙权','刘备','诸葛亮'],a:2},{q:'郑和下西洋啥朝代？',o:['宋朝','元朝','明朝','清朝'],a:2}] },
  { id:'geography-quiz', icon:'🌏', name:'地理问答', desc:'5题地理知识！', category:'quiz', catName:'问答', catIcon:'❓', template:'quiz',
    questions:[{q:'面积最大国家？',o:['中国','美国','俄罗斯','加拿大'],a:2},{q:'人口最多国家？',o:['中国','印度','美国','印尼'],a:1},{q:'最长河流？',o:['长江','亚马逊','尼罗河','密西西比'],a:2},{q:'世界最高峰？',o:['K2','珠峰','贡嘎','乞力马扎罗'],a:1},{q:'赤道横穿几个洲？',o:['2个','3个','4个','5个'],a:1}] },
  { id:'idiom-quiz', icon:'📖', name:'成语猜谜', desc:'看描述猜成语！', category:'quiz', catName:'问答', catIcon:'❓', help:'看描述猜成语。每题给出一个描述，从选项中选择对应的成语。答对题数越多奖金越高。', file:'js/games/idiom-quiz.js' },

  // ==================== 🎪 运气类 (9个) ====================
  { id:'coinflip', icon:'🎪', name:'猜硬币', desc:'正面反面50%胜率！', category:'luck', catName:'运气', catIcon:'🎪', help:'猜硬币正反面，50%胜率。选择正面或反面，系统抛硬币，猜中赢得2倍奖金。', file:'js/games/coinflip.js' },
  { id:'russian', icon:'💀', name:'俄罗斯轮盘', desc:'6发1颗子弹赌命！', category:'luck', catName:'运气', catIcon:'🎪', help:'俄罗斯轮盘！6个弹膛中有1发子弹。每次扣动扳机，活下来赢得筹码，中弹则输掉赌注。每次扣动扳机后弹膛转动。', file:'js/games/russian.js' },
  { id:'scratch', icon:'💳', name:'刮刮乐', desc:'三张刮刮卡手气！', category:'luck', catName:'运气', catIcon:'🎪', help:'三张刮刮卡，选择一张刮开。刮开后显示奖励金额，直接获得对应筹码。全靠手气！', file:'js/games/scratch.js' },
  { id:'fortune-stick', icon:'🎋', name:'抽签', desc:'抽运势签看看今天！', category:'luck', catName:'运气', catIcon:'🎪', template:'luck', options:[{label:'大吉 🎉 x5',mult:5,icon:'🎉'},{label:'中吉 🌟 x3',mult:3,icon:'🌟'},{label:'小吉 🍀 x2',mult:2,icon:'🍀'},{label:'吉 👍 x1.5',mult:1.5,icon:'👍'},{label:'凶 💀',mult:0,icon:'💀'},{label:'大凶 ☠️',mult:0,icon:'☠️'}], desc:'抽一支运势签！' },
  { id:'treasure-chest', icon:'📦', name:'开宝箱', desc:'开箱抽奖有宝贝！', category:'luck', catName:'运气', catIcon:'🎪', template:'luck', options:[{label:'💎 钻石 x8',mult:8,icon:'💎'},{label:'💰 金币 x3',mult:3,icon:'💰'},{label:'🍀 幸运币 x2',mult:2,icon:'🍀'},{label:'🪙 铜板 x1.5',mult:1.5,icon:'🪙'},{label:'💩 谢谢',mult:0,icon:'💩'},{label:'🐍 蛇！',mult:0,icon:'🐍'}], desc:'开个宝箱看手气！' },
  { id:'card-pack', icon:'🃏', name:'抽卡包', desc:'稀有卡牌等你拿！', category:'luck', catName:'运气', catIcon:'🎪', template:'luck', options:[{label:'🌟 SSR x10！',mult:10,icon:'🌟'},{label:'✨ SR x5',mult:5,icon:'✨'},{label:'⭐ R x2',mult:2,icon:'⭐'},{label:'🃏 N x1.5',mult:1.5,icon:'🃏'},{label:'💀 白卡',mult:0,icon:'💀'},{label:'👻 空包',mult:0,icon:'👻'}], desc:'抽一张卡包！' },
  { id:'lucky-number', icon:'🔢', name:'幸运数字', desc:'1-10猜中x8！', category:'luck', catName:'运气', catIcon:'🎪', template:'guess', min:1, max:10, attempts:1, multiplier:8, desc:'猜1-10幸运数字！' },
  { id:'ring-toss', icon:'⭕', name:'套圈', desc:'套圈赢奖品！', category:'luck', catName:'运气', catIcon:'🎪', template:'luck', options:[{label:'🎯 大奖 x5',mult:5,icon:'🎯'},{label:'🍀 中奖 x2',mult:2,icon:'🍀'},{label:'👍 小奖 x1.5',mult:1.5,icon:'👍'},{label:'💀 没中',mult:0,icon:'💀'},{label:'💀 没中',mult:0,icon:'💀'},{label:'💀 没中',mult:0,icon:'💀'}], desc:'扔个圈套中奖品！' },
  { id:'lucky-wheel-plain', icon:'🎡', name:'简易转盘', desc:'简单转盘抽奖！', category:'luck', catName:'运气', catIcon:'🎪', template:'wheel', segments:[{label:'💰 x3',mult:3,icon:'💰'},{label:'🍀 x2',mult:2,icon:'🍀'},{label:'⭐ x1.5',mult:1.5,icon:'⭐'},{label:'💀',mult:0,icon:'💀'},{label:'💀',mult:0,icon:'💀'},{label:'👑 x5',mult:5,icon:'👑'}] },

  // ==================== 🏀 体育类 (5个) ====================
  { id:'hoops', icon:'🏀', name:'投篮', desc:'投篮命中赢筹码！', category:'sports', catName:'体育', catIcon:'🏀', help:'投篮游戏！点击"投篮"按钮投篮，篮球中的概率和你的投掷角度有关。投中即赢得筹码！', file:'js/games/hoops.js' },
  { id:'shoot-goal', icon:'⚽', name:'射门', desc:'足球射门死角！', category:'sports', catName:'体育', catIcon:'🏀', help:'足球射门游戏！选择射门方向（左/中/右），守门员会扑向一个方向。射中守门员扑救的反方向即可进球得分。', file:'js/games/shoot-goal.js' },
  { id:'bowling', icon:'🎳', name:'保龄球', desc:'全倒赢大奖！', category:'sports', catName:'体育', catIcon:'🏀', help:'保龄球游戏！拖动瞄准控制力度和方向，松开释放球。击倒所有球瓶（全倒）赢得最高奖金。', file:'js/games/bowling.js' },
  { id:'horse-racing', icon:'🐎', name:'赛马', desc:'赛马下注夺冠！', category:'sports', catName:'体育', catIcon:'🏀', help:'赛马下注！比赛开始前选择一匹马下注，比赛过程中马匹随机前进。你押的马跑第一即获胜。', file:'js/games/horse-racing.js' },
  { id:'boxing-bet', icon:'🥊', name:'拳击', desc:'猜红蓝谁赢！', category:'sports', catName:'体育', catIcon:'🏀', help:'拳击比赛下注！猜红方或蓝方选手谁会赢得比赛。下注后观看比赛，你押的选手获胜即可赢得奖金。', file:'js/games/boxing.js' },

  // ==================== 🔢 数学/逻辑类 (7个) ====================
  { id:'speed-math', icon:'⚡', name:'速算', desc:'10秒限时算术！', category:'math', catName:'数学', catIcon:'🔢', help:'10秒限时算术题！尽可能多地回答加减乘除题目。答对越多奖金越高，超时自动结算。下注后开始答题。', file:'js/games/speed-math.js' },
  { id:'game24', icon:'🔢', name:'24点', desc:'加减乘除凑24！', category:'math', catName:'数学', catIcon:'🔢', help:'24点游戏！系统给出4个数字，用加减乘除运算使结果等于24。每个数字必须用一次。在规定时间内算出即可赢奖。', file:'js/games/game24.js' },
  { id:'find-pattern', icon:'🔍', name:'找规律', desc:'找数字规律！', category:'math', catName:'数学', catIcon:'🔢', help:'找数字规律！给出一串有规律的数字序列，找出下一个数字是什么。连续答对越多奖金越高。', file:'js/games/find-pattern.js' },
  { id:'number-seq', icon:'🔢', name:'数列', desc:'猜下一个数字！', category:'math', catName:'数学', catIcon:'🔢', help:'猜下一个数字！给出一串数字序列，找出其中的规律并预测下一个数字。猜中即可赢奖。', file:'js/games/number-seq.js' },
  { id:'prime-check', icon:'🔢', name:'质数判断', desc:'判断是否质数！', category:'math', catName:'数学', catIcon:'🔢', help:'判断一个数字是否为质数。系统给出一个数字，选择"是质数"或"不是质数"来回答。答对赢得奖金。', file:'js/games/prime-check.js' },
  { id:'base-convert', icon:'🔄', name:'进制转换', desc:'二进制十进制互转！', category:'math', catName:'数学', catIcon:'🔢', help:'进制转换题！系统给出一个二进制数或十进制数，在限定时间内转换成另一种进制。答对越多奖金越高。', file:'js/games/base-convert.js' },
  { id:'unit-convert', icon:'📏', name:'单位换算', desc:'长度重量互转！', category:'math', catName:'数学', catIcon:'🔢', help:'单位换算题！系统给出长度或重量单位换算题，选择正确答案。答对越多奖金越高。', file:'js/games/unit-convert.js' },

  // ==================== 🎨 创意/休闲类 (7个) ====================
  { id:'link-match', icon:'🔗', name:'连连看', desc:'消除所有方块！', category:'creative', catName:'休闲', catIcon:'🎨', help:'经典连连看游戏！找到两个相同且路径不超过两个拐角的方块，点击它们消除。消除所有方块即可获胜。', file:'js/games/link-match.js' },
  { id:'match3', icon:'💎', name:'三消', desc:'匹配三个消除！', category:'creative', catName:'休闲', catIcon:'🎨', help:'三消游戏！交换相邻的宝石使三个或以上相同宝石连成一线，消除得分。消除越多奖金越高。', file:'js/games/match3.js' },
  { id:'tetris', icon:'🧱', name:'俄罗斯方块', desc:'经典堆叠消除！', category:'creative', catName:'休闲', catIcon:'🎨', help:'经典俄罗斯方块！用方向键移动和旋转下落的方块，填满整行即可消除得分。堆到顶部则游戏结束。', file:'js/games/tetris.js' },
  { id:'snake', icon:'🐍', name:'贪吃蛇', desc:'经典别撞墙！', category:'creative', catName:'休闲', catIcon:'🎨', help:'经典贪吃蛇游戏！用方向键控制蛇移动吃食物，每吃一个食物蛇身变长。撞墙或撞到自己则游戏结束。', file:'js/games/snake.js' },
  { id:'breakout', icon:'🧱', name:'打砖块', desc:'打碎所有砖块！', category:'creative', catName:'休闲', catIcon:'🎨', help:'经典打砖块游戏！用挡板接住弹球，反弹打碎上方的砖块。所有砖块打碎即可过关。', file:'js/games/breakout.js' },
  { id:'pong', icon:'🏓', name:'乒乓球', desc:'和电脑对打！', category:'creative', catName:'休闲', catIcon:'🎨', help:'乒乓球游戏！用挡板接住并反弹球，和电脑对打。接不住球则对方得分，先到指定分数获胜。', file:'js/games/pong.js' },
  { id:'hangman', icon:'💀', name:'猜词', desc:'猜成语画完就输！', category:'creative', catName:'休闲', catIcon:'🎨', help:'猜词游戏！根据提示猜一个成语，每次猜一个字。猜错会画一笔，全部画完（上吊小人）则输。猜对成语赢奖金。', file:'js/games/hangman.js' },

  // ==================== 🎣 其他 (4个) ====================
  { id:'fishing', icon:'🎣', name:'钓鱼', desc:'钓鱼卖钱赢筹码！', category:'sports', catName:'体育', catIcon:'🏀', help:'钓鱼游戏！点击下钩，等待鱼儿上钩。在合适的时机收杆，钓到的鱼越大越值钱。卖鱼获得筹码！', file:'js/games/fishing.js' },
  { id:'dog-racing', icon:'🐕', name:'赛狗', desc:'狗狗赛跑下注！', category:'sports', catName:'体育', catIcon:'🏀', template:'luck', options:[{label:'🐕 猎豹号 x3',mult:3,icon:'🐕'},{label:'🐕 闪电号 x2',mult:2,icon:'🐕'},{label:'🐕 火箭号 x4',mult:4,icon:'🐕'},{label:'💀 没中',mult:0,icon:'💀'}], desc:'哪只狗狗跑第一？' },
  { id:'jigsaw', icon:'🧩', name:'拼图', desc:'数字拼图还原！', category:'puzzle', catName:'益智', catIcon:'🧩', help:'数字拼图还原！4x4格子中数字1-15被打乱，通过点击数字与空格交换位置，最终按顺序排列好即可获胜。', file:'js/games/jigsaw.js' },
];

// 统计
(function() {
  const cats = {};
  let template = 0, standalone = 0, ids = new Set(), dups = [];
  ALL_GAMES.forEach(g => {
    cats[g.category] = (cats[g.category] || 0) + 1;
    if (g.template) template++; else standalone++;
    if (ids.has(g.id)) dups.push(g.id);
    ids.add(g.id);
  });
  if (dups.length) console.warn('⚠️ 重复ID:', dups.join(', '));
  console.log(`🎮 皮克松赌场配置：${ALL_GAMES.length}个游戏 （模板${template}个 + 独立${standalone}个）`);
})();

// 交给GameFactory生成模板游戏，注册独立游戏
if (typeof GameFactory !== 'undefined' && GameFactory.generateGames) {
  GameFactory.generateGames(ALL_GAMES);
}