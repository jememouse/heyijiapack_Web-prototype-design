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
        ],
        specifications: {
            basic: [
                {label: '产品名称', value: '卡纸双插盒 (Tuck End Box)'},
                {label: '结构类型', value: '上下插入式'},
                {label: '最小起订量', value: '1个'},
                {label: '交付时间', value: '最快24小时'}
            ],
            size: [
                {label: '最小尺寸', value: '50×30×20mm'},
                {label: '最大尺寸', value: '500×400×300mm'},
                {label: '推荐材料', value: '250-400g白卡纸'},
                {label: '承重范围', value: '0.1-2kg'}
            ]
        },
        processIntro: {
            dieCutting: '采用精密模切设备，确保每个折痕和切线的精准度。双插盒的插舌和插槽设计经过优化，确保组装时的紧密贴合和稳固性。',
            printing: [
                {name: '数码印刷', desc: '适合小批量，色彩鲜艳，交付快速'},
                {name: '胶印工艺', desc: '适合大批量，成本经济，可加专色'}
            ],
            finishing: [
                {name: '哑光覆膜', desc: '质感柔和，防水防污'},
                {name: '亮光覆膜', desc: '光泽亮丽，色彩饱满'},
                {name: 'UV上光', desc: '局部亮光，层次丰富'}
            ]
        },
        orderingNotice: {
            fileRequirements: ['设计文件格式：AI、PDF、CDR、PSD（推荐AI或PDF）', '分辨率要求：矢量图或300DPI以上位图', '颜色模式：CMYK模式，避免使用RGB', '出血要求：四边各留3mm出血', '文字要求：所有文字需转曲线或提供字体文件'],
            productionCycle: [
                {name: '急单服务（24小时）', details: ['数量：1-100个', '工艺：数码印刷 + 基础工艺', '加急费：订单金额的30%']},
                {name: '标准服务（3-5天）', details: ['数量：不限', '工艺：全工艺支持', '无加急费']}
            ],
            notes: ['首次合作建议先制作样品确认效果', '大批量订单建议提前3-5天下单', '特殊工艺（如烫金、UV）需额外1-2天']
        },
        faq: [
            {q: '双插盒适合装什么产品？', a: '双插盒适合装轻质产品，如化妆品、电子配件、小礼品、药品等。由于其插入式结构，不建议装载过重或易碎的产品。'},
            {q: '最小尺寸有什么限制？', a: '最小尺寸为50×30×20mm，主要受限于插舌的结构设计。如果需要更小尺寸，建议考虑其他盒型如简易折叠盒。'},
            {q: '可以做异形切割吗？', a: '可以，我们支持异形切割，如圆角、波浪边等。异形切割需要制作专用刀模，会产生额外的刀模费用，具体费用请咨询客服。'}
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
        ],
        specifications: {
            basic: [
                {label: '产品名称', value: '卡纸手动锁底盒 (Auto-Lock Bottom Box)'},
                {label: '结构类型', value: '手动锁底'},
                {label: '最小起订量', value: '1个'},
                {label: '交付时间', value: '最快48小时'}
            ],
            size: [
                {label: '最小尺寸', value: '60×40×80mm'},
                {label: '最大尺寸', value: '400×300×500mm'},
                {label: '推荐材料', value: '300-450g白卡/牛皮纸'},
                {label: '承重范围', value: '0.5-5kg'}
            ]
        },
        processIntro: {
            dieCutting: '锁底盒的刀模结构更为复杂，对精度要求高。我们采用瑞士进口设备，确保每一个锁扣都精准无误，组装顺畅，锁定牢固。',
            printing: [
                {name: '数码印刷', desc: '适合小批量和多版本测试'},
                {name: '胶印工艺', desc: '大批量首选，色彩稳定，成本更优'}
            ],
            finishing: [
                {name: '覆膜', desc: '增加挺度和耐磨性，保护印刷内容'},
                {name: '烫金/银', desc: '提升品牌质感，突出重点信息'},
                {name: '开窗', desc: '可增加PET透明窗口，直观展示内部产品'}
            ]
        },
        orderingNotice: {
            fileRequirements: ['设计文件格式：AI、PDF、CDR、PSD（推荐AI或PDF）', '分辨率要求：矢量图或300DPI以上位图', '颜色模式：CMYK模式，避免使用RGB', '出血要求：四边各留3mm出血', '文字要求：所有文字需转曲线或提供字体文件'],
            productionCycle: [
                {name: '标准服务（3-7天）', details: ['数量不限，全工艺支持']},
                {name: '加急服务（48小时）', details: ['仅限数码印刷，基础工艺，需额外加急费用']}
            ],
            notes: ['因结构复杂，建议大货前先打样确认', '组装时请确保四个锁扣完全扣合到位']
        },
        faq: [
            {q: '手动锁底盒和自动锁底盒有什么区别？', a: '手动锁底盒需要人工折叠底部四个插片来完成锁定，成本较低；自动锁底盒底部已预粘，一按即成型，效率高但成本也更高。'},
            {q: '这款盒子防水吗？', a: '纸盒本身不防水，但表面进行覆膜（光膜或哑膜）处理后，可以起到很好的防泼溅、防潮和耐脏效果。'}
        ]
    },
     // --- 其他产品 ---
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
        ],
        specifications: {
            basic: [
                {label: '产品名称', value: '卡纸吊口盒-锁底式 (Hanging Lock Bottom Box)'},
                {label: '结构类型', value: '吊口+手动锁底'},
                {label: '最小起订量', value: '1个'},
                {label: '交付时间', value: '最快48小时'}
            ],
            size: [
                {label: '最小尺寸', value: '50×30×80mm'},
                {label: '最大尺寸', value: '200×150×300mm'},
                {label: '推荐材料', value: '300-400g白卡纸'},
                {label: '承重范围', value: '0.2-3kg'}
            ]
        },
        processIntro: {
            dieCutting: '吊口和锁底结构对刀模精度要求极高，我们采用一体化刀模，确保挂钩和锁底的强度与一致性。',
            printing: [
                {name: '胶印工艺', desc: '适合大批量商超订单，色彩精准，成本低'},
                {name: '数码印刷', desc: '适合新品上市、小批量多款式的快速响应'}
            ],
            finishing: [
                {name: '覆膜', desc: '增强耐磨性和防水性，适合长期陈列'},
                {name: '开窗贴膜', desc: '在正面开窗并覆盖PET膜，让消费者直观看到产品'}
            ]
        },
        orderingNotice: {
            fileRequirements: ['设计文件格式：AI、PDF、CDR、PSD（推荐AI或PDF）', '分辨率要求：矢量图或300DPI以上位图', '颜色模式：CMYK模式，避免使用RGB', '出血要求：四边各留3mm出血', '文字要求：所有文字需转曲线或提供字体文件'],
            productionCycle: [
                {name: '标准服务（3-7天）', details: ['数量不限，全工艺支持']},
                {name: '加急服务（48小时）', details: ['仅限数码印刷，基础工艺，需额外加急费用']}
            ],
            notes: ['请注意吊口部分的留空，避免重要信息被挂钩遮挡', '如需在欧洲销售，可选择欧标飞机孔']
        },
        faq: [
            {q: '吊口部分的承重能力如何？', a: '我们的标准吊口采用加固设计，在推荐的承重范围内（最大3kg）是完全安全的。对于更重的产品，我们可以提供双层加固方案。'},
            {q: '这款盒子是否适合线上销售？', a: '同样适合。虽然主要为线下陈列设计，但其坚固的锁底结构也使其成为可靠的电商发货包装。'}
        ]
    },
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
        ],
        specifications: {
            basic: [
                {label: '产品名称', value: '精品天地盖盒 (Rigid Lid and Base Box)'},
                {label: '结构类型', value: '盖子+底盒'},
                {label: '最小起订量', value: '1个'},
                {label: '交付时间', value: '最快72小时'}
            ],
            size: [
                {label: '最小尺寸', value: '50×50×30mm'},
                {label: '最大尺寸', value: '600×500×200mm'},
                {label: '推荐材料', value: '1200-1800g灰板+157g铜版纸/特种纸'},
                {label: '承重范围', value: '1-10kg'}
            ]
        },
        processIntro: {
            dieCutting: '采用高精度数控V槽机对灰板进行开槽，确保90度直角，线条挺拔。外层裱纸采用全自动定位，误差小于0.5mm。',
            printing: [
                {name: '胶印', desc: '适用于铜版纸裱纸，色彩还原度高'},
                {name: '丝网印刷', desc: '适用于特种纸，可实现特殊油墨效果'}
            ],
            finishing: [
                {name: '特种纸裱糊', desc: '上百种艺术纸纹理可选，极大提升触感和视觉效果'},
                {name: '内托定制', desc: '可定制EVA、海绵、吸塑等多种内托，完美固定产品'},
                {name: '烫金/击凸', desc: '精品盒的常用工艺，彰显品牌Logo和价值'}
            ]
        },
        orderingNotice: {
            fileRequirements: ['设计文件格式：AI、PDF、CDR、PSD（推荐AI或PDF）', '分辨率要求：矢量图或300DPI以上位图', '颜色模式：CMYK模式，避免使用RGB', '出血要求：四边各留5mm出血', '文字要求：所有文字需转曲线或提供字体文件'],
            productionCycle: [
                {name: '标准服务（7-10天）', details: ['数量不限，全工艺支持']},
                {name: '加急服务（72小时）', details: ['需提前与客服确认工艺可行性，并支付加急费用']}
            ],
            notes: ['精品盒为手工/半手工制作，周期较长，请提前规划', '如需定制特殊内托，请提供产品实物或3D模型文件']
        },
        faq: [
            {q: '精品盒和卡纸盒有什么根本区别？', a: '根本区别在于材质。精品盒使用硬质灰板作为骨架，外部裱糊一层纸张，因此非常坚固、挺拔，适合高价值产品。卡纸盒则由单层卡纸直接折叠而成，较为轻便经济。'},
            {q: '什么是V槽工艺？为什么精品盒需要它？', a: 'V槽工艺是在灰板上开出V型凹槽，使得灰板在折叠时能形成完美的90度直角，让盒子看起来棱角分明，非常挺拔。这是精品盒高品质感的关键工艺之一。'}
        ]
    }
];
// Add dummy data for other products for now
const other_ids = [
    'P-01-KH-PN', 'P-01-KH-FJ', 'P-01-KH-DC', 'P-01-KH-TD', 'P-01-KH-FT',
    'P-01-KH-ZD', 'P-01-KH-CT', 'P-01-KH-DZ', 'P-02-JP-CT', 'P-02-JP-SX'
];
other_ids.forEach(id => {
    const product = products.find(p => p.id === id);
    if(product) {
        product.specifications = products[0].specifications;
        product.processIntro = products[0].processIntro;
        product.orderingNotice = products[0].orderingNotice;
        product.faq = products[0].faq;
    }
});
