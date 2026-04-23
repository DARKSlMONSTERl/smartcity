import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKf5CyppbjsJBKpT_PU-6MT6yTzZRJuFY",
  authDomain: "smart-city-52921.firebaseapp.com",
  projectId: "smart-city-52921",
  storageBucket: "smart-city-52921.firebasestorage.app",
  messagingSenderId: "159917253119",
  appId: "1:159917253119:web:ff1efc64dd734c9a5ac7ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }
