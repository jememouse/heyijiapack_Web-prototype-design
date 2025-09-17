// --- 全局状态和数据 ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
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

// --- 个人中心 ---
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

function initUserCenter() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewId = urlParams.get('viewId') || 'dashboard-view';
    const orderId = urlParams.get('orderId');
    renderUserCenterView(viewId, { orderId });
}

function renderUserCenterView(viewId, context) {
    const contentContainer = document.getElementById('user-center-content');
    if (!contentContainer) return;

    // Load the appropriate view's HTML content from the main index file's hidden divs
    const viewTemplate = document.querySelector(`template#${viewId}`);
    if (viewTemplate) {
        contentContainer.innerHTML = viewTemplate.innerHTML;
    } else {
        console.error(`View template for ${viewId} not found!`);
        // Fallback to dashboard
        const dashboardTemplate = document.querySelector(`template#dashboard-view`);
        if(dashboardTemplate) contentContainer.innerHTML = dashboardTemplate.innerHTML;
    }

    buildSidebar(document.getElementById('user-center-sidebar'), viewId);

    if (viewId === 'orders-view') {
        renderOrdersPage();
    } else if (viewId === 'order-detail-view') {
        renderOrderDetailPage(context?.orderId);
    } else if (viewId === 'distribution-view') {
        renderDistributionParentView();
    }
    renderIcons();
}

function buildSidebar(container, activeViewId) {
    if (!container) return;
    container.innerHTML = '';
    sidebarTemplate.forEach(item => {
        if (item.isHidden) return;
        const link = document.createElement('a');
        link.href = `user-center.html?viewId=${item.id}`;
        link.className = `sidebar-link flex items-center px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg ${item.id === activeViewId ? 'active' : ''}`;
        link.innerHTML = `<i data-lucide="${item.icon}" class="w-5 h-5 mr-3"></i> ${item.text}`;
        container.appendChild(link);
    });
    const logoutLink = document.createElement('a');
    logoutLink.href = 'index.html';
    logoutLink.className = 'flex items-center px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg mt-4 border-t border-slate-200';
    logoutLink.innerHTML = `<i data-lucide="log-out" class="w-5 h-5 mr-3"></i> 退出登录`;
    container.appendChild(logoutLink);
}

// --- Modals Logic (shared across pages) ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.remove('hidden');
    renderIcons();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.add('hidden');
}

// --- Products Page ---
function initProductsPage() {
    initializeFilters();
}

function initializeFilters() {
    // ... (rest of the function is the same)
}

// --- Customization Page ---
function initCustomizationPage() {
    renderMaterialOptions();
    renderSpecialProcesses();
    // Potentially load product details from URL params
}

// --- Cart Page ---
function initCartPage() {
    renderCart();
    updateCartIcon();
}

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

function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm p-12 text-center">
                <i data-lucide="shopping-cart" class="w-16 h-16 mx-auto text-slate-300"></i>
                <h2 class="mt-4 text-2xl font-semibold">您的购物车是空的</h2>
                <p class="mt-2 text-slate-500">快去“在线定制”页面，添加一些商品吧！</p>
                <a href="products.html" class="mt-6 btn-primary text-white px-6 py-2 rounded-lg font-semibold">
                    去定制
                </a>
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

    const checkoutButton = document.querySelector('button[onclick="handleCheckout()"]');
    if(checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}

function updateCartItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }
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

// --- Checkout Page ---
function initCheckoutPage() {
    renderCheckoutPage();
}

function renderCheckoutPage() {
    const addressContainer = document.getElementById('checkout-address-container');
    const itemsContainer = document.getElementById('checkout-items-container');

    if(!addressContainer || !itemsContainer) return;

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

    const newOrder = {
        id: `20250726${Math.floor(Math.random() * 1000)}`,
        date: new Date().toLocaleDateString('zh-CN').replace(/\//g, '-'),
        total: total,
        status: '文件待上传',
        statusId: 'placed',
        items: JSON.parse(JSON.stringify(cart)) // Deep copy
    };

    // In a real app, this would be saved to a server. Here we just use localStorage.
    let allOrders = JSON.parse(localStorage.getItem('orders')) || orders;
    allOrders.unshift(newOrder);
    localStorage.setItem('orders', JSON.stringify(allOrders));

    localStorage.setItem('lastOrder', JSON.stringify(newOrder));

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));

    window.location.href = 'order-success.html';
}

// --- Order Success Page ---
function initOrderSuccessPage() {
    const container = document.getElementById('order-success-content');
    if (!container) return;

    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    if (!lastOrder) {
        // ... handle error ...
        return;
    }
    // ... render logic ...
}

// --- Main Initializer ---
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('/') || path.endsWith('index.html')) {
        // Homepage logic can be placed here if any
    } else if (path.endsWith('products.html')) {
        initProductsPage();
    } else if (path.endsWith('customization.html')) {
        initCustomizationPage();
    } else if (path.endsWith('cart.html')) {
        initCartPage();
    } else if (path.endsWith('checkout.html')) {
        initCheckoutPage();
    } else if (path.endsWith('user-center.html')) {
        initUserCenter();
    } else if (path.endsWith('order-success.html')) {
        initOrderSuccessPage();
    }

    // Global initializations for all pages
    updateCartIcon();
    renderIcons();
});
