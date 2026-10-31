/**
 * LOOMPILOT — Client Profile & Settings Controller
 * Page 9: Client Profile, Mill Addresses & Notification Preferences
 */

const SettingsPage = {
  render() {
    const container = document.getElementById("view-settings");
    if (!container) return;

    const client = StorageManager.getClient();

    container.innerHTML = `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Client Account & Mill Settings</h1>
          <p class="page-description">Configure your enterprise procurement entity, delivery plant destinations, and commercial communication preferences.</p>
        </div>
        <div class="page-header-actions">
          <button onclick="SettingsPage.saveSettings()" class="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>

      <div class="textile-strip"></div>

      <div style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 2rem;">
        <!-- Left: Profile & Addresses -->
        <div style="display: flex; flex-direction: column; gap: 1.75rem;">
          <!-- Enterprise Profile -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom: 0.25rem;">Enterprise Client Entity</h3>
            <p class="card-subtitle" style="margin-bottom: 1.25rem;">Official tax entity registered for fabric manufacturing contracts</p>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Company Legal Name</label>
                <input type="text" id="setting-company" class="form-control" value="${client.company}">
              </div>
              <div class="form-group">
                <label class="form-label">Client Mill Code</label>
                <input type="text" class="form-control" value="${client.clientCode}" readonly style="background: var(--color-warm-ivory); font-family: var(--font-family-mono);">
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">GSTIN / Tax ID</label>
                <input type="text" id="setting-gstin" class="form-control" value="${client.gstin}" style="font-family: var(--font-family-mono);">
              </div>
              <div class="form-group">
                <label class="form-label">Account Tier</label>
                <input type="text" class="form-control" value="${client.accountTier}" readonly style="background: var(--color-warm-ivory);">
              </div>
            </div>
          </div>

          <!-- Procurement Lead Contact -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom: 0.25rem;">Procurement Director & Sourcing Lead</h3>
            <p class="card-subtitle" style="margin-bottom: 1.25rem;">Authorized signatory for commercial quotation signoffs and PO approvals</p>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Contact Person</label>
                <input type="text" id="setting-contact" class="form-control" value="${client.contactPerson}">
              </div>
              <div class="form-group">
                <label class="form-label">Designation</label>
                <input type="text" id="setting-designation" class="form-control" value="${client.designation}">
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Corporate Email</label>
                <input type="email" id="setting-email" class="form-control" value="${client.email}">
              </div>
              <div class="form-group">
                <label class="form-label">Direct Phone</label>
                <input type="tel" id="setting-phone" class="form-control" value="${client.phone}">
              </div>
            </div>
          </div>

          <!-- Delivery Destination Plant -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom: 0.25rem;">Primary Weaving & Garmenting Mill</h3>
            <p class="card-subtitle" style="margin-bottom: 1.25rem;">Default plant warehouse destination for bulk roll truck logistics</p>

            <div class="form-group">
              <label class="form-label">Default Shipping Mill Facility</label>
              <textarea id="setting-plant" class="form-control" rows="2">${client.shippingPlant}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Registered Corporate Billing Office</label>
              <textarea id="setting-billing" class="form-control" rows="2">${client.billingAddress}</textarea>
            </div>
          </div>
        </div>

        <!-- Right: Notification Preferences, Security & Reset -->
        <div style="display: flex; flex-direction: column; gap: 1.75rem;">
          <!-- Notification Preferences -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom: 0.25rem;">Alert Preferences</h3>
            <p class="card-subtitle" style="margin-bottom: 1.25rem;">Real-time automated channels</p>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 0.88rem; cursor: pointer;">
                <div>
                  <strong>WhatsApp Production Alerts</strong>
                  <div style="font-size: 0.76rem; color: var(--color-muted-text);">Daily pick counts and stage completions</div>
                </div>
                <input type="checkbox" checked style="accent-color: var(--color-textile-vermilion); width: 18px; height: 18px;">
              </label>

              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 0.88rem; cursor: pointer;">
                <div>
                  <strong>Email Quotation Approvals</strong>
                  <div style="font-size: 0.76rem; color: var(--color-muted-text);">Instant dispatch when Admin approves price revision</div>
                </div>
                <input type="checkbox" checked style="accent-color: var(--color-textile-vermilion); width: 18px; height: 18px;">
              </label>

              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 0.88rem; cursor: pointer;">
                <div>
                  <strong>Milestone Payment Reminders</strong>
                  <div style="font-size: 0.76rem; color: var(--color-muted-text);">Notifications 48 hours prior to invoice due date</div>
                </div>
                <input type="checkbox" checked style="accent-color: var(--color-textile-vermilion); width: 18px; height: 18px;">
              </label>
            </div>
          </div>

          <!-- Dedicated Relationship Manager -->
          <div class="card" style="background: var(--color-warm-ivory);">
            <div style="font-size: 0.74rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted-text); margin-bottom: 0.35rem;">Assigned Mill Merchandiser</div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--color-deep-charcoal);">${client.relationshipManager}</h4>
            <p style="font-size: 0.8rem; color: var(--color-muted-text); margin-top: 0.25rem;">Senior VP — Production Merchandising & Loom Allocations</p>
            <div style="margin-top: 1rem;">
              <a href="#quotations" class="btn btn-primary btn-sm" style="width: 100%;">
                Open Merchandiser Chat
              </a>
            </div>
          </div>

          <!-- Prototype State Reset -->
          <div class="card" style="border: 1px dashed var(--color-light-border);">
            <h3 class="card-title" style="font-size: 0.95rem; margin-bottom: 0.25rem;">Prototype Data Management</h3>
            <p class="card-subtitle" style="margin-bottom: 1rem;">Reset sample orders, chats, and payment ledger back to factory default</p>
            <button onclick="SettingsPage.resetPrototypeData()" class="btn btn-secondary btn-sm" style="width: 100%; color: var(--color-textile-vermilion); border-color: var(--color-vermilion-border);">
              Reset Sample Prototype State
            </button>
          </div>
        </div>
      </div>
    `;
  },

  saveSettings() {
    const client = StorageManager.getClient();
    client.company = document.getElementById("setting-company")?.value || client.company;
    client.contactPerson = document.getElementById("setting-contact")?.value || client.contactPerson;
    client.designation = document.getElementById("setting-designation")?.value || client.designation;
    client.email = document.getElementById("setting-email")?.value || client.email;
    client.phone = document.getElementById("setting-phone")?.value || client.phone;
    client.shippingPlant = document.getElementById("setting-plant")?.value || client.shippingPlant;
    client.billingAddress = document.getElementById("setting-billing")?.value || client.billingAddress;
    client.gstin = document.getElementById("setting-gstin")?.value || client.gstin;

    StorageManager.setClient(client);

    // Update Header
    const nameEl = document.getElementById("header-user-name");
    if (nameEl) nameEl.textContent = client.contactPerson;

    App.showToast("Account settings saved successfully.", "success");
  },

  resetPrototypeData() {
    if (confirm("Reset all prototype data to initial sample states?")) {
      StorageManager.resetAll();
      App.showToast("Prototype reset to factory sample data.", "info");
      setTimeout(() => {
        Navigation.handleHashChange();
      }, 400);
    }
  }
};

