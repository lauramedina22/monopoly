import { Casilla } from "./Casilla.js";

export class Propiedad extends Casilla {
  constructor(data) {
    super({
      id: data.id,
      name: data.name,
      type: "property", // fijo para esta clase
    });

    this.color = data.color;
    this.price = data.price;
    this.mortgage = data.mortgage;

    // Rentas
    this.rentaBase = data.rent.base;
    this.rentasCasas = data.rent.withHouse; // [1c, 2c, 3c, 4c]
    this.rentaHotel = data.rent.withHotel;

    // Estado de construcción
    this.casas = 0;
    this.hotel = false;
  }

  // Comprar la propiedad
  comprarPropiedad(jugador) {
    if (this.dueno) {
      console.log(`${this.name} ya tiene dueño.`);
      return false;
    }

    if (jugador.dinero < this.precio) {
      console.log(`${jugador.nombre} no tiene suficiente dinero para comprar ${this.name}`);
      return false;
    }

    jugador.dinero -= this.precio;
    jugador.propiedades.push(this);
    this.dueno = jugador;

    console.log(`${jugador.nombre} compró la propiedad ${this.name}`);
    return true;
  }

  // Obtener renta actual
  getRenta() {
    if (this.hotel) return this.rentaHotel;
    if (this.casas > 0) return this.rentasCasas[this.casas - 1];
    return this.rentaBase;
  }

  // Comprar una casa
  comprarCasa(jugador) {
    if (!this.puedeComprarCasa(jugador)) {
      console.log(`${jugador.nombre} no puede comprar casa en ${this.name}`);
      return false;
    }

    jugador.dinero -= 100; // 💡 después lo hacemos dinámico según color
    this.casas++;
    console.log(`${jugador.nombre} compró una casa en ${this.name} (total casas: ${this.casas})`);
    return true;
  }

  puedeComprarCasa(jugador) {
    if (this.dueno !== jugador) return false;

    // Debe tener todas las propiedades del mismo color
    let todasDelColor = jugador.propiedades.filter(p => p.color === this.color).length >= 2; 
    // (luego ajustamos según grupo de color real)

    if (this.hotel) return false;
    if (this.casas >= 4) return false;
    if (jugador.dinero < 100) return false;

    return todasDelColor;
  }

  comprarHotel(jugador) {
    if (!this.puedeComprarHotel(jugador)) {
      console.log(`${jugador.nombre} no puede comprar hotel en ${this.name}`);
      return false;
    }

    jugador.dinero -= 250;
    this.casas = 0;
    this.hotel = true;

    console.log(`${jugador.nombre} compró un hotel en ${this.name}`);
    return true;
  }

  puedeComprarHotel(jugador) {
    if (this.dueno !== jugador) return false;
    if (this.hotel) return false;
    if (this.casas < 4) return false;
    if (jugador.dinero < 250) return false;
    return true;
  }

  toString() {
    let duenoNombre = this.dueno ? this.dueno.nombre : "Nadie";
    return `Propiedad ${this.name} (${this.color}) | Precio: $${this.precio} | Dueño: ${duenoNombre}`;
  }
}
