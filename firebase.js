import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9BWKZw6Hs85Kw1uQK2sUDsBJ4Dj6uvBU",
  authDomain: "safesphere-ed26e.firebaseapp.com",
  projectId: "safesphere-ed26e",
  storageBucket: "safesphere-ed26e.firebasestorage.app",
  messagingSenderId: "1093526387847",
  appId: "1:1093526387847:web:5672113f8016000e308c22"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);