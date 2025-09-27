import { Propiedad } from "./Propiedad.js";

export class Ferrocarril extends Propiedad {
  constructor(data) {
    super(data); // reutilizamos name, price, mortgage, rent...
    this.type = "railroad"; // forzar tipo
  }

  getRenta() {
    if (!this.dueno) return 0;

    // Contar cuántos railroads tiene el mismo dueño
    const cantidad = this.dueno.propiedades.filter(
      (p) => p.type === "railroad"
    ).length;

    // Tabla de rentas
    const rentas = [25, 50, 100, 200];

    // Proteger que cantidad no se salga del arreglo
    return rentas[cantidad - 1] || 25;
  }

  toString() {
    return `Railroad ${this.name} | Precio: $${this.price} | Dueño: ${
      this.dueno ? this.dueno.nombre : "Nadie"
    }`;
  }
}
