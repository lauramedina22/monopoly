document.addEventListener("DOMContentLoaded", function () {
  let btnCargar = document.getElementById("generarTablero");
  let tablero = document.getElementById("tablero");

  btnCargar.addEventListener("click", cargarTablero);

  function cargarTablero() {
    fetch("http://127.0.0.1:5000/board")
      .then((response) => response.json())
      .then((casillas) => {
        console.log(casillas);
        console.log(Array.isArray(casillas));

        let tablero = document.getElementById("tablero");
        tablero.innerHTML = ""; // Limpiar el contenido previo del tablero

        for (let lado in casillas) {
          let seccion = casillas[lado];
          // Invertir orden solo para bottom y left
            if (lado === "bottom" || lado === "left") {
                seccion = seccion.slice().reverse();
            }

            if (lado === "top" || lado === "bottom" || lado === "left" ||lado === "right") {

            for (let casilla of seccion) {
              tablero.innerHTML += `
              <div class="casilla ${lado} ${casilla.color}">
                  ${casilla.name}
              </div>`;
            }
          }
        }
      });
  }
});
