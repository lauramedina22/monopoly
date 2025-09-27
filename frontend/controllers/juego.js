import { Partida } from "../models/Partida.js";
import { Jugador } from "../models/Jugador.js";
import { Casilla } from "../models/Casilla.js";
import { Propiedad } from "../models/Propiedad.js";
import { mostrarToast } from "../controllers/toast.js";
import { Impuesto } from "../models/Impuesto.js";
import { Ferrocarril } from "../models/Ferrocarril.js";
import { CofreComunidad } from "../models/CofreComunidad.js";
import { Sorpresa } from "../models/Sorpresa.js";

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
      `  Propiedades: ${jugador.propiedades.map((p) => p.nombre).join(", ") || "Ninguna"
      }`
    );
    console.log(
      `  Hipotecas: ${jugador.hipotecas.map((p) => p.nombre).join(", ") || "Ninguna"
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
        btnCargar.style.display = "none";

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
            } else if (casillaData.type === "tax") {
              casillaObjeto = new Impuesto(casillaData);
            } else if (casillaData.type === "railroad") {
              casillaObjeto = new Ferrocarril(casillaData);
            } else {
              casillaObjeto = new Casilla(casillaData);
            }

            // Guardar en la partida
            partida.casillas[casillaData.id] = casillaObjeto;

            // Agregar al lado correspondiente
            casillasObjetos[lado].push(casillaObjeto);
          }
        }

        console.log("Casillas objetos creadas:", casillasObjetos);

        // Crear mazo de cartas de Caja de Comunidad
        partida.communityChestDeck = [];
        for (let cartaData of casillas.community_chest) {
          const carta = new CofreComunidad(cartaData);
          partida.communityChestDeck.push(carta);
        }

        console.log(
          "Cartas de Caja de Comunidad creadas:",
          partida.communityChestDeck
        );

        // Crear mazo de cartas de Sorpresa
        partida.chancesDeck = [];
        for (let cartaData of casillas.chance) {
          const carta = new Sorpresa(cartaData);
          partida.chancesDeck.push(carta);
        }

        console.log("Cartas de Sorpresa creadas:", partida.chancesDeck);

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
                          <div class="casilla ${casilla.color || ""}" id="${casilla.id
                }">
                              ${casilla.name}
                              ${precioHtml}
                          </div>`;
            });
          } else {
            // Vista PC: usar los objetos Casilla

            // Lado inferior (bottom) → orden invertido
            for (let casillaObjeto of casillasObjetos.bottom
              .slice()
              .reverse()) {
              const precioHtml = casillaObjeto.price
                ? `<p>$${casillaObjeto.price}</p>`
                : "";
              bottom.innerHTML += `<div class="casilla bottom ${casillaObjeto.color || ""
                }" id="${casillaObjeto.id}">
                ${casillaObjeto.name}
                ${precioHtml}
            </div>`;
            }

            // Lado izquierdo (left) → orden invertido
            for (let casillaObjeto of casillasObjetos.left.slice().reverse()) {
              const precioHtml = casillaObjeto.price
                ? `<p>$${casillaObjeto.price}</p>`
                : "";
              left.innerHTML += `<div class="casilla left ${casillaObjeto.color || ""
                }" id="${casillaObjeto.id}">
                ${casillaObjeto.name}
                ${precioHtml}
            </div>`;
            }

            // Lado superior (top) → orden natural
            for (let casillaObjeto of casillasObjetos.top) {
              const precioHtml = casillaObjeto.price
                ? `<p>$${casillaObjeto.price}</p>`
                : "";
              top.innerHTML += `<div class="casilla top ${casillaObjeto.color || ""
                }" id="${casillaObjeto.id}">
                ${casillaObjeto.name}
                ${precioHtml}
            </div>`;
            }

            // Lado derecho (right) → orden natural
            for (let casillaObjeto of casillasObjetos.right) {
              const precioHtml = casillaObjeto.price
                ? `<p>$${casillaObjeto.price}</p>`
                : "";
              right.innerHTML += `<div class="casilla right ${casillaObjeto.color || ""
                }" id="${casillaObjeto.id}">
                ${casillaObjeto.name}
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
      <p><strong>País:</strong> <span>${jugador.paisCodigo
        }</span> <img src="https://flagsapi.com/${jugador.paisCodigo
        }/shiny/64.png" alt="Bandera de ${jugador.paisNombre}" class="me-2"></p>
      <p><strong>Ficha:</strong> ${jugador.colorFicha}</p>
      <p><strong>Dinero:</strong> $${jugador.dinero}</p>
      <p><strong>Puntaje:</strong> ${jugador.puntaje ?? 0}</p>
      <p><strong>Propiedades:</strong> ${jugador.propiedades?.join(", ") || "Ninguna"
        }</p>
      <p><strong>Hipotecas:</strong> ${jugador.hipotecas?.join(", ") || "Ninguna"
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

  // Evento para pruebas rápidas con input de casilla
  document.getElementById("btnTestDados").addEventListener("click", () => {
    const idx = selector.value; // jugador seleccionado
    const jugador = jugadores[idx];
    if (!jugador) {
      mostrarToast("Por favor selecciona un jugador");
      return;
    }

    const idCasilla = parseInt(document.getElementById("inputDados").value);
    if (isNaN(idCasilla) || !(idCasilla in partida.casillas)) {
      mostrarToast("Ingresa un ID de casilla válido");
      return;
    }

    // Actualizar posición del jugador
    jugador.posicion = idCasilla;

    // Mover ficha en el DOM
    const casillaElem = document.getElementById(idCasilla);
    posicionarFichaEnCasilla(fichas[jugador.nombre], casillaElem);

    // Obtener casilla lógica
    const casilla = partida.casillas[idCasilla];
    console.log("Prueba rápida: jugadorCaeEnCasilla...", idCasilla, casilla);

    // Ejecutar lógica de la casilla
    partida.jugadorCaeEnCasilla(jugador, casilla);

    // Si es propiedad, mostrar modal
    if (casilla instanceof Propiedad) {
      mostrarModalCasilla(casilla, jugador);
    }
  });


  // Evento para tirar dados y mover ficha
  document.getElementById("tirarDados").addEventListener("click", () => {
    const idx = selector.value;
    const jugador = jugadores[idx];
    if (!jugador) {
      mostrarToast("Por favor selecciona un jugador");
      return;
    }

    // 1. Posición lógica
    const posDestino = partida.tirarDados(jugador);

    // 2. Elemento gráfico de la casilla
    const casillaElem = document.getElementById(posDestino);

    // 3. Mover ficha en el DOM
    posicionarFichaEnCasilla(fichas[jugador.nombre], casillaElem);

    // 4. Obtener casilla lógica
    const casilla = partida.casillas[posDestino];
    console.log("DEBUG casilla destino:", posDestino, casilla);

    // 5. Ejecutar lógica de la casilla
    if (casilla) {
    
      partida.jugadorCaeEnCasilla(jugador, casilla);
      if (casilla instanceof Propiedad) {
      mostrarModalCasilla(casilla, jugador);
    }
    
    } else {
      console.warn("No existe casilla en partida.casillas para la posición:", posDestino);
    }

  });


  document.getElementById("comprarPropiedad").addEventListener("click", () => {
    const idx = selector.value;
    const jugador = jugadores[idx];
    if (!jugador) {
      mostrarToast("Por favor selecciona un jugador");
      return;
    }
    const posicion = jugador.posicion;
    const propiedad = partida.casillas[posicion];
    console.log(propiedad);
  });

  document.getElementById("dhipotecar").addEventListener("click", () => {
    const idx = selector.value;
    const jugador = jugadores[idx];
    if (!jugador) {
      mostrarToast("Por favor selecciona un jugador");
      return;
    }
    const posicion = jugador.posicion;
    const propiedad = partida.casillas[posicion];

    if (!(propiedad instanceof Propiedad)) {
      mostrarToast("El jugador no está en una propiedad.");
      return;
    }

    if (!jugador.propiedades.includes(propiedad)) {
      mostrarToast("El jugador no es dueño de esta propiedad.");
      return;
    }

    const action = propiedad.dueno === jugador ? "hipotecar" : "deshipotecar";
    if (action === "hipotecar") {
      propiedad.hipotecar(jugador);
    } else {
      propiedad.deshipotecar(jugador);
    }
  });

  document.getElementById("pagarRenta").addEventListener("click", () => {
    const idx = selector.value;
    const jugador = jugadores[idx];
    if (!jugador) {
      mostrarToast("Por favor selecciona un jugador");
      return;
    }

    const posicion = jugador.posicion;
    const propiedad = partida.casillas[posicion];
    if (propiedad instanceof Propiedad) {
      propiedad.PagarRenta(jugador);
    } else {
      mostrarToast("El jugador no está en una propiedad.");
    }
  });

  let resultado = partida.jugadorCaeEnCasilla(jugador, casilla);
  mostrarInfoCasilla(casilla, jugador, resultado);



});
