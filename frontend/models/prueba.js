import { Partida } from "./Partida.js";
import { Jugador } from "./Jugador.js";
import { Propiedad } from "./Propiedad.js";
import { Impuesto } from "./Impuesto.js";
import { Railroad } from "./Ferrocarril.js";

// 1. Crear jugadores
const j1 = new Jugador("Alice", "Colombia", "CO", "Rojo", 1500);
const j2 = new Jugador("Bob", "Perú", "PE", "Azul", 1500);
let casillas = [];

// 2. Crear una casilla de tipo propiedad
const casilla1 = new Propiedad({
  id: 1,
  type: "property",
  name: "Mediterranean Avenue",
  price: 60,
  mortgage: 30,
  color: "morado",
  rent: {
    base: 2,
    withHouse: [10, 30, 90, 160],
    withHotel: 250,
  },
});
casillas.push(casilla1);

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
const partida = new Partida([j1, j2], casillas);

// 4. Simular turnos
console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[0]); 
// Decisión: comprar
casillas[0].comprarPropiedad(j1);

console.log(j1.toString()); // <-- debería mostrar Mediterranean Avenue

console.log(casillas)


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
