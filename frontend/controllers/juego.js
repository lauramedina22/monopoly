import { Partida } from "../models/Partida.js";
import { Jugador } from "../models/Jugador.js";
import  Casilla from "../models/Casilla.js";

document.addEventListener("DOMContentLoaded", () => {
    let btnCargar = document.getElementById("generarTablero");
    let tablero = document.getElementById("tablero");
    // 1. Recuperar jugadores desde localStorage
    let jugadoresGuardados = JSON.parse(localStorage.getItem("jugadores")) || [];

    // Convertirlos de nuevo en objetos Jugador
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

    function cargarTablero() {
        fetch("http://127.0.0.1:5000/board")
            .then((response) => response.json())
            .then((casillas) => {
                // let tablero = document.getElementById("tablero");

                tablero.classList.add("tablero-generado");

                // Primero voy a arreglar el problema de disparidad que tengo en las listas
                let primeraCasillaIzquierda = casillas.left.pop();
                casillas.top.unshift(primeraCasillaIzquierda);

                let ultimaCasillaIzquierda = casillas.left.shift();
                casillas.bottom.push(ultimaCasillaIzquierda);

                // Creo los contenedores por cada lado 

                /* Preguntar que es mejor, crear los divs por JS o tenerlos ya en el HTML y solo llenarlos
                const top = document.createElement("div");
                top.id = "top";
                top.classList.add("fila");
                tablero.appendChild(top);
        
                console.log(top);
        
                const left = document.createElement("div");
                left.id = "left";
                left.classList.add("columna");
                tablero.appendChild(left);
        
                const right = document.createElement("div");
                right.id = "right";
                right.classList.add("columna");
                tablero.appendChild(right);
        
                const bottom = document.createElement("div");
                bottom.id = "bottom";
                bottom.classList.add("fila");
                tablero.appendChild(bottom); 
                */

                // Opcion de llenarlos

                const top = document.getElementById("top");
                const left = document.getElementById("left");
                const right = document.getElementById("right");
                const bottom = document.getElementById("bottom");

                // Limpiar el tablero
                top.innerHTML = "";
                left.innerHTML = "";
                right.innerHTML = "";
                bottom.innerHTML = "";


                // Renderizo el tablero por cada lado 
                for (let casilla of casillas.top) {
                    const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : ''; // Si tiene precio, lo muestro y lo mismo con los demas
                    top.innerHTML += `<div class="casilla top ${casilla.color || ''}" id="${casilla.id}">
            ${casilla.name}
            ${precioHtml}
          </div>`;
                }

                for (let casilla of casillas.bottom.slice().reverse()) {
                    const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : '';
                    bottom.innerHTML += `<div class="casilla bottom ${casilla.color || ''}" id="${casilla.id}">
            ${casilla.name}
            ${precioHtml}
          </div>`;
                }

                for (let casilla of casillas.left.slice().reverse()) {
                    const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : '';
                    left.innerHTML += `<div class="casilla left ${casilla.color || ''}" id="${casilla.id}">
            ${casilla.name}
            ${precioHtml}
          </div>`;
                }

                for (let casilla of casillas.right) {
                    const precioHtml = casilla.price ? `<p>$${casilla.price}</p>` : '';
                    right.innerHTML += `<div class="casilla right ${casilla.color || ''}" id="${casilla.id}">
            ${casilla.name}
            ${precioHtml}
          </div>`;
                }
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
      <p><strong>País:</strong> <span>${jugador.paisNombre}</span> <img src="https://flagsapi.com/${jugador.paisCodigo}/shiny/64.png" alt="Bandera de ${jugador.paisNombre}" class="me-2"></p>
      <p><strong>Ficha:</strong> ${jugador.colorFicha}</p>
      <p><strong>Dinero:</strong> $${jugador.dinero}</p>
      <p><strong>Puntaje:</strong> ${jugador.puntaje ?? 0}</p>
      <p><strong>Propiedades:</strong> ${jugador.propiedades?.join(", ") || "Ninguna"}</p>
    `;

            // Mostrar modal con Bootstrap
            $('#modalJugador').modal('show');
        }
    });

});
