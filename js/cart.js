/**
 * KEEPERZONE — Savat va To'liq Summa Boshqaruv Tizimi (Shopping Cart & Total Price)
 */

(function () {
  'use strict';

  // Savat kaliti (localStorage)
  const STORAGE_KEY = 'keeperzone_cart_items_v1';

  // Savat holati
  let cart = [];

  // LocalStorage dan ma'lumotlarni o'qish
  function loadCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      cart = data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Savat ma'lumotlarini yuklashda xatolik:", e);
      cart = [];
    }
  }

  // LocalStorage ga yozish
  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Savat ma'lumotlarini saqlashda xatolik:", e);
    }
  }

  // Narxni chiroyli formatlash (masalan: 1 290 000 so'm)
  function formatMoney(amount) {
    if (isNaN(amount)) return "0 so'm";
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
  }

  // Jami summani hisoblash
  function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Jami mahsulotlar soni
  function calculateCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Savatga mahsulot qo'shish
  function addToCart(product) {
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += (product.quantity || 1);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        brand: product.brand || 'Original',
        quantity: product.quantity || 1
      });
    }

    saveCart();
    renderAll();
    showToast(`"${product.name}" savatga qo'shildi!`);
    animateBadge();
  }

  // Mahsulot sonini o'zgartirish
  function changeQuantity(id, delta) {
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;

    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
      showToast("Mahsulot savatdan olib tashlandi");
    }

    saveCart();
    renderAll();
  }

  // Mahsulotni savatdan butunlay o'chirish
  function removeFromCart(id) {
    const item = cart.find(i => i.id === id);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderAll();
    if (item) {
      showToast(`"${item.name}" savatdan o'chirildi`);
    }
  }

  // Savatni tozalash
  function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Haqiqatan ham savatni tozalashni xohlaysizmi?")) {
      cart = [];
      saveCart();
      renderAll();
      showToast("Savat tozalandi");
    }
  }

  // Toast bildirishnomasi
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">✓</div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Badge sakrash animatsiyasi
  function animateBadge() {
    const badges = document.querySelectorAll('.cart-badge, .floating-cart-badge');
    badges.forEach(b => {
      b.classList.add('bump');
      setTimeout(() => b.classList.remove('bump'), 250);
    });
  }

  // Savat panelini ochish/yopish
  function openCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // UI - barcha joylarni yangilash
  function renderAll() {
    const total = calculateTotal();
    const count = calculateCount();
    const formattedTotal = formatMoney(total);

    // 1. Header / Navbar
    const navBadge = document.getElementById('cart-badge');
    if (navBadge) navBadge.textContent = count;

    const navTotal = document.getElementById('nav-cart-total');
    if (navTotal) navTotal.textContent = formattedTotal;

    // 2. Floating Cart Button
    const floatBtn = document.getElementById('floatingCartBtn');
    const floatBadge = document.getElementById('floating-cart-badge');
    const floatTotal = document.getElementById('floating-cart-total');

    if (floatBadge) floatBadge.textContent = count;
    if (floatTotal) floatTotal.textContent = formattedTotal;
    if (floatBtn) {
      floatBtn.style.display = count > 0 ? 'flex' : 'flex';
    }

    // 3. Savat Paneli (Drawer)
    const cartCountTitle = document.getElementById('cart-count-title');
    if (cartCountTitle) {
      cartCountTitle.textContent = `${count} ta mahsulot`;
    }

    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartFooter = document.getElementById('cart-drawer-footer');
    const cartSubtotalEl = document.getElementById('cart-drawer-subtotal');
    const cartTotalAmountEl = document.getElementById('cart-drawer-total-amount');

    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="cart-empty">
            <div class="cart-empty-icon">🛒</div>
            <h4 class="cart-empty-title">Savatingiz hozircha bo'sh</h4>
            <p class="cart-empty-desc">
              Katalogimizdan o'zingizga ma'qul professional darvozabon qo'lqopini tanlang va savatga qo'shing.
            </p>
            <a href="#katalog" class="cart-empty-btn" id="empty-catalog-btn">Katalogga o'tish →</a>
          </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
      } else {
        if (cartFooter) cartFooter.style.display = 'block';

        let html = '';
        cart.forEach(item => {
          const itemSubtotal = item.price * item.quantity;
          html += `
            <div class="cart-item" data-id="${item.id}">
              <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="cart-item-info">
                <div class="cart-item-header">
                  <div>
                    <span class="cart-item-brand">${item.brand}</span>
                    <h5 class="cart-item-name">${item.name}</h5>
                  </div>
                  <button type="button" class="cart-item-delete" title="O'chirish" data-remove="${item.id}">✕</button>
                </div>
                <div class="cart-item-footer">
                  <div class="cart-item-qty">
                    <button type="button" class="qty-btn" data-decrease="${item.id}">−</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button type="button" class="qty-btn" data-increase="${item.id}">+</button>
                  </div>
                  <div class="cart-item-price-col">
                    <div class="cart-item-unit-price">${formatMoney(item.price)} × ${item.quantity}</div>
                    <div class="cart-item-subtotal">${formatMoney(itemSubtotal)}</div>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
        cartItemsContainer.innerHTML = html;

        if (cartSubtotalEl) cartSubtotalEl.textContent = formattedTotal;
        if (cartTotalAmountEl) cartTotalAmountEl.textContent = formattedTotal;
      }
    }

    // 4. Buyurtma bo'limidagi buyurtma sarhisobi va to'liq summa bloki
    renderOrderSummary(total, count, formattedTotal);
    updateOrderFormWithCart(total, count, formattedTotal);
  }

  // Buyurtma formasi select maydonini savat tovarlari bilan integratsiya qilish
  function updateOrderFormWithCart(total, count, formattedTotal) {
    const orderForm = document.querySelector('.order-form-grid');
    if (!orderForm) return;

    const modelSelect = orderForm.querySelector('select');
    if (!modelSelect) return;

    let cartOption = modelSelect.querySelector('#cart-all-option');
    if (cart.length > 0) {
      if (!cartOption) {
        cartOption = document.createElement('option');
        cartOption.id = 'cart-all-option';
        modelSelect.insertBefore(cartOption, modelSelect.firstChild);
      }
      const summaryText = cart.map(i => `${i.name} (${i.quantity} ta)`).join(', ');
      cartOption.value = `Savatdagi mahsulotlar: ${summaryText} | JAMI: ${formattedTotal}`;
      cartOption.textContent = `🛒 Savatdagi buyurtmalar (${count} ta) — JAMI: ${formattedTotal}`;
      cartOption.selected = true;
    } else if (cartOption) {
      cartOption.remove();
    }
  }

  // Buyurtma formasi qismidagi to'liq summani aks ettirish
  function renderOrderSummary(total, count, formattedTotal) {
    const summaryContainer = document.getElementById('order-cart-summary-box');
    if (!summaryContainer) return;

    if (cart.length === 0) {
      summaryContainer.innerHTML = `
        <div class="order-cart-summary-header">
          <span class="order-cart-summary-title">🛒 Savatdagi Mahsulotlar</span>
          <span style="font-size: 11px; color: var(--text-dim);">Savat bo'sh</span>
        </div>
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
          Hozircha savatga hech narsa qo'shilmadi. Katalogdan mahsulotlarni <strong>"Savatga"</strong> tugmasi orqali tanlashingiz yoki pastdagi ro'yxatdan bitta modelni belgilashingiz mumkin.
        </p>
      `;
      return;
    }

    let itemsHtml = '';
    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      itemsHtml += `
        <div class="order-cart-mini-item">
          <div class="order-cart-mini-name">
            <span class="order-cart-mini-qty">${item.quantity} dona</span>
            <span>${item.name}</span>
          </div>
          <div class="order-cart-mini-price">${formatMoney(itemSubtotal)}</div>
        </div>
      `;
    });

    summaryContainer.innerHTML = `
      <div class="order-cart-summary-header">
        <span class="order-cart-summary-title">🛒 Tanlangan Mahsulotlar Ro'yxati</span>
        <button type="button" class="btn-clear-cart" id="order-open-cart-btn" style="color: var(--brand-green);">Savatni ko'rish / Tahrirlash</button>
      </div>

      <div class="order-cart-items-preview">
        ${itemsHtml}
      </div>

      <div class="order-total-banner">
        <div class="order-total-text">
          <div>TO'LIQ TO'LOV SUMMASI:</div>
          <small style="color: var(--text-muted); font-size: 10px; font-weight: normal;">Yetkazib berish bepul • Barcha tovarlar bilan</small>
        </div>
        <div class="order-total-value">${formattedTotal}</div>
      </div>
    `;

    const openCartLink = document.getElementById('order-open-cart-btn');
    if (openCartLink) {
      openCartLink.addEventListener('click', openCartDrawer);
    }
  }

  // Dastlabki ishga tushirish va hodisalarni bog'lash
  document.addEventListener('DOMContentLoaded', function () {
    loadCart();

    // 1. Drawer HTML tuzilmasini sahifaga qo'shish (agar mavjud bo'lmasa)
    if (!document.getElementById('cartDrawerOverlay')) {
      const drawerMarkup = `
        <div id="cartDrawerOverlay" class="cart-drawer-overlay">
          <div class="cart-drawer">
            <!-- Header -->
            <div class="cart-header">
              <div class="cart-header-title">
                <span>🛒 Savat</span>
                <span class="cart-title-badge" id="cart-count-title">0 ta mahsulot</span>
              </div>
              <button type="button" class="cart-close-btn" id="closeCartBtn" aria-label="Yopish">&times;</button>
            </div>

            <!-- Body: Items List -->
            <div class="cart-body" id="cart-items-container">
              <!-- Dinamik to'ldiriladi -->
            </div>

            <!-- Footer: TO'LIQ SUMMA KO'RSATADIGAN JOY -->
            <div class="cart-footer" id="cart-drawer-footer" style="display: none;">
              <div class="cart-summary-table">
                <div class="cart-summary-row">
                  <span>Oraliq summa:</span>
                  <span id="cart-drawer-subtotal">0 so'm</span>
                </div>
                <div class="cart-summary-row">
                  <span>Yetkazib berish (O'zbekiston):</span>
                  <span class="free-delivery-badge">BEPUL</span>
                </div>
              </div>

              <!-- ASOSIY TO'LIQ SUMMA BLOKI -->
              <div class="cart-total-box">
                <div class="cart-total-row">
                  <div class="cart-total-label">
                    <span>TO'LIQ SUMMA:</span>
                    <small>Barcha chegirmalar bilan</small>
                  </div>
                  <div class="cart-total-amount" id="cart-drawer-total-amount">0 so'm</div>
                </div>
              </div>

              <div class="cart-actions-group">
                <button type="button" class="btn-checkout" id="checkoutBtn">
                  <span>Buyurtmani Rasmiylashtirish</span> →
                </button>
                <button type="button" class="btn-clear-cart" id="clearCartBtn">
                  Savatni butunlay tozalash
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Cart Tugmasi (Pastki o'ng suzuvchi tugma) -->
        <button type="button" class="floating-cart-btn" id="floatingCartBtn" aria-label="Savatni ko'rish">
          <span>🛒</span>
          <span class="floating-cart-badge" id="floating-cart-badge">0</span>
          <span class="floating-cart-total" id="floating-cart-total">0 so'm</span>
        </button>
      `;

      document.body.insertAdjacentHTML('beforeend', drawerMarkup);
    }

    // 2. Hodisalar: Savatni ochish/yopish
    const openCartBtn = document.getElementById('open-cart-btn');
    if (openCartBtn) {
      openCartBtn.addEventListener('click', openCartDrawer);
    }

    const floatingCartBtn = document.getElementById('floatingCartBtn');
    if (floatingCartBtn) {
      floatingCartBtn.addEventListener('click', openCartDrawer);
    }

    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', closeCartDrawer);
    }

    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    if (cartDrawerOverlay) {
      cartDrawerOverlay.addEventListener('click', function (e) {
        if (e.target === cartDrawerOverlay) {
          closeCartDrawer();
        }
      });
    }

    // Savat bo'sh bo'lganda katalogga o'tish tugmasi
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'empty-catalog-btn') {
        closeCartDrawer();
      }
    });

    // Savatni tozalash tugmasi
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearCart);
    }

    // Buyurtmani rasmiylashtirish tugmasi
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        closeCartDrawer();
        const orderSection = document.getElementById('buyurtma');
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // 3. Savat ichidagi tugmalar (+, -, o'chirish)
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
      cartItemsContainer.addEventListener('click', function (e) {
        const incBtn = e.target.closest('[data-increase]');
        if (incBtn) {
          changeQuantity(incBtn.dataset.increase, 1);
          return;
        }

        const decBtn = e.target.closest('[data-decrease]');
        if (decBtn) {
          changeQuantity(decBtn.dataset.decrease, -1);
          return;
        }

        const delBtn = e.target.closest('[data-remove]');
        if (delBtn) {
          removeFromCart(delBtn.dataset.remove);
          return;
        }
      });
    }

    // 4. Katalogdagi "Savatga" tugmalarini bosish
    document.addEventListener('click', function (e) {
      const addBtn = e.target.closest('.btn-add-cart, .btn-modal-cart');
      if (addBtn) {
        e.preventDefault();
        const id = addBtn.getAttribute('data-id');
        const name = addBtn.getAttribute('data-name');
        const price = Number(addBtn.getAttribute('data-price'));
        const image = addBtn.getAttribute('data-image');
        const brand = addBtn.getAttribute('data-brand') || 'Pro';

        if (id && name && price) {
          addToCart({ id, name, price, image, brand });

          // Animatsiya tugmada
          const originalText = addBtn.innerHTML;
          addBtn.classList.add('added');
          addBtn.innerHTML = '<span>✓ Qo\'shildi</span>';
          setTimeout(() => {
            addBtn.classList.remove('added');
            addBtn.innerHTML = originalText;
          }, 1200);
        }
      }
    });

    // 5. Buyurtma formasini yuborish hodisasini boshqarish
    const orderForm = document.querySelector('.order-form-grid');
    if (orderForm) {
      orderForm.addEventListener('submit', function (e) {
        // Savatda mahsulot bo'lsa, muvaffaqiyat modalini boyitamiz
        const successModal = document.getElementById('modal-buyurtma-muvaffaqiyat');
        if (successModal) {
          const successCard = successModal.querySelector('.modal-card');
          if (successCard) {
            const total = calculateTotal();
            const count = calculateCount();
            
            let detailsHtml = '';
            if (cart.length > 0) {
              detailsHtml = `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 14px; margin: 15px 0; text-align: left;">
                  <div style="font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 8px;">Buyurtma tarkibi (${count} ta mahsulot):</div>
                  <div style="max-height: 120px; overflow-y: auto; font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">
                    ${cart.map(i => `<div>• ${i.name} — ${i.quantity} ta × ${formatMoney(i.price)}</div>`).join('')}
                  </div>
                  <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 8px; display: flex; justify-content: space-between; font-weight: 900; color: #10b981; font-size: 15px;">
                    <span>TO'LIQ SUMMA:</span>
                    <span>${formatMoney(total)}</span>
                  </div>
                </div>
              `;
            }

            const existingDetails = successCard.querySelector('.order-success-details');
            if (existingDetails) {
              existingDetails.innerHTML = detailsHtml;
            } else {
              const p = successCard.querySelector('p');
              if (p) {
                const wrapper = document.createElement('div');
                wrapper.className = 'order-success-details';
                wrapper.innerHTML = detailsHtml;
                p.insertAdjacentElement('afterend', wrapper);
              }
            }
          }
        }
      });
    }

    // Sahifa yuklanganda render
    renderAll();
  });

  // Tashqi global interfeys
  window.KeeperCart = {
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    openCartDrawer,
    closeCartDrawer,
    calculateTotal,
    getCart: () => cart
  };
})();
