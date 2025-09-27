import { Casilla } from "./Casilla.js";

export class Cofre extends Casilla {
  constructor(data, deck) {
    super(data);
    this.deck = deck; // referencia al mazo de cartas
  }

  ejecutar(jugador) {
    const carta = this.deck[Math.floor(Math.random() * this.deck.length)];
    console.log(`${jugador.nombre} sacó: ${carta.description}`);
    carta.aplicar(jugador);
  }
}
