import { Partida } from "./Partida.js";
import { Jugador } from "./Jugador.js";
import { Propiedad } from "./Propiedad.js";
import { Especial } from "./Especial.js"; // 👈 Importamos Especial

// 1. Crear jugadores
const j1 = new Jugador("Alice", "Colombia", "CO", "Rojo", 1500);
const j2 = new Jugador("Bob", "Perú", "PE", "Azul", 1500);

let casillas = [];

// 2. Crear una casilla de tipo propiedad
const casilla1 = new Propiedad( {
      "color": "purple",
      "id": 8,
      "mortgage": 50,
      "name": "Avenida Vermont",
      "price": 100,
      "rent": {
        "base": 6,
        "withHotel": 550,
        "withHouse": [
          30,
          90,
          270,
          400
        ]
      },
      "type": "property"
    });
casillas.push(casilla1);

const casilla2 = new Propiedad({
      "color": "purple",
      "id": 6,
      "mortgage": 50,
      "name": "Avenida Oriental",
      "price": 100,
      "rent": {
        "base": 6,
        "withHotel": 550,
        "withHouse": [
          30,
          90,
          270,
          400
        ]
      },
      "type": "property"
    });
casillas.push(casilla2);

const casilla3 = new Propiedad( {
      "color": "purple",
      "id": 9,
      "mortgage": 60,
      "name": "Avenida Connecticut",
      "price": 120,
      "rent": {
        "base": 8,
        "withHotel": 600,
        "withHouse": [
          40,
          100,
          300,
          450
        ]
      },
      "type": "property"
    });
casillas.push(casilla3);

const irCarcel = new Especial(
   {
      "action": {
        "goTo": "jail"
      },
      "id": 30,
      "name": "Ve a la C\u00e1rcel",
      "type": "special"
    },
);
casillas.push(irCarcel);

// 4. Crear partida
const partida = new Partida([j1, j2], casillas);

// 5. Simular turnos
console.log("\n=== Turno de Alice  ===");
partida.jugadorCaeEnCasilla(j1, casillas[0]); 
casillas[0].comprarPropiedad(j1); // Alice compra
console.log(j1.toString());

console.log("\n=== Turno de Bob  ===");
partida.jugadorCaeEnCasilla(j2, casillas[0]); // paga renta a Alice
console.log(j2.toString());

console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[1]);
casillas[1].comprarPropiedad(j1); // deberia comprarla
console.log(j1.toString());

console.log("\n=== Turno de Bob  ===");
partida.jugadorCaeEnCasilla(j2, casillas[3]); // debería estar enCarcel=true
console.log(j2.toString());

console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[2]);
casillas[2].comprarPropiedad(j1); // debería comprarla
console.log(j1.toString());

console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[1]); // debería comprarla
console.log(j1.toString());

console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[1]); // debería comprarla
console.log(j1.toString());

console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[1]); // debería comprarla
console.log(j1.toString());

console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[1]); // debería comprarla
console.log(j1.toString());

console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[1]); // debería comprarla
console.log(j1.toString());

console.log("\n=== Turno de Bob  ===");
partida.jugadorCaeEnCasilla(j2, casillas[1]); // paga renta a Alice
console.log(j2.toString());


// 6. Estado final
console.log("\n=== Estado final ===");
console.log(j1.toString());
console.log(j2.toString());
