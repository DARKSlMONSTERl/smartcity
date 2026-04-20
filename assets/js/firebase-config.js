import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeJfJZvB-IJoGmj3vJa5aH_lk4TC6XTII",
  authDomain: "smart-city-59d54.firebaseapp.com",
  projectId: "smart-city-59d54",
  storageBucket: "smart-city-59d54.firebasestorage.app",
  messagingSenderId: "826015620064",
  appId: "1:826015620064:web:fac20b770f0a982e3f6985"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }
