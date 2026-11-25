/**
 * VALOR QATAR — Haute Chocolaterie & Fleuriste
 * Architecture: Riviera Qatar
 * Aesthetic: The Bouqs Co
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  let currentLang = 'en';
  let currentCategory = 'all';
  let currentOccasion = 'all';
  let currentColor = 'all';
  let currentSort = 'featured';
  let searchQuery = '';
  let currentPage = 1;
  const itemsPerPage = 24;
  let favorites = JSON.parse(localStorage.getItem('valor_favorites') || '[]');

  // Modal State
  let activeModalItem = null;
  let activeModalSizeIndex = 0;

  // Custom Builder State
  const builderState = {
    base: { id: 'horse_box', name_en: 'Signature Arabian Horse Box', name_ar: 'صندوق الخيل العربي الملكي', price: 450 },
    floral: { id: 'naomi_roses', name_en: 'Dutch Naomi Crimson Roses', name_ar: 'ورود النعومي الحمراء الهولندية', price: 180 },
    confectionery: { id: 'pralines', name_en: 'Artisanal Belgian Truffles & Pralines', name_ar: 'برالين وترافل بلجيكي فاخر', price: 220 },
    topper: { id: 'mabrook', name_en: 'ألف مبروك (Congratulations)', name_ar: 'ألف مبروك', price: 50 }
  };

  // Translations
  const i18n = {
    en: {
      topBar: "Same-Day Delivery in Doha, Lusail & The Pearl | Free Delivery on Orders Over 500 QAR",
      topBarContact: "Call / WhatsApp: +974 5999 2926",
      navHome: "Home",
      navFlowers: "Flowers",
      navChocolates: "Chocolates",
      navCombos: "Combos",
      navDatesSweets: "Dates & Sweets",
      navSavory: "Savory & Warak Enab",
      navCakes: "Cakes",
      navOccasions: "Occasions",
      navTowers: "Stands & Towers",
      navShowroom: "Showroom",
      heroBadge: "Sendian Group • Doha, Qatar",
      heroHeadline1: "Farm-Fresh Blooms &",
      heroHeadline2: "Artisanal Cacao",
      heroHeadline3: "Delivered Across Doha",
      heroLead: "The luxury gifting standard in Qatar. Handcrafted Belgian chocolates, air-freighted Dutch Naomi roses, royal Medjool dates, and majestic majlis hospitality stands.",
      btnShopAll: "Shop All Collections",
      btnCurateStand: "Curate Custom Stand",
      heroCardTitle: "Royal Stepped Majlis Stand",
      heroCardPrice: "From 580 QAR • Dutch Roses & Chocolate Vault",
      valueProp1Title: "100% Farm-Direct Blooms",
      valueProp1Desc: "Imported Dutch Naomi roses & exotic stems cut fresh for long vase life in Doha.",
      valueProp2Title: "Artisan Belgian Cacao",
      valueProp2Desc: "Single-origin fine cocoa, handmade truffles, and gourmet stuffed Medjool dates.",
      valueProp3Title: "Climate-Controlled Delivery",
      valueProp3Desc: "Specialized refrigerated fleet ensuring chocolates and blooms arrive in pristine condition.",
      catalogTag: "Riviera Catalog & Showcase",
      catalogTitle: "Curated Luxury Gifting in Doha",
      catalogSubtitle: "Explore over 470 artisanal arrangements, luxury chocolate boxes, and majlis presentation towers.",
      allCategories: "All Collections",
      allOccasions: "All Occasions",
      occNationalDay: "🇶🇦 Qatar National Day",
      occRamadan: "🌙 Ramadan & Eid",
      occGrad: "🎓 Graduation 2024",
      occNewborn: "👶 Newborn & Baby",
      occMajlis: "🏛️ Majlis & Weddings",
      occSummer: "☀️ Summer Coolers",
      allColors: "All Colors",
      colorRed: "Red / Crimson",
      colorWhite: "White / Ivory",
      colorPink: "Pink / Blush",
      colorGold: "Gold / Caramel",
      colorGreen: "Botanical Green",
      sortFeatured: "Sort: Featured",
      sortPriceLow: "Price: Low to High",
      sortPriceHigh: "Price: High to Low",
      searchPlaceholder: "Search flowers, chocolates, stands...",
      showingStats: "Showing {shown} of {total} creations",
      btnQuickView: "Quick View",
      btnInquire: "Inquire",
      btnLoadMore: "Load More Creations",
      noResults: "No creations found matching your filter selection.",
      builderTag: "Bespoke Hospitality Concierge",
      builderTitle: "Curate Your Custom Stand & Bouquet",
      builderSubtitle: "Combine our signature packaging, fresh imported blooms, gourmet confectionery, and gold acrylic calligraphy for your majlis.",
      step1: "1. Select Base Presentation",
      step2: "2. Select Fresh Floral Accent",
      step3: "3. Select Confectionery Filling",
      step4: "4. Select Calligraphy Topper",
      summaryBadge: "Live Curation Summary",
      summaryTitle: "Bespoke Majlis Presentation",
      specBase: "Base Unit:",
      specFloral: "Floral Accent:",
      specConfect: "Confectionery:",
      specTopper: "Acrylic Topper:",
      specEstimatedTotal: "Estimated Total:",
      btnOrderCustom: "Inquire Custom Curation via WhatsApp",
      modalSizeLabel: "Select Arrangement Size:",
      modalTopperLabel: "Select Acrylic Calligraphy Topper:",
      btnModalOrder: "Order This Creation via WhatsApp",
      footerTagline: "Haute Chocolaterie, Bespoke Floristry & Majlis Hospitality under Sendian Group, Doha, Qatar.",
      footerAddress: "Salwa Road / Al Waab, Doha, State of Qatar",
      footerRights: "© 2026 Valor Qatar — Sendian Group. All rights reserved."
    },
    ar: {
      topBar: "توصيل فاخر في نفس اليوم في الدوحة، لوسيل، واللؤلؤة | توصيل مجاني للطلبات فوق 500 ر.ق",
      topBarContact: "اتصال / واتساب: 2926 5999 974+",
      navHome: "الرئيسية",
      navFlowers: "الزهور",
      navChocolates: "الشوكولاتة",
      navCombos: "التنسيقات المدمجة",
      navDatesSweets: "التمور والحلويات",
      navSavory: "الموالح وورق العنب",
      navCakes: "الكيك الفاخر",
      navOccasions: "المناسبات",
      navTowers: "الصواني والأبراج",
      navShowroom: "صالة العرض",
      heroBadge: "مجموعة السنديان • الدوحة، قطر",
      heroHeadline1: "زهور طبيعية طازجة و",
      heroHeadline2: "شوكولاتة بلجيكية فاخرة",
      heroHeadline3: "تصلكم أينما كنتم في قطر",
      heroLead: "معيار الهدايا الفاخرة في قطر. شوكولاتة بلجيكية فاخرة، ورود النعومي الهولندية، تمور مجهول ملكية، وصواني ضيافة صممت خصيصاً لمجالسكم الراقية.",
      btnShopAll: "تسوق جميع التشكيلات",
      btnCurateStand: "صمم صينية ضيافتك",
      heroCardTitle: "منصة الضيافة الملكية المدرجة",
      heroCardPrice: "ابتداءً من 580 ر.ق • ورود النعومي وخزينة الشوكولاتة",
      valueProp1Title: "زهور هولندية طازجة 100%",
      valueProp1Desc: "ورود النعومي المستوردة جواً وزهور نادرة تدوم نضارتها طويلاً في أجواء الدوحة.",
      valueProp2Title: "كاكاو بلجيكي وحرفية أصيلة",
      valueProp2Desc: "شوكولاتة أحادية المصدر، ترافل يدوي، وتمور مجهول ملكية محشوة بأجود المكسرات.",
      valueProp3Title: "توصيل مبرد ومخصص في قطر",
      valueProp3Desc: "أسطول سيارات مبردة خصيصاً للحفاظ على نضارة الزهور وجودة الشوكولاتة الفاخرة.",
      catalogTag: "كتالوج ريفييرا قطر ومعرض التشكيلات",
      catalogTitle: "هدايا الضيافة الفاخرة في الدوحة",
      catalogSubtitle: "استكشف أكثر من 470 تنسيقاً فاخراً وصناديق شوكولاتة وأبراج ضيافة ملكية.",
      allCategories: "جميع التشكيلات",
      allOccasions: "كافة المناسبات",
      occNationalDay: "🇶🇦 اليوم الوطني القطري",
      occRamadan: "🌙 رمضان والعيد",
      occGrad: "🎓 حفلات التخرج 2024",
      occNewborn: "👶 استقبال المواليد",
      occMajlis: "🏛️ ضيافة المجالس والأعراس",
      occSummer: "☀️ بوكسات الصيف",
      allColors: "جميع الألوان",
      colorRed: "أحمر / نبيذي",
      colorWhite: "أبيض / عاجي",
      colorPink: "وردي / بلش",
      colorGold: "ذهبي / كراميل",
      colorGreen: "أخضر طبيعي",
      sortFeatured: "الترتيب: المميز أولاً",
      sortPriceLow: "السعر: من الأقل للأعلى",
      sortPriceHigh: "السعر: من الأعلى للأقل",
      searchPlaceholder: "ابحث عن ورد، شوكولاتة، أبراج، تمور...",
      showingStats: "عرض {shown} من أصل {total} إبداعاً",
      btnQuickView: "عرض سريع",
      btnInquire: "استفسار",
      btnLoadMore: "تحميل المزيد من التشكيلات",
      noResults: "لم يتم العثور على تشكيلات مطابقة لاختيارك.",
      builderTag: "كونسيرج الضيافة الخاصة",
      builderTitle: "صمم صينية الضيافة وباقة الورد المخصصة",
      builderSubtitle: "اجمع بين صناديقنا الأيقونية، الزهور الطبيعية، التمور والشوكولاتة، مع عبارة الخط العربي المذهبة لمجلسكم.",
      step1: "1. اختر نوع الصينية أو الصندوق",
      step2: "2. اختر لمسة الزهور الطبيعية",
      step3: "3. اختر نوع التعبئة والحلويات",
      step4: "4. اختر عبارة الخط العربي المذهب",
      summaryBadge: "ملخص التصميم المخصص",
      summaryTitle: "تنسيق الضيافة المخصص لمجلسك",
      specBase: "نوع الصينية:",
      specFloral: "تنسيق الورد:",
      specConfect: "الحلويات:",
      specTopper: "الخط العربي:",
      specEstimatedTotal: "السعر التقديري:",
      btnOrderCustom: "طلب التصميم عبر واتساب (+974 5999 2926)",
      modalSizeLabel: "اختر حجم التنسيق:",
      modalTopperLabel: "اختر عبارة الأكريليك المذهبة:",
      btnModalOrder: "طلب هذا المنتج عبر واتساب",
      footerTagline: "أفخر أنواع الشوكولاتة والزهور الطبيعية وضيافة المجالس تحت مظلة مجموعة السنديان، الدوحة، قطر.",
      footerAddress: "طريق سلوى / الوعب، الدوحة، دولة قطر",
      footerRights: "© 2026 فالور قطر — مجموعة السنديان. جميع الحقوق محفوظة."
    }
  };

  // Category Definitions mapped to Riviera Qatar menu
  const categoryDefs = [
    { id: 'all', name_en: 'All', name_ar: 'الكل', thumb: '03_Flowers_and_Chocolate_Combos/703676210_18114350830848346_1676090427846348751_n.jpg' },
    { id: 'flowers', name_en: 'Flowers', name_ar: 'الزهور', thumb: '02_Fresh_Flowers_and_Bouquets/495275183_29232080963102646_6193578173514659393_n.jpg' },
    { id: 'chocolates', name_en: 'Chocolates', name_ar: 'الشوكولاتة', thumb: '01_Chocolates_and_Pralines/481591321_18069506182848346_1841525152351628633_n.jpg' },
    { id: 'combos', name_en: 'Combos', name_ar: 'تنسيقات مدمجة', thumb: '03_Flowers_and_Chocolate_Combos/502939651_601540295776863_7291038799577741526_n.jpg' },
    { id: 'dates_sweets', name_en: 'Dates & Sweets', name_ar: 'التمور والحلويات', thumb: '04_Dates_and_Arabic_Sweets/481214519_18069061360848346_8562204466404268888_n.jpg' },
    { id: 'savory', name_en: 'Savory Catering', name_ar: 'الموالح والضيافة', thumb: '05_Savory_and_Appetizers/481452884_18069431281848346_7181133245949267399_n.jpg' },
    { id: 'cakes', name_en: 'Custom Cakes', name_ar: 'الكيك الفاخر', thumb: '06_Custom_Cakes_and_Desserts/551870407_18088828903848346_1812342220609916614_n.jpg' },
    { id: 'occasions', name_en: 'Occasions', name_ar: 'المناسبات', thumb: '07_Seasonal_and_Occasions/478332624_18068350180848346_3785530466858521824_n.jpg' },
    { id: 'towers', name_en: 'Majlis Towers', name_ar: 'أبراج الضيافة', thumb: '08_Hospitality_Stands_and_Towers/470894235_18063478918848346_2117381800769098122_n.jpg' }
  ];

  // DOM Elements
  const langToggleBtn = document.getElementById('langToggleBtn');
  const discoveryScroller = document.getElementById('discoveryScroller');
  const categoryFilterTabs = document.getElementById('categoryFilterTabs');
  const occasionSelect = document.getElementById('occasionSelect');
  const colorSelect = document.getElementById('colorSelect');
  const sortSelect = document.getElementById('sortSelect');
  const searchInputField = document.getElementById('searchInputField');
  const catalogGrid = document.getElementById('catalogGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const resultsCounter = document.getElementById('resultsCounter');
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Initialize
  initLanguage();
  renderDiscoveryBar();
  renderCategoryFilterTabs();
  renderCatalog();
  initBuilder();
  initModal();

  // Language Toggle
  function initLanguage() {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ar' : 'en';
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      langToggleBtn.textContent = currentLang === 'en' ? 'العربية' : 'English';
      applyTranslations();
      renderDiscoveryBar();
      renderCategoryFilterTabs();
      renderCatalog();
      updateBuilderSummary();
    });
  }

  function applyTranslations() {
    const t = i18n[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) el.placeholder = t[key];
    });
  }

  // Bouqs Circular Discovery Scroller
  function renderDiscoveryBar() {
    discoveryScroller.innerHTML = categoryDefs.map(cat => {
      const name = currentLang === 'en' ? cat.name_en : cat.name_ar;
      const isActive = currentCategory === cat.id;
      return `
        <div class="discovery-pill-item ${isActive ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
          <div class="discovery-circle-img-wrap">
            <img class="discovery-circle-img" src="${cat.thumb}" alt="${name}" loading="lazy">
          </div>
          <span class="discovery-pill-label">${name}</span>
        </div>
      `;
    }).join('');
  }

  // Category Filter Tabs
  function renderCategoryFilterTabs() {
    const catCounts = { all: VALOR_CATALOG.length };
    VALOR_CATALOG.forEach(item => {
      catCounts[item.category] = (catCounts[item.category] || 0) + 1;
    });

    categoryFilterTabs.innerHTML = categoryDefs.map(cat => {
      const name = currentLang === 'en' ? cat.name_en : cat.name_ar;
      const count = catCounts[cat.id] || 0;
      const isActive = currentCategory === cat.id;
      return `
        <button class="filter-tab-btn ${isActive ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
          <span>${name}</span>
          <span class="tab-count">${count}</span>
        </button>
      `;
    }).join('');
  }

  window.selectCategory = function(catId) {
    currentCategory = catId;
    currentPage = 1;
    renderDiscoveryBar();
    renderCategoryFilterTabs();
    renderCatalog();
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & Search Events
  occasionSelect.addEventListener('change', (e) => {
    currentOccasion = e.target.value;
    currentPage = 1;
    renderCatalog();
  });

  colorSelect.addEventListener('change', (e) => {
    currentColor = e.target.value;
    currentPage = 1;
    renderCatalog();
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    currentPage = 1;
    renderCatalog();
  });

  searchInputField.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    currentPage = 1;
    renderCatalog();
  });

  // Filter & Sort Logic
  function getFilteredItems() {
    let result = VALOR_CATALOG.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchOcc = currentOccasion === 'all' || item.occasion === currentOccasion;
      const matchCol = currentColor === 'all' || item.color === currentColor;
      const matchSearch = !searchQuery ||
        item.name_en.toLowerCase().includes(searchQuery) ||
        item.name_ar.includes(searchQuery) ||
        item.desc_en.toLowerCase().includes(searchQuery) ||
        item.desc_ar.includes(searchQuery) ||
        item.id.toLowerCase().includes(searchQuery);

      return matchCat && matchOcc && matchCol && matchSearch;
    });

    if (currentSort === 'price_asc') {
      result.sort((a, b) => a.price_qar - b.price_qar);
    } else if (currentSort === 'price_desc') {
      result.sort((a, b) => b.price_qar - a.price_qar);
    }

    return result;
  }

  // Render Catalog Grid
  function renderCatalog() {
    const filtered = getFilteredItems();
    const visibleCount = currentPage * itemsPerPage;
    const toShow = filtered.slice(0, visibleCount);
    const t = i18n[currentLang];

    resultsCounter.textContent = t.showingStats
      .replace('{shown}', Math.min(toShow.length, filtered.length))
      .replace('{total}', filtered.length);

    if (toShow.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div style="font-size: 3rem; margin-bottom: 14px;">🌸</div>
          <h3 style="color: var(--bouqs-dark); font-family: var(--font-serif); margin-bottom: 8px;">${t.noResults}</h3>
          <p style="color: var(--bouqs-muted); font-size: 0.95rem;">${t.searchPlaceholder}</p>
        </div>
      `;
      loadMoreBtn.style.display = 'none';
      return;
    }

    catalogGrid.innerHTML = toShow.map(item => {
      const isFav = favorites.includes(item.id);
      const title = currentLang === 'en' ? item.name_en : item.name_ar;
      const desc = currentLang === 'en' ? item.desc_en : item.desc_ar;
      const catLabel = currentLang === 'en' ? item.category_name_en : item.category_name_ar;
      const priceText = item.price_qar > 0 ? `${item.price_qar} QAR` : 'Inquire For Price';

      // WhatsApp direct message
      const msg = encodeURIComponent(
        `Hello Valor Qatar! I would like to inquire about "${item.name_en}" (${item.id}) listed at ${item.price_qar} QAR on your online boutique.`
      );
      const waLink = `https://wa.me/97459992926?text=${msg}`;

      return `
        <div class="bouqs-product-card" data-id="${item.id}">
          <div class="card-media" onclick="openModal('${item.id}')">
            <span class="card-pill-badge">${item.badge}</span>
            <button class="card-wish-btn ${isFav ? 'active' : ''}" onclick="toggleWishlist(event, '${item.id}')" title="Save creation">
              ${isFav ? '❤️' : '🤍'}
            </button>
            <img class="card-img-main" src="${item.image}" alt="${title}" loading="lazy">
          </div>
          <div class="card-details">
            <div class="card-meta-line">
              <span class="card-cat-label">${catLabel}</span>
              <span class="card-color-dot" style="background-color: ${getColorHex(item.color)}"></span>
            </div>
            <h3 class="card-item-title" onclick="openModal('${item.id}')">${title}</h3>
            <p class="card-item-desc">${desc}</p>
            <div class="card-price-row">
              <div>
                <span class="card-price-value">${priceText}</span>
              </div>
              <span class="card-sizes-indicator">Original • Deluxe • Grand</span>
            </div>
            <div class="card-cta-group">
              <button class="btn-card-details" onclick="openModal('${item.id}')">
                <span>👁️</span> <span>${t.btnQuickView}</span>
              </button>
              <a class="btn-card-order-wa" href="${waLink}" target="_blank" rel="noopener">
                <span>💬</span> <span>${t.btnInquire}</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    loadMoreBtn.style.display = (visibleCount >= filtered.length) ? 'none' : 'inline-flex';
  }

  function getColorHex(color) {
    const map = {
      red: '#D93847',
      white: '#F4EFEB',
      pink: '#F2AEC1',
      gold: '#D4AF37',
      green: '#455746',
      mixed: '#C5A059'
    };
    return map[color] || '#C5A059';
  }

  // Wishlist toggle
  window.toggleWishlist = function(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) {
      favorites = favorites.filter(f => f !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem('valor_favorites', JSON.stringify(favorites));
    renderCatalog();
  };

  // Load More Button
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    renderCatalog();
  });

  // Modal (Bouqs Clean Slide-Over / Quick View with Riviera Attributes)
  window.openModal = function(id) {
    const item = VALOR_CATALOG.find(p => p.id === id);
    if (!item) return;

    activeModalItem = item;
    activeModalSizeIndex = 0;

    const title = currentLang === 'en' ? item.name_en : item.name_ar;
    const desc = currentLang === 'en' ? item.desc_en : item.desc_ar;
    const catLabel = currentLang === 'en' ? item.category_name_en : item.category_name_ar;

    document.getElementById('modalImage').src = item.image;
    document.getElementById('modalCategory').textContent = catLabel;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;

    renderModalSizes();
    updateModalPriceAndWhatsApp();

    productModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function renderModalSizes() {
    const container = document.getElementById('modalSizeBtns');
    if (!activeModalItem.sizes) return;

    container.innerHTML = activeModalItem.sizes.map((sz, idx) => {
      const name = currentLang === 'en' ? sz.name_en : sz.name_ar;
      return `
        <button class="size-choice-btn ${idx === activeModalSizeIndex ? 'selected' : ''}" onclick="selectModalSize(${idx})">
          <div>${name}</div>
          <div style="font-weight: 800; margin-top: 3px;">${sz.price_qar} QAR</div>
        </button>
      `;
    }).join('');
  }

  window.selectModalSize = function(idx) {
    activeModalSizeIndex = idx;
    renderModalSizes();
    updateModalPriceAndWhatsApp();
  };

  function updateModalPriceAndWhatsApp() {
    if (!activeModalItem) return;
    const sizeObj = activeModalItem.sizes[activeModalSizeIndex];
    const currentPrice = sizeObj ? sizeObj.price_qar : activeModalItem.price_qar;
    document.getElementById('modalPrice').textContent = `${currentPrice} QAR`;

    const topperSelect = document.getElementById('modalTopperSelect');
    const topperVal = topperSelect.value;
    const topperText = topperVal !== 'none' ? ` with custom acrylic topper "${topperVal}"` : '';
    const sizeName = sizeObj ? sizeObj.name_en : 'Standard';

    const msg = encodeURIComponent(
      `Hello Valor Qatar! I would like to order "${activeModalItem.name_en}" (${activeModalItem.id}) in ${sizeName} (${currentPrice} QAR)${topperText}. Please confirm same-day delivery availability in Doha.`
    );
    document.getElementById('modalWhatsAppBtn').href = `https://wa.me/97459992926?text=${msg}`;
  }

  function initModal() {
    modalCloseBtn.addEventListener('click', closeModal);
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) closeModal();
    });
    document.getElementById('modalTopperSelect').addEventListener('change', updateModalPriceAndWhatsApp);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && productModal.classList.contains('open')) closeModal();
    });
  }

  function closeModal() {
    productModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Custom Builder (Bouqs Style Interactive Concierge)
  function initBuilder() {
    document.querySelectorAll('.option-tile-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = btn.getAttribute('data-step');
        const val = btn.getAttribute('data-val');
        const price = parseInt(btn.getAttribute('data-price') || '0', 10);
        const nameEn = btn.getAttribute('data-name-en');
        const nameAr = btn.getAttribute('data-name-ar');

        btn.closest('.options-tile-grid').querySelectorAll('.option-tile-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        builderState[step] = { id: val, name_en: nameEn, name_ar: nameAr, price: price };
        updateBuilderSummary();
      });
    });

    updateBuilderSummary();
  }

  function updateBuilderSummary() {
    const isEn = currentLang === 'en';
    const base = builderState.base;
    const floral = builderState.floral;
    const confect = builderState.confectionery;
    const topper = builderState.topper;

    document.getElementById('summaryBaseVal').textContent = isEn ? base.name_en : base.name_ar;
    document.getElementById('summaryFloralVal').textContent = isEn ? floral.name_en : floral.name_ar;
    document.getElementById('summaryConfectVal').textContent = isEn ? confect.name_en : confect.name_ar;
    document.getElementById('summaryTopperVal').textContent = isEn ? topper.name_en : topper.name_ar;

    const total = base.price + floral.price + confect.price + topper.price;
    document.getElementById('summaryTotalVal').textContent = `${total} QAR`;

    const msg = encodeURIComponent(
      `Hello Valor Qatar Concierge! I have created a custom luxury curation on your online boutique:\n` +
      `• Base: ${base.name_en} (${base.price} QAR)\n` +
      `• Floral Accent: ${floral.name_en} (${floral.price} QAR)\n` +
      `• Confectionery: ${confect.name_en} (${confect.price} QAR)\n` +
      `• Calligraphy Topper: ${topper.name_en} (${topper.price} QAR)\n` +
      `• Estimated Total: ${total} QAR\n\n` +
      `Please provide delivery confirmation and customization options for Doha.`
    );
    document.getElementById('builderWhatsAppBtn').href = `https://wa.me/97459992926?text=${msg}`;
  }
});
