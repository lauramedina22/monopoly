import { Casilla } from "./Casilla.js";

export class Impuesto extends Casilla {
  constructor(data) {
    super({
      id: data.id,
      name: data.name,
      type: "tax",
    });

    // Cantidad a descontar (siempre será negativa según backend)
    this.monto = data.action.money;
  }

  // Ejecutar acción cuando el jugador cae en esta casilla
  aplicarImpuesto(jugador) {
    jugador.dinero += this.monto; // 💡 Ojo: `this.monto` es negativo
    console.log(
      `${jugador.nombre} pagó $${Math.abs(this.monto)} en impuestos (${this.name}).`
    );
  }

  toString() {
    return `Casilla de impuesto: ${this.name} | Valor: $${Math.abs(
      this.monto
    )}`;
  }
}
