/**
 * LOOMPILOT — Application Root & Utility Services
 * Global Search, Toast Feedback System, Help & Keyboard Accessibility
 */

const App = {
  init() {
    // Initialize Navigation Router
    Navigation.init();

    // Setup Global Search
    this.setupGlobalSearch();

    // Setup Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        CataloguePage.closeModal();
        OrdersPage.closeModal();
        OrderWizard.closeConfirmModal();
        PaymentsPage.closeRazorpayModal();
        App.closeHelpModal();
        Navigation.closeMobileSidebar();
      }
    });

    console.log("LoomPilot Client Portal prototype initialized successfully.");
  },

  setupGlobalSearch() {
    const input = document.getElementById("global-search-input");
    if (!input) return;

    input.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;

      // If user presses Enter or types 3+ chars
      if (q.startsWith("lp-") || q.startsWith("inv-")) {
        // Direct jump helper
        if (q.startsWith("lp-") && q.length >= 7) {
          Navigation.navigateTo("orders");
          OrdersPage.handleSearch(q);
        } else if (q.startsWith("inv-") && q.length >= 7) {
          Navigation.navigateTo("payments");
        }
      }
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const q = input.value.toLowerCase().trim();
        if (q) {
          // Default: Search catalogue or orders
          if (q.includes("twill") || q.includes("denim") || q.includes("cotton") || q.includes("linen") || q.includes("knit") || q.includes("suit")) {
            Navigation.navigateTo("catalogue");
            CataloguePage.handleSearch(q);
          } else {
            Navigation.navigateTo("orders");
            OrdersPage.handleSearch(q);
          }
        }
      }
    });
  },

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";

    let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    if (type === "success") {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === "warning") {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="flex-shrink: 0; display: flex; align-items: center;">${iconSvg}</div>
      <div style="flex: 1; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  },

  openHelpModal() {
    let modal = document.getElementById("help-support-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "help-support-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const client = StorageManager.getClient();

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 style="font-size: 1.25rem; font-weight: 800;">LoomPilot Enterprise Mill Support</h2>
          <button onclick="App.closeHelpModal()" class="btn btn-secondary btn-icon-only">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; background: var(--color-warm-ivory); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border);">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-deep-charcoal); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem;">
              AS
            </div>
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-muted-text); font-weight: 700;">Assigned Production Merchandiser</div>
              <strong style="font-size: 1.05rem; color: var(--color-deep-charcoal);">${client.relationshipManager}</strong>
              <div style="font-size: 0.8rem; color: var(--color-muted-text); margin-top: 2px;">Direct Desk: +91 (22) 6749-8800 • Ext: 442</div>
            </div>
          </div>

          <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">Mill Support Channels</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem;">
            <div style="padding: 0.75rem 1rem; border: 1px solid var(--color-light-border); border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
              <span>Emergency Loom Halt / Batch Alteration</span>
              <strong style="color: var(--color-textile-vermilion);">+91 98200 11990</strong>
            </div>
            <div style="padding: 0.75rem 1rem; border: 1px solid var(--color-light-border); border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
              <span>Laboratory Testing & Lab Dip Inquiries</span>
              <strong>qc-labs@loompilot.com</strong>
            </div>
            <div style="padding: 0.75rem 1rem; border: 1px solid var(--color-light-border); border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
              <span>Razorpay Virtual Account Settlement</span>
              <strong>billing@loompilot.com</strong>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button onclick="App.closeHelpModal()" class="btn btn-secondary">Close</button>
          <button onclick="App.closeHelpModal(); Navigation.navigateTo('quotations');" class="btn btn-primary">
            Open Chat Workspace
          </button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  },

  closeHelpModal() {
    const modal = document.getElementById("help-support-modal");
    if (modal) modal.classList.remove("active");
  }
};

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => App.init());

