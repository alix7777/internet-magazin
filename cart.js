const CART_KEY = 'cart';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateHeaderCounter();
}

function updateHeaderCounter() {
  const cntEl = document.getElementById('cart-product-counter');
  if (!cntEl) return;
  const cart = readCart();
  const total = cart.reduce((s, it) => s + (it.qty || 0), 0);
  cntEl.textContent = total;
}

// Удобная функция для добавления товара (можно вызывать из каталога)
// item должен содержать id, name, price, image (опционально)
function addToCart(item, qty = 1) {
  if (!item || typeof item.id === 'undefined') return;
  const cart = readCart();
  const idx = cart.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 0) + qty;
  } else {
    cart.push({ ...item, qty });
  }
  writeCart(cart);
}

function removeFromCart(id) {
  const cart = readCart().filter(i => i.id !== id);
  writeCart(cart);
  renderCart();
}

function updateQty(id, qty) {
  if (qty < 1) return;
  const cart = readCart().map(i => i.id === id ? { ...i, qty } : i);
  writeCart(cart);
  renderCart();
}

function clearCart() {
  writeCart([]);
  renderCart();
}

function subtotal(cart) {
  return cart.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0);
}

function formatPrice(n) {
  return n.toFixed(2);
}

function renderCart() {
  const cart = readCart();
  const emptyEl = document.getElementById('cart-empty');
  const container = document.getElementById('cart-container');
  const list = document.getElementById('cart-list');
  const subtotalEl = document.getElementById('cart-subtotal');

  if (!list || !emptyEl || !container || !subtotalEl) return;

  if (cart.length === 0) {
    list.innerHTML = '';
    container.style.display = 'none';
    emptyEl.style.display = '';
    subtotalEl.textContent = '0.00';
    return;
  }

  emptyEl.style.display = 'none';
  container.style.display = '';

  list.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="ci-left">
        <img src="${item.image || './logo.png'}" alt="${item.name}" width="80" />
      </div>
      <div class="ci-right">
        <div class="ci-title">${item.name}</div>
        <div>Цена: ${formatPrice(item.price)} ₽</div>
        <div>
          Количество:
          <button class="qty-minus" data-id="${item.id}">-</button>
          <span class="qty" data-id="${item.id}">${item.qty}</span>
          <button class="qty-plus" data-id="${item.id}">+</button>
        </div>
        <div>Сумма: ${(item.price * item.qty).toFixed(2)} ₽</div>
        <div><button class="remove-item" data-id="${item.id}">Удалить</button></div>
      </div>
    `;
    list.appendChild(li);
  });

  subtotalEl.textContent = formatPrice(subtotal(cart));

  // делегирование событий
  list.querySelectorAll('.qty-plus').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const it = cart.find(i => String(i.id) === String(id));
      if (it) updateQty(it.id, (it.qty || 0) + 1);
    };
  });
  list.querySelectorAll('.qty-minus').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const it = cart.find(i => String(i.id) === String(id));
      if (it && it.qty > 1) updateQty(it.id, it.qty - 1);
    };
  });
  list.querySelectorAll('.remove-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      removeFromCart(id);
    };
  });
}

// Инициализация страницы корзины
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderCounter();
  renderCart();

  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) clearBtn.onclick = () => {
    if (confirm('Очистить корзину?')) clearCart();
  };

  const checkoutBtn = document.getElementById('checkout');
  if (checkoutBtn) checkoutBtn.onclick = () => {
    alert('Оформление заказа (заглушка). Здесь можно перенаправить на форму оформления.');
  };
});
