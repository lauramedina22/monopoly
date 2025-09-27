import { Propiedad } from "./Propiedad.js";

export class Ferrocarril extends Propiedad {
  constructor(data) {
    super(data);
    this.type = "railroad";
    this.railRent = data.rent || {};
  }

  // Anular construcción de casas/hoteles
  construirCasa() {
    console.warn("No se pueden construir casas en un ferrocarril.");
    // opcional: mostrarToast("No se pueden construir casas en un ferrocarril.");
  }

  construirHotel() {
    console.warn("No se pueden construir hoteles en un ferrocarril.");
    // opcional: mostrarToast("No se pueden construir hoteles en un ferrocarril.");
  }

  getRenta() {
    if (!this.dueno) return 0;
    const cantidad = this.dueno.propiedades.filter(
      (p) => p && p.type === "railroad"
    ).length;
    const rentValue =
      this.railRent[cantidad] ?? this.railRent[String(cantidad)];
    return Number.isFinite(rentValue) ? rentValue : 25;
  }
}
