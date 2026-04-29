/* =========================================
   Akash Suvarnkar — DATA ANALYST PORTFOLIO
   script.js — All interactivity
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  let mouseX = 0,
    mouseY = 0,
    followerX = 0,
    followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  /* ── NAVBAR SCROLL EFFECT ── */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    updateActiveNav();
  });

  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current,
      );
    });
  }

  /* ── HAMBURGER / MOBILE MENU ── */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  document.querySelectorAll(".mob-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });

  /* ── HERO STATS COUNTER ── */
  const statNums = document.querySelectorAll(".stat-num");
  let statsDone = false;

  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  const heroObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !statsDone) {
        statsDone = true;
        statNums.forEach((el) => countUp(el));
      }
    },
    { threshold: 0.5 },
  );

  const heroSection = document.getElementById("home");
  if (heroSection) heroObs.observe(heroSection);

  /* ── SKILL BARS ── */
  const skillFills = document.querySelectorAll(".skill-fill");
  const aboutSection = document.getElementById("about");
  let skillsDone = false;

  const skillObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !skillsDone) {
        skillsDone = true;
        skillFills.forEach((el, i) => {
          setTimeout(() => {
            el.style.width = el.dataset.w + "%";
          }, i * 100);
        });
      }
    },
    { threshold: 0.3 },
  );

  if (aboutSection) skillObs.observe(aboutSection);

  /* ── REVEAL ON SCROLL ── */
  const reveals = document.querySelectorAll(".reveal");

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent grid
          const siblings = [
            ...entry.target.parentElement.querySelectorAll(".reveal"),
          ];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = idx * 80 + "ms";
          entry.target.classList.add("visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => revealObs.observe(el));

  /* ── PORTFOLIO FILTER ── */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".p-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const match = filter === "all" || card.dataset.cat === filter;
        card.style.transition = `opacity 0.3s ease ${
          i * 40
        }ms, transform 0.3s ease ${i * 40}ms`;
        if (match) {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
          card.style.display = "block";
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.94)";
          setTimeout(() => {
            if (card.style.opacity === "0") card.style.display = "none";
          }, 300 + i * 40);
        }
      });
    });
  });

  /* ── CONTACT FORM — real email via Formspree ── */
  /*
   * SETUP (free, takes 2 minutes):
   * 1. Go to https://formspree.io and sign up with suvarnkarakash06@gmail.com
   * 2. Create a new form → copy your Form ID (looks like: xpwzabcd)
   * 3. Replace YOUR_FORM_ID below with that ID
   */
  const FORMSPREE_ID = "mgorajal"; // ← paste your Formspree form ID here

  const form = document.getElementById("contactForm");
  const btnText = document.getElementById("btnText");
  const msgOk = document.getElementById("formSuccess");
  const msgErr = document.getElementById("formError");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector(".form-btn");

      // Loading state
      btnText.textContent = "Sending…";
      btn.disabled = true;
      btn.style.opacity = "0.7";
      msgOk.hidden = true;
      msgErr.hidden = true;

      const data = new FormData(form);

      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          btnText.textContent = "✓ Sent!";
          btn.style.opacity = "1";
          btn.style.background = "#22c55e";
          btn.style.color = "#fff";
          msgOk.hidden = false;
          form.reset();
          setTimeout(() => {
            btnText.textContent = "Send Message";
            btn.disabled = false;
            btn.style.background = "";
            btn.style.color = "";
          }, 4000);
        } else {
          throw new Error("Server error");
        }
      } catch {
        btnText.textContent = "Send Message";
        btn.disabled = false;
        btn.style.opacity = "1";
        msgErr.hidden = false;
      }
    });
  }

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ── ORBIT DOTS FOLLOW RING ROTATION ── */
  // Orbital dots already animated by CSS keyframes, no JS needed.

  /* ══════════════════════════════════════════
     PROJECT MODAL
  ══════════════════════════════════════════ */

  const PROJECTS = [
    {
      id: 1,
      emoji: "👥",
      num: "01",
      tag: "PostgreSQL · Excel · RFM Analysis",
      date: "Apr 2026",
      title: "Customer Segmentation Analysis",
      gradient: { c1: "#0f2027", c2: "#203a43" },
      overview:
        "Segmented 5,360 customers from a 1M+ row UK e-commerce dataset using RFM (Recency, Frequency, Monetary) methodology in PostgreSQL — turning raw transactional data into a clear, actionable customer tier map.",
      stats: [
        { value: "1M+", label: "Records" },
        { value: "5,360", label: "Customers" },
        { value: "24%", label: "Champions" },
        { value: "£9,000", label: "Avg Champion Spend" },
        { value: "461", label: "At Risk" },
        { value: "1,035", label: "Lost Customers" },
      ],
      bullets: [
        "Loaded and cleaned a 1M+ row UK e-commerce dataset into PostgreSQL.",
        "Built CTEs and NTILE window functions to score each customer 1–5 across Recency, Frequency, and Monetary dimensions.",
        "Mapped score combinations to business-meaningful segments: Champions, Loyal, At Risk, Lost.",
        "Designed an Excel dashboard with donut and bar charts for stakeholder presentation.",
        "Identified Champions (24% of customers) driving the highest average spend of ~£9,000.",
      ],
      tools: [
        "PostgreSQL",
        "CTEs",
        "Window Functions",
        "NTILE",
        "Excel",
        "Donut Charts",
        "Bar Charts",
        "RFM Methodology",
      ],
      outcome:
        "<strong>Outcome:</strong> Delivered a segmentation framework that pinpointed 461 At Risk and 1,035 Lost customers — enabling targeted retention and re-engagement campaigns and giving the marketing team a reusable scoring pipeline.",
      // Replace image src values with your actual screenshot files in the ./images/ folder
      images: [
        {
          src: "./images/rfm-dashboard.JPG",
          alt: "RFM Segmentation Dashboard",
        },
        { src: "./images/donut-chart.png", alt: "Customer Tier Donut Chart" },
        { src: "./images/sql-query.png", alt: "PostgreSQL Query Screenshot" },
      ],
      github: "https://github.com/akashsuvarnkar82/customer-segmentation-rfm",
    },
    {
      id: 2,
      emoji: "💰",
      num: "02",
      tag: "Power BI · Python · Statistics",
      date: "Mar 2026",
      title: "Sales Data Analysis",
      gradient: { c1: "#1e3c72", c2: "#2a5298" },
      overview:
        "A statistical deep-dive into sales data combining Python for exploratory analysis and Power BI for executive dashboards — surfacing the revenue distribution pattern and quantifying the relationship between units sold and sales amount.",
      stats: [
        { value: "≈4,136", label: "Avg Sales" },
        { value: "3,781", label: "95% CI Lower" },
        { value: "4,491", label: "95% CI Upper" },
      ],
      bullets: [
        "Performed exploratory data analysis in Python (Pandas, NumPy) to understand revenue distribution.",
        "Identified that a small number of high-value transactions drive a disproportionate share of revenue (Pareto pattern).",
        "Quantified a strong positive correlation between units sold and sales amount.",
        "Calculated 95% confidence intervals for average sales to support decision-making under uncertainty.",
        "Built a Power BI dashboard with KPI cards, trend lines, and CI band overlays.",
      ],
      tools: [
        "Power BI",
        "Python",
        "Pandas",
        "NumPy",
        "Statistics",
        "Confidence Intervals",
        "KPI Cards",
        "DAX",
      ],
      outcome:
        "<strong>Outcome:</strong> Provided management with a statistically-backed dashboard (avg sales ≈ 4,136; 95% CI: 3,781–4,491) that replaced gut-feel reporting with data-driven business decisions.",
      images: [
        { src: "./images/sales-dashboard.png", alt: "Power BI KPI Dashboard" },
        {
          src: "./images/revenue-chart.png",
          alt: "Revenue Distribution Chart",
        },
        { src: "./images/python-eda.png", alt: "Python EDA Notebook" },
      ],
      github: "https://github.com/akashsuvarnkar82/sales-analysis-dashboard",
    },
    {
      id: 3,
      emoji: "📊",
      num: "03",
      tag: "Excel · PivotTable · Dashboard",
      date: "Apr 2026",
      title: "SuperStore P&L Analysis Dashboard",
      gradient: { c1: "#1A2B4A", c2: "#2E75B6" },
      overview:
        "An end-to-end Profit & Loss analysis dashboard built entirely in Excel on 9,994 rows of real Kaggle Superstore data — from raw data cleaning and date standardisation through SUMIF-powered income statement modeling to a Business 360-style interactive dashboard uncovering regional, segment, and category-level profit drivers across 4 fiscal years.",
      stats: [
        { value: "9,994", label: "Rows Analyzed" },
        { value: "241%", label: "Net Profit Growth" },
        { value: "14.4%", label: "Gross Margin" },
        { value: "4", label: "Years Covered" },
      ],
      bullets: [
        "Performed data cleaning on Kaggle Superstore dataset — fixed mixed date formats using Text to Columns, verified zero duplicates, nulls, and negative Sales values across 9,994 rows.",
        "Derived 10 P&L columns including Net Sales, COGS, Gross Profit, Gross Margin %, Operating Expense, and Net Profit using structured Excel formulas within an Excel Table.",
        "Built a dynamic P&L income statement using SUMIF formulas pulling from Raw Data — covering Gross Sales → Discounts → Net Sales → COGS → Gross Profit → OpEx → Net Profit across 2014–2017.",
        "Performed YoY growth analysis revealing 241% Net Profit improvement over 4 years, with 2016 as the breakout year (+32.7% Gross Profit) and 2017 showing early margin pressure (-4.5% GM).",
        "Created PivotTables by Region × Category and Segment × Category — identifying West as top region (14.9% margin), Technology as top category (51% profit share), and Furniture as underperformer (6% share).",
        "Designed a Business 360-style interactive Excel dashboard with dark navy theme, clickable navigation buttons, 4 KPI cards, and 3 dynamic charts — Waterfall, Trend Line, and Regional Bar chart.",
      ],
      tools: [
        "Excel",
        "SUMIF",
        "PivotTable",
        "Data Cleaning",
        "Text to Columns",
        "YoY Analysis",
        "P&L Modeling",
        "Dashboard Design",
        "Charts",
      ],
      outcome:
        "<strong>Outcome:</strong> Delivered a fully interactive P&L dashboard and 8-section Word report on real Superstore data — revealing West region (14.9% margin) and Technology (51% profit) as top performers, while flagging Central Furniture losses and 2017 margin compression as key business risks.",
      images: [
        {
          src: "./images/pl-dashboard.JPG",
          alt: "SuperStore P&L Dashboard Home",
        },
        { src: "./images/pl-statement.JPG", alt: "P&L Income Statement - Gross Sales to Net Profit (2014-2017) with YoY Analysis" },
        { src: "./images/chart_1.JPG", alt: "Sales & Profit By Region" },
        { src: "./images/chart_3.JPG", alt: "Net Sales vs Gross Profit vs Net Profit" },
        { src: "./images/chart_5.JPG", alt: "State VS Sales" },
        { src: "./images/chart_2.JPG", alt: "Profit By Category " },
      ],
      github: "https://github.com/akashsuvarnkar82/pnl-analysis",
    },
    {
      id: 4,
      emoji: "🌏",
      num: "04",
      tag: "Python · PostgreSQL · Power BI",
      date: "Jan 2026",
      title: "India Trade Analysis Dashboard",
      gradient: { c1: "#134e5e", c2: "#71b280" },
      overview:
        "An end-to-end analytics pipeline processing 10+ years of India trade data across 50+ commodity categories — from raw data ingestion in Python through optimised PostgreSQL storage to an interactive Power BI dashboard uncovering key trade partners and commodity trends.",
      stats: [
        { value: "10+", label: "Years of Data" },
        { value: "50+", label: "Commodity Categories" },
        { value: "25%", label: "Query Speed Gain" },
        { value: "3", label: "Key Partners" },
      ],
      bullets: [
        "Processed and cleaned a massive multi-year dataset using Python and Pandas — handling missing values, type casting, and normalisation.",
        "Designed a structured PostgreSQL schema and optimised queries (indexes, CTEs, query plans) to achieve a 25% improvement in data retrieval speed.",
        "Built an end-to-end analytics pipeline from raw CSV ingestion to dashboard-ready aggregated tables.",
        "Identified China, USA, and UAE as India's dominant trade partners across the analysis period.",
        "Surfaced top-performing commodity categories by import/export volume and value trends over time.",
        "Published an interactive Power BI dashboard for stakeholders to explore trade data by year, partner, and commodity.",
      ],
      tools: [
        "Python",
        "Pandas",
        "PostgreSQL",
        "Query Optimisation",
        "Indexing",
        "CTEs",
        "Power BI",
        "DAX",
        "Data Cleaning",
      ],
      outcome:
        "<strong>Outcome:</strong> Delivered a reusable pipeline and interactive dashboard revealing decade-long trade patterns — showing China, USA, and UAE as dominant partners — with a 25% boost in query performance through schema optimisation.",
      images: [
        {
          src: "./images/trade-dashboard.png",
          alt: "Trade Dashboard Overview",
        },
        {
          src: "./images/partner-analysis.png",
          alt: "Partner Country Analysis",
        },
        { src: "./images/commodity-trends.png", alt: "Commodity Trend Chart" },
      ],
      github: "https://github.com/akashsuvarnkar82/India-Trade-Analytics",
    },
    // {
    //   id: 4,
    //   emoji: '📊',
    //   num: '04',
    //   tag: 'SQL · Power BI · Excel',
    //   date: 'May 2026',
    //   title: 'HR Analytics Dashboard',
    //   gradient: { c1: '#3a1c71', c2: '#d76d77' },
    //   overview: 'Analysed employee attrition patterns, tenure distribution, and department-level headcount across an HR dataset — translating raw workforce data into a Power BI dashboard that helps HR teams identify retention risks and plan hiring.',
    //   stats: [
    //     { value: '15%',  label: 'Attrition Rate' },
    //     { value: '6',    label: 'Departments' },
    //     { value: '3.2yr', label: 'Avg Tenure' },
    //     { value: '1',    label: 'Dashboard' },
    //   ],
    //   bullets: [
    //     'Cleaned and structured HR data in SQL — handling nulls, normalising department names, and computing tenure from hire dates.',
    //     'Identified the top 3 departments with highest attrition using GROUP BY and window functions.',
    //     'Segmented employees by age band, tenure bucket, and job role to surface patterns in voluntary exits.',
    //     'Built a Power BI dashboard with KPI cards (headcount, attrition %, avg tenure), bar charts, and slicers for interactive filtering.',
    //     'Created an Excel summary sheet for quick stakeholder sharing without requiring Power BI Desktop.',
    //   ],
    //   tools: ['SQL', 'MySQL', 'Power BI', 'DAX', 'Excel', 'Data Cleaning', 'Attrition Analysis', 'KPI Cards'],
    //   outcome: '<strong>Outcome:</strong> Delivered a dashboard that pinpointed attrition hotspots by department and tenure band — enabling HR to focus retention efforts on the highest-risk employee groups.',
    //   images: [
    //     { src: './images/hr-dashboard.png',   alt: 'HR Analytics Power BI Dashboard' },
    //     { src: './images/attrition-chart.png', alt: 'Attrition by Department Chart' },
    //     { src: './images/tenure-chart.png',    alt: 'Tenure Distribution Chart' },
    //   ],
    //   github: 'https://github.com/akashsuvarnkar82/hr-analytics-dashboard',
    // },
  ];

  const modalOverlay = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalBanner = document.getElementById("modalBanner");
  const modalEmoji = document.getElementById("modalEmoji");
  const modalNum = document.getElementById("modalNum");
  const modalTag = document.getElementById("modalTag");
  const modalDate = document.getElementById("modalDate");
  const modalTitle = document.getElementById("modalTitle");
  const modalOverview = document.getElementById("modalOverview");
  const modalStats = document.getElementById("modalStats");
  const modalGallery = document.getElementById("modalGallery");
  const modalBullets = document.getElementById("modalBullets");
  const modalTools = document.getElementById("modalTools");
  const modalOutcome = document.getElementById("modalOutcome");
  const modalGithub = document.getElementById("modalGithub");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");

  let currentProjectId = 1;

  function placeholderSVG(alt) {
    return `<div class="modal-img-placeholder">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" rx="4" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="13" cy="13" r="3" stroke="currentColor" stroke-width="1.5"/>
        <path d="M2 24l8-7 6 5 4-3 14 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>Add image:<br>${alt}</span>
    </div>`;
  }

  function openModal(projectId) {
    const p = PROJECTS.find((x) => x.id === projectId);
    if (!p) return;
    currentProjectId = projectId;

    // banner gradient
    modalBanner.style.setProperty("--c1", p.gradient.c1);
    modalBanner.style.setProperty("--c2", p.gradient.c2);
    modalEmoji.textContent = p.emoji;
    modalNum.textContent = p.num;

    // meta
    modalTag.textContent = p.tag;
    modalDate.textContent = p.date;
    modalTitle.textContent = p.title;
    modalOverview.textContent = p.overview;

    // stats
    modalStats.innerHTML = p.stats
      .map(
        (s) => `
      <div class="modal-stat-pill">
        <strong>${s.value}</strong>
        <span>${s.label}</span>
      </div>`,
      )
      .join("");

    // gallery
    const galleryImages = p.images.filter(img => img.src);
    modalGallery.innerHTML = p.images
      .map(
        (img) => `
      <div class="modal-img-slot" ${img.src ? `data-src="${img.src}" data-alt="${img.alt}"` : ''}>
        ${
          img.src
            ? `<img src="${img.src}" alt="${img.alt}" loading="lazy">`
            : placeholderSVG(img.alt)
        }
      </div>`,
      )
      .join("");

    // Bind lightbox on gallery images
    modalGallery.querySelectorAll(".modal-img-slot[data-src]").forEach((slot, idx) => {
      slot.addEventListener("click", () => {
        openLightbox(galleryImages, idx);
      });
    });

    // bullets
    modalBullets.innerHTML = p.bullets.map((b) => `<li>${b}</li>`).join("");

    // tools
    modalTools.innerHTML = p.tools
      .map((t) => `<span class="modal-tool-chip">${t}</span>`)
      .join("");

    // outcome
    modalOutcome.innerHTML = p.outcome;

    // github
    modalGithub.href = p.github;

    // prev/next state
    modalPrev.disabled = projectId === 1;
    modalNext.disabled = projectId === PROJECTS.length;
    modalPrev.style.opacity = projectId === 1 ? "0.35" : "1";
    modalNext.style.opacity = projectId === PROJECTS.length ? "0.35" : "1";

    // open overlay
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // scroll modal back to top
    modalOverlay.querySelector(".modal-body").scrollTop = 0;
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ── LIGHTBOX ── */
  const lightboxOverlay = document.getElementById("lightboxOverlay");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCounter = document.getElementById("lightboxCounter");

  let lbImages = []; // { src, alt }
  let lbIndex = 0;

  function openLightbox(images, startIndex) {
    lbImages = images;
    lbIndex = startIndex;
    showLightboxImage();
    lightboxOverlay.classList.add("open");
    lightboxOverlay.setAttribute("aria-hidden", "false");
  }

  function showLightboxImage() {
    const img = lbImages[lbIndex];
    // reset transition by toggling opacity
    lightboxImg.style.opacity = "0";
    lightboxImg.style.transform = "scale(0.94)";
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      lightboxCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
      lightboxPrev.disabled = lbIndex === 0;
      lightboxNext.disabled = lbIndex === lbImages.length - 1;
      lightboxImg.style.opacity = "1";
      lightboxImg.style.transform = "scale(1)";
    }, 80);
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove("open");
    lightboxOverlay.setAttribute("aria-hidden", "true");
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxOverlay.addEventListener("click", (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
  lightboxPrev.addEventListener("click", () => {
    if (lbIndex > 0) { lbIndex--; showLightboxImage(); }
  });
  lightboxNext.addEventListener("click", () => {
    if (lbIndex < lbImages.length - 1) { lbIndex++; showLightboxImage(); }
  });
  document.addEventListener("keydown", (e) => {
    if (!lightboxOverlay.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && lbIndex > 0) { lbIndex--; showLightboxImage(); }
    if (e.key === "ArrowRight" && lbIndex < lbImages.length - 1) { lbIndex++; showLightboxImage(); }
  });

  // Open on card click
  document.querySelectorAll(".p-card[data-project]").forEach((card) => {
    card.addEventListener("click", () =>
      openModal(parseInt(card.dataset.project)),
    );
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ")
        openModal(parseInt(card.dataset.project));
    });
  });

  // Close on X or overlay backdrop
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Prev / Next navigation
  modalPrev.addEventListener("click", () => {
    if (currentProjectId > 1) openModal(currentProjectId - 1);
  });
  modalNext.addEventListener("click", () => {
    if (currentProjectId < PROJECTS.length) openModal(currentProjectId + 1);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open"))
      closeModal();
  });
});
