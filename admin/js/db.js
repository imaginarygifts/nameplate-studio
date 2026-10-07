// ============================================================
// db.js  –  Firestore + Local-First Fallback Helper Wrappers
// Works out of the box with localStorage and connects to Firestore
// ============================================================
import { db, storage } from "./firebase-config.js";
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, query, orderBy, serverTimestamp, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Helper for local storage fallback
function getLocal(key, def = []) {
  try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
}
function setLocal(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Store Settings ───────────────────────────────────────────
export async function getStoreSettings() {
  try {
    const snap = await getDoc(doc(db, "store", "settings"));
    if (snap.exists()) return snap.data();
  } catch(e) {}
  return getLocal("np_store_settings", {
    name: "ArtisansPlate Studio",
    tagline: "Custom Handcrafted 3D Name Plates",
    whatsapp: "919876543210",
    currency: "₹"
  });
}

export async function saveStoreSettings(data) {
  setLocal("np_store_settings", data);
  try {
    await setDoc(doc(db, "store", "settings"), data, { merge: true });
  } catch(e) {}
}

// ── Admins ───────────────────────────────────────────────────
export async function getAdmins() {
  try {
    const snap = await getDocs(query(collection(db, "admins"), orderBy("createdAt", "desc")));
    if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {}
  return getLocal("np_admins_list", [
    { id: "owner_1", name: "Shop Owner", email: "owner@nameplate.studio", role: "owner", createdAt: new Date().toISOString() }
  ]);
}

export async function saveAdmin(uid, data) {
  const list = getLocal("np_admins_list", []);
  const idx = list.findIndex(x => x.id === uid);
  const record = { id: uid, ...data, createdAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = record; else list.unshift(record);
  setLocal("np_admins_list", list);

  try {
    await setDoc(doc(db, "admins", uid), { ...data, createdAt: serverTimestamp() }, { merge: true });
  } catch(e) {}
}

export async function deleteAdmin(uid) {
  const list = getLocal("np_admins_list", []).filter(x => x.id !== uid);
  setLocal("np_admins_list", list);
  try { await deleteDoc(doc(db, "admins", uid)); } catch(e) {}
}

// ── Name Plate Types ─────────────────────────────────────────
export async function getNameplateTypes() {
  try {
    const snap = await getDocs(query(collection(db, "nameplate_types"), orderBy("name")));
    if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {}
  return getLocal("np_plate_types", [
    { id: "type_glossy", name: "Acrylic Glossy Name Plate", ledEffect: "none", ratePerSqIn: 10, description: "Ultra-glossy mirror finish with beveled polished border" },
    { id: "type_matte", name: "Acrylic Matte Finish Plate", ledEffect: "none", ratePerSqIn: 11, description: "Satin frosted anti-glare contemporary surface" },
    { id: "type_wooden", name: "Wooden Handcrafted Plate", ledEffect: "none", ratePerSqIn: 12, description: "Natural Teakwood & Walnut with laser engraving" },
    { id: "type_shadow_led", name: "Shadow LED Halo Plate", ledEffect: "shadow_led", ratePerSqIn: 15, description: "Soft warm halo glow projecting backward onto the wall" },
    { id: "type_backlit", name: "Backlit Illumination Plate", ledEffect: "backlit", ratePerSqIn: 16, description: "360-degree ambient backlighting behind plate" },
    { id: "type_box_led", name: "3D LED Letters Box Plate", ledEffect: "led_letter_box", ratePerSqIn: 20, description: "Deep 3D box channel letters with bright internal illumination" },
    { id: "type_cutout_led", name: "Cut-Out Stencil LED Plate", ledEffect: "cutout_led", ratePerSqIn: 18, description: "Precision laser stencil faceplate with illuminated letters" },
    { id: "type_floating_led", name: "Floating Strip LED Plate", ledEffect: "floating_led", ratePerSqIn: 19, description: "Letters float on an acrylic strip with backlit LED effect" }
  ]);
}

export async function saveNameplateType(id, data) {
  const list = getLocal("np_plate_types", await getNameplateTypes());
  const newId = id || "type_" + Date.now();
  const record = { id: newId, ...data };
  const idx = list.findIndex(x => x.id === newId);
  if (idx >= 0) list[idx] = record; else list.push(record);
  setLocal("np_plate_types", list);

  try {
    if (id) await setDoc(doc(db, "nameplate_types", id), data, { merge: true });
    else await addDoc(collection(db, "nameplate_types"), { ...data, createdAt: serverTimestamp() });
  } catch(e) {}
}

export async function deleteNameplateType(id) {
  const list = getLocal("np_plate_types", []).filter(x => x.id !== id);
  setLocal("np_plate_types", list);
  try { await deleteDoc(doc(db, "nameplate_types", id)); } catch(e) {}
}

// ── Generic CRUD Helper ──────────────────────────────────────
async function genericGet(col, defaultData = []) {
  try {
    const snap = await getDocs(query(collection(db, col), orderBy("createdAt", "desc")));
    if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {}
  return getLocal(`np_col_${col}`, defaultData);
}

export async function addItem(col, data) {
  const list = getLocal(`np_col_${col}`, []);
  const newId = `${col}_` + Date.now();
  const record = { id: newId, ...data, createdAt: new Date().toISOString() };
  list.unshift(record);
  setLocal(`np_col_${col}`, list);

  try {
    const docRef = await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
    return docRef;
  } catch(e) {
    return { id: newId };
  }
}

export async function updateItem(col, id, data) {
  const list = getLocal(`np_col_${col}`, []);
  const idx = list.findIndex(x => x.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...data };
    setLocal(`np_col_${col}`, list);
  }
  try {
    await setDoc(doc(db, col, id), data, { merge: true });
  } catch(e) {}
}

export async function deleteItem(col, id) {
  const list = getLocal(`np_col_${col}`, []).filter(x => x.id !== id);
  setLocal(`np_col_${col}`, list);
  try {
    await deleteDoc(doc(db, col, id));
  } catch(e) {}
}

// ── Named Export Collections with Rich Defaults ──────────────
export const getFonts = async () => genericGet("fonts", [
  { id: "font_cinzel", name: "Cinzel (Royal Serif)", fontFamily: "Cinzel", allowedTypes: [] },
  { id: "font_playfair", name: "Playfair Display (Luxury)", fontFamily: "Playfair Display", allowedTypes: [] },
  { id: "font_great_vibes", name: "Great Vibes (Calligraphy)", fontFamily: "Great Vibes", allowedTypes: [] },
  { id: "font_montserrat", name: "Montserrat (Clean Modern)", fontFamily: "Montserrat", allowedTypes: [] },
  { id: "font_poppins", name: "Poppins (Geometric)", fontFamily: "Poppins", allowedTypes: [] },
  { id: "font_rozha", name: "Rozha One (Heritage Devanagari)", fontFamily: "Rozha One", allowedTypes: [] }
]);

export const getLogos = async () => genericGet("logos", [
  { id: "logo_ganesha", name: "Lord Ganesha", category: "Auspicious", svgCode: '<svg viewBox="0 0 100 100" fill="#f59e0b"><path d="M50,12 C44,12 40,16 40,21 C40,26 44,29 47,32 C43,33 38,36 36,41 C33,48 34,56 36,62 C38,67 43,72 49,74 C50,75 51,77 50,80 C49,84 46,87 43,89 C41,90 42,93 45,93 C50,93 56,88 57,82 C58,77 56,72 54,68 C58,66 62,62 64,57 C67,50 67,41 63,35 C61,32 57,30 53,29 C56,27 58,24 58,21 C58,16 54,12 50,12 Z"/></svg>', allowedTypes: [] },
  { id: "logo_om", name: "Sacred Om (ॐ)", category: "Auspicious", svgCode: '<svg viewBox="0 0 100 100" fill="#f59e0b"><circle cx="50" cy="50" r="40"/></svg>', allowedTypes: [] },
  { id: "logo_swastik", name: "Auspicious Swastik (卐)", category: "Auspicious", svgCode: '<svg viewBox="0 0 100 100" fill="#f59e0b"><rect width="80" height="80" x="10" y="10" rx="6"/></svg>', allowedTypes: [] },
  { id: "logo_tree", name: "Tree of Life", category: "Nature", svgCode: '<svg viewBox="0 0 100 100" fill="#f59e0b"><path d="M50,92 C47,84 45,74 46,65 C41,63 35,66 30,68 C27,62 31,56 37,56 C39,52 42,50 45,51 C42,44 36,43 30,46 C28,40 33,35 39,37 C39,32 42,28 47,28 Z"/></svg>', allowedTypes: [] }
]);

export const getDesigns = async () => genericGet("designs", [
  { id: "design_floral_corner", name: "Floral Corner Vine", type: "corner", svgCode: '<svg viewBox="0 0 100 100" fill="#f59e0b"><path d="M10,10 L50,10 C30,30 30,50 10,50 Z"/></svg>', allowedTypes: [] },
  { id: "design_divider_line", name: "Royal Crest Divider", type: "divider", svgCode: '<svg viewBox="0 0 200 20" fill="#f59e0b"><rect width="200" height="4" y="8" rx="2"/></svg>', allowedTypes: [] }
]);

export const getShapes = async () => genericGet("shapes", [
  { id: "shape_rounded_rect", name: "Rounded Rectangle", orientation: "Both", allowedTypes: [] },
  { id: "shape_rect", name: "Clean Sharp Rectangle", orientation: "Both", allowedTypes: [] },
  { id: "shape_arch", name: "Arch Dome Top", orientation: "Vertical", allowedTypes: [] },
  { id: "shape_oval", name: "Traditional Oval", orientation: "Horizontal", allowedTypes: [] }
]);

export const getPlateColors = async () => genericGet("plate_colors", [
  { id: "color_teak", name: "Natural Teakwood", finish: "Wood Grain", hexCode: "#592909", fillCode: "linear-gradient(135deg, #592909, #743710, #4d2005)", allowedTypes: [] },
  { id: "color_black_acrylic", name: "Glossy Obsidian Black", finish: "Glossy Acrylic", hexCode: "#09090b", fillCode: "linear-gradient(135deg, #1c1917, #09090b, #000000)", allowedTypes: [] },
  { id: "color_brass", name: "Brushed Brass Metal", finish: "Metallic Brass", hexCode: "#c98a2c", fillCode: "linear-gradient(135deg, #c98a2c, #f3c368, #a66810)", allowedTypes: [] },
  { id: "color_slate", name: "Dark Slate Stone", finish: "Natural Stone", hexCode: "#1e242b", fillCode: "linear-gradient(135deg, #1e242b, #334155)", allowedTypes: [] },
  { id: "color_walnut", name: "Rich Espresso Walnut", finish: "Wood Grain", hexCode: "#2d1e17", fillCode: "linear-gradient(135deg, #2d1e17, #1e140f)", allowedTypes: [] }
]);

export const getFontColors = async () => genericGet("font_colors", [
  { id: "fc_gold_3d", name: "3D Raised Golden Acrylic", effectType: "3D Mirror Gold", hexCode: "#f59e0b", fillCode: "linear-gradient(135deg, #fef08a 0%, #facc15 40%, #ca8a04 80%)", allowedTypes: [] },
  { id: "fc_silver_3d", name: "3D Mirror Chrome Silver", effectType: "3D Chrome Silver", hexCode: "#e2e8f0", fillCode: "linear-gradient(135deg, #ffffff, #cbd5e1, #94a3b8)", allowedTypes: [] },
  { id: "fc_laser_inset", name: "Laser Engraved Burnished Inset", effectType: "Laser Engraved Inset", hexCode: "#1c1007", fillCode: "#1c1007", allowedTypes: [] },
  { id: "fc_matte_white", name: "Matte Crisp White", effectType: "Solid Matte", hexCode: "#f8fafc", fillCode: "#f8fafc", allowedTypes: [] }
]);

export const getTemplates = async () => genericGet("templates", [
  {
    id: "tpl_royal_villa",
    name: "The Royal Villa",
    typeName: "Wooden Handcrafted Plate",
    size: "16x8",
    basePrice: 2450,
    badge: "Bestseller",
    description: "Natural Teakwood base with 3D raised gold letters and Ganesha emblem",
    thumbnailUrl: ""
  },
  {
    id: "tpl_night_glow",
    name: "Imperial Night Glow",
    typeName: "Shadow LED Halo Plate",
    size: "16x8",
    basePrice: 2850,
    badge: "Trending",
    description: "Glossy Obsidian Acrylic with warm halo backlight and Tree of Life",
    thumbnailUrl: ""
  }
]);

export const getOrders = async () => {
  const localOrders = getLocal("np_admin_orders", []);
  const dbOrders = await genericGet("orders", []);
  // Combine unique orders
  const map = new Map();
  [...localOrders, ...dbOrders].forEach(o => {
    if (o && (o.id || o.orderId)) map.set(o.id || o.orderId, o);
  });
  return Array.from(map.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

// ── Storage Upload with Base64 Fallback ──────────────────────
export async function uploadFile(path, file) {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch(e) {
    // Fallback to local DataURL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
}

export async function deleteFile(url) {
  try { await deleteObject(ref(storage, url)); } catch(e) {}
}
