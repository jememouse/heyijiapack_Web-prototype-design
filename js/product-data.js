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
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-DS',
        name: '卡纸吊口盒-锁底式',
        category: '卡纸盒',
        description: 'P-01-KH-DS | 带吊口设计，锁底结构，适合零售展示。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-PN',
        name: '卡纸平粘盒',
        category: '卡纸盒',
        description: 'P-01-KH-PN | 平粘结构，简单实用，成本经济。',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-FJ',
        name: '卡纸一体成型盒 (飞机盒)',
        category: '卡纸盒',
        description: 'P-01-KH-FJ | 一体成型，无需胶带封箱，是电商发货最受欢迎的盒型之一。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-DC',
        name: '卡纸吊口盒-插底式',
        category: '卡纸盒',
        description: 'P-01-KH-DC | 带吊口设计，插底结构，适合零售展示。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-TD',
        name: '卡纸天地盖',
        category: '卡纸盒',
        description: 'P-01-KH-TD | 盒盖与盒身分离，档次高，是高端礼品的常用选择。',
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-FT',
        name: '卡纸封套',
        category: '卡纸盒',
        description: 'P-01-KH-FT | 封套式设计，简洁美观，适合文件和礼品包装。',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-ZD',
        name: '卡纸自动锁底盒',
        category: '卡纸盒',
        description: 'P-01-KH-ZD | 自动锁底结构，组装快速，承重能力强。',
        imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-CT',
        name: '卡纸抽屉盒',
        category: '卡纸盒',
        description: 'P-01-KH-CT | 抽拉式开启，富有仪式感，适合珠宝、茶叶等精致礼品。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-01-KH-DZ',
        name: '卡纸吊口盒-自锁底式',
        category: '卡纸盒',
        description: 'P-01-KH-DZ | 带吊口设计，自锁底结构，适合零售展示和快速组装。',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },

    // --- 精品盒 / Rigid Box ---
    {
        id: 'P-02-JP-TD',
        name: '天地盖盒',
        category: '精品盒',
        description: 'Lid and Base Box | 盒盖与盒身分离，档次高，是高端礼品、电子产品的常用选择。',
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-02-JP-CT',
        name: '抽屉盒',
        category: '精品盒',
        description: 'Drawer Box | 抽拉式开启，富有仪式感，适合珠宝、茶叶等精致礼品。',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    {
        id: 'P-02-JP-SX',
        name: '翻盖书型盒',
        category: '精品盒',
        description: 'Book-style Box | 如书本般翻开，常带磁铁吸附，体验感佳，应用广泛。',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    },
    // A special case from the product detail page that seems to be a duplicate but let's keep it for mapping.
    {
        id: 'P-01-KH-SC-DETAIL',
        name: '双插盒', // Simpler name used in some places
        category: '卡纸盒',
        description: 'Tuck End Box | 上下盖均为插入式，组装便捷，是最常见的卡盒结构。',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        features: [],
        scenarios: []
    }
];
