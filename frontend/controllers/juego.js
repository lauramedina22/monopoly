import { Partida } from "../models/Partida.js";
import { Jugador } from "../models/Jugador.js";
import { Casilla } from "../models/Casilla.js";
import { Propiedad } from "../models/Propiedad.js";
import { Dado } from "../models/Dado.js";

const colors = {
  rojo: "#ff4d4d",
  azul: "#4d79ff",
  verde: "#004030",
  amarillo: "#ffff4d",
};

document.addEventListener("DOMContentLoaded", () => {
  let btnCargar = document.getElementById("generarTablero");
  let tablero = document.getElementById("tablero");
  let fichas = {}; // Almacena los elementos ficha por jugador
  // 1. Recuperar jugadores desde localStorage
  let jugadoresGuardados = JSON.parse(localStorage.getItem("jugadores")) || [];

  // Convertirlos de nuevo en objetos Jugador
  const jugadores = jugadoresGuardados.map(
    (j) =>
      new Jugador(j.nombre, j.paisNombre, j.paisCodigo, j.colorFicha, j.dinero)
  );

  // 2. Crear la partida con los jugadores
  const partida = new Partida(jugadores);
  jugadores.forEach((jugador, idx) => {
    const ficha = document.createElement("div");
    ficha.className = "ficha-jugador";
    ficha.id = `ficha-jugador-${idx}`;
    ficha.style.backgroundColor =
      colors[jugador.colorFicha.trim().toLowerCase()] || "#000";
    ficha.style.width = "24px";
    ficha.style.height = "24px";
    ficha.style.borderRadius = "50%";
    ficha.style.border = "2px solid #222";
    ficha.style.margin = "2px";
    ficha.title = jugador.nombre;
    fichas[jugador.nombre] = ficha;
  });
  // 3. (opcional) Mostrar el estado inicial de cada jugador
  jugadores.forEach((jugador) => {
    console.log(`Estado inicial de ${jugador.nombre}:`);
    console.log(`  País: ${jugador.paisNombre}`);
    console.log(`  Color de ficha: ${jugador.colorFicha}`);
    console.log(`  Dinero: $${jugador.dinero}`);
    console.log(
      `  Propiedades: ${
        jugador.propiedades.map((p) => p.nombre).join(", ") || "Ninguna"
      }`
    );
    console.log(
      `  Hipotecas: ${
        jugador.hipotecas.map((p) => p.nombre).join(", ") || "Ninguna"
      }`
    );
    console.log(`  Préstamos: ${jugador.prestamos.length}`);
    console.log(`  Puntaje: ${jugador.puntaje}`);
  });

  btnCargar.addEventListener("click", cargarTablero);

  function cargarTablero() {
    fetch("http://127.0.0.1:5000/board") // 1. Llamo al backend para obtener las casillas
      .then((response) => response.json())
      .then((casillas) => {
        // Agrego una clase al tablero para marcar que ya se generó
        tablero.classList.add("tablero-generado");
        // Las fichas se mostrarán al posicionarlas en las casillas

        //  Ajuste de las esquinas para que encajen correctamente
        let primeraCasillaIzquierda = casillas.left.pop();
        casillas.top.unshift(primeraCasillaIzquierda);

        let ultimaCasillaIzquierda = casillas.left.shift();
        casillas.bottom.push(ultimaCasillaIzquierda);

        // Referencias a los 4 lados del tablero
        const top = document.getElementById("top");
        const left = document.getElementById("left");
        const right = document.getElementById("right");
        const bottom = document.getElementById("bottom");

        const casillasObjetos = {
          top: [],
          left: [],
          right: [],
          bottom: [],
        };

        // Procesar cada lado del backend
        for (let lado of ["top", "left", "right", "bottom"]) {
          for (let casillaData of casillas[lado]) {
            // Crear el objeto Casilla o Propiedad según el tipo
            let casillaObjeto;
            if (casillaData.type === "property") {
              casillaObjeto = new Propiedad(casillaData);
            } else {
              casillaObjeto = new Casilla(casillaData);
            }

            // Guardar en la partida
            partida.casillas[casillaData.id] = casillaObjeto;

            // Agregar al lado correspondiente
            casillasObjetos[lado].push(casillaObjeto);
          }
        }

        /**
         * Función interna `render`
         * Recibe un booleano (isMobile) que indica si estamos en móvil o en escritorio.
         * Dependiendo de eso dibuja el tablero de distinta forma.
         */
        function render(isMobile) {
          // Primero limpiamos todos los lados antes de volver a dibujar
          top.innerHTML = "";
          left.innerHTML = "";
          right.innerHTML = "";
          bottom.innerHTML = "";

          if (isMobile) {
            /**
             * Vista móvil:
             * En pantallas pequeñas no usamos 4 lados,
             * sino que "aplanamos" el tablero en un solo recorrido lineal.
             *
             * El orden de recorrido es el orden real de un tablero de Monopoly:
             * bottom → left → top → right
             */
            const recorrido = [
              ...casillas.bottom,
              ...casillas.left,
              ...casillas.top,
              ...casillas.right,
            ];

            // Dibujamos todas las casillas dentro de "top"
            recorrido.forEach((casilla) => {
              const precioHtml = casilla.price
                ? `<p>$${casilla.price}</p>`
                : "";
              top.innerHTML += `
                          <div class="casilla ${casilla.color || ""}" id="${
                casilla.id
              }">
                              ${casilla.name}
                              ${precioHtml}
                          </div>`;
            });
          } else {
            /**
             * Vista PC:
             * Aquí mantenemos la estructura tradicional con 4 lados.
             * Cada lado se dibuja de forma independiente con su propio bucle.
             */

            // Lado inferior (bottom) → va en orden invertido
            for (let casilla of casillas.bottom.slice().reverse()) {
              const precioHtml = casilla.price
                ? `<p>$${casilla.price}</p>`
                : "";
              bottom.innerHTML += `<div class="casilla bottom ${
                casilla.color || ""
              }" id="${casilla.id}">
                            ${casilla.name}
                            ${precioHtml}
                        </div>`;
            }

            // 🔹 Lado izquierdo (left) → también invertido
            for (let casilla of casillas.left.slice().reverse()) {
              const precioHtml = casilla.price
                ? `<p>$${casilla.price}</p>`
                : "";
              left.innerHTML += `<div class="casilla left ${
                casilla.color || ""
              }" id="${casilla.id}">
                            ${casilla.name}
                            ${precioHtml}
                        </div>`;
            }

            // 🔹 Lado superior (top) → orden natural
            for (let casilla of casillas.top) {
              const precioHtml = casilla.price
                ? `<p>$${casilla.price}</p>`
                : "";
              top.innerHTML += `<div class="casilla top ${
                casilla.color || ""
              }" id="${casilla.id}">
                            ${casilla.name}
                            ${precioHtml}
                        </div>`;
            }

            // 🔹 Lado derecho (right) → orden natural
            for (let casilla of casillas.right) {
              const precioHtml = casilla.price
                ? `<p>$${casilla.price}</p>`
                : "";
              right.innerHTML += `<div class="casilla right ${
                casilla.color || ""
              }" id="${casilla.id}">
                            ${casilla.name}
                            ${precioHtml}
                        </div>`;
            }
          }

          jugadores.forEach((jugador, idx) => {
            const ficha = fichas[jugador.nombre];
            const casillaInicial = document.getElementById("0");
            if (casillaInicial && ficha) {
              posicionarFichaEnCasilla(ficha, casillaInicial);
              jugador.posicion = 0;
            }
          });
        }

        /**
         *  Responsividad con `matchMedia`
         * `window.matchMedia("(max-width: 768px)")`
         * → devuelve un objeto que nos dice si el ancho actual de la pantalla
         * es menor o igual a 768px (true en móvil, false en PC).
         */
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        //  Render inicial según el tamaño actual de la pantalla
        render(mediaQuery.matches);

        /**
         * Re-renderizado dinámico:
         * Escuchamos el evento "change" de `matchMedia`.
         * Cada vez que la pantalla cambia de estado (ej: pasamos de PC → móvil en inspeccionar),
         * se vuelve a llamar a `render` con el valor actualizado.
         */
        mediaQuery.addEventListener("change", (e) => {
          render(e.matches); // `e.matches` es true si ahora está en móvil
        });
      });
  }

  const selector = document.getElementById("jugador");
  const infoJugador = document.getElementById("infoJugador");
  selector.innerHTML = `<option selected disabled>Jugadores`;
  jugadores.forEach((j, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `Jugador ${index + 1}`;
    selector.appendChild(option);
  });

  // Evento: cuando cambias el jugador, abre el modal con su info
  selector.addEventListener("change", () => {
    const jugador = jugadores[selector.value];
    if (jugador) {
      infoJugador.innerHTML = `
      <p><strong>Usuario:</strong> ${jugador.nombre}</p>
      <p><strong>País:</strong> <span>${
        jugador.paisCodigo
      }</span> <img src="https://flagsapi.com/${
        jugador.paisCodigo
      }/shiny/64.png" alt="Bandera de ${jugador.paisNombre}" class="me-2"></p>
      <p><strong>Ficha:</strong> ${jugador.colorFicha}</p>
      <p><strong>Dinero:</strong> $${jugador.dinero}</p>
      <p><strong>Puntaje:</strong> ${jugador.puntaje ?? 0}</p>
      <p><strong>Propiedades:</strong> ${
        jugador.propiedades?.join(", ") || "Ninguna"
      }</p>
      <p><strong>Hipotecas:</strong> ${
        jugador.hipotecas?.join(", ") || "Ninguna"
      }</p>
      <p><strong>Préstamos:</strong> ${jugador.prestamos?.length || 0}</p>

    `;

      // Mostrar modal con Bootstrap
      $("#modalJugador").modal("show");
    }
  });

  // Función para posicionar la ficha en una casilla
  function posicionarFichaEnCasilla(ficha, casillaElem) {
    // Busca o crea el contenedor de fichas dentro de la casilla
    let contenedor = casillaElem.querySelector(".ficha-container");
    if (!contenedor) {
      contenedor = document.createElement("div");
      contenedor.className = "ficha-container";
      contenedor.style.display = "flex";
      contenedor.style.flexWrap = "wrap";
      contenedor.style.alignItems = "center";
      contenedor.style.justifyContent = "center";
      contenedor.style.position = "absolute";
      contenedor.style.top = "0";
      contenedor.style.left = "0";
      contenedor.style.width = "100%";
      contenedor.style.height = "100%";
      contenedor.style.pointerEvents = "none";
      casillaElem.style.position = "relative";
      casillaElem.appendChild(contenedor);
    }
    // Elimina la ficha de cualquier contenedor anterior
    if (ficha.parentElement && ficha.parentElement !== contenedor) {
      ficha.parentElement.removeChild(ficha);
    }
    // Añade la ficha al contenedor de la casilla
    if (!contenedor.contains(ficha)) {
      contenedor.appendChild(ficha);
    }
  }

  // Función para mover la ficha del jugador
  function moverFicha(jugador, posiciones) {
    // El tablero tiene 40 casillas (Monopoly clásico)
    const totalCasillas = Object.keys(partida.casillas).length;
    jugador.posicion = (jugador.posicion + posiciones) % totalCasillas;
    const casillaDestino = document.getElementById(jugador.posicion);
    if (casillaDestino) {
      const ficha = fichas[jugador.nombre];
      posicionarFichaEnCasilla(ficha, casillaDestino);
    }
  }

  function mostrarToast(mensaje) {
    // Crear contenedor de toasts si no existe
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.style.position = "fixed";
      toastContainer.style.bottom = "24px";
      toastContainer.style.right = "24px";
      toastContainer.style.zIndex = "9999";
      document.body.appendChild(toastContainer);
    }

    // Crear el toast
    const toastEl = document.createElement("div");
    toastEl.className =
      "toast align-items-center text-white bg-primary border-0 show";
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");
    toastEl.style.minWidth = "220px";
    toastEl.style.marginBottom = "8px";
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${mensaje}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    toastContainer.appendChild(toastEl);

    // Cerrar el toast al hacer click en el botón
    toastEl.querySelector(".btn-close").onclick = () => {
      toastEl.classList.remove("show");
      setTimeout(() => toastEl.remove(), 300);
    };

    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
      toastEl.classList.remove("show");
      setTimeout(() => toastEl.remove(), 300);
    }, 5000);
  }

  // Evento para tirar dados y mover ficha
  document.getElementById("tirarDados").addEventListener("click", () => {
    const idx = selector.value;
    const jugador = jugadores[idx];
    if (!jugador) alert("Por favor selecciona un jugador");

    const dado = Dado.lanzar().sumarDados();
    mostrarToast(
      `${jugador.nombre} ha sacado un ${Dado.dados[0]} y un ${Dado.dados[1]} (Total: ${dado})`
    );
    moverFicha(jugador, dado);
  });
});
