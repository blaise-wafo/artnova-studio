/* ================================================
   ArtNova Studio — script principal
   ================================================ */
(function () {
  "use strict";

  const WHATSAPP_NUMBER = "237699340487"; // format international sans +

  const money = (n) => n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
  const imgPath = (file) => "images/" + file;

  /* ---------------- Panier (localStorage) ---------------- */
  const CART_KEY = "artnova_cart";
  const loadCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch (e) { return {}; }
  };
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  let cart = loadCart();

  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
    renderCart();
    updateCartBadge();
    showToast("Ajouté à votre sélection");
  }
  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart(cart);
    renderCart();
    updateCartBadge();
  }
  function removeFromCart(id) {
    delete cart[id];
    saveCart(cart);
    renderCart();
    updateCartBadge();
  }
  function cartCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }
  function cartTotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = CATALOGUE.find((p) => p.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }
  function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    const count = cartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }

  /* ---------------- Rendu des cartes ---------------- */
  function cardTemplate(item) {
    const badge = item.bestseller
      ? `<span class="badge">Coup de cœur</span>`
      : "";
    return `
      <article class="card" data-id="${item.id}">
        ${badge}
        <div class="card-img" data-action="open-modal" data-id="${item.id}">
          <img src="${imgPath(item.file)}" alt="Tableau ${item.title}" loading="lazy">
          <div class="card-quick">
            <button type="button" data-action="add-cart" data-id="${item.id}" aria-label="Ajouter à la sélection" title="Ajouter à la sélection">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <button type="button" data-action="whatsapp-item" data-id="${item.id}" aria-label="Commander sur WhatsApp" title="Commander sur WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5C10.1 9 9.6 7.8 9.4 7.3c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"/><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.9 14.2c-.3.9-1.7 1.7-2.5 1.8-.7.1-1.4.2-4.5-1-3.7-1.6-6.1-5.3-6.3-5.6-.2-.3-1.5-2-1.5-3.7 0-1.8.9-2.6 1.3-2.9.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .7.6.3.7.9 2.4 1 2.6.1.2.1.4 0 .6-.1.2-.2.4-.3.5l-.5.6c-.2.2-.3.4-.1.7.2.3.9 1.5 1.9 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.7.8 2 .9.3.1.5.2.6.3.1.2.1.9-.2 1.8z"/></svg>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="card-cat">${CATEGORY_LABELS[item.category]}</div>
          <h3 class="card-title">${item.title}</h3>
          <div class="card-foot">
            <div class="card-price">${money(item.price)}</div>
            <button class="btn btn-outline btn-sm" data-action="add-cart" data-id="${item.id}">+ Ajouter</button>
          </div>
        </div>
      </article>`;
  }

  function renderBestsellers() {
    const row = document.getElementById("bestRow");
    row.innerHTML = CATALOGUE.filter((p) => p.bestseller).map(cardTemplate).join("");
  }

  let activeFilter = "tous";
  function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    const items = activeFilter === "tous"
      ? CATALOGUE
      : CATALOGUE.filter((p) => p.category === activeFilter);
    grid.innerHTML = items.length
      ? items.map(cardTemplate).join("")
      : `<div class="grid-empty">Aucun tableau dans cette catégorie pour le moment.</div>`;
  }

  function renderCart() {
    const body = document.getElementById("drawerBody");
    const entries = Object.entries(cart);
    if (!entries.length) {
      body.innerHTML = `<div class="drawer-empty">Votre sélection est vide.<br>Parcourez la galerie et ajoutez vos tableaux préférés.</div>`;
    } else {
      body.innerHTML = entries.map(([id, qty]) => {
        const item = CATALOGUE.find((p) => p.id === id);
        if (!item) return "";
        return `
          <div class="drawer-item">
            <img src="${imgPath(item.file)}" alt="${item.title}">
            <div class="drawer-item-info">
              <div class="t">${item.title}</div>
              <div class="p">${money(item.price)}</div>
              <div class="drawer-item-actions">
                <button class="qty-btn" data-action="qty-minus" data-id="${id}">−</button>
                <span>${qty}</span>
                <button class="qty-btn" data-action="qty-plus" data-id="${id}">+</button>
                <a href="#" class="remove" data-action="remove-item" data-id="${id}">retirer</a>
              </div>
            </div>
          </div>`;
      }).join("");
    }
    document.getElementById("drawerTotal").textContent = money(cartTotal());
  }

  /* ---------------- WhatsApp ---------------- */
  function waLink(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }
  function orderSingleItem(id) {
    const item = CATALOGUE.find((p) => p.id === id);
    if (!item) return;
    const msg = `Bonjour ArtNova Studio 🎨, je suis intéressé(e) par le tableau "${item.title}" (Réf. ${item.id}) à ${money(item.price)}. Est-il disponible ?`;
    window.open(waLink(msg), "_blank");
  }
  function orderCart() {
    const entries = Object.entries(cart);
    if (!entries.length) {
      showToast("Ajoutez d'abord un tableau à votre sélection");
      return;
    }
    let lines = [`Bonjour ArtNova Studio 🎨, je souhaite commander :`];
    entries.forEach(([id, qty]) => {
      const item = CATALOGUE.find((p) => p.id === id);
      if (item) lines.push(`• ${item.title} (Réf. ${item.id}) x${qty} — ${money(item.price * qty)}`);
    });
    lines.push(`\nTotal : ${money(cartTotal())}`);
    lines.push(`\nMerci de me confirmer la disponibilité et les modalités de livraison.`);
    window.open(waLink(lines.join("\n")), "_blank");
  }
  function generalContact() {
    const msg = `Bonjour ArtNova Studio 🎨, j'aimerais avoir plus d'informations sur vos tableaux.`;
    window.open(waLink(msg), "_blank");
  }

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function showToast(text) {
    const toast = document.getElementById("toast");
    toast.querySelector("span").textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ---------------- Modal ---------------- */
  function openModal(id) {
    const item = CATALOGUE.find((p) => p.id === id);
    if (!item) return;
    document.getElementById("modalImg").src = imgPath(item.file);
    document.getElementById("modalImg").alt = item.title;
    document.getElementById("modalCat").textContent = CATEGORY_LABELS[item.category];
    document.getElementById("modalTitle").textContent = item.title;
    document.getElementById("modalPrice").textContent = money(item.price);
    document.getElementById("modalRef").textContent = "Référence " + item.id;
    document.getElementById("modalAddCart").dataset.id = id;
    document.getElementById("modalWhatsapp").dataset.id = id;
    document.getElementById("modalOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    document.getElementById("modalOverlay").classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------- Drawer ---------------- */
  function openDrawer() {
    document.getElementById("drawerOverlay").classList.add("open");
    document.getElementById("cartDrawer").classList.add("open");
  }
  function closeDrawer() {
    document.getElementById("drawerOverlay").classList.remove("open");
    document.getElementById("cartDrawer").classList.remove("open");
  }

  /* ---------------- Délégation d'évènements ---------------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-action]");
    if (!t) return;
    const action = t.dataset.action;
    const id = t.dataset.id;

    if (action === "add-cart") { addToCart(id); }
    else if (action === "whatsapp-item") { orderSingleItem(id); }
    else if (action === "open-modal") { openModal(id); }
    else if (action === "qty-plus") { changeQty(id, 1); }
    else if (action === "qty-minus") { changeQty(id, -1); }
    else if (action === "remove-item") { e.preventDefault(); removeFromCart(id); }
  });

  document.getElementById("modalAddCart").addEventListener("click", (e) => addToCart(e.currentTarget.dataset.id));
  document.getElementById("modalWhatsapp").addEventListener("click", (e) => orderSingleItem(e.currentTarget.dataset.id));
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawer(); } });

  document.getElementById("cartTrigger").addEventListener("click", openDrawer);
  document.getElementById("drawerClose").addEventListener("click", closeDrawer);
  document.getElementById("drawerOverlay").addEventListener("click", closeDrawer);
  document.getElementById("drawerCheckout").addEventListener("click", orderCart);

  document.querySelectorAll("[data-general-whatsapp]").forEach((el) =>
    el.addEventListener("click", generalContact)
  );

  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });
  document.querySelectorAll("#navLinks a").forEach((a) =>
    a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"))
  );

  /* ---------------- Filtres ---------------- */
  document.getElementById("filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-pill");
    if (!btn) return;
    document.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderGallery();
  });

  /* ---------------- Init ---------------- */
  renderBestsellers();
  renderGallery();
  renderCart();
  updateCartBadge();
})();
