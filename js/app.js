// --- 全局状态和数据 ---
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
let lastOrderId = null;
let distributionStatus = 'none'; // 'none', 'pending', 'approved'
let withdrawalAccounts = []; // To store saved bank accounts

const userAddresses = [
    { id: 1, name: '李婷', phone: '138****1234', address: '上海市 浦东新区 世纪大道100号 东方明珠大厦 88层', isDefault: true },
    { id: 2, name: '王经理', phone: '159****5678', address: '江苏省 苏州市 工业园区 星湖街328号 创意产业园 A栋 201室', isDefault: false },
];
let orders = [
    { id: '20250720001', date: '2025-07-20', total: 1250.00, status: '文件处理中', statusId: 'processing', items: [{ name: '飞机盒', specs: '200x150x50mm | E瓦楞 | 哑光覆膜', quantity: 500, imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }] },
    { id: '20250718985', date: '2025-07-18', total: 3500.00, status: '已发货', statusId: 'shipped', items: [{ name: '双插盒', specs: '100x80x40mm | 350g白卡纸 | 烫金', quantity: 1000, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }] },
    { id: '20250715752', date: '2025-07-15', total: 880.00, status: '已完成', statusId: 'completed', items: [{ name: '抽屉盒', specs: '120x120x60mm | 精品灰板 | 无工艺', quantity: 200, imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }] },
];
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
    "白卡纸": {
        "priceFactor": 1.0, "desc": "挺度好，印刷效果佳", "thicknesses": {
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
    "粉灰纸": {
        "priceFactor": 0.9, "desc": "一面白一面灰，性价比高", "thicknesses": {
            "0.55mm": [
                { "value": "350g", "factor": 1.0, "isDefault": true },
                { "value": "400g", "factor": 1.1 }
            ]
        }
    },
};

// --- 辅助函数 ---
function renderIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// --- 页面导航逻辑 ---
const userCenterViews = document.querySelectorAll('.user-center-view');

const sidebarTemplate = [
    { id: 'dashboard-view', icon: 'layout-dashboard', text: '账户总览' },
    { id: 'orders-view', icon: 'package', text: '我的订单' },
    { id: 'order-detail-view', icon: 'file-search', text: '订单详情', isHidden: true },
    { id: 'address-view', icon: 'map-pin', text: '地址管理' },
    { id: 'invoice-view', icon: 'file-text', text: '发票管理' },
    { id: 'after-sales-view', icon: 'wrench', text: '售后处理' },
    { id: 'distribution-view', icon: 'share-2', text: '分销管理' },
    { id: 'coupons-view', icon: 'ticket', text: '我的优惠券' },
    { id: 'settings-view', icon: 'user-cog', text: '账户设置' },
];

function renderDashboardView() {
    const view = document.getElementById('dashboard-view');
    if (!view) return;

    const pendingOrders = orders.filter(o => ['placed', 'processing', 'confirming', 'production'].includes(o.statusId)).length;
    const shippedOrders = orders.filter(o => o.statusId === 'shipped').length;
    // Assuming a static number for coupons for now
    const couponCount = 5;

    const recentOrders = orders.slice(0, 3);

    view.innerHTML = `
        <div class="bg-white p-8 rounded-xl shadow-sm">
            <h1 class="text-3xl font-bold mb-2">欢迎回来, 李婷!</h1>
            <p class="text-slate-600 mb-8">这是您的账户总览，祝您有美好的一天。</p>
            <div class="grid sm:grid-cols-3 gap-6 mb-8">
                <div class="bg-slate-50 p-6 rounded-lg">
                    <p class="text-sm text-slate-500">待处理订单</p>
                    <p class="text-3xl font-bold mt-1">${pendingOrders}</p>
                </div>
                <div class="bg-slate-50 p-6 rounded-lg">
                    <p class="text-sm text-slate-500">待收货</p>
                    <p class="text-3xl font-bold mt-1">${shippedOrders}</p>
                </div>
                <div class="bg-slate-50 p-6 rounded-lg">
                    <p class="text-sm text-slate-500">可用优惠券</p>
                    <p class="text-3xl font-bold mt-1">${couponCount}</p>
                </div>
            </div>
            <h2 class="text-xl font-semibold mb-4">最近订单</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 text-sm text-slate-600">
                        <tr>
                            <th class="p-4 font-semibold">订单号</th>
                            <th class="p-4 font-semibold">下单日期</th>
                            <th class="p-4 font-semibold">总金额</th>
                            <th class="p-4 font-semibold">状态</th>
                            <th class="p-4 font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentOrders.map(order => `
                            <tr class="border-b border-slate-200">
                                <td class="p-4">#...${order.id.slice(-3)}</td>
                                <td class="p-4">${order.date}</td>
                                <td class="p-4">¥${order.total.toFixed(2)}</td>
                                <td class="p-4"><span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">${order.status}</span></td>
                                <td class="p-4"><a href="#" onclick="showUserCenterView('order-detail-view', { orderId: '${order.id}' })" class="font-semibold text-blue-600">查看</a></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showUserCenterView(viewId, context) {
    userCenterViews.forEach(v => v.classList.add('hidden'));
    const activeView = document.getElementById(viewId);
    if (activeView) activeView.classList.remove('hidden');
    buildSidebar(document.getElementById('user-center-sidebar'), viewId);

    if (viewId === 'dashboard-view') {
        renderDashboardView();
    } else if (viewId === 'orders-view') {
        renderOrdersPage();
    } else if (viewId === 'order-detail-view') {
        renderOrderDetailPage(context?.orderId);
    } else if (viewId === 'distribution-view') {
        renderDistributionParentView();
    }
    renderIcons();
}

// Product Detail Page Functions
function renderProductDetailTab(productId, tabId) {
    const product = productDetails[productId];
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


function switchProductDetailTab(button, productId, tabId) {
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

    renderProductDetailTab(productId, tabId);
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
                            <div class="image-container bg-slate-100" onclick="window.location.href='product-detail.html?product=${product.id}'">
                                <img class="img-3d w-full h-48 object-cover cursor-pointer"
                                    src="${product.imageUrl}"
                                    alt="${product.name} 3D图">
                            </div>
                            <div class="p-5 flex flex-col">
                                <h3 class="text-lg font-bold flex-grow">${product.name}</h3>
                                <p class="text-xs text-slate-500 mt-1">${product.id}</p>
                                <div class="mt-4 space-y-2">
                                    <button onclick="window.location.href='product-detail.html?product=${product.id}'" class="w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">查看详情</button>
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

function findProductInCatalog(productId) {
    for (const domain in productCatalog) {
        for (const pCat in productCatalog[domain]) {
            for (const sCat in productCatalog[domain][pCat]) {
                const found = productCatalog[domain][pCat][sCat].find(p => p.id === productId);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
}

function populateCustomizationPage(productId) {
    const details = productDetails[productId];
    if (!details) {
        // handle error, maybe redirect or show a message
        return;
    }

    const titleElement = document.getElementById('customization-title');
    const headerElement = document.getElementById('customization-header');
    const descElement = document.getElementById('customization-desc');
    const imageElement = document.getElementById('customization-preview-img');

    let productInfo = findProductInCatalog(productId);

    if (titleElement) titleElement.textContent = productInfo.name;
    if (headerElement) headerElement.textContent = `${productInfo.name} 定制`;
    if (descElement) descElement.textContent = details.description;
    if (imageElement) {
        imageElement.src = productInfo.imageUrl.replace('400', '800').replace('300','600');
        imageElement.alt = productInfo.name;
    }
}

function goToCustomization(productId) {
    window.location.href = `customization.html?product=${productId}`;
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
        domainSummary.innerHTML = `
            <span>${domainMap[domainName] || domainName}</span>
            <i data-lucide="chevron-down" class="w-4 h-4 transition-transform transform group-open:rotate-180"></i>
        `;
        domainSummary.addEventListener('click', (e) => handleFilterClick('domain', domainName, e.currentTarget));

        const primaryContainer = document.createElement('div');
        primaryContainer.className = 'pl-4 mt-1 space-y-1 border-l border-slate-200 ml-2';

        Object.keys(domainData).forEach(primaryCategoryName => {
            const primaryCategoryData = domainData[primaryCategoryName];

            const primaryDetails = document.createElement('details');
            primaryDetails.className = 'filter-group';
            primaryDetails.open = true;

            const primarySummary = document.createElement('summary');
            primarySummary.className = 'filter-link p-2 rounded-lg hover:bg-slate-50 cursor-pointer flex justify-between items-center';
            primarySummary.dataset.level = 'primary';
            primarySummary.dataset.value = primaryCategoryName;
            primarySummary.innerHTML = `
                <span>${primaryCategoryName}</span>
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform transform group-open:rotate-180"></i>
            `;
            primarySummary.addEventListener('click', (e) => handleFilterClick('primary', primaryCategoryName, e.currentTarget));

            const secondaryContainer = document.createElement('div');
            secondaryContainer.className = 'pl-4 mt-1 space-y-1 border-l border-slate-200 ml-2';

            Object.keys(primaryCategoryData).forEach(secondaryCategoryName => {
                if (primaryCategoryData[secondaryCategoryName].length > 0) {
                    const secondaryLink = document.createElement('a');
                    secondaryLink.href = '#';
                    secondaryLink.className = 'filter-link text-sm block p-2 rounded-lg hover:bg-slate-50';
                    secondaryLink.dataset.level = 'secondary';
                    secondaryLink.dataset.value = secondaryCategoryName;
                    secondaryLink.textContent = secondaryCategoryName;
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

function buildSidebar(container, activeViewId) {
    if (!container) return;
    container.innerHTML = '';
    sidebarTemplate.forEach(item => {
        if (item.isHidden) return;
        const link = document.createElement('a');
        link.href = '#';
        link.className = `sidebar-link flex items-center px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg ${item.id === activeViewId ? 'active' : ''}`;
        link.onclick = (e) => { e.preventDefault(); showUserCenterView(item.id); };
        link.innerHTML = `<i data-lucide="${item.icon}" class="w-5 h-5 mr-3"></i> ${item.text}`;
        container.appendChild(link);
    });
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.className = 'flex items-center px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg mt-4 border-t border-slate-200';
    logoutLink.onclick = (e) => { e.preventDefault(); window.location.href = 'index.html'; };
    logoutLink.innerHTML = `<i data-lucide="log-out" class="w-5 h-5 mr-3"></i> 退出登录`;
    container.appendChild(logoutLink);
}

// --- Modals Logic ---
const addressModal = document.getElementById('address-modal');
const invoiceModal = document.getElementById('invoice-modal');
const afterSalesModal = document.getElementById('after-sales-modal');
const loginModal = document.getElementById('login-modal');
const orderSuccessModal = document.getElementById('order-success-modal');
const paymentModal = document.getElementById('payment-modal');
const withdrawalModal = document.getElementById('withdrawal-modal');

function openAddressModal() { addressModal.classList.remove('hidden'); renderIcons(); }
function closeAddressModal() { addressModal.classList.add('hidden'); }
function openInvoiceModal() { invoiceModal.classList.remove('hidden'); renderIcons(); }
function closeInvoiceModal() { invoiceModal.classList.add('hidden'); }
function openAfterSalesModal() { afterSalesModal.classList.remove('hidden'); renderIcons(); }
function closeAfterSalesModal() { afterSalesModal.classList.add('hidden'); }
function openLoginModal() { loginModal.classList.remove('hidden'); renderIcons(); }
function closeLoginModal() { loginModal.classList.add('hidden'); }
function openOrderSuccessModal() { orderSuccessModal.classList.remove('hidden'); renderIcons(); }
function closeOrderSuccessModalAndGoToUpload() {
    orderSuccessModal.classList.add('hidden');
    window.location.href = `user-center.html?view=order-detail-view&orderId=${lastOrderId}`;
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
    renderWithdrawalAccounts();
    withdrawalModal.classList.remove('hidden');
    renderIcons();
}
function closeWithdrawalModal() {
    withdrawalModal.classList.add('hidden');
    document.getElementById('add-account-form').classList.add('hidden');
}

function renderWithdrawalAccounts() {
    const container = document.getElementById('withdrawal-account-list');
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
    parent.querySelectorAll('.order-tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderOrdersPage(status);
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
            saveCart();
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
                if (newQuantity > 0) {
                    item.quantity = newQuantity;
                    saveCart();
                } else {
                    removeCartItem(itemId);
                }
    }
    renderCart();
    updateCartIcon();
}

function removeCartItem(itemId) {
    cart = cart.filter(i => i.id !== itemId);
            saveCart();
    renderCart();
    updateCartIcon();
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('您的购物车是空的！');
        return;
    }
    document.getElementById('shopping-cart-page').classList.add('hidden');
    const checkoutPage = document.getElementById('checkout-page');
    checkoutPage.classList.remove('hidden');
    renderCheckoutPage();
    window.scrollTo(0, 0);
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

    openOrderSuccessModal();
    cart = [];
            saveCart();
    updateCartIcon();
}

// --- 订单页面逻辑 ---
function renderOrdersPage(filterStatus = 'all') {
    const container = document.getElementById('orders-list-container');
    if (!container) return;

    const filteredOrders = orders.filter(order => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'in-production') return ['placed', 'processing', 'confirming', 'production'].includes(order.statusId);
        return order.statusId === filterStatus;
    });

    if (filteredOrders.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500"><i data-lucide="inbox" class="w-12 h-12 mx-auto"></i><p class="mt-2">暂无相关订单</p></div>`;
    } else {
        container.innerHTML = filteredOrders.map(order => {
            const firstItem = order.items[0];
            return `
            <div class="order-card border border-slate-200 rounded-lg">
                <div class="bg-slate-50 px-6 py-3 flex justify-between items-center text-sm rounded-t-lg">
                    <div><span class="font-semibold">订单号:</span> <span class="text-slate-600">${order.id}</span></div>
                    <div><span class="font-semibold">下单时间:</span> <span class="text-slate-600">${order.date}</span></div>
                    <div class="font-semibold text-blue-600">${order.status}</div>
                </div>
                <div class="p-6">
                    <div class="flex items-start space-x-6">
                        <img src="${firstItem.imageUrl}" alt="${firstItem.name}" class="w-24 h-24 rounded-md object-cover">
                        <div class="flex-grow">
                            <h4 class="font-semibold">${firstItem.name} ${order.items.length > 1 ? `等 ${order.items.length} 件商品` : ''}</h4>
                            <p class="text-sm text-slate-500 mt-1">${firstItem.specs}</p>
                            <p class="text-sm text-slate-500">数量: ${firstItem.quantity}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold">¥${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="border-t border-slate-200 mt-4 pt-4 flex justify-end space-x-3">
                        <button onclick="showUserCenterView('order-detail-view', { orderId: '${order.id}' })" class="bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50">查看详情</button>
                        <button class="btn-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">再次购买</button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }
    renderIcons();
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
        document.getElementById('order-detail-view').innerHTML = `<p>订单不存在</p>`;
        return;
    }

    document.getElementById('order-detail-breadcrumb').innerHTML = `
        <a href="#" onclick="showUserCenterView('dashboard-view')" class="hover:underline">我的账户</a> &gt;
        <a href="#" onclick="showUserCenterView('orders-view')" class="hover:underline">我的订单</a> &gt;
        <span>订单 #${order.id}</span>
    `;
    document.getElementById('order-detail-title').textContent = `订单详情`;

    const timelineContainer = document.getElementById('order-timeline');
    const currentStatusIndex = orderStates.findIndex(s => s.id === order.statusId);
    timelineContainer.innerHTML = orderStates.map((state, index) => {
        const isActive = index <= currentStatusIndex;
        return `
        <div class="relative flex items-start timeline-item ${isActive ? 'active' : ''}">
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}">
                <i data-lucide="${state.icon}" class="w-4 h-4"></i>
            </div>
            <div>
                <p class="font-semibold ${isActive ? 'text-slate-800' : 'text-slate-500'}">${state.name}</p>
                ${isActive ? `<p class="text-xs text-slate-500 mt-1">${index === currentStatusIndex ? '进行中...' : '已完成'}</p>` : ''}
            </div>
        </div>`;
    }).join('');

    const infoContainer = document.getElementById('order-detail-info');
    const address = userAddresses.find(a => a.isDefault);
    infoContainer.innerHTML = `
        <h3 class="text-xl font-semibold mb-4">订单信息</h3>
        <div class="grid md:grid-cols-2 gap-8">
            <div>
                <h4 class="font-semibold text-slate-800 mb-3">收货信息</h4>
                <p class="text-slate-600">${address.name}</p>
                <p class="text-slate-600">${address.phone}</p>
                <p class="text-slate-600">${address.address}</p>
            </div>
            <div>
                <h4 class="font-semibold text-slate-800 mb-3">产品列表</h4>
                <ul class="space-y-2 text-sm text-slate-600">
                    ${order.items.map(item => `<li><strong>${item.name} (x${item.quantity})</strong>: ${item.specs}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="border-t border-slate-200 my-6"></div>
        <div class="text-right">
            <p class="text-slate-600">商品总价: <span class="font-semibold text-slate-800">¥${(order.total - 15).toFixed(2)}</span></p>
            <p class="text-slate-600">运费: <span class="font-semibold text-slate-800">¥15.00</span></p>
            <p class="mt-2 text-lg">实付款: <span class="font-bold text-2xl text-red-600">¥${order.total.toFixed(2)}</span></p>
        </div>`;

    updateContextualBox(order);
}

function updateContextualBox(order) {
    const contextualBox = document.getElementById('contextual-action-box');
    let content = '';
    switch (order.statusId) {
        case 'placed':
            content = `
            <h4 class="font-semibold text-lg mb-3">待处理任务：上传生产文件</h4>
            <p class="text-sm text-slate-600 mb-6">为确保生产顺利，请上传符合我们规范的设计文件及相关的商标授权文件。</p>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">1. 生产文件 (AI, PDF, EPS)</label>
                    <button class="w-full bg-white border border-slate-300 px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-slate-50">
                        <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                        <span>点击上传</span>
                    </button>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">2. 商标授权文件 (PDF, JPG)</label>
                     <button class="w-full bg-white border border-slate-300 px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-slate-50">
                        <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                        <span>点击上传</span>
                    </button>
                </div>
            </div>
            <button onclick="updateOrderStatus('${order.id}', 'processing')" class="mt-6 w-full btn-primary text-white py-2 rounded-lg font-semibold">确认提交文件</button>
            `;
            break;
        case 'processing': content = `<h4 class="font-semibold text-lg mb-3">文件处理中</h4><p class="text-sm text-slate-600">我们的工程师正在审核您的文件，通常需要1个工作日。审核通过后，我们将通知您确认。</p>`; break;
        // ... other cases
        default: content = `<h4 class="font-semibold text-lg mb-3">订单进行中</h4><p class="text-sm text-slate-600">您的订单正在处理中，请耐心等待状态更新。</p>`;
    }
    contextualBox.innerHTML = content;
    renderIcons();
}

function updateOrderStatus(orderId, newStatusId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.statusId = newStatusId;
        const state = orderStates.find(s => s.id === newStatusId);
        order.status = state ? state.name : '';
        renderOrderDetailPage(orderId);
    }
}

// --- Distribution Logic ---
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

function renderDistributionDashboard() {
    const totalCommission = distributionData.orders.reduce((sum, order) => sum + order.commission, 0);
    const withdrawnAmount = distributionData.withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const settledCommission = distributionData.orders
        .filter(o => o.status === '已结算')
        .reduce((sum, order) => sum + order.commission, 0);
    const withdrawableCommission = settledCommission - withdrawnAmount;

    document.getElementById('dist-total-commission').textContent = `¥${totalCommission.toFixed(2)}`;
    document.getElementById('dist-withdrawable-commission').textContent = `¥${withdrawableCommission.toFixed(2)}`;
    document.getElementById('dist-customer-count').textContent = distributionData.customers.length;
    document.getElementById('dist-level').textContent = distributionData.stats.level;
    document.getElementById('dist-rate').textContent = `/ ${distributionData.stats.commissionRate}`;

    const referralLink = document.getElementById('referral-link').value;
    document.getElementById('referral-qr-code').src = `https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(referralLink)}`;

    // Render Earnings Chart
    const chartContainer = document.getElementById('earnings-chart');
    const maxEarning = Math.max(...distributionData.monthlyEarnings.map(e => e.earnings), 1); // Avoid division by zero
    chartContainer.innerHTML = distributionData.monthlyEarnings.map(item => `
        <div class="flex-1 flex flex-col items-center justify-end" title="${item.month}: ¥${item.earnings.toFixed(2)}">
            <div class="w-full bg-blue-200 rounded-t-sm hover:bg-blue-400 transition-colors" style="height: ${(item.earnings / maxEarning) * 100}%;"></div>
            <p class="text-xs text-slate-500 mt-1">${item.month}</p>
        </div>
    `).join('');

    // Render Tables
    const ordersBody = document.getElementById('dist-orders-table-body');
    ordersBody.innerHTML = distributionData.orders.map(o => `
        <tr class="border-b border-slate-200">
            <td class="p-4 text-sm">${o.id}</td>
            <td class="p-4 text-sm">${o.customer}</td>
            <td class="p-4 text-sm">${o.date}</td>
            <td class="p-4 text-sm">¥${o.total.toFixed(2)}</td>
            <td class="p-4 text-sm font-semibold text-green-600">+¥${o.commission.toFixed(2)}</td>
            <td class="p-4 text-sm">${o.status === '已结算' ? `<span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">${o.status}</span>` : `<span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">${o.status}</span>`}</td>
        </tr>
    `).join('');

    const customersBody = document.getElementById('dist-customers-table-body');
    customersBody.innerHTML = distributionData.customers.map(c => `
        <tr class="border-b border-slate-200">
            <td class="p-4 text-sm">${c.name}</td>
            <td class="p-4 text-sm">${c.joinDate}</td>
            <td class="p-4 text-sm">¥${c.totalSpent.toFixed(2)}</td>
            <td class="p-4 text-sm">${c.lastOrderDate}</td>
        </tr>
    `).join('');

    const withdrawalsBody = document.getElementById('dist-withdrawals-table-body');
    withdrawalsBody.innerHTML = distributionData.withdrawals.map(w => `
        <tr class="border-b border-slate-200">
            <td class="p-4 text-sm">${w.id}</td>
            <td class="p-4 text-sm">${w.date}</td>
            <td class="p-4 text-sm">¥${w.amount.toFixed(2)}</td>
            <td class="p-4 text-sm"><span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">${w.status}</span></td>
        </tr>
    `).join('');

    if (withdrawalsBody.innerHTML === '') {
        withdrawalsBody.innerHTML = `<tr><td colspan="4" class="text-center p-8 text-slate-500">暂无提现记录</td></tr>`;
    }
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
    const spotColorDiv = document.getElementById('spot-color-options');

    if (method === 'offset') {
        spotColorDiv.classList.remove('hidden');
    } else {
        spotColorDiv.classList.add('hidden');
        // Reset spot color options when not in offset mode
        document.querySelector('input[name="printing-spot-color"][value="0"]').checked = true;
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
            <input type="radio" name="material" value="${key}" data-price-factor="${materialData[key].priceFactor}" onchange="renderGrammageOptions(this.value); updateQuote();" class="sr-only" ${index === 0 ? 'checked' : ''}>
            <div class="text-center">
                <span class="font-semibold text-base text-slate-800 mb-2 block">${key}</span>
                <p class="text-sm text-slate-600 leading-relaxed">${materialData[key].desc}</p>
            </div>
        </label>
    `).join('');
    renderGrammageOptions(Object.keys(materialData)[0]);
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

    if (printingMethod === 'none') {
        baseFactor *= 0.8; // Discount for no printing
    } else if (printingMethod === 'digital') {
        baseFactor *= 1.2; // Different base cost for digital
    } else if (printingMethod === 'offset') {
        baseFactor *= 1.0; // Offset is standard
        const spotColorFactor = parseFloat(document.querySelector('input[name="printing-spot-color"]:checked').dataset.priceFactor);
        additionalCost += spotColorFactor * quantity * 10; // Spot color cost
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
    const path = window.location.pathname.split('/').pop();
    const urlParams = new URLSearchParams(window.location.search);

    if (path === 'products.html' || path === '' || path === 'index.html') {
        if (document.getElementById('hierarchical-filter-container')) {
            initializeFilters();
        }
    } else if (path === 'product-detail.html') {
        const productId = urlParams.get('product');
        if (!productId) {
            document.body.innerHTML = '<h1>产品未找到</h1>';
            return;
        }
        const product = productDetails[productId];
        const productInfo = findProductInCatalog(productId);

        if (!product || !productInfo) {
            document.body.innerHTML = '<h1>产品信息不存在</h1>';
            return;
        }

        // Update main product information
        document.getElementById('product-detail-title').textContent = productInfo.name;
        document.getElementById('product-detail-subtitle').textContent = productInfo.id;
        document.getElementById('product-detail-main-image').src = productInfo.imageUrl.replace('400', '600');
        document.getElementById('product-detail-breadcrumb').textContent = productInfo.name;

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

        // Add event listeners for tabs
        document.querySelectorAll('.product-detail-tab-button').forEach(button => {
            button.addEventListener('click', () => {
                switchProductDetailTab(button, productId, button.dataset.tab);
            });
        });

        // Customize button
        const customizeButton = document.querySelector('#product-detail-page .bg-blue-600');
        if(customizeButton) {
            customizeButton.onclick = () => goToCustomization(productId);
        }

        // Click the first tab by default
        if (document.querySelector('.product-detail-tab-button')) {
            document.querySelector('.product-detail-tab-button').click();
        }

    } else if (path === 'customization.html') {
        const productId = urlParams.get('product');
        if (productId) {
            populateCustomizationPage(productId);
        }
        renderMaterialOptions();
        renderSpecialProcesses();
    } else if (path === 'cart.html') {
        renderCart();
        // Add event listener for going back to cart
        const backToCartLink = document.querySelector('a[href="cart.html"]');
        if(backToCartLink && backToCartLink.textContent.includes('返回购物车')){
             backToCartLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('checkout-page').classList.add('hidden');
                document.getElementById('shopping-cart-page').classList.remove('hidden');
                window.scrollTo(0, 0);
            });
        }
    } else if (path === 'user-center.html') {
        const view = urlParams.get('view') || 'dashboard-view';
        const orderId = urlParams.get('orderId');
        showUserCenterView(view, { orderId });
    }

    updateCartIcon();
    renderIcons();

    // Dropdown menu logic
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', e => {
            e.preventDefault();
            const currentDropdown = toggle.closest('.dropdown');
            const menu = currentDropdown.querySelector('.dropdown-menu');

            // Close other open dropdowns
            document.querySelectorAll('.dropdown-menu.open').forEach(openMenu => {
                if (openMenu !== menu) {
                    openMenu.classList.remove('open');
                }
            });

            menu.classList.toggle('open');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', e => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.open').forEach(openMenu => {
                openMenu.classList.remove('open');
            });
        }
    });
});
