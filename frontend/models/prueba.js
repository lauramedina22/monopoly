import { Partida } from "./Partida.js";
import { Jugador } from "./Jugador.js";
import { Propiedad } from "./Propiedad.js";

// 1. Crear jugadores
const j1 = new Jugador("Alice", "Colombia", "CO", "Rojo", 1500);
const j2 = new Jugador("Bob", "Perú", "PE", "Azul", 1500);
let casillas = []

// 2. Crear algunas casillas de prueba
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
    withHotel: 250
  },
  dueno: null
});
casillas.push(casilla1);

// 3. Crear partida con los jugadores
const partida = new Partida([j1, j2], casillas);

// 4. Simular un turno (ejemplo forzado)
console.log("\n=== Turno de Alice ===");
partida.jugadorCaeEnCasilla(j1, casillas[0]); // Alice cae en la propiedad 1
casilla1.comprarPropiedad(j1); // Alice la compra

console.log("\n=== Turno de Bob ===");
partida.jugadorCaeEnCasilla(j2, casillas[0]);// Bob cae en la propiedad de Alice
// Aquí se debería disparar la renta automáticamente

console.log("\n=== Estado final ===");
console.log(j1.toString());
console.log(j2.toString());
console.log(casilla1.toString());


// LOGRAR QUE SE RESTE EL DINERO Y QUE SE ACTUALICE EL DUEÑO
