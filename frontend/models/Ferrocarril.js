// models/Ferrocarril.js
import { Propiedad } from "./Propiedad.js";

export class Ferrocarril extends Propiedad {
  constructor(data) {
    super(data); // reutiliza nombre, price, mortgage, etc.
    this.type = "railroad"; // forzar tipo correcto

    // Guardamos el mapa de rentas tal como viene del backend:
    // ejemplo: { "1":25, "2":50, "3":100, "4":200 }
    this.railRent = data.rent || {};
  }

  // Obtener renta para ferrocarril según cuántos ferrocarriles tiene el dueño
  getRenta() {
    if (!this.dueno) return 0;

    // contar solo propiedades que sean ferrocarril (type === "railroad")
    const cantidad = this.dueno.propiedades.filter(
      (p) => p && p.type === "railroad"
    ).length;

    // Intentar obtener la renta desde el mapa; clave puede ser número o string
    const rentValue =
      this.railRent[cantidad] ?? this.railRent[String(cantidad)];

    // Si no existe la clave, usar fallback (por compatibilidad)
    return Number.isFinite(rentValue) ? rentValue : 25;
  }

  pagarRenta(jugador) {
    const renta = this.getRenta();
    if (renta <= 0) return;

    if (jugador.dinero < renta) {
      // mostrar tu toast o manejar bancarrota
      console.warn(`${jugador.nombre} no tiene suficiente dinero para pagar la renta.`);
      return;
    }

    jugador.dinero -= renta;
    this.dueno.dinero += renta;
    // aquí puedes usar mostrarToast o console.log
    console.log(`${jugador.nombre} pagó $${renta} a ${this.dueno.nombre} por ${this.name}`);
  }

  toString() {
    return `Railroad ${this.name} | Precio: $${this.price} | Dueño: ${
      this.dueno ? this.dueno.nombre : "Nadie"
    }`;
  }
}
