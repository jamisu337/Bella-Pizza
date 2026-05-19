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

// Success Modal DOM
const successModal = document.getElementById('success-modal');
const btnSuccessClose = document.getElementById('btn-success-close');

/* ==========================================================================
   Core Functions
   ========================================================================== */

/**
 * Format currency to Brazilian Real format
 * @param {number} value 
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Render pizzas grid based on current search & category filters
 */
function renderPizzas() {
    pizzasGrid.innerHTML = '';
    
    const filtered = PIZZA_DATA.filter(pizza => {
        const matchesCategory = activeCategory === 'all' || pizza.category === activeCategory;
        const matchesSearch = pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              pizza.description.toLowerCase().includes(searchQuery.toLowerCase());
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

    filtered.forEach(pizza => {
        const card = document.createElement('div');
        card.className = 'pizza-card';
        
        // Add action listener to open modal
        card.addEventListener('click', (e) => {
            // Prevent opening modal if clicking inside btn-add if we decide to change behavior,
            // but clicking anywhere on the card is the main action to customize.
            openPizzaModal(pizza);
        });

        card.innerHTML = `
            <div class="card-img-wrapper">
                <span class="card-tag">${pizza.category}</span>
                <img src="${pizza.image}" alt="${pizza.name}">
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
        
        pizzasGrid.appendChild(card);
    });

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
    
    // Reset radio selection to 'M'
    document.querySelector('input[name="pizza-size"][value="M"]').checked = true;

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

        cartItemEl.innerHTML = `
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-size">${sizeLabelText}</span>
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

// Search input
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPizzas();
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
