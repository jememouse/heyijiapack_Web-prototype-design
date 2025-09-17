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

function initializeSmartDesignPage() {
    if (window.lucide) {
        lucide.createIcons();
    }

    const generateBtn = document.getElementById('generate-btn');
    const gallery = document.getElementById('ai-results-gallery');
    const initialPrompt = document.getElementById('initial-prompt');
    const proofingModal = document.getElementById('proofing-modal');
    const closeProofingModalBtn = document.getElementById('close-proofing-modal');
    const modalDesignImage = document.getElementById('modal-design-image');
    const toast = document.getElementById('toast-notification');

    const baseProofingCostEl = document.getElementById('base-proofing-cost');
    const finishingCostEl = document.getElementById('finishing-cost-summary');
    const serviceCostEl = document.getElementById('service-cost-summary');
    const totalCostEl = document.getElementById('total-cost-summary');
    const expertFeeRow = document.getElementById('expert-fee-row');
    const expertCostSummary = document.getElementById('expert-cost-summary');

    const innerTrayCheckbox = document.getElementById('inner-tray-checkbox');
    const innerTrayOptions = document.getElementById('inner-tray-options');
    const addAccessoriesCheckbox = document.getElementById('add-accessories-checkbox');
    const accessoriesOptions = document.getElementById('accessories-options');

    const proofingModeRadios = document.querySelectorAll('input[name="proofing-mode"]');
    const manualSpecsContainer = document.getElementById('manual-specs-container');

    const mockResults = [
        { image: 'https://images.pexels.com/photos/7262900/pexels-photo-7262900.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { image: 'https://images.pexels.com/photos/7262995/pexels-photo-7262995.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { image: 'https://images.pexels.com/photos/7262990/pexels-photo-7262990.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { image: 'https://images.pexels.com/photos/7262890/pexels-photo-7262890.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { image: 'https://images.pexels.com/photos/7262817/pexels-photo-7262817.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { image: 'https://images.pexels.com/photos/7262779/pexels-photo-7262779.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ];

    // --- User Input Animation ---
    const inputsForAnimation = [document.getElementById('product-name'), document.getElementById('style-keywords')];
    inputsForAnimation.forEach(input => {
        input.addEventListener('input', () => {
            if(input.value.length > 2) {
                generateBtn.classList.add('button-pulse');
            } else {
                generateBtn.classList.remove('button-pulse');
            }
        });
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('opacity-0', 'translate-y-10');
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-10');
        }, 2500);
    }

    function handleProofingModeChange() {
        const selectedMode = document.querySelector('input[name="proofing-mode"]:checked').value;
        if (selectedMode === 'expert') {
            manualSpecsContainer.classList.add('disabled');
            expertFeeRow.classList.remove('hidden');
            baseProofingCostEl.parentElement.classList.add('hidden');
            finishingCostEl.parentElement.classList.add('hidden');
            serviceCostEl.parentElement.classList.add('hidden');
        } else {
            manualSpecsContainer.classList.remove('disabled');
            expertFeeRow.classList.add('hidden');
            baseProofingCostEl.parentElement.classList.remove('hidden');
            finishingCostEl.parentElement.classList.remove('hidden');
            serviceCostEl.parentElement.classList.remove('hidden');
        }
        updateCost();
    }

    function addEventListenersForCostUpdate() {
        proofingModeRadios.forEach(radio => radio.addEventListener('change', handleProofingModeChange));

        const costInputs = [
            ...document.querySelectorAll('input[name="finishing-option"], input[name="service-option"], input[name="inner-tray-material"], input[name="standard-accessory"]'),
            document.getElementById('proofing-quantity')
        ];

        costInputs.forEach(el => {
            el.addEventListener('change', updateCost);
            el.addEventListener('input', updateCost); // for quantity
        });

        innerTrayCheckbox.addEventListener('change', () => {
            innerTrayOptions.classList.toggle('hidden', !innerTrayCheckbox.checked);
            updateCost();
        });

        addAccessoriesCheckbox.addEventListener('change', () => {
            accessoriesOptions.classList.toggle('hidden', !addAccessoriesCheckbox.checked);
            updateCost();
        });
    }

    function updateCost() {
        const selectedMode = document.querySelector('input[name="proofing-mode"]:checked').value;
        const quantity = parseInt(document.getElementById('proofing-quantity').value) || 1;

        if (selectedMode === 'expert') {
            const depositPrice = 100.00;
            expertCostSummary.textContent = `¥ ${depositPrice.toFixed(2)}`;
            totalCostEl.textContent = `¥ ${depositPrice.toFixed(2)}`;
            return;
        }

        let finishingPrice = 0;
        let servicePrice = 0;
        const basePrice = 150.00;

        document.querySelectorAll('input[name="finishing-option"]:checked').forEach(checkbox => {
            finishingPrice += parseFloat(checkbox.value);
        });

        document.querySelectorAll('input[name="service-option"]:checked').forEach(checkbox => {
            const id = checkbox.id;
            if(id !== 'inner-tray-checkbox' && id !== 'add-accessories-checkbox') {
                 servicePrice += parseFloat(checkbox.value);
            }
        });

        if (innerTrayCheckbox.checked) {
            const selectedTray = document.querySelector('input[name="inner-tray-material"]:checked');
            if(selectedTray) {
                servicePrice += parseFloat(selectedTray.value);
            }
        }

        if (addAccessoriesCheckbox.checked) {
             document.querySelectorAll('input[name="standard-accessory"]:checked').forEach(checkbox => {
                servicePrice += parseFloat(checkbox.value);
            });
        }

        const totalPerItemCost = basePrice + finishingPrice + servicePrice;
        const totalPrice = totalPerItemCost * quantity;

        baseProofingCostEl.textContent = `¥ ${(basePrice * quantity).toFixed(2)}`;
        finishingCostEl.textContent = `¥ ${(finishingPrice * quantity).toFixed(2)}`;
        serviceCostEl.textContent = `¥ ${(servicePrice * quantity).toFixed(2)}`;
        totalCostEl.textContent = `¥ ${totalPrice.toFixed(2)}`;
    }

    function openProofingModal(imageUrl, boxType) {
        modalDesignImage.src = imageUrl.replace('w=400', 'w=800');

        const boxTypeSelect = document.getElementById('box-type-select');
        if (boxTypeSelect) {
            boxTypeSelect.value = boxType;
        }

        document.getElementById('proofing-mode-manual').checked = true;
        handleProofingModeChange();

        addEventListenersForCostUpdate();
        updateCost();
        proofingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if(window.lucide) lucide.createIcons();
    }

    function closeProofingModal() {
        proofingModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    closeProofingModalBtn.addEventListener('click', closeProofingModal);

    proofingModal.addEventListener('click', (e) => {
        if (e.target === proofingModal) {
            closeProofingModal();
        }
    });


    generateBtn.addEventListener('click', () => {
        const selectedBoxType = document.querySelector('input[name="box-type"]:checked + label .text-xs').textContent;
        generateBtn.classList.remove('button-pulse');

        initialPrompt.classList.add('hidden');
        gallery.innerHTML = `
            <div class="col-span-full h-full flex flex-col items-center justify-center text-center p-10">
                <i data-lucide="loader-2" class="w-16 h-16 text-blue-500 animate-spin"></i>
                <h3 class="mt-4 text-xl font-semibold">AI正在挥洒创意...</h3>
                <p class="mt-2 text-slate-500">通常需要10-30秒，请稍候。</p>
            </div>
        `;
        if (window.lucide) {
            lucide.createIcons();
        }

        setTimeout(() => {
            gallery.innerHTML = '';
            mockResults.sort(() => 0.5 - Math.random()).forEach(result => {
                const card = document.createElement('div');
                card.className = "group relative bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1";
                card.innerHTML = `
                    <img src="${result.image}" alt="AI generated packaging design" class="w-full h-64 object-cover" loading="lazy">
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
                        <div class="flex justify-center space-x-2">
                             <button class="bg-white/80 text-slate-900 p-2 rounded-full hover:bg-white backdrop-blur-sm" title="放大预览">
                                <i data-lucide="zoom-in" class="w-5 h-5"></i>
                            </button>
                            <button class="favorite-btn bg-white/80 text-slate-900 p-2 rounded-full hover:bg-white backdrop-blur-sm" title="收藏">
                                <i data-lucide="heart" class="w-5 h-5"></i>
                            </button>
                             <button data-image-url="${result.image}" data-box-type="${selectedBoxType}" class="select-design-btn flex-grow bg-blue-600/90 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 backdrop-blur-sm">
                                选择此方案
                            </button>
                        </div>
                    </div>
                `;
                gallery.appendChild(card);
            });
             if (window.lucide) {
                lucide.createIcons();
            }
        }, 2000);
    });

    gallery.addEventListener('click', (e) => {
        const selectBtn = e.target.closest('.select-design-btn');
        if (selectBtn) {
            const imageUrl = selectBtn.dataset.imageUrl;
            const boxType = selectBtn.dataset.boxType;
            openProofingModal(imageUrl, boxType);
            return;
        }

        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            const heartIcon = favoriteBtn.querySelector('i');
            heartIcon.style.fill = 'red';
            heartIcon.style.color = 'red';
            showToast('已将您的杰作收藏！');
        }
    });
}
function initializeSmartMatcherPage() {
    const boxTypeData = {
        "天地盖盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><rect x="3" y="11" width="18" height="9" rx="1"></rect><path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path></svg>`, fulfillsNeeds: ["高级质感", "结构保护", "奢华体验", "品牌形象"] },
        "翻盖书型盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z"></path></svg>`, fulfillsNeeds: ["品牌价值", "奢华体验", "创意结构", "开箱体验"] },
        "抽屉盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><rect x="3" y="7" width="18" height="14" rx="2" ry="2"></rect><path d="M7 12h2"></path><path d="M3 8.5h18"></path><path d="M5 3h14v4H5z"></path></svg>`, fulfillsNeeds: ["高级质感", "创意结构", "仪式感", "精致小巧", "强保护性"] },
        "手提袋": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M8 18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H9.25a2 2 0 0 0-1.9 1.4L6 9Z"></path><path d="M12 14v-4"></path><path d="M10 12h4"></path><path d="M14 6V5a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1"></path></svg>`, fulfillsNeeds: ["便携精美", "品牌宣传"] },
        "双插盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`, fulfillsNeeds: ["产品保护", "陈列效果", "成本控制"] },
        "锁底盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="m3.27 6.96 8.73 5.05 8.73-5.05"></path><path d="M12 22.08V12"></path><path d="m7 19-5-2.88"></path><path d="m17 19 5-2.88"></path></svg>`, fulfillsNeeds: ["结构强度", "产品保护", "陈列效果"] },
        "纸管": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`, fulfillsNeeds: ["高阻隔性", "保持风味", "创意结构"] },
        "异形盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path></svg>`, fulfillsNeeds: ["设计感强", "创意结构", "品牌特色"] },
        "瓦楞盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M2.5 10.5c0-.9.8-1.7 1.7-1.7h15.6c.9 0 1.7.8 1.7 1.7v9.8c0 .9-.8 1.7-1.7 1.7H4.2c-.9 0-1.7-.8-1.7-1.7Z"></path><path d="m6.2 8.8-1.6-2.6a1 1 0 0 1 .8-1.6h13.1c.8 0 1.5.6 1.5 1.4v.1c0 .1 0 .2-.1.3l-1.6 2.8"></path></svg>`, fulfillsNeeds: ["运输保护", "结构强度", "成本控制"] },
        "飞机盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M22 17.5H2l-1.5-3.3A.5.5 0 0 1 1 14V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v9a.5.5 0 0 1-.5.5Z"></path><path d="M14 17.5V3"></path></svg>`, fulfillsNeeds: ["运输保护", "结构强度", "开箱体验"] },
        "飞机盒(大号)": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M22 17.5H2l-1.5-3.3A.5.5 0 0 1 1 14V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v9a.5.5 0 0 1-.5.5Z"></path><path d="M14 17.5V3"></path></svg>`, fulfillsNeeds: ["运输保护", "结构强度", "大尺寸", "开箱体验"] },
        "手提盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M21 10h-2.2a2 2 0 0 1-1.8-1l-1.4-2.4a2 2 0 0 0-1.8-1H9.2a2 2 0 0 0-1.8 1L6 8.9A2 2 0 0 1 4.2 10H2v10h19V10Z"></path></svg>`, fulfillsNeeds: ["结构支撑", "开窗展示", "品牌特色"] },
        "西点盒": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M20 15.5a2.5 2.5 0 0 1-5 0V9h5v6.5Z"></path><path d="M20 9H4v11h11"></path><path d="M10 9V3.5a2.5 2.5 0 0 1 5 0V9"></path><path d="M4 20h-2v-5a2 2 0 0 1 2-2h2v7Z"></path></svg>`, fulfillsNeeds: ["结构支撑", "开窗展示", "食品级材质"] },
        "八边封袋": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M20 14.5a.5.5 0 0 0-.5-.5H11a2 2 0 0 1 0-4h1.5a.5.5 0 0 0 0-1H11a2 2 0 0 1-2-2V4.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v1.5a2 2 0 0 1-2 2H4.5a.5.5 0 0 0 0 1H6a2 2 0 0 1 0 4H4.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-2Z"></path></svg>`, fulfillsNeeds: ["高阻隔性", "保持风味"] },
        "自立袋": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M12 21a9 9 0 0 1-9-9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a9 9 0 0 1-9 9Z"></path><path d="M9 10v-.5A1.5 1.5 0 0 1 10.5 8h3A1.5 1.5 0 0 1 15 9.5V10"></path></svg>`, fulfillsNeeds: ["密封防潮", "激发食欲", "成本控制"] },
        "首饰袋": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M6.33 6.67a4 4 0 1 1 5.34 0"></path><path d="M17.67 6.67a4 4 0 1 0-5.34 0"></path><path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4Z"></path><path d="M18.33 13.33a4 4 0 1 1-5.33 0"></path><path d="M5.67 13.33a4 4 0 1 0 5.33 0"></path><path d="M12 6a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4Z"></path></svg>`, fulfillsNeeds: ["精致小巧", "强保护性"] },
        "锁底盒 (带挂钩)": { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 flex-shrink-0"><path d="M12 4V2"></path><path d="M14 2H10"></path><path d="M21 8.3V16a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8.3c0-.6.3-1.2.8-1.5l7-4c.3-.2.6-.2.9 0l7 4c.5.3.8.9.8 1.5Z"></path><path d="m3.27 6.96 8.73 5.05 8.73-5.05"></path><path d="M12 22.08V12"></path></svg>`, fulfillsNeeds: ["陈列效果", "产品保护"] }
    };

    const industryData = [
        {
            industry: "美妆护肤",
            icon: "gem",
            color: "pink-500",
            subcategories: [
                { name: "护肤品套盒", image: "https://images.pexels.com/photos/7262911/pexels-photo-7262911.jpeg?auto=compress&cs=tinysrgb&w=800", description: "通过传递奢华开箱体验，让您的客户在收到产品的第一刻就感受到品牌价值。坚固的结构确保产品安全送达，避免售后烦恼。", proTip: "提示：配合使用烫金或击凸工艺，可显著提升高级感。", needs: ["高级质感", "结构保护", "品牌价值", "奢华体验"], purposes: ["礼品赠送", "品牌宣传"], size: "中", recommended: ["天地盖盒", "翻盖书型盒", "抽屉盒", "手提袋"] },
                { name: "单品包装", image: "https://images.pexels.com/photos/7262898/pexels-photo-7262898.jpeg?auto=compress&cs=tinysrgb&w=800", description: "在零售货架上脱颖而出，精准的包装结构完美保护您的产品。精致的工艺是体现产品专业性的最佳方式。", proTip: "提示：选择合适的纸张克重是平衡成本与挺度的关键。", needs: ["产品保护", "陈列效果", "工艺精致"], purposes: ["零售陈列", "产品内包装"], size: "小", recommended: ["双插盒", "锁底盒", "纸管"] },
                { name: "彩妆产品", image: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800", description: "用设计感十足的小包装抓住消费者的眼球。独特的结构和亮眼的工艺能有效提升产品的吸引力和购买转化率。", proTip: "提示：局部UV或镭射膜工艺能让您的彩妆在货架上闪闪发光。", needs: ["设计感强", "小巧精致", "特殊工艺"], purposes: ["零售陈列"], size: "小", recommended: ["双插盒", "抽屉盒", "异形盒"] }
            ]
        },
        {
            industry: "3C数码",
            icon: "smartphone",
            color: "blue-500",
            subcategories: [
                { name: "手机及配件", image: "https://images.pexels.com/photos/163036/phone-camera-smartphone-instagram-163036.jpeg?auto=compress&cs=tinysrgb&w=800", description: "用简洁而富有科技感的设计传递品牌信任感。精准的内托设计不仅提供卓越保护，更是专业性的体现。", proTip: "提示：防刮花哑膜配合局部UV，是体现科技感的经典搭配。", needs: ["结构强度", "精准内托", "科技感"], purposes: ["零售陈列", "产品内包装"], size: "中", recommended: ["天地盖盒", "翻盖书型盒", "抽屉盒"] },
                { name: "消费电子", image: "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=800", description: "优秀的包装是产品的第一“说明书”。通过开窗设计或清晰的图文展示，让消费者在货架前就能快速了解产品亮点。", proTip: "提示：带挂钩的锁底盒结构，非常适合在商超货架上进行挂式陈列。", needs: ["产品保护", "展示功能", "开窗设计"], purposes: ["零售陈列"], size: "中", recommended: ["锁底盒 (带挂钩)", "天地盖盒", "抽屉盒"] }
            ]
        },
        {
            industry: "电子产品",
            icon: "cpu",
            color: "indigo-500",
            subcategories: [
                { name: "家用电器", image: "https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&w=800", description: "为您的电器产品提供“盔甲”般的保护。坚固的瓦楞包装能有效应对复杂的物流挑战，降低运输损耗。", proTip: "提示：根据产品重量选择三层或五层瓦楞纸板，能实现成本和保护性的最佳平衡。", needs: ["运输保护", "结构强度", "配件固定", "成本控制"], purposes: ["电商快递"], size: "大", recommended: ["瓦楞盒", "飞机盒(大号)"] },
                { name: "个护健康", image: "https://images.pexels.com/photos/7691238/pexels-photo-7691238.jpeg?auto=compress&cs=tinysrgb&w=800", description: "包装不仅是保护，更是传递健康生活理念的媒介。内外盒的精致结合，能显著提升用户对品牌的信赖感。", proTip: "提示：使用触感膜或环保特种纸，能更好地传递自然、健康的品牌理念。", needs: ["科技感", "品牌形象", "精准内托", "陈列效果"], purposes: ["零售陈列", "礼品赠送"], size: "中", recommended: ["天地盖盒", "抽屉盒", "翻盖书型盒"] },
                { name: "办公设备", image: "https://images.pexels.com/photos/7643759/pexels-photo-7643759.jpeg?auto=compress&cs=tinysrgb&w=800", description: "高效、专业的包装方案能简化您的仓储和运输流程。清晰的版面设计，让产品信息一目了然。", proTip: "提示：采用统一的视觉设计系统，能有效强化您在B端市场的品牌形象。", needs: ["功能性", "品牌一致性", "信息清晰", "仓储方便"], purposes: ["零售陈列", "电商快递"], size: "中", recommended: ["锁底盒", "飞机盒", "双插盒"] }
            ]
        },
        {
            industry: "食品饮料",
            icon: "utensils-crossed",
            color: "orange-500",
            subcategories: [
                { name: "烘焙糕点", image: "https://images.pexels.com/photos/1854037/pexels-photo-1854037.jpeg?auto=compress&cs=tinysrgb&w=800", description: "让美味“看得见”。开窗设计能激发顾客的食欲，而食品级安全材质则让这份美味更安心。", proTip: "提示：PET透明开窗膜比普通PVC膜更环保，能提升品牌好感度。", needs: ["食品级材质", "结构支撑", "开窗展示", "品牌特色"], purposes: ["零售陈列", "礼品赠送"], size: "中", recommended: ["手提盒", "天地盖盒", "西点盒"] },
                { name: "茶叶/咖啡", image: "https://images.pexels.com/photos/4109936/pexels-photo-4109936.jpeg?auto=compress&cs=tinysrgb&w=800", description: "为您的精品风味保驾护航。高阻隔性的包装能锁住香气，典雅的设计则讲述着品牌的故事与文化。", proTip: "提示：纸管包装不仅结构独特，其密封性也特别适合茶叶、花茶等产品。", needs: ["高阻隔性", "保持风味", "品牌文化"], purposes: ["礼品赠送", "品牌宣传"], size: "小", recommended: ["纸管", "抽屉盒", "八边封袋"] },
                { name: "休闲零食", image: "https://images.pexels.com/photos/5638668/pexels-photo-5638668.jpeg?auto=compress&cs=tinysrgb&w=800", description: "在琳琅满目的货架上，用鲜活的设计抓住消费者的胃。可靠的密封性确保产品在赏味期内的新鲜口感。", proTip: "提示：复合材质的自立袋是兼顾展示效果、密封性和成本的优选方案。", needs: ["密封防潮", "激发食欲", "成本控制"], purposes: ["零售陈列", "产品内包装"], size: "小", recommended: ["自立袋", "锁底盒", "双插盒"] }
            ]
        },
        {
            industry: "礼品与节庆",
            icon: "gift",
            color: "red-500",
            subcategories: [
                { name: "节日礼盒", image: "https://images.pexels.com/photos/5708266/pexels-photo-5708266.jpeg?auto=compress&cs=tinysrgb&w=800", description: "包装是情感的载体。富有创意的结构和充满节日氛围的设计，能让您的心意加倍。", proTip: "提示：翻盖书型盒配合磁铁暗扣，能营造出富有仪式感的“开箱”体验。", needs: ["创意结构", "节日氛围", "仪式感"], purposes: ["礼品赠送"], size: "中", recommended: ["翻盖书型盒", "异形盒", "天地盖盒"] },
                { name: "伴手礼", image: "https://images.pexels.com/photos/6621469/pexels-photo-6621469.jpeg?auto=compress&cs=tinysrgb&w=800", description: "一份得体的伴手礼，是品牌形象的流动广告。便携精美的设计，能让这份心意被轻松带到更远的地方。", proTip: "提示：小巧的抽屉盒配上手提袋，是一套经典且高性价比的伴手礼组合。", needs: ["便携精美", "主题体现", "性价比"], purposes: ["礼品赠送"], size: "小", recommended: ["手提袋", "抽屉盒", "双插盒"] }
            ]
        },
        {
            industry: "服装配饰",
            icon: "shirt",
            color: "gray-500",
            subcategories: [
                { name: "高端服装", image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=800", description: "对于高端品牌，包装本身就是奢侈体验的重要一环。大尺寸的精品盒能完美承载您的产品，传递品牌价值。", proTip: "提示：大尺寸天地盖盒配合丝带或定制腰封，是高端服装包装的常用选择。", needs: ["品牌形象", "大尺寸", "奢华体验"], purposes: ["礼品赠送", "品牌宣传"], size: "大", recommended: ["天地盖盒", "飞机盒(大号)", "手提袋"] },
                { name: "珠宝首饰", image: "https://images.pexels.com/photos/1458869/pexels-photo-1458869.jpeg?auto=compress&cs=tinysrgb&w=800", description: "方寸之间，尽显精致。坚固的结构与柔软的内托为您的珍贵饰品提供周全保护，彰显不凡品味。", proTip: "提示：植绒或EVA材质的内托，能有效固定首饰并防止刮花。", needs: ["精致小巧", "强保护性", "高级内托"], purposes: ["礼品赠送", "零售陈列"], size: "小", recommended: ["抽屉盒", "天地盖盒", "首饰袋"] }
            ]
        },
        {
            industry: "电商零售",
            icon: "shopping-cart",
            color: "sky-500",
            subcategories: [
                { name: "快递运输盒", image: "https://images.pexels.com/photos/7709292/pexels-photo-7709292.jpeg?auto=compress&cs=tinysrgb&w=800", description: "坚固、耐用、轻便是电商包装的核心。我们的方案能有效保护商品，降低运输损耗，提升客户满意度。", proTip: "提示：飞机盒一体成型，无需胶带封箱，能显著提升打包效率。", needs: ["坚固耐用", "轻便", "易于打包"], purposes: ["电商快递"], size: "大", recommended: ["飞机盒", "瓦楞盒"] },
                { name: "订阅盒", image: "https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg?auto=compress&cs=tinysrgb&w=800", description: "每月一次的“惊喜”，从打开包装的瞬间开始。通过独特的结构和品牌化的设计，创造难忘的开箱体验，提升用户粘性。", proTip: "提示：在飞机盒内侧进行单色印刷，是低成本提升品牌感和开箱体验的妙招。", needs: ["品牌塑造", "开箱体验", "结构多样"], purposes: ["电商快递", "品牌宣传"], size: "中", recommended: ["飞机盒", "翻盖书型盒"] }
            ]
        }
    ];
     const quickEntries = [
        { name: "我是电商卖家", icon: "shopping-cart", filters: { industry: "电商零售", purposes: ["电商快递"], sizes: [] } },
        { name: "我要做节日礼品", icon: "gift", filters: { industry: "礼品与节庆", purposes: ["礼品赠送"], sizes: [] } },
        { name: "我是新消费品牌", icon: "gem", filters: { industry: "美妆护肤", purposes: [], sizes: ["小", "中"] } }
    ];

    const filters = {
        industry: null,
        purposes: [],
        sizes: []
    };

    const industryFilterContainer = document.getElementById('industry-filter');
    const purposeFilterContainer = document.getElementById('purpose-filter');
    const sizeFilterContainer = document.getElementById('size-filter');
    const resultsContainer = document.getElementById('results-container');
    const noResultsContainer = document.getElementById('no-results');
    const resetBtn = document.getElementById('reset-filters-btn');
    const quickEntryContainer = document.getElementById('quick-entry-container');
    const inspirationLink = document.getElementById('inspiration-link');


    function renderQuickEntries() {
        quickEntryContainer.innerHTML = quickEntries.map(entry => `
            <button data-entry-name="${entry.name}" class="quick-entry-btn flex items-center bg-white border border-slate-300 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors">
                <i data-lucide="${entry.icon}" class="w-4 h-4 mr-2 text-slate-500"></i>
                <span>${entry.name}</span>
            </button>
        `).join('');
    }

    function renderIndustries() {
        industryFilterContainer.innerHTML = industryData.map(item => `
            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                <input type="radio" name="industry" value="${item.industry}" class="sr-only">
                <i data-lucide="${item.icon}" class="w-5 h-5 text-${item.color} mr-3"></i>
                <span class="font-medium text-sm">${item.industry}</span>
            </label>
        `).join('');
    }

    function renderPurposes() {
        let subcategoriesToScan = industryData.flatMap(i => i.subcategories);
        if (filters.industry) {
             const industry = industryData.find(i => i.industry === filters.industry);
             subcategoriesToScan = industry ? industry.subcategories : [];
        }

        const availablePurposes = subcategoriesToScan.flatMap(sub => sub.purposes);
        const uniquePurposes = [...new Set(availablePurposes)].sort();

        purposeFilterContainer.innerHTML = uniquePurposes.map(pur => `
            <button type="button" class="filter-btn text-sm border rounded-full px-3 py-1.5 transition-colors hover:border-slate-400" data-purpose="${pur}">
                ${pur}
            </button>
        `).join('');

        filters.purposes.forEach(pur => {
            const btn = purposeFilterContainer.querySelector(`[data-purpose="${pur}"]`);
            if (btn) btn.classList.add('active');
        });
    }

    function renderSizes() {
        const sizes = ['小', '中', '大'];
        sizeFilterContainer.innerHTML = sizes.map(size => `
            <button type="button" class="filter-btn text-sm border rounded-full px-4 py-1.5 transition-colors hover:border-slate-400" data-size="${size}">
                ${size}
            </button>
        `).join('');

        filters.sizes.forEach(size => {
            const btn = sizeFilterContainer.querySelector(`[data-size="${size}"]`);
            if (btn) btn.classList.add('active');
        });
    }

    function renderResults() {
        let results = industryData.flatMap(i => i.subcategories);

        if (filters.industry) {
            const industry = industryData.find(i => i.industry === filters.industry);
            results = industry ? industry.subcategories : [];
        }

        if (filters.purposes.length > 0) {
            results = results.filter(sub => filters.purposes.every(pur => sub.purposes.includes(pur)));
        }

        if (filters.sizes.length > 0) {
            results = results.filter(sub => filters.sizes.includes(sub.size));
        }

        resultsContainer.innerHTML = '';
        if (results.length > 0) {
            noResultsContainer.classList.add('hidden');
            inspirationLink.classList.remove('hidden');
            results.forEach(sub => {
                const card = document.createElement('div');
                card.className = "bg-white rounded-xl shadow-md overflow-hidden flex flex-col";
                card.innerHTML = `
                    <img src="${sub.image}" alt="${sub.name}" class="w-full h-48 object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/400x250/e2e8f0/94a3b8?text=Image+not+found';">
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="font-bold text-xl mb-2">${sub.name}</h3>
                        <p class="text-slate-600 text-sm mb-4 flex-grow">${sub.description}</p>

                        <div class="mb-4">
                            <h4 class="font-semibold text-xs mb-2 text-slate-500 uppercase tracking-wider">核心需求:</h4>
                            <div class="needs-container flex flex-wrap gap-2 text-xs">
                                ${sub.needs.map(need => `<span class="need-tag bg-slate-100 text-slate-700 px-2 py-1 rounded-full transition-all duration-200" data-need="${need}">${need}</span>`).join('')}
                            </div>
                        </div>

                        <!-- 3. 专家提示 -->
                        <div class="mb-6 p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-800 text-xs">
                            <span class="font-bold">专家提示:</span> ${sub.proTip}
                        </div>

                        <div class="mt-auto">
                            <h4 class="font-semibold text-xs mb-3 text-slate-500 uppercase tracking-wider">推荐盒型 (点击定制):</h4>
                            <div class="grid gap-2 grid-cols-2">
                                ${sub.recommended.map((rec, index) => {
                                    const box = boxTypeData[rec] || {};
                                    const fulfills = box.fulfillsNeeds || [];
                                    const icon = box.icon || '';
                                    const isPrimary = index === 0;
                                    const primaryClasses = 'bg-blue-600 text-white hover:bg-blue-700';
                                    const secondaryClasses = 'bg-white text-blue-600 border border-blue-500 hover:bg-blue-50';
                                    return `<button
                                                data-box-type="${rec}"
                                                data-fulfills='${JSON.stringify(fulfills)}'
                                                class="recommended-box-btn w-full text-sm font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center ${isPrimary ? primaryClasses : secondaryClasses}">
                                                ${icon}
                                                <span>${rec}</span>
                                            </button>`
                                }).join('')}
                            </div>
                        </div>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        } else {
             noResultsContainer.classList.remove('hidden');
             inspirationLink.classList.add('hidden');
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function resetAllFilters() {
         filters.industry = null;
        filters.purposes = [];
        filters.sizes = [];

        const currentIndustry = document.querySelector('input[name="industry"]:checked');
        if(currentIndustry) currentIndustry.checked = false;

        renderPurposes(); // Re-render with all purposes
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

        updateFiltersAndRender();
    }

    function updateFiltersAndRender() {
        const selectedIndustryInput = document.querySelector('input[name="industry"]:checked');
        filters.industry = selectedIndustryInput ? selectedIndustryInput.value : null;

        filters.purposes = Array.from(document.querySelectorAll('#purpose-filter .filter-btn.active')).map(btn => btn.dataset.purpose);
        filters.sizes = Array.from(document.querySelectorAll('#size-filter .filter-btn.active')).map(btn => btn.dataset.size);

        renderResults();
    }

    function navigateToCustomization(boxType) {
        // Map generic box type names from matcher to specific product IDs
        const productMapping = {
            "天地盖盒": "P-02-JP-TD", // Defaulting to the '精品盒' version
            "翻盖书型盒": "P-02-JP-SX",
            "抽屉盒": "P-02-JP-CT", // Defaulting to the '精品盒' version
            "手提袋": null, // No direct equivalent in product data, handle gracefully
            "双插盒": "P-01-KH-SC",
            "锁底盒": "P-01-KH-SD", // Mapping to manual lock bottom
            "纸管": null, // Not available
            "异形盒": null, // Not available
            "瓦楞盒": null, // No generic corrugated box, only airplane box
            "飞机盒": "P-01-KH-FJ",
            "飞机盒(大号)": "P-01-KH-FJ", // Map to the same for now
            "手提盒": null, // Not available
            "西点盒": null, // Not available
            "八边封袋": null, // Not available
            "自立袋": null, // Not available
            "首饰袋": null, // Not available
            "锁底盒 (带挂钩)": "P-01-KH-DS" // Mapping to a similar type
        };

        const productId = productMapping[boxType];

        if (productId) {
            // Store an object to be more descriptive about the action
            localStorage.setItem('navigateTo', JSON.stringify({
                action: 'goToCustomization',
                productId: productId
            }));
            window.location.href = 'index.html';
        } else {
            alert(`“${boxType}”的在线定制功能即将上线，敬请期待！`);
        }
    }

    // --- Event Listeners ---

    // Quick Entry
    quickEntryContainer.addEventListener('click', e => {
        const target = e.target.closest('.quick-entry-btn');
        if (target) {
            const entryName = target.dataset.entryName;
            const entry = quickEntries.find(e => e.name === entryName);
            if (entry) {
                resetAllFilters();
                // Apply filters from quick entry
                if (entry.filters.industry) {
                    const industryRadio = document.querySelector(`input[name="industry"][value="${entry.filters.industry}"]`);
                    if(industryRadio) industryRadio.checked = true;
                    renderPurposes(); // re-render purposes for the selected industry
                }

                entry.filters.purposes.forEach(pur => {
                    const btn = purposeFilterContainer.querySelector(`[data-purpose="${pur}"]`);
                    if(btn) btn.classList.add('active');
                });
                 entry.filters.sizes.forEach(size => {
                    const btn = sizeFilterContainer.querySelector(`[data-size="${size}"]`);
                    if(btn) btn.classList.add('active');
                });

                updateFiltersAndRender();
            }
        }
    });

    // Filter changes
    industryFilterContainer.addEventListener('change', e => {
        if(e.target.name === 'industry') {
            // Reset sub-filters when industry changes
            filters.purposes = [];
            filters.sizes = [];
            renderPurposes();
            renderSizes();
            updateFiltersAndRender();
        }
    });

    purposeFilterContainer.addEventListener('click', e => {
        if (e.target.classList.contains('filter-btn')) {
            e.target.classList.toggle('active');
            updateFiltersAndRender();
        }
    });

    sizeFilterContainer.addEventListener('click', e => {
        if (e.target.classList.contains('filter-btn')) {
            e.target.classList.toggle('active');
            updateFiltersAndRender();
        }
    });

    // Reset button
    resetBtn.addEventListener('click', resetAllFilters);

    // --- Interactive Results Card Events ---
    resultsContainer.addEventListener('click', e => {
        const target = e.target.closest('.recommended-box-btn');
        if (target) {
            const boxType = target.dataset.boxType;
            if (boxType) {
                navigateToCustomization(boxType);
            }
        }
    });

    resultsContainer.addEventListener('mouseover', e => {
        const target = e.target.closest('.recommended-box-btn');
        if (target) {
            const card = target.closest('.bg-white');
            const needsToHighlight = JSON.parse(target.dataset.fulfills || '[]');
            const needTags = card.querySelectorAll('.need-tag');
            needTags.forEach(tag => {
                if (needsToHighlight.includes(tag.dataset.need)) {
                    tag.classList.add('highlight');
                }
            });
        }
    });

    resultsContainer.addEventListener('mouseout', e => {
        const target = e.target.closest('.recommended-box-btn');
        if (target) {
            const card = target.closest('.bg-white');
            card.querySelectorAll('.need-tag').forEach(tag => {
                tag.classList.remove('highlight');
            });
        }
    });


    // Initial Render
    renderQuickEntries();
    renderIndustries();
    renderPurposes();
    renderSizes();
    renderResults();
    if (window.lucide) {
        lucide.createIcons();
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
    } else if (path === 'smart-matcher.html') {
        initializeSmartMatcherPage();
    } else if (path === 'smart-design.html') {
        initializeSmartDesignPage();
    }

    updateCartIcon();
    renderIcons();
});
