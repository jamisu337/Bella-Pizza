/* ==========================================================================
   Pizza Database (Local)
   ========================================================================== */
const PIZZA_DATA = [
    {
        id: '1',
        name: 'Pepperoni Clássico',
        description: 'Fatias generosas de pepperoni premium curado, mussarela ralada grossa, molho de tomate artesanal e orégano chileno.',
        price: 45.00,
        category: 'salgada',
        image: 'pizzas/t pizza pepperoni.png',
        featured: true
    },
    {
        id: '2',
        name: 'Margherita Tradicional',
        description: 'Molho de tomate San Marzano, mussarela fresca de búfala, folhas de manjericão fresco e um fio de azeite extravirgem.',
        price: 39.00,
        category: 'salgada',
        image: 'pizzas/t pizza margherita.png',
        featured: false
    },
    {
        id: '3',
        name: '4 Queijos Suprema',
        description: 'Uma combinação harmônica e cremosa de Mussarela selecionada, Gorgonzola Dolce, Parmesão ralado na hora e Catupiry original.',
        price: 42.00,
        category: 'salgada',
        image: 'pizzas/t pizza 4 queijos.png',
        featured: false
    },
    {
        id: '4',
        name: 'Frango com Catupiry',
        description: 'Peito de frango desfiado e temperado com ervas finas, coberto com o autêntico Catupiry cremoso e milho verde doce.',
        price: 44.00,
        category: 'salgada',
        image: 'pizzas/t pizza Frango com Catupiry.png',
        featured: false
    },
    {
        id: '5',
        name: 'Bacon com Cheddar',
        description: 'Bacon defumado crocante em cubos, coberto com molho cheddar cremoso especial, mussarela e cebolinha fresca picada.',
        price: 46.00,
        category: 'salgada',
        image: 'pizzas/t pizza bacon com cheddar.png',
        featured: false
    },
    {
        id: '6',
        name: 'Sensação de Chocolate',
        description: 'Base de chocolate nobre ao leite derretido, coberto com morangos frescos fatiados selecionados e raspas de chocolate branco.',
        price: 38.00,
        category: 'doce',
        image: 'pizzas/t pizza de chocolate.png',
        featured: false
    }
];

/* ==========================================================================
   Application State
   ========================================================================== */
let cart = [];
let activeCategory = 'all';
let searchQuery = '';
let selectedPizza = null;
let currentSizeMultiplier = 1.0;
let currentSize = 'M';

// Meio a Meio Builder State
let halfLeftPizza = PIZZA_DATA[0];  // Default Pepperoni
let halfRightPizza = PIZZA_DATA[1]; // Default Margherita
let halfActiveEditing = 'left';    // 'left' or 'right'
let halfCurrentSize = 'M';
let halfSizeMultiplier = 1.0;

/* ==========================================================================
   DOM Elements
   ========================================================================== */
const pizzasGrid = document.getElementById('pizzas-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('pizza-search');

// Cart DOM
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountBadge = document.getElementById('cart-count');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartDeliveryEl = document.getElementById('cart-delivery');
const cartTotalEl = document.getElementById('cart-total');
const btnCheckout = document.getElementById('btn-checkout');

// Modal DOM
const pizzaModal = document.getElementById('pizza-modal');
const modalClose = document.getElementById('modal-close');
const modalPizzaImg = document.getElementById('modal-pizza-img');
const modalPizzaCategory = document.getElementById('modal-pizza-category');
const modalPizzaName = document.getElementById('modal-pizza-name');
const modalPizzaDescription = document.getElementById('modal-pizza-description');
const modalPizzaPrice = document.getElementById('modal-pizza-price');
const sizeRadios = document.querySelectorAll('input[name="pizza-size"]');
const btnAddToCart = document.getElementById('btn-add-to-cart');

// Meio a Meio Modal DOM
const halfPizzaModal = document.getElementById('half-pizza-modal');
const halfModalClose = document.getElementById('half-modal-close');
const pizzaHalfLeftTrigger = document.getElementById('pizza-half-left-trigger');
const pizzaHalfRightTrigger = document.getElementById('pizza-half-right-trigger');
const halfPizzaImgLeft = document.getElementById('half-pizza-img-left');
const halfPizzaImgRight = document.getElementById('half-pizza-img-right');
const btnTabLeft = document.getElementById('btn-tab-left');
const btnTabRight = document.getElementById('btn-tab-right');
const summaryLeft = document.getElementById('summary-left');
const summaryRight = document.getElementById('summary-right');
const summaryLeftFlavor = document.getElementById('summary-left-flavor');
const summaryRightFlavor = document.getElementById('summary-right-flavor');
const halfPizzaPrice = document.getElementById('half-pizza-price');
const btnAddHalfToCart = document.getElementById('btn-add-half-to-cart');
const halfSizeRadios = document.querySelectorAll('input[name="half-pizza-size"]');

// Success Modal DOM
const successModal = document.getElementById('success-modal');
const btnSuccessClose = document.getElementById('btn-success-close');

/* ==========================================================================
   Core Functions
   ========================================================================== */

// Cached BRL currency formatter — avoid re-creating on every formatCurrency() call
const _brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Format currency to Brazilian Real format
 * @param {number} value 
 */
function formatCurrency(value) {
    return _brlFormatter.format(value);
}

/**
 * Render pizzas grid based on current search & category filters
 */
function renderPizzas() {
    pizzasGrid.innerHTML = '';
    
    // If the active category is Meio a Meio, render only the promotion builder card
    if (activeCategory === 'meio-a-meio') {
        const promoCard = document.createElement('div');
        promoCard.className = 'pizza-card meio-a-meio-promo';
        promoCard.dataset.action = 'half';
        promoCard.innerHTML = `
            <div class="promo-images">
                <img src="${PIZZA_DATA[0].image}" class="promo-img promo-img-left" alt="">
                <img src="${PIZZA_DATA[1].image}" class="promo-img promo-img-right" alt="">
            </div>
            <h3>Monte sua Meio a Meio</h3>
            <p>Combine dois de seus sabores favoritos em uma única pizza de forma simples e rápida!</p>
            <button class="btn btn-promo">
                Montar Agora <i data-lucide="sparkles"></i>
            </button>
        `;
        pizzasGrid.appendChild(promoCard);
        lucide.createIcons();
        return;
    }
    
    const lowerSearch = searchQuery.toLowerCase();
    const filtered = PIZZA_DATA.filter(pizza => {
        const matchesCategory = activeCategory === 'all' || pizza.category === activeCategory;
        const matchesSearch = pizza.name.toLowerCase().includes(lowerSearch) ||
                              pizza.description.toLowerCase().includes(lowerSearch);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        pizzasGrid.innerHTML = `
            <div class="loading-state">
                <i data-lucide="search-slash" style="width: 48px; height: 48px; color: var(--text-muted);"></i>
                <p>Nenhuma pizza encontrada para "${searchQuery}"</p>
                <span style="font-size: 13px; color: var(--text-muted)">Tente buscar por outros ingredientes ou mude a categoria!</span>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    // Use a DocumentFragment to batch all DOM writes into a single reflow
    const fragment = document.createDocumentFragment();

    // Prepend the promo card if browsing all categories and no search query is active
    if (activeCategory === 'all' && searchQuery === '') {
        const promoCard = document.createElement('div');
        promoCard.className = 'pizza-card meio-a-meio-promo';
        promoCard.dataset.action = 'half';
        promoCard.innerHTML = `
            <div class="promo-images">
                <img src="${PIZZA_DATA[0].image}" class="promo-img promo-img-left" alt="">
                <img src="${PIZZA_DATA[1].image}" class="promo-img promo-img-right" alt="">
            </div>
            <h3>Monte sua Meio a Meio</h3>
            <p>Combine dois de seus sabores favoritos em uma única pizza de forma simples e rápida!</p>
            <button class="btn btn-promo">
                Montar Agora <i data-lucide="sparkles"></i>
            </button>
        `;
        fragment.appendChild(promoCard);
    }

    filtered.forEach(pizza => {
        const card = document.createElement('div');
        card.className = 'pizza-card';
        card.dataset.id = pizza.id; // used by delegated click handler

        card.innerHTML = `
            <div class="card-img-wrapper">
                <span class="card-tag">${pizza.category}</span>
                <img src="${pizza.image}" alt="${pizza.name}" loading="lazy">
            </div>
            <h3>${pizza.name}</h3>
            <p>${pizza.description}</p>
            <div class="card-footer">
                <span class="card-price">${formatCurrency(pizza.price)}</span>
                <button class="btn-add" aria-label="Adicionar ${pizza.name}">
                    <i data-lucide="plus"></i>
                </button>
            </div>
        `;
        
        fragment.appendChild(card);
    });

    // Single DOM write — all cards inserted at once, triggering only one reflow
    pizzasGrid.appendChild(fragment);

    // Re-initialize icons inside dynamic elements
    lucide.createIcons();
}

/**
 * Open Pizza Customization Modal
 * @param {Object} pizza 
 */
function openPizzaModal(pizza) {
    selectedPizza = pizza;
    currentSize = 'M';
    currentSizeMultiplier = 1.0;
    
    // Reset radio selection to 'M' — use cached NodeList, no live DOM query
    sizeRadios.forEach(r => { if (r.value === 'M') r.checked = true; });

    // Update modal contents
    modalPizzaImg.src = pizza.image;
    modalPizzaImg.alt = pizza.name;
    modalPizzaCategory.textContent = pizza.category;
    modalPizzaName.textContent = pizza.name;
    modalPizzaDescription.textContent = pizza.description;
    
    updateModalPrice();
    
    // Open modal
    pizzaModal.classList.add('open');
}

/**
 * Close customization modal
 */
function closePizzaModal() {
    pizzaModal.classList.remove('open');
    selectedPizza = null;
}

/**
 * Update the displayed price in modal based on size multiplier
 */
function updateModalPrice() {
    if (!selectedPizza) return;
    const finalPrice = selectedPizza.price * currentSizeMultiplier;
    modalPizzaPrice.textContent = formatCurrency(finalPrice);
}

/* ==========================================================================
   Shopping Cart Management
   ========================================================================== */

/**
 * Open cart sidebar
 */
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
}

/**
 * Close cart sidebar
 */
function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
}

/**
 * Add selected pizza from modal to the cart array
 */
function addSelectedPizzaToCart() {
    if (!selectedPizza) return;
    
    const finalPrice = selectedPizza.price * currentSizeMultiplier;
    const cartItemId = `${selectedPizza.id}-${currentSize}`;
    
    // Check if same item (same pizza + same size) already exists
    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            cartItemId: cartItemId,
            id: selectedPizza.id,
            name: selectedPizza.name,
            size: currentSize,
            basePrice: selectedPizza.price,
            finalPrice: finalPrice,
            image: selectedPizza.image,
            quantity: 1
        });
    }
    
    // UI flow: close modal, update cart, open cart to show feedback
    closePizzaModal();
    updateCartUI();
    
    // Delay opening cart slightly for a polished animation feel
    setTimeout(() => {
        openCart();
    }, 300);
}

/**
 * Update Cart Badge, Item List and Totals
 */
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    
    let totalItems = 0;
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-state">
                <i data-lucide="shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <span>Adicione uma deliciosa pizza para começar!</span>
            </div>
        `;
        cartCountBadge.textContent = '0';
        cartSubtotalEl.textContent = formatCurrency(0);
        cartDeliveryEl.textContent = formatCurrency(0);
        cartTotalEl.textContent = formatCurrency(0);
        btnCheckout.disabled = true;
        lucide.createIcons();
        return;
    }

    btnCheckout.disabled = false;

    cart.forEach(item => {
        totalItems += item.quantity;
        const itemTotal = item.finalPrice * item.quantity;
        subtotal += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        
        let sizeLabelText = '';
        if (item.size === 'P') sizeLabelText = 'Pequena';
        if (item.size === 'M') sizeLabelText = 'Média';
        if (item.size === 'G') sizeLabelText = 'Grande';

        let thumbnailHtml = `<img class="cart-item-img" src="${item.image}" alt="${item.name}">`;
        let labelDetails = sizeLabelText;

        if (item.isHalfAndHalf) {
            thumbnailHtml = `
                <div class="cart-item-img-split-wrapper">
                    <img class="cart-item-split-img left-half" src="${item.leftImage}" alt="">
                    <img class="cart-item-split-img right-half" src="${item.rightImage}" alt="">
                </div>
            `;
            labelDetails = `${sizeLabelText} <br> <span style="font-size: 10px; color: var(--text-muted)">Esq: ${item.leftName.split(' ')[0]} / Dir: ${item.rightName.split(' ')[0]}</span>`;
        }

        cartItemEl.innerHTML = `
            ${thumbnailHtml}
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-size">${labelDetails}</span>
                <div class="cart-item-price">${formatCurrency(item.finalPrice)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="btn-remove" aria-label="Remover item" onclick="removeCartItem('${item.cartItemId}')">
                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                </button>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQty('${item.cartItemId}', -1)">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty('${item.cartItemId}', 1)">+</button>
                </div>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemEl);
    });

    const deliveryFee = 7.00;
    const total = subtotal + deliveryFee;

    // Update Totals
    cartCountBadge.textContent = totalItems.toString();
    cartSubtotalEl.textContent = formatCurrency(subtotal);
    cartDeliveryEl.textContent = formatCurrency(deliveryFee);
    cartTotalEl.textContent = formatCurrency(total);

    lucide.createIcons();
}

/**
 * Update quantity of a cart item
 * @param {string} cartItemId 
 * @param {number} change 
 */
window.updateQty = function(cartItemId, change) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeCartItem(cartItemId);
    } else {
        updateCartUI();
    }
};

/**
 * Remove an item from the cart
 * @param {string} cartItemId 
 */
window.removeCartItem = function(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    updateCartUI();
};

/* ==========================================================================
   Meio a Meio Builder Core Functions
   ========================================================================== */

/**
 * Open Meio a Meio Customization Modal
 */
function openHalfPizzaModal() {
    // Reset state
    halfLeftPizza = PIZZA_DATA[0];  // Pepperoni
    halfRightPizza = PIZZA_DATA[1]; // Margherita
    halfActiveEditing = 'left';
    halfCurrentSize = 'M';
    halfSizeMultiplier = 1.0;
    
    // Reset size radio buttons
    document.querySelector('input[name="half-pizza-size"][value="M"]').checked = true;
    
    // Update Modal UI
    updateHalfPizzaModalUI();
    
    // Open modal
    halfPizzaModal.classList.add('open');
}

/**
 * Close Meio a Meio Modal
 */
function closeHalfPizzaModal() {
    halfPizzaModal.classList.remove('open');
}

/**
 * Get active flavor based on left or right half focus
 */
function getCurrentSelectedFlavorForActiveSide() {
    return halfActiveEditing === 'left' ? halfLeftPizza : halfRightPizza;
}

/**
 * Choose a flavor for the focused side
 * @param {Object} pizza 
 */
function selectHalfFlavor(pizza) {
    let sideImg = null;
    if (halfActiveEditing === 'left') {
        halfLeftPizza = pizza;
        sideImg = halfPizzaImgLeft;
    } else {
        halfRightPizza = pizza;
        sideImg = halfPizzaImgRight;
    }
    
    // Dynamic smooth transition for the updated half image
    sideImg.classList.remove('animate-change');
    void sideImg.offsetWidth; // Trigger reflow to restart CSS animation
    sideImg.classList.add('animate-change');
    
    // Update UI elements
    updateHalfPizzaModalUI();
}

/**
 * Update Meio a Meio modal elements (images, details, focus highlights, price)
 */
function updateHalfPizzaModalUI() {
    // Update images
    halfPizzaImgLeft.src = halfLeftPizza.image;
    halfPizzaImgLeft.alt = halfLeftPizza.name;
    halfPizzaImgRight.src = halfRightPizza.image;
    halfPizzaImgRight.alt = halfRightPizza.name;
    
    // Update summaries
    summaryLeftFlavor.textContent = halfLeftPizza.name;
    document.getElementById('summary-left-ingredients').textContent = halfLeftPizza.description;
    summaryRightFlavor.textContent = halfRightPizza.name;
    document.getElementById('summary-right-ingredients').textContent = halfRightPizza.description;
    
    // Set active side highlights
    if (halfActiveEditing === 'left') {
        pizzaHalfLeftTrigger.classList.add('active');
        pizzaHalfRightTrigger.classList.remove('active');
        btnTabLeft.classList.add('active');
        btnTabRight.classList.remove('active');
        summaryLeft.classList.add('active');
        summaryRight.classList.remove('active');
    } else {
        pizzaHalfLeftTrigger.classList.remove('active');
        pizzaHalfRightTrigger.classList.add('active');
        btnTabLeft.classList.remove('active');
        btnTabRight.classList.add('active');
        summaryLeft.classList.remove('active');
        summaryRight.classList.add('active');
    }
    
    // Pricing calculation (Brazilian standard: Max value of the two halves)
    const priceLeft = halfLeftPizza.price;
    const priceRight = halfRightPizza.price;
    const basePrice = Math.max(priceLeft, priceRight);
    const finalPrice = basePrice * halfSizeMultiplier;
    
    halfPizzaPrice.textContent = formatCurrency(finalPrice);
}

/**
 * Toggle focused half side
 * @param {string} side 
 */
function setHalfActiveEditing(side) {
    halfActiveEditing = side;
    updateHalfPizzaModalUI();
}

/**
 * Add custom Meio a Meio pizza to shopping cart
 */
function addHalfPizzaToCart() {
    const priceLeft = halfLeftPizza.price;
    const priceRight = halfRightPizza.price;
    const basePrice = Math.max(priceLeft, priceRight);
    const finalPrice = basePrice * halfSizeMultiplier;
    
    const cartItemId = `half-${halfLeftPizza.id}-${halfRightPizza.id}-${halfCurrentSize}`;
    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            cartItemId: cartItemId,
            id: `half-${halfLeftPizza.id}-${halfRightPizza.id}`,
            name: `Meio a Meio: ${halfLeftPizza.name.split(' ')[0]} / ${halfRightPizza.name.split(' ')[0]}`,
            size: halfCurrentSize,
            basePrice: basePrice,
            finalPrice: finalPrice,
            isHalfAndHalf: true,
            leftImage: halfLeftPizza.image,
            rightImage: halfRightPizza.image,
            leftName: halfLeftPizza.name,
            rightName: halfRightPizza.name,
            quantity: 1
        });
    }
    
    closeHalfPizzaModal();
    updateCartUI();
    
    setTimeout(() => {
        openCart();
    }, 300);
}

/* ==========================================================================
   Event Listeners
   ========================================================================== */

// Filters Event Listeners
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        renderPizzas();
    });
});

// Single delegated click handler for the entire pizza grid
// Handles both regular pizza cards (data-id) and the meio-a-meio promo (data-action=half)
pizzasGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.pizza-card');
    if (!card) return;

    if (card.dataset.action === 'half') {
        openHalfPizzaModal();
        return;
    }

    if (card.dataset.id) {
        const pizza = PIZZA_DATA.find(p => p.id === card.dataset.id);
        if (pizza) openPizzaModal(pizza);
    }
});

// Search input — debounced to avoid rebuilding DOM on every keypress
let _searchDebounceTimer = null;
searchInput.addEventListener('input', (e) => {
    clearTimeout(_searchDebounceTimer);
    _searchDebounceTimer = setTimeout(() => {
        searchQuery = e.target.value;
        renderPizzas();
    }, 180);
});

// Cart sidebar togglers
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Modal listeners
modalClose.addEventListener('click', closePizzaModal);
pizzaModal.addEventListener('click', (e) => {
    if (e.target === pizzaModal) closePizzaModal();
});

// Size options logic
sizeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentSize = e.target.value;
        currentSizeMultiplier = parseFloat(e.target.dataset.multiplier);
        updateModalPrice();
    });
});

// Add to cart click
btnAddToCart.addEventListener('click', addSelectedPizzaToCart);

// Wheel and Touch swipe event controller for scroll-to-change flavor (Dodo Pizza Style)
let lastWheelTime = 0;
const wheelCooldown = 150; // ms between steps to keep it fast and responsive

function handleHalfPizzaWheel(e) {
    e.preventDefault(); // Lock main page/modal body scroll
    
    const now = Date.now();
    if (now - lastWheelTime < wheelCooldown) return;
    lastWheelTime = now;
    
    const activePizza = getCurrentSelectedFlavorForActiveSide();
    let index = PIZZA_DATA.findIndex(p => p.id === activePizza.id);
    
    if (e.deltaY > 0) {
        // Scroll Down -> Next flavor
        index = (index + 1) % PIZZA_DATA.length;
    } else if (e.deltaY < 0) {
        // Scroll Up -> Previous flavor
        index = (index - 1 + PIZZA_DATA.length) % PIZZA_DATA.length;
    }
    
    selectHalfFlavor(PIZZA_DATA[index]);
}

// Bind wheel scroll and touch swipe listeners on the pizza preview container
const halfPizzaVisualContainer = document.querySelector('.half-pizza-visual-container');
if (halfPizzaVisualContainer) {
    halfPizzaVisualContainer.addEventListener('wheel', handleHalfPizzaWheel, { passive: false });

    // Mobile Touch Swipe support on the pizza container
    let touchStartY = 0;
    halfPizzaVisualContainer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    halfPizzaVisualContainer.addEventListener('touchmove', (e) => {
        const touchEndY = e.touches[0].clientY;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffY) > 35) {
            e.preventDefault();
            const activePizza = getCurrentSelectedFlavorForActiveSide();
            let index = PIZZA_DATA.findIndex(p => p.id === activePizza.id);
            
            if (diffY > 0) {
                index = (index + 1) % PIZZA_DATA.length;
            } else {
                index = (index - 1 + PIZZA_DATA.length) % PIZZA_DATA.length;
            }
            
            selectHalfFlavor(PIZZA_DATA[index]);
            touchStartY = touchEndY; // reset for continuous smooth swiping
        }
    }, { passive: false });
}

// Meio a Meio Modal Listeners
halfModalClose.addEventListener('click', closeHalfPizzaModal);
halfPizzaModal.addEventListener('click', (e) => {
    if (e.target === halfPizzaModal) closeHalfPizzaModal();
});

// Helper to cycle flavors on click
function cycleHalfFlavor(side) {
    const currentPizza = side === 'left' ? halfLeftPizza : halfRightPizza;
    let index = PIZZA_DATA.findIndex(p => p.id === currentPizza.id);
    index = (index + 1) % PIZZA_DATA.length;
    selectHalfFlavor(PIZZA_DATA[index]);
}

// Direct interactive half image clicks
pizzaHalfLeftTrigger.addEventListener('click', () => {
    if (halfActiveEditing === 'left') {
        cycleHalfFlavor('left');
    } else {
        setHalfActiveEditing('left');
    }
});
pizzaHalfRightTrigger.addEventListener('click', () => {
    if (halfActiveEditing === 'right') {
        cycleHalfFlavor('right');
    } else {
        setHalfActiveEditing('right');
    }
});

// Toggle tabs click
btnTabLeft.addEventListener('click', () => setHalfActiveEditing('left'));
btnTabRight.addEventListener('click', () => setHalfActiveEditing('right'));

// Meio a Meio Size Options
halfSizeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        halfCurrentSize = e.target.value;
        halfSizeMultiplier = parseFloat(e.target.dataset.multiplier);
        updateHalfPizzaModalUI();
    });
});

// Add Meio a Meio to cart click
btnAddHalfToCart.addEventListener('click', addHalfPizzaToCart);

// Checkout flow
btnCheckout.addEventListener('click', () => {
    // Simulated checkout: Close cart, show checkout success modal
    closeCart();
    
    setTimeout(() => {
        successModal.classList.add('open');
        // Clear Cart
        cart = [];
        updateCartUI();
    }, 400);
});

// Close success modal
btnSuccessClose.addEventListener('click', () => {
    successModal.classList.remove('open');
});
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('open');
    }
});

/* ==========================================================================
   Application Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderPizzas();
    updateCartUI();
});
