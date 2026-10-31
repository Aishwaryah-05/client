/**
 * LOOMPILOT — Overview Dashboard Page Controller
 * Page 1: Client Overview Dashboard
 */

const OverviewPage = {
  render() {
    const container = document.getElementById("view-overview");
    if (!container) return;

    const client = StorageManager.getClient();
    const metrics = StorageManager.getDashboardMetrics();
    const orders = StorageManager.getOrders();
    const invoices = StorageManager.getInvoices();
    const activities = StorageManager.getActivities();

    // Identify Spotlight Order (either flagged spotlight or first active order)
    const spotlightOrder = orders.find(o => o.spotlight) || orders.find(o => o.status === "In Production") || orders[0];

    // Upcoming pending invoices
    const pendingInvoices = invoices.filter(i => i.status === "Pending").slice(0, 3);

    container.innerHTML = `
      <!-- Welcome Section -->
      <section class="welcome-banner">
        <div class="welcome-content">
          <h1>Good Morning, ${client.company}!</h1>
          <p>Here is an overview of your active textile manufacturing orders, mill production progress, and commercial milestones.</p>
          <div class="welcome-meta-pill">
            <span>Client Account: <strong>${client.clientCode}</strong></span>
            <span>•</span>
            <span>${client.accountTier}</span>
          </div>
        </div>
        <div class="welcome-actions">
          <a href="#create-order" class="btn btn-primary btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create New Order
          </a>
        </div>
      </section>

      <!-- Key Metrics -->
      <section class="metrics-grid">
        <div class="metric-card active-metric">
          <div class="metric-top">
            <span class="metric-label">Active Orders</span>
            <div class="metric-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
          </div>
          <div class="metric-value">${metrics.activeOrders}</div>
          <div class="metric-sub">
            <span class="trend-up">● In Manufacturing</span> & Negotiation
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Total Orders</span>
            <div class="metric-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </div>
          </div>
          <div class="metric-value">${metrics.totalOrders}</div>
          <div class="metric-sub">Lifetime textile orders placed</div>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Production in Progress</span>
            <div class="metric-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div class="metric-value">${metrics.productionInProgressMetres.toLocaleString("en-IN")} <span style="font-size: 1rem; font-weight: 600; color: var(--color-muted-text);">m</span></div>
          <div class="metric-sub">Across 8 active Air-Jet Looms</div>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Pending Payments</span>
            <div class="metric-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
          </div>
          <div class="metric-value" style="color: ${metrics.pendingPaymentsAmount > 0 ? 'var(--color-warning)' : 'var(--color-deep-charcoal)'}">₹ ${(metrics.pendingPaymentsAmount / 100000).toFixed(2)} <span style="font-size: 1rem; font-weight: 600;">Lakhs</span></div>
          <div class="metric-sub">${pendingInvoices.length} Milestone invoices pending</div>
        </div>
      </section>

      <!-- Current Order Spotlight -->
      ${spotlightOrder ? `
      <section class="spotlight-card">
        <div class="spotlight-header">
          <div class="spotlight-tag-row">
            <span class="spotlight-badge">★ Current Order Spotlight</span>
            <span class="badge badge-coral">Stage ${spotlightOrder.currentStageNumber} of 8: ${spotlightOrder.currentStageName}</span>
          </div>
          <div style="font-family: var(--font-family-mono); font-weight: 700; color: var(--color-muted-text); font-size: 0.9rem;">
            ${spotlightOrder.id}
          </div>
        </div>

        <div class="spotlight-body-grid">
          <div>
            <h2 class="spotlight-fabric-title">${spotlightOrder.productName}</h2>
            <div style="font-size: 0.88rem; color: var(--color-muted-text); margin-bottom: 0.5rem;">
              Shade: <strong>${spotlightOrder.colorway}</strong> • Ordered on ${spotlightOrder.orderDate}
            </div>
            
            <div class="spotlight-meta-chips">
              <span class="spotlight-chip">GSM: <strong>${spotlightOrder.specifications?.gsm || '210'}</strong></span>
              <span class="spotlight-chip">Width: <strong>${spotlightOrder.specifications?.width || '58"'}</strong></span>
              <span class="spotlight-chip">Weave: <strong>${spotlightOrder.specifications?.weave || 'Twill'}</strong></span>
              <span class="spotlight-chip">Target Dispatch: <strong>${spotlightOrder.expectedDelivery}</strong></span>
            </div>

            <div class="progress-bar-container">
              <div class="progress-header">
                <span style="font-weight: 600;">Manufacturing Progress</span>
                <span style="font-weight: 700; color: var(--color-textile-vermilion);">${spotlightOrder.progressPercent}%</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: ${spotlightOrder.progressPercent}%;"></div>
              </div>
            </div>

            <div style="display: flex; gap: 0.85rem; margin-top: 1.25rem;">
              <a href="#tracking?id=${spotlightOrder.id}" class="btn btn-primary btn-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Track Live Production
              </a>
              <button onclick="OrdersPage.openOrderDetailModal('${spotlightOrder.id}')" class="btn btn-secondary btn-sm">
                View Full Specifications
              </button>
            </div>
          </div>

          <div class="spotlight-stats-panel">
            <div>
              <div class="stat-item-label">Ordered Quantity</div>
              <div class="stat-item-value">${spotlightOrder.orderedMetres.toLocaleString("en-IN")} m</div>
            </div>
            <div>
              <div class="stat-item-label">Produced to Date</div>
              <div class="stat-item-value" style="color: var(--color-success);">${spotlightOrder.producedMetres.toLocaleString("en-IN")} m</div>
            </div>
            <div>
              <div class="stat-item-label">Remaining Metres</div>
              <div class="stat-item-value">${spotlightOrder.remainingMetres.toLocaleString("en-IN")} m</div>
            </div>
            <div>
              <div class="stat-item-label">Est. Completion</div>
              <div class="stat-item-value">${spotlightOrder.expectedDelivery}</div>
            </div>
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Lower Grid: Recent Activity & Upcoming Payments -->
      <div class="dashboard-lower-grid">
        <!-- Recent Activity Feed -->
        <div class="card">
          <div class="card-header-flex">
            <div>
              <h3 class="card-title">Recent Manufacturing & Order Activity</h3>
              <p class="card-subtitle">Live events across production lines & quotations</p>
            </div>
            <a href="#orders" class="btn btn-secondary btn-sm">All Orders</a>
          </div>

          <div class="activity-feed-list">
            ${activities.slice(0, 5).map(act => `
              <div class="activity-feed-item">
                <div class="activity-dot-node"></div>
                <div class="activity-header">
                  <div class="activity-title">${act.title}</div>
                  <span class="activity-time">${act.time}</span>
                </div>
                <div class="activity-desc">${act.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Upcoming Milestone Payments -->
        <div class="card">
          <div class="card-header-flex">
            <div>
              <h3 class="card-title">Upcoming Milestone Payments</h3>
              <p class="card-subtitle">Invoices linked to production stage deliverables</p>
            </div>
            <a href="#payments" class="btn btn-secondary btn-sm">View All Invoices</a>
          </div>

          <div class="payment-mini-list">
            ${pendingInvoices.length > 0 ? pendingInvoices.map(inv => `
              <div class="payment-mini-item">
                <div class="payment-mini-left">
                  <span class="payment-inv-title">${inv.invoiceNumber}</span>
                  <span class="payment-inv-sub">${inv.productName} • ${inv.milestonePhase}</span>
                  <span style="font-size: 0.72rem; color: var(--color-warning); font-weight: 600;">Due: ${inv.dueDate}</span>
                </div>
                <div class="payment-mini-right">
                  <div class="payment-amount-display">₹ ${inv.amount.toLocaleString("en-IN")}</div>
                  <button onclick="PaymentsPage.openRazorpayModal('${inv.invoiceNumber}')" class="btn btn-primary btn-sm">
                    Pay Now
                  </button>
                </div>
              </div>
            `).join('') : `
              <div style="text-align: center; padding: 2rem; color: var(--color-muted-text);">
                <p>No pending milestone invoices. All accounts are up to date!</p>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }
};

