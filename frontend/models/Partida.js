
import { Dado } from "./Dado.js";


export class Partida {
  constructor(jugadores = []) {
    this.jugadores = jugadores;   // Array de instancias de Jugador
    this.dados = new Dado();     // Instancia de Dados
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
      console.log(`${i+1}. ${j.nombre} inicia con $${j.dinero}`);
    });
  }

  // Ejecutar turno de un jugador
  turno() {
    const jugador = this.jugadores[this.turnoActual];
    console.log(`\nTurno de ${jugador.nombre}`);

    const tirada = this.dados.lanzar();
    console.log(`${jugador.nombre} lanzó los dados: ${tirada.total}`);

    jugador.mover(tirada.total, this.tablero);

    // Avanzar turno al siguiente jugador
    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
  }
}

