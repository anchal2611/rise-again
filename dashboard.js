// dashboard.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// DOM Elements
const bodyEl = document.body;
const userNameEl = document.getElementById("userName");
const affirmationText = document.getElementById("affirmationText");
const themeToggleDesktop = document.getElementById("themeToggle");
const themeToggleMobile = document.getElementById("themeToggleMobile");
const themeText = document.getElementById("themeText");

// --- Theme Toggle Logic ---
function toggleTheme() {
    // Toggle the 'dark' class on the body
    bodyEl.classList.toggle("dark");
    
    // Update the visual representation and store preference
    const isDark = bodyEl.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    
    // Update button text/icon for desktop
    const icon = isDark ? "light_mode" : "dark_mode";
    themeToggleDesktop.querySelector('.material-symbols-outlined').textContent = icon;
    themeToggleMobile.querySelector('.material-symbols-outlined').textContent = icon;
    themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
}

// Set initial theme based on localStorage or default to 'light'
const initialTheme = localStorage.getItem("theme") || "light";
bodyEl.classList.remove("light", "dark"); // Remove existing to apply new
bodyEl.classList.add(initialTheme);
toggleTheme(); // Run once to update the icon/text based on stored theme

// Attach event listeners
themeToggleDesktop.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);


// --- Daily Affirmations (15 total) ---
const affirmations = [
  "I am worthy of peace and healing.",
  "I choose progress over perfection.",
  "My story matters, and I matter.",
  "I am reclaiming my strength with each breath.",
  "I am safe, I am seen, I am strong.",
  "I am learning to love myself again.",
  "My past does not define my worth.",
  "Every small step is a victory.",
  "I release what no longer serves me.",
  "I am resilient, and I will rise again.",
  "Healing is not linear, and that’s okay.",
  "I allow myself to rest and to grow.",
  "I am surrounded by care and compassion.",
  "My voice deserves to be heard.",
  "I am becoming whole, one day at a time.",
];

// --- Rotate Affirmation Every 24 Hours ---
function getDailyAffirmation() {
  const lastDate = localStorage.getItem("affirmationDate");
  let index = localStorage.getItem("affirmationIndex");

  const today = new Date().toDateString();
  let newIndex = index ? parseInt(index) : 0;

  if (lastDate !== today) {
    // Generate a new random index
    newIndex = Math.floor(Math.random() * affirmations.length);
    localStorage.setItem("affirmationDate", today);
    localStorage.setItem("affirmationIndex", newIndex);
  }

  return affirmations[newIndex];
}

// Display affirmation immediately
affirmationText.textContent = `“${getDailyAffirmation()}”`;

// --- Fetch User Name and Handle Auth State ---
async function fetchAndDisplayUserName(user) {
    if (user) {
        try {
            // Display a loading indicator while fetching
            userNameEl.textContent = "Loading...";

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            let name = "Friend"; // Default name
            if (docSnap.exists()) {
                name = docSnap.data().name || "Friend";
            }

            // Capitalize the first letter of the name for a nicer greeting
            userNameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);

        } catch (err) {
            console.error("Error fetching user name:", err);
            userNameEl.textContent = "Friend"; // Fallback on error
        }
    } else {
        // User is logged out, redirect to login page
        window.location.href = "/login.html";
    }
}

onAuthStateChanged(auth, fetchAndDisplayUserName);