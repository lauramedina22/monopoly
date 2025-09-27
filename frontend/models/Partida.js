import { mostrarToast } from "../js/toast.js";
import { Dado } from "./Dado.js";

export class Partida {
  constructor(jugadores = [], casillas = []) {
    this.jugadores = jugadores; // Array de instancias de Jugador
    this.casillas = casillas; // Array de instancias de Casilla
    this.dados = new Dado(); // Instancia de Dado
    this.turnoActual = 0; // Índice del jugador que juega
    this.enJuego = true; // Estado de la partida
  }

  // Método para iniciar la partida
  iniciar() {
    console.log("¡La partida comienza!");
    this.mostrarJugadores();
    this.turno(); // arranca el primer turno
  }

  mostrarJugadores() {
    this.jugadores.forEach((j, i) => {
      console.log(`${i + 1}. ${j.nombre} inicia con $${j.dinero}`);
    });
  }

  // Ejecutar el turno de un jugador
  turno() {
    const jugador = this.jugadores[this.turnoActual];
    console.log(`\nTurno de ${jugador.nombre}`);

    const tirada = this.dados.lanzar();
    console.log(`${jugador.nombre} lanzó los dados: ${tirada.total}`);

    // mover jugador y obtener casilla donde cae
    jugador.mover(tirada.total, this.casillas.length);
    const casilla = this.casillas[jugador.posicion];

    // procesar casilla
    this.jugadorCaeEnCasilla(jugador, casilla);

    // Avanzar turno al siguiente jugador
    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
  }

  // Manejar qué pasa cuando un jugador cae en una casilla
  jugadorCaeEnCasilla(jugador, casilla) {
    switch (casilla.type) {
      case "property":
        if (!casilla.dueno) {
          console.log(
            `${jugador.nombre} cayó en ${casilla.name}, está libre por $${casilla.precio}.`
          );
          // 👀 Aquí NO se compra automáticamente, se deja la decisión al jugador
        } else if (casilla.dueno !== jugador) {
          let renta = casilla.getRenta();
          jugador.dinero -= renta;
          casilla.dueno.dinero += renta;
          console.log(
            `${jugador.nombre} pagó $${renta} a ${casilla.dueno.nombre}`
          );
        } else {
          console.log(`${jugador.nombre} cayó en su propia propiedad`);
        }
        break;

      case "railroad":
        console.log(
          `${jugador.nombre} cayó en una casilla especial: ${casilla.nombre}`
        );
        break;

      default:
        console.log(
          `${jugador.nombre} cayó en una casilla de tipo ${casilla.type}`
        );
    }
  }

  tirarDados(jugador, fichas) {
    const dado = Dado.lanzar().sumarDados();
    mostrarToast(
      `${jugador.nombre} ha sacado un ${Dado.dados[0]} y un ${Dado.dados[1]} (Total: ${dado})`
    );
    return jugador.mover(this.casillas.length, dado, fichas);
  }

  // Partida.js
  toString() {
    return `Partida con ${this.jugadores.length} jugadores y ${this.casillas.length} casillas.`;
  }
}
