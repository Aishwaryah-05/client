/**
 * LOOMPILOT — Payments & Invoices Controller
 * Page 7: Split Milestone Ledger & Simulated Razorpay Checkout Experience
 */

const PaymentsPage = {
  activeInvoiceToPay: null,
  selectedPaymentMethod: "netbanking",

  render() {
    const container = document.getElementById("view-payments");
    if (!container) return;

    const invoices = StorageManager.getInvoices();
    const payments = StorageManager.getPayments();

    const totalPaid = invoices.reduce((acc, i) => acc + (i.paidAmount || 0), 0);
    const totalOutstanding = invoices.reduce((acc, i) => acc + (i.remainingAmount || 0), 0);
    const pendingCount = invoices.filter(i => i.status === "Pending").length;

    container.innerHTML = `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Payments & Commercial Invoices</h1>
          <p class="page-description">Manage milestone disbursements, download tax invoices, and complete secure digital payments via Razorpay.</p>
        </div>
        <div class="page-header-actions">
          <button onclick="PaymentsPage.downloadLedgerStatement()" class="btn btn-secondary btn-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Account Statement (PDF)
          </button>
        </div>
      </div>

      <div class="textile-strip"></div>

      <!-- Financial Overview Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Total Amount Paid</span>
            <div class="metric-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <div class="metric-value" style="color: var(--color-success);">₹ ${(totalPaid / 100000).toFixed(2)} <span style="font-size: 1rem; font-weight: 600;">Lakhs</span></div>
          <div class="metric-sub">${payments.length} successful transactions</div>
        </div>

        <div class="metric-card active-metric">
          <div class="metric-top">
            <span class="metric-label">Total Outstanding</span>
            <div class="metric-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
          </div>
          <div class="metric-value" style="color: var(--color-warning);">₹ ${(totalOutstanding / 100000).toFixed(2)} <span style="font-size: 1rem; font-weight: 600;">Lakhs</span></div>
          <div class="metric-sub">${pendingCount} milestone invoices awaiting disbursement</div>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Payment Structure</span>
            <div class="metric-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
          </div>
          <div class="metric-value" style="font-size: 1.45rem;">30 / 40 / 30</div>
          <div class="metric-sub">Advance • Weaving • Dispatch</div>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Corporate Credit Line</span>
            <div class="metric-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
          </div>
          <div class="metric-value" style="font-size: 1.45rem;">₹ 87.40 <span style="font-size: 0.9rem; font-weight: 600; color: var(--color-muted-text);">Lakhs</span></div>
          <div class="metric-sub">Net 15 days credit terms</div>
        </div>
      </div>

      <!-- Textile Industry Milestone Disbursement Guide -->
      <div class="milestone-stages-grid">
        <div class="milestone-card milestone-paid">
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--color-success); margin-bottom: 0.35rem;">Milestone 1 — 30% Advance</div>
          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--color-deep-charcoal); margin-bottom: 0.35rem;">Quote Acceptance & Yarn Sourcing</h4>
          <p style="font-size: 0.8rem; color: var(--color-muted-text);">Locks spinning mill reservoir allocation and starts warping beam preparation.</p>
        </div>

        <div class="milestone-card milestone-pending">
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--color-warning); margin-bottom: 0.35rem;">Milestone 2 — 40% Mid Production</div>
          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--color-deep-charcoal); margin-bottom: 0.35rem;">Loom Weaving & Continuous Inspection</h4>
          <p style="font-size: 0.8rem; color: var(--color-muted-text);">Triggered upon crossing 50% greige fabric output on designated loom sheds.</p>
        </div>

        <div class="milestone-card milestone-upcoming">
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted-text); margin-bottom: 0.35rem;">Milestone 3 — 30% Balance</div>
          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--color-deep-charcoal); margin-bottom: 0.35rem;">Quality Certification & Pre-Dispatch</h4>
          <p style="font-size: 0.8rem; color: var(--color-muted-text);">Due once final 4-point lab testing passes prior to pallet dispatch from mill.</p>
        </div>
      </div>

      <!-- Invoices Section -->
      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title">Commercial Tax Invoices</h3>
            <p class="card-subtitle">GST-compliant manufacturing invoices generated per production milestone</p>
          </div>
        </div>

        <div class="table-responsive-wrapper" style="border: none; box-shadow: none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Order Ref</th>
                <th>Milestone Deliverable</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Invoice Amount</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(inv => `
                <tr>
                  <td>
                    <span class="table-cell-bold" style="font-family: var(--font-family-mono); color: var(--color-deep-charcoal);">${inv.invoiceNumber}</span>
                  </td>
                  <td>
                    <span class="table-cell-bold" style="font-family: var(--font-family-mono); color: var(--color-textile-vermilion); cursor: pointer;" onclick="Navigation.navigateTo('orders', { id: '${inv.orderId}' })">
                      ${inv.orderId}
                    </span>
                    <div class="table-cell-sub">${inv.productName}</div>
                  </td>
                  <td>
                    <span style="font-weight: 600;">${inv.milestonePhase}</span>
                  </td>
                  <td>${inv.issueDate}</td>
                  <td>
                    <span style="${inv.status === 'Pending' ? 'color: var(--color-warning); font-weight: 700;' : ''}">${inv.dueDate}</span>
                  </td>
                  <td>
                    <strong style="font-size: 0.95rem; color: var(--color-deep-charcoal);">₹ ${inv.amount.toLocaleString("en-IN")}</strong>
                  </td>
                  <td>
                    <span class="badge ${inv.status === 'Paid' ? 'badge-green' : 'badge-amber'}">
                      <span class="badge-dot"></span> ${inv.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                      <button onclick="PaymentsPage.downloadInvoicePDF('${inv.invoiceNumber}')" class="btn btn-secondary btn-sm" title="Download Tax Invoice PDF">
                        PDF
                      </button>
                      ${inv.status === 'Pending' ? `
                        <button onclick="PaymentsPage.openRazorpayModal('${inv.invoiceNumber}')" class="btn btn-primary btn-sm">
                          Pay Now
                        </button>
                      ` : `
                        <span style="font-size: 0.78rem; color: var(--color-success); font-weight: 600; padding: 0.35rem 0.6rem;">
                          Settled
                        </span>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payment History Section -->
      <div class="card">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title">Disbursement & Settlement History</h3>
            <p class="card-subtitle">Verified transaction ledger with digital gateway references</p>
          </div>
        </div>

        <div class="table-responsive-wrapper" style="border: none; box-shadow: none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Invoice Ref</th>
                <th>Order ID</th>
                <th>Disbursement Date</th>
                <th>Amount</th>
                <th>Payment Channel</th>
                <th>Gateway Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map(p => `
                <tr>
                  <td><span class="table-cell-bold" style="font-family: var(--font-family-mono);">${p.paymentId}</span></td>
                  <td><span style="font-family: var(--font-family-mono); font-weight: 600;">${p.invoiceNumber}</span></td>
                  <td><span style="font-family: var(--font-family-mono); color: var(--color-textile-vermilion); cursor: pointer;" onclick="Navigation.navigateTo('orders', { id: '${p.orderId}' })">${p.orderId}</span></td>
                  <td>${p.paymentDate}</td>
                  <td><strong style="color: var(--color-success);">₹ ${p.amount.toLocaleString("en-IN")}</strong></td>
                  <td>${p.method}</td>
                  <td><span style="font-family: var(--font-family-mono); font-size: 0.78rem; color: var(--color-muted-text);">${p.transactionRef}</span></td>
                  <td><span class="badge badge-green"><span class="badge-dot"></span> Success</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Simulated Razorpay Modal Overlay -->
      <div id="razorpay-checkout-modal-container" class="razorpay-overlay">
        <!-- Injected on openRazorpayModal() -->
      </div>
    `;
  },

  openRazorpayModal(invoiceNumber) {
    const invoice = StorageManager.getInvoiceByNumber(invoiceNumber);
    if (!invoice) return;

    this.activeInvoiceToPay = invoice;
    const client = StorageManager.getClient();
    const modalContainer = document.getElementById("razorpay-checkout-modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="razorpay-checkout-modal">
        <!-- Razorpay Dark Navy Header -->
        <div class="rzp-header">
          <div>
            <div class="rzp-merchant-title">LoomPilot Mill Payments</div>
            <div class="rzp-invoice-tag">${invoice.invoiceNumber} • ${invoice.productName}</div>
          </div>
          <button onclick="PaymentsPage.closeRazorpayModal()" style="color: #8BAAC9; padding: 4px;" title="Cancel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Payable Amount Strip -->
        <div class="rzp-amount-box">
          <span style="font-size: 0.85rem; color: #8BAAC9;">Amount Payable</span>
          <div class="rzp-amount-val">₹ ${invoice.amount.toLocaleString("en-IN")}</div>
        </div>

        <!-- Payment Method Selection -->
        <div class="rzp-body" id="rzp-methods-body">
          <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: #718096; margin-bottom: 0.85rem; letter-spacing: 0.05em;">
            Select B2B Payment Mode
          </div>

          <div class="rzp-method-option ${this.selectedPaymentMethod === 'netbanking' ? 'selected' : ''}" onclick="PaymentsPage.selectMethod('netbanking', this)">
            <div class="rzp-method-icon">🏦</div>
            <div class="rzp-method-text">
              <strong>Corporate NetBanking</strong>
              <span>HDFC, ICICI, SBI, Axis Corporate Portals</span>
            </div>
          </div>

          <div class="rzp-method-option ${this.selectedPaymentMethod === 'upi' ? 'selected' : ''}" onclick="PaymentsPage.selectMethod('upi', this)">
            <div class="rzp-method-icon">⚡</div>
            <div class="rzp-method-text">
              <strong>UPI Corporate / Instant VPA</strong>
              <span>Google Pay, PhonePe, BHIM Business</span>
            </div>
          </div>

          <div class="rzp-method-option ${this.selectedPaymentMethod === 'neft' ? 'selected' : ''}" onclick="PaymentsPage.selectMethod('neft', this)">
            <div class="rzp-method-icon">📄</div>
            <div class="rzp-method-text">
              <strong>NEFT / RTGS Virtual Account</strong>
              <span>Direct mill treasury settlement via ICICI Virtual Account</span>
            </div>
          </div>

          <div class="rzp-method-option ${this.selectedPaymentMethod === 'card' ? 'selected' : ''}" onclick="PaymentsPage.selectMethod('card', this)">
            <div class="rzp-method-icon">💳</div>
            <div class="rzp-method-text">
              <strong>Corporate Credit / Purchasing Card</strong>
              <span>Visa, Mastercard Corporate & Diners Club</span>
            </div>
          </div>
        </div>

        <!-- Checkout Actions & Simulation Mode -->
        <div class="rzp-footer">
          <button onclick="PaymentsPage.simulateSuccess()" class="rzp-pay-button">
            Pay ₹ ${invoice.amount.toLocaleString("en-IN")} (Simulate Success)
          </button>

          <div class="rzp-test-actions">
            <button onclick="PaymentsPage.simulateFailure()" class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.76rem; border-color: #E2E8F0; color: #718096;">
              Test Gateway Failure
            </button>
            <button onclick="PaymentsPage.closeRazorpayModal()" class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.76rem; border-color: #E2E8F0; color: #718096;">
              Cancel
            </button>
          </div>

          <div class="rzp-badge-secure">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Secured by Razorpay • 256-bit TLS Encrypted
          </div>
        </div>
      </div>
    `;

    modalContainer.classList.add("active");
  },

  selectMethod(methodKey, el) {
    this.selectedPaymentMethod = methodKey;
    document.querySelectorAll(".rzp-method-option").forEach(item => item.classList.remove("selected"));
    if (el) {
      el.classList.add("selected");
    }
  },

  simulateSuccess() {
    if (!this.activeInvoiceToPay) return;

    const modalBody = document.getElementById("rzp-methods-body");
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
          <div style="width: 58px; height: 58px; border-radius: 50%; background: #DEF7EC; color: #0E9F6E; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #1A202C; margin-bottom: 0.35rem;">Payment Successful!</h3>
          <p style="font-size: 0.85rem; color: #718096; margin-bottom: 1.25rem;">
            ₹ ${this.activeInvoiceToPay.amount.toLocaleString("en-IN")} credited to LoomPilot Mill Accounts.
          </p>
          <div style="background: #F7FAFC; padding: 0.85rem; border-radius: 6px; font-size: 0.78rem; color: #4A5568; font-family: var(--font-family-mono);">
            Payment Ref: RZP-TXN-${Math.floor(10000000 + Math.random() * 90000000)}
          </div>
        </div>
      `;
    }

    // Record in state
    setTimeout(() => {
      StorageManager.markInvoicePaid(this.activeInvoiceToPay.invoiceNumber, {
        method: `Razorpay (${this.selectedPaymentMethod.toUpperCase()})`
      });

      this.closeRazorpayModal();
      this.render();
      App.showToast(`Invoice #${this.activeInvoiceToPay.invoiceNumber} paid successfully!`, "success");
    }, 1200);
  },

  simulateFailure() {
    const modalBody = document.getElementById("rzp-methods-body");
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
          <div style="width: 58px; height: 58px; border-radius: 50%; background: #FDE8E8; color: #E02424; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #1A202C; margin-bottom: 0.35rem;">Transaction Declined</h3>
          <p style="font-size: 0.85rem; color: #718096; margin-bottom: 1.25rem;">
            Bank gateway timed out or corporate authorization limit exceeded. No funds were debited.
          </p>
          <button onclick="PaymentsPage.openRazorpayModal('${this.activeInvoiceToPay.invoiceNumber}')" class="btn btn-secondary btn-sm">
            Retry Payment
          </button>
        </div>
      `;
    }
  },

  closeRazorpayModal() {
    const modal = document.getElementById("razorpay-checkout-modal-container");
    if (modal) modal.classList.remove("active");
  },

  downloadInvoicePDF(invoiceNumber) {
    App.showToast(`Downloading Tax Invoice ${invoiceNumber}.pdf...`, "info");
  },

  downloadLedgerStatement() {
    App.showToast("Downloading Raymond Apparel Mill Ledger (FY 2026-27).pdf...", "info");
  }
};
