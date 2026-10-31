/**
 * LOOMPILOT — Production Tracking Controller
 * Page 5: 8-Stage Manufacturing Stepper, Live Loom Metrics & Production Trends
 */

const TrackingPage = {
  selectedOrderId: "LP-2026-8841",
  selectedStageStep: 4,

  render(params) {
    const container = document.getElementById("view-tracking");
    if (!container) return;

    if (params && params.id) {
      this.selectedOrderId = params.id;
    }

    const orders = StorageManager.getOrders();
    let currentOrder = StorageManager.getOrderById(this.selectedOrderId);
    if (!currentOrder && orders.length > 0) {
      currentOrder = orders[0];
      this.selectedOrderId = currentOrder.id;
    }

    if (!currentOrder) return;
    this.selectedStageStep = currentOrder.currentStageNumber || 1;

    container.innerHTML = `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Production Tracking</h1>
          <p class="page-description">Real-time visibility into the 8-stage manufacturing lifecycle across spinning lots, loom sheds, finishing vats, and dispatch lines.</p>
        </div>
        <div class="page-header-actions">
          <button onclick="TrackingPage.refreshFeed()" class="btn btn-secondary btn-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Sync Mill Feed
          </button>
        </div>
      </div>

      <div class="textile-strip"></div>

      <!-- Order Selector Toolbar -->
      <div class="tracking-selector-card">
        <div>
          <label style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-muted-text); display: block; margin-bottom: 0.35rem;">Currently Tracking Manufacturing Contract</label>
          <select class="order-selector-select" onchange="TrackingPage.selectOrder(this.value)">
            ${orders.map(o => `
              <option value="${o.id}" ${o.id === this.selectedOrderId ? 'selected' : ''}>
                ${o.id} — ${o.productName} (${o.orderedMetres.toLocaleString()}m • ${o.status})
              </option>
            `).join('')}
          </select>
        </div>

        <div style="display: flex; gap: 1.5rem; align-items: center;">
          <div>
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted-text); font-weight: 700;">Current Stage</span>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-textile-vermilion);">
              Stage ${currentOrder.currentStageNumber} of 8: ${currentOrder.currentStageName}
            </div>
          </div>
          <div>
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted-text); font-weight: 700;">Target Dispatch</span>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-deep-charcoal);">${currentOrder.expectedDelivery}</div>
          </div>
        </div>
      </div>

      <!-- Production Summary Metric Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 1.75rem;">
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Contracted Metres</span>
            <div class="metric-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
          </div>
          <div class="metric-value">${currentOrder.orderedMetres.toLocaleString("en-IN")} <span style="font-size: 0.9rem; color: var(--color-muted-text);">m</span></div>
          <div class="metric-sub">Standard roll packing</div>
        </div>

        <div class="metric-card active-metric">
          <div class="metric-top">
            <span class="metric-label">Woven & Passed</span>
            <div class="metric-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <div class="metric-value" style="color: var(--color-success);">${currentOrder.producedMetres.toLocaleString("en-IN")} <span style="font-size: 0.9rem; color: var(--color-muted-text);">m</span></div>
          <div class="metric-sub">${currentOrder.progressPercent || 0}% Completion achieved</div>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Remaining Metres</span>
            <div class="metric-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div class="metric-value">${currentOrder.remainingMetres.toLocaleString("en-IN")} <span style="font-size: 0.9rem; color: var(--color-muted-text);">m</span></div>
          <div class="metric-sub">Est. ~3 days on loom shed</div>
        </div>

        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-label">Target Dispatch</span>
            <div class="metric-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
          </div>
          <div class="metric-value" style="font-size: 1.45rem;">${currentOrder.expectedDelivery}</div>
          <div class="metric-sub"><span style="color: var(--color-success); font-weight: 600;">● On Schedule</span></div>
        </div>
      </div>

      <!-- EXACT 8-STAGE PRODUCTION TIMELINE -->
      <div class="production-timeline-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <h3 class="card-title">Production Stepper: 8 Manufacturing Milestones</h3>
            <p class="card-subtitle">Click any stage node below to inspect lab tests, pick rate, and batch reports</p>
          </div>
          <span class="badge badge-coral">Active: Stage ${currentOrder.currentStageNumber}</span>
        </div>

        <div class="production-timeline-track">
          ${PRODUCTION_STAGES.map(stage => {
            let stateClass = "upcoming";
            if (stage.step < currentOrder.currentStageNumber) {
              stateClass = "completed";
            } else if (stage.step === currentOrder.currentStageNumber) {
              stateClass = "active";
            }

            const stageHistory = (currentOrder.stages || []).find(s => s.step === stage.step);
            const dateLabel = stageHistory ? stageHistory.date : (stage.step < currentOrder.currentStageNumber ? "Completed" : "Upcoming");

            return `
              <div class="timeline-step ${stateClass}" onclick="TrackingPage.inspectStage(${stage.step})">
                <div class="timeline-step-circle">
                  ${stateClass === 'completed' ? `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ` : stage.step}
                </div>
                <div class="timeline-step-title">${stage.name}</div>
                <div class="timeline-step-date">${dateLabel}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Selected Stage Detail Box -->
        <div id="stage-detail-inspector-box">
          <!-- Injected by inspectStage() -->
        </div>
      </div>

      <!-- Daily Production Visualization & Loom Performance -->
      <div class="chart-container-card">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title">Daily Loom Output & Weaving Velocity</h3>
            <p class="card-subtitle">Actual metres woven vs planned mill output targets across assigned Air-Jet looms</p>
          </div>
          <div style="display: flex; gap: 1rem; font-size: 0.8rem; align-items: center;">
            <span style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="width: 12px; height: 12px; border-radius: 2px; background: var(--color-textile-vermilion);"></span>
              Actual Metres
            </span>
            <span style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="width: 12px; height: 12px; border-radius: 2px; background: #D5CDC0;"></span>
              Planned Target
            </span>
          </div>
        </div>

        ${this.renderProductionChart(currentOrder)}
      </div>
    `;

    this.inspectStage(this.selectedStageStep);
  },

  selectOrder(orderId) {
    this.selectedOrderId = orderId;
    this.render();
  },

  inspectStage(stepNumber) {
    this.selectedStageStep = stepNumber;
    const order = StorageManager.getOrderById(this.selectedOrderId);
    const stageMeta = PRODUCTION_STAGES.find(s => s.step === stepNumber);
    const stageHistory = (order.stages || []).find(s => s.step === stepNumber);

    const box = document.getElementById("stage-detail-inspector-box");
    if (!box || !stageMeta) return;

    let badgeClass = "badge-neutral";
    let statusText = "Upcoming Phase";
    if (stepNumber < order.currentStageNumber) {
      badgeClass = "badge-green";
      statusText = "Completed & Certified";
    } else if (stepNumber === order.currentStageNumber) {
      badgeClass = "badge-coral";
      statusText = "Active Phase in Production";
    }

    box.innerHTML = `
      <div class="active-stage-detail-box">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="badge ${badgeClass}" style="margin-bottom: 0.35rem;">${statusText}</span>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--color-deep-charcoal);">
              Stage ${stageMeta.step}: ${stageMeta.name}
            </h4>
            <p style="font-size: 0.86rem; color: var(--color-muted-text); margin-top: 2px;">${stageMeta.desc}</p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.74rem; text-transform: uppercase; color: var(--color-muted-text); font-weight: 700;">Recorded Date</span>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-deep-charcoal);">${stageHistory ? stageHistory.date : 'Scheduled in Sequence'}</div>
          </div>
        </div>

        <div style="background: var(--color-white); border: 1px solid var(--color-light-border); border-radius: var(--radius-sm); padding: 1rem 1.25rem; font-size: 0.88rem; line-height: 1.45; color: var(--color-deep-charcoal);">
          <strong>Mill Supervisor Notes:</strong>
          <p style="margin-top: 0.25rem; color: var(--color-muted-text);">${stageHistory?.notes || 'Standard protocol operating under ISO 9001 quality parameters.'}</p>
        </div>
      </div>
    `;
  },

  renderProductionChart(order) {
    const daily = order.dailyProduction || [
      { day: "Day 1", metres: 1000, target: 1200 },
      { day: "Day 2", metres: 1250, target: 1200 },
      { day: "Day 3", metres: 1400, target: 1300 },
      { day: "Day 4", metres: 1350, target: 1400 }
    ];

    const maxVal = Math.max(...daily.map(d => Math.max(d.metres, d.target))) * 1.15;

    return `
      <div style="display: grid; grid-template-columns: repeat(${daily.length}, 1fr); gap: 1.5rem; align-items: flex-end; height: 220px; padding: 1.5rem 0 0.5rem; border-bottom: 1px solid var(--color-light-border);">
        ${daily.map(item => {
          const actualHeight = Math.round((item.metres / maxVal) * 160);
          const targetHeight = Math.round((item.target / maxVal) * 160);

          return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; height: 100%; justify-content: flex-end;">
              <div style="font-size: 0.76rem; font-weight: 700; color: var(--color-deep-charcoal);">${item.metres.toLocaleString()}m</div>
              <div style="display: flex; gap: 6px; align-items: flex-end; width: 100%; max-width: 54px; height: 160px;">
                <!-- Target Bar -->
                <div style="flex: 1; height: ${targetHeight}px; background: #E2DAD0; border-radius: 4px 4px 0 0;" title="Target: ${item.target}m"></div>
                <!-- Actual Bar -->
                <div style="flex: 1; height: ${actualHeight}px; background: var(--color-textile-vermilion); border-radius: 4px 4px 0 0;" title="Actual: ${item.metres}m"></div>
              </div>
              <div style="font-size: 0.78rem; font-weight: 600; color: var(--color-muted-text);">${item.day}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  refreshFeed() {
    App.showToast("Loom telemetry synchronized with plant floor.", "success");
    this.render();
  }
};

