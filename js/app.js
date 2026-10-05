// Main Application Controller for Name Plate Studio

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvas = document.getElementById('plateCanvas');
  const renderer = new PlateRenderer(canvas);

  // Default Configuration State
  let config = {
    material: 'teak_wood',
    shape: 'rounded_rect',
    widthInches: 16,
    heightInches: 8,
    hardware: 'brass_standoffs',
    backlight: 'none',
    letteringStyle: 'gold_3d',
    wall: 'brick',
    nightMode: false,
    motifId: 'ganesha',
    motifPosition: 'top_center',
    motifSize: 42,
    motifColor: '#f59e0b',
    line1: {
      text: 'The Sharmas',
      font: 'Cinzel',
      size: 38,
      letterSpacing: 3,
      bold: true,
      italic: false,
      yOffset: 0
    },
    line2: {
      text: 'Villa Nirvana • 108',
      font: 'Montserrat',
      size: 16,
      letterSpacing: 4,
      bold: false,
      italic: false,
      yOffset: 0
    },
    line3: {
      text: 'WELCOME',
      font: 'Montserrat',
      size: 11,
      letterSpacing: 6,
      bold: true,
      italic: false,
      yOffset: 0
    }
  };

  // User Profile
  let userProfile = JSON.parse(localStorage.getItem('np_user_profile') || 'null') || {
    name: '',
    phone: '',
    address: ''
  };

  // Business Settings
  let businessSettings = JSON.parse(localStorage.getItem('np_business_settings') || 'null') || {
    shopName: 'ArtisansPlate',
    whatsappNumber: '919876543210',
    currency: '₹',
    rateFactor: 1.0
  };

  // Saved Designs
  let savedDesigns = JSON.parse(localStorage.getItem('np_saved_designs') || '[]');

  // Current Generated Snapshot
  let currentSnapshotDataUrl = null;
  let currentOrderId = null;

  // Initialize
  initApp();

  function initApp() {
    applyBusinessSettings();
    updateUserAuthUI();
    renderMotifsCatalog();
    renderTemplatesCatalog();
    updateSavedCountBadge();
    bindEvents();
    renderLive();
  }

  // Bind All Event Listeners
  function bindEvents() {
    // Tab Switching
    const tabButtons = document.querySelectorAll('#customizerTabs button');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
          b.className = 'flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition text-slate-400 hover:text-slate-200';
        });
        btn.className = 'flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition text-amber-300 bg-slate-800/90 border border-amber-500/30';

        const targetTab = btn.getAttribute('data-tab');
        ['tab-text', 'tab-material', 'tab-motif', 'tab-pricing'].forEach(tabId => {
          const el = document.getElementById(tabId);
          if (el) {
            if (tabId === targetTab) el.classList.remove('hidden');
            else el.classList.add('hidden');
          }
        });
      });
    });

    // Text inputs
    const line1Input = document.getElementById('inputLine1Text');
    const line2Input = document.getElementById('inputLine2Text');
    const line3Input = document.getElementById('inputLine3Text');

    line1Input.addEventListener('input', (e) => { config.line1.text = e.target.value; renderLive(); });
    line2Input.addEventListener('input', (e) => { config.line2.text = e.target.value; renderLive(); });
    line3Input.addEventListener('input', (e) => { config.line3.text = e.target.value; renderLive(); });

    // Font family dropdowns
    document.getElementById('selectLine1Font').addEventListener('change', (e) => {
      config.line1.font = e.target.value;
      renderLive();
    });
    document.getElementById('selectLine2Font').addEventListener('change', (e) => {
      config.line2.font = e.target.value;
      renderLive();
    });

    // Font size sliders
    const range1 = document.getElementById('rangeLine1Size');
    range1.addEventListener('input', (e) => {
      config.line1.size = parseInt(e.target.value);
      document.getElementById('line1SizeVal').innerText = `${e.target.value}px`;
      renderLive();
    });

    const range2 = document.getElementById('rangeLine2Size');
    range2.addEventListener('input', (e) => {
      config.line2.size = parseInt(e.target.value);
      document.getElementById('line2SizeVal').innerText = `${e.target.value}px`;
      renderLive();
    });

    // Lettering Style buttons
    document.querySelectorAll('#letteringFinishGrid button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#letteringFinishGrid button').forEach(b => {
          b.classList.remove('active', 'border-amber-500/40', 'bg-amber-500/10', 'text-amber-200');
          b.classList.add('border-slate-700', 'bg-dark-900', 'text-slate-200');
        });
        btn.classList.add('active', 'border-amber-500/40', 'bg-amber-500/10', 'text-amber-200');
        btn.classList.remove('border-slate-700', 'bg-dark-900');
        config.letteringStyle = btn.getAttribute('data-finish');
        renderLive();
      });
    });

    // Material Selection Cards
    document.querySelectorAll('#materialGrid .material-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#materialGrid .material-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        config.material = card.getAttribute('data-mat');
        renderLive();
      });
    });

    // Shape buttons
    document.querySelectorAll('#shapeGrid button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#shapeGrid button').forEach(b => {
          b.classList.remove('active', 'border-amber-500/50', 'bg-amber-500/10', 'text-amber-200');
          b.classList.add('border-slate-700', 'bg-dark-900', 'text-slate-300');
        });
        btn.classList.add('active', 'border-amber-500/50', 'bg-amber-500/10', 'text-amber-200');
        btn.classList.remove('border-slate-700', 'bg-dark-900', 'text-slate-300');
        config.shape = btn.getAttribute('data-shape');
        renderLive();
      });
    });

    // Dimensions Sliders
    const rangeW = document.getElementById('rangeWidth');
    const rangeH = document.getElementById('rangeHeight');
    rangeW.addEventListener('input', (e) => {
      config.widthInches = parseInt(e.target.value);
      document.getElementById('widthVal').innerText = `${e.target.value} in`;
      updateDimensionsUI();
      renderLive();
    });
    rangeH.addEventListener('input', (e) => {
      config.heightInches = parseInt(e.target.value);
      document.getElementById('heightVal').innerText = `${e.target.value} in`;
      updateDimensionsUI();
      renderLive();
    });

    // Size Presets
    document.querySelectorAll('#sizePresets button').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = parseInt(btn.getAttribute('data-w'));
        const h = parseInt(btn.getAttribute('data-h'));
        config.widthInches = w;
        config.heightInches = h;
        rangeW.value = w;
        rangeH.value = h;
        document.getElementById('widthVal').innerText = `${w} in`;
        document.getElementById('heightVal').innerText = `${h} in`;
        document.querySelectorAll('#sizePresets button').forEach(b => {
          b.className = 'p-1.5 rounded border border-slate-700 hover:border-slate-500 bg-dark-900 text-slate-300';
        });
        btn.className = 'p-1.5 rounded border border-amber-500/40 bg-amber-500/15 text-amber-300 font-bold';
        updateDimensionsUI();
        renderLive();
      });
    });

    // Hardware buttons
    document.querySelectorAll('#hardwareGrid button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#hardwareGrid button').forEach(b => {
          b.classList.remove('active', 'border-amber-500/50', 'bg-amber-500/10', 'text-amber-200');
          b.classList.add('border-slate-700', 'bg-dark-900', 'text-slate-300');
        });
        btn.classList.add('active', 'border-amber-500/50', 'bg-amber-500/10', 'text-amber-200');
        btn.classList.remove('border-slate-700', 'bg-dark-900', 'text-slate-300');
        config.hardware = btn.getAttribute('data-hardware');
        renderLive();
      });
    });

    // Backlight buttons
    document.querySelectorAll('#backlightGrid button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#backlightGrid button').forEach(b => {
          b.classList.remove('active', 'border-amber-500/50', 'bg-amber-500/10', 'text-amber-200');
          b.classList.add('border-slate-700', 'bg-dark-900', 'text-slate-300');
        });
        btn.classList.add('active', 'border-amber-500/50', 'bg-amber-500/10', 'text-amber-200');
        btn.classList.remove('border-slate-700', 'bg-dark-900', 'text-slate-300');
        config.backlight = btn.getAttribute('data-backlight');
        if (config.backlight !== 'none') {
          config.nightMode = true;
          updateNightButtonState();
        }
        renderLive();
      });
    });

    // Motif Position buttons
    document.querySelectorAll('#motifPositionGrid button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#motifPositionGrid button').forEach(b => {
          b.classList.remove('active', 'border-amber-500/50', 'bg-amber-500/10', 'text-amber-200');
          b.classList.add('border-slate-700', 'bg-dark-900', 'text-slate-300');
        });
        btn.classList.add('active', 'border-amber-500/50', 'bg-amber-500/10', 'text-amber-200');
        btn.classList.remove('border-slate-700', 'bg-dark-900', 'text-slate-300');
        config.motifPosition = btn.getAttribute('data-pos');
        renderLive();
      });
    });

    // Motif Size range
    const rangeMotif = document.getElementById('rangeMotifSize');
    rangeMotif.addEventListener('input', (e) => {
      config.motifSize = parseInt(e.target.value);
      document.getElementById('motifSizeVal').innerText = `${e.target.value}px`;
      renderLive();
    });

    // Wall switcher
    document.querySelectorAll('#wallSwitcher button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#wallSwitcher button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        config.wall = btn.getAttribute('data-wall');
        renderLive();
      });
    });

    // Night mode toggle
    document.getElementById('btnToggleNight').addEventListener('click', () => {
      config.nightMode = !config.nightMode;
      updateNightButtonState();
      renderLive();
    });

    // Quick download image button
    document.getElementById('btnDownloadImage').addEventListener('click', () => {
      downloadCurrentDesignPNG();
    });

    // Save design button
    document.getElementById('btnQuickSaveDesign').addEventListener('click', () => {
      saveCurrentDesign();
    });

    // Order via WhatsApp (Both buttons)
    document.getElementById('btnOrderWhatsApp').addEventListener('click', () => openOrderFlow());
    document.getElementById('btnPricingOrderWhatsApp').addEventListener('click', () => openOrderFlow());

    // Order Modal actions
    document.getElementById('btnCloseOrderModal').addEventListener('click', () => {
      document.getElementById('modalOrder').classList.add('hidden');
    });
    document.getElementById('btnSendWhatsAppDirect').addEventListener('click', () => {
      sendOrderToWhatsApp();
    });
    document.getElementById('btnReDownloadImage').addEventListener('click', () => {
      downloadCurrentDesignPNG();
    });
    document.getElementById('btnCopyOrderText').addEventListener('click', () => {
      copyOrderSpecsToClipboard();
    });

    // Modals: User Auth
    document.getElementById('btnUserAuth').addEventListener('click', () => {
      openAuthModal();
    });
    document.getElementById('btnCloseAuthModal').addEventListener('click', () => {
      document.getElementById('modalUserAuth').classList.add('hidden');
    });
    document.getElementById('formAuth').addEventListener('submit', (e) => {
      e.preventDefault();
      userProfile = {
        name: document.getElementById('authName').value.trim(),
        phone: document.getElementById('authPhone').value.trim(),
        address: document.getElementById('authAddress').value.trim()
      };
      localStorage.setItem('np_user_profile', JSON.stringify(userProfile));
      updateUserAuthUI();
      document.getElementById('modalUserAuth').classList.add('hidden');
      showToast('Profile saved successfully!');
    });

    // Modals: Templates
    document.getElementById('btnOpenTemplates').addEventListener('click', () => {
      document.getElementById('modalTemplates').classList.remove('hidden');
    });
    document.getElementById('btnCloseTemplatesModal').addEventListener('click', () => {
      document.getElementById('modalTemplates').classList.add('hidden');
    });

    // Modals: Saved Designs
    document.getElementById('btnOpenSaved').addEventListener('click', () => {
      openSavedDesignsModal();
    });
    document.getElementById('btnCloseSavedModal').addEventListener('click', () => {
      document.getElementById('modalSavedDesigns').classList.add('hidden');
    });

    // Modals: Business Settings
    document.getElementById('btnOpenSettings').addEventListener('click', () => {
      document.getElementById('settingShopName').value = businessSettings.shopName;
      document.getElementById('settingWhatsAppNumber').value = businessSettings.whatsappNumber;
      document.getElementById('settingCurrency').value = businessSettings.currency;
      document.getElementById('settingRateFactor').value = businessSettings.rateFactor;
      document.getElementById('modalBusinessSettings').classList.remove('hidden');
    });
    document.getElementById('btnCloseSettingsModal').addEventListener('click', () => {
      document.getElementById('modalBusinessSettings').classList.add('hidden');
    });
    document.getElementById('formBusinessSettings').addEventListener('submit', (e) => {
      e.preventDefault();
      businessSettings = {
        shopName: document.getElementById('settingShopName').value.trim() || 'ArtisansPlate',
        whatsappNumber: document.getElementById('settingWhatsAppNumber').value.trim().replace(/[^0-9]/g, '') || '919876543210',
        currency: document.getElementById('settingCurrency').value.trim() || '₹',
        rateFactor: parseFloat(document.getElementById('settingRateFactor').value) || 1.0
      };
      localStorage.setItem('np_business_settings', JSON.stringify(businessSettings));
      applyBusinessSettings();
      document.getElementById('modalBusinessSettings').classList.add('hidden');
      renderLive();
      showToast('Business settings updated!');
    });
  }

  // Update Night button appearance
  function updateNightButtonState() {
    const btn = document.getElementById('btnToggleNight');
    const label = document.getElementById('nightModeLabel');
    if (config.nightMode) {
      btn.className = 'flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-amber-500/50 bg-amber-500/20 text-amber-200 transition text-[11px] font-medium';
      label.innerText = 'Night (On)';
    } else {
      btn.className = 'flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-slate-700 bg-dark-900 hover:bg-slate-800 text-slate-300 transition text-[11px] font-medium';
      label.innerText = 'Night Mode';
    }
  }

  // Update Dimensions UI text
  function updateDimensionsUI() {
    const sqIn = config.widthInches * config.heightInches;
    document.getElementById('dimensionsBadge').innerText = `${config.widthInches}" × ${config.heightInches}" (${sqIn} sq. in.)`;
    document.getElementById('specDimensions').innerText = `${config.widthInches}" × ${config.heightInches}"`;
  }

  // Calculate Dynamic Price
  function calculatePrice() {
    const sqIn = config.widthInches * config.heightInches;
    let baseRate = 12; // Teakwood
    if (config.material === 'walnut_wood') baseRate = 13;
    else if (config.material === 'black_acrylic') baseRate = 10;
    else if (config.material === 'dual_layer') baseRate = 16;
    else if (config.material === 'brushed_brass') baseRate = 15;
    else if (config.material === 'stainless_steel') baseRate = 14;
    else if (config.material === 'slate_stone') baseRate = 11;

    let basePlateCost = Math.round(sqIn * baseRate * businessSettings.rateFactor);

    let letteringCost = 350;
    if (config.letteringStyle === 'silver_mirror') letteringCost = 350;
    else if (config.letteringStyle === 'laser_engraved') letteringCost = 200;
    else if (config.letteringStyle === 'matte_white') letteringCost = 150;

    let motifCost = (config.motifId && config.motifId !== 'none') ? 200 : 0;
    let backlightCost = (config.backlight && config.backlight !== 'none') ? 450 : 0;
    let hardwareCost = 0; // Free inclusion

    const total = basePlateCost + letteringCost + motifCost + backlightCost + hardwareCost;

    return {
      basePlateCost,
      letteringCost,
      motifCost,
      backlightCost,
      hardwareCost,
      total,
      currency: businessSettings.currency
    };
  }

  // Render Live Preview & Update Price UI
  function renderLive() {
    // 1. Render on Canvas
    renderer.render(config, { isExport: false });

    // 2. Compute Price
    const p = calculatePrice();

    // 3. Update Specs Bar
    const matNames = {
      teak_wood: 'Natural Teakwood',
      walnut_wood: 'Rich Walnut Wood',
      black_acrylic: 'Glossy Black Acrylic',
      dual_layer: 'Dual-Layer (Wood + Glass)',
      brushed_brass: 'Brushed Brass Metal',
      stainless_steel: 'Stainless Steel',
      slate_stone: 'Dark Slate Stone'
    };
    document.getElementById('specMaterialName').innerText = matNames[config.material] || config.material;

    const finishNames = {
      gold_3d: '3D Gold Acrylic',
      silver_mirror: '3D Mirror Silver',
      laser_engraved: 'Laser Engraved',
      matte_white: 'Matte White'
    };
    document.getElementById('specLettering').innerText = finishNames[config.letteringStyle] || config.letteringStyle;
    document.getElementById('specTotalPrice').innerText = `${p.currency}${p.total.toLocaleString()}`;

    // 4. Update Tab 4 Pricing Breakdown
    document.getElementById('priceMatLabel').innerText = `Base Plate (${matNames[config.material]} ${config.widthInches}" × ${config.heightInches}")`;
    document.getElementById('priceMatVal').innerText = `${p.currency}${p.basePlateCost.toLocaleString()}`;
    document.getElementById('priceLetteringLabel').innerText = `${finishNames[config.letteringStyle]} Lettering`;
    document.getElementById('priceLetteringVal').innerText = `${p.currency}${p.letteringCost.toLocaleString()}`;
    document.getElementById('priceMotifVal').innerText = (config.motifId !== 'none') ? `${p.currency}${p.motifCost}` : 'None';
    
    const backlightRow = document.getElementById('priceBacklightRow');
    if (config.backlight !== 'none') {
      backlightRow.style.display = 'flex';
      document.getElementById('priceBacklightVal').innerText = `${p.currency}${p.backlightCost}`;
    } else {
      backlightRow.style.display = 'none';
    }

    document.getElementById('priceBreakdownTotal').innerText = `${p.currency}${p.total.toLocaleString()}`;
  }

  // Render Motifs Catalog in Tab 3
  function renderMotifsCatalog() {
    const grid = document.getElementById('motifCatalogGrid');
    grid.innerHTML = '';

    Object.keys(window.MOTIFS).forEach(key => {
      const item = window.MOTIFS[key];
      const isSelected = config.motifId === item.id;
      const el = document.createElement('button');
      el.className = `motif-item p-2 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition ${isSelected ? 'active' : 'bg-dark-900'}`;
      el.setAttribute('data-motif', item.id);

      if (item.id === 'none') {
        el.innerHTML = `
          <div class="w-7 h-7 rounded-lg border border-dashed border-slate-600 flex items-center justify-center text-slate-500">
            <i data-lucide="ban" class="w-3.5 h-3.5"></i>
          </div>
          <span class="text-[10px] text-slate-400 font-medium">None</span>
        `;
      } else {
        el.innerHTML = `
          <div class="w-7 h-7 flex items-center justify-center text-amber-400">
            <svg viewBox="${item.viewBox}" class="w-6 h-6 fill-current">
              <path d="${item.path.trim()}"/>
            </svg>
          </div>
          <span class="text-[10px] text-slate-300 font-medium truncate w-full">${item.name}</span>
        `;
      }

      el.addEventListener('click', () => {
        document.querySelectorAll('#motifCatalogGrid .motif-item').forEach(m => m.classList.remove('active'));
        el.classList.add('active');
        config.motifId = item.id;
        renderLive();
      });

      grid.appendChild(el);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // Render Templates Catalog Modal
  function renderTemplatesCatalog() {
    const grid = document.getElementById('templateGalleryGrid');
    grid.innerHTML = '';

    window.TEMPLATES.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'template-card bg-dark-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between cursor-pointer';
      card.innerHTML = `
        <div>
          <div class="h-24 w-full rounded-lg mb-2.5 relative flex items-center justify-center overflow-hidden" style="background: ${tpl.thumbnailColor}">
            <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-dark-950 shadow">
              ${tpl.badge}
            </div>
            <div class="text-white font-serif font-bold text-sm tracking-wide shadow-sm text-center px-2">
              ${tpl.config.line1.text}
            </div>
          </div>
          <h4 class="font-bold text-xs text-white">${tpl.title}</h4>
          <p class="text-[11px] text-slate-400">${tpl.subtitle}</p>
        </div>
        <button class="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-brand-500 hover:text-dark-950 transition border border-slate-700">
          Load Template
        </button>
      `;

      card.addEventListener('click', () => {
        loadTemplate(tpl);
        document.getElementById('modalTemplates').classList.add('hidden');
        showToast(`Template "${tpl.title}" loaded!`);
      });

      grid.appendChild(card);
    });
  }

  // Load Template into Studio State
  function loadTemplate(tpl) {
    config = JSON.parse(JSON.stringify(tpl.config));
    
    // Sync UI elements
    document.getElementById('inputLine1Text').value = config.line1.text || '';
    document.getElementById('inputLine2Text').value = config.line2.text || '';
    document.getElementById('inputLine3Text').value = config.line3.text || '';
    document.getElementById('selectLine1Font').value = config.line1.font || 'Cinzel';
    document.getElementById('selectLine2Font').value = config.line2.font || 'Montserrat';
    document.getElementById('rangeLine1Size').value = config.line1.size || 38;
    document.getElementById('line1SizeVal').innerText = `${config.line1.size}px`;
    document.getElementById('rangeLine2Size').value = config.line2.size || 16;
    document.getElementById('line2SizeVal').innerText = `${config.line2.size}px`;

    document.getElementById('rangeWidth').value = config.widthInches;
    document.getElementById('widthVal').innerText = `${config.widthInches} in`;
    document.getElementById('rangeHeight').value = config.heightInches;
    document.getElementById('heightVal').innerText = `${config.heightInches} in`;
    updateDimensionsUI();

    // Sync material cards
    document.querySelectorAll('#materialGrid .material-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-mat') === config.material);
    });

    // Sync shape
    document.querySelectorAll('#shapeGrid button').forEach(b => {
      const active = b.getAttribute('data-shape') === config.shape;
      b.classList.toggle('active', active);
      b.classList.toggle('border-amber-500/50', active);
      b.classList.toggle('bg-amber-500/10', active);
      b.classList.toggle('text-amber-200', active);
    });

    // Sync motifs
    document.querySelectorAll('#motifCatalogGrid .motif-item').forEach(m => {
      m.classList.toggle('active', m.getAttribute('data-motif') === config.motifId);
    });

    updateNightButtonState();
    renderLive();
  }

  // Open WhatsApp Order Flow
  function openOrderFlow() {
    currentOrderId = 'NP-' + Math.floor(100000 + Math.random() * 900000);
    
    // Generate crisp 2.5x high-res image
    currentSnapshotDataUrl = renderer.getHighResDataURL(config);

    // Set preview image in modal
    const previewImg = document.getElementById('orderPreviewImg');
    previewImg.src = currentSnapshotDataUrl;

    // Pre-fill user profile fields
    document.getElementById('orderCustName').value = userProfile.name || '';
    document.getElementById('orderCustPhone').value = userProfile.phone || '';
    document.getElementById('orderCustAddress').value = userProfile.address || '';

    // Automatically trigger image download for customer's convenience
    downloadImageFile(currentSnapshotDataUrl, `Custom-NamePlate-${currentOrderId}.png`);

    // Show modal
    document.getElementById('modalOrder').classList.remove('hidden');
  }

  // Send Order Directly to WhatsApp
  function sendOrderToWhatsApp() {
    const custName = document.getElementById('orderCustName').value.trim() || userProfile.name || 'Valued Customer';
    const custPhone = document.getElementById('orderCustPhone').value.trim() || userProfile.phone || 'N/A';
    const custAddr = document.getElementById('orderCustAddress').value.trim() || userProfile.address || 'To be shared in chat';
    const specialNotes = document.getElementById('orderSpecialNotes').value.trim();

    // Save updated info to profile
    if (custName || custPhone || custAddr) {
      userProfile.name = custName;
      userProfile.phone = custPhone;
      userProfile.address = custAddr;
      localStorage.setItem('np_user_profile', JSON.stringify(userProfile));
      updateUserAuthUI();
    }

    const priceInfo = calculatePrice();
    const matNames = {
      teak_wood: 'Natural Teakwood',
      walnut_wood: 'Rich Walnut Wood',
      black_acrylic: 'Glossy Black Acrylic',
      dual_layer: 'Dual-Layer (Wood + Floating Glass)',
      brushed_brass: 'Brushed Brass Metal',
      stainless_steel: 'Stainless Steel',
      slate_stone: 'Dark Slate Stone'
    };
    const finishNames = {
      gold_3d: '3D Raised Golden Acrylic',
      silver_mirror: '3D Mirror Silver Chrome',
      laser_engraved: 'Laser Engraved Inset',
      matte_white: 'Matte Architectural White'
    };

    const motifObj = window.MOTIFS[config.motifId];
    const motifName = (motifObj && motifObj.name !== 'None') ? `${motifObj.name} (${config.motifPosition})` : 'None';
    const backlightText = (config.backlight !== 'none') ? `LED Backlight (${config.backlight}) + 12V Adapter` : 'No Backlight';
    const hardwareText = (config.hardware === 'brass_standoffs') ? '4 Brass Standoffs (Included)' : (config.hardware === 'silver_screws' ? '4 Steel Screws' : 'Hidden Mounting');

    // Build Professional WhatsApp Order Message
    let msg = `🌟 *NEW CUSTOM NAME PLATE ORDER* 🌟\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🆔 *Order Ref:* #${currentOrderId}\n`;
    msg += `👤 *Customer Name:* ${custName}\n`;
    msg += `📱 *Phone:* ${custPhone}\n`;
    msg += `📍 *Delivery Address:* ${custAddr}\n\n`;

    msg += `🎨 *NAME PLATE SPECIFICATIONS:*\n`;
    msg += `• *Line 1 (Main):* "${config.line1.text}" (${config.line1.font})\n`;
    if (config.line2.text) msg += `• *Line 2:* "${config.line2.text}"\n`;
    if (config.line3.text) msg += `• *Line 3:* "${config.line3.text}"\n`;
    msg += `• *Material:* ${matNames[config.material] || config.material}\n`;
    msg += `• *Shape:* ${config.shape.toUpperCase()}\n`;
    msg += `• *Dimensions:* ${config.widthInches}" × ${config.heightInches}" (${config.widthInches * config.heightInches} sq. in.)\n`;
    msg += `• *Lettering Finish:* ${finishNames[config.letteringStyle] || config.letteringStyle}\n`;
    msg += `• *Emblem / Motif:* ${motifName}\n`;
    msg += `• *Illumination:* ${backlightText}\n`;
    msg += `• *Fitting Hardware:* ${hardwareText}\n`;

    if (specialNotes) {
      msg += `\n📝 *Artisan Notes:* ${specialNotes}\n`;
    }

    msg += `\n💰 *TOTAL ESTIMATE:* ${priceInfo.currency}${priceInfo.total.toLocaleString()} (Free Delivery & Fittings)\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📎 *Note:* I have downloaded and attached my custom design image preview to this message. Please confirm my order and timeline. Thank you!`;

    // Construct WhatsApp Click-to-Chat URL
    const targetNumber = businessSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${targetNumber}?text=${encodedMsg}`;

    // Open in new tab / window
    window.open(waUrl, '_blank');
  }

  // Copy Specs to Clipboard
  function copyOrderSpecsToClipboard() {
    const custName = document.getElementById('orderCustName').value.trim() || userProfile.name || 'Valued Customer';
    const priceInfo = calculatePrice();
    const textToCopy = `Order #${currentOrderId} for ${custName} | Plate: "${config.line1.text}" | Total: ${priceInfo.currency}${priceInfo.total}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Order details copied to clipboard!');
    }).catch(() => {
      showToast('Copied to clipboard');
    });
  }

  // Download Current Design as PNG
  function downloadCurrentDesignPNG() {
    const dataUrl = renderer.getHighResDataURL(config);
    const filename = `NamePlate-${config.line1.text.replace(/[^a-zA-Z0-9]/g, '_') || 'Design'}.png`;
    downloadImageFile(dataUrl, filename);
    showToast('High-Res PNG image downloaded!');
  }

  // Trigger browser download of Data URL
  function downloadImageFile(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Save current design to LocalStorage
  function saveCurrentDesign() {
    const id = 'saved_' + Date.now();
    const title = config.line1.text || 'Untitled Plate';
    const thumbnail = renderer.getHighResDataURL(config);

    const savedItem = {
      id,
      title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      thumbnail,
      config: JSON.parse(JSON.stringify(config))
    };

    savedDesigns.unshift(savedItem);
    localStorage.setItem('np_saved_designs', JSON.stringify(savedDesigns));
    updateSavedCountBadge();
    showToast(`"${title}" saved to your collection!`);
  }

  // Open Saved Designs Modal
  function openSavedDesignsModal() {
    const container = document.getElementById('savedDesignsContainer');
    container.innerHTML = '';

    if (savedDesigns.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          <i data-lucide="bookmark-x" class="w-10 h-10 mx-auto mb-2 text-slate-600"></i>
          <p class="text-sm font-semibold text-slate-300">No saved designs yet</p>
          <p class="text-xs text-slate-500 mt-1">Click the "Save" button in the studio to save your custom plates here.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      document.getElementById('modalSavedDesigns').classList.remove('hidden');
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-4';

    savedDesigns.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'bg-dark-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <img src="${item.thumbnail}" alt="${item.title}" class="w-full h-32 object-cover rounded-lg mb-2 shadow">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-xs text-white truncate">${item.title}</h4>
            <span class="text-[10px] text-slate-500">${item.date}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
          <button class="btn-load flex-1 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 text-dark-950 hover:bg-brand-400 transition">
            Load in Studio
          </button>
          <button class="btn-del p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition" title="Delete">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      `;

      card.querySelector('.btn-load').addEventListener('click', () => {
        loadTemplate({ config: item.config, title: item.title });
        document.getElementById('modalSavedDesigns').classList.add('hidden');
        showToast(`Loaded "${item.title}"`);
      });

      card.querySelector('.btn-del').addEventListener('click', (e) => {
        e.stopPropagation();
        savedDesigns.splice(index, 1);
        localStorage.setItem('np_saved_designs', JSON.stringify(savedDesigns));
        updateSavedCountBadge();
        openSavedDesignsModal();
        showToast('Design removed');
      });

      grid.appendChild(card);
    });

    container.appendChild(grid);
    if (window.lucide) window.lucide.createIcons();
    document.getElementById('modalSavedDesigns').classList.remove('hidden');
  }

  // Update Saved Count Badge
  function updateSavedCountBadge() {
    const badge = document.getElementById('savedCountBadge');
    if (savedDesigns.length > 0) {
      badge.innerText = savedDesigns.length;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  // Update User Auth UI
  function updateUserAuthUI() {
    const label = document.getElementById('userAuthLabel');
    if (userProfile.name) {
      label.innerText = userProfile.name.split(' ')[0];
    } else {
      label.innerText = 'Customer Sign In';
    }
  }

  // Open Auth Modal
  function openAuthModal() {
    document.getElementById('authName').value = userProfile.name || '';
    document.getElementById('authPhone').value = userProfile.phone || '';
    document.getElementById('authAddress').value = userProfile.address || '';
    document.getElementById('modalUserAuth').classList.remove('hidden');
  }

  // Apply Business Settings to UI
  function applyBusinessSettings() {
    document.getElementById('headerBrandName').innerText = businessSettings.shopName;
  }

  // Show Toast
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 2800);
  }
});
