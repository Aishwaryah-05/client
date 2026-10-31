/**
 * LOOMPILOT — Create New Manufacturing Order Wizard
 * Page 3: 4-Step Interactive Order Creation Wizard
 */

const OrderWizard = {
  currentStep: 1,
  preSelectedProductId: null,
  orderData: {
    productType: "catalogue", // "catalogue" or "custom"
    productId: "",
    productName: "",
    quantityMetres: 5000,
    gsm: 210,
    widthInches: 58,
    colorway: "Navy Blue #19-4024 TCX",
    construction: "2/1 Twill",
    specialFinish: "Mercerized, Pre-Shrunk (< 1.5%)",
    specialRequirements: "Strict 4-point inspection required. Roll length 100m continuous.",
    deliveryDate: "",
    deliveryAddress: "",
    shippingInstructions: "Palletized shrink-wrapped delivery with QC test certificate."
  },

  render() {
    const container = document.getElementById("view-create-order");
    if (!container) return;

    const client = StorageManager.getClient();
    const products = StorageManager.getProducts();

    // If navigated from catalogue with a pre-selection
    if (this.preSelectedProductId) {
      const prod = StorageManager.getProductById(this.preSelectedProductId);
      if (prod) {
        this.orderData.productId = prod.id;
        this.orderData.productName = prod.name;
        this.orderData.gsm = prod.gsm;
        this.orderData.widthInches = prod.widthInches;
        this.orderData.construction = prod.weave;
        this.orderData.quantityMetres = prod.moq;
        this.orderData.productType = prod.categoryCode === "custom" ? "custom" : "catalogue";
      }
      this.preSelectedProductId = null; // consume
    } else if (!this.orderData.productId && products.length > 0) {
      this.orderData.productId = products[0].id;
      this.orderData.productName = products[0].name;
      this.orderData.gsm = products[0].gsm;
      this.orderData.widthInches = products[0].widthInches;
      this.orderData.construction = products[0].weave;
      this.orderData.quantityMetres = products[0].moq;
    }

    if (!this.orderData.deliveryAddress) {
      this.orderData.deliveryAddress = client.shippingPlant;
    }

    // Default target delivery date: 4 weeks from today
    if (!this.orderData.deliveryDate) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 28);
      this.orderData.deliveryDate = targetDate.toISOString().split("T")[0];
    }

    container.innerHTML = `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Create Manufacturing Order</h1>
          <p class="page-description">Configure your fabric specifications, yardage volume, and mill delivery parameters for Admin quotation and loom allocation.</p>
        </div>
        <div class="page-header-actions">
          <button onclick="OrderWizard.resetForm()" class="btn btn-secondary btn-sm">Reset Form</button>
        </div>
      </div>

      <div class="textile-strip"></div>

      <div class="order-wizard-card">
        <!-- Wizard Progress Bar -->
        <div class="wizard-stepper-nav">
          <div class="wizard-step-node ${this.currentStep === 1 ? 'active' : ''} ${this.currentStep > 1 ? 'completed' : ''}" onclick="OrderWizard.goToStep(1)">
            <div class="wizard-step-circle">1</div>
            <span class="wizard-step-label">Select Fabric</span>
          </div>

          <div class="wizard-step-node ${this.currentStep === 2 ? 'active' : ''} ${this.currentStep > 2 ? 'completed' : ''}" onclick="OrderWizard.goToStep(2)">
            <div class="wizard-step-circle">2</div>
            <span class="wizard-step-label">Requirements</span>
          </div>

          <div class="wizard-step-node ${this.currentStep === 3 ? 'active' : ''} ${this.currentStep > 3 ? 'completed' : ''}" onclick="OrderWizard.goToStep(3)">
            <div class="wizard-step-circle">3</div>
            <span class="wizard-step-label">Delivery & Plant</span>
          </div>

          <div class="wizard-step-node ${this.currentStep === 4 ? 'active' : ''}" onclick="OrderWizard.goToStep(4)">
            <div class="wizard-step-circle">4</div>
            <span class="wizard-step-label">Review & Submit</span>
          </div>
        </div>

        <!-- Wizard Panes Container -->
        <div id="wizard-panes-wrapper">
          <!-- Step 1: Select Product -->
          <div class="wizard-step-pane ${this.currentStep === 1 ? 'active-step' : ''}" id="step-pane-1">
            <h2 class="wizard-section-heading">Step 1: Choose Product Source</h2>
            <p class="wizard-section-sub">Select a verified fabric from our production catalogue or request a bespoke yarn & weave construction from our R&D mills.</p>

            <div class="radio-cards-grid">
              <div class="radio-card-option ${this.orderData.productType === 'catalogue' ? 'selected' : ''}" onclick="OrderWizard.setProductType('catalogue')">
                <div class="radio-card-dot"></div>
                <div>
                  <strong style="display: block; font-size: 0.95rem; color: var(--color-deep-charcoal); margin-bottom: 2px;">Standard Catalogue Fabric</strong>
                  <span style="font-size: 0.8rem; color: var(--color-muted-text); line-height: 1.4; display: block;">Choose from established mill specifications with validated yarn count, lead times, and proven tensile tolerances.</span>
                </div>
              </div>

              <div class="radio-card-option ${this.orderData.productType === 'custom' ? 'selected' : ''}" onclick="OrderWizard.setProductType('custom')">
                <div class="radio-card-dot"></div>
                <div>
                  <strong style="display: block; font-size: 0.95rem; color: var(--color-deep-charcoal); margin-bottom: 2px;">Custom Weave / Bespoke Blend</strong>
                  <span style="font-size: 0.8rem; color: var(--color-muted-text); line-height: 1.4; display: block;">Request tailor-made fiber compositions (e.g. Silk-Linen, Tencel, Cordura) with specialized jacquard or dobby architectures.</span>
                </div>
              </div>
            </div>

            ${this.orderData.productType === 'catalogue' ? `
              <div class="form-group">
                <label class="form-label">
                  <span>Select Catalogue Product</span>
                  <span class="form-hint">8 Available Mill Formulas</span>
                </label>
                <select class="form-control" onchange="OrderWizard.onSelectCatalogueProduct(this.value)">
                  ${products.map(p => `
                    <option value="${p.id}" ${p.id === this.orderData.productId ? 'selected' : ''}>${p.name} (${p.category} — ${p.gsm} GSM)</option>
                  `).join('')}
                </select>
              </div>
            ` : `
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">Custom Fabric Name / Reference</label>
                  <input type="text" class="form-control" value="${this.orderData.productName || 'Bespoke Compact Yarn Twill'}" oninput="OrderWizard.orderData.productName = this.value" placeholder="e.g. 60s Organic Cotton-Modal Satin">
                </div>
                <div class="form-group">
                  <label class="form-label">Target Weave Architecture</label>
                  <input type="text" class="form-control" value="${this.orderData.construction || 'Custom Satin / Dobby'}" oninput="OrderWizard.orderData.construction = this.value" placeholder="e.g. 4/1 Satin Weave">
                </div>
              </div>
            `}

            <div class="wizard-footer-actions">
              <a href="#catalogue" class="btn btn-secondary">Browse Catalogue</a>
              <button onclick="OrderWizard.nextStep()" class="btn btn-primary">
                Proceed to Specifications
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          <!-- Step 2: Order Requirements -->
          <div class="wizard-step-pane ${this.currentStep === 2 ? 'active-step' : ''}" id="step-pane-2">
            <h2 class="wizard-section-heading">Step 2: Order Requirements & Fabric Specs</h2>
            <p class="wizard-section-sub">Define exact manufacturing dimensions, desired colorway, weight, and volume in metres.</p>

            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label">
                  <span>Required Quantity (Metres)</span>
                  <span class="form-hint">MOQ: 1,500m</span>
                </label>
                <input type="number" class="form-control" value="${this.orderData.quantityMetres}" min="1500" step="500" oninput="OrderWizard.orderData.quantityMetres = parseInt(this.value) || 1500">
              </div>

              <div class="form-group">
                <label class="form-label">Fabric Weight (GSM)</label>
                <input type="number" class="form-control" value="${this.orderData.gsm}" oninput="OrderWizard.orderData.gsm = parseInt(this.value) || 200">
              </div>

              <div class="form-group">
                <label class="form-label">Finished Width (Inches)</label>
                <input type="number" class="form-control" value="${this.orderData.widthInches}" oninput="OrderWizard.orderData.widthInches = parseInt(this.value) || 58">
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Colourway / Pantone Reference</label>
                <input type="text" class="form-control" value="${this.orderData.colorway}" oninput="OrderWizard.orderData.colorway = this.value" placeholder="e.g. Royal Navy #19-4024 TCX">
              </div>

              <div class="form-group">
                <label class="form-label">Fabric Construction / Weave</label>
                <input type="text" class="form-control" value="${this.orderData.construction}" oninput="OrderWizard.orderData.construction = this.value">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Special Finish & Chemical Treatments</label>
              <input type="text" class="form-control" value="${this.orderData.specialFinish}" oninput="OrderWizard.orderData.specialFinish = this.value" placeholder="e.g. Mercerized, Teflon Repellent, Bio-Polished, Flame Retardant">
            </div>

            <div class="form-group">
              <label class="form-label">Technical Reference Document / Spec Sheet (Optional)</label>
              <div class="file-dropzone" onclick="document.getElementById('wizard-file-input').click()">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted-text)" stroke-width="2" style="margin-bottom: 0.5rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div style="font-weight: 600; font-size: 0.88rem; color: var(--color-deep-charcoal);">Click to upload tech pack or swatch reference (PDF, CAD, PNG)</div>
                <div style="font-size: 0.76rem; color: var(--color-muted-text); margin-top: 2px;">Supported files up to 25MB</div>
                <input type="file" id="wizard-file-input" style="display: none;" onchange="App.showToast('Reference spec sheet attached successfully!', 'success')">
              </div>
            </div>

            <div class="wizard-footer-actions">
              <button onclick="OrderWizard.prevStep()" class="btn btn-secondary">Back to Step 1</button>
              <button onclick="OrderWizard.nextStep()" class="btn btn-primary">
                Proceed to Delivery Info
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          <!-- Step 3: Delivery Information -->
          <div class="wizard-step-pane ${this.currentStep === 3 ? 'active-step' : ''}" id="step-pane-3">
            <h2 class="wizard-section-heading">Step 3: Delivery Schedule & Mill Logistics</h2>
            <p class="wizard-section-sub">Specify dispatch deadline, destination factory address, and inspection standards.</p>

            <div class="form-group">
              <label class="form-label">
                <span>Required Delivery Deadline</span>
                <span class="form-hint">Standard production lead time is 3-5 weeks</span>
              </label>
              <input type="date" class="form-control" value="${this.orderData.deliveryDate}" oninput="OrderWizard.orderData.deliveryDate = this.value">
            </div>

            <div class="form-group">
              <label class="form-label">Destination Mill / Garment Factory Address</label>
              <textarea class="form-control" rows="3" oninput="OrderWizard.orderData.deliveryAddress = this.value">${this.orderData.deliveryAddress}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Logistics, Packaging & Inspection Instructions</label>
              <textarea class="form-control" rows="2" oninput="OrderWizard.orderData.shippingInstructions = this.value">${this.orderData.shippingInstructions}</textarea>
            </div>

            <div class="wizard-footer-actions">
              <button onclick="OrderWizard.prevStep()" class="btn btn-secondary">Back to Requirements</button>
              <button onclick="OrderWizard.nextStep()" class="btn btn-primary">
                Review Complete Order
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          <!-- Step 4: Review and Submit -->
          <div class="wizard-step-pane ${this.currentStep === 4 ? 'active-step' : ''}" id="step-pane-4">
            <h2 class="wizard-section-heading">Step 4: Review Order Summary & Commercial Terms</h2>
            <p class="wizard-section-sub">Confirm manufacturing details before submitting for official Admin quotation and loom allocation.</p>

            <div class="order-summary-box">
              <div class="order-summary-row">
                <span style="color: var(--color-muted-text);">Selected Fabric</span>
                <strong>${this.orderData.productName}</strong>
              </div>
              <div class="order-summary-row">
                <span style="color: var(--color-muted-text);">Order Volume</span>
                <strong style="color: var(--color-textile-vermilion);">${this.orderData.quantityMetres.toLocaleString("en-IN")} metres</strong>
              </div>
              <div class="order-summary-row">
                <span style="color: var(--color-muted-text);">Weight & Width</span>
                <strong>${this.orderData.gsm} GSM • ${this.orderData.widthInches}" Finished Width</strong>
              </div>
              <div class="order-summary-row">
                <span style="color: var(--color-muted-text);">Shade / Colorway</span>
                <strong>${this.orderData.colorway}</strong>
              </div>
              <div class="order-summary-row">
                <span style="color: var(--color-muted-text);">Weave Construction</span>
                <strong>${this.orderData.construction}</strong>
              </div>
              <div class="order-summary-row">
                <span style="color: var(--color-muted-text);">Special Finishes</span>
                <strong>${this.orderData.specialFinish}</strong>
              </div>
              <div class="order-summary-row">
                <span style="color: var(--color-muted-text);">Target Delivery</span>
                <strong>${this.orderData.deliveryDate}</strong>
              </div>
              <div class="order-summary-row">
                <span style="color: var(--color-muted-text);">Delivery Destination</span>
                <strong style="max-width: 480px; text-align: right;">${this.orderData.deliveryAddress}</strong>
              </div>
            </div>

            <div style="background: rgba(32, 132, 90, 0.08); border: 1px solid rgba(32, 132, 90, 0.25); border-radius: var(--radius-sm); padding: 1rem 1.25rem; font-size: 0.82rem; color: #16573B; margin-bottom: 1.5rem; display: flex; gap: 0.75rem; align-items: flex-start;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <div>
                <strong>Commercial Workflow Assurance:</strong> Upon submission, this request enters <strong>Awaiting Quotation</strong>. LoomPilot's merchandising team prepares a binding price per metre and capacity schedule. You can negotiate price or delivery terms directly via chat before accepting and triggering Stage 1 (Advance Invoice).
              </div>
            </div>

            <div class="wizard-footer-actions">
              <button onclick="OrderWizard.prevStep()" class="btn btn-secondary">Back to Delivery Info</button>
              <div style="display: flex; gap: 0.85rem;">
                <button onclick="OrderWizard.saveDraft()" class="btn btn-secondary">Save as Draft</button>
                <button onclick="OrderWizard.submitOrder()" class="btn btn-primary btn-lg">
                  Submit Order Request
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Confirmation Modal -->
      <div id="order-confirm-modal" class="modal-overlay"></div>
    `;
  },

  setProductType(type) {
    this.orderData.productType = type;
    if (type === "custom") {
      this.orderData.productId = "PROD-CUSTOM-BESPOKE";
      this.orderData.productName = "Custom Mill-Engineered Weave";
    }
    this.render();
  },

  onSelectCatalogueProduct(id) {
    const product = StorageManager.getProductById(id);
    if (product) {
      this.orderData.productId = product.id;
      this.orderData.productName = product.name;
      this.orderData.gsm = product.gsm;
      this.orderData.widthInches = product.widthInches;
      this.orderData.construction = product.weave;
      this.orderData.quantityMetres = Math.max(this.orderData.quantityMetres, product.moq);
    }
  },

  goToStep(step) {
    this.currentStep = step;
    this.render();
  },

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
      this.render();
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.render();
    }
  },

  resetForm() {
    this.currentStep = 1;
    this.render();
    App.showToast("Order form reset.", "info");
  },

  saveDraft() {
    App.showToast("Order saved as draft in local cache.", "info");
  },

  submitOrder() {
    // Generate prototype order
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `LP-2026-${randomSuffix}`;
    const client = StorageManager.getClient();

    const newOrder = {
      id: newOrderId,
      productId: this.orderData.productId,
      productName: this.orderData.productName,
      category: this.orderData.productType === "custom" ? "Custom Textile" : "Woven Fabrics",
      colorway: this.orderData.colorway,
      orderedMetres: this.orderData.quantityMetres,
      producedMetres: 0,
      remainingMetres: this.orderData.quantityMetres,
      progressPercent: 0,
      unitPrice: 225, // Mock baseline
      totalValue: this.orderData.quantityMetres * 225,
      orderDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      expectedDelivery: this.orderData.deliveryDate,
      currentStageNumber: 1,
      currentStageName: "Quote Accepted",
      status: "Awaiting Quotation",
      spotlight: false,
      specifications: {
        gsm: this.orderData.gsm,
        width: `${this.orderData.widthInches} inches`,
        yarnCount: "Engineered spinning",
        weave: this.orderData.construction,
        finish: this.orderData.specialFinish,
        packaging: "Standard industrial roll packaging"
      },
      deliveryAddress: this.orderData.deliveryAddress,
      stages: PRODUCTION_STAGES.map((s, idx) => ({
        step: s.step,
        name: s.name,
        status: idx === 0 ? "active" : "upcoming",
        date: idx === 0 ? "Awaiting Quote Review" : "Pending",
        notes: idx === 0 ? "Order request received. Merchandiser is calculating loom capacity and pricing." : "Pending quote acceptance."
      })),
      milestones: [
        { id: `MS-${randomSuffix}-1`, phase: "Milestone 1 — 30% Advance on Acceptance", amount: Math.round(this.orderData.quantityMetres * 225 * 0.3), status: "pending", invoiceId: `INV-2026-0${randomSuffix}`, dueDate: "Upon Acceptance" },
        { id: `MS-${randomSuffix}-2`, phase: "Milestone 2 — 40% Loom Weaving Milestone", amount: Math.round(this.orderData.quantityMetres * 225 * 0.4), status: "upcoming", invoiceId: `INV-2026-0${randomSuffix + 1}`, dueDate: "Mid Production" },
        { id: `MS-${randomSuffix}-3`, phase: "Milestone 3 — 30% Pre-Dispatch Balance", amount: Math.round(this.orderData.quantityMetres * 225 * 0.3), status: "upcoming", invoiceId: `INV-2026-0${randomSuffix + 2}`, dueDate: "Prior Dispatch" }
      ]
    };

    // Save into LocalStorage
    StorageManager.addOrder(newOrder);

    // Create Initial Chat Thread
    StorageManager.addChatMessage(newOrderId, {
      id: "msg-" + Date.now(),
      sender: "assistant",
      senderName: "LoomPilot Assistant",
      avatar: "ai",
      time: "Just now",
      type: "system_quote",
      text: `Order #${newOrderId} for ${newOrder.orderedMetres.toLocaleString()}m of ${newOrder.productName} has been received. Our sales merchandising team is generating your formal quotation. You can submit questions or volume requests here at any time.`
    });

    // Show Confirmation Modal
    const modal = document.getElementById("order-confirm-modal");
    if (modal) {
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--color-deep-charcoal);">Order Submitted Successfully!</h2>
            <button onclick="OrderWizard.closeConfirmModal()" class="btn btn-secondary btn-icon-only">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body" style="text-align: center; padding: 2.5rem 1.5rem;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--color-success-bg); color: var(--color-success); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--color-deep-charcoal); margin-bottom: 0.5rem;">Order Reference: ${newOrderId}</h3>
            <p style="font-size: 0.92rem; color: var(--color-muted-text); max-width: 480px; margin: 0 auto 1.75rem;">
              Your order request for <strong>${newOrder.orderedMetres.toLocaleString()}m of ${newOrder.productName}</strong> has been logged with LoomPilot Mill Ops.
            </p>

            <div style="background: var(--color-warm-ivory); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--color-light-border); text-align: left; max-width: 480px; margin: 0 auto 2rem; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: var(--color-muted-text);">Current Lifecycle Status</span>
                <span class="badge badge-amber">Awaiting Quotation</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: var(--color-muted-text);">Next Stage</span>
                <strong>Admin Quote Review & Counter-Offer</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--color-muted-text);">Target Delivery Date</span>
                <strong>${newOrder.expectedDelivery}</strong>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center;">
              <button onclick="OrderWizard.closeConfirmModal(); Navigation.navigateTo('orders');" class="btn btn-secondary">
                View in My Orders
              </button>
              <button onclick="OrderWizard.closeConfirmModal(); Navigation.navigateTo('quotations', { id: '${newOrderId}' });" class="btn btn-primary">
                Open Negotiation Chat
              </button>
            </div>
          </div>
        </div>
      `;
      modal.classList.add("active");
    }

    App.showToast(`Order #${newOrderId} submitted successfully!`, "success");
    this.currentStep = 1;
  },

  closeConfirmModal() {
    const modal = document.getElementById("order-confirm-modal");
    if (modal) modal.classList.remove("active");
  }
};

