// Especial.js
import { Casilla } from "./Casilla.js";

export class Especial extends Casilla {
    constructor(data) {
        super(data);
        this.action = data.action || null;  // acciones definidas en tu JSON
    }

    ejecutarAccion(jugador) {
        if (!this.action) {
            console.log(`${jugador.nombre} está en ${this.name}. No ocurre nada especial.`);
            return;
        }

        if (this.action.money) {
            jugador.dinero += this.action.money;
            console.log(
                `${jugador.nombre} recibe $${Math.abs(this.action.money)} en ${this.name}`
            );
        }

        if (this.action.goTo === "jail") {
            jugador.enCarcel = true;
            jugador.turnosCarcel = 3;
            jugador.posicion = 10;

            console.log(`${jugador.nombre} va directo a la CÁRCEL. Pierde turnos hasta que salga.`);
        }


    }

}
