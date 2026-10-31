/**
 * LOOMPILOT — Application Navigation & Router
 * Hash-based SPA router with breadcrumbs, responsive mobile drawer, and deep linking
 */

const Navigation = {
  routes: {
    overview: {
      title: "Client Overview",
      parent: "Dashboard",
      render: () => OverviewPage.render()
    },
    catalogue: {
      title: "Textile Product Catalogue",
      parent: "Sourcing",
      render: () => CataloguePage.render()
    },
    "create-order": {
      title: "Create Manufacturing Order",
      parent: "Orders",
      render: () => OrderWizard.render()
    },
    orders: {
      title: "My Orders",
      parent: "Orders",
      render: (params) => OrdersPage.render(params)
    },
    tracking: {
      title: "Production Tracking",
      parent: "Manufacturing",
      render: (params) => TrackingPage.render(params)
    },
    quotations: {
      title: "Quotations & Negotiation Chat",
      parent: "Commercials",
      render: (params) => ChatPage.render(params)
    },
    payments: {
      title: "Payments & Invoices",
      parent: "Finance",
      render: () => PaymentsPage.render()
    },
    notifications: {
      title: "Notification Centre",
      parent: "Account",
      render: () => NotificationsPage.render()
    },
    settings: {
      title: "Client Profile & Mill Settings",
      parent: "Settings",
      render: () => SettingsPage.render()
    }
  },

  currentPage: "overview",

  init() {
    window.addEventListener("hashchange", () => this.handleHashChange());
    this.setupSidebarToggles();
    this.handleHashChange(); // Initial route
  },

  navigateTo(pageKey, params = {}) {
    window.location.hash = pageKey + (params.id ? `?id=${params.id}` : "");
  },

  handleHashChange() {
    const rawHash = window.location.hash.replace("#", "") || "overview";
    const [pageKey, queryString] = rawHash.split("?");
    const params = {};

    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [k, v] of searchParams.entries()) {
        params[k] = v;
      }
    }

    if (this.routes[pageKey]) {
      this.currentPage = pageKey;
      this.updateActiveViews(pageKey);
      this.updateBreadcrumbs(pageKey);
      this.updateSidebarActive(pageKey);

      // Invoke page render
      this.routes[pageKey].render(params);

      // Scroll to top
      window.scrollTo(0, 0);

      // Close mobile drawer if open
      this.closeMobileSidebar();
    } else {
      window.location.hash = "overview";
    }
  },

  updateActiveViews(pageKey) {
    document.querySelectorAll(".page-view").forEach(el => {
      el.classList.remove("active-view");
    });
    const target = document.getElementById(`view-${pageKey}`);
    if (target) {
      target.classList.add("active-view");
    }
  },

  updateBreadcrumbs(pageKey) {
    const route = this.routes[pageKey];
    const crumbParent = document.getElementById("crumb-parent");
    const crumbActive = document.getElementById("crumb-active");

    if (crumbParent && crumbActive && route) {
      crumbParent.textContent = route.parent;
      crumbActive.textContent = route.title;
    }
  },

  updateSidebarActive(pageKey) {
    document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("data-page") === pageKey) {
        item.classList.add("active");
      }
    });

    // Update notification badge count
    const unreadCount = StorageManager.getUnreadNotificationsCount();
    const navBadge = document.getElementById("sidebar-notif-badge");
    const headerDot = document.getElementById("header-notif-dot");

    if (navBadge) {
      navBadge.textContent = unreadCount;
      navBadge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }
    if (headerDot) {
      headerDot.style.display = unreadCount > 0 ? "block" : "none";
    }
  },

  setupSidebarToggles() {
    // Desktop Collapse toggle
    const toggleBtn = document.getElementById("sidebar-collapse-btn");
    const sidebar = document.getElementById("app-sidebar");
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
      });
    }

    // Mobile Hamburger
    const mobileBtn = document.getElementById("mobile-menu-trigger");
    const overlay = document.getElementById("sidebar-overlay");
    if (mobileBtn && sidebar && overlay) {
      mobileBtn.addEventListener("click", () => {
        sidebar.classList.add("mobile-open");
        overlay.classList.add("active");
      });
      overlay.addEventListener("click", () => {
        this.closeMobileSidebar();
      });
    }

    // Top Header User Profile Dropdown
    const userTrigger = document.getElementById("user-menu-trigger");
    const userDropdown = document.getElementById("user-dropdown-menu");
    if (userTrigger && userDropdown) {
      userTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
      });
      document.addEventListener("click", () => {
        userDropdown.classList.remove("show");
      });
    }
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (overlay) overlay.classList.remove("active");
  }
};

