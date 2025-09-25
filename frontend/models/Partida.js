import { Dado } from "./Dado.js";

export class Partida {
  constructor(jugadores = [], casillas = []) {
    this.jugadores = jugadores;   // Array de instancias de Jugador
    this.casillas = casillas;     // Array de instancias de Casilla
    this.dados = new Dado();      // Instancia de Dado
    this.turnoActual = 0;         // Índice del jugador que juega
    this.enJuego = true;          // Estado de la partida
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
    if (casilla.type === "property") {
      let propiedad = casilla.propiedad; // instancia de Propiedad ya asociada a la Casilla

      if (!propiedad.dueno) {
        propiedad.comprarPropiedad(jugador);
      } else if (propiedad.dueno !== jugador) {
        propiedad.cobrarRenta(jugador);
      } else {
        console.log(`${jugador.nombre} cayó en su propia propiedad`);
      }

    } else if (casilla.type === "railroad") {
      console.log(`${jugador.nombre} cayó en una casilla especial: ${casilla.nombre}`);
    }
  }
}
