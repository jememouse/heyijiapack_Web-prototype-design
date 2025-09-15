const products = [
    // --- 卡纸盒 / Cardboard Box ---
    {
        id: 'P-01-KH-SC',
        name: '卡纸双插盒',
        category: '卡纸盒',
        description: 'P-01-KH-SC | 上下盖均为插入式，组装便捷，是最常见的卡盒结构。',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['上下盖均为插入式，组装便捷，无需胶水', '最经典的卡盒结构，生产周期短，成本效益高', '适合轻量级产品，应用场景广泛', '可完全平铺运输，极大节省仓储和物流成本'],
        scenarios: [
            {name: '化妆品单品', icon: 'heart', color: 'pink', description: '如口红、眼影、精华液等产品的标准包装。'},
            {name: '3C数码配件', icon: 'smartphone', color: 'blue', description: '如手机壳、充电线、耳机等轻量级配件。'},
            {name: '零售商品', icon: 'shopping-bag', color: 'green', description: '各类需要纸盒包装的零售商品，如牙膏、药品等。'},
            {name: '小型礼品', icon: 'gift', color: 'purple', description: '作为小型礼品或赠品的独立包装，经济实惠。'}
        ]
    },
    {
        id: 'P-01-KH-SD',
        name: '卡纸手动锁底盒',
        category: '卡纸盒',
        description: 'P-01-KH-SD | 手动锁底结构，承重能力强，适合稍有重量的产品。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['底部为锁扣式结构，无需胶水即可牢固锁定', '承重能力远高于普通插口盒，防止底部脱落', '组装相对快捷，结构稳固可靠', '适合瓶罐类、有一定重量的产品'],
        scenarios: [
            {name: '玻璃瓶装产品', icon: 'shield-plus', color: 'green', description: '如果酱、保健品、小型酒水等瓶装产品。'},
            {name: '稍重电子产品', icon: 'mouse-pointer-square', color: 'blue', description: '如鼠标、移动电源、小型音响等。'},
            {name: '玩具手办', icon: 'toy-brick', color: 'orange', description: '为有一定重量的玩具或手办提供可靠支撑。'},
            {name: '五金配件', icon: 'wrench', color: 'gray', description: '如螺丝、钉子、小型工具等产品的零售包装。'}
        ]
    },
    {
        id: 'P-01-KH-DS',
        name: '卡纸吊口盒-锁底式',
        category: '卡纸盒',
        description: 'P-01-KH-DS | 带吊口设计，锁底结构，适合零售展示。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['顶部集成标准飞机孔挂钩，无需额外打孔', '底部为锁底结构，确保悬挂时产品的承重安全', '完美适配商超、便利店等零售渠道的挂架陈列', '一体化设计，提升产品在货架上的可见度和吸引力'],
        scenarios: [
            {name: '手机配件', icon: 'usb', color: 'blue', description: '如U盘、数据线、充电头、手机膜等。'},
            {name: '日用百货', icon: 'shopping-basket', color: 'green', description: '如牙刷、剃须刀片、挂钩等小型日用品。'},
            {name: '文具用品', icon: 'pencil', color: 'yellow', description: '如笔、橡皮、尺子、修正带等。'},
            {name: '电池产品', icon: 'battery-full', color: 'red', description: '各类5号、7号及纽扣电池的挂式包装。'}
        ]
    },
    {
        id: 'P-01-KH-PN',
        name: '卡纸平粘盒',
        category: '卡纸盒',
        description: 'P-01-KH-PN | 平粘结构，简单实用，成本经济。',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['侧边预粘，两端开口，结构最简化', '通常配合自动化包装线使用，填充后封合', '是所有盒型中成本最低的选择之一', '适合大规模生产的轻小、扁平类产品'],
        scenarios: [
            {name: '药品', icon: 'pill', color: 'blue', description: '如板装胶囊、颗粒冲剂等独立包装。'},
            {name: '面膜', icon: 'smile', color: 'pink', description: '单片或多片面膜的集合包装。'},
            {name: '袋泡茶/咖啡', icon: 'coffee', color: 'orange', description: '小袋茶叶或挂耳咖啡的零售包装。'},
            {name: '卡片/信封', icon: 'mail', color: 'gray', description: '贺卡、会员卡、优惠券等纸质品的包装。'}
        ]
    },
    {
        id: 'P-01-KH-FJ',
        name: '卡纸一体成型盒 (飞机盒)',
        category: '卡纸盒',
        description: 'P-01-KH-FJ | 一体成型，无需胶带封箱，是电商发货最受欢迎的盒型之一。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['一体成型，自带防尘插翼，无需胶带封箱', '组装方便，极大提升打包效率', '电商发货首选，优秀的抗压和保护性能', '内侧也可印刷，提升开箱体验'],
        scenarios: [
            {name: '电商服装', icon: 'shirt', color: 'purple', description: 'T恤、袜子、内衣等扁平类衣物的邮寄包装。'},
            {name: '美妆产品', icon: 'spray-can', color: 'pink', description: '化妆品礼盒或套组的快递包装。'},
            {name: '书籍画册', icon: 'book-open', color: 'orange', description: '为书籍、杂志、画册提供运输保护。'},
            {name: '订阅盒', icon: 'calendar-plus', color: 'red', description: '作为月度订阅盒，为用户创造定期惊喜。'}
        ]
    },
    {
        id: 'P-01-KH-DC',
        name: '卡纸吊口盒-插底式',
        category: '卡纸盒',
        description: 'P-01-KH-DC | 带吊口设计，插底结构，适合零售展示。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['顶部集成标准飞机孔挂钩', '底部为简易插入式结构，组装非常简单', '成本低于锁底式吊口盒，性价比高', '适合重量较轻的产品的挂式陈列'],
        scenarios: [
            {name: '手机壳', icon: 'smartphone-nfc', color: 'blue', description: '透明或轻薄型手机壳的零售包装。'},
            {name: '小饰品', icon: 'gem', color: 'pink', description: '如耳环、发夹、小挂件等。'},
            {name: '数据线', icon: 'plug', color: 'gray', description: '各类充电线、数据线的挂式包装。'},
            {name: '化妆工具', icon: 'brush', color: 'purple', description: '如化妆刷、眉笔、睫毛膏等。'}
        ]
    },
    {
        id: 'P-01-KH-TD',
        name: '卡纸天地盖',
        category: '卡纸盒',
        description: 'P-01-KH-TD | 盒盖与盒身分离，档次高，是高端礼品的常用选择。',
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['天地盖结构，开合富有仪式感', '由单层卡纸折叠成型，成本可控', '适合作为产品内盒或轻量级礼品包装', '可配合封套或腰封使用，进一步提升档次感'],
        scenarios: [
            {name: '衬衫/丝巾', icon: 'shirt', color: 'blue', description: '轻薄衣物或配饰的精致内包装。'},
            {name: '文具礼盒', icon: 'highlighter', color: 'yellow', description: '如钢笔、笔记本等文具的组合包装。'},
            {name: '茶叶/点心', icon: 'leaf', color: 'green', description: '作为茶叶、糕点等产品的内包装或小份量礼盒。'},
            {name: '伴手礼', icon: 'gift', color: 'red', description: '婚礼、活动等场合的伴手礼包装，经济又得体。'}
        ]
    },
    {
        id: 'P-01-KH-FT',
        name: '卡纸封套',
        category: '卡纸盒',
        description: 'P-01-KH-FT | 封套式设计，简洁美观，适合文件和礼品包装。',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['开放式结构，可直接展示内部产品', '常用于搭配内盒，增加包装层次感和品牌信息', '设计简洁，是提升包装档次的低成本方案', '可增加镂空、烫金等工艺'],
        scenarios: [
            {name: '书籍腰封', icon: 'book', color: 'orange', description: '为书籍、笔记本增加促销或特别版信息。'},
            {name: '食品包装点缀', icon: 'cake-slice', color: 'pink', description: '用于饭团、三明治、糕点等产品的外层包装。'},
            {name: '促销捆绑', icon: 'percent', color: 'red', description: '将多个产品捆绑成促销组合。'},
            {name: '产品信息补充', icon: 'info', color: 'blue', description: '在不改变主包装的情况下，增加额外信息。'}
        ]
    },
    {
        id: 'P-01-KH-ZD',
        name: '卡纸自动锁底盒',
        category: '卡纸盒',
        description: 'P-01-KH-ZD | 自动锁底结构，组装快速，承重能力强。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['底部为预粘结构，轻轻一按即可自动成型', '包装效率极高，是人工包装效率的数倍', '结构非常稳固，承重性好，适合较重产品', '初始开模费较高，适合大批量、标准化的生产'],
        scenarios: [
            {name: '化妆品套盒', icon: 'spray-can', color: 'pink', description: '适合需要快速打包的化妆品套盒。'},
            {name: '酒水包装', icon: 'wine', color: 'purple', description: '为单瓶或双支装的酒水提供可靠包装。'},
            {name: '高价值产品', icon: 'award', color: 'yellow', description: '需要高效率、高保护性包装的高价值产品。'},
            {name: '自动化产线', icon: 'factory', color: 'gray', description: '完美适配自动化包装流水线，提升整体效率。'}
        ]
    },
    {
        id: 'P-01-KH-CT',
        name: '卡纸抽屉盒',
        category: '卡纸盒',
        description: 'P-01-KH-CT | 抽拉式开启，富有仪式感，适合珠宝、茶叶等精致礼品。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['抽拉式设计，带来顺滑的开启体验', '由单层卡纸折叠而成，是抽屉盒的经济型选择', '适合轻量级、小体积的精致产品', '可增加丝带或半圆指扣，方便拉取'],
        scenarios: [
            {name: '小饰品', icon: 'gem', color: 'pink', description: '如胸针、袖扣、小耳环等。'},
            {name: '糖果/巧克力', icon: 'candy', color: 'red', description: '小份量、高档次的糖果或手工巧克力。'},
            {name: '名片/卡片', icon: 'contact', color: 'blue', description: '作为个性化名片盒或会员卡套。'},
            {name: 'U盘/小电子产品', icon: 'usb-flash-drive', color: 'gray', description: 'U盘、SD卡等小型数码产品的包装。'}
        ]
    },
    {
        id: 'P-01-KH-DZ',
        name: '卡纸吊口盒-自锁底式',
        category: '卡纸盒',
        description: 'P-01-KH-DZ | 带吊口设计，自锁底结构，适合零售展示和快速组装。',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['顶部集成标准飞机孔挂钩', '自锁底结构，无需胶水，组装方便快捷', '兼顾了挂式陈列效果与包装效率', '适合需要快速打包上架的零售商品'],
        scenarios: [
            {name: '电子配件', icon: 'speaker', color: 'blue', description: '如蓝牙耳机、充电宝等。'},
            {name: '玩具', icon: 'gamepad-2', color: 'orange', description: '小型挂卡玩具，如模型、卡牌等。'},
            {name: '个人护理', icon: 'user', color: 'green', description: '如电动牙刷头、便携式剃须刀等。'},
            {name: '宠物零食', icon: 'bone', color: 'brown', description: '袋装或条装的宠物零食。'}
        ]
    },

    // --- 精品盒 / Rigid Box ---
    {
        id: 'P-02-JP-TD',
        name: '天地盖盒',
        category: '精品盒',
        description: 'Lid and Base Box | 盒盖与盒身分离，档次高，是高端礼品、电子产品的常用选择。',
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['硬挺灰板内芯，提供卓越的物理保护', '开盖方式经典、大气，是高端品牌的标志性选择', '内外均可裱糊特种纸或印刷纸，视觉效果丰富', '结构坚固，可重复使用，提升品牌长尾价值'],
        scenarios: [
            {name: '高端手机', icon: 'smartphone', color: 'gray', description: '各大手机品牌的标准包装选择。'},
            {name: '手表/珠宝', icon: 'watch', color: 'purple', description: '为奢华腕表和珠宝提供与之匹配的尊贵包装。'},
            {name: '节日礼盒', icon: 'gift', color: 'red', description: '如月饼、粽子、年货等高端节日礼盒。'},
            {name: '企业礼品', icon: 'award', color: 'yellow', description: '高端商务馈赠，彰显企业实力与品味。'}
        ]
    },
    {
        id: 'P-02-JP-CT',
        name: '抽屉盒',
        category: '精品盒',
        description: 'Drawer Box | 抽拉式开启，富有仪式感，适合珠宝、茶叶等精致礼品。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['抽拉式开启，带来探索的神秘感和开启的仪式感', '硬挺灰板材质，结构稳固，保护性强', '适合多件产品组合陈列，或分层展示', '可增加丝带、金属、皮质等多种材质的拉手'],
        scenarios: [
            {name: '茶叶礼盒', icon: 'leaf', color: 'green', description: '将不同风味的茶叶分格存放，便于品鉴。'},
            {name: '高端化妆品', icon: 'gem', color: 'pink', description: '如安瓶、精华套组等，抽拉开启，尽显尊贵。'},
            {name: '巧克力礼盒', icon: 'heart', color: 'red', description: '为手工巧克力提供精致的陈列与保护。'},
            {name: '文具套装', icon: 'pencil-ruler', color: 'blue', description: '将笔、本、印章等组合成高档文具礼盒。'}
        ]
    },
    {
        id: 'P-02-JP-SX',
        name: '翻盖书型盒',
        category: '精品盒',
        description: 'Book-style Box | 如书本般翻开，常带磁铁吸附，体验感佳，应用广泛。',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['书本式翻盖结构，传递文化感与故事性', '通常内置磁铁，闭合时有清脆声，手感佳', '展开面积大，方便在内侧印刷品牌故事或产品说明', '应用场景广泛，是功能性与美学的完美结合'],
        scenarios: [
            {name: '电子书阅读器', icon: 'book-open', color: 'gray', description: '包装本身如同一本精装书，与产品完美呼应。'},
            {name: '纪念品/徽章', icon: 'star', color: 'yellow', description: '将徽章、纪念币等收藏品如珍宝般呈现。'},
            {name: '护肤品套盒', icon: 'heart', color: 'pink', description: '在盒盖内侧印刷使用步骤或品牌理念。'},
            {name: '邀请函/证书', icon: 'mail', color: 'blue', description: '作为高端活动邀请函或证书的载体，庄重而正式。'}
        ]
    }
];
