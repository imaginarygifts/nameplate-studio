// ============================================================
// auth.js  –  Authentication helpers + guard
// ============================================================
import { auth }                        from "./firebase-config.js";
import { db }                          from "./firebase-config.js";
import { doc, getDoc }                 from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Guard: redirect to login if not authenticated & admin ────
export function requireAuth(onReady) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = "/admin/index.html"; return; }
    // Verify admin record exists in Firestore
    const snap = await getDoc(doc(db, "admins", user.uid));
    if (!snap.exists()) { await signOut(auth); window.location.href = "/admin/index.html"; return; }
    onReady(user, snap.data());
  });
}

// ── Sign In ──────────────────────────────────────────────────
export async function adminSignIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // Verify admin record
  const snap = await getDoc(doc(db, "admins", cred.user.uid));
  if (!snap.exists()) {
    await signOut(auth);
    throw new Error("Unauthorized: No admin record found.");
  }
  return cred.user;
}

// ── Create Admin (called from setup or settings) ─────────────
export async function createAdminUser(email, password, name, role = "admin") {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  return cred.user;
}

// ── Sign Out ─────────────────────────────────────────────────
export async function adminSignOut() {
  await signOut(auth);
  window.location.href = "/admin/index.html";
}

// ── Password Reset ───────────────────────────────────────────
export async function resetAdminPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Current User ─────────────────────────────────────────────
export function getCurrentUser() { return auth.currentUser; }

export { onAuthStateChanged, auth };
