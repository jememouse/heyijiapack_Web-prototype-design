// --- 全局状态和数据 ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let lastOrderId = null;
let distributionStatus = 'none'; // 'none', 'pending', 'approved'
let withdrawalAccounts = []; // To store saved bank accounts

let userAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [
    { id: 1, name: '李婷', phone: '138****1234', address: '上海市 浦东新区 世纪大道100号 东方明珠大厦 88层', isDefault: true },
    { id: 2, name: '王经理', phone: '159****5678', address: '江苏省 苏州市 工业园区 星湖街328号 创意产业园 A栋 201室', isDefault: false },
];

function saveAddresses() {
    localStorage.setItem('userAddresses', JSON.stringify(userAddresses));
}
let orders = JSON.parse(localStorage.getItem('orders')) || [
    { id: '20250720001', date: '2025-07-20', total: 1250.00, status: '文件处理中', statusId: 'processing', items: [{ name: '飞机盒', specs: '200x150x50mm | E瓦楞 | 哑光覆膜', quantity: 500, imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }] },
    { id: '20250718985', date: '2025-07-18', total: 3500.00, status: '已发货', statusId: 'shipped', items: [{ name: '双插盒', specs: '100x80x40mm | 350g白卡纸 | 烫金', quantity: 1000, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }] },
    { id: '20250715752', date: '2025-07-15', total: 880.00, status: '已完成', statusId: 'completed', items: [{ name: '抽屉盒', specs: '120x120x60mm | 精品灰板 | 无工艺', quantity: 200, imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }] },
];
let invoices = [
    { id: 'INV-20250720', orderId: '20250720001', date: '2025-07-21', total: 1250.00, status: '已开具' },
    { id: 'INV-20250718', orderId: '20250718985', date: '2025-07-19', total: 3500.00, status: '已开具' },
];

let afterSales = JSON.parse(localStorage.getItem('afterSales')) || [
    {
        id: 'AS-20250716',
        orderId: '20250715752',
        date: '2025-07-16',
        type: '退货',
        status: '已完成',
        reason: '外箱压痕，影响陈列',
        amount: 120.0,
        channel: '仓库退货',
        update: '2025-07-18',
        notes: '已补发新品并完成退款结算。'
    },
    {
        id: 'AS-20250721',
        orderId: '20250720001',
        date: '2025-07-21',
        type: '补发配件',
        status: '处理中',
        reason: '吸塑内托缺件',
        amount: 0,
        channel: '生产补件',
        update: '2025-07-22',
        notes: '已安排生产加急补发，预计48小时出库。'
    },
    {
        id: 'AS-20250725',
        orderId: '20250718985',
        date: '2025-07-25',
        type: '退款',
        status: '待审核',
        reason: '客户调整包装方案',
        amount: 3500.0,
        channel: '客服审核',
        update: '2025-07-25',
        notes: '等待确认材料费用扣减比例，预计1个工作日内完成审核。'
    }
];

function saveAfterSales() {
    localStorage.setItem('afterSales', JSON.stringify(afterSales));
}

if (!localStorage.getItem('afterSales')) {
    saveAfterSales();
}

let afterSalesFilter = 'all';

let coupons = {
    available: [
        { id: 'C001', name: '满1000减100', description: '满1000元可用', expiry: '2025-12-31' },
        { id: 'C002', name: '9折优惠券', description: '最高抵扣200元', expiry: '2025-10-31' },
        { id: 'C003', name: '新人专享50元券', description: '无门槛', expiry: '2025-08-31' },
    ],
    used: [
        { id: 'C004', name: '满500减50', description: '已使用', usedDate: '2025-07-20' },
    ],
    expired: []
};
const distributionData = {
    stats: {
        level: "青铜分销员",
        commissionRate: "10%"
    },
    orders: [
        { id: 'D-001', customer: '张三', date: '2025-07-25', total: 550.00, commission: 55.00, status: '已结算' },
        { id: 'D-002', customer: '王五', date: '2025-07-24', total: 1200.00, commission: 120.00, status: '已结算' },
        { id: 'D-003', customer: '赵六', date: '2025-07-22', total: 300.00, commission: 30.00, status: '待结算' }
    ],
    customers: [
        { name: '张三', joinDate: '2025-07-25', totalSpent: 550.00, lastOrderDate: '2025-07-25' },
        { name: '王五', joinDate: '2025-07-24', totalSpent: 1200.00, lastOrderDate: '2025-07-24' },
        { name: '赵六', joinDate: '2025-07-22', totalSpent: 300.00, lastOrderDate: '2025-07-22' }
    ],
    withdrawals: [
        { id: 'W-001', date: '2025-07-20', amount: 150.00, status: '已完成' }
    ],
    monthlyEarnings: [
        { month: '3月', earnings: 80 },
        { month: '4月', earnings: 150 },
        { month: '5月', earnings: 120 },
        { month: '6月', earnings: 200 },
        { month: '7月', earnings: 175 },
        { month: '8月', earnings: 250 },
    ]
};

const materialData = {
    "单铜纸": {
        "priceFactor": 1.0, 
        "desc": "挺度好，印刷效果佳", 
        "allowedPrinting": ["offset", "digital"], // 允许胶印和数码印刷
        "thicknesses": {
            "0.45mm": [
                { "value": "305g", "factor": 1.0, "isDefault": true },
                { "value": "325g", "factor": 1.1 },
                { "value": "350g", "factor": 1.2 }
            ],
            "0.55mm": [
                { "value": "345g", "factor": 1.05 },
                { "value": "365g", "factor": 1.1 },
                { "value": "400g", "factor": 1.2 }
            ]
        }
    },
    "银卡纸": {
        "priceFactor": 1.2, 
        "desc": "银色金属光泽，适合高端包装，建议使用UV胶印", 
        "allowedPrinting": ["uv-offset"], // 只允许UV胶印
        "thicknesses": {
            "0.45mm": [
                { "value": "300g", "factor": 1.0, "isDefault": true },
                { "value": "350g", "factor": 1.1 }
            ],
            "0.55mm": [
                { "value": "400g", "factor": 1.1 }
            ]
        }
    },
    "粉灰纸": {
        "priceFactor": 0.9, 
        "desc": "一面白一面灰，性价比高", 
        "allowedPrinting": ["offset", "digital"], // 允许胶印和数码印刷
        "thicknesses": {
            "0.55mm": [
                { "value": "350g", "factor": 1.0, "isDefault": true },
                { "value": "400g", "factor": 1.1 }
            ]
        }
    },
};

// --- 辅助函数 ---
function getAllProducts() {
    const allProducts = [];
    for (const domain in productCatalog) {
        for (const pCat in productCatalog[domain]) {
            for (const sCat in productCatalog[domain][pCat]) {
                for (const product of productCatalog[domain][pCat][sCat]) {
                    allProducts.push({
                        ...product,
                        ...(productDetails[product.id] || {})
                    });
                }
            }
        }
    }
    return allProducts;
}
const products = getAllProducts();

function renderIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// --- 页面导航逻辑 ---
const userCenterViews = document.querySelectorAll('.user-center-view');

const orderExperienceMap = {
    placed: {
        stageLabel: '文件准备',
        nextMilestone: '上传生产文件即可启动工程审核',
        logistics: '文件校对通过后预计 7-10 日可安排生产发货。',
        packagingNote: '建议提前确认刀模展开方向、专色值与开槽位置，避免后续返工。',
        summary: '订单已创建，等待您上传最终设计文件及授权资料。',
        advice: '请在 24 小时内完成文件上传，工程师会第一时间介入审核。',
        checklist: ['最终设计文件（AI/PDF，含出血）', '品牌/商标授权或使用证明', '特殊工艺位置与颜色编号说明'],
        tasks: ['上传生产文件并确认色彩模式', '准备授权文件与包装批次信息'],
        pillClass: 'status-placed'
    },
    processing: {
        stageLabel: '工程校对',
        nextMilestone: '工程师正在校对文件，预计 1 个工作日给出反馈',
        logistics: '通过校对后即可排期打样或生产，建议确保联系方式畅通。',
        packagingNote: '如涉及烫金/UV 等工艺，请确认同版颜色及压印深度，以保证呈现效果。',
        summary: '工程师正在核对文件，确认尺寸、出血及工艺细节。',
        advice: '如需调整材质或工艺，请在工程师反馈前集中说明。',
        checklist: ['关注工程师的校对反馈', '确认烫金、UV 等特殊工艺的安全距离', '核对刀模尺寸与粘合方式'],
        tasks: ['待工程师反馈校样结果', '准备如需调整的新版文件'],
        pillClass: 'status-processing'
    },
    confirming: {
        stageLabel: '样稿确认',
        nextMilestone: '待您确认电子校样/打样，确认后进入排产',
        logistics: '确认样稿后 3-5 个工作日可排产，复杂工艺需额外时间。',
        packagingNote: '重点关注击凸、烫金与覆膜区域的细节呈现，必要时申请打样。',
        summary: '样稿已生成，请确认结构、材质与颜色信息。',
        advice: '建议从品牌调性、开箱体验与物流强度三方面检查样稿。',
        checklist: ['确认电子校样或拍照打样', '核对 Pantone/专色与材质', '确认开箱动线及堆码方式'],
        tasks: ['审阅工程样稿并反馈确认', '如需调整请集中说明一次完成'],
        pillClass: 'status-confirming'
    },
    production: {
        stageLabel: '生产排期',
        nextMilestone: '生产中，预计 3-5 个工作日完成，完成后立即质检出货',
        logistics: '生产完成后会推送质检照片与装箱清单，请留意系统通知。',
        packagingNote: '建议提前规划成品的入仓动线，并确认堆码高度限制。',
        summary: '订单已进入生产，工厂正在按工艺顺序排产。',
        advice: '关注质检节点，如需额外版本请提前沟通以免延迟排期。',
        checklist: ['确认发货目的仓与收货时间', '准备签收与质检流程', '核对内托/配件是否齐备'],
        tasks: ['等待质检与成品照片', '确认装箱数量与堆叠方式'],
        pillClass: 'status-production'
    },
    shipped: {
        stageLabel: '在途配送',
        nextMilestone: '订单已发货，预计 2-3 天送达，请安排签收',
        logistics: '物流单号会于当日 17:00 前更新，可在此处查看最新路由。',
        packagingNote: '签收时请检查外箱完整性，如发现受潮或破损请及时拍照并联系顾问。',
        summary: '成品已离厂，物流正在派送途中。',
        advice: '请安排仓库人员接货，提前准备涉及温湿度的储存方案。',
        checklist: ['跟踪物流节点并预约收货时间', '到货后按 SKU 进行抽检', '记录外箱及内包装状态'],
        tasks: ['追踪物流状态', '安排签收与抽检人员'],
        pillClass: 'status-shipped'
    },
    completed: {
        stageLabel: '交付完成',
        nextMilestone: '订单已完成，欢迎反馈使用体验，为下一批次优化',
        logistics: '如需再次下单，可直接在订单中发起复制或联系我们的顾问。',
        packagingNote: '建议记录本批次的堆码表现与客户反馈，为下一波物料迭代做准备。',
        summary: '订单已顺利收货，欢迎反馈包装表现与客户体验。',
        advice: '结合此次体验，评估运输与陈列环节是否需要优化。',
        checklist: ['收集终端/客户反馈', '记录实际装箱数据与损耗', '更新下次下单的计划需求'],
        tasks: ['制作包装复盘记录', '如需补货可直接复制订单'],
        pillClass: 'status-completed'
    },
    'refund-pending': {
        stageLabel: '退款审核',
        nextMilestone: '售后团队正在审核，预计 1-2 个工作日回复',
        logistics: '请保留好现有实物与外箱照片，便于核实。',
        packagingNote: '建议将问题品分类存放并做好标记，利于后续追踪。',
        summary: '您已提交退款/售后申请，我们正在处理。',
        advice: '如有新的证据，可随时通过售后入口补充。',
        checklist: ['上传问题照片或视频', '保留物流单据与装箱单', '填写售后处理偏好（退款/补发）'],
        tasks: ['等待售后审核结果', '准备补充说明或材料'],
        pillClass: 'status-refund-pending'
    },
    cancelled: {
        stageLabel: '订单关闭',
        nextMilestone: '订单已取消，如需重新启动请复制订单或联系顾问',
        logistics: '如已付款，退款将于 1-3 个工作日原路退回。',
        packagingNote: '建议记录取消原因，以便下次下单时降低风险。',
        summary: '订单已取消，可根据需求重新创建。',
        advice: '如果需要调整规格或数量，请与顾问沟通后重新下单。',
        checklist: ['关注退款到账情况', '整理取消原因与后续计划'],
        tasks: ['确认款项是否退回', '评估重新下单所需的调整'],
        pillClass: 'status-cancelled'
    },
    default: {
        stageLabel: '订单跟进',
        nextMilestone: '我们会尽快与您确认最新进度',
        logistics: '如需紧急处理请联系客户支持，我们会尽快跟进。',
        packagingNote: '根据品牌定位，建议持续关注材质与体验的一致性。',
        summary: '订单正在处理中，详情请查看进度或联系顾问。',
        advice: '保持沟通畅通，及时反馈需求变更。',
        checklist: ['确认收货信息', '关注系统通知'],
        tasks: ['查看订单详情了解最新进度'],
        pillClass: 'status-default'
    }
};

function getOrderExperience(statusId) {
    return orderExperienceMap[statusId] || orderExperienceMap.default;
}

function formatCurrency(amount) {
    return `¥${amount.toFixed(2)}`;
}

function sumOrderQuantity(order) {
    return order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function buildSpecBadges(specs = '') {
    return specs.split('|')
        .map(part => part.trim())
        .filter(Boolean)
        .map(part => `<span class="order-chip">${part}</span>`)
        .join('');
}

function generatePackagingTip(specs = '') {
    const text = specs.toLowerCase();
    const tips = [];
    if (text.includes('烫金') || text.includes('hot')) {
        tips.push('烫金区域请预留 ≥3mm 安全距离，确保金属版压印稳定');
    }
    if (text.includes('覆膜') || text.includes('哑光')) {
        tips.push('覆膜表面建议 24 小时后再装箱，避免粘连与划伤');
    }
    if (text.includes('瓦楞')) {
        tips.push('瓦楞结构堆码建议不高于 6 层，并做好防潮存放');
    }
    if (text.includes('灰板') || text.includes('精品灰板')) {
        tips.push('灰板成品建议搭配防刮 OPP 袋及干燥剂提升体验');
    }
    if (text.includes('抽屉') || text.includes('天地盖')) {
        tips.push('抽屉/天地盖盒建议加贴防滑贴或易揭拉扣，提升开箱顺滑度');
    }
    if (!tips.length) {
        return '确保刀模、堆码方向与物流温湿度要求一致，保障运输到达后的陈列体验。';
    }
    return tips.join('；');
}

function showUserCenterView(viewId, context) {
    userCenterViews.forEach(v => v.classList.add('hidden'));
    const activeView = document.getElementById(viewId);
    if (activeView) activeView.classList.remove('hidden');
    setActiveSidebarLink(viewId);
    
    // 更新移动端导航状态
    updateMobileNav(viewId);
    // 自动关闭移动端菜单
    closeMobileMenu();

    if (viewId === 'orders-view') {
        renderOrdersPage();
    } else if (viewId === 'order-detail-view') {
        renderOrderDetailPage(context?.orderId);
    } else if (viewId === 'distribution-view') {
        renderDistributionParentView();
    } else if (viewId === 'address-view') {
        renderAddressView();
    } else if (viewId === 'invoice-view') {
        renderInvoiceView();
    } else if (viewId === 'after-sales-view') {
        renderAfterSalesView();
    } else if (viewId === 'coupons-view') {
        renderCouponsView();
    }
    renderIcons();
}

function setActiveSidebarLink(activeViewId) {
    const links = document.querySelectorAll('#user-center-sidebar .sidebar-link');
    if (!links.length) return;
    const highlightViewId = activeViewId === 'order-detail-view' ? 'orders-view' : activeViewId;
    links.forEach(link => {
        const targetView = link.dataset.view;
        if (!targetView) return;
        if (targetView === highlightViewId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 模态框：取消订单 (新添加)
const cancelOrderModal = document.getElementById('cancel-order-modal') || createModalIfNeeded('cancel-order-modal');

function createModalIfNeeded(id) {
    let modal = document.getElementById(id);
    if (!modal) {
        modal = document.createElement('div');
        modal.id = id;
        modal.className = 'fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 hidden';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h2 class="text-xl font-bold mb-4">取消订单</h2>
                <p class="text-sm text-slate-600 mb-4">订单 ID: <span id="cancel-order-id"></span></p>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-slate-700 mb-2">取消原因 (必填)</label>
                    <textarea id="cancel-order-reason" rows="4" class="w-full p-2 border rounded-md" placeholder="请描述取消原因，我们将尽快为您处理退款"></textarea>
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="closeCancelOrderModal()" class="bg-slate-100 text-slate-700 px-4 py-2 rounded">取消</button>
                    <button type="button" onclick="confirmCancelOrder()" class="bg-red-600 text-white px-4 py-2 rounded">确认取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    return modal;
}

function openCancelOrderModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order || !['placed', 'processing'].includes(order.statusId)) {
        alert('该订单无法取消');
        return;
    }
    document.getElementById('cancel-order-id').textContent = order.id;
    document.getElementById('cancel-order-reason').value = '';
    const modal = document.getElementById('cancel-order-modal') || createModalIfNeeded('cancel-order-modal');
    modal.classList.remove('hidden');
    modal.querySelector('textarea').focus();
    renderIcons();
}

function closeCancelOrderModal() {
    document.getElementById('cancel-order-modal').classList.add('hidden');
}

function confirmCancelOrder() {
    const reason = document.getElementById('cancel-order-reason').value;
    if (!reason) {
        alert('请填写取消原因');
        return;
    }
    // 更新订单状态
    const orderId = document.getElementById('cancel-order-id').textContent;
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.statusId = 'cancelled';
        order.status = '已取消';
        localStorage.setItem('orders', JSON.stringify(orders));
        // 渲染当前视图
        if (currentOrderFilter) renderOrdersPage(currentOrderFilter);
        closeCancelOrderModal();
        showNotification('订单取消申请已提交，款项将在1-3日内退回', 'success');
    }
}

// 物流查看 (简化，使用 alert 或未来集成)
function openLogisticsModal(orderId) {
    alert(`订单 #${orderId} 物流：使用模拟物流。实际物流需 API 集成。状态: 准备发货中。`);
}

// 退款申请 (简化)
function openReturnOrderModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order || !['shipped', 'received'].includes(order.statusId)) {
        alert('该订单无法申请退款');
        return;
    }
    if (confirm('确认申请退款？退款将在审核后处理 (50% 退款模拟)。')) {
        order.statusId = 'refund-pending';
        order.status = '退款申请中';
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrdersPage(currentOrderFilter);
        showNotification('退款申请已提交，我们将在24小时内处理', 'success');
    }
}

// 联系客服 (简化)
function contactCustomerService(orderId) {
    alert(`订单 #${orderId}\n客服电话: 400-888-8888\n邮箱: service@iboxify.com\n工作时间: 周一至周五 9:00-18:00`);
}

function viewAfterSalesTimeline(afterSalesId) {
    const request = afterSales.find(item => item.id === afterSalesId);
    if (!request) {
        showNotification('未找到对应的售后工单', 'error');
        return;
    }
    showNotification(`售后工单 ${afterSalesId} 的详细进度功能即将上线，请关注系统通知。`, 'info');
}

function renderAddressView() {
    const defaultContainer = document.getElementById('address-default-container');
    const listContainer = document.getElementById('address-list');
    const totalCountEl = document.getElementById('address-total-count');
    const defaultNameEl = document.getElementById('address-default-name');
    const coverageEl = document.getElementById('address-coverage-count');
    if (!defaultContainer || !listContainer) return;

    if (!Array.isArray(userAddresses)) userAddresses = [];
    if (userAddresses.length && !userAddresses.some(addr => addr.isDefault)) {
        userAddresses[0].isDefault = true;
        saveAddresses();
    }

    const defaultAddress = userAddresses.find(addr => addr.isDefault) || null;
    const otherAddresses = userAddresses.filter(addr => !addr.isDefault);

    if (totalCountEl) totalCountEl.textContent = userAddresses.length;
    if (defaultNameEl) defaultNameEl.textContent = defaultAddress ? `${defaultAddress.name} · ${defaultAddress.phone}` : '尚未设置';
    if (coverageEl) {
        const regions = new Set(userAddresses.map(addr => (addr.address || '').split(/\s+/)[0] || addr.address || '未填'));
        coverageEl.textContent = `${regions.size} 个地区`;
    }

    defaultContainer.innerHTML = defaultAddress
        ? createAddressCard(defaultAddress, true)
        : `<div class="address-empty">
                <p>尚未设置默认收货地址</p>
                <button type="button" class="address-action-btn primary" onclick="openAddressModal()">新建地址</button>
           </div>`;

    listContainer.innerHTML = otherAddresses.length
        ? otherAddresses.map(addr => createAddressCard(addr, false)).join('')
        : `<div class="address-empty muted">暂无备用地址，可添加用于不同项目的联系人。</div>`;

    renderIcons();
}

function createAddressCard(address, isDefault = false) {
    const region = (address.address || '').split(/\s+/)[0] || '地址未填写';
    const chips = [`<span class="address-chip region">${region}</span>`];
    if (isDefault) {
        chips.unshift('<span class="address-chip default">默认</span>');
    }

    return `
        <div class="address-card ${isDefault ? 'is-default' : ''}">
            <div class="address-card-header">
                <div>
                    <p class="address-card-name">${address.name}</p>
                    <p class="address-card-phone">${address.phone}</p>
                </div>
                <div class="address-card-tags">${chips.join('')}</div>
            </div>
            <p class="address-card-line">${address.address}</p>
            <div class="address-card-actions">
                ${isDefault ? '' : `<button type="button" onclick="setDefaultAddress(${address.id})" class="address-action-btn primary">设为默认</button>`}
                <button type="button" onclick="openAddressModal(${address.id})" class="address-action-btn">编辑</button>
                <button type="button" onclick="removeAddress(${address.id})" class="address-action-btn danger">删除</button>
            </div>
        </div>
    `;
}

function setDefaultAddress(addressId) {
    const targetId = Number(addressId);
    userAddresses = userAddresses.map(addr => ({ ...addr, isDefault: addr.id === targetId }));
    saveAddresses();
    renderAddressView();
    showNotification('默认收货地址已更新', 'success');
}

function removeAddress(addressId) {
    const targetId = Number(addressId);
    if (userAddresses.length <= 1) {
        showNotification('至少保留一个收货地址', 'info');
        return;
    }
    userAddresses = userAddresses.filter(addr => addr.id !== targetId);
    if (userAddresses.length && !userAddresses.some(addr => addr.isDefault)) {
        userAddresses[0].isDefault = true;
    }
    saveAddresses();
    renderAddressView();
    showNotification('地址已删除', 'info');
}

function renderInvoiceView() {
    const container = document.getElementById('invoice-list');
    if (!container) return;
    container.innerHTML = invoices.map(inv => `
        <div class="border rounded-lg p-4 flex justify-between items-center">
            <div>
                <p class="font-semibold">订单 #${inv.orderId}</p>
                <p class="text-sm text-slate-500 mt-1">开票日期: ${inv.date} | 金额: ¥${inv.total.toFixed(2)}</p>
            </div>
            <div>
                <span class="text-sm font-medium ${inv.status === '已开具' ? 'text-green-600' : 'text-yellow-600'}">${inv.status}</span>
                <button class="ml-4 text-sm font-semibold text-blue-600 hover:underline">查看详情</button>
            </div>
        </div>
    `).join('');
}

const afterSalesStatusMeta = {
    '待审核': {
        badge: 'pending',
        stage: '客服审核中，预计24小时内反馈',
        color: '#B45309'
    },
    '处理中': {
        badge: 'processing',
        stage: '工程/仓储处理中，请关注进度更新',
        color: '#1D4ED8'
    },
    '已完成': {
        badge: 'success',
        stage: '售后工单已完结，欢迎反馈体验',
        color: '#047857'
    }
};

function renderAfterSalesView(filter = afterSalesFilter) {
    afterSalesFilter = filter || 'all';
    const totalCountEl = document.getElementById('after-sales-total-count');
    const pendingCountEl = document.getElementById('after-sales-pending-count');
    const processingCountEl = document.getElementById('after-sales-processing-count');
    const completedCountEl = document.getElementById('after-sales-completed-count');
    const listContainer = document.getElementById('after-sales-list');
    if (!listContainer) return;

    const pendingCount = afterSales.filter(item => item.status === '待审核').length;
    const processingCount = afterSales.filter(item => item.status === '处理中').length;
    const completedCount = afterSales.filter(item => item.status === '已完成').length;

    if (totalCountEl) totalCountEl.textContent = afterSales.length;
    if (pendingCountEl) pendingCountEl.textContent = pendingCount;
    if (processingCountEl) processingCountEl.textContent = processingCount;
    if (completedCountEl) completedCountEl.textContent = completedCount;

    const buttonCounts = {
        all: afterSales.length,
        pending: pendingCount,
        processing: processingCount,
        completed: completedCount
    };

    document.querySelectorAll('.after-sales-filter-btn').forEach(btn => {
        const btnFilter = btn.dataset.filter;
        btn.classList.toggle('active', btnFilter === afterSalesFilter);
        const countSpan = btn.querySelector('.after-sales-filter-count');
        if (countSpan && btnFilter && buttonCounts[btnFilter] !== undefined) {
            countSpan.textContent = buttonCounts[btnFilter];
        }
    });

    const filterMap = {
        all: () => true,
        pending: status => status === '待审核',
        processing: status => status === '处理中',
        completed: status => status === '已完成'
    };

    const predicate = filterMap[afterSalesFilter] || filterMap.all;
    const filteredRequests = afterSales.filter(item => predicate(item.status));

    if (filteredRequests.length === 0) {
        listContainer.innerHTML = `<div class="after-sales-empty">暂无符合条件的售后记录，可尝试切换筛选条件。</div>`;
        renderIcons();
        return;
    }

    listContainer.innerHTML = filteredRequests.map(createAfterSalesCard).join('');
    renderIcons();
}

function createAfterSalesCard(request) {
    const meta = afterSalesStatusMeta[request.status] || afterSalesStatusMeta['处理中'];
    const statusBadge = meta.badge || 'processing';
    const notes = request.notes || request.reason || '';
    const updateLabel = request.update ? `最近更新：${request.update}` : '';
    const reasonLabel = request.reason ? `${request.type} · ${request.reason}` : request.type;

    return `
        <article class="after-sales-card">
            <div class="after-sales-card-top">
                <div>
                    <p class="after-sales-card-id">工单 ${request.id}</p>
                    <p class="after-sales-card-type">${reasonLabel}</p>
                </div>
                <span class="after-sales-status ${statusBadge}">${request.status}</span>
            </div>
            <div class="after-sales-card-meta">
                <span><i data-lucide="package" class="w-4 h-4"></i>订单 #${request.orderId}</span>
                <span><i data-lucide="calendar" class="w-4 h-4"></i>申请日期 ${request.date}</span>
                ${updateLabel ? `<span><i data-lucide="clock" class="w-4 h-4"></i>${updateLabel}</span>` : ''}
            </div>
            ${notes ? `<p class="after-sales-card-notes">${notes}</p>` : ''}
            <div class="after-sales-card-footer">
                <span class="after-sales-stage">${meta.stage}</span>
                <div class="after-sales-card-actions">
                    <button type="button" class="after-sales-action-btn" onclick="viewAfterSalesTimeline('${request.id}')">查看进度</button>
                    <button type="button" class="after-sales-action-btn secondary" onclick="contactCustomerService('${request.orderId}')">联系客服</button>
                </div>
            </div>
        </article>
    `;
}

function setAfterSalesFilter(status) {
    renderAfterSalesView(status);
}

function renderCouponsView() {
    const availableContainer = document.getElementById('available-coupons');
    if (availableContainer) {
        availableContainer.innerHTML = coupons.available.map(c => `
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p class="font-semibold">${c.name}</p>
                <p class="text-sm text-slate-600">${c.description}</p>
                <p class="text-xs text-slate-500 mt-2">有效期至: ${c.expiry}</p>
            </div>
        `).join('');
    }
    const usedContainer = document.getElementById('used-coupons');
    if (usedContainer) {
        usedContainer.innerHTML = coupons.used.map(c => `
            <div class="bg-slate-50 border-l-4 border-slate-400 p-4 mb-4">
                <p class="font-semibold text-slate-500">${c.name}</p>
                <p class="text-sm text-slate-500">${c.description}</p>
                <p class="text-xs text-slate-400 mt-2">使用日期: ${c.usedDate}</p>
            </div>
        `).join('');
    }
}

// Product Detail Page Functions
// Store the currently viewed product ID
let currentProductDetailId = null;

function navigateToProductDetail(productId) {
    window.location.href = `product-detail.html?productId=${productId}`;
}

function renderProductDetailPage(productId) {
    currentProductDetailId = productId;
    const product = products.find(p => p.id === productId);
    if (!product) {
        // Handle product not found, maybe show a message on the page
        document.getElementById('product-detail-page').innerHTML = '<p class="text-center p-12">产品未找到!</p>';
        return;
    }

    // Update main product information
    document.getElementById('product-detail-title').textContent = product.name;
    document.getElementById('product-detail-subtitle').textContent = product.id;
    document.getElementById('product-detail-main-image').src = product.imageUrl.replace('400', '600');
    document.getElementById('product-detail-breadcrumb').textContent = product.name;

    // Update features
    const featuresContainer = document.getElementById('product-detail-features');
    if (product.features && featuresContainer) {
        featuresContainer.innerHTML = product.features.map(feature =>
            `<li class="flex items-start"><i data-lucide="check" class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>${feature}</li>`
        ).join('');
    }

    // Update scenarios
    const scenariosContainer = document.getElementById('product-detail-scenarios');
    if (product.scenarios && scenariosContainer) {
        scenariosContainer.innerHTML = product.scenarios.map(scenario =>
            `<div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <i data-lucide="${scenario.icon}" class="w-6 h-6 text-${scenario.color}-600"></i>
                <div>
                    <p class="text-sm font-medium">${scenario.name}</p>
                    <p class="text-xs text-slate-500">${scenario.description || ''}</p>
                </div>
            </div>`
        ).join('');
    }

    const customizeButton = document.querySelector('#product-detail-page .bg-blue-600');
    if(customizeButton) {
        customizeButton.onclick = () => goToCustomization(productId);
    }

    // Click the first tab by default
    document.querySelector('.product-detail-tab-button').click();
    renderIcons();
}

function renderProductDetailTab(tabId) {
    const product = products.find(p => p.id === currentProductDetailId);
    if (!product) return;

    const container = document.getElementById(`${tabId}-content`);
    if (!container) return;

    let contentHTML = '';
    switch (tabId) {
        case 'specifications':
            contentHTML = `
                <h3 class="text-xl font-semibold mb-6">产品规格参数</h3>
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 class="font-semibold mb-4 text-slate-800">基本参数</h4>
                        <div class="space-y-3">
                            ${(product.specifications.basic || []).map(spec => `
                                <div class="flex justify-between py-2 border-b border-slate-100">
                                    <span class="text-slate-600">${spec.label}</span>
                                    <span class="font-medium">${spec.value}</span>
                                </div>`).join('')}
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4 text-slate-800">尺寸范围</h4>
                        <div class="space-y-3">
                             ${(product.specifications.size || []).map(spec => `
                                <div class="flex justify-between py-2 border-b border-slate-100">
                                    <span class="text-slate-600">${spec.label}</span>
                                    <span class="font-medium">${spec.value}</span>
                                </div>`).join('')}
                        </div>
                    </div>
                </div>`;
            break;
        case 'process':
             contentHTML = `
                <h3 class="text-xl font-semibold mb-6">工艺介绍</h3>
                <div class="space-y-8">
                    <div>
                        <h4 class="font-semibold mb-4 text-slate-800 flex items-center"><i data-lucide="scissors" class="w-5 h-5 mr-2 text-blue-600"></i>模切工艺</h4>
                        <p class="text-slate-600 leading-relaxed mb-4">${product.processIntro.dieCutting || ''}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4 text-slate-800 flex items-center"><i data-lucide="palette" class="w-5 h-5 mr-2 text-purple-600"></i>印刷工艺</h4>
                        <div class="grid md:grid-cols-2 gap-6">
                            ${(product.processIntro.printing || []).map(p => `
                                <div class="border border-slate-200 p-4 rounded-lg">
                                    <h5 class="font-medium mb-2">${p.name}</h5>
                                    <p class="text-sm text-slate-600">${p.desc}</p>
                                </div>`).join('')}
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4 text-slate-800 flex items-center"><i data-lucide="sparkles" class="w-5 h-5 mr-2 text-yellow-600"></i>表面处理</h4>
                        <div class="grid md:grid-cols-3 gap-4">
                             ${(product.processIntro.finishing || []).map(f => `
                                <div class="text-center p-4 bg-slate-50 rounded-lg">
                                    <h5 class="font-medium text-sm">${f.name}</h5>
                                    <p class="text-xs text-slate-500 mt-1">${f.desc}</p>
                                </div>`).join('')}
                        </div>
                    </div>
                </div>`;
            break;
        case 'notice':
            contentHTML = `
                <h3 class="text-xl font-semibold mb-6">下单须知</h3>
                <div class="space-y-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 class="font-semibold text-blue-800 mb-3 flex items-center"><i data-lucide="info" class="w-5 h-5 mr-2"></i>文件要求</h4>
                        <ul class="space-y-2 text-sm text-blue-700 list-disc list-inside">${(product.orderingNotice.fileRequirements || []).map(r => `<li>${r}</li>`).join('')}</ul>
                    </div>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 class="font-semibold text-green-800 mb-3 flex items-center"><i data-lucide="clock" class="w-5 h-5 mr-2"></i>生产周期</h4>
                        <div class="grid md:grid-cols-2 gap-4 text-sm">
                           ${(product.orderingNotice.productionCycle || []).map(c => `
                                <div>
                                    <p class="font-medium text-green-700 mb-2">${c.name}</p>
                                    <ul class="space-y-1 text-green-600 list-disc list-inside">${(c.details || []).map(d => `<li>${d}</li>`).join('')}</ul>
                                </div>`).join('')}
                        </div>
                    </div>
                     <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h4 class="font-semibold text-yellow-800 mb-3 flex items-center"><i data-lucide="alert-triangle" class="w-5 h-5 mr-2"></i>注意事项</h4>
                        <ul class="space-y-2 text-sm text-yellow-700 list-disc list-inside">${(product.orderingNotice.notes || []).map(n => `<li>${n}</li>`).join('')}</ul>
                    </div>
                </div>`;
            break;
        case 'faq':
             contentHTML = `
                <h3 class="text-xl font-semibold mb-6">常见问题</h3>
                <div class="space-y-4">
                   ${(product.faq || []).map(item => `
                        <div class="border border-slate-200 rounded-lg">
                            <details class="group">
                                <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-slate-50">
                                    <h4 class="font-medium">${item.q}</h4>
                                    <i data-lucide="plus" class="w-5 h-5 text-slate-400 group-open:rotate-45 transition-transform"></i>
                                </summary>
                                <div class="px-4 pb-4 text-slate-600 leading-relaxed">${item.a}</div>
                            </details>
                        </div>`).join('')}
                </div>`;
            break;
    }
    container.innerHTML = contentHTML;
    renderIcons();
}


function switchProductDetailTab(button, tabId) {
    // Update tab buttons
    document.querySelectorAll('.product-detail-tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');

    // Update tab content
    document.querySelectorAll('.product-detail-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    const container = document.getElementById(tabId + '-content');
    container.classList.remove('hidden');

    renderProductDetailTab(tabId);
}

function renderProductCenter(filter) {
    const container = document.getElementById('product-center-domains');
    if (!container) return;

    // Default filter if none is provided
    if (!filter || !filter.level || !filter.value) {
        const firstDomain = Object.keys(productCatalog)[0];
        filter = { level: 'domain', value: firstDomain };
    }

    const { level, value } = filter;

    let domainsToRender = {};

    // Build a filtered catalog based on the filter
    if (level === 'domain') {
        if (productCatalog[value]) {
            domainsToRender = { [value]: productCatalog[value] };
        }
    } else if (level === 'primary') {
        for (const domainName in productCatalog) {
            if (productCatalog[domainName][value]) {
                domainsToRender = { [domainName]: { [value]: productCatalog[domainName][value] } };
                break;
            }
        }
    } else if (level === 'secondary') {
        for (const domainName in productCatalog) {
            for (const primaryCategoryName in productCatalog[domainName]) {
                if (productCatalog[domainName][primaryCategoryName][value]) {
                    domainsToRender = {
                        [domainName]: {
                            [primaryCategoryName]: {
                                [value]: productCatalog[domainName][primaryCategoryName][value]
                            }
                        }
                    };
                    break;
                }
            }
            if (Object.keys(domainsToRender).length > 0) break;
        }
    }

    let html = '';
    Object.keys(domainsToRender).forEach(domainName => {
        const domainData = domainsToRender[domainName];
        if (!domainData) return;

        const categoriesHTML = Object.keys(domainData).map(primaryCategoryName => {
            const primaryCategoryData = domainData[primaryCategoryName];
            const secondaryCategoriesHTML = Object.keys(primaryCategoryData).map(secondaryCategoryName => {
                const products = primaryCategoryData[secondaryCategoryName];
                if (!products || products.length === 0) return '';

                const productsHTML = products.map(product => {
                    const details = productDetails[product.id] || {};
                    return `
                        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm border border-transparent hover:border-blue-500 hover:shadow-xl transition-all">
                            <div class="image-container bg-slate-100" onclick="navigateToProductDetail('${product.id}')">
                                <img class="img-3d w-full h-48 object-cover cursor-pointer"
                                    src="${product.imageUrl}"
                                    alt="${product.name} 3D图">
                            </div>
                            <div class="p-5 flex flex-col">
                                <h3 class="text-lg font-bold flex-grow">${product.name}</h3>
                                <p class="text-xs text-slate-500 mt-1">${product.id}</p>
                                <div class="mt-4 space-y-2">
                                    <button onclick="navigateToProductDetail('${product.id}')" class="w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">查看详情</button>
                                    <button onclick="goToCustomization('${product.id}')" class="w-full btn-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">立即定制</button>
                                </div>
                            </div>
                        </div>`;
                }).join('');

                return `
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-slate-700">${secondaryCategoryName}</h3>
                        <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            ${productsHTML}
                        </div>
                    </div>`;
            }).join('');

            return `
                <div class="product-category-section" data-category="${primaryCategoryName}">
                    <h2 class="text-3xl font-semibold mb-8 border-l-4 border-blue-500 pl-4">${primaryCategoryName}</h2>
                    <div class="space-y-10">
                        ${secondaryCategoriesHTML}
                    </div>
                </div>`;
        }).join('');

        html += `
            <div class="product-domain-section" data-domain="${domainName}">
                <div class="space-y-12">
                    ${categoriesHTML}
                </div>
            </div>`;
    });

    if (html === '') {
         container.innerHTML = `<div class="text-center p-12 text-slate-500 bg-white rounded-xl shadow-sm">
            <i data-lucide="search-x" class="w-16 h-16 mx-auto text-slate-300"></i>
            <h3 class="mt-4 text-xl font-semibold text-slate-700">未找到产品</h3>
            <p class="mt-2">当前筛选条件下没有找到相关的产品。</p>
        </div>`;
    } else {
        container.innerHTML = html;
    }
    renderIcons();
}

function goToCustomization(productId) {
    window.location.href = `customization.html?productId=${productId}`;
}

// --- New Hierarchical Filter Logic ---
function initializeFilters() {
    const container = document.getElementById('hierarchical-filter-container');
    if (!container) {
        return;
    }
    // Clear previous content
    container.innerHTML = '';

    const domainMap = {
        "P - 包装域": "包装盒",
        "M - 印刷品域": "印刷品",
        "A - 辅料域": "辅料"
    };

    const handleFilterClick = (level, value, element) => {
        renderProductCenter({ level, value });

        // Remove active style from all links
        container.querySelectorAll('.filter-link').forEach(l => l.classList.remove('active-filter'));

        // Add active style to the clicked link
        element.classList.add('active-filter');
    };

    Object.keys(productCatalog).forEach(domainName => {
        const domainData = productCatalog[domainName];

        const domainDetails = document.createElement('details');
        domainDetails.className = 'filter-group';
        domainDetails.open = true;

        const domainSummary = document.createElement('summary');
        domainSummary.className = 'filter-link font-semibold p-2 rounded-lg hover:bg-slate-50 cursor-pointer flex justify-between items-center';
        domainSummary.dataset.level = 'domain';
        domainSummary.dataset.value = domainName;
        // Use a regex to clean the domain name for display, removing prefixes like "P - "
        const cleanDomainName = (domainMap[domainName] || domainName).replace(/^[A-Z]\s-\s/, '');

        domainSummary.innerHTML = `
            <span>${cleanDomainName}</span>
            <i data-lucide="chevron-down" class="w-4 h-4 transition-transform transform group-open:rotate-180"></i>
        `;
        domainSummary.addEventListener('click', (e) => handleFilterClick('domain', domainName, e.currentTarget));

        const primaryContainer = document.createElement('div');
        primaryContainer.className = 'pl-4 mt-1 space-y-1 border-l border-slate-200 ml-2';

        Object.keys(domainData).forEach(primaryCategoryName => {
            const primaryCategoryData = domainData[primaryCategoryName];
             // Clean the primary category name for display
            const cleanPrimaryCategoryName = primaryCategoryName.replace(/^[A-Z]\d+\.\s/, '');

            const primaryDetails = document.createElement('details');
            primaryDetails.className = 'filter-group';
            primaryDetails.open = true;

            const primarySummary = document.createElement('summary');
            primarySummary.className = 'filter-link p-2 rounded-lg hover:bg-slate-50 cursor-pointer flex justify-between items-center';
            primarySummary.dataset.level = 'primary';
            primarySummary.dataset.value = primaryCategoryName;
            primarySummary.innerHTML = `
                <span>${cleanPrimaryCategoryName}</span>
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform transform group-open:rotate-180"></i>
            `;
            primarySummary.addEventListener('click', (e) => handleFilterClick('primary', primaryCategoryName, e.currentTarget));

            const secondaryContainer = document.createElement('div');
            secondaryContainer.className = 'pl-4 mt-1 space-y-1 border-l border-slate-200 ml-2';

            Object.keys(primaryCategoryData).forEach(secondaryCategoryName => {
                if (primaryCategoryData[secondaryCategoryName].length > 0) {
                     // Clean the secondary category name for display
                    const cleanSecondaryCategoryName = secondaryCategoryName.replace(/^[A-Z]\d+\.\s/, '');
                    const secondaryLink = document.createElement('a');
                    secondaryLink.href = '#';
                    secondaryLink.className = 'filter-link text-sm block p-2 rounded-lg hover:bg-slate-50';
                    secondaryLink.dataset.level = 'secondary';
                    secondaryLink.dataset.value = secondaryCategoryName;
                    secondaryLink.textContent = cleanSecondaryCategoryName;
                    secondaryLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleFilterClick('secondary', secondaryCategoryName, e.currentTarget);
                    });
                    secondaryContainer.appendChild(secondaryLink);
                }
            });

            primaryDetails.appendChild(primarySummary);
            primaryDetails.appendChild(secondaryContainer);
            primaryContainer.appendChild(primaryDetails);
        });

        domainDetails.appendChild(domainSummary);
        domainDetails.appendChild(primaryContainer);
        container.appendChild(domainDetails);
    });

    // Initial render
    const firstDomainValue = Object.keys(productCatalog)[0];
    if (firstDomainValue) {
        renderProductCenter({ level: 'domain', value: firstDomainValue });
        const firstLink = container.querySelector(`.filter-link[data-value="${firstDomainValue}"]`);
        if (firstLink) {
            firstLink.classList.add('active-filter');
        }
    }

    renderIcons();
}

// --- Mobile Navigation Logic ---
function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (drawer) {
        drawer.classList.toggle('hidden');
        // 阻止滚动
        document.body.style.overflow = drawer.classList.contains('hidden') ? '' : 'hidden';
    }
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (drawer) {
        drawer.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// 更新移动端底部导航按钮激活状态
function updateMobileNav(viewId) {
    const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
    mobileNavButtons.forEach(btn => {
        const isActive = btn.getAttribute('onclick')?.includes(viewId);
        btn.classList.toggle('text-blue-600', isActive);
        btn.classList.toggle('text-slate-600', !isActive);
    });
}

// --- Modals Logic ---
const addressModal = document.getElementById('address-modal');
const invoiceModal = document.getElementById('invoice-modal');
const afterSalesModal = document.getElementById('after-sales-modal');
const loginModal = document.getElementById('login-modal');
const orderSuccessModal = document.getElementById('order-success-modal');
const paymentModal = document.getElementById('payment-modal');
const withdrawalModal = document.getElementById('withdrawal-modal');

function openAddressModal(addressId = null) {
    if (!addressModal) return;
    const form = document.getElementById('address-form');
    const hiddenId = document.getElementById('address-id');
    const nameInput = document.getElementById('address-name');
    const phoneInput = document.getElementById('address-phone');
    const addressInput = document.getElementById('address-full');
    const defaultCheckbox = document.getElementById('address-default');
    const modalTitle = addressModal.querySelector('h2');

    if (form) form.reset();

    if (addressId !== null) {
        const address = userAddresses.find(addr => addr.id === addressId);
        if (address) {
            if (hiddenId) hiddenId.value = address.id;
            if (nameInput) nameInput.value = address.name;
            if (phoneInput) phoneInput.value = address.phone;
            if (addressInput) addressInput.value = address.address;
            if (defaultCheckbox) defaultCheckbox.checked = !!address.isDefault;
            if (modalTitle) modalTitle.textContent = '编辑收货地址';
        }
    } else {
        if (hiddenId) hiddenId.value = '';
        if (defaultCheckbox) defaultCheckbox.checked = !userAddresses.length;
        if (modalTitle) modalTitle.textContent = '添加收货地址';
    }

    addressModal.classList.remove('hidden');
    renderIcons();
}
function closeAddressModal() {
    if (!addressModal) return;
    addressModal.classList.add('hidden');
    const form = document.getElementById('address-form');
    if (form) form.reset();
    const hiddenId = document.getElementById('address-id');
    if (hiddenId) hiddenId.value = '';
}
function openInvoiceModal() {
    const orderSelect = document.getElementById('invoice-order');
    if (orderSelect) {
        orderSelect.innerHTML = orders
            .filter(o => o.statusId === 'completed')
            .map(o => `<option value="${o.id}">订单 #${o.id} - ¥${o.total.toFixed(2)}</option>`)
            .join('');
    }
    invoiceModal.classList.remove('hidden');
    renderIcons();
}
function closeInvoiceModal() { invoiceModal.classList.add('hidden'); }
function openAfterSalesModal() { afterSalesModal.classList.remove('hidden'); renderIcons(); }
function closeAfterSalesModal() { afterSalesModal.classList.add('hidden'); }
function openLoginModal() { loginModal.classList.remove('hidden'); renderIcons(); }
function closeLoginModal() { loginModal.classList.add('hidden'); }
function openOrderSuccessModal() { orderSuccessModal.classList.remove('hidden'); renderIcons(); }
function closeOrderSuccessModalAndGoToUpload() {
    orderSuccessModal.classList.add('hidden');
    window.location.href = `user-center.html?viewId=order-detail-view&orderId=${lastOrderId}`;
}
function openPaymentModal(total) {
    document.getElementById('payment-amount').textContent = `¥ ${total.toFixed(2)}`;
    paymentModal.classList.remove('hidden');
    renderIcons();
}
function closePaymentModal() { paymentModal.classList.add('hidden'); }
function openWithdrawalModal() {
    const withdrawableAmount = parseFloat(document.getElementById('dist-withdrawable-commission').textContent.replace('¥', ''));
    document.getElementById('withdrawal-modal-amount').textContent = `¥${withdrawableAmount.toFixed(2)}`;
    renderWithdrawalAccounts('withdrawal-account-list-modal');
    withdrawalModal.classList.remove('hidden');
    renderIcons();
}
function closeWithdrawalModal() {
    withdrawalModal.classList.add('hidden');
    document.getElementById('add-account-form').classList.add('hidden');
}

function renderWithdrawalAccounts(containerId = 'withdrawal-account-list') {
    const container = document.getElementById(containerId);
    if (withdrawalAccounts.length === 0) {
        container.innerHTML = `
            <div class="text-center p-4 bg-slate-50 rounded-lg">
                <p class="text-sm text-slate-500">暂无提现账户</p>
                <button type="button" onclick="showAddAccountForm()" class="mt-2 text-sm font-semibold text-blue-600 hover:underline">新增账户</button>
            </div>
        `;
    } else {
        container.innerHTML = withdrawalAccounts.map((acc, index) => `
            <label class="block border rounded-lg p-3 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                <input type="radio" name="withdrawal-account" value="${acc.id}" class="sr-only" ${index === 0 ? 'checked' : ''}>
                <p class="font-semibold text-sm">${acc.bankName}</p>
                <p class="text-xs text-slate-500 mt-1">${acc.branchName}</p>
                <p class="text-sm text-slate-600 mt-1 font-mono">**** **** **** ${acc.accountNumber.slice(-4)}</p>
            </label>
        `).join('') + `<button type="button" onclick="showAddAccountForm()" class="mt-2 text-sm font-semibold text-blue-600 hover:underline">+ 新增其他账户</button>`;
    }
}

function showAddAccountForm() {
    document.getElementById('add-account-form').classList.remove('hidden');
}

function saveWithdrawalAccount() {
    const bankName = document.getElementById('bank-name').value;
    const branchName = document.getElementById('branch-name').value;
    const accountNumber = document.getElementById('account-number').value;

    if (!bankName || !branchName || !accountNumber) {
        alert('请填写完整的账户信息');
        return;
    }

    withdrawalAccounts.push({
        id: `acc-${Date.now()}`,
        bankName,
        branchName,
        accountNumber
    });

    document.getElementById('add-account-form').classList.add('hidden');
    document.getElementById('bank-name').value = '';
    document.getElementById('branch-name').value = '';
    document.getElementById('account-number').value = '';

    renderWithdrawalAccounts();
    if (document.getElementById('withdrawal-modal').classList.contains('flex')) {
        renderWithdrawalAccounts('withdrawal-account-list-modal');
    }
}

function handleWithdrawal() {
    if (withdrawalAccounts.length === 0) {
        alert('请先添加一个提现账户');
        return;
    }
    if (!document.querySelector('input[name="withdrawal-account"]:checked')) {
        alert('请选择一个提现账户');
        return;
    }
    const amount = document.getElementById('withdrawal-amount-input').value;
    if (!amount || parseFloat(amount) <= 0) {
        alert('请输入有效的提现金额');
        return;
    }
    alert('提现申请已提交！');
    closeWithdrawalModal();
}

// --- Auth Modal Logic ---
function switchAuthTab(button, tabId) {
    const parent = button.closest('.bg-white');
    parent.querySelectorAll('.auth-tab-button').forEach(btn => btn.classList.remove('active', 'text-slate-900', 'border-blue-600'));
    parent.querySelectorAll('.auth-tab-button').forEach(btn => btn.classList.add('text-slate-500', 'border-transparent'));
    button.classList.add('active', 'text-slate-900', 'border-blue-600');
    button.classList.remove('text-slate-500', 'border-transparent');

    parent.querySelectorAll('.auth-tab-content').forEach(content => content.classList.add('hidden'));
    parent.querySelector(`#${tabId}`).classList.remove('hidden');
}
function handleLogin() {
    closeLoginModal();
    window.location.href = 'user-center.html';
}
function handleRegister() {
    closeLoginModal();
    window.location.href = 'user-center.html';
}

// --- Tab Switching Logic ---
function switchTab(button, tabId) {
    const parent = button.closest('.bg-white, .user-center-view');
    parent.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    parent.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    parent.querySelector(`#${tabId}`).classList.remove('hidden');
}

function switchOrderTab(button, status) {
    const parent = button.closest('.bg-white');
    parent.querySelectorAll('.order-tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('text-slate-500', 'border-transparent');
    });
    button.classList.add('active');
    button.classList.remove('text-slate-500', 'border-transparent');
    renderOrdersPage(status);
    // 清空搜索输入以重置视图
    document.getElementById('order-search-input').value = '';
    document.getElementById('order-search-input').focus();
}

// --- 购物车与结算逻辑 ---
function updateCartIcon() {
    const badge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function handleAddToCart() {
    const name = document.getElementById('customization-title').textContent;
    const length = document.getElementById('length').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const material = document.querySelector('input[name="material"]:checked')?.value || 'N/A';
    const grammageValue = document.querySelector('input[name="grammage"]:checked')?.value || 'N/A';
    const surfaceTreatment = document.querySelector('input[name="surface-treatment"]:checked')?.value || 'N/A';

    let printingSpec = [];
    const printingMethod = document.querySelector('input[name="printing-method"]:checked').value;

    if (printingMethod === 'none') {
        printingSpec.push('不印刷');
    } else if (printingMethod === 'digital') {
        printingSpec.push('精美数码印刷');
    } else if (printingMethod === 'offset') {
        const specParts = ['胶印方式 (CMYK'];
        const spotColorCount = document.querySelector('input[name="printing-spot-color"]:checked').value;
        if (spotColorCount > 0) {
            specParts.push(` + ${spotColorCount}个专色`);
        }
        specParts.push(')');
        printingSpec.push(specParts.join(''));
    }

    // Collect special processes details
    const specialProcesses = getSelectedProcessesDetails();

    // Collect accessories with detailed info
    const accessories = [];
    document.querySelectorAll('input[name="accessories"]:checked').forEach(el => {
        if (el.value === '内托') {
            // Get inner tray details
            const material = document.querySelector('input[name="inner-tray-material"]:checked')?.value || 'EVA泡棉';
            const color = document.querySelector('input[name="inner-tray-color"]:checked')?.value || '黑色';

            let materialDetails = '';
            if (material === '纸质内托') {
                const paperType = document.querySelector('input[name="paper-tray-type"]:checked')?.value || '白卡纸';
                const paperThickness = document.querySelector('input[name="paper-tray-thickness"]:checked')?.value || '250g';
                materialDetails = `${paperType} ${paperThickness}`;
            } else if (material === '吸塑内托') {
                const plasticType = document.querySelector('input[name="plastic-tray-type"]:checked')?.value || 'PET';
                const plasticThickness = document.querySelector('input[name="plastic-tray-thickness"]:checked')?.value || '0.3mm';
                materialDetails = `${plasticType} ${plasticThickness}`;
            } else {
                materialDetails = material;
            }

            accessories.push(`内托 (${materialDetails}, ${color})`);
        } else {
            accessories.push(el.value);
        }
    });
    const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(el => el.value);
    const samplingServices = Array.from(document.querySelectorAll('input[name="sampling-service"]:checked')).map(el => el.value);
    const unitPrice = parseFloat(document.getElementById('unit-price').textContent.replace('¥ ', ''));
    const imageUrl = document.getElementById('customization-preview-img').src;

    if (isNaN(quantity) || quantity <= 0) {
        alert('请输入有效的数量');
        return;
    }

    const specsArray = [
        `${length}x${width}x${height}mm`,
        `${material} ${grammageValue}`,
        surfaceTreatment,
        printingSpec.join(' + '),
        ...specialProcesses,
        ...accessories,
        ...services,
        ...samplingServices
    ].filter(s => s && s !== '不处理' && s !== 'N/A' && s.trim() !== '');

    const newItem = {
        id: Date.now().toString(), // Use timestamp for unique ID
        name: name,
        imageUrl: imageUrl.replace('800x600', '100x100'),
        specs: specsArray.join(' | '),
        quantity: quantity,
        unitPrice: unitPrice,
    };

    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartIcon();

    const cartIconContainer = document.getElementById('cart-icon-container');
    cartIconContainer.classList.add('cart-shake-animation');
    setTimeout(() => {
        cartIconContainer.classList.remove('cart-shake-animation');
    }, 400);

    window.location.href = 'cart.html';
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm p-12 text-center">
                <i data-lucide="shopping-cart" class="w-16 h-16 mx-auto text-slate-300"></i>
                <h2 class="mt-4 text-2xl font-semibold">您的购物车是空的</h2>
                <p class="mt-2 text-slate-500">快去“在线定制”页面，添加一些商品吧！</p>
                <button onclick="window.location.href='products.html'" class="mt-6 btn-primary text-white px-6 py-2 rounded-lg font-semibold">
                    去定制
                </button>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="bg-white rounded-xl shadow-sm p-6 flex items-start space-x-6">
                <img src="${item.imageUrl}" alt="${item.name}" class="w-24 h-24 rounded-md object-cover border">
                <div class="flex-grow">
                    <h3 class="text-lg font-semibold">${item.name}</h3>
                    <p class="text-sm text-slate-500 mt-1">${item.specs}</p>
                    <p class="text-sm text-slate-500 mt-2">单价: ¥${item.unitPrice.toFixed(2)}</p>
                </div>
                <div class="flex-shrink-0 w-48 flex flex-col items-end justify-between h-full">
                    <p class="text-lg font-bold text-slate-800">¥${(item.quantity * item.unitPrice).toFixed(2)}</p>
                    <div class="flex items-center border border-slate-200 rounded-md mt-2">
                        <button onclick="updateCartItemQuantity('${item.id}', -1)" class="px-3 py-1 text-slate-500 hover:bg-slate-100 rounded-l-md">-</button>
                        <input type="text" value="${item.quantity}" class="w-12 text-center border-l border-r border-slate-200 focus:outline-none" readonly>
                        <button onclick="updateCartItemQuantity('${item.id}', 1)" class="px-3 py-1 text-slate-500 hover:bg-slate-100 rounded-r-md">+</button>
                    </div>
                     <button onclick="removeCartItem('${item.id}')" class="mt-2 text-xs text-red-500 hover:underline">删除</button>
                </div>
            </div>
        `).join('');
    }

    calculateCartTotals();
    renderIcons();
}

function calculateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const shipping = subtotal > 0 ? 15.00 : 0;
    const total = subtotal + shipping;

    document.getElementById('cart-subtotal').textContent = `¥ ${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `¥ ${shipping.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `¥ ${total.toFixed(2)}`;
}

function updateCartItemQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) item.quantity = newQuantity;
        else removeCartItem(itemId);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartIcon();
}

function removeCartItem(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartIcon();
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('您的购物车是空的！');
        return;
    }
    window.location.href = 'checkout.html';
}

function renderCheckoutPage() {
    const addressContainer = document.getElementById('checkout-address-container');
    const itemsContainer = document.getElementById('checkout-items-container');

    addressContainer.innerHTML = userAddresses.map(addr => `
        <label class="border rounded-xl p-4 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:ring-2 has-[:checked]:ring-blue-200">
            <input type="radio" name="address" value="${addr.id}" class="sr-only" ${addr.isDefault ? 'checked' : ''}>
            <div class="flex justify-between items-start">
                <p class="font-semibold">${addr.name} ${addr.isDefault ? '<span class="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">默认</span>' : ''}</p>
                <p class="text-sm text-slate-500">${addr.phone}</p>
            </div>
            <p class="text-sm text-slate-600 mt-2">${addr.address}</p>
        </label>
    `).join('');

    itemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-start space-x-4 py-4 border-b border-slate-200 last:border-b-0">
            <img src="${item.imageUrl}" alt="${item.name}" class="w-16 h-16 rounded-md object-cover border">
            <div class="flex-grow">
                <p class="font-semibold">${item.name}</p>
                <p class="text-xs text-slate-500 mt-1">${item.specs}</p>
            </div>
            <div class="text-right">
                <p class="font-semibold">¥${(item.quantity * item.unitPrice).toFixed(2)}</p>
                <p class="text-sm text-slate-500">x${item.quantity}</p>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const shipping = subtotal > 0 ? 15.00 : 0;
    const total = subtotal + shipping;
    document.getElementById('checkout-subtotal').textContent = `¥ ${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = `¥ ${shipping.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `¥ ${total.toFixed(2)}`;
}

function handlePayment() {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const total = subtotal + (subtotal > 0 ? 15.00 : 0);
    openPaymentModal(total);
}

function confirmPayment() {
    closePaymentModal();

    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const total = subtotal + (subtotal > 0 ? 15.00 : 0);

    const newOrder = {
        id: `20250726${Math.floor(Math.random() * 1000)}`,
        date: new Date().toLocaleDateString('zh-CN').replace(/\//g, '-'),
        total: total,
        status: '文件待上传',
        statusId: 'placed',
        items: JSON.parse(JSON.stringify(cart)) // Deep copy
    };

    orders.unshift(newOrder);
    lastOrderId = newOrder.id;

    // Save cart and orders to localStorage so they persist across pages
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orders', JSON.stringify(orders));

    openOrderSuccessModal();
    cart = [];
    updateCartIcon();
}

// --- 订单页面逻辑 ---
let currentOrderFilter = 'all';
let searchTimeout;

function handleOrderSearch(query) {
    // 延迟 300ms 渲染以避免频繁调用
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        renderOrdersPage(currentOrderFilter, query);
    }, 300);
}

function renderOrdersPage(filterStatus = 'all', searchQuery = '') {
    const container = document.getElementById('orders-list-container');
    if (!container) return;

    currentOrderFilter = filterStatus;

    const counts = {
        all: orders.length,
        processing: orders.filter(o => ['placed', 'processing', 'confirming', 'production'].includes(o.statusId)).length,
        shipped: orders.filter(o => o.statusId === 'shipped').length,
        completed: orders.filter(o => o.statusId === 'completed').length
    };

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredOrders = orders.filter(order => {
        const statusMatch = filterStatus === 'all' || order.statusId === filterStatus;
        const searchMatch = !normalizedQuery ||
            order.id.toLowerCase().includes(normalizedQuery) ||
            order.items.some(item => {
                const nameMatch = item.name && item.name.toLowerCase().includes(normalizedQuery);
                const specsMatch = item.specs && item.specs.toLowerCase().includes(normalizedQuery);
                return nameMatch || specsMatch;
            });
        return statusMatch && searchMatch;
    });

    if (filteredOrders.length === 0) {
        const message = normalizedQuery ? `未找到包含 "${searchQuery}" 的订单` : '暂无相关订单';
        container.innerHTML = `<div class="text-center py-12 text-slate-500"><i data-lucide="inbox" class="w-12 h-12 mx-auto"></i><p class="mt-2">${message}</p></div>`;
    } else {
        const summaryCardsHtml = `
            <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="order-summary-card subtle">
                    <p class="text-xs font-semibold text-slate-500 tracking-wide">全部订单</p>
                    <p class="text-2xl font-bold text-slate-900 mt-2">${counts.all}</p>
                    <p class="text-xs text-slate-500 mt-1">含历史与在制订单</p>
                </div>
                <div class="order-summary-card subtle">
                    <p class="text-xs font-semibold text-slate-500 tracking-wide">生产排队</p>
                    <p class="text-2xl font-bold text-slate-900 mt-2">${counts.processing}</p>
                    <p class="text-xs text-slate-500 mt-1">文件处理 / 生产中</p>
                </div>
                <div class="order-summary-card subtle">
                    <p class="text-xs font-semibold text-slate-500 tracking-wide">已出货</p>
                    <p class="text-2xl font-bold text-slate-900 mt-2">${counts.shipped + counts.completed}</p>
                    <p class="text-xs text-slate-500 mt-1">含配送中与已完成</p>
                </div>
            </div>
        `;

        const orderCardsHtml = filteredOrders.map(order => {
            const firstItem = order.items[0] || {};
            const status = orderStates.find(s => s.id === order.statusId) || { id: 'default', name: order.status };
            const experience = getOrderExperience(order.statusId);
            const totalQuantity = sumOrderQuantity(order);
            const statusIndex = Math.max(0, orderStates.findIndex(s => s.id === order.statusId));
            const progressPercent = Math.min(100, Math.max(5, Math.round(((statusIndex + 1) / orderStates.length) * 100)));
            const specBadges = buildSpecBadges(firstItem.specs || '');
            const chips = specBadges || '<span class="order-chip muted">规格待确认</span>';
            const utilityButtons = [];
            if (['placed', 'processing'].includes(order.statusId)) {
                utilityButtons.push(`<button onclick="openCancelOrderModal('${order.id}')" class="order-utility-btn danger">取消订单</button>`);
            }
            if (order.statusId === 'shipped') {
                utilityButtons.push(`<button onclick="openLogisticsModal('${order.id}')" class="order-utility-btn info">查看物流</button>`);
            }
            if (['shipped', 'completed'].includes(order.statusId)) {
                utilityButtons.push(`<button onclick="openReturnOrderModal('${order.id}')" class="order-utility-btn warning">申请售后</button>`);
            }
            utilityButtons.push(`<button onclick="contactCustomerService('${order.id}')" class="order-utility-btn">联系客服</button>`);

            return `
            <div class="order-card mb-6">
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 p-6 pb-3">
                    <div class="space-y-2">
                        <div class="flex flex-wrap items-center gap-3">
                            <span class="font-mono text-sm text-slate-500">#${order.id}</span>
                            <span class="order-status-pill ${experience.pillClass || 'status-default'}">${status.name}</span>
                            <span class="text-xs text-slate-400">${experience.stageLabel}</span>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4"></i>${order.date}</span>
                            <span class="hidden sm:inline">·</span>
                            <span class="flex items-center gap-1"><i data-lucide="package" class="w-4 h-4"></i>${totalQuantity.toLocaleString('zh-CN')} 件</span>
                            <span class="hidden sm:inline">·</span>
                            <span class="flex items-center gap-1"><i data-lucide="clock" class="w-4 h-4"></i>${experience.nextMilestone}</span>
                        </div>
                    </div>
                    <div class="text-left lg:text-right">
                        <p class="text-2xl font-bold text-slate-900">${formatCurrency(order.total)}</p>
                        <p class="text-xs text-slate-500 mt-1">含运费 ¥15.00</p>
                    </div>
                </div>
                <div class="px-6 pb-6 space-y-4">
                    <div class="flex flex-col md:flex-row gap-4">
                        <img src="${firstItem.imageUrl || 'https://via.placeholder.com/96'}" alt="${firstItem.name || '包装产品'}" class="w-24 h-24 rounded-lg object-cover border border-slate-200">
                        <div class="flex-1 space-y-3">
                            <div class="flex items-center justify-between">
                                <p class="text-lg font-semibold text-slate-900">${firstItem.name || '定制包装方案'}${order.items.length > 1 ? ` 等 ${order.items.length} 款` : ''}</p>
                                <span class="order-chip quantity">x${totalQuantity}</span>
                            </div>
                            <div class="flex flex-wrap gap-2">${chips}</div>
                            <p class="text-sm text-slate-500 leading-relaxed">${experience.summary}</p>
                            <div class="order-progress-bar" aria-label="订单进度">
                                <div class="order-progress-bar-fill" style="width:${progressPercent}%"></div>
                            </div>
                            <div class="flex flex-wrap items-center justify-between text-xs text-slate-500">
                                <span>进度 ${statusIndex + 1}/${orderStates.length}</span>
                                <span class="flex items-center gap-1"><i data-lucide="truck" class="w-4 h-4"></i>${experience.logistics}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 justify-end">
                        ${utilityButtons.join('')}
                        <button onclick="reorderOrder('${order.id}')" class="order-utility-btn">再次采购</button>
                        <button onclick="showUserCenterView('order-detail-view', { orderId: '${order.id}' })" class="btn-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">查看详情</button>
                    </div>
                </div>
            </div>`;
        }).join('');

        container.innerHTML = summaryCardsHtml + orderCardsHtml;
    }

    const tabs = document.querySelectorAll('.order-tab');
    tabs.forEach(tab => {
        if (tab.classList.contains('all')) {
            tab.innerHTML = `全部订单 (${counts.all})`;
        } else if (tab.classList.contains('processing')) {
            tab.innerHTML = `生产中 (${counts.processing})`;
        } else if (tab.classList.contains('shipped')) {
            tab.innerHTML = `已发货 (${counts.shipped})`;
        } else if (tab.classList.contains('completed')) {
            tab.innerHTML = `已完成 (${counts.completed})`;
        }
    });

    renderIcons();
}

// 订单详情模态 (简化版，扩展现有 order-detail-view 或独立)
function showOrderDetailInModal(orderId, isInline = false) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // 如果是内联查看，渲染到右上角扩展面板 (待添加HTML)
    // 这里简化为控制台 log 或 alert，实际可添加 expand 元素
    console.log('Order details for', orderId); // 占位，未来可替换为模态

    // 或者 navigation to full detail
    if (!isInline) {
        showUserCenterView('order-detail-view', { orderId });
    }
}

// --- 订单详情页逻辑 ---
const orderStates = [
    { id: 'placed', name: '已下单', icon: 'shopping-cart' },
    { id: 'processing', name: '文件处理中', icon: 'file-cog' },
    { id: 'confirming', name: '待用户确认', icon: 'user-check' },
    { id: 'production', name: '生产中', icon: 'factory' },
    { id: 'shipped', name: '已发货', icon: 'truck' },
    { id: 'completed', name: '已完成', icon: 'check-circle-2' },
];

function renderOrderDetailPage(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        document.getElementById('order-detail-view').innerHTML = `<p class="p-8 text-center text-slate-500">订单不存在或已被删除。</p>`;
        return;
    }

    const status = orderStates.find(s => s.id === order.statusId) || { id: 'default', name: order.status };
    const experience = getOrderExperience(order.statusId);
    const totalQuantity = sumOrderQuantity(order);
    const firstItem = order.items[0] || {};
    const aggregatedSpecs = Array.from(new Set(order.items.flatMap(item => (item.specs || '').split('|').map(part => part.trim()).filter(Boolean))));
    const formatDescriptor = aggregatedSpecs.length ? aggregatedSpecs.slice(0, 4).join(' · ') + (aggregatedSpecs.length > 4 ? ' …' : '') : '规格待确认';
    const statusIndex = Math.max(0, orderStates.findIndex(s => s.id === order.statusId));
    const progressPercent = Math.min(100, Math.max(5, Math.round(((statusIndex + 1) / orderStates.length) * 100)));
    const invoice = invoices.find(inv => inv.orderId === order.id);
    const address = userAddresses.find(a => a.isDefault) || userAddresses[0];

    document.getElementById('order-detail-breadcrumb').innerHTML = `
        <a href="user-center.html?viewId=dashboard-view" class="hover:underline">我的账户</a> &gt;
        <a href="user-center.html?viewId=orders-view" class="hover:underline">我的订单</a> &gt;
        <span>订单 #${order.id}</span>
    `;

    const numberEl = document.getElementById('order-detail-number');
    if (numberEl) numberEl.textContent = `#${order.id}`;

    const statusPill = document.getElementById('order-detail-status-pill');
    if (statusPill) {
        statusPill.textContent = status.name;
        statusPill.className = `order-status-pill ${experience.pillClass || 'status-default'}`;
    }

    const stageLabelEl = document.getElementById('order-detail-stage-label');
    if (stageLabelEl) stageLabelEl.textContent = experience.stageLabel;

    const updatedEl = document.getElementById('order-detail-updated');
    if (updatedEl) updatedEl.textContent = `下单时间：${order.date} · 当前节点：${status.name}`;

    const totalEl = document.getElementById('order-detail-value-total');
    if (totalEl) totalEl.textContent = formatCurrency(order.total);

    const paymentTypeEl = document.getElementById('order-detail-payment-type');
    if (paymentTypeEl) paymentTypeEl.textContent = '线上支付 · 已含标准运费 ¥15.00';

    const quantityEl = document.getElementById('order-detail-value-quantity');
    if (quantityEl) quantityEl.textContent = `${totalQuantity.toLocaleString('zh-CN')} 件 / ${order.items.length} SKU`;

    const formatEl = document.getElementById('order-detail-value-format');
    if (formatEl) formatEl.textContent = formatDescriptor;

    const milestoneEl = document.getElementById('order-detail-next-milestone');
    if (milestoneEl) milestoneEl.textContent = experience.nextMilestone;

    const logisticsEl = document.getElementById('order-detail-logistics');
    if (logisticsEl) logisticsEl.textContent = experience.logistics;

    const notesEl = document.getElementById('order-detail-packaging-notes');
    if (notesEl) notesEl.textContent = experience.packagingNote;

    const progressLabel = document.getElementById('order-progress-label');
    if (progressLabel) progressLabel.textContent = `进度 ${statusIndex + 1} / ${orderStates.length}`;

    const progressBarFill = document.querySelector('#order-progress-bar .order-progress-bar-fill');
    if (progressBarFill) progressBarFill.style.width = `${progressPercent}%`;

    const timelineContainer = document.getElementById('order-timeline');
    if (timelineContainer) {
        timelineContainer.innerHTML = orderStates.map((state, index) => {
            const isActive = index <= statusIndex;
            const stageExperience = getOrderExperience(state.id);
            const description = stageExperience.nextMilestone || '';
            return `
            <div class="relative flex items-start timeline-item ${isActive ? 'active' : ''}">
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}">
                    <i data-lucide="${state.icon}" class="w-4 h-4"></i>
                </div>
                <div>
                    <p class="font-semibold ${isActive ? 'text-slate-800' : 'text-slate-500'}">${state.name}</p>
                    <p class="text-xs ${index === statusIndex ? 'text-blue-500' : 'text-slate-400'} mt-1">${index === statusIndex ? '进行中 · ' : ''}${description}</p>
                </div>
            </div>`;
        }).join('');
    }

    const productListContainer = document.getElementById('order-detail-product-list');
    if (productListContainer) {
        productListContainer.innerHTML = order.items.map(item => {
            const itemChips = buildSpecBadges(item.specs || '') || '<span class="order-chip muted">规格待确认</span>';
            return `
            <article class="order-product-card">
                <div class="flex flex-col sm:flex-row gap-4">
                    <img src="${item.imageUrl || 'https://via.placeholder.com/120'}" alt="${item.name}" class="w-24 h-24 rounded-lg object-cover border border-slate-200">
                    <div class="flex-1 space-y-3">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <h3 class="text-lg font-semibold text-slate-900">${item.name}</h3>
                                <p class="text-xs text-slate-500 mt-1">数量 x${item.quantity}</p>
                            </div>
                            <span class="order-chip quantity">x${item.quantity}</span>
                        </div>
                        <div class="flex flex-wrap gap-2">${itemChips}</div>
                        <p class="text-xs text-slate-500 leading-relaxed"><strong>包装建议：</strong>${generatePackagingTip(item.specs)}</p>
                    </div>
                </div>
            </article>`;
        }).join('');
    }

    const infoContainer = document.getElementById('order-detail-info');
    if (infoContainer) {
        const checklistHtml = (experience.checklist || []).map(item => `<li class="flex items-start gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-blue-500 mt-0.5"></i><span>${item}</span></li>`).join('');
        infoContainer.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4"></i> 收货信息</h3>
                    <p class="text-base font-semibold text-slate-900 mt-3">${address?.name || '—'}</p>
                    <p class="text-sm text-slate-600">${address?.phone || '—'}</p>
                    <p class="text-sm text-slate-600 mt-2 leading-relaxed">${address?.address || '请前往“地址管理”完善收货地址信息。'}</p>
                    <p class="text-xs text-slate-500 mt-4 flex items-center gap-2"><i data-lucide="info" class="w-4 h-4"></i> 若需临时更改收货信息，请在发货前与客服确认。</p>
                </div>
                <div class="rounded-xl border border-slate-200 p-5">
                    <h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2"><i data-lucide="truck" class="w-4 h-4"></i> 物流与发票</h3>
                    <div class="space-y-3 mt-3 text-sm text-slate-600">
                        <p class="flex items-start gap-2"><i data-lucide="navigation" class="w-4 h-4 mt-0.5 text-blue-500"></i><span>${experience.logistics}</span></p>
                        <p class="flex items-start gap-2"><i data-lucide="receipt" class="w-4 h-4 mt-0.5 text-emerald-500"></i><span>${invoice ? `已开具发票 · ${invoice.status} · ${invoice.date}` : '尚未开票 · 收货后可在“发票管理”发起申请。'}</span></p>
                        <p class="flex items-start gap-2 text-xs text-slate-500"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5"></i><span>如需分批发货或加急配送，可在联系客服后调整排期。</span></p>
                    </div>
                </div>
            </div>
            <div class="rounded-xl border border-slate-200 p-5">
                <h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4"></i> 文件核对清单</h3>
                <ul class="mt-3 space-y-2 text-sm text-slate-600">${checklistHtml}</ul>
            </div>
        `;
    }

    updateContextualBox(order, experience);
    renderIcons();
}

function updateContextualBox(order, experience = getOrderExperience(order.statusId)) {
    const contextualBox = document.getElementById('contextual-action-box');
    if (!contextualBox) return;

    contextualBox.innerHTML = `
        <h4 class="font-semibold text-lg mb-3 text-slate-800">阶段提示</h4>
        <p class="text-sm text-slate-600 leading-relaxed">${experience.summary}</p>
        <p class="text-xs text-slate-500 mt-3">${experience.logistics}</p>
    `;
    renderIcons();
}

function updateOrderStatus(orderId, newStatusId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.statusId = newStatusId;
        const state = orderStates.find(s => s.id === newStatusId);
        order.status = state ? state.name : '';
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrderDetailPage(orderId);
    }
}

// --- Distribution Logic ---
function toggleApplyForm(type) {
    const individualForm = document.getElementById('individual-form');
    const companyForm = document.getElementById('company-form');
    const buttons = document.querySelectorAll('.apply-tab-button');

    buttons.forEach(btn => {
        btn.classList.remove('active', 'border-blue-600', 'text-blue-600');
        btn.classList.add('text-slate-500', 'border-transparent');
    });

    if (type === 'individual') {
        individualForm.classList.remove('hidden');
        companyForm.classList.add('hidden');
        buttons[0].classList.add('active', 'border-blue-600', 'text-blue-600');
    } else {
        individualForm.classList.add('hidden');
        companyForm.classList.remove('hidden');
        buttons[1].classList.add('active', 'border-blue-600', 'text-blue-600');
    }
}

function renderDistributionParentView() {
    const applyView = document.getElementById('distribution-apply-view');
    const pendingView = document.getElementById('distribution-pending-view');
    const rejectedView = document.getElementById('distribution-rejected-view');
    const dashboardView = document.getElementById('distribution-dashboard-view');

    // 隐藏所有视图
    applyView.classList.add('hidden');
    pendingView.classList.add('hidden');
    rejectedView.classList.add('hidden');
    dashboardView.classList.add('hidden');

    if (distributionStatus === 'none') {
        applyView.classList.remove('hidden');
        toggleApplyForm('individual'); // 默认显示个人申请
    } else if (distributionStatus === 'pending') {
        pendingView.classList.remove('hidden');
        renderPendingView();
    } else if (distributionStatus === 'rejected') {
        rejectedView.classList.remove('hidden');
        renderRejectedView();
    } else if (distributionStatus === 'approved') {
        dashboardView.classList.remove('hidden');
        renderDistributionDashboard();
    }
    renderIcons();
}

// 渲染审核中视图
function renderPendingView() {
    // 更新提交时间
    if (distributionApplicationData.submitTime) {
        document.getElementById('submit-time').textContent = distributionApplicationData.submitTime;
    }

    // 显示申请信息摘要
    const summaryContainer = document.getElementById('application-summary');
    if (distributionApplicationData.type === 'individual') {
        summaryContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div><span class="font-medium">申请类型:</span> 个人申请</div>
                <div><span class="font-medium">申请人:</span> ${distributionApplicationData.name || '未填写'}</div>
                <div><span class="font-medium">联系电话:</span> ${distributionApplicationData.phone || '未填写'}</div>
                <div><span class="font-medium">邮箱地址:</span> ${distributionApplicationData.email || '未填写'}</div>
            </div>
        `;
    } else if (distributionApplicationData.type === 'company') {
        summaryContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div><span class="font-medium">申请类型:</span> 企业申请</div>
                <div><span class="font-medium">公司名称:</span> ${distributionApplicationData.companyName || '未填写'}</div>
                <div><span class="font-medium">联系人:</span> ${distributionApplicationData.contactPerson || '未填写'}</div>
                <div><span class="font-medium">联系电话:</span> ${distributionApplicationData.phone || '未填写'}</div>
            </div>
        `;
    }
}

// 渲染拒绝视图
function renderRejectedView() {
    const rejectionReasons = [
        '提交的资料不完整，请补充相关证明文件',
        '联系方式无法验证，请确认手机号码和邮箱地址的有效性',
        '申请信息与实际情况不符，请重新填写准确信息',
        '暂不符合我们的分销商要求，建议积累更多相关经验后重新申请'
    ];

    const randomReason = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
    document.getElementById('rejection-reason').innerHTML = `
        <p class="mb-2">审核未通过原因：</p>
        <p>${randomReason}</p>
        <p class="mt-3 text-sm">如有疑问，请联系客服：400-888-8888</p>
    `;
}

// 分销申请相关变量
let distributionApplicationData = {};

// 切换申请表单类型
function toggleApplyForm(type) {
    const individualForm = document.getElementById('individual-form');
    const companyForm = document.getElementById('company-form');

    if (type === 'individual') {
        individualForm.classList.remove('hidden');
        companyForm.classList.add('hidden');
    } else {
        individualForm.classList.add('hidden');
        companyForm.classList.remove('hidden');
    }
}

// 处理分销申请
function handleDistributionApply(type) {
    // 收集表单数据
    if (type === 'individual') {
        distributionApplicationData = {
            type: 'individual',
            name: document.getElementById('individual-name').value,
            idNumber: document.getElementById('individual-id').value,
            phone: document.getElementById('individual-phone').value,
            email: document.getElementById('individual-email').value,
            address: document.getElementById('individual-address').value,
            experience: document.getElementById('individual-experience').value,
            submitTime: new Date().toLocaleString('zh-CN')
        };
    } else {
        distributionApplicationData = {
            type: 'company',
            companyName: document.getElementById('company-name').value,
            businessLicense: document.getElementById('business-license').value,
            legalPerson: document.getElementById('legal-person').value,
            contactPerson: document.getElementById('contact-person').value,
            phone: document.getElementById('contact-phone').value,
            email: document.getElementById('company-email').value,
            address: document.getElementById('business-address').value,
            businessScope: document.getElementById('business-scope').value,
            submitTime: new Date().toLocaleString('zh-CN')
        };
    }

    // 更新状态为审核中
    distributionStatus = 'pending';
    renderDistributionParentView();

    // 显示提交成功消息
    showNotification('申请已提交，我们将在1-3个工作日内完成审核', 'success');
}

// 模拟审核通过
function simulateApproval() {
    distributionStatus = 'approved';
    renderDistributionParentView();
    showNotification('恭喜！您的分销申请已通过审核', 'success');
}

// 模拟审核拒绝
function simulateRejection() {
    distributionStatus = 'rejected';
    renderDistributionParentView();
}

// 重置分销申请
function resetDistributionApplication() {
    distributionStatus = 'none';
    distributionApplicationData = {};
    renderDistributionParentView();
}

// 显示通知消息
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;

    // 根据类型设置样式
    if (type === 'success') {
        notification.className += ' bg-green-500 text-white';
    } else if (type === 'error') {
        notification.className += ' bg-red-500 text-white';
    } else {
        notification.className += ' bg-blue-500 text-white';
    }

    notification.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}" class="w-5 h-5 mr-2"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);

    // 重新渲染图标
    renderIcons();
}

function reorderOrder(orderId) {
    showNotification(`已记录订单 #${orderId} 的补货需求，我们会结合最新物料报价与您确认。`, 'info');
}

function renderDistributionDashboard() {
    const totalCommission = distributionData.orders.reduce((sum, order) => sum + order.commission, 0);
    const totalOrderValue = distributionData.orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = distributionData.orders.length;
    const settledOrders = distributionData.orders.filter(o => o.status === '已结算');
    const pendingOrders = totalOrders - settledOrders.length;
    const withdrawnAmount = distributionData.withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const settledCommission = settledOrders.reduce((sum, order) => sum + order.commission, 0);
    const withdrawableCommission = Math.max(settledCommission - withdrawnAmount, 0);
    const avgOrderValue = totalOrders ? totalOrderValue / totalOrders : 0;
    const avgCommissionRate = totalOrderValue ? (totalCommission / totalOrderValue) * 100 : 0;

    document.getElementById('dist-total-commission').textContent = formatCurrency(totalCommission);
    document.getElementById('dist-withdrawable-commission').textContent = formatCurrency(withdrawableCommission);
    document.getElementById('dist-customer-count').textContent = distributionData.customers.length;
    document.getElementById('dist-level').textContent = distributionData.stats.level;
    document.getElementById('dist-rate').textContent = distributionData.stats.commissionRate;

    document.getElementById('dist-orders-count').textContent = totalOrders;
    document.getElementById('dist-settled-orders').textContent = settledOrders.length;
    document.getElementById('dist-pending-orders').textContent = pendingOrders;
    document.getElementById('dist-avg-order-value').textContent = formatCurrency(avgOrderValue);
    document.getElementById('dist-avg-commission-rate').textContent = `${avgCommissionRate.toFixed(1)}%`;

    const withdrawButton = document.getElementById('withdraw-button');
    if (withdrawableCommission > 0) {
        withdrawButton.disabled = false;
    } else {
        withdrawButton.disabled = true;
    }
    document.getElementById('dist-withdrawable-commission-withdraw').textContent = formatCurrency(withdrawableCommission);

    const referralLink = document.getElementById('referral-link').value;
    document.getElementById('referral-qr-code').src = `https://api.qrserver.com/v1/create-qr-code/?size=116x116&data=${encodeURIComponent(referralLink)}`;

    const chartContainer = document.getElementById('dist-earnings-chart');
    const monthlyEarnings = distributionData.monthlyEarnings || [];
    if (monthlyEarnings.length === 0) {
        chartContainer.innerHTML = '<p class="dist-table-empty">暂无佣金走势数据</p>';
    } else {
        const maxEarning = Math.max(...monthlyEarnings.map(e => e.earnings), 1);
        chartContainer.innerHTML = monthlyEarnings.map(item => {
            const height = maxEarning ? (item.earnings / maxEarning) * 100 : 0;
            return `
                <div class="dist-chart-bar" title="${item.month}：¥${item.earnings.toFixed(2)}">
                    <div class="dist-chart-bar-fill" style="height:${height}%"></div>
                    <span class="dist-chart-bar-label">${item.month}</span>
                </div>
            `;
        }).join('');
    }

    const earningsHighlightEl = document.getElementById('dist-earnings-highlight');
    if (earningsHighlightEl) {
        if (monthlyEarnings.length === 0) {
            earningsHighlightEl.textContent = '暂无走势数据';
        } else {
            const latest = monthlyEarnings[monthlyEarnings.length - 1];
            const previous = monthlyEarnings.length > 1 ? monthlyEarnings[monthlyEarnings.length - 2] : null;
            if (previous && previous.earnings !== 0) {
                const diff = latest.earnings - previous.earnings;
                const rate = (diff / previous.earnings) * 100;
                const trend = diff >= 0 ? '环比增长' : '环比下降';
                const symbol = diff >= 0 ? '+' : '';
                earningsHighlightEl.textContent = `${latest.month} 佣金 ¥${latest.earnings.toFixed(0)} · ${trend} ${symbol}${rate.toFixed(1)}%`;
            } else if (previous && previous.earnings === 0 && latest.earnings > 0) {
                earningsHighlightEl.textContent = `${latest.month} 佣金 ¥${latest.earnings.toFixed(0)} · 新增收益`; 
            } else {
                earningsHighlightEl.textContent = `${latest.month} 佣金 ¥${latest.earnings.toFixed(0)}`;
            }
        }
    }

    const ordersBody = document.getElementById('dist-orders-table-body');
    if (distributionData.orders.length === 0) {
        ordersBody.innerHTML = `<tr><td colspan="6" class="dist-table-empty">暂无渠道订单</td></tr>`;
    } else {
        ordersBody.innerHTML = distributionData.orders.map(o => `
            <tr>
                <td>${o.id}</td>
                <td>${o.customer}</td>
                <td>${o.date}</td>
                <td>${formatCurrency(o.total)}</td>
                <td class="text-emerald-600 font-semibold">+${formatCurrency(o.commission)}</td>
                <td>${o.status === '已结算' ? '<span class="dist-status success">已结算</span>' : '<span class="dist-status pending">待结算</span>'}</td>
            </tr>
        `).join('');
    }

    const customersBody = document.getElementById('dist-customers-table-body');
    if (distributionData.customers.length === 0) {
        customersBody.innerHTML = `<tr><td colspan="4" class="dist-table-empty">暂无客户数据</td></tr>`;
    } else {
        customersBody.innerHTML = distributionData.customers.map(c => `
            <tr>
                <td>${c.name}</td>
                <td>${c.joinDate}</td>
                <td>${formatCurrency(c.totalSpent)}</td>
                <td>${c.lastOrderDate}</td>
            </tr>
        `).join('');
    }

    const withdrawalsBody = document.getElementById('dist-withdrawals-table-body');
    if (distributionData.withdrawals.length === 0) {
        withdrawalsBody.innerHTML = `<tr><td colspan="4" class="dist-table-empty">暂无提现记录</td></tr>`;
    } else {
        withdrawalsBody.innerHTML = distributionData.withdrawals.map(w => `
            <tr>
                <td>${w.id}</td>
                <td>${w.date}</td>
                <td>${formatCurrency(w.amount)}</td>
                <td><span class="dist-status info">${w.status}</span></td>
            </tr>
        `).join('');
    }

    renderWithdrawalAccounts();
}

function copyReferralLink(button) {
    const linkInput = document.getElementById('referral-link');
    navigator.clipboard.writeText(linkInput.value).then(() => {
        const copyText = button.querySelector('span');
        copyText.textContent = '已复制!';
        setTimeout(() => {
            copyText.textContent = '复制';
        }, 2000);
    });
}


// --- Customization & Product Logic ---

function toggleSpotColorOptions(method) {
    const uvOptionsDiv = document.getElementById('uv-options');
    const offsetSpotOptionsDiv = document.getElementById('offset-spot-options');

    // 首先隐藏所有选项
    uvOptionsDiv.classList.add('hidden');
    offsetSpotOptionsDiv.classList.add('hidden');

    // 根据印刷方式显示对应选项
    switch (method) {
        case 'offset':
            // 显示胶印专色选项
            offsetSpotOptionsDiv.classList.remove('hidden');
            // 重置UV专色选项
            document.querySelector('input[name="uv-spot-color"][value="0"]').checked = true;
            break;
        case 'uv-offset':
            // 显示UV选项（包含UV专色和特殊工艺）
            uvOptionsDiv.classList.remove('hidden');
            // 重置胶印专色选项
            document.querySelector('input[name="offset-spot-color"][value="0"]').checked = true;
            break;
        default:
            // 其他印刷方式，重置所有专色选项
            document.querySelector('input[name="offset-spot-color"][value="0"]').checked = true;
            document.querySelector('input[name="uv-spot-color"][value="0"]').checked = true;
            break;
    }

    updateQuote();
}

function toggleInnerTrayOptions(checkbox) {
    const innerTrayDiv = document.getElementById('inner-tray-options');

    if (checkbox.checked) {
        innerTrayDiv.classList.remove('hidden');
        // Show default material options
        toggleInnerTrayMaterialOptions('EVA泡棉');
    } else {
        innerTrayDiv.classList.add('hidden');
    }

    updateQuote();
}

function toggleInnerTrayMaterialOptions(materialType) {
    const paperOptions = document.getElementById('paper-tray-options');
    const plasticOptions = document.getElementById('plastic-tray-options');

    // Hide all material-specific options first
    paperOptions.classList.add('hidden');
    plasticOptions.classList.add('hidden');

    // Show relevant options based on material type
    if (materialType === '纸质内托') {
        paperOptions.classList.remove('hidden');
    } else if (materialType === '吸塑内托') {
        plasticOptions.classList.remove('hidden');
    }

    updateQuote();
}



function renderMaterialOptions() {
    const container = document.getElementById('material-type-options');
    container.innerHTML = Object.keys(materialData).map((key, index) => `
        <label class="border rounded-lg p-4 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 hover:shadow-md transition-all block">
            <input type="radio" name="material" value="${key}" data-price-factor="${materialData[key].priceFactor}" onchange="handleMaterialChange()" class="sr-only" ${index === 0 ? 'checked' : ''}>
            <div class="text-center">
                <span class="font-semibold text-base text-slate-800 mb-2 block">${key}</span>
                <p class="text-sm text-slate-600 leading-relaxed">${materialData[key].desc}</p>
            </div>
        </label>
    `).join('');
    handleMaterialChange();
}

function handleMaterialChange() {
    const selectedMaterial = document.querySelector('input[name="material"]:checked').value;
    const grammageContainer = document.getElementById('grammage-options-container');
    const materialInfo = materialData[selectedMaterial];

    if (!materialInfo) {
        grammageContainer.innerHTML = '';
        return;
    }

    // 更新可用的印刷方式
    const printingMethods = document.querySelectorAll('input[name="printing-method"]');
    printingMethods.forEach(method => {
        const methodValue = method.value;
        const isAllowed = materialInfo.allowedPrinting.includes(methodValue);
        method.disabled = !isAllowed;
        const label = method.closest('label');
        
        if (isAllowed) {
            label.classList.remove('opacity-50', 'cursor-not-allowed');
            label.classList.add('cursor-pointer');
        } else {
            label.classList.add('opacity-50', 'cursor-not-allowed');
            label.classList.remove('cursor-pointer');
            if (method.checked) {
                // 如果当前选中的印刷方式不可用，自动选择第一个可用的印刷方式
                const firstAllowedMethod = document.querySelector(`input[name="printing-method"][value="${materialInfo.allowedPrinting[0]}"]`);
                if (firstAllowedMethod) {
                    firstAllowedMethod.checked = true;
                    toggleSpotColorOptions(firstAllowedMethod.value);
                }
            }
        }
    });

    const thicknessOptions = Object.keys(materialInfo.thicknesses).map(thickness => {
        const thicknessData = materialInfo.thicknesses[thickness];
        const defaultOption = thicknessData.find(g => g.isDefault) || thicknessData[0];
        
        return {
            thickness,
            defaultGrammage: defaultOption.value,
            options: thicknessData
        };
    });

    const html = thicknessOptions.map((thickOpt, index) => `
        <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">${thickOpt.thickness}</label>
            <div class="flex flex-wrap gap-2">
                ${thickOpt.options.map(opt => `
                    <label class="border rounded-md px-3 py-2 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 text-sm hover:shadow-sm transition-all">
                        <input type="radio" name="grammage" value="${opt.value}"
                            data-price-factor="${opt.factor}"
                            onchange="updateQuote()"
                            class="sr-only"
                            ${opt.isDefault ? 'checked' : ''}>
                        ${opt.value}
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    grammageContainer.innerHTML = html;
    updateQuote();
}

function renderGrammageOptions(materialType) {
    const container = document.getElementById('grammage-options-container');
    const materialInfo = materialData[materialType];
    let html = '';

    const thicknessContainerId = `thickness-options-${materialType}`;
    html += `<div class="w-full mt-4"><label class="block text-sm font-medium text-slate-700 mb-2">纸张厚度</label><div id="${thicknessContainerId}" class="flex flex-wrap gap-2">`;

    Object.keys(materialInfo.thicknesses).forEach((thickness, index) => {
        html += `
            <label class="border rounded-md px-3 py-2 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 text-sm">
                <input type="radio" name="thickness" value="${thickness}" onchange="renderGrammageForThickness('${materialType}', this.value)" class="sr-only" ${index === 0 ? 'checked' : ''}>
                ${thickness}
            </label>
        `;
    });
    html += `</div></div>`;

    html += `<div id="grammage-selection-container" class="w-full mt-4"></div>`;
    container.innerHTML = html;

    const defaultThickness = Object.keys(materialInfo.thicknesses)[0];
    renderGrammageForThickness(materialType, defaultThickness);
}

function renderGrammageForThickness(materialType, thickness) {
    const container = document.getElementById('grammage-selection-container');
    const grammages = materialData[materialType].thicknesses[thickness];
    let html = `<label class="block text-sm font-medium text-slate-700 mb-2">纸张克重</label><div class="flex flex-wrap gap-2">`;

    grammages.forEach(g => {
        html += `
            <label class="border rounded-md px-3 py-2 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 text-sm relative">
                <input type="radio" name="grammage" value="${g.value} (${thickness})" data-price-factor="${g.factor}" onchange="updateQuote()" class="sr-only" ${g.isDefault ? 'checked' : ''}>
                ${g.value}
                ${g.isDefault ? '<span class="absolute -top-2 -right-2 text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-semibold">常用</span>' : ''}
            </label>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
    updateQuote();
}

// --- Special Processes Logic (Optimized) ---
const specialProcessesConfig = {
    hotStamping: { name: '烫金', max: 2, pricePerSqMm: 0.005, pricePerSqMm3D: 0.008 },
    embossing: { name: '击凸/压凹', max: 2, pricePerSqMm: 0.003 },
    screenPrinting: { name: '丝网印刷', max: 2, pricePerSqMm: 0.008 },
    windowing: { name: '开窗/贴窗', max: 2, pricePerSqMm: 0.002 },
    embossedTexture: { name: '压纹工艺', max: 1, pricePerSqMm: 0.004 },
};

function renderSpecialProcesses() {
    const container = document.getElementById('special-processes-container');
    container.innerHTML = `
        ${createProcessHTML('hotStamping', '烫金 (标准/立体)', `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-600">烫金类型</label>
                    <select onchange="updateQuote()" class="process-input mt-1 w-full p-2 bg-white border-2 border-slate-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500 transition-colors text-sm font-medium text-slate-900" data-param="type">
                        <option value="标准烫金">标准烫金</option>
                        <option value="立体烫金">立体烫金</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-600">烫金颜色</label>
                    <select onchange="updateQuote()" class="process-input mt-1 w-full p-2 bg-white border-2 border-slate-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500 transition-colors text-sm font-medium text-slate-900" data-param="color">
                        <option value="亮金色">亮金色</option>
                        <option value="浅金色">浅金色</option>
                        <option value="哑金色">哑金色</option>
                        <option value="亮银色">亮银色</option>
                        <option value="哑银色">哑银色</option>
                        <option value="镭射银">镭射银</option>
                    </select>
                </div>
            </div>
            <div class="mt-4">
                <label class="block text-xs font-medium text-slate-600">烫金尺寸 (mm)</label>
                <div class="flex items-center gap-2 mt-1">
                    <input type="number" placeholder="L" oninput="updateQuote()" class="process-input w-full p-2 border-slate-300 rounded-md text-sm" data-param="width">
                    <span class="text-slate-400">×</span>
                    <input type="number" placeholder="W" oninput="updateQuote()" class="process-input w-full p-2 border-slate-300 rounded-md text-sm" data-param="height">
                </div>
            </div>
        `)}
        ${createProcessHTML('embossing', '击凸 / 压凹', `
            <div class="grid grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-medium text-slate-600">工艺类型</label>
                    <select onchange="updateQuote()" class="process-input mt-1 w-full p-2 border-slate-300 rounded-md text-sm" data-param="type">
                        <option>击凸</option>
                        <option>压凹</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-600">深度/层次</label>
                    <select onchange="updateQuote()" class="process-input mt-1 w-full p-2 border-slate-300 rounded-md text-sm" data-param="depth">
                        <option>标准</option>
                        <option>浮雕</option>
                    </select>
                </div>
            </div>
             <div class="mt-4">
                <label class="block text-xs font-medium text-slate-600">尺寸 (mm)</label>
                <div class="flex items-center gap-2 mt-1">
                    <input type="number" placeholder="L" oninput="updateQuote()" class="process-input w-full p-2 border-slate-300 rounded-md text-sm" data-param="width">
                    <span class="text-slate-400">×</span>
                    <input type="number" placeholder="W" oninput="updateQuote()" class="process-input w-full p-2 border-slate-300 rounded-md text-sm" data-param="height">
                </div>
            </div>
        `)}
         ${createProcessHTML('screenPrinting', '丝网印刷', `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-600">印刷尺寸 (mm)</label>
                    <div class="flex items-center gap-2 mt-1">
                        <input type="number" placeholder="L" oninput="updateQuote()" class="process-input w-full p-2 border-slate-300 rounded-md text-sm" data-param="width">
                        <span class="text-slate-400">×</span>
                        <input type="number" placeholder="W" oninput="updateQuote()" class="process-input w-full p-2 border-slate-300 rounded-md text-sm" data-param="height">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-600">颜色</label>
                    <select onchange="updateQuote()" class="process-input mt-1 w-full p-2 border-slate-300 rounded-md text-sm" data-param="color">
                        <option>透明UV</option>
                        <option>黑色</option>
                        <option>白色</option>
                    </select>
                </div>
            </div>
        `)}
         ${createProcessHTML('windowing', '开窗 / 贴窗', `
            <div class="grid grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-medium text-slate-600">工艺类型</label>
                    <select onchange="toggleWindowOptions(this); updateQuote();" class="process-input mt-1 w-full p-2 border-slate-300 rounded-md text-sm" data-param="type">
                        <option value="开窗">开窗 (无膜片)</option>
                        <option value="贴窗">贴窗 (有膜片)</option>
                    </select>
                </div>
                <div class="window-film-option hidden">
                    <label class="block text-xs font-medium text-slate-600">膜片材质</label>
                    <select onchange="updateQuote()" class="process-input mt-1 w-full p-2 border-slate-300 rounded-md text-sm" data-param="film">
                        <option>环保透明膜片 (0.15mm)</option>
                    </select>
                </div>
            </div>
            <div class="window-type-option hidden mt-4">
                <label class="block text-xs font-medium text-slate-600">贴窗类型</label>
                <select onchange="updateQuote()" class="process-input mt-1 w-full p-2 border-slate-300 rounded-md text-sm" data-param="windowType">
                    <option value="单面贴窗">单面贴窗</option>
                    <option value="跨面贴窗">跨面贴窗</option>
                </select>
                <p class="text-xs text-slate-500 mt-1">单面贴窗：膜片贴在单个面上；跨面贴窗：膜片跨越多个面</p>
            </div>
             <div class="mt-4">
                <label class="block text-xs font-medium text-slate-600">窗口尺寸 (mm)</label>
                <div class="flex items-center gap-2 mt-1">
                    <input type="number" placeholder="L" oninput="updateQuote()" class="process-input w-full p-2 border-slate-300 rounded-md text-sm" data-param="width">
                    <span class="text-slate-400">×</span>
                    <input type="number" placeholder="W" oninput="updateQuote()" class="process-input w-full p-2 border-slate-300 rounded-md text-sm" data-param="height">
                </div>
            </div>
        `)}
        ${createProcessHTML('embossedTexture', '压纹工艺', `
            <div>
                <label class="block text-xs font-medium text-slate-600">压纹类型</label>
                <select onchange="updateQuote()" class="process-input mt-1 w-full p-2 border-slate-300 rounded-md text-sm" data-param="type">
                    <option value="细纹">细纹</option>
                    <option value="粗纹">粗纹</option>
                    <option value="皮纹">皮纹</option>
                    <option value="布纹">布纹</option>
                    <option value="木纹">木纹</option>
                </select>
                <p class="text-xs text-slate-500 mt-2">压纹工艺为整版处理，无需设置尺寸</p>
            </div>
        `)}
    `;
    renderIcons();
}

function createProcessHTML(key, name, content) {
    const config = specialProcessesConfig[key];
    return `
        <div class="process-item" id="${key}-process">
            <label class="border rounded-lg p-3 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 flex items-center justify-between">
                <div>
                    <span class="font-semibold text-sm">${name}</span>
                    <p class="text-xs text-slate-500 mt-1">点击选择此装饰工艺，可进行详细配置</p>
                </div>
                <input type="checkbox" onchange="toggleProcessDetails(this, '${key}')" class="h-4 w-4 text-blue-600 focus:ring-blue-500">
            </label>
            <div id="${key}-details" class="hidden mt-3 ml-4 pl-4 border-l-2 border-blue-200 space-y-4">
                <div class="process-instances-container space-y-4">
                   ${createProcessInstanceHTML(key, content, 0)}
                </div>
                ${config.max > 1 ? `<button onclick="addProcessInstance(this, '${key}')" class="text-sm font-semibold text-blue-600 hover:underline flex items-center"><i data-lucide="plus" class="w-4 h-4 mr-1"></i>增加一处</button>` : ''}
            </div>
        </div>
    `;
}

function createProcessInstanceHTML(key, content, index) {
    return `
         <div class="process-instance border-t border-slate-200 pt-4" data-index="${index}">
            <div class="flex justify-between items-center mb-2">
                <p class="text-sm font-semibold text-slate-500">位置 #${index + 1}</p>
                ${index > 0 ? `<button onclick="removeProcessInstance(this)" class="text-xs text-red-500 hover:underline">移除</button>` : ''}
            </div>
            ${content}
        </div>
    `;
}

function toggleProcessDetails(checkbox, key) {
    const detailsDiv = document.getElementById(`${key}-details`);
    detailsDiv.classList.toggle('hidden', !checkbox.checked);
    updateQuote();
}

function addProcessInstance(button, key) {
    const config = specialProcessesConfig[key];
    const container = button.previousElementSibling;
    if (container.children.length >= config.max) return;

    const template = document.querySelector(`#${key}-process .process-instance`).innerHTML;
    const newIndex = container.children.length;
    const newInstance = document.createElement('div');
    newInstance.innerHTML = createProcessInstanceHTML(key, template, newIndex);

    container.appendChild(newInstance.firstElementChild);

    if (container.children.length >= config.max) {
        button.classList.add('hidden');
    }
    renderIcons();
    updateQuote();
}

function removeProcessInstance(button) {
    const instanceDiv = button.closest('.process-instance');
    const container = instanceDiv.parentElement;
    const addButton = container.nextElementSibling;
    instanceDiv.remove();
    if (addButton) addButton.classList.remove('hidden');
    updateQuote();
}

function toggleWindowOptions(selectElement) {
    const instanceDiv = selectElement.closest('.process-instance');
    const filmOptionDiv = instanceDiv.querySelector('.window-film-option');
    const windowTypeDiv = instanceDiv.querySelector('.window-type-option');

    const isWindow = selectElement.value === '贴窗';
    filmOptionDiv.classList.toggle('hidden', !isWindow);
    windowTypeDiv.classList.toggle('hidden', !isWindow);
}

function getSelectedProcessesDetails() {
    const details = [];
    document.querySelectorAll('.process-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (!checkbox.checked) return;

        const processKey = item.id.replace('-process', '');
        const processName = specialProcessesConfig[processKey].name;

        item.querySelectorAll('.process-instance').forEach((instance, index) => {
            const instanceDetails = [];
            const typeInput = instance.querySelector('[data-param="type"]');
            if (typeInput) {
                instanceDetails.push(typeInput.value);
            } else {
                instanceDetails.push(processName);
            }

            const inputs = instance.querySelectorAll('.process-input');
            let size = [];
            inputs.forEach(input => {
                const param = input.dataset.param;
                if (param === 'type') return;

                if (param === 'width' || param === 'height') {
                    if (input.value) size.push(input.value);
                } else {
                    if (input.value) instanceDetails.push(`${input.value}`);
                }
            });
            if (size.length === 2) {
                instanceDetails.push(`(${size.join('x')}mm)`);
            }
            details.push(instanceDetails.join(' '));
        });
    });
    return details;
}

function updateQuote() {
    const length = parseFloat(document.getElementById('length').value) || 0;
    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;

    if (!document.querySelector('input[name="material"]:checked') || !document.querySelector('input[name="grammage"]:checked')) return;

    let baseFactor = 1.0;
    let additionalCost = 0;

    baseFactor *= parseFloat(document.querySelector('input[name="material"]:checked').dataset.priceFactor);
    baseFactor *= parseFloat(document.querySelector('input[name="grammage"]:checked').dataset.priceFactor);
    baseFactor *= parseFloat(document.querySelector('input[name="surface-treatment"]:checked').dataset.priceFactor);

    const printingMethod = document.querySelector('input[name="printing-method"]:checked').value;

    // 根据印刷方式调整基础价格
    switch (printingMethod) {
        case 'none':
            baseFactor *= 0.8; // 不印刷的折扣
            break;
        case 'digital':
            baseFactor *= 1.2; // 数码印刷的基础价格
            break;
        case 'offset':
            baseFactor *= 1.0; // 标准胶印方式
            // 获取胶印专色选项的价格系数
            const offsetSpotColorFactor = parseFloat(document.querySelector('input[name="offset-spot-color"]:checked').dataset.priceFactor);
            additionalCost += offsetSpotColorFactor * quantity * 10; // 胶印专色成本
            break;
        case 'uv-offset':
            baseFactor *= 1.35; // UV胶印的基础价格更高

            // 计算UV专色成本
            const uvSpotColorFactor = parseFloat(document.querySelector('input[name="uv-spot-color"]:checked').dataset.priceFactor);
            additionalCost += uvSpotColorFactor * quantity * 12; // UV专色成本（单价比普通专色高）

            // 计算白墨成本（如果选择）
            const whiteInkCheckbox = document.querySelector('input[name="uv-white-ink"]:checked');
            if (whiteInkCheckbox) {
                const whiteInkFactor = parseFloat(whiteInkCheckbox.dataset.priceFactor);
                additionalCost += whiteInkFactor * quantity * 12; // 白墨印刷成本
            }

            // 计算逆向UV工艺成本（如果选择）
            const reverseUVCheckbox = document.querySelector('input[name="uv-reverse"]:checked');
            if (reverseUVCheckbox) {
                const reverseUVFactor = parseFloat(reverseUVCheckbox.dataset.priceFactor);
                additionalCost += reverseUVFactor * quantity * 15; // 逆向UV工艺成本
            }
            break;
    }

    // Calculate special processes cost
    document.querySelectorAll('.process-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (!checkbox.checked) return;

        const processKey = item.id.replace('-process', '');
        const config = specialProcessesConfig[processKey];

        item.querySelectorAll('.process-instance').forEach(instance => {
            const widthInput = instance.querySelector('[data-param="width"]');
            const heightInput = instance.querySelector('[data-param="height"]');
            const w = parseFloat(widthInput?.value) || 0;
            const h = parseFloat(heightInput?.value) || 0;

            if (w > 0 && h > 0) {
                let pricePerSqMm = config.pricePerSqMm;
                // Special handling for hot stamping type
                if (processKey === 'hotStamping') {
                    const typeInput = instance.querySelector('[data-param="type"]');
                    if (typeInput && typeInput.value === '立体烫金') {
                        pricePerSqMm = config.pricePerSqMm3D;
                    }
                }
                additionalCost += (w * h * pricePerSqMm) * quantity;
            }
        });
    });

    document.querySelectorAll('input[name="accessories"]:checked').forEach(el => {
        let accessoryPrice = parseFloat(el.dataset.priceFactor);

        // Add inner tray material and detail price differences
        if (el.value === '内托') {
            const materialPriceFactor = parseFloat(document.querySelector('input[name="inner-tray-material"]:checked')?.dataset.priceFactor || 0);
            accessoryPrice += materialPriceFactor;

            // Add material-specific price factors
            const material = document.querySelector('input[name="inner-tray-material"]:checked')?.value;
            if (material === '纸质内托') {
                const paperTypeFactor = parseFloat(document.querySelector('input[name="paper-tray-type"]:checked')?.dataset.priceFactor || 0);
                accessoryPrice += paperTypeFactor;
            } else if (material === '吸塑内托') {
                const plasticTypeFactor = parseFloat(document.querySelector('input[name="plastic-tray-type"]:checked')?.dataset.priceFactor || 0);
                accessoryPrice += plasticTypeFactor;
            }
        }

        additionalCost += accessoryPrice * quantity;
    });
    document.querySelectorAll('input[name="services"]:checked').forEach(el => {
        additionalCost += parseFloat(el.dataset.priceFactor);
    });
    document.querySelectorAll('input[name="sampling-service"]:checked').forEach(el => {
        additionalCost += parseFloat(el.dataset.priceFactor); // Fixed cost, not per quantity
    });

    if (length > 0 && width > 0 && height > 0 && quantity > 0) {
        const area = (length * width + length * height * 2 + width * height * 2) / 100000;
        const basePrice = area * 5; // Base material and printing cost
        const unitPrice = basePrice * baseFactor;
        const subtotal = (unitPrice * quantity) + additionalCost;
        const finalUnitPrice = subtotal / quantity;
        const logisticsFee = quantity * 0.02 + 12;

        document.getElementById('unit-price').textContent = `¥ ${finalUnitPrice.toFixed(2)}`;
        document.getElementById('subtotal-price').textContent = `¥ ${subtotal.toFixed(2)}`;
        document.getElementById('logistics-fee').textContent = `¥ ${logisticsFee.toFixed(2)}`;
        document.getElementById('total-price').textContent = `¥ ${(subtotal + logisticsFee).toFixed(2)}`;

        const leadTime = 7 + Math.ceil(quantity / 2000) + (additionalCost > 0 ? 2 : 0);
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + leadTime);
        document.getElementById('lead-time').textContent = deliveryDate.toLocaleDateString('zh-CN');
    } else {
        document.getElementById('unit-price').textContent = '¥ 0.00';
        document.getElementById('subtotal-price').textContent = '¥ 0.00';
        document.getElementById('logistics-fee').textContent = '¥ 0.00';
        document.getElementById('total-price').textContent = '¥ 0.00';
        document.getElementById('lead-time').textContent = '-';
    }
}

// --- 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (document.getElementById('homepage')) {
        // No specific init for homepage
    } else if (document.getElementById('product-center-page')) {
        initializeFilters();
    } else if (document.getElementById('customization-page')) {
        if (productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                document.getElementById('customization-title').textContent = product.name;
                document.getElementById('customization-header').textContent = `${product.name} 定制`;
                if (product.description) {
                    document.getElementById('customization-desc').textContent = product.description;
                } else {
                    document.getElementById('customization-desc').textContent = `定制您的专属 ${product.name} (${product.id})。`;
                }
                document.getElementById('customization-preview-img').src = product.imageUrl.replace('400', '800').replace('300','600');
                document.getElementById('customization-preview-img').alt = product.name;
            }
        }
        renderMaterialOptions();
        renderSpecialProcesses();
    } else if (document.getElementById('shopping-cart-page')) {
        renderCart();
    } else if (document.getElementById('checkout-page')) {
        renderCheckoutPage();
    } else if (document.getElementById('user-center-page')) {
        const viewId = urlParams.get('viewId') || 'dashboard-view';
        showUserCenterView(viewId);
    } else if (document.getElementById('product-detail-page')) {
        if (productId) {
            renderProductDetailPage(productId);
        }
    }

    updateCartIcon();
    renderIcons();

    // Handle window resize for mobile filter
    const filterSidebar = document.getElementById('filter-sidebar');
    if (filterSidebar) {
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                filterSidebar.classList.remove('hidden');
            } else {
                filterSidebar.classList.add('hidden');
                document.getElementById('filter-chevron').style.transform = 'rotate(0deg)';
            }
        });
    }

    // Handle User Center Modals
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', e => {
            e.preventDefault();
            const idField = document.getElementById('address-id');
            const nameInput = document.getElementById('address-name');
            const phoneInput = document.getElementById('address-phone');
            const addressInput = document.getElementById('address-full');
            const defaultCheckbox = document.getElementById('address-default');

            const name = nameInput?.value.trim();
            const phone = phoneInput?.value.trim();
            const fullAddress = addressInput?.value.trim();
            const isDefaultChecked = !!defaultCheckbox?.checked;

            if (!name || !phone || !fullAddress) {
                showNotification('请完整填写收货人、电话与地址信息', 'error');
                return;
            }

            const idValue = idField?.value;
            let updatedAddresses;

            if (idValue) {
                const addressId = Number(idValue);
                updatedAddresses = userAddresses.map(addr => {
                    if (addr.id === addressId) {
                        return { ...addr, name, phone, address: fullAddress, isDefault: isDefaultChecked };
                    }
                    return isDefaultChecked ? { ...addr, isDefault: false } : addr;
                });
            } else {
                const newAddress = {
                    id: Date.now(),
                    name,
                    phone,
                    address: fullAddress,
                    isDefault: isDefaultChecked || userAddresses.length === 0
                };
                updatedAddresses = isDefaultChecked ? userAddresses.map(addr => ({ ...addr, isDefault: false })) : [...userAddresses];
                updatedAddresses.push(newAddress);
            }

            if (updatedAddresses.length && !updatedAddresses.some(addr => addr.isDefault)) {
                updatedAddresses[0].isDefault = true;
            }

            userAddresses = updatedAddresses;
            saveAddresses();
            renderAddressView();
            closeAddressModal();
            showNotification('地址已保存', 'success');
        });
    }

    const invoiceForm = document.getElementById('invoice-form');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', e => {
            e.preventDefault();
            // In a real app, you would submit the invoice request to a server.
            // Here we just close the modal.
            alert('发票申请已提交！');
            closeInvoiceModal();
        });

        const invoiceTypeRadios = document.querySelectorAll('input[name="invoice-type"]');
        invoiceTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const companyDetails = document.getElementById('company-invoice-details');
                if (document.querySelector('input[name="invoice-type"]:checked').value === 'company') {
                    companyDetails.classList.remove('hidden');
                } else {
                    companyDetails.classList.add('hidden');
                }
            });
        });
    }
});
