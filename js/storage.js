/**
 * LOOMPILOT — LocalStorage State Management
 * Keeps prototype state persistent across page navigations and refreshes
 */

const STORAGE_KEYS = {
  CLIENT: "loompilot_client",
  PRODUCTS: "loompilot_products",
  ORDERS: "loompilot_orders",
  INVOICES: "loompilot_invoices",
  PAYMENTS: "loompilot_payments",
  CHATS: "loompilot_chats",
  NOTIFICATIONS: "loompilot_notifications",
  ACTIVITIES: "loompilot_activities"
};

const StorageManager = {
  // Initialize storage with defaults if not present
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CLIENT)) {
      this.setClient(SAMPLE_CLIENT);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.setProducts(SAMPLE_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this.setOrders(INITIAL_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      this.setInvoices(INITIAL_INVOICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      this.setPayments(INITIAL_PAYMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
      this.setChats(INITIAL_CHATS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.setNotifications(INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      this.setActivities(INITIAL_ACTIVITIES);
    }
  },

  // Reset to default sample data
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.CLIENT);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    this.init();
  },

  // Client Profile
  getClient() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENT)) || SAMPLE_CLIENT;
    } catch (e) {
      return SAMPLE_CLIENT;
    }
  },
  setClient(client) {
    localStorage.setItem(STORAGE_KEYS.CLIENT, JSON.stringify(client));
  },

  // Products
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || SAMPLE_PRODUCTS;
    } catch (e) {
      return SAMPLE_PRODUCTS;
    }
  },
  setProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },
  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  // Orders
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  },
  setOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },
  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  },
  addOrder(newOrder) {
    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.setOrders(orders);

    // Add activity
    this.addActivity({
      id: "act-" + Date.now(),
      type: "order_submitted",
      title: "Order Request Submitted",
      desc: `Order #${newOrder.id} (${newOrder.orderedMetres.toLocaleString()}m of ${newOrder.productName}) submitted for quotation review.`,
      time: "Just now",
      badge: "Order",
      badgeClass: "badge-coral"
    });

    // Add notification
    this.addNotification({
      id: "notif-" + Date.now(),
      title: "Order Submitted Successfully",
      message: `Your manufacturing request #${newOrder.id} has been submitted. Our merchandising team is preparing your official quotation.`,
      time: "Just now",
      category: "order",
      read: false,
      targetPage: "orders",
      orderId: newOrder.id
    });

    return newOrder;
  },
  updateOrder(orderId, updates) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      this.setOrders(orders);
      return orders[index];
    }
    return null;
  },

  // Invoices
  getInvoices() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES)) || INITIAL_INVOICES;
    } catch (e) {
      return INITIAL_INVOICES;
    }
  },
  setInvoices(invoices) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },
  getInvoiceByNumber(num) {
    const invoices = this.getInvoices();
    return invoices.find(inv => inv.invoiceNumber === num);
  },
  markInvoicePaid(invoiceNumber, paymentDetails) {
    const invoices = this.getInvoices();
    const inv = invoices.find(i => i.invoiceNumber === invoiceNumber);
    if (inv) {
      inv.status = "Paid";
      inv.paidAmount = inv.amount;
      inv.remainingAmount = 0;
      inv.paidDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      this.setInvoices(invoices);

      // Record in Payments
      this.addPayment({
        paymentId: "PAY-" + Math.floor(1000 + Math.random() * 9000),
        invoiceNumber: inv.invoiceNumber,
        orderId: inv.orderId,
        paymentDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        amount: inv.amount,
        method: paymentDetails.method || "Razorpay (Corporate NetBanking)",
        transactionRef: "RZP-TXN-" + Math.floor(10000000 + Math.random() * 90000000),
        status: "Success",
        downloadReceipt: "#receipt-" + inv.invoiceNumber
      });

      // Update Order milestones if applicable
      const order = this.getOrderById(inv.orderId);
      if (order && order.milestones) {
        const ms = order.milestones.find(m => m.invoiceId === invoiceNumber);
        if (ms) {
          ms.status = "paid";
          ms.paidDate = inv.paidDate;
          this.updateOrder(order.id, { milestones: order.milestones });
        }
      }

      // Add activity
      this.addActivity({
        id: "act-" + Date.now(),
        type: "payment_received",
        title: "Payment Confirmed via Razorpay",
        desc: `₹${inv.amount.toLocaleString("en-IN")} processed for Invoice #${invoiceNumber} (${inv.productName}).`,
        time: "Just now",
        badge: "Payment",
        badgeClass: "badge-green"
      });

      // Add notification
      this.addNotification({
        id: "notif-" + Date.now(),
        title: "Payment Received",
        message: `Your payment of ₹${inv.amount.toLocaleString("en-IN")} for Invoice #${invoiceNumber} has been received and verified.`,
        time: "Just now",
        category: "payment",
        read: false,
        targetPage: "payments",
        orderId: inv.orderId
      });
    }
    return inv;
  },

  // Payments
  getPayments() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS)) || INITIAL_PAYMENTS;
    } catch (e) {
      return INITIAL_PAYMENTS;
    }
  },
  setPayments(payments) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },
  addPayment(payment) {
    const payments = this.getPayments();
    payments.unshift(payment);
    this.setPayments(payments);
  },

  // Chats
  getChats() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS)) || INITIAL_CHATS;
    } catch (e) {
      return INITIAL_CHATS;
    }
  },
  setChats(chats) {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },
  getChatByOrderId(orderId) {
    const chats = this.getChats();
    return chats[orderId] || null;
  },
  addChatMessage(orderId, message) {
    const chats = this.getChats();
    if (!chats[orderId]) {
      const order = this.getOrderById(orderId);
      chats[orderId] = {
        orderId: orderId,
        productName: order ? order.productName : "Custom Textile Fabric",
        orderQuantity: order ? `${order.orderedMetres.toLocaleString()} metres` : "Custom Yardage",
        quotedPrice: order ? `₹${order.unitPrice || 250} / metre` : "Quote in review",
        totalQuote: order ? `₹${(order.totalValue || 0).toLocaleString("en-IN")}` : "Calculated upon signoff",
        validity: "Valid for 7 Days",
        deliveryDate: order ? order.expectedDelivery : "TBD",
        status: "In Negotiation",
        unread: false,
        messages: []
      };
    }
    chats[orderId].messages.push(message);
    this.setChats(chats);
    return chats[orderId];
  },

  // Notifications
  getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  },
  setNotifications(notifs) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },
  addNotification(notif) {
    const notifs = this.getNotifications();
    notifs.unshift(notif);
    this.setNotifications(notifs);
  },
  markNotificationAsRead(id) {
    const notifs = this.getNotifications();
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.read = true;
      this.setNotifications(notifs);
    }
  },
  markAllNotificationsRead() {
    const notifs = this.getNotifications();
    notifs.forEach(n => n.read = true);
    this.setNotifications(notifs);
  },
  getUnreadNotificationsCount() {
    const notifs = this.getNotifications();
    return notifs.filter(n => !n.read).length;
  },

  // Activities
  getActivities() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) || INITIAL_ACTIVITIES;
    } catch (e) {
      return INITIAL_ACTIVITIES;
    }
  },
  setActivities(acts) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(acts));
  },
  addActivity(activity) {
    const acts = this.getActivities();
    acts.unshift(activity);
    if (acts.length > 25) acts.pop();
    this.setActivities(acts);
  },

  // Aggregated Metrics for Dashboard
  getDashboardMetrics() {
    const orders = this.getOrders();
    const invoices = this.getInvoices();

    const activeOrders = orders.filter(o => o.status === "In Production" || o.status === "Awaiting Quotation").length;
    const totalOrders = orders.length;
    
    // Metres in production
    const productionInProgressMetres = orders
      .filter(o => o.status === "In Production")
      .reduce((acc, curr) => acc + (curr.producedMetres || 0), 0);

    // Pending payments amount
    const pendingPaymentsAmount = invoices
      .filter(i => i.status === "Pending")
      .reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);

    return {
      activeOrders,
      totalOrders,
      productionInProgressMetres,
      pendingPaymentsAmount
    };
  }
};

// Auto initialize on load
StorageManager.init();

