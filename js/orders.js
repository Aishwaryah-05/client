/**
 * LOOMPILOT — Orders Management Controller
 * Page 4: My Orders & Complete Order Details Inspector
 */

const OrdersPage = {
  activeFilter: "all",
  searchQuery: "",
  sortBy: "date-desc",

  render(params) {
    const container = document.getElementById("view-orders");
    if (!container) return;

    const orders = StorageManager.getOrders();

    container.innerHTML = `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">My Orders</h1>
          <p class="page-description">Comprehensive archive of your ongoing textile production contracts, completed manufacturing orders, and active quotations.</p>
        </div>
        <div class="page-header-actions">
          <a href="#create-order" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create New Order
          </a>
        </div>
      </div>

      <div class="textile-strip"></div>

      <!-- Filters & Search Toolbar -->
      <div class="card" style="padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <!-- Category Filters -->
          <div class="category-filter-bar" style="margin-bottom: 0;" id="orders-filter-bar">
            <button class="filter-pill ${this.activeFilter === 'all' ? 'active' : ''}" onclick="OrdersPage.setFilter('all', this)">All Orders (${orders.length})</button>
            <button class="filter-pill ${this.activeFilter === 'active' ? 'active' : ''}" onclick="OrdersPage.setFilter('active', this)">Active Orders</button>
            <button class="filter-pill ${this.activeFilter === 'awaiting_quote' ? 'active' : ''}" onclick="OrdersPage.setFilter('awaiting_quote', this)">Awaiting Quotation</button>
            <button class="filter-pill ${this.activeFilter === 'in_production' ? 'active' : ''}" onclick="OrdersPage.setFilter('in_production', this)">In Production</button>
            <button class="filter-pill ${this.activeFilter === 'delivered' ? 'active' : ''}" onclick="OrdersPage.setFilter('delivered', this)">Delivered</button>
          </div>

          <!-- Search & Sort Controls -->
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div class="catalogue-search-box" style="width: 240px;">
              <svg class="catalogue-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" class="catalogue-search-input" placeholder="Search order ID or fabric..." value="${this.searchQuery}" oninput="OrdersPage.handleSearch(this.value)">
            </div>

            <select class="form-control" style="width: auto; padding: 0.58rem 0.85rem; font-size: 0.82rem;" onchange="OrdersPage.handleSort(this.value)">
              <option value="date-desc">Newest Orders First</option>
              <option value="date-asc">Oldest Orders First</option>
              <option value="metres-desc">Highest Quantity</option>
              <option value="progress-desc">Highest Progress</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Orders Table Container -->
      <div class="table-responsive-wrapper" id="orders-table-container">
        <!-- Rendered by renderTable() -->
      </div>

      <!-- Complete Order Detail Modal Placeholder -->
      <div id="order-detail-modal" class="modal-overlay"></div>
    `;

    this.renderTable();

    // If param provided to open a specific order
    if (params && params.id) {
      this.openOrderDetailModal(params.id);
    }
  },

  setFilter(filter, btn) {
    this.activeFilter = filter;
    document.querySelectorAll("#orders-filter-bar .filter-pill").forEach(el => {
      el.classList.remove("active");
    });
    if (btn) {
      btn.classList.add("active");
    } else {
      const activeBtn = Array.from(document.querySelectorAll("#orders-filter-bar .filter-pill"))
        .find(el => el.getAttribute("onclick") && el.getAttribute("onclick").includes(`'${filter}'`));
      if (activeBtn) activeBtn.classList.add("active");
    }
    this.renderTable();
  },

  handleSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.renderTable();
  },

  handleSort(sortVal) {
    this.sortBy = sortVal;
    this.renderTable();
  },

  getFilteredOrders() {
    let list = StorageManager.getOrders();

    // Filter
    if (this.activeFilter === "active") {
      list = list.filter(o => o.status === "In Production" || o.status === "Awaiting Quotation");
    } else if (this.activeFilter === "awaiting_quote") {
      list = list.filter(o => o.status === "Awaiting Quotation");
    } else if (this.activeFilter === "in_production") {
      list = list.filter(o => o.status === "In Production");
    } else if (this.activeFilter === "delivered") {
      list = list.filter(o => o.status === "Delivered");
    }

    // Search
    if (this.searchQuery) {
      list = list.filter(o =>
        o.id.toLowerCase().includes(this.searchQuery) ||
        o.productName.toLowerCase().includes(this.searchQuery) ||
        (o.colorway && o.colorway.toLowerCase().includes(this.searchQuery))
      );
    }

    // Sort
    if (this.sortBy === "metres-desc") {
      list.sort((a, b) => b.orderedMetres - a.orderedMetres);
    } else if (this.sortBy === "progress-desc") {
      list.sort((a, b) => (b.progressPercent || 0) - (a.progressPercent || 0));
    }

    return list;
  },

  renderTable() {
    const container = document.getElementById("orders-table-container");
    if (!container) return;

    const list = this.getFilteredOrders();

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted-light)" stroke-width="1.5" style="margin-bottom: 1rem;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          <h3 style="font-size: 1.15rem; color: var(--color-deep-charcoal); margin-bottom: 0.35rem;">No orders found</h3>
          <p style="color: var(--color-muted-text); font-size: 0.88rem; max-width: 400px; margin: 0 auto 1.5rem;">There are no manufacturing orders matching your current filter.</p>
          <button onclick="OrdersPage.setFilter('all'); OrdersPage.searchQuery='';" class="btn btn-secondary btn-sm">Clear Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Fabric Product</th>
            <th>Quantity</th>
            <th>Order Date</th>
            <th>Expected Delivery</th>
            <th>Production Stage</th>
            <th>Status</th>
            <th style="text-align: right;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(o => {
            let statusBadge = `<span class="badge badge-green"><span class="badge-dot"></span> In Production</span>`;
            if (o.status === "Awaiting Quotation") {
              statusBadge = `<span class="badge badge-amber"><span class="badge-dot"></span> Awaiting Quotation</span>`;
            } else if (o.status === "Delivered") {
              statusBadge = `<span class="badge badge-neutral">Delivered</span>`;
            }

            return `
              <tr>
                <td>
                  <span class="table-cell-bold" style="font-family: var(--font-family-mono); color: var(--color-textile-vermilion); cursor: pointer;" onclick="OrdersPage.openOrderDetailModal('${o.id}')">
                    ${o.id}
                  </span>
                  <div class="table-cell-sub">${o.category}</div>
                </td>
                <td>
                  <span class="table-cell-bold">${o.productName}</span>
                  <div class="table-cell-sub">Shade: ${o.colorway || 'Standard Mill White'}</div>
                </td>
                <td>
                  <strong style="color: var(--color-deep-charcoal);">${o.orderedMetres.toLocaleString("en-IN")} m</strong>
                  <div class="table-cell-sub">${o.producedMetres.toLocaleString("en-IN")} m woven (${o.progressPercent || 0}%)</div>
                </td>
                <td>${o.orderDate}</td>
                <td>
                  <span style="font-weight: 600;">${o.expectedDelivery}</span>
                </td>
                <td>
                  <span class="badge badge-coral">Stage ${o.currentStageNumber}: ${o.currentStageName}</span>
                </td>
                <td>${statusBadge}</td>
                <td style="text-align: right;">
                  <button onclick="OrdersPage.openOrderDetailModal('${o.id}')" class="btn btn-secondary btn-sm">
                    View Details
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  openOrderDetailModal(orderId) {
    const order = StorageManager.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById("order-detail-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h2 style="font-size: 1.35rem; font-weight: 800; font-family: var(--font-family-mono);">${order.id}</h2>
              <span class="badge ${order.status === 'In Production' ? 'badge-green' : 'badge-amber'}">${order.status}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--color-muted-text); margin-top: 2px;">
              ${order.productName} • Ordered on ${order.orderDate}
            </div>
          </div>
          <button onclick="OrdersPage.closeModal()" class="btn btn-secondary btn-icon-only">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Top KPI Ribbon -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; background: var(--color-warm-ivory); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-light-border);">
            <div>
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted-text); font-weight: 700;">Ordered Volume</span>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--color-deep-charcoal);">${order.orderedMetres.toLocaleString("en-IN")} m</div>
            </div>
            <div>
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted-text); font-weight: 700;">Produced to Date</span>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--color-success);">${order.producedMetres.toLocaleString("en-IN")} m</div>
            </div>
            <div>
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted-text); font-weight: 700;">Unit Rate</span>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--color-deep-charcoal);">₹ ${order.unitPrice || 225} / m</div>
            </div>
            <div>
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted-text); font-weight: 700;">Target Dispatch</span>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--color-textile-vermilion);">${order.expectedDelivery}</div>
            </div>
          </div>

          <!-- Fabric Technical Specifications Grid -->
          <div style="margin-bottom: 1.75rem;">
            <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.75rem;">1. Fabric Specifications & Construction</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; font-size: 0.85rem;">
              <div style="background: #FAF6F1; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border);">
                <span style="color: var(--color-muted-text); display: block; font-size: 0.74rem;">Fabric Weight</span>
                <strong>${order.specifications?.gsm || 210} GSM</strong>
              </div>
              <div style="background: #FAF6F1; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border);">
                <span style="color: var(--color-muted-text); display: block; font-size: 0.74rem;">Finished Width</span>
                <strong>${order.specifications?.width || '58 inches'}</strong>
              </div>
              <div style="background: #FAF6F1; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border);">
                <span style="color: var(--color-muted-text); display: block; font-size: 0.74rem;">Weave Architecture</span>
                <strong>${order.specifications?.weave || '2/1 Twill'}</strong>
              </div>
              <div style="background: #FAF6F1; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border);">
                <span style="color: var(--color-muted-text); display: block; font-size: 0.74rem;">Color / Pantone Reference</span>
                <strong>${order.colorway || 'Standard'}</strong>
              </div>
              <div style="background: #FAF6F1; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border); grid-column: span 2;">
                <span style="color: var(--color-muted-text); display: block; font-size: 0.74rem;">Special Finishes Applied</span>
                <strong>${order.specifications?.finish || 'Mercerized, Pre-Shrunk'}</strong>
              </div>
            </div>
          </div>

          <!-- Commercial Milestone Ledger -->
          <div style="margin-bottom: 1.75rem;">
            <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.75rem;">2. Commercial Milestone Ledger (30% / 40% / 30%)</h3>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${(order.milestones || []).map(m => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-radius: var(--radius-sm); background: var(--color-white); border: 1px solid var(--color-light-border);">
                  <div>
                    <strong style="font-size: 0.88rem; color: var(--color-deep-charcoal); display: block;">${m.phase}</strong>
                    <span style="font-size: 0.76rem; color: var(--color-muted-text);">Invoice Ref: ${m.invoiceId} ${m.paidDate ? '• Paid on ' + m.paidDate : (m.dueDate ? '• Due ' + m.dueDate : '')}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="font-weight: 800; font-size: 1rem; color: var(--color-deep-charcoal);">₹ ${m.amount.toLocaleString("en-IN")}</div>
                    <span class="badge ${m.status === 'paid' ? 'badge-green' : (m.status === 'pending' ? 'badge-amber' : 'badge-neutral')}">
                      ${m.status === 'paid' ? 'Paid' : (m.status === 'pending' ? 'Pending' : 'Upcoming')}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Plant Delivery Destination -->
          <div>
            <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem;">3. Delivery Destination & Mill Address</h3>
            <p style="font-size: 0.88rem; color: var(--color-deep-charcoal); background: var(--color-warm-ivory); padding: 0.85rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border);">
              ${order.deliveryAddress || 'Raymond Weaving Mills — Unit IV, Pokhran Road No. 1, Jekegram, Thane 400606'}
            </p>
          </div>
        </div>

        <div class="modal-footer">
          <button onclick="OrdersPage.closeModal()" class="btn btn-secondary">Close</button>
          <button onclick="OrdersPage.closeModal(); Navigation.navigateTo('quotations', { id: '${order.id}' });" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Negotiate / Chat
          </button>
          <button onclick="OrdersPage.closeModal(); Navigation.navigateTo('tracking', { id: '${order.id}' });" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Track 8-Stage Production
          </button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  },

  closeModal() {
    const modal = document.getElementById("order-detail-modal");
    if (modal) modal.classList.remove("active");
  }
};
