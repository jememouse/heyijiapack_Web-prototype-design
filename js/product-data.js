const products = [
    // --- 卡纸盒 / Cardboard Box ---
    {
        id: 'P-01-KH-SC',
        name: '卡纸双插盒',
        category: '卡纸盒',
        description: 'P-01-KH-SC | 上下盖均为插入式，组装便捷，是最常见的卡盒结构。',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['上下盖均为插入式，组装便捷', '是最常见的卡盒结构，成本经济', '适合轻质产品包装', '支持多种印刷工艺'],
        scenarios: [
            {name: '电子产品', icon: 'smartphone', color: 'blue'},
            {name: '化妆品', icon: 'heart', color: 'pink'},
            {name: '礼品包装', icon: 'gift', color: 'purple'},
            {name: '零售商品', icon: 'shopping-bag', color: 'green'}
        ]
    },
    {
        id: 'P-01-KH-SD',
        name: '卡纸手动锁底盒',
        category: '卡纸盒',
        description: 'P-01-KH-SD | 手动锁底结构，承重能力强，适合稍有重量的产品。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['底部为锁底结构，承重力强', '组装相对快捷，结构稳固', '适合瓶罐类、稍重的产品', '有效防止底部意外开启'],
        scenarios: [
            {name: '保健品', icon: 'shield-plus', color: 'green'},
            {name: '酒水饮料', icon: 'glass-water', color: 'blue'},
            {name: '玩具手办', icon: 'toy-brick', color: 'orange'},
            {name: '五金配件', icon: 'wrench', color: 'gray'}
        ]
    },
    {
        id: 'P-01-KH-DS',
        name: '卡纸吊口盒-锁底式',
        category: '卡纸盒',
        description: 'P-01-KH-DS | 带吊口设计，锁底结构，适合零售展示。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['顶部带标准飞机孔挂钩', '底部为锁底结构，承重力好', '方便在商超货架上挂式陈列', '提升产品可见度'],
        scenarios: [
            {name: '手机配件', icon: 'usb', color: 'blue'},
            {name: '日用百货', icon: 'shopping-basket', color: 'green'},
            {name: '文具用品', icon: 'pencil', color: 'yellow'},
            {name: '电池产品', icon: 'battery-full', color: 'red'}
        ]
    },
    {
        id: 'P-01-KH-PN',
        name: '卡纸平粘盒',
        category: '卡纸盒',
        description: 'P-01-KH-PN | 平粘结构，简单实用，成本经济。',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['结构最简单，成本极低', '扁平化运输，节省仓储空间', '需要手动或机器封合两端', '适用于轻小、扁平类产品'],
        scenarios: [
            {name: '药品', icon: 'pilcrow', color: 'blue'},
            {name: '面膜', icon: 'smile', color: 'pink'},
            {name: '小食品', icon: 'cookie', color: 'orange'},
            {name: '卡片/信封', icon: 'mail', color: 'gray'}
        ]
    },
    {
        id: 'P-01-KH-FJ',
        name: '卡纸一体成型盒 (飞机盒)',
        category: '卡纸盒',
        description: 'P-01-KH-FJ | 一体成型，无需胶带封箱，是电商发货最受欢迎的盒型之一。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['一体成型，无需胶带封箱', '组装方便，打包效率高', '电商发货首选，保护性好', '扁平运输，节省物流成本'],
        scenarios: [
            {name: '电商服装', icon: 'shirt', color: 'purple'},
            {name: '数码产品', icon: 'camera', color: 'blue'},
            {name: '书籍画册', icon: 'book-open', color: 'orange'},
            {name: '订阅盒', icon: 'calendar-plus', color: 'red'}
        ]
    },
    {
        id: 'P-01-KH-DC',
        name: '卡纸吊口盒-插底式',
        category: '卡纸盒',
        description: 'P-01-KH-DC | 带吊口设计，插底结构，适合零售展示。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['顶部带标准飞机孔挂钩', '底部为插入式结构，组装简单', '成本低于锁底式吊口盒', '适合轻质产品的挂式陈列'],
        scenarios: [
            {name: '手机壳', icon: 'smartphone-nfc', color: 'blue'},
            {name: '小饰品', icon: 'gem', color: 'pink'},
            {name: '数据线', icon: 'plug', color: 'gray'},
            {name: '化妆工具', icon: 'brush', color: 'purple'}
        ]
    },
    {
        id: 'P-01-KH-TD',
        name: '卡纸天地盖',
        category: '卡纸盒',
        description: 'P-01-KH-TD | 盒盖与盒身分离，档次高，是高端礼品的常用选择。',
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['天地盖结构，开合有仪式感', '由单层卡纸折叠而成，成本较低', '适合作为内盒或轻礼品包装', '可配合封套使用，提升档次'],
        scenarios: [
            {name: '衬衫', icon: 'shirt', color: 'blue'},
            {name: '文具礼盒', icon: 'highlighter', color: 'yellow'},
            {name: '茶叶', icon: 'leaf', color: 'green'},
            {name: '伴手礼', icon: 'gift', color: 'red'}
        ]
    },
    {
        id: 'P-01-KH-FT',
        name: '卡纸封套',
        category: '卡纸盒',
        description: 'P-01-KH-FT | 封套式设计，简洁美观，适合文件和礼品包装。',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['开放式结构，展示产品', '常用于搭配内盒使用', '增加包装层次感和品牌信息', '设计简洁，成本经济'],
        scenarios: [
            {name: '书籍腰封', icon: 'book', color: 'orange'},
            {name: '食品包装点缀', icon: 'cake-slice', color: 'pink'},
            {name: '促销捆绑', icon: 'percent', color: 'red'},
            {name: '产品信息补充', icon: 'info', color: 'blue'}
        ]
    },
    {
        id: 'P-01-KH-ZD',
        name: '卡纸自动锁底盒',
        category: '卡纸盒',
        description: 'P-01-KH-ZD | 自动锁底结构，组装快速，承重能力强。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['底部预粘，轻轻一按即可成型', '包装效率极高，适合自动化产线', '结构稳固，承重性好', '成本高于手动锁底盒'],
        scenarios: [
            {name: '化妆品套盒', icon: 'spray-can', color: 'pink'},
            {name: '酒水包装', icon: 'wine', color: 'purple'},
            {name: '高价值产品', icon: 'award', color: 'yellow'},
            {name: '大批量生产', icon: 'factory', color: 'gray'}
        ]
    },
    {
        id: 'P-01-KH-CT',
        name: '卡纸抽屉盒',
        category: '卡纸盒',
        description: 'P-01-KH-CT | 抽拉式开启，富有仪式感，适合珠宝、茶叶等精致礼品。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['抽拉式设计，开合顺滑', '单层卡纸材质，成本可控', '适合轻量级、小体积产品', '可增加丝带拉手，提升便利性'],
        scenarios: [
            {name: '小饰品', icon: 'gem', color: 'pink'},
            {name: '糖果/巧克力', icon: 'candy', color: 'red'},
            {name: '名片/卡片', icon: 'contact', color: 'blue'},
            {name: 'U盘/小电子产品', icon: 'usb-flash-drive', color: 'gray'}
        ]
    },
    {
        id: 'P-01-KH-DZ',
        name: '卡纸吊口盒-自锁底式',
        category: '卡纸盒',
        description: 'P-01-KH-DZ | 带吊口设计，自锁底结构，适合零售展示和快速组装。',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['顶部带标准飞机孔挂钩', '自锁底结构，组装方便快捷', '兼顾陈列效果与包装效率', '适合流水线作业'],
        scenarios: [
            {name: '电子配件', icon: 'speaker', color: 'blue'},
            {name: '玩具', icon: 'gamepad-2', color: 'orange'},
            {name: '个人护理', icon: 'user', color: 'green'},
            {name: '宠物零食', icon: 'bone', color: 'brown'}
        ]
    },

    // --- 精品盒 / Rigid Box ---
    {
        id: 'P-02-JP-TD',
        name: '天地盖盒',
        category: '精品盒',
        description: 'Lid and Base Box | 盒盖与盒身分离，档次高，是高端礼品、电子产品的常用选择。',
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['硬挺灰板材质，保护性极佳', '开盖方式经典、大气', '内外均可裱糊特种纸，提升质感', '是高端礼品包装的通用选择'],
        scenarios: [
            {name: '高端手机', icon: 'smartphone', color: 'gray'},
            {name: '手表/珠宝', icon: 'watch', color: 'purple'},
            {name: '节日礼盒', icon: 'gift', color: 'red'},
            {name: '企业礼品', icon: 'award', color: 'yellow'}
        ]
    },
    {
        id: 'P-02-JP-CT',
        name: '抽屉盒',
        category: '精品盒',
        description: 'Drawer Box | 抽拉式开启，富有仪式感，适合珠宝、茶叶等精致礼品。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['抽拉式开启，富有神秘感和仪式感', '硬挺灰板材质，结构稳固', '适合多件产品组合陈列', '可增加丝带、金属等多种拉手'],
        scenarios: [
            {name: '茶叶礼盒', icon: 'leaf', color: 'green'},
            {name: '高端化妆品', icon: 'gem', color: 'pink'},
            {name: '巧克力礼盒', icon: 'heart', color: 'red'},
            {name: '文具套装', icon: 'pencil-ruler', color: 'blue'}
        ]
    },
    {
        id: 'P-02-JP-SX',
        name: '翻盖书型盒',
        category: '精品盒',
        description: 'Book-style Box | 如书本般翻开，常带磁铁吸附，体验感佳，应用广泛。',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: ['书本式翻盖，开合体验佳', '通常内置磁铁，闭合紧密', '展示面积大，方便呈现品牌故事', '应用场景广泛，通用性强'],
        scenarios: [
            {name: '电子书阅读器', icon: 'book-open', color: 'gray'},
            {name: '纪念品', icon: 'star', color: 'yellow'},
            {name: '护肤品套盒', icon: 'heart', color: 'pink'},
            {name: '邀请函/证书', icon: 'mail', color: 'blue'}
        ]
    }
];
