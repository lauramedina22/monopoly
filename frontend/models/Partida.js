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
    let resultado = { accion: null, mensaje: "" };

    switch (casilla.type) {
      case "property":
        if (!casilla.dueno) {
          resultado.accion = "comprarPropiedad";
          resultado.mensaje = `${jugador.nombre} cayó en ${casilla.name}, está libre por $${casilla.price}.`;
        } else if (casilla.dueno !== jugador) {
          let renta = casilla.getRenta();
          jugador.dinero -= renta;
          casilla.dueno.dinero += renta;

          resultado.accion = "pagarRenta";
          resultado.mensaje = `${jugador.nombre} pagó $${renta} a ${casilla.dueno.nombre}`;
        } else {
          resultado.mensaje = `${jugador.nombre} cayó en su propia propiedad`;

          if (casilla.puedeComprarCasa(jugador)) {
            resultado.accion = "comprarCasa";
          } else if (casilla.puedeComprarHotel(jugador)) {
            resultado.accion = "comprarHotel";
          } else {
            resultado.accion = "nada";
          }
        }
        break;

      case "railroad":
        resultado.accion = "especial";
        resultado.mensaje = `${jugador.nombre} cayó en ${casilla.name} (ferrocarril)`;
        break;

      case "special":
        casilla.ejecutarAccion(jugador);
        resultado.accion = "especial";
        resultado.mensaje = `${jugador.nombre} ejecutó acción especial en ${casilla.name}`;
        break;

      default:
        resultado.accion = "nada";
        resultado.mensaje = `${jugador.nombre} cayó en una casilla de tipo ${casilla.type}`;
    }

    return resultado;
  }


  // Partida.js
  toString() {
    return `Partida con ${this.jugadores.length} jugadores y ${this.casillas.length} casillas.`;
  }

}
