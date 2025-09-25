export class Casilla {
  constructor(data) {
    // Atributos básicos del backend
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;

    // Propiedades de propiedad
    this.color = data.color || null;
    this.price = data.price || null;
    this.mortgage = data.mortgage || null;
    this.rent = data.rent || null;

    // Propiedades de acción (chance, comunidad, impuestos)
    this.action = data.action || null;
    // Atributos básicos de estado del juego
    this.dueno = null;           // Referencia al objeto Jugador propietario
  }

  // ToString básico
  toString() {
    let info = `${this.id} - ${this.name} (${this.type})`;
    if (this.price) info += ` - ${this.price}`;
    if (this.dueno) info += ` - Dueño: ${this.dueno.nombre}`;
    return info;
  }
}

