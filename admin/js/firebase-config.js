// ============================================================
// firebase-config.js
// IMPORTANT: Replace these values with your Firebase project config.
// Go to: console.firebase.google.com → Your Project → Project Settings → Web App
// ============================================================

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ── Initialize Firebase ──────────────────────────────────────
import { initializeApp }        from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }              from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }         from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage }           from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const app     = initializeApp(FIREBASE_CONFIG);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
