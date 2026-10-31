/**
 * LOOMPILOT — Product Catalogue Controller
 * Page 2: Textile Product Catalogue & Fabric Specification Inspector
 */

const CataloguePage = {
  activeCategory: "all",
  searchQuery: "",

  render() {
    const container = document.getElementById("view-catalogue");
    if (!container) return;

    const products = StorageManager.getProducts();

    container.innerHTML = `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Textile Product Catalogue</h1>
          <p class="page-description">Explore mill-manufactured fabrics, industrial weaves, and custom engineered textile blends available for bulk manufacturing contracts.</p>
        </div>
        <div class="page-header-actions">
          <a href="#create-order" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Request Custom Weave
          </a>
        </div>
      </div>

      <div class="textile-strip"></div>

      <!-- Categories Filter Tabs -->
      <div class="category-filter-bar" id="catalogue-category-bar">
        <button class="filter-pill ${this.activeCategory === 'all' ? 'active' : ''}" onclick="CataloguePage.setCategory('all', this)">All Fabrics (${products.length})</button>
        <button class="filter-pill ${this.activeCategory === 'cotton' ? 'active' : ''}" onclick="CataloguePage.setCategory('cotton', this)">Cotton Fabrics</button>
        <button class="filter-pill ${this.activeCategory === 'woven' ? 'active' : ''}" onclick="CataloguePage.setCategory('woven', this)">Woven & Denim</button>
        <button class="filter-pill ${this.activeCategory === 'blended' ? 'active' : ''}" onclick="CataloguePage.setCategory('blended', this)">Blended Suiting</button>
        <button class="filter-pill ${this.activeCategory === 'knitted' ? 'active' : ''}" onclick="CataloguePage.setCategory('knitted', this)">Knitted Fabrics</button>
        <button class="filter-pill ${this.activeCategory === 'poly' ? 'active' : ''}" onclick="CataloguePage.setCategory('poly', this)">Polyester Fabrics</button>
        <button class="filter-pill ${this.activeCategory === 'custom' ? 'active' : ''}" onclick="CataloguePage.setCategory('custom', this)">Custom Manufacturing</button>
      </div>

      <!-- Search & Sorting Controls -->
      <div class="catalogue-controls-row">
        <div class="catalogue-search-box">
          <svg class="catalogue-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="catalogue-search-input" class="catalogue-search-input" placeholder="Search by fabric name, GSM, or yarn count..." value="${this.searchQuery}" oninput="CataloguePage.handleSearch(this.value)">
        </div>

        <div style="font-size: 0.85rem; color: var(--color-muted-text);">
          Showing <span id="filtered-products-count" style="font-weight: 700; color: var(--color-deep-charcoal);">${products.length}</span> verified mill formulations
        </div>
      </div>

      <!-- Product Cards Grid -->
      <div class="product-cards-grid" id="product-cards-container">
        <!-- Rendered by renderCards() -->
      </div>

      <!-- Product Detail Modal Placeholder -->
      <div id="product-detail-modal" class="modal-overlay">
        <!-- Injected on click -->
      </div>
    `;

    this.renderCards();
  },

  setCategory(cat, btn) {
    this.activeCategory = cat;
    document.querySelectorAll("#catalogue-category-bar .filter-pill").forEach(el => {
      el.classList.remove("active");
    });
    if (btn) {
      btn.classList.add("active");
    } else {
      const activeBtn = Array.from(document.querySelectorAll("#catalogue-category-bar .filter-pill"))
        .find(el => el.getAttribute("onclick") && el.getAttribute("onclick").includes(`'${cat}'`));
      if (activeBtn) activeBtn.classList.add("active");
    }
    this.renderCards();
  },

  handleSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.renderCards();
  },

  getFilteredProducts() {
    const products = StorageManager.getProducts();
    return products.filter(p => {
      const matchCat = this.activeCategory === "all" || p.categoryCode === this.activeCategory;
      const matchSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.category.toLowerCase().includes(this.searchQuery) ||
        p.yarnCount.toLowerCase().includes(this.searchQuery) ||
        p.weave.toLowerCase().includes(this.searchQuery) ||
        String(p.gsm).includes(this.searchQuery);
      return matchCat && matchSearch;
    });
  },

  renderCards() {
    const container = document.getElementById("product-cards-container");
    const countEl = document.getElementById("filtered-products-count");
    if (!container) return;

    const filtered = this.getFilteredProducts();
    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--color-white); border-radius: var(--radius-md); border: 1px dashed var(--color-light-border);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted-light)" stroke-width="1.5" style="margin-bottom: 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3 style="font-size: 1.15rem; color: var(--color-deep-charcoal); margin-bottom: 0.35rem;">No fabrics match your search criteria</h3>
          <p style="color: var(--color-muted-text); font-size: 0.88rem; max-width: 440px; margin: 0 auto 1.5rem;">Try adjusting your GSM or weave search keywords, or request custom fabric R&D through our custom manufacturing form.</p>
          <button onclick="CataloguePage.setCategory('all'); document.getElementById('catalogue-search-input').value='';" class="btn btn-secondary btn-sm">Clear Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div class="product-card">
        <div class="product-card-media">
          <img src="${p.image}" alt="${p.name}" class="product-card-img" loading="lazy">
          <span class="product-card-badge">${p.category}</span>
        </div>

        <div class="product-card-body">
          <h3 class="product-card-title">${p.name}</h3>
          <p class="product-card-desc">${p.description}</p>

          <div class="product-specs-table-mini">
            <div class="spec-mini-item">
              <span>GSM</span>
              <strong>${p.gsm} GSM</strong>
            </div>
            <div class="spec-mini-item">
              <span>Weave / Knit</span>
              <strong>${p.weave}</strong>
            </div>
            <div class="spec-mini-item">
              <span>Width</span>
              <strong>${p.widthInches}" (${p.widthCm} cm)</strong>
            </div>
            <div class="spec-mini-item">
              <span>Minimum Order</span>
              <strong>${p.moq.toLocaleString("en-IN")} m</strong>
            </div>
          </div>

          <div class="product-card-footer">
            <button onclick="CataloguePage.openDetailModal('${p.id}')" class="btn btn-secondary btn-sm" style="flex: 1;">
              View Specs
            </button>
            <button onclick="CataloguePage.orderProduct('${p.id}')" class="btn btn-primary btn-sm" style="flex: 1.2;">
              Request Quote
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  openDetailModal(productId) {
    const product = StorageManager.getProductById(productId);
    if (!product) return;

    const modal = document.getElementById("product-detail-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-header">
          <div>
            <span class="badge badge-coral" style="margin-bottom: 0.35rem;">${product.category}</span>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--color-deep-charcoal);">${product.name}</h2>
          </div>
          <button onclick="CataloguePage.closeModal()" class="btn btn-secondary btn-icon-only" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem;">
            <div>
              <div style="border-radius: var(--radius-md); overflow: hidden; height: 260px; box-shadow: var(--shadow-sm); margin-bottom: 1rem;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="background: var(--color-warm-ivory); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border);">
                <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--color-muted-text); margin-bottom: 0.35rem;">Standard Lead Time & Price Index</div>
                <div style="font-size: 1.15rem; font-weight: 800; color: var(--color-deep-charcoal);">${product.basePriceRange}</div>
                <div style="font-size: 0.8rem; color: var(--color-muted-text); margin-top: 2px;">Typical Production Cycle: ${product.leadTimeWeeks}</div>
              </div>
            </div>

            <div>
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.4rem;">Fabric Overview & Mill Profile</h3>
              <p style="font-size: 0.88rem; color: var(--color-muted-text); line-height: 1.5; margin-bottom: 1.25rem;">${product.description}</p>

              <h4 style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-deep-charcoal); margin-bottom: 0.6rem;">Key Engineered Properties</h4>
              <ul style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.84rem; color: var(--color-deep-charcoal); margin-bottom: 1.25rem;">
                ${product.features.map(f => `
                  <li style="display: flex; align-items: center; gap: 0.5rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>${f}</span>
                  </li>
                `).join('')}
              </ul>

              <h4 style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-deep-charcoal); margin-bottom: 0.6rem;">Standard Lab Shade Approvals</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                ${product.colors.map(c => `
                  <span class="spotlight-chip" style="font-weight: 600;">${c}</span>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Technical Specifications Table -->
          <div style="border-top: 1px solid var(--color-light-border); padding-top: 1.25rem;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Mill Technical Datasheet</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; background: var(--color-warm-ivory); padding: 1.2rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border);">
              <div>
                <span style="font-size: 0.75rem; color: var(--color-muted-text); display: block;">Yarn Count</span>
                <strong style="font-size: 0.88rem; color: var(--color-deep-charcoal);">${product.yarnCount}</strong>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--color-muted-text); display: block;">Construction (EPI x PPI)</span>
                <strong style="font-size: 0.88rem; color: var(--color-deep-charcoal);">${product.construction}</strong>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--color-muted-text); display: block;">Finished Width</span>
                <strong style="font-size: 0.88rem; color: var(--color-deep-charcoal);">${product.widthInches}" (${product.widthCm} cm)</strong>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: var(--color-muted-text); display: block;">Minimum Order Yardage</span>
                <strong style="font-size: 0.88rem; color: var(--color-deep-charcoal);">${product.moq.toLocaleString("en-IN")} metres</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button onclick="CataloguePage.closeModal()" class="btn btn-secondary">Close Specifications</button>
          <button onclick="CataloguePage.orderProduct('${product.id}')" class="btn btn-primary">
            Request Quotation For This Fabric
          </button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  },

  closeModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) modal.classList.remove("active");
  },

  orderProduct(productId) {
    this.closeModal();
    // Navigate to Create Order wizard with pre-selected product
    OrderWizard.preSelectedProductId = productId;
    window.location.hash = "create-order";
  }
};
