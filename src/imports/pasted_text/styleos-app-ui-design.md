StyleOS 移动端 App UI 界面设计要求

【1. 全局基调与视觉规范 (Global Vibe & Aesthetic)】

产品定位与氛围 (Vibe)： 一款高级、克制、智能的个人数字时尚管家应用。整体感觉必须极其干净、简约、透气。【严禁使用任何卡通、低幼风格的插画或图标】，所有界面图标必须是极简、细线、具有高级几何感的单色现代图标。图片必须是带有真实布料质感的高清去背景衣物图。

色彩调色板 (Color System Tokens)： 严格遵守 85% 背景 + 10% 交互/文字 + 5% 点缀的黄金比例。

主暗色 (color/lunar-shadow)： #282828 (100% 透明度)。用于主按钮、大标题、主文本、深色 Dock 栏。

纯白 (color/clean-white)： #FFFFFF (100% 透明度)。用于悬浮卡片背景、深色按钮上的文字/图标。

亮灰/画布底 (color/gray-whisper)： #F7F7F7 (100% 透明度)。用于全局 Canvas 页面背景、浅色内凹槽位（抠图展示/输入框）。

强调绿 (color/gentle-olive)： #CBD77E (100% 或 15% 透明度底色)。用作 5% 的点缀，如激活状态点、AI 契合度徽章、主推荐高亮胶囊。

低饱和橙 (color/winter-hazel)： #E6CA9A (100% 或 20% 透明度底色)。用作天气胶囊、风格分类等次级点缀。

次级文本色 (color/text-secondary)： #8E8E93 (100% 透明度)。用于辅助说明、未选中状态。

微边框 (color/border-subtle)： rgba(40, 40, 40, 0.04) 1px Solid。用于浅色卡片微弱描边，替代传统重阴影。

形状与平滑圆角规范 (Shape & Corner System)： 强制采用 iOS 超椭圆连续平滑曲率 (Squircle，Corner Smoothing = 60%)。

32px： 大容器、底部弹出抽屉 (Bottom Sheet)。

24px： 标准卡片 (今日穿搭大卡片、天气模块、功能 Panel)。

16px： 单品缩略图网格、次级推荐小方块。

999px (全圆角)： 胶囊型组件 (Pills)、操作按钮、状态小角标。

表面材质与层级 (Elevation & Material)：

悬浮卡片 (Level 1 Surface)： Fill: #FFFFFF, Stroke: 1px Inside rgba(40,40,40,0.03), Drop Shadow: X:0, Y:6, Blur:24, Spread:-2, Color rgba(0,0,0,0.03)。

浅色内凹槽位 (Inset Slot)： Fill: #F7F7F7, 无边框无阴影。

中英文字体阶梯 (Typography Scale)： 中文优先苹方 (PingFang SC)，英文数字采用 SF Pro 或 Sora。

Display (数值大字)： 32px, Bold (700), Line Height 38px, Letter Spacing -0.5px。

H1 (页面主标题)： 22px, SemiBold (600), Line Height 28px, Letter Spacing -0.2px。

H2 (模块标题)： 17px, Medium (500), Line Height 24px, 0px。

Body 1 (正文主字)： 15px, Regular (400), Line Height 22px, 0px。

Body 2 (正文次字)： 13px, Regular (400), Line Height 18px, 0px。

Caption (微型标签)： 11px, Medium (500), Line Height 14px, +0.2px。

【2. 全局布局与通用组件 (Global Layout & Navigation)】

网格与间距 (8pt Grid System)： 页面左右安全边距固定 20px。卡片内边距 (Padding) 大卡片 20px，中小卡片 16px。主模块之间垂直间距 24px，标题与内容间距 12px，网格 Gap 12px。

磨砂悬浮底栏 (Glass Dock Bottom Nav)：

Fill: 深色版 rgba(40,40,40,0.92) 或浅色 rgba(255,255,255,0.88)。Backdrop Blur: 24px。Drop Shadow: Y:10, Blur:30, Color rgba(0,0,0,0.06)。

排布 5 个极简线性单色图标：首页、衣橱、[＋]、穿搭、我的。

中间的「＋」为纯色 #282828 背景的全圆角按钮，带白色极简十字。当前激活的菜单图标上方带有一直径 6px 的 #CBD77E (强调绿) 状态指示点。

【3. 页面详细拆解 (Screen-by-Screen Breakdown)】

页面 1：首页 (Home - 今日推荐)

背景： 画布底色 color/gray-whisper (#F7F7F7)。

欢迎模块： 距顶部 60px，左侧 Padding 20px。H1标题“下午好，Kyla” (#282828)。紧跟下方 Body 2 文本“8 月 21 日 星期五” (#8E8E93)。右侧点缀一个低饱和橙胶囊 (20% #E6CA9A底色)，内部 Caption 文字“☀️ 26℃” (#282828)。

今日推荐卡片区： 悬浮卡片 (Level 1 Surface)，24px Squircle，Padding 20px。卡片主体为高清穿搭图。右上方悬浮极细描边 ♡。左下方悬浮 AI 契合度徽章 (20% #CBD77E 底色，Caption 文字 #282828，带极小绿点)。旁侧跟随常规胶囊“通勤”、“简约” (Fill #F7F7F7, Body 2 文字 #8E8E93)。

规划下一套： H2 标题“规划下一套” (#282828)。下方横向排列胶囊标签 (Pills, 高度 36px, Padding 16px, 999px 全圆角)。未激活态 (Fill #FFFFFF, 文字 #8E8E93)。

衣橱洞察卡片： 全宽卡片，24px Squircle，浅色内凹槽位质感 (Fill #FFFFFF)。内部正文为主文案 Body 1 (#282828)：“有 5 件单品已经很久没有穿了”。

页面 2：穿搭详情 (Outfit Details Overlay)

背景遮罩： 黑色 60% 透明度 + 模糊效果。

底部抽屉 (Bottom Sheet)： 顶部圆角 32px Squircle，Fill #FFFFFF。距离屏幕顶部保留 80px 空间。

图文区： 顶部居中高清穿搭图。下方 H2 标签区（如☀️ 26℃、通勤）。

AI 推荐理由区： Body 1 文本 (#282828)：“今天温度适中，这套搭配轻便舒适，也符合你平时偏好的简约风格。”

单品网格区： 2x2 网格，Gap 12px。每个槽位 (Inset Slot) 为 16px Squircle，Fill #F7F7F7。槽位内部为去背衣物。槽位右上角放置细线版的“×”和“⇄”极简图标。

CTA 按钮： 主按钮 (高度 52px, 999px全圆角)。Fill #282828，文字 16px SemiBold #FFFFFF“穿这套”。

页面 3：衣橱 (Wardrobe Dashboard)

背景： 画布底色 #FFFFFF。

数据概览区： 距顶部 60px。三组数据并排。大数字使用 Display (32px Bold #282828)。描述文字使用 Caption (#8E8E93)。

操作栏： 高度 36px。左侧搜索框为浅色内凹槽位 (Fill #F7F7F7)，带有细线极简放大镜图标。右侧为独立悬浮圆形按钮 ♡ 和 ☷。

分类导航： 横向文本菜单。选中项为 H2 (#282828)，右上角带 6px #CBD77E 状态圆点指示灯。未选中项为 Body 1 (#8E8E93)。

单品网格 (Grid)： 3 列等宽布局，Gap 12px。每个单元格为 16px Squircle，Fill #F7F7F7。高清去背单品居中，右上角悬浮极简 ♡。

页面 4：单品详情 (Item Details)

核心大图区： 占据屏幕上方巨大面积的浅色内凹槽位 (Fill #F7F7F7)，32px Squircle。极度留白，中心放置去背衣物。

主标题与警示卡： H1 标题 (#282828)。下方是一个高度 36px 的提醒胶囊，底色为 20% #E6CA9A，内部 Body 2 文字 (#282828)：“已经 42 天没穿了，用它搭一套”。

信息标签区： 列表左侧为 Body 2 字段名 (#8E8E93)，右侧为胶囊形参数 (Fill #F7F7F7, Body 2 #282828)。

底端按钮组： 上方为主要按钮 (52px, 999px, #282828, #FFFFFF文字带✦闪光图标)：“AI 帮我搭一套”。下方为次要按钮 (52px, 999px, #FFFFFF, 边框 rgba(40,40,40,0.08), #282828文字)：“自己搭配”。

页面 5：＋创建页 (Create Panel Bottom Sheet)

底部抽屉： 类似页面 2 遮罩。顶部圆角 32px Squircle，Fill #FFFFFF。

两张功能卡片： 采用 24px Squircle，浅色内凹槽位 (Fill #F7F7F7)。内部左侧极简高级线性图标 (大号)，H2 标题“录入单品”/“生成穿搭” (#282828)，Body 2 辅助文案 (#8E8E93)。

页面 5-2：AI 搭配设置 (Prompt Builder)

标题区： H1“AI 生成穿搭”，Body 2 副标题“告诉我，你今天想怎么穿？”。

交互胶囊 (Pill Filters)： “场景”与“风格”标签组。选中态背景为强调绿 #CBD77E，文字 #282828 (字重 600)。未选中态背景 #F7F7F7，文字 #8E8E93。

输入框： 大面积浅色内凹槽位 (Fill #F7F7F7, 24px Squircle)。Body 1 占位文本 (#8E8E93)。

底端 CTA： 主按钮“开始生成 ✦” (#282828)。

页面 5-3：AI 搭配结果 (AI Match Result)

排版结构： 与页面 2 的 2x2 网格一致，但为纯白画布无遮罩。

微徽章强化： 在“通勤”等标签旁增加 AI 契合度徽章 (20% #CBD77E 胶囊，Caption #282828 文字)。

底端 CTA： 主按钮“保存这套穿搭”。

页面 5-4：手动搭配 (Manual Builder)

上方画布区： 浅色内凹大槽位 (Fill #F7F7F7)，内部提供 3 个 16px Squircle 虚线微边框底座 (rgba(40,40,40,0.1)) 用于放置衣物。

下方库存区： 沿用页面 3 的 3 列无缝网格交互，点击衣服图片即可飞入上方底座。

页面 6：穿搭资产库 (Lookbook)

Tab 栏： H1 字号，选中态带有底部黑色细横线指示器，未选中为 #8E8E93。

横幅提醒： 20% #E6CA9A 底色的长条卡片，Body 2 文字“☀️ 今日天气适合的穿搭优先展示”。

双列网格 (Masonry)： 悬浮卡片材质 (Level 1 Surface, 24px Squircle, Drop Shadow Blur 24)。卡片内嵌高清穿搭图，下方并排胶囊标签及 Caption 小字“穿过 5 次”(#8E8E93)。

页面 6-1：穿搭详情 (Lookbook Detail)

结构： 顶部巨幅高清图。

数据区： H2 标题标明标签，下方单独一行高亮 Caption 文本“穿过 5 次”。

AI 解析区： 标题+ Body 1 文本 (#282828)。单品以 2x2 纯展示网格列出 (16px Squircle, Fill #F7F7F7)。

底端 CTA： 52px #282828 按钮“今天穿这套”。

页面 7：我的 (Profile & Settings)

个人资料区： 完美圆形头像。下方 H1 名字 (#282828)，Caption 副标题 (#8E8E93)。

数据统计： 均分三列。大数字 Display 32px (#282828)，底部 Caption 标签 (#8E8E93)。

列表模块 (Cards)： 采用悬浮卡片 (Level 1 Surface, 24px Squircle, Fill #FFFFFF)。内部采用纵向列表排版，左侧搭配极细几何线性图标 (如 ✦, ✨, ⚙, 🔒)，H2 标题，右侧带极简右箭头。组内项目采用 rgba(40,40,40,0.04) 微边框横线作为分隔线。

【4. 必须坚守的视觉底线 (Guardrails)】

绝对禁止卡通元素： 该应用定位高端时尚赛道，任何图标、插画必须是极致精简的细线几何形 (Line-art minimal icons)，绝不允许出现 Q 版、二次元或厚涂风格的 UI 元素。

严苛的圆角与光影纪律： 必须呈现 iOS Squircle 连续曲率。严禁出现死黑硬阴影，所有卡片必须依靠 1px 微边框和极淡的大模糊投影 (0.03 不透明度) 来拉开层级。

8pt 网格与绝对呼吸感： 必须确保 20px 的左右安全边距和模块间 24px 的充足留白。不要让界面显得拥挤，文字内容必须严格遵循 Typography 设定的行高 (Line Height) 维持纵向透气感。