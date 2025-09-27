import { Casilla } from "./Casilla.js";
import { mostrarToast } from "../controllers/toast.js";

export class Propiedad extends Casilla {
  constructor(data) {
    super({
      id: data.id,
      name: data.name,
      type: "property",
      dueno: data.dueno // fijo para esta clase
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

    if (jugador.dinero < this.price) {
      console.log(`${jugador.nombre} no tiene suficiente dinero para comprar ${this.name}`);
      return false;
    }

    jugador.dinero -= this.price;
    jugador.propiedades.push(this);
    this.dueno = jugador;

    console.log(`${jugador.nombre} compró la propiedad ${this.name}`);
    this.marcarColorDueño();

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
    console.log(
      `${jugador.nombre} compró una casa en ${this.name} (total casas: ${this.casas})`
    );
    this.actualizarConstrucciones();
    return true;
  }

  puedeComprarCasa(jugador) {
    if (this.dueno !== jugador) return false;

    // Debe tener todas las propiedades del mismo color
    let todasDelColor =
      jugador.propiedades.filter((p) => p.color === this.color).length >= 2;
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
    this.actualizarConstrucciones();
    return true;
  }

  puedeComprarHotel(jugador) {
    if (this.dueno !== jugador) return false;
    if (this.hotel) return false;
    if (this.casas < 4) return false;
    if (jugador.dinero < 250) return false;
    return true;
  }

  PagarRenta(jugador) {
    if (!this.dueno) {
      mostrarToast(`${this.name} no tiene dueño, no se paga renta.`);
      return;
    }

    if (this.dueno === jugador) {
      mostrarToast(
        `${jugador.nombre} es el dueño de ${this.name}, no paga renta.`
      );
      return;
    }

    if (jugador.hipotecas.includes(this)) {
      mostrarToast(
        `${jugador.nombre} tiene hipoteca en ${this.name}, no paga renta.`
      );
      return;
    }

    const renta = this.getRenta();
    if (jugador.dinero < renta) {
      mostrarToast(
        `${jugador.nombre} no tiene suficiente dinero para pagar la renta de ${this.name}`
      );

      // Aquí se podría implementar lógica de bancarrota o venta de propiedades
      return;
    }

    jugador.dinero -= renta;
    this.dueno.dinero += renta;
    mostrarToast(
      `${jugador.nombre} pagó $${renta} de renta a ${this.dueno.nombre} por ${this.name}`
    );
  }

  hipotecar(jugador) {
    if (this.dueno !== jugador) {
      mostrarToast(`${jugador.nombre} no es el dueño de ${this.name}`);
      return;
    }

    this.dueno = null;
    jugador.hipotecas.push(this);
    mostrarToast(
      `${jugador.nombre} hipotecó ${this.name} por $${this.mortgage}`
    );
    jugador.dinero += this.mortgage;
    return;
  }

  deshipotecar(jugador) {
    if (!jugador.hipotecas.includes(this)) {
      mostrarToast(`${this.name} no está hipotecada por ${jugador.nombre}`);
      return;
    }

    jugador.hipotecas = jugador.hipotecas.filter((p) => p !== this);
    jugador.dinero -= Math.round(this.mortgage * 1.1); // 10% de interés
    this.dueno = jugador;
    mostrarToast(
      `${jugador.nombre} deshipotecó ${this.name} por $${Math.round(
        this.mortgage * 1.1
      )}`
    );
  }


  marcarColorDueño() {
    const casillaDiv = document.getElementById(this.id);
    console.log("Div:", casillaDiv);

    casillaDiv.classList.remove(
      "brown",
      "purple",
      "pink",
      "orange",
      "red",
      "yellow",
      "green",
      "blue"
    );


    // Quitar posibles clases de colores de jugador anteriores
    casillaDiv.classList.remove(
      "propietario-rojo",
      "propietario-verde",
      "propietario-azul",
      "propietario-amarillo"
    );

    // Añadir clase según color del jugador
    const clase = `propietario-${this.dueno.colorFicha.toLowerCase()}`;
    casillaDiv.classList.add(clase);
    console.log("Clase a agregar:", { clase });

  }

  actualizarConstrucciones() {
    const casillaDiv = document.getElementById(this.id);
    if (!casillaDiv) return;

    // Si no existe el contenedor, lo creamos
    let construccionesDiv = casillaDiv.querySelector(".construcciones");
    if (!construccionesDiv) {
      construccionesDiv = document.createElement("div");
      construccionesDiv.classList.add("construcciones");
      casillaDiv.appendChild(construccionesDiv);
    }

    // Limpiar lo que haya
    construccionesDiv.innerHTML = "";

    // Si tiene hotel, mostramos solo hotel
    if (this.hotel) {
      const hotelIcon = document.createElement("i");
      hotelIcon.classList.add("fa-solid", "fa-hotel", "hotel-icon", "fa-2x");
      construccionesDiv.appendChild(hotelIcon);
      return;
    }

    for (let i = 0; i < this.casas; i++) {
      const casaIcon = document.createElement("i");
      casaIcon.classList.add("fa-solid", "fa-house", "casa-icon", "fa-lg");
      construccionesDiv.appendChild(casaIcon);
    }
  }

  toString() {
    let duenoNombre = this.dueno ? this.dueno.nombre : "Nadie";
    return `Propiedad ${this.name} (${this.color}) | Precio: $${this.price} | Dueño: ${duenoNombre}`;
  }
}
