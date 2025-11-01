import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// ✅ Your Firebase configuration (corrected)
const firebaseConfig = {
  apiKey: "AIzaSyBFITDK4_gch6haF8TQHdt2VL6Wl1j-0ds",
  authDomain: "riseagain-334f7.firebaseapp.com",
  projectId: "riseagain-334f7",
  storageBucket: "riseagain-334f7.appspot.com", // fixed (.appspot.com)
  messagingSenderId: "608024652359",
  appId: "1:608024652359:web:8d3211afd24bd0f2815f62",
  measurementId: "G-FCKHSRLSE5"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


// 🔍 TEST CONNECTION
console.log("✅ Firebase initialized:", app.name);

try {
  // Try a simple Firestore read to confirm connection
  import("https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js").then(async ({ getDocs, collection }) => {
    const test = await getDocs(collection(db, "testCollection"));
    console.log("✅ Firestore reachable — total docs:", test.size);
  }).catch(err => console.error("❌ Firestore import failed:", err));
} catch (error) {
  console.error("❌ Firebase connection test failed:", error);
}

export { app, db, storage, auth };
