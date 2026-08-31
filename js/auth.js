// ============================================
// AUTH.JS - SAMIRA LODI
// ============================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  auth,
  db
} from "./firebase-config.js";


// ============================================
// ESTADO DEL HEADER
// ============================================

let currentUser = null;


// ============================================
// ACTUALIZAR INTERFAZ
// ============================================

function updateUserInterface(user) {

  currentUser = user;

  const guestElements =
    document.querySelectorAll(".guest-only");

  const userElements =
    document.querySelectorAll(".user-only");

  if (user) {

    // -----------------------------
    // USUARIO LOGUEADO
    // -----------------------------

    guestElements.forEach(element => {

      element.style.display = "none";

    });


    userElements.forEach(element => {

      element.style.display = "";

    });


    const name =
      user.displayName ||
      user.email?.split("@")[0] ||
      "Usuario";


    document
      .querySelectorAll(".user-name")
      .forEach(element => {

        element.textContent = name;

      });


  } else {

    // -----------------------------
    // USUARIO NO LOGUEADO
    // -----------------------------

    guestElements.forEach(element => {

      element.style.display = "";

    });


    userElements.forEach(element => {

      element.style.display = "none";

    });

  }

}


// ============================================
// FIREBASE - ESTADO DE AUTENTICACIÓN
// ============================================

onAuthStateChanged(auth, (user) => {

  currentUser = user;

  updateUserInterface(user);

});


// ============================================
// CUANDO EL HEADER YA ESTÁ CREADO
// ============================================

document.addEventListener(
  "samiraHeaderReady",
  () => {

    updateUserInterface(currentUser);

    bindLogoutButtons();

  }
);


// ============================================
// LOGOUT
// ============================================

function bindLogoutButtons() {

  const logoutButtons =
    document.querySelectorAll(".logout-btn");


  logoutButtons.forEach(button => {

    // Evitar eventos duplicados

    if (button.dataset.logoutReady === "true") {
      return;
    }


    button.dataset.logoutReady = "true";


    button.addEventListener(
      "click",
      async () => {

        try {

          button.disabled = true;

          button.textContent =
            "Saliendo...";


          await signOut(auth);


          window.location.href =
            "index.html";


        } catch (error) {

          console.error(
            "Error al cerrar sesión:",
            error
          );


          button.disabled = false;

          button.textContent =
            "Salir";

        }

      }
    );

  });

}


// ============================================
// REGISTRO
// ============================================

const registerForm =
  document.getElementById("register-form");


if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const nombre =
        document
          .getElementById("register-nombre")
          .value
          .trim();


      const apellido =
        document
          .getElementById("register-apellido")
          .value
          .trim();


      const email =
        document
          .getElementById("register-email")
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById("register-password")
          .value;


      const passwordConfirm =
        document
          .getElementById("register-password-confirm")
          .value;


      const message =
        document
          .getElementById("register-message");


      message.textContent = "";


      // -----------------------------
      // VALIDACIONES
      // -----------------------------

      if (password.length < 6) {

        message.textContent =
          "La contraseña debe tener al menos 6 caracteres.";

        return;

      }


      if (password !== passwordConfirm) {

        message.textContent =
          "Las contraseñas no coinciden.";

        return;

      }


      try {

        message.textContent =
          "Creando tu cuenta...";


        // -----------------------------
        // CREAR CUENTA
        // -----------------------------

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        const user =
          userCredential.user;


        // -----------------------------
        // NOMBRE EN AUTH
        // -----------------------------

        await updateProfile(user, {

          displayName:
            `${nombre} ${apellido}`

        });


        // -----------------------------
        // FIRESTORE
        // -----------------------------

        await setDoc(
          doc(db, "usuarios", user.uid),
          {

            uid: user.uid,

            nombre: nombre,

            apellido: apellido,

            nombreCompleto:
              `${nombre} ${apellido}`,

            email: email,

            suscriptoNovedades: true,

            fechaRegistro:
              serverTimestamp()

          }
        );


        message.textContent =
          "Cuenta creada correctamente.";


        // -----------------------------
        // IR AL INICIO
        // -----------------------------

        setTimeout(() => {

          window.location.href =
            "index.html";

        }, 1000);


      } catch (error) {

        console.error(error);

        message.textContent =
          getFirebaseErrorMessage(error);

      }

    }
  );

}


// ============================================
// NEWSLETTER
// ============================================

const newsletterForm =
  document.getElementById("newsletter-form");


if (newsletterForm) {

  newsletterForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const input =
        newsletterForm.querySelector(
          "input[type='email']"
        );


      if (!input) return;


      const email =
        input.value
          .trim()
          .toLowerCase();


      if (!email) return;


      const button =
        newsletterForm.querySelector(
          "button"
        );


      if (!button) return;


      const originalText =
        button.textContent;


      button.disabled = true;

      button.textContent =
        "Enviando...";


      try {

        await setDoc(
          doc(
            db,
            "suscriptores",
            email
          ),
          {

            email: email,

            activo: true,

            fechaSuscripcion:
              serverTimestamp()

          },
          {
            merge: true
          }
        );


        input.value = "";


        button.textContent =
          "Suscripto ✓";


      } catch (error) {

        console.error(
          "Error newsletter:",
          error
        );


        button.textContent =
          "Intentar nuevamente";

      }


      setTimeout(() => {

        button.disabled = false;

        button.textContent =
          originalText;

      }, 3000);

    }
  );

}


// ============================================
// LOGIN
// ============================================

const loginForm =
  document.getElementById("login-form");


if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const email =
        document
          .getElementById("login-email")
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById("login-password")
          .value;


      const message =
        document
          .getElementById("login-message");


      message.textContent =
        "Ingresando...";


      try {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );


        message.textContent =
          "Bienvenida nuevamente.";


        setTimeout(() => {

          window.location.href =
            "index.html";

        }, 700);


      } catch (error) {

        console.error(error);

        message.textContent =
          getFirebaseErrorMessage(error);

      }

    }
  );

}


// ============================================
// RECUPERAR CONTRASEÑA
// ============================================

const resetForm =
  document.getElementById("reset-form");


if (resetForm) {

  resetForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const email =
        document
          .getElementById("reset-email")
          .value
          .trim()
          .toLowerCase();


      const message =
        document
          .getElementById("reset-message");


      message.textContent =
        "Enviando instrucciones...";


      try {

        await sendPasswordResetEmail(
          auth,
          email
        );


        message.textContent =
          "Te enviamos un correo para restablecer tu contraseña.";


      } catch (error) {

        console.error(error);

        message.textContent =
          getFirebaseErrorMessage(error);

      }

    }
  );

}


// ============================================
// ERRORES FIREBASE
// ============================================

function getFirebaseErrorMessage(error) {

  switch (error.code) {

    case "auth/email-already-in-use":

      return "Este email ya está registrado.";


    case "auth/invalid-email":

      return "El email ingresado no es válido.";


    case "auth/weak-password":

      return "La contraseña debe tener al menos 6 caracteres.";


    case "auth/invalid-credential":

      return "El email o la contraseña no son correctos.";


    case "auth/user-not-found":

      return "No encontramos una cuenta con ese email.";


    case "auth/wrong-password":

      return "La contraseña no es correcta.";


    case "auth/too-many-requests":

      return "Demasiados intentos. Esperá unos minutos.";


    default:

      return "Ocurrió un error. Intentá nuevamente.";

  }

}