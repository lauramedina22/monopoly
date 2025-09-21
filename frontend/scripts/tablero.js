document.addEventListener("DOMContentLoaded", function () {
  let btnCargar = document.getElementById("generarTablero");
  let tablero = document.getElementById("tablero");

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

        console.log(casillas);

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


});
