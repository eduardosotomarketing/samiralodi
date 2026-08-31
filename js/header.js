// ==========================================
// HEADER - SAMIRA LODI
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  const header = document.getElementById("header");

  if (!header) return;

  header.innerHTML = `

    <header>

      <div class="container nav-container">

        <a href="index.html" class="logo">
          SAMIRA LODI
        </a>

        <nav id="nav-menu">

          <a href="index.html">
            Inicio
          </a>

          <a href="sobre.html">
            Marca
          </a>

          <a href="coleccion.html">
            Colección
          </a>

          <a href="contacto.html">
            Contacto
          </a>

          <div class="header-account">

            <!-- USUARIO NO LOGUEADO -->

            <a
              href="login.html"
              class="header-login guest-only"
            >
              Iniciar sesión
            </a>


            <!-- USUARIO LOGUEADO -->

            <div
              class="header-user user-only"
              style="display:none"
            >

              <a href="cuenta.html">

                Hola,
                <span class="user-name">
                  Usuario
                </span>

              </a>

              <button
                type="button"
                class="logout-btn"
              >
                Salir
              </button>

            </div>

          </div>

        </nav>


        <div
          class="menu-toggle"
          id="menu-toggle"
        >
          ☰
        </div>

      </div>

    </header>

  `;


  // ==========================================
  // MENU MOBILE
  // ==========================================

  const menuToggle =
    document.getElementById("menu-toggle");

  const navMenu =
    document.getElementById("nav-menu");


  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

      navMenu.classList.toggle("active");

    });

  }


  // ==========================================
  // AVISAR A FIREBASE QUE EL HEADER EXISTE
  // ==========================================

  document.dispatchEvent(
    new CustomEvent("samiraHeaderReady")
  );

});