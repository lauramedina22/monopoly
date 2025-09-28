import { mostrarToast } from "../controllers/toast.js";
import { mostrarModalCasilla } from "../controllers/modalCasilla.js";
import { Dado } from "./Dado.js";
import { CofreComunidad } from "./CofreComunidad.js";
import { Propiedad } from "./Propiedad.js";

export class Partida {
  constructor(jugadores = [], casillas = []) {
    this.jugadores = jugadores; // Array de instancias de Jugador
    this.fichas = {}; // Mapa de fichas por jugador
    this.casillas = casillas; // Array de instancias de Casilla
    this.dado = Dado; // Instancia de Dado
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

  sincronizarJugadores() {
    const jugadoresParaGuardar = this.jugadores.map((jugador) => ({
      nombre: jugador.nombre,
      paisNombre: jugador.paisNombre,
      paisCodigo: jugador.paisCodigo,
      colorFicha: jugador.colorFicha,
      dinero: jugador.dinero,
      puntaje: jugador.puntaje,
      propiedades: jugador.propiedades.map((prop) => ({
        id: prop.id,
        name: prop.name,
        price: prop.price,
        casas: prop.casas,
        hotel: prop.hotel,
        hipotecada: prop.hipotecada,
      })),
      hipotecas: jugador.hipotecas.map((prop) => ({
        id: prop.id,
        name: prop.name,
        price: prop.price,
      })),
      prestamos: jugador.prestamos,
      posicion: jugador.posicion,
    }));
    localStorage.setItem("jugadores", JSON.stringify(jugadoresParaGuardar));
  }

  // Ejecutar el turno de un jugador
  turno() {
    const jugador = this.jugadores[this.turnoActual];
    this.tirarDados(jugador);
    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
  }

  // Manejar qué pasa cuando un jugador cae en una casilla
  jugadorCaeEnCasilla(jugador, casilla) {
    console.log("DEBUG casilla.type:", casilla.type, typeof casilla.type);
    switch (casilla.type) {
      case "property":
        if (!casilla.dueno) {
          mostrarModalCasilla(casilla, jugador);
        } else if (casilla.dueno !== jugador && !casilla.hipotecada) {
          let renta = casilla.getRenta();
          jugador.dinero -= renta;
          casilla.dueno.dinero += renta;
          mostrarToast(
            `${jugador.nombre} pagó $${renta} a ${casilla.dueno.nombre}`,
          );
        } else if (casilla.dueno !== jugador && casilla.hipotecada) {
          mostrarToast(
            `La propiedad ${casilla.name} está hipotecada, no se paga renta.`,
          );
        } else {
          mostrarToast(`${jugador.nombre} cayó en su propia propiedad`);
          mostrarModalCasilla(casilla, jugador);
        }
        break;

      case "railroad":
        if (!casilla.dueno) {
          mostrarModalCasilla(casilla, jugador);
        } else if (casilla.dueno !== jugador && !casilla.hipotecada) {
          let renta = casilla.getRenta();
          jugador.dinero -= renta;
          casilla.dueno.dinero += renta;
          mostrarToast(
            `${jugador.nombre} pagó $${renta} a ${casilla.dueno.nombre}`,
          );
        } else if (casilla.dueno !== jugador && casilla.hipotecada) {
          mostrarToast(
            `El ferrocarril ${casilla.name} está hipotecada, no se paga renta.`,
          );
        } else {
          mostrarToast(`${jugador.nombre} cayó en su propio ferrocarril`);
          mostrarModalCasilla(casilla, jugador);
        }
        break;

      case "tax":
        casilla.aplicarImpuesto(jugador);
        mostrarToast(`${jugador.nombre} pagó impuesto de $${casilla.monto}`);
        break;

      case "community_chest":
        const randomIndex = Math.floor(
          Math.random() * this.communityChestDeck.length,
        );
        const carta = this.communityChestDeck[randomIndex];
        mostrarToast(`${jugador.nombre} sacó: ${carta.description}`);
        carta.aplicar(jugador);
        break;

      case "chance":
        const randomChanceIndex = Math.floor(
          Math.random() * this.chancesDeck.length,
        );
        const cartaSorpresa = this.chancesDeck[randomChanceIndex];
        console.log(`${jugador.nombre} sacó: ${cartaSorpresa.description}`);
        const montoSorpresa = cartaSorpresa.aplicar(jugador);
        mostrarToast(`${jugador.nombre} sacó: ${cartaSorpresa.description}`);
        break;

      default:
        mostrarToast(
          `${jugador.nombre} cayó en una casilla de tipo ${casilla.type}`,
        );
    }
    this.sincronizarJugadores();
  }

  posicionarFichaEnCasilla(ficha, casillaElem) {
    console.log(casillaElem);
    let contenedor = casillaElem.querySelector(".ficha-container");
    if (!contenedor) {
      contenedor = document.createElement("div");
      contenedor.className = "ficha-container";
      casillaElem.style.position = "relative";
      casillaElem.appendChild(contenedor);
    }
    if (ficha.parentElement && ficha.parentElement !== contenedor) {
      ficha.parentElement.removeChild(ficha);
    }
    // Añade la ficha al contenedor de la casilla
    if (!contenedor.contains(ficha)) {
      contenedor.appendChild(ficha);
    }
  }

  tirarDados(jugador) {
    const total = this.dado.lanzar().sumarDados();

    if (this.casillas.length === 0) {
      mostrarToast("Error: No hay casillas definidas en la partida.");
      return;
    }

    mostrarToast(
      `${jugador.nombre} ha sacado un ${Dado.dados[0]} y un ${Dado.dados[1]} (Total: ${total})`,
    );

    const nuevaPos = jugador.mover(this.casillas.length, total);
    const casillaElem = document.getElementById(nuevaPos);

    this.posicionarFichaEnCasilla(this.fichas[jugador.nombre], casillaElem);

    const casilla = this.casillas[nuevaPos];
    console.log("DEBUG casilla destino:", nuevaPos, casilla);
    this.jugadorCaeEnCasilla(jugador, casilla);
  }

  toString() {
    return `Partida con ${this.jugadores.length} jugadores y ${this.casillas.length} casillas.`;
  }
}