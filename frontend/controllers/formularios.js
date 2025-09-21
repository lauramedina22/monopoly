import { Jugador } from "../models/Jugador.js";

document.addEventListener("DOMContentLoaded", function () {
  window.jugadores = []; // Array global para almacenar los jugadores
  // Seleccionamos todos los botones
  const botones = document.querySelectorAll(".btn-opcion");
  const contenedor2 = document.getElementById("selector");

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      // Obtenemos el texto del botón y lo convertimos a número
      const cantidadJugadores = parseInt(boton.textContent.trim(), 10);

      console.log("Cantidad de jugadores:", cantidadJugadores);
      contenedor2.classList.add("d-none");

      // Generamos los formularios
      generarFormularios(cantidadJugadores);
    });
  });
});

function cargarPaises(select) {
  fetch("http://127.0.0.1:5000/countries")
    .then(response => response.json())
    .then(data => {
      select.innerHTML = `<option selected disabled>Selecciona tu país</option>`;

      data.forEach(paisObj => {
        const code = Object.keys(paisObj)[0];  // ej: "co"
        const name = paisObj[code];            // ej: "Colombia"   entender el por qué

        const option = document.createElement("option");
        option.value = code.toUpperCase(); // guardamos el code en mayúsculas
        option.textContent = name;
        select.appendChild(option);
      });

      // Listener para mostrar bandera
      select.addEventListener("change", function () {
        const code = select.value; // ej: "CO"
        const name = select.options[select.selectedIndex].textContent;

        const banderaDiv = document.getElementById("bandera-pais");
        banderaDiv.innerHTML = `
          <img src="https://flagsapi.com/${code}/shiny/64.png" 
               alt="Bandera de ${name}" 
               class="me-2">
          <span>${code}</span>
        `;
      });
    })
    .catch(error => console.error("Error cargando países:", error));
}

// Función para generar formularios dinámicamente
function generarFormularios(cantidad, jugadorActual = 1) {
  const contenedor = document.getElementById("contenedorForm");
  // Si ya completamos todos los jugadores
  if (jugadorActual > cantidad) {
  contenedor.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="p-4 border rounded bg-white bg-opacity-75 shadow w-75 w-md-50 text-center">
        <h3 class="mb-3">¡Todos los jugadores registrados!</h3>
        <button id="btnIniciarPartida" type="button" class="btn btn-success rounded-pill fw-bold">
          Iniciar partida
        </button>
      </div>
    </div>
  `;

  // 🔹 Selecciona el botón recién creado
  const btnIniciar = document.getElementById("btnIniciarPartida");

  // 🔹 Ahora sí puedes asignar el evento
  btnIniciar.addEventListener("click", () => {
    window.open("tableroV2.html", "_blank"); 
    // o si quieres en la misma pestaña:
    // window.location.href = "tablero.html";
  });

  return;
}

  // Generamos el formulario solo para el jugador actual
  contenedor.innerHTML = `
    <div class="d-flex justify-content-center">
      <form class="p-4 border rounded bg-white bg-opacity-75 shadow w-75 w-md-50">
      <div id="mensaje-form"></div>
      <h4 class="text-center mb-3">Jugador ${jugadorActual}</h4>

       <div class="mb-3">
         <label class="form-label">Usuario:</label>
         <input type="text" class="form-control" placeholder="Ej: srMonopoly2025">
       </div>

    <div class="mb-3">
      <label class="form-label">País:</label>
      <select id="pais"class="form-select">
        <option selected disabled>Selecciona tu país</option>
      </select>
      <div id="bandera-pais" class="mt-2 fw-bold d-flex align-items-center"></div>
    </div>

    <div class="mb-3">
      <label class="form-label">Color de tu ficha:</label>
      <select id="color-ficha" class="form-select" required>
          <option value="" selected disabled>Selecciona un color</option>
          <option value="Amarillo">Amarillo</option>
          <option value="Azul">Azul</option>
          <option value="Rojo">Rojo</option>
          <option value="Verde">Verde</option>
      </select>

    </div>

    <div class="mb-3">
      <label class="form-label">Dinero inicial:</label>
      <p class="fw-bold mb-0">$1500</p>
    </div>

    <div class="d-grid mt-4">
      <button type="submit" class="btn btn-primary rounded-pill fw-bold">
        Continuar
      </button>
    </div>
  </form>
</div>`;

  const selectPaises = contenedor.querySelector("#pais");
  cargarPaises(selectPaises);

  // Evento del botón continuar
  const boton = contenedor.querySelector("button");
  boton.addEventListener("click", function (event) {
    event.preventDefault();

    // 1. Obtener datos del formulario
    const nombre = contenedor.querySelector("input").value.trim();
    if (!nombre) {
      mostrarMensaje("Por favor ingresa un nombre de usuario.", "warning");
      return;
    }
    const selectPais = contenedor.querySelector("#pais");
    if (!selectPais.value) {
      mostrarMensaje("Por favor selecciona un país.", "warning");
      return;
    }
    const paisCodigo = selectPais.value; // ej: "HN"
    const paisNombre = selectPais.options[selectPais.selectedIndex].textContent; // ej: "Honduras"
    const colorSelect = contenedor.querySelector("#color-ficha");
    const colorFicha = colorSelect ? colorSelect.value.trim() : "";

    // validaciones
    if (!colorFicha) {
      mostrarMensaje("Por favor selecciona un color para tu ficha.", "warning");
      return;
    }

    // Falta validar que el color no esté repetido
    const colorOcupado = jugadores.some(j => j.colorFicha === colorFicha);
    if (colorOcupado) {
      mostrarMensaje("Ese color ya está ocupado, elige otro.", "danger");
      return;
    }

    // 2. Crear jugador
    const nuevoJugador = new Jugador(nombre, paisNombre, paisCodigo, colorFicha, 1500);

    // 3. Guardarlo en la lista
    guardarJugadores(nuevoJugador);

    mostrarMensaje(`Jugador ${nombre} registrado con éxito.`, "success");
    console.log("Jugador creado:", nuevoJugador);

    // Espera 1 segundo antes de mostrar el siguiente formulario
    setTimeout(() => {
      generarFormularios(cantidad, jugadorActual + 1);
    }, 1000);

  });
}

function mostrarMensaje(texto, tipo = "info") {
  // tipo puede ser: primary, success, danger, warning, info
  let contenedor = document.getElementById("mensaje-form");
  contenedor.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

function guardarJugadores(nuevosJugadores) {

  window.jugadores.push(nuevosJugadores); // Guardamos en el array global
  // 1. Leer lo que ya hay en localStorage
  let jugadoresGuardados = JSON.parse(localStorage.getItem("jugadores")) || [];

  // 2. Unir lo que había + lo nuevo
  jugadoresGuardados = jugadoresGuardados.concat(nuevosJugadores);

  // 3. Guardar la nueva lista completa
  localStorage.setItem("jugadores", JSON.stringify(jugadoresGuardados));
  console.log("Jugadores en localStorage:", jugadoresGuardados);
}



