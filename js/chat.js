/**
 * LOOMPILOT — Quotations & Negotiation Chat Controller
 * Page 6: Professional B2B Negotiation Workspace with AI Concierge & Admin Revision Flow
 */

const ChatPage = {
  activeOrderId: "LP-2026-8854",

  render(params) {
    const container = document.getElementById("view-quotations");
    if (!container) return;

    if (params && params.id) {
      this.activeOrderId = params.id;
    }

    const chats = StorageManager.getChats();
    const orderIds = Object.keys(chats);

    // If activeOrderId not in chats, pick first or initialize
    if (!chats[this.activeOrderId] && orderIds.length > 0) {
      this.activeOrderId = orderIds[0];
    }

    const currentChat = chats[this.activeOrderId] || {
      orderId: this.activeOrderId,
      productName: "Textile Fabric",
      orderQuantity: "5,000 m",
      quotedPrice: "₹250 / m",
      totalQuote: "₹12,50,000",
      validity: "Valid for 7 days",
      deliveryDate: "In 4 weeks",
      status: "In Negotiation",
      messages: []
    };

    container.innerHTML = `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Quotations & Negotiation Workspace</h1>
          <p class="page-description">Collaborate with LoomPilot AI concierge and Senior Mill Merchandisers on price per metre, delivery windows, and binding contracts.</p>
        </div>
      </div>

      <div class="textile-strip"></div>

      <div class="chat-workspace-grid">
        <!-- Left Panel: Conversations List -->
        <div class="chat-thread-list-panel">
          <div class="chat-panel-header">
            <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--color-deep-charcoal);">Active Negotiations</h3>
            <span style="font-size: 0.76rem; color: var(--color-muted-text);">${orderIds.length} Order Threads</span>
          </div>

          <div class="chat-thread-scroll">
            ${orderIds.map(id => {
              const c = chats[id];
              const isActive = id === this.activeOrderId;
              return `
                <div class="thread-item-card ${isActive ? 'active' : ''}" onclick="ChatPage.switchThread('${id}')">
                  <div class="thread-item-top">
                    <span class="thread-order-tag">${id}</span>
                    <span class="badge ${c.status.includes('Approved') ? 'badge-amber' : 'badge-green'}" style="font-size: 0.68rem; padding: 1px 6px;">
                      ${c.status}
                    </span>
                  </div>
                  <div class="thread-fabric-name">${c.productName}</div>
                  <div class="thread-quote-preview">
                    ${c.quotedPrice} • ${c.orderQuantity}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right Panel: Conversation Stream & Context -->
        <div class="chat-conversation-panel">
          <!-- Order Context Bar -->
          <div class="chat-order-context-bar">
            <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
              <div class="context-metric-pill">
                <span class="context-metric-label">Quoted Fabric</span>
                <span class="context-metric-val" style="font-size: 0.88rem;">${currentChat.productName}</span>
              </div>
              <div class="context-metric-pill">
                <span class="context-metric-label">Volume</span>
                <span class="context-metric-val">${currentChat.orderQuantity}</span>
              </div>
              <div class="context-metric-pill">
                <span class="context-metric-label">Current Unit Rate</span>
                <span class="context-metric-val" style="color: var(--color-textile-vermilion);">${currentChat.quotedPrice}</span>
              </div>
              <div class="context-metric-pill">
                <span class="context-metric-label">Total Commercial Value</span>
                <span class="context-metric-val">${currentChat.totalQuote}</span>
              </div>
              <div class="context-metric-pill">
                <span class="context-metric-label">Target Dispatch</span>
                <span class="context-metric-val">${currentChat.deliveryDate}</span>
              </div>
            </div>

            ${currentChat.status.includes('Approved') || currentChat.status.includes('Revision') ? `
              <button onclick="ChatPage.acceptQuotation('${this.activeOrderId}')" class="btn btn-success btn-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Accept Quote & Lock Contract
              </button>
            ` : ''}
          </div>

          <!-- Messages Stream Viewport -->
          <div class="chat-messages-viewport" id="chat-messages-viewport">
            ${currentChat.messages.map(msg => this.renderMessageBubble(msg)).join('')}
          </div>

          <!-- Quick Negotiation Prompts -->
          <div class="chat-quick-prompts-bar">
            <span style="font-size: 0.74rem; font-weight: 700; color: var(--color-muted-text); align-self: center; white-space: nowrap;">Prompt Shortcuts:</span>
            <button class="quick-prompt-chip" onclick="ChatPage.sendQuickPrompt('Can you reduce the quotation price given our bulk commitment?')">
              💰 Request Price Reduction
            </button>
            <button class="quick-prompt-chip" onclick="ChatPage.sendQuickPrompt('Can we expedite the delivery deadline by 1 week?')">
              ⏱ Expedite Delivery Schedule
            </button>
            <button class="quick-prompt-chip" onclick="ChatPage.sendQuickPrompt('Can you provide lab dip shade swatches before loom beaming?')">
              🎨 Request Lab Dip Swatches
            </button>
          </div>

          <!-- Message Input Bar -->
          <div class="chat-input-row">
            <button onclick="App.showToast('Reference spec sheet or PO document attached.', 'info')" class="btn btn-secondary btn-icon-only" title="Attach Document / Lab Report">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </button>
            <input type="text" id="chat-message-input" class="chat-text-input" placeholder="Type your negotiation message, volume query, or price counter-offer..." onkeypress="if(event.key === 'Enter') ChatPage.sendMessage()">
            <button onclick="ChatPage.sendMessage()" class="btn btn-primary" style="border-radius: var(--radius-full); padding: 0.72rem 1.4rem;">
              Send
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    this.scrollToBottom();
  },

  renderMessageBubble(msg) {
    const isClient = msg.sender === "user";
    return `
      <div class="chat-bubble-row ${isClient ? 'client-row' : ''}">
        <div class="chat-avatar ${msg.avatar || 'ai'}">
          ${msg.avatar === 'ai' ? 'AI' : (msg.avatar === 'admin' ? 'AS' : 'VM')}
        </div>

        <div class="chat-bubble-content">
          <div class="chat-sender-header">
            <span class="chat-sender-name">${msg.senderName}</span>
            <span class="chat-timestamp">${msg.time}</span>
            ${msg.badge ? `<span class="badge badge-amber" style="font-size: 0.65rem;">${msg.badge}</span>` : ''}
          </div>

          <div class="chat-bubble-text">
            ${msg.text}

            ${msg.revisedData ? `
              <div class="quotation-revision-card">
                <div class="revision-card-header">
                  <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--color-warning);">Official Revised Quote</span>
                  <span class="revision-savings-badge">Saves ${msg.revisedData.savings}</span>
                </div>
                <div class="revision-rate-row">
                  <span class="old-rate-strike">${msg.revisedData.originalRate}</span>
                  <span class="new-rate-highlight">${msg.revisedData.newRate}</span>
                  <span style="font-size: 0.85rem; color: var(--color-muted-text); font-weight: 600;">(Revised Total: ${msg.revisedData.newTotal})</span>
                </div>
                <p style="font-size: 0.78rem; color: var(--color-muted-text); margin-bottom: 0.85rem;">
                  Approved by Anil Sharma (Senior VP — Merchandising). Locks in preferential mill capacity upon acceptance.
                </p>
                <button onclick="ChatPage.acceptQuotation('${this.activeOrderId}')" class="btn btn-success btn-sm" style="width: 100%;">
                  Accept This Revised Quote & Start Production
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  switchThread(orderId) {
    this.activeOrderId = orderId;
    this.render();
  },

  sendQuickPrompt(text) {
    const input = document.getElementById("chat-message-input");
    if (input) {
      input.value = text;
      this.sendMessage();
    }
  },

  sendMessage() {
    const input = document.getElementById("chat-message-input");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const timeStr = "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Client message
    const userMsg = {
      id: "msg-" + Date.now(),
      sender: "user",
      senderName: "Vikram Malhotra (You)",
      avatar: "user",
      time: timeStr,
      text: text
    };

    StorageManager.addChatMessage(this.activeOrderId, userMsg);
    input.value = "";
    this.render();

    // AI concierge simulation
    setTimeout(() => {
      this.simulateAIResponse(text);
    }, 800);
  },

  simulateAIResponse(clientQuery) {
    const timeStr = "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lower = clientQuery.toLowerCase();

    let replyText = "Thank you Mr. Malhotra. I have recorded your inquiry and synced it with our mill merchandising logs.";
    let badge = null;

    if (lower.includes("price") || lower.includes("reduce") || lower.includes("discount") || lower.includes("cost") || lower.includes("rate")) {
      replyText = "Under LoomPilot governance, AI assistants cannot directly authorize pricing discounts. I have formatted your volume counter-offer request and escalated it directly to our Senior Merchandiser Anil Sharma for formal review.";
      badge = "Negotiation Request Forwarded to Admin";
      
      // Simulate Admin response shortly after
      setTimeout(() => {
        this.simulateAdminResponse();
      }, 2000);

    } else if (lower.includes("delivery") || lower.includes("expedite") || lower.includes("lead time") || lower.includes("week")) {
      replyText = "I have checked current loom shed allocations. Standard lead time is 4 weeks, but we can fast-track warp beam preparation on Loom Line 4. I have alerted our production scheduler to verify if delivery can be brought forward.";
    } else if (lower.includes("swatch") || lower.includes("lab dip") || lower.includes("sample")) {
      replyText = "Lab dip swatches are prepared at our R&D testing center. A 3-shade strike-off will be dispatched to your Thane plant address within 4 business days.";
    }

    const aiMsg = {
      id: "msg-" + Date.now(),
      sender: "assistant",
      senderName: "LoomPilot Assistant",
      avatar: "ai",
      time: timeStr,
      text: replyText,
      badge: badge
    };

    StorageManager.addChatMessage(this.activeOrderId, aiMsg);
    this.render();
  },

  simulateAdminResponse() {
    const timeStr = "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const order = StorageManager.getOrderById(this.activeOrderId);

    const adminMsg = {
      id: "msg-" + Date.now(),
      sender: "admin",
      senderName: "Anil Sharma (Senior VP — Merchandising)",
      avatar: "admin",
      time: timeStr,
      text: "Vikram, I reviewed your order volume. We are pleased to approve a revised rate of ₹282/metre for this batch, saving Raymond ₹2,34,000 total. Please accept the revision below so we can issue the 30% Advance Invoice and lock our spinning slots.",
      revisedData: {
        originalRate: "₹295 / m",
        newRate: "₹282 / m",
        savings: "₹2,34,000",
        newTotal: "₹50,76,000",
        status: "Admin Approved"
      }
    };

    StorageManager.addChatMessage(this.activeOrderId, adminMsg);
    this.render();
    App.showToast("Admin revised quotation received!", "success");
  },

  acceptQuotation(orderId) {
    const order = StorageManager.getOrderById(orderId);
    if (!order) return;

    // Update order status to Quote Accepted / In Production
    StorageManager.updateOrder(orderId, {
      status: "In Production",
      currentStageNumber: 1,
      currentStageName: "Quote Accepted",
      unitPrice: 282,
      totalValue: order.orderedMetres * 282
    });

    // Create advance invoice if not already created
    const advanceInvoiceNumber = `INV-2026-0501`;
    const existingInvoices = StorageManager.getInvoices();
    if (!existingInvoices.some(i => i.invoiceNumber === advanceInvoiceNumber)) {
      const advanceAmount = Math.round(order.orderedMetres * 282 * 0.3);
      existingInvoices.unshift({
        invoiceNumber: advanceInvoiceNumber,
        orderId: order.id,
        productName: order.productName,
        milestonePhase: "Milestone 1 — 30% Advance on Acceptance",
        issueDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        dueDate: "Upon Acceptance",
        amount: advanceAmount,
        paidAmount: 0,
        remainingAmount: advanceAmount,
        status: "Pending",
        pdfUrl: "#download-" + advanceInvoiceNumber
      });
      StorageManager.setInvoices(existingInvoices);
    }

    App.showToast(`Quotation accepted! Advance Invoice ${advanceInvoiceNumber} issued.`, "success");

    // Navigate to Payments page with notice
    setTimeout(() => {
      Navigation.navigateTo("payments");
    }, 600);
  },

  scrollToBottom() {
    const viewport = document.getElementById("chat-messages-viewport");
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }
};

