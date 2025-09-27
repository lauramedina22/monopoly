import { Partida } from "./Partida.js";
import { Jugador } from "./Jugador.js";
import { Propiedad } from "./Propiedad.js";
<<<<<<< HEAD
import { Especial } from "./Especial.js"; // 👈 Importamos Especial
=======
import { Impuesto } from "./Impuesto.js";
import { Railroad } from "./Ferrocarril.js";
>>>>>>> 406dc296cabeed92a9d04ff2b7bfe6a5427c2419

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

<<<<<<< HEAD
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
=======
const casillaTax = new Impuesto({
  id: 4,
  name: "Impuesto sobre ingresos",
  type: "tax",
  action: {
    money: -200
  }
});

const railroad1 = new Railroad({
  id: 5,
  name: "Ferrocarril Reading",
  type: "railroad",
  price: 200,
  mortgage: 100,
  rent: {
    1: 25,
    2: 50,
    3: 100,
    4: 200
  }
});

casillas.push(railroad1);

casillas.push(casillaTax);

// 3. Crear partida
>>>>>>> 406dc296cabeed92a9d04ff2b7bfe6a5427c2419
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

console.log(casillas)


<<<<<<< HEAD
// 6. Estado final
console.log("\n=== Estado final ===");
console.log(j1.toString());
console.log(j2.toString());
=======
console.log("\n=== Turno de Bob ===");
partida.jugadorCaeEnCasilla(j2, casillas[0]); // paga renta porque Alice es dueña

partida.jugadorCaeEnCasilla(j2, casillas[1]); // paga impuesto
//casillas[1].aplicarImpuesto(j2); // Bob paga el impuesto


// 5. Estado final
console.log("\n=== Estado final ===");
console.log(j1.toString());
console.log(j2.toString());
console.log(casilla1.toString());

// Simulación: Alice cae en el ferrocarril y lo compra
console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, railroad1);
railroad1.comprarPropiedad(j1);
console.log(j1.toString());

// Bob cae en el mismo railroad → paga renta
console.log("\n=== Turno de Bob ===");
partida.jugadorCaeEnCasilla(j2, railroad1);

console.log(j2.toString());
console.log(j1.toString());

partida.jugadorCaeEnCasilla(j1, );
>>>>>>> 406dc296cabeed92a9d04ff2b7bfe6a5427c2419
