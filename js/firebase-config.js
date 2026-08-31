// ============================================
// FIREBASE - SAMIRA LODI
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ============================================
// CONFIGURACIÓN FIREBASE
// ============================================

const firebaseConfig = {

  apiKey: "AIzaSyC3bkhpXMtU0fflbQcsVFKKTht4Y1Yj0qs",

  authDomain: "samira-lodi.firebaseapp.com",

  projectId: "samira-lodi",

  storageBucket: "samira-lodi.firebasestorage.app",

  messagingSenderId: "1094543607819",

  appId: "1:1094543607819:web:dfb93da0c90a44cb2d5f0e"

};


// ============================================
// INICIALIZAR FIREBASE
// ============================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================
// MANTENER SESIÓN
// ============================================

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {

    console.error(
      "No se pudo establecer la persistencia:",
      error
    );

  });


export {
  app,
  auth,
  db
};