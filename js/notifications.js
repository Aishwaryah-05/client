/**
 * LOOMPILOT — Notifications Controller
 * Page 8: Textile Operations Notification Centre & Deep Linking
 */

const NotificationsPage = {
  activeTab: "all",

  render() {
    const container = document.getElementById("view-notifications");
    if (!container) return;

    const notifs = StorageManager.getNotifications();
    const unreadCount = StorageManager.getUnreadNotificationsCount();

    container.innerHTML = `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Notification Centre</h1>
          <p class="page-description">Real-time alerts for mill quotation revisions, daily loom milestones, and scheduled payment disbursements.</p>
        </div>
        <div class="page-header-actions">
          <button onclick="NotificationsPage.markAllRead()" class="btn btn-secondary btn-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Mark All as Read
          </button>
        </div>
      </div>

      <div class="textile-strip"></div>

      <!-- Category Filter Tabs -->
      <div class="category-filter-bar" id="notif-category-bar">
        <button class="filter-pill ${this.activeTab === 'all' ? 'active' : ''}" onclick="NotificationsPage.setTab('all', this)">All Alerts (${notifs.length})</button>
        <button class="filter-pill ${this.activeTab === 'quotation' ? 'active' : ''}" onclick="NotificationsPage.setTab('quotation', this)">Quotations & Pricing</button>
        <button class="filter-pill ${this.activeTab === 'production' ? 'active' : ''}" onclick="NotificationsPage.setTab('production', this)">Production Stages</button>
        <button class="filter-pill ${this.activeTab === 'payment' ? 'active' : ''}" onclick="NotificationsPage.setTab('payment', this)">Payments & Invoices</button>
      </div>

      <!-- Notification List -->
      <div class="card" style="padding: 0; overflow: hidden;">
        <div id="notifications-list-container">
          <!-- Rendered by renderList() -->
        </div>
      </div>
    `;

    this.renderList();
  },

  setTab(tabKey, btn) {
    this.activeTab = tabKey;
    document.querySelectorAll("#notif-category-bar .filter-pill").forEach(el => el.classList.remove("active"));
    if (btn) {
      btn.classList.add("active");
    } else {
      const activeBtn = Array.from(document.querySelectorAll("#notif-category-bar .filter-pill"))
        .find(el => el.getAttribute("onclick") && el.getAttribute("onclick").includes(`'${tabKey}'`));
      if (activeBtn) activeBtn.classList.add("active");
    }
    this.renderList();
  },

  getFiltered() {
    const notifs = StorageManager.getNotifications();
    if (this.activeTab === "all") return notifs;
    return notifs.filter(n => n.category === this.activeTab);
  },

  renderList() {
    const container = document.getElementById("notifications-list-container");
    if (!container) return;

    const list = this.getFiltered();

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted-light)" stroke-width="1.5" style="margin-bottom: 0.75rem;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <h4 style="font-size: 1.05rem; color: var(--color-deep-charcoal); margin-bottom: 0.25rem;">No alerts in this category</h4>
          <p style="font-size: 0.82rem; color: var(--color-muted-text);">All operational updates have been acknowledged.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <div style="display: flex; align-items: flex-start; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border-subtle); background: ${item.read ? 'var(--color-white)' : 'rgba(230, 83, 56, 0.03)'}; cursor: pointer; transition: background var(--transition-fast);" onclick="NotificationsPage.handleItemClick('${item.id}', '${item.targetPage}', '${item.orderId || ''}')">
        <div style="display: flex; gap: 1rem; align-items: flex-start;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: ${item.read ? 'transparent' : 'var(--color-textile-vermilion)'}; margin-top: 6px; flex-shrink: 0;"></div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.25rem;">
              <strong style="font-size: 0.92rem; color: var(--color-deep-charcoal);">${item.title}</strong>
              <span class="badge ${item.category === 'quotation' ? 'badge-amber' : (item.category === 'production' ? 'badge-coral' : 'badge-green')}" style="font-size: 0.68rem;">
                ${item.category.toUpperCase()}
              </span>
            </div>
            <p style="font-size: 0.85rem; color: var(--color-muted-text); line-height: 1.45; max-width: 720px; margin-bottom: 0.35rem;">
              ${item.message}
            </p>
            <span style="font-size: 0.74rem; color: var(--color-muted-light);">${item.time}</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" style="font-size: 0.76rem;">
            Open Page
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    `).join('');
  },

  handleItemClick(id, targetPage, orderId) {
    StorageManager.markNotificationAsRead(id);
    Navigation.updateSidebarActive(Navigation.currentPage);

    if (targetPage && targetPage !== "undefined") {
      Navigation.navigateTo(targetPage, orderId ? { id: orderId } : {});
    }
  },

  markAllRead() {
    StorageManager.markAllNotificationsRead();
    Navigation.updateSidebarActive(Navigation.currentPage);
    this.render();
    App.showToast("All notifications marked as read.", "info");
  }
};
