import { Partida } from "../models/Partida.js";
import { Jugador } from "../models/Jugador.js";

document.addEventListener("DOMContentLoaded", () => {
    let btnCargar = document.getElementById("generarTablero");
    let tablero = document.getElementById("tablero");
    // 1. Recuperar jugadores desde localStorage
    let jugadoresGuardados = JSON.parse(localStorage.getItem("jugadores")) || [];

    // Convertirlos de nuevo en objetos Jugador (si tu clase tiene métodos)
    const jugadores = jugadoresGuardados.map(j =>
        new Jugador(j.nombre, j.paisNombre, j.paisCodigo, j.colorFicha, j.dinero)
    );

    console.log("Jugadores cargados:", jugadores);

    // 2. Crear la partida con los jugadores
    const partida = new Partida(jugadores);

    console.log("Partida creada:", partida);
    // 3. (opcional) Mostrar el estado inicial de cada jugador
    jugadores.forEach(jugador => {
        console.log(`Estado inicial de ${jugador.nombre}:`);
        console.log(`  País: ${jugador.paisNombre}`);
        console.log(`  Color de ficha: ${jugador.colorFicha}`);
        console.log(`  Dinero: $${jugador.dinero}`);
        console.log(`  Propiedades: ${jugador.propiedades.map(p => p.nombre).join(", ") || "Ninguna"}`);
        console.log(`  Hipotecas: ${jugador.hipotecas.map(p => p.nombre).join(", ") || "Ninguna"}`);
        console.log(`  Préstamos: ${jugador.prestamos.length}`);
        console.log(`  Puntaje: ${jugador.puntaje}`);

    });

    btnCargar.addEventListener("click", cargarTablero);

    btnCargar.addEventListener("click", cargarTablero);

    function cargarTablero() {
    fetch("http://127.0.0.1:5000/board") // 1. Llamo al backend para obtener las casillas
        .then((response) => response.json())
        .then((casillas) => {
            // Agrego una clase al tablero para marcar que ya se generó
            tablero.classList.add("tablero-generado");

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
                        ...casillas.right
                    ];

                    // Dibujamos todas las casillas dentro de "top"
                    recorrido.forEach(casilla => {
                        const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : '';
                        top.innerHTML += `
                          <div class="casilla ${casilla.color || ''}" id="${casilla.id}">
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
                        const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : '';
                        bottom.innerHTML += `<div class="casilla bottom ${casilla.color || ''}" id="${casilla.id}">
                            ${casilla.name}
                            ${precioHtml}
                        </div>`;
                    }

                    // Lado izquierdo (left) → también invertido
                    for (let casilla of casillas.left.slice().reverse()) {
                        const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : '';
                        left.innerHTML += `<div class="casilla left ${casilla.color || ''}" id="${casilla.id}">
                            ${casilla.name}
                            ${precioHtml}
                        </div>`;
                    }

                    // Lado superior (top) → orden natural
                    for (let casilla of casillas.top) {
                        const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : '';
                        top.innerHTML += `<div class="casilla top ${casilla.color || ''}" id="${casilla.id}">
                            ${casilla.name}
                            ${precioHtml}
                        </div>`;
                    }

                    // Lado derecho (right) → orden natural
                    for (let casilla of casillas.right) {
                        const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : '';
                        right.innerHTML += `<div class="casilla right ${casilla.color || ''}" id="${casilla.id}">
                            ${casilla.name}
                            ${precioHtml}
                        </div>`;
                    }
                }
            }

            /**
             *  Responsividad con `matchMedia`
             * `window.matchMedia("(max-width: 768px)")`
             * → devuelve un objeto que nos dice si el ancho actual de la pantalla
             * es menor o igual a 768px (true en móvil, false en PC).
             */
            const mediaQuery = window.matchMedia("(max-width: 768px)");
            console.log(mediaQuery);
            
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
      <p><strong>País:</strong> <span>${jugador.paisCodigo}</span> <img src="https://flagsapi.com/${jugador.paisCodigo}/shiny/64.png" alt="Bandera de ${jugador.paisNombre}" class="me-2"></p>
      <p><strong>Ficha:</strong> ${jugador.colorFicha}</p>
      <p><strong>Dinero:</strong> $${jugador.dinero}</p>
      <p><strong>Puntaje:</strong> ${jugador.puntaje ?? 0}</p>
      <p><strong>Propiedades:</strong> ${jugador.propiedades?.join(", ") || "Ninguna"}</p>
      <p><strong>Hipotecas:</strong> ${jugador.hipotecas?.join(", ") || "Ninguna"}</p>
      <p><strong>Préstamos:</strong> ${jugador.prestamos?.length || 0}</p>

    `;

            // Mostrar modal con Bootstrap
            $('#modalJugador').modal('show');
        }
    });

});
