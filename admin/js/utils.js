// ============================================================
// utils.js  –  Shared utilities used across all admin pages
// ============================================================

// ── Toast Notifications ──────────────────────────────────────
let toastContainer = null;
function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}
export function toast(message, type = 'success', duration = 3000) {
  const container = ensureToastContainer();
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span>${icons[type] || '•'}</span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; el.style.transition = '.25s'; setTimeout(() => el.remove(), 300); }, duration);
}

// ── Button Loading State ─────────────────────────────────────
export function btnLoad(btn, loading = true) {
  if (loading) {
    btn._text = btn.innerHTML;
    btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>';
    btn.disabled = true;
  } else {
    btn.innerHTML = btn._text || btn.innerHTML;
    btn.disabled = false;
  }
}

// ── Confirm Dialog ───────────────────────────────────────────
export function confirm(message) {
  return window.confirm(message);
}

// ── Format Date ──────────────────────────────────────────────
export function fmtDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Slugify ──────────────────────────────────────────────────
export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Multi-select tag chips UI ────────────────────────────────
export function renderTagSelect(container, options, selected = [], onChange) {
  container.innerHTML = '';
  container.className = 'tag-select';
  options.forEach(opt => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip' + (selected.includes(opt.id) ? ' selected' : '');
    chip.textContent = opt.name;
    chip.dataset.id = opt.id;
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const sel = [...container.querySelectorAll('.tag-chip.selected')].map(c => c.dataset.id);
      onChange(sel);
    });
    container.appendChild(chip);
  });
}

// ── Load Store Branding into Nav ─────────────────────────────
export async function loadBranding() {
  try {
    const { getStoreSettings } = await import('./db.js');
    const s = await getStoreSettings();
    const nameEl = document.getElementById('brand-name');
    const tagEl  = document.getElementById('brand-tag');
    const iconEl = document.getElementById('brand-icon');
    const logoEl = document.getElementById('brand-logo');
    if (nameEl) nameEl.textContent = s.name || 'Admin Panel';
    if (tagEl)  tagEl.textContent  = s.tagline || '';
    if (s.logoUrl) {
      if (logoEl) { logoEl.src = s.logoUrl; logoEl.style.display = 'block'; if (iconEl) iconEl.style.display = 'none'; }
    }
    // Page title
    document.title = (s.name || 'Admin') + ' — Admin Panel';
  } catch(e) { /* ignore on login page or if not configured */ }
}

// ── Active nav link ──────────────────────────────────────────
export function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('href') && path.includes(el.getAttribute('href').split('/').pop().replace('.html','')));
  });
}

// ── SVG Preview ──────────────────────────────────────────────
export async function previewSVG(url, container) {
  try {
    const resp = await fetch(url);
    const svg  = await resp.text();
    container.innerHTML = svg;
    const svgEl = container.querySelector('svg');
    if (svgEl) { svgEl.style.width = '100%'; svgEl.style.height = 'auto'; svgEl.style.maxHeight = '80px'; }
  } catch { container.innerHTML = `<img src="${url}" style="max-height:80px;">`; }
}

// ── LED CSS class ────────────────────────────────────────────
export function ledClass(effect) {
  const map = {
    shadow_led: 'led-shadow',
    backlit:    'led-backlit',
    led_letter_box: 'led-box',
    cutout_led: 'led-cutout',
    floating_led: 'led-floating',
    none: ''
  };
  return map[effect] || '';
}
